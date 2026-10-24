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

function importHarness(initial = {}, storage = createStorage(initial)) {
    const document = createDocument();
    const window = { ...createWindow(), localStorage: storage };
    const context = { Date, JSON, Object, Set, TextEncoder, document, window };
    runScript("js/memoryBackup.js", context, "window.MakerlandMemoryBackup");
    const api = runScript("js/memoryImport.js", context, "window.MakerlandMemoryImport");
    return { api, storage };
}

function validBackup(values, now = DATE) {
    const { api, storage } = backupHarness(values);
    return api.prepareBackup({ storage, now }).backup;
}

test("import V1 : restaure exactement les chaînes brutes sans supprimer les clés absentes ou étrangères", () => {
    const backup = validBackup({
        "makerland.firstJourney": '{"completed":true,"unknown":"préserver"}',
        "makerland:living-cycle": "{invalide"
    });
    const { api, storage } = importHarness({
        "makerland.firstJourney": '{"completed":false}',
        "makerland.narrativeMemory.v1": '{"absente-du-fichier":true}',
        "foreign.site": "intact"
    });
    const inspection = api.inspectImport(backup, { storage });
    const result = api.applyImport(inspection, { storage, now: DATE });

    assert.equal(result.ok, true);
    assert.equal(storage.value("makerland.firstJourney"), backup.memories["makerland.firstJourney"]);
    assert.equal(storage.value("makerland:living-cycle"), "{invalide");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), '{"absente-du-fichier":true}');
    assert.equal(storage.value("foreign.site"), "intact");
    assert.equal(api.getRecoveryStatus({ storage }).journal.status, "available");
});

test("import V1 : refuse JSON, versions, registre, types et taille incompatibles avant toute écriture", () => {
    const { api, storage } = importHarness({ "makerland.firstJourney": "avant" });
    const backup = validBackup({ "makerland.firstJourney": "après" });
    const wrongRegistry = { ...backup, supportedKeys: [...backup.supportedKeys].reverse() };
    const wrongType = { ...backup, memories: { ...backup.memories, "makerland.firstJourney": 4 } };

    assert.throws(() => api.parseBackupText("{non json"), /JSON Makerland/);
    assert.throws(() => api.parseBackupText("x".repeat(4 * 1024 * 1024 + 1)), /dépasse/);
    assert.throws(() => api.inspectImport({ ...backup, version: 2 }, { storage }), /compatible/);
    assert.throws(() => api.inspectImport(wrongRegistry, { storage }), /compatible/);
    assert.throws(() => api.inspectImport(wrongType, { storage }), /compatible/);
    assert.equal(storage.value("makerland.firstJourney"), "avant");
    assert.equal(storage.value(api.RECOVERY_KEY), null);
});

test("import V1 : annule la restauration lorsque le stockage change après la prévisualisation", () => {
    const backup = validBackup({ "makerland.firstJourney": "fichier" });
    const { api, storage } = importHarness({ "makerland.firstJourney": "avant" });
    const inspection = api.inspectImport(backup, { storage });
    storage.setItem("makerland.firstJourney", "modifié après examen");

    assert.throws(() => api.applyImport(inspection, { storage, now: DATE }), /ont changé depuis l'examen/);
    assert.equal(storage.value("makerland.firstJourney"), "modifié après examen");
    assert.equal(storage.value(api.RECOVERY_KEY), null);
});

test("import V1 : un échec à mi-parcours restaure les valeurs antérieures et garde un journal résolu", () => {
    const values = new Map([["makerland.firstJourney", "avant-1"], ["makerland.narrativeMemory.v1", "avant-2"], ["foreign.site", "intact"]]);
    let failOnce = true;
    const storage = {
        getItem(key) { return values.has(key) ? values.get(key) : null; },
        setItem(key, value) { if (key === "makerland.narrativeMemory.v1" && failOnce) { failOnce = false; throw new Error("quota"); } values.set(key, String(value)); },
        removeItem(key) { values.delete(key); },
        value(key) { return values.has(key) ? values.get(key) : null; }
    };
    const backup = validBackup({ "makerland.firstJourney": "fichier-1", "makerland.narrativeMemory.v1": "fichier-2" });
    const { api } = importHarness({}, storage);
    const inspection = api.inspectImport(backup, { storage });

    assert.throws(() => api.applyImport(inspection, { storage, now: DATE }), /état précédent a été rétabli/);
    assert.equal(storage.value("makerland.firstJourney"), "avant-1");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), "avant-2");
    assert.equal(storage.value("foreign.site"), "intact");
    assert.equal(api.getRecoveryStatus({ storage }).journal.status, "rolled-back");
});

test("import V1 : un journal persistant pending permet une récupération après rechargement et ne peut pas être écrasé", () => {
    const backup = validBackup({ "makerland.firstJourney": "fichier" });
    const { api, storage } = importHarness({ "makerland.firstJourney": "nouveau" });
    const journal = {
        format: "makerland-backup-recovery-v1", version: 1, status: "pending", createdAt: DATE.toISOString(),
        keys: ["makerland.firstJourney"], before: { "makerland.firstJourney": "ancien" }, target: { "makerland.firstJourney": "nouveau" }, appliedKeys: ["makerland.firstJourney"]
    };
    storage.setItem(api.RECOVERY_KEY, JSON.stringify(journal));

    assert.throws(() => api.inspectImport(backup, { storage }), /récupération locale est nécessaire/);
    assert.equal(api.recoverPreviousState({ storage }).ok, true);
    assert.equal(storage.value("makerland.firstJourney"), "ancien");
    assert.equal(api.getRecoveryStatus({ storage }).journal.status, "recovered");
    assert.equal(api.discardRecoveryPoint({ storage }).ok, true);
    assert.equal(storage.value(api.RECOVERY_KEY), null);
});

test("import V1 : une lecture ou une création de point de retour impossible ne modifie aucun souvenir", () => {
    const backup = validBackup({ "makerland.firstJourney": "fichier" });
    const unreadable = createStorage({ "makerland.firstJourney": "avant" }, { throwOnGet: true });
    const { api: unreadableApi } = importHarness({}, unreadable);
    assert.throws(() => unreadableApi.inspectImport(backup, { storage: unreadable }), /stockage local|Lecture impossible/);

    const values = new Map([["makerland.firstJourney", "avant"]]);
    const noJournal = { getItem(key) { return values.has(key) ? values.get(key) : null; }, setItem(key, value) { if (key === "makerland.backup.recovery.v1") throw new Error("quota"); values.set(key, String(value)); }, removeItem(key) { values.delete(key); }, value(key) { return values.has(key) ? values.get(key) : null; } };
    const { api } = importHarness({}, noJournal);
    const inspection = api.inspectImport(backup, { storage: noJournal });
    assert.throws(() => api.applyImport(inspection, { storage: noJournal, now: DATE }), /quota/);
    assert.equal(noJournal.value("makerland.firstJourney"), "avant");
});

test("import V1 : le point de retour détecte un conflit et exige une confirmation distincte", () => {
    const backup = validBackup({ "makerland.firstJourney": "importé", "makerland.narrativeMemory.v1": "importé-2" });
    const { api, storage } = importHarness({ "makerland.firstJourney": "avant", "makerland.narrativeMemory.v1": "avant-2", "foreign.site": "intact" });
    const importInspection = api.inspectImport(backup, { storage });
    api.applyImport(importInspection, { storage, now: DATE });
    storage.setItem("makerland.firstJourney", "évolution récente");
    const recovery = api.inspectRecovery({ storage });

    assert.deepEqual(recovery.conflicts, ["makerland.firstJourney"]);
    assert.equal(api.recoverPreviousState({ storage, inspection: recovery }).conflict, true);
    assert.equal(storage.value("makerland.firstJourney"), "évolution récente");
    assert.equal(api.recoverPreviousState({ storage, inspection: recovery, force: true }).ok, true);
    assert.equal(storage.value("makerland.firstJourney"), "avant");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), "avant-2");
    assert.equal(storage.value("foreign.site"), "intact");
});

test("import V1 : une modification après l'examen du conflit invalide la confirmation", () => {
    const backup = validBackup({ "makerland.firstJourney": "importé" });
    const { api, storage } = importHarness({ "makerland.firstJourney": "avant" });
    api.applyImport(api.inspectImport(backup, { storage }), { storage, now: DATE });
    storage.setItem("makerland.firstJourney", "évolution 1");
    const recovery = api.inspectRecovery({ storage });
    storage.setItem("makerland.firstJourney", "évolution 2");

    assert.throws(() => api.recoverPreviousState({ storage, inspection: recovery, force: true }), /ont changé/);
    assert.equal(storage.value("makerland.firstJourney"), "évolution 2");
});

test("import V1 : un journal invalide ou une récupération technique incertaine refuse l'écrasement", () => {
    const { api, storage } = importHarness({ "makerland.firstJourney": "récent" });
    storage.setItem(api.RECOVERY_KEY, "{journal-invalide");
    assert.throws(() => api.inspectRecovery({ storage }), /journal de récupération/);

    const journal = { format: "makerland-backup-recovery-v1", version: 1, status: "pending", createdAt: DATE.toISOString(), keys: ["makerland.firstJourney"], before: { "makerland.firstJourney": "avant" }, target: { "makerland.firstJourney": "importé" }, appliedKeys: ["makerland.firstJourney"] };
    storage.setItem(api.RECOVERY_KEY, JSON.stringify(journal));
    const recovery = api.inspectRecovery({ storage });
    assert.deepEqual(recovery.conflicts, ["makerland.firstJourney"]);
    assert.equal(recovery.forceAllowed, false);
    assert.equal(api.recoverPreviousState({ storage, inspection: recovery }).conflict, true);
    assert.equal(storage.value("makerland.firstJourney"), "récent");
});
