const test = require("node:test");
const assert = require("node:assert/strict");
const { createDocument, createStorage, createWindow, runScript } = require("./memory-test-helpers");

const DATE = new Date("2026-10-24T12:00:00.000Z");

function archiveRepository(initial = [], options = {}) {
    const records = new Map(initial.map(record => [record.id, structuredClone(record)]));
    return {
        add(record) {
            if (options.failAdd) return Promise.reject(new Error("archive write unavailable"));
            if (records.has(record.id)) return Promise.reject(new Error("duplicate"));
            records.set(record.id, structuredClone(record));
            return Promise.resolve(undefined);
        },
        get(id) {
            if (options.failGet) return Promise.reject(new Error("archive read unavailable"));
            return Promise.resolve(records.has(id) ? structuredClone(records.get(id)) : undefined);
        },
        list() {
            if (options.failList) return Promise.reject(new Error("archive list unavailable"));
            return Promise.resolve([...records.values()].map(record => structuredClone(record)));
        },
        delete(id) {
            if (options.failDelete) return Promise.reject(new Error("archive delete unavailable"));
            records.delete(id);
            return Promise.resolve(undefined);
        },
        raw(id) { return records.get(id); }
    };
}

function archiveHarness(initial = {}) {
    const storage = createStorage(initial);
    const document = createDocument();
    const window = { ...createWindow(), localStorage: storage };
    const context = { Date, JSON, Object, Set, TextEncoder, Promise, document, window, structuredClone };
    runScript("js/memoryBackup.js", context, "window.MakerlandMemoryBackup");
    runScript("js/memoryImport.js", context, "window.MakerlandMemoryImport");
    const api = runScript("js/memoryArchives.js", context, "window.MakerlandMemoryArchives");
    return { api, storage };
}

test("archives : création nommée, valeurs brutes et archives de même nom restent distinctes", async () => {
    const raw = "{invalide";
    const { api, storage } = archiveHarness({ "makerland.firstJourney": raw, "makerland_stories": '[{"text":"personnel"}]' });
    const repository = archiveRepository();
    const first = await api.createArchive({ name: " Avant la traversée ", repository, storage, now: DATE, id: "a1" });
    const second = await api.createArchive({ name: "Avant la traversée", repository, storage, now: new Date("2026-10-24T12:01:00.000Z"), id: "a2" });

    assert.equal(first.name, "Avant la traversée");
    assert.equal(first.backup.memories["makerland.firstJourney"], raw);
    assert.equal(first.memoryCount, 2);
    assert.notEqual(first.id, second.id);
    assert.equal(storage.value("makerland.firstJourney"), raw);
    assert.equal(storage.calls.set, 0);
    assert.deepEqual((await api.listArchives({ repository })).map(record => record.id), ["a2", "a1"]);
});

test("archives : refuse une archive vide, une lecture locale impossible et un enregistrement non vérifiable", async () => {
    const empty = archiveHarness();
    await assert.rejects(empty.api.createArchive({ name: "Vide", repository: archiveRepository(), storage: empty.storage, now: DATE, id: "empty" }), /Aucun souvenir/);

    const unreadable = archiveHarness({ "makerland.firstJourney": "avant" });
    const readFailure = createStorage({ "makerland.firstJourney": "avant" }, { throwOnGet: true });
    await assert.rejects(unreadable.api.createArchive({ name: "Lecture", repository: archiveRepository(), storage: readFailure, now: DATE, id: "read" }), /Lecture impossible/);

    const writeFailure = archiveHarness({ "makerland.firstJourney": "avant" });
    await assert.rejects(writeFailure.api.createArchive({ name: "Échec", repository: archiveRepository([], { failAdd: true }), storage: writeFailure.storage, now: DATE, id: "write" }), /archive write unavailable/);
});

test("archives : examen et restauration réutilisent le moteur sécurisé sans toucher aux clés absentes ou étrangères", async () => {
    const { api, storage } = archiveHarness({ "makerland.firstJourney": "ancien", "foreign.site": "intact" });
    const repository = archiveRepository();
    const record = await api.createArchive({ name: "Avant", repository, storage, now: DATE, id: "before" });
    storage.setItem("makerland.firstJourney", "nouveau");
    storage.setItem("makerland.narrativeMemory.v1", "reste présent");
    const examined = await api.inspectArchive(record.id, { repository, storage });
    assert.equal(examined.inspection.changes[0].action, "replace");
    const result = api.restoreArchive(examined, { storage, now: new Date("2026-10-24T12:02:00.000Z") });

    assert.equal(result.ok, true);
    assert.equal(storage.value("makerland.firstJourney"), "ancien");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), "reste présent");
    assert.equal(storage.value("foreign.site"), "intact");
    assert.equal(storage.value("makerland.backup.recovery.v1") !== null, true);
});

test("archives : journal non résolu, archive corrompue, export et suppression restent ciblés", async () => {
    const { api, storage } = archiveHarness({ "makerland.firstJourney": "avant", "foreign.site": "intact" });
    const repository = archiveRepository();
    const record = await api.createArchive({ name: "À exporter", repository, storage, now: DATE, id: "export" });
    storage.setItem("makerland.backup.recovery.v1", "{journal-invalide");
    await assert.rejects(api.inspectArchive(record.id, { repository, storage }), /journal de récupération/);

    await repository.add({ id: "broken", name: "Cassée", format: "incompatible", version: 1 });
    await assert.rejects(api.readArchive("broken", { repository }), /illisible/);
    const prepared = await api.prepareArchiveExport(record.id, { repository });
    assert.equal(prepared.prepared.backup.format, "makerland-backup-v1");
    assert.equal(prepared.prepared.backup.memories["makerland.firstJourney"], "avant");
    assert.equal(api.archiveFilename(record), "makerland-archive-A-exporter-2026-10-24.json");
    await api.deleteArchive(record.id, { repository });
    assert.equal(await repository.get(record.id), undefined);
    assert.equal((await repository.get("broken")).id, "broken");
    assert.equal(storage.value("makerland.firstJourney"), "avant");
    assert.equal(storage.value("foreign.site"), "intact");
});

test("archives : un échec de suppression conserve l'archive et ne modifie pas les mémoires actives", async () => {
    const { api, storage } = archiveHarness({ "makerland.firstJourney": "actif" });
    const source = archiveRepository();
    const record = await api.createArchive({ name: "À conserver", repository: source, storage, now: DATE, id: "keep" });
    const failing = archiveRepository([record], { failDelete: true });

    await assert.rejects(api.deleteArchive(record.id, { repository: failing }), /archive delete unavailable/);
    assert.equal((await failing.get(record.id)).id, record.id);
    assert.equal(storage.value("makerland.firstJourney"), "actif");
});
