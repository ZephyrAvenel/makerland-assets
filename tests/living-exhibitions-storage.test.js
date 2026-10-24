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
    const document = createDocument({ readyState: "loading" });
    document.currentScript = { src: "https://makerland.test/js/livingExhibitions.js" };
    const storage = createStorage(initial, options);
    const window = createWindow();
    window.location = { href: "https://makerland.test/" };
    const context = {
        Date,
        JSON,
        Math,
        Number,
        Object,
        Set,
        URL,
        document,
        localStorage: storage,
        window
    };

    if (!options.withoutPolicy) {
        runScript("atelier/living-cycle.js", context);
    }

    const api = runScript(
        "js/livingExhibitions.js",
        context,
        "{ readCycle, rememberFeatured, state }",
        { insideIife: true }
    );
    api.state.exhibitions = [{ title: "Dialogue" }];
    api.state.activeId = "dialogue";
    return { api, context, document, storage, window };
}

test("livingExhibitions : une clé absente reçoit la trace d'exposition attendue", () => {
    const harness = createHarness();
    assert.equal(harness.api.rememberFeatured(), true);

    const memory = read(harness.storage);
    assert.equal(memory.livingExhibitions.featured, "Dialogue");
    assert.equal(memory.livingExhibitions.explored, "dialogue");
    assert.equal(typeof memory.livingExhibitions.updatedAt, "string");
});

test("livingExhibitions : les données valides, incomplètes et inconnues sont conservées", () => {
    const initial = {
        customLegacyNote: "à garder",
        currentSeason: "automne",
        atelierObjectIds: ["brouillon"],
        travelingFragments: ["Une trace"],
        dialogues: ["D001"],
        livingExhibitions: { historicMarker: "à préserver" }
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    assert.equal(harness.api.rememberFeatured(), true);

    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.equal(memory.currentSeason, "automne");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.livingExhibitions.historicMarker, "à préserver");
    assert.equal(memory.livingExhibitions.explored, "dialogue");
});

test("livingExhibitions : JSON invalide et structures ambiguës restent strictement intacts", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    assert.equal(corrupted.api.rememberFeatured(), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);
    assert.equal(corrupted.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ livingExhibitions: [] });
    const ambiguous = createHarness({ "makerland:living-cycle": ambiguousRaw });
    assert.equal(ambiguous.api.rememberFeatured(), false);
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);
    assert.equal(ambiguous.storage.calls.set, 0);
});

test("livingExhibitions : lecture, écriture et politique indisponibles ne remplacent pas le cycle", () => {
    const unreadable = createHarness({}, { throwOnGet: true });
    assert.equal(unreadable.api.rememberFeatured(), false);
    assert.equal(unreadable.storage.calls.set, 0);

    const raw = JSON.stringify({ currentSeason: "automne" });
    const unwritable = createHarness(
        { "makerland:living-cycle": raw },
        { throwOnSet: true }
    );
    assert.equal(unwritable.api.rememberFeatured(), false);
    assert.equal(unwritable.storage.value("makerland:living-cycle"), raw);

    const withoutPolicy = createHarness({}, { withoutPolicy: true });
    assert.equal(withoutPolicy.api.rememberFeatured(), false);
    assert.equal(withoutPolicy.storage.value("makerland:living-cycle"), null);
});

test("livingExhibitions : une écriture obsolète est refusée sans perdre la contribution récente", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] })
    });
    const storage = harness.window.MakerlandLivingCycleStorage;
    const stale = storage.read();
    const newer = storage.read();
    newer.memory.currentSeason = "automne";
    assert.equal(storage.write(newer.memory, newer.raw), true);

    stale.memory.livingExhibitions = { featured: "Dialogue" };
    assert.equal(storage.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        dialogues: ["D001"],
        currentSeason: "automne"
    });
});

test("livingExhibitions : les interactions valides ne dépendent pas de la persistance du cycle", () => {
    const harness = createHarness({}, { withoutPolicy: true });
    harness.api.state.activeId = "vivant";
    assert.equal(harness.api.rememberFeatured(), false);
    assert.equal(harness.api.state.activeId, "vivant");
});
