const assert = require("node:assert/strict");
const test = require("node:test");
const { createDocument, createStorage, createWindow, runScript } = require("./memory-test-helpers");

function backupHarness(initial = {}, options = {}) {
    const storage = createStorage(initial, options);
    const document = createDocument();
    const window = { ...createWindow(), localStorage: storage };
    const api = runScript("js/memoryBackup.js", {
        Date,
        JSON,
        Object,
        Set,
        TextEncoder,
        document,
        window
    }, "window.MakerlandMemoryBackup");
    return { api, storage };
}

const DATE = new Date("2026-10-24T12:00:00.000Z");

test("sauvegarde V1 : un stockage vide produit un format portable valide sans écriture", () => {
    const { api, storage } = backupHarness();
    const prepared = api.prepareBackup({ storage, now: DATE });

    assert.equal(prepared.backup.format, "makerland-backup-v1");
    assert.equal(prepared.backup.version, 1);
    assert.equal(prepared.backup.createdAt, DATE.toISOString());
    assert.deepEqual([...prepared.backup.savedKeys], []);
    assert.equal(JSON.stringify(prepared.backup.memories), "{}");
    assert.equal(api.validateBackup(JSON.parse(prepared.serialized)), true);
    assert.equal(storage.calls.set, 0);
    assert.equal(storage.calls.remove, 0);
});

test("sauvegarde V1 : conserve exactement les valeurs brutes, y compris une mémoire invalide", () => {
    const narrativeRaw = '{"legacy":true,"unknown":{"kept":1}}';
    const brokenRaw = "{corrompu";
    const { api, storage } = backupHarness({
        "makerland.narrativeMemory.v1": narrativeRaw,
        "makerland.firstJourney": brokenRaw,
        "foreign.application.preference": "ne jamais exporter"
    });
    const beforeNarrative = storage.value("makerland.narrativeMemory.v1");
    const beforeJourney = storage.value("makerland.firstJourney");
    const prepared = api.prepareBackup({ storage, now: DATE });

    assert.equal(prepared.backup.memories["makerland.narrativeMemory.v1"], narrativeRaw);
    assert.equal(prepared.backup.memories["makerland.firstJourney"], brokenRaw);
    assert.equal(Object.hasOwn(prepared.backup.memories, "foreign.application.preference"), false);
    assert.equal(JSON.stringify(prepared.backup.warnings), JSON.stringify([{ key: "makerland.firstJourney", code: "invalid-json-preserved" }]));
    assert.equal(storage.value("makerland.narrativeMemory.v1"), beforeNarrative);
    assert.equal(storage.value("makerland.firstJourney"), beforeJourney);
    assert.equal(storage.calls.set, 0);
    assert.equal(storage.calls.remove, 0);
});

test("sauvegarde V1 : inclut les souvenirs personnels pris en charge et exclut les compteurs techniques", () => {
    const { api, storage } = backupHarness({
        "makerland_stories": '[{"id":1,"text":"Texte personnel"}]',
        "makerland.guardianEncounters.v1": '{"encounters":[]}',
        "makerland_views_livre-test": "9",
        "makerland_clicks_livre-test": "3"
    });
    const prepared = api.prepareBackup({ storage, now: DATE });

    assert.equal(prepared.backup.memories.makerland_stories, '[{"id":1,"text":"Texte personnel"}]');
    assert.equal(prepared.backup.memories["makerland.guardianEncounters.v1"], '{"encounters":[]}');
    assert.equal(Object.hasOwn(prepared.backup.memories, "makerland_views_livre-test"), false);
    assert.equal(Object.hasOwn(prepared.backup.memories, "makerland_clicks_livre-test"), false);
});

test("sauvegarde V1 : une lecture indisponible refuse la préparation sans modifier la mémoire", () => {
    const { api, storage } = backupHarness({ "makerland.firstJourney": '{"completed":true}' }, { throwOnGet: true });

    assert.throws(() => api.prepareBackup({ storage, now: DATE }), /Lecture impossible/);
    assert.equal(storage.value("makerland.firstJourney"), '{"completed":true}');
    assert.equal(storage.calls.set, 0);
    assert.equal(storage.calls.remove, 0);
});

test("sauvegarde V1 : un fichier trop volumineux est refusé avant téléchargement", () => {
    const { api, storage } = backupHarness({
        "makerland_stories": "x".repeat(apiSizeHint())
    });

    assert.throws(() => api.prepareBackup({ storage, now: DATE }), /dépasse la taille portable maximale/);
    assert.equal(storage.calls.set, 0);
    assert.equal(storage.calls.remove, 0);
});

test("sauvegarde V1 : le validateur refuse une clé hors registre et un schéma incompatible", () => {
    const { api, storage } = backupHarness({ "makerland.firstJourney": "{}" });
    const { backup } = api.prepareBackup({ storage, now: DATE });
    const foreign = { ...backup, savedKeys: [...backup.savedKeys, "foreign.key"], memories: { ...backup.memories, "foreign.key": "x" } };
    const wrongVersion = { ...backup, version: 2 };

    assert.equal(api.validateBackup(foreign), false);
    assert.equal(api.validateBackup(wrongVersion), false);
});

function apiSizeHint() {
    return 4 * 1024 * 1024;
}
