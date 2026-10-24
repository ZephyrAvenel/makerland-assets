const assert = require("node:assert/strict");
const test = require("node:test");
const {
    createDocument,
    createStorage,
    createWindow,
    runScript
} = require("./memory-test-helpers");

function read(storage) {
    return JSON.parse(storage.value("makerland:living-cycle"));
}

function createHarness(initial = {}, options = {}) {
    const storage = createStorage(initial, options);
    const sessionStorage = createStorage();
    const document = createDocument({ readyState: "loading" });
    const window = createWindow();
    const math = Object.create(Math);
    math.random = () => 0;
    const context = {
        Date,
        JSON,
        Math: math,
        Number,
        Object,
        Set,
        document,
        localStorage: storage,
        sessionStorage,
        window
    };

    runScript("atelier/living-cycle.js", context);

    return { context, document, sessionStorage, storage, window };
}

function objectsApi(harness) {
    return runScript(
        "atelier/atelier-objects.js",
        harness.context,
        "{ updateCycleMemory, hasSeen }",
        { insideIife: true }
    );
}

function resonanceApi(harness) {
    return runScript(
        "atelier/living-resonance.js",
        harness.context,
        "{ readMemory, renderTravelingFragment }",
        { insideIife: true }
    );
}

function archivesApi(harness) {
    return runScript(
        "atelier/archives/archive-volume.js",
        harness.context,
        "{ rememberArchive }",
        { insideIife: true }
    );
}

function archiveRecord() {
    return {
        id: "d001",
        meta: { title: "Pourquoi les Récits Vivants", status: "Archive Vivante" }
    };
}

test("atelier-objects : clé absente crée seulement les traces d’objet attendues", () => {
    const harness = createHarness();
    const api = objectsApi(harness);

    assert.equal(api.updateCycleMemory("carnet-dialogue"), true);
    const memory = read(harness.storage);
    assert.deepEqual(memory.atelierObjectIds, ["carnet-dialogue"]);
    assert.equal(memory.atelierObjects, 1);
});

test("atelier-objects : mémoire valide conserve les champs inconnus et les fragments", () => {
    const initial = {
        customLegacyNote: "à garder",
        travelingFragments: ["Fragment ancien"],
        dialogues: ["D001"]
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });

    assert.equal(objectsApi(harness).updateCycleMemory("carnet-dialogue"), true);
    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.deepEqual(memory.travelingFragments, ["Fragment ancien"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
});

test("atelier-objects : JSON invalide, structure ambiguë et erreur de lecture restent non destructifs", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    assert.equal(objectsApi(corrupted).updateCycleMemory("carnet-dialogue"), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);
    assert.equal(corrupted.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ atelierObjectIds: "pas un tableau" });
    const ambiguous = createHarness({ "makerland:living-cycle": ambiguousRaw });
    assert.equal(objectsApi(ambiguous).updateCycleMemory("carnet-dialogue"), false);
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);

    const unavailable = createHarness({}, { throwOnGet: true });
    assert.equal(objectsApi(unavailable).updateCycleMemory("carnet-dialogue"), false);
    assert.equal(unavailable.storage.calls.set, 0);
});

test("atelier-objects : une erreur d’écriture laisse la mémoire valide intacte", () => {
    const raw = JSON.stringify({ atelierObjectIds: ["brouillon"], atelierObjects: 1 });
    const harness = createHarness({ "makerland:living-cycle": raw }, { throwOnSet: true });

    assert.equal(objectsApi(harness).updateCycleMemory("carnet-dialogue"), false);
    assert.equal(harness.storage.value("makerland:living-cycle"), raw);
});

test("living-resonance : un fragment s’ajoute sans perdre objets, dialogues ou champs inconnus", () => {
    const initial = {
        atelierObjectIds: ["brouillon"],
        atelierObjects: 1,
        dialogues: ["D001"],
        customLegacyNote: "à garder"
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    const api = resonanceApi(harness);
    const state = api.readMemory();

    api.renderTravelingFragment({ fragment: "Une trace" }, state.memory, state);
    const memory = read(harness.storage);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.customLegacyNote, "à garder");
});

test("living-resonance : valeur invalide ou écriture impossible ne remplace pas le cycle", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    const corruptedApi = resonanceApi(corrupted);
    const state = corruptedApi.readMemory();
    corruptedApi.renderTravelingFragment({ fragment: "Une trace" }, state.memory, state);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);

    const validRaw = JSON.stringify({ travelingFragments: ["Ancien"] });
    const unavailable = createHarness({ "makerland:living-cycle": validRaw }, { throwOnSet: true });
    const unavailableApi = resonanceApi(unavailable);
    const unavailableState = unavailableApi.readMemory();
    unavailableApi.renderTravelingFragment({ fragment: "Nouvelle trace" }, unavailableState.memory, unavailableState);
    assert.equal(unavailable.storage.value("makerland:living-cycle"), validRaw);
});

test("archive-volume : un dialogue préserve les fragments, objets et champs inconnus", () => {
    const initial = {
        atelierObjectIds: ["carnet-dialogue"],
        travelingFragments: ["Une trace"],
        customLegacyNote: "à garder"
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });

    assert.equal(archivesApi(harness).rememberArchive(archiveRecord()), undefined);
    const memory = read(harness.storage);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.archiveDialogs.D001.title, "Pourquoi les Récits Vivants");
    assert.deepEqual(memory.atelierObjectIds, ["carnet-dialogue"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.equal(memory.customLegacyNote, "à garder");
});

test("archive-volume : corruption, structure ambiguë, lecture et écriture indisponibles restent non destructives", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    archivesApi(corrupted).rememberArchive(archiveRecord());
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);
    assert.equal(corrupted.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ archiveDialogs: [] });
    const ambiguous = createHarness({ "makerland:living-cycle": ambiguousRaw });
    archivesApi(ambiguous).rememberArchive(archiveRecord());
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);

    const unavailable = createHarness({}, { throwOnGet: true });
    archivesApi(unavailable).rememberArchive(archiveRecord());
    assert.equal(unavailable.storage.calls.set, 0);

    const validRaw = JSON.stringify({ dialogues: ["D002"] });
    const noWrite = createHarness({ "makerland:living-cycle": validRaw }, { throwOnSet: true });
    archivesApi(noWrite).rememberArchive(archiveRecord());
    assert.equal(noWrite.storage.value("makerland:living-cycle"), validRaw);
});

test("producteurs Atelier : écritures séquentielles conservent toutes les contributions", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ customLegacyNote: "à garder" })
    });

    objectsApi(harness).updateCycleMemory("carnet-dialogue");
    const resonance = resonanceApi(harness);
    const state = resonance.readMemory();
    resonance.renderTravelingFragment({ fragment: "Une trace" }, state.memory, state);
    archivesApi(harness).rememberArchive(archiveRecord());

    const memory = read(harness.storage);
    assert.deepEqual(memory.atelierObjectIds, ["carnet-dialogue"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.customLegacyNote, "à garder");
});

test("producteurs Atelier : une corruption reste intacte lors de sollicitations successives", () => {
    const raw = "{corrompu";
    const harness = createHarness({ "makerland:living-cycle": raw });
    objectsApi(harness).updateCycleMemory("carnet-dialogue");
    const resonance = resonanceApi(harness);
    const state = resonance.readMemory();
    resonance.renderTravelingFragment({ fragment: "Une trace" }, state.memory, state);
    archivesApi(harness).rememberArchive(archiveRecord());

    assert.equal(harness.storage.value("makerland:living-cycle"), raw);
    assert.equal(harness.storage.calls.set, 1);
    assert.equal(harness.storage.value("makerland:traveling-fragment:last"), "Une trace");
});

test("politique partagée : une écriture obsolète est refusée sans effacer l’écriture plus récente", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] })
    });
    const store = harness.window.MakerlandLivingCycleStorage;
    const stale = store.read();
    const current = store.read();
    current.memory.travelingFragments = ["Une trace"];

    assert.equal(store.write(current.memory, current.raw), true);
    stale.memory.atelierObjectIds = ["carnet-dialogue"];
    assert.equal(store.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        dialogues: ["D001"],
        travelingFragments: ["Une trace"]
    });
});
