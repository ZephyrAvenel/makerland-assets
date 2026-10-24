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
    document.currentScript = { src: "https://makerland.test/js/travelerConstellation.js" };
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
        console: { warn() {} },
        document,
        localStorage: storage,
        window,
        fetch: () => Promise.reject(new Error("fetch non configuré"))
    };

    if (!options.withoutPolicy) {
        runScript("atelier/living-cycle.js", context);
    }
    const api = runScript(
        "js/travelerConstellation.js",
        context,
        "{ readCycleForWrite, updateCycleMemory, saveFragment, state }",
        { insideIife: true }
    );
    api.state.data = {
        categories: {
            categories: [],
            fallback: { id: "fallback", label: "Recits", symbol: "✦", concepts: [] }
        },
        concepts: { concepts: [] },
        works: { works: [] },
        assets: { assets: [] },
        mapping: { mappings: [] }
    };
    api.state.memory = { fragments: [], visits: 0, firstSeen: "2026-10-24T00:00:00.000Z" };
    return { api, context, document, storage, window };
}

function fragment(concepts = ["C001", "C002"]) {
    return { concepts };
}

test("voyageur : une clé absente reçoit les traces attendues", () => {
    const harness = createHarness();
    assert.equal(harness.api.updateCycleMemory(fragment()), true);
    assert.deepEqual(read(harness.storage), {
        constellationFragments: ["voyageurs"],
        travelerStories: 1,
        travelerConcepts: ["C001", "C002"]
    });
});

test("voyageur : fragments, compteurs et traces des autres expériences sont conservés", () => {
    const initial = {
        customLegacyNote: "à garder",
        constellationFragments: ["atelier"],
        travelerStories: 4,
        travelerConcepts: ["C001"],
        currentSeason: "automne",
        atelierObjectIds: ["brouillon"],
        travelingFragments: ["fragment Atelier"],
        dialogues: ["D001"],
        visitedPlaceIds: ["carnet:carnet"],
        livingSky: { stars: 3 },
        livingExhibitions: { featured: "Dialogue" }
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    assert.equal(harness.api.updateCycleMemory(fragment(["C001", "C003"])), true);
    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.deepEqual(memory.constellationFragments, ["atelier", "voyageurs"]);
    assert.equal(memory.travelerStories, 5);
    assert.deepEqual(memory.travelerConcepts, ["C001", "C003"]);
    assert.equal(memory.currentSeason, "automne");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.travelingFragments, ["fragment Atelier"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.equal(memory.livingSky.stars, 3);
    assert.equal(memory.livingExhibitions.featured, "Dialogue");
});

test("voyageur : une interaction répétée n'ajoute pas de doublon de fragment", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({
            constellationFragments: ["voyageurs"],
            travelerStories: 2,
            travelerConcepts: ["C001"]
        })
    });
    assert.equal(harness.api.updateCycleMemory(fragment(["C001"])), true);
    assert.equal(harness.api.updateCycleMemory(fragment(["C001"])), true);
    const memory = read(harness.storage);
    assert.deepEqual(memory.constellationFragments, ["voyageurs"]);
    assert.equal(memory.travelerStories, 4);
    assert.deepEqual(memory.travelerConcepts, ["C001"]);
});

test("voyageur : JSON corrompu et structures ambiguës restent intacts", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    assert.equal(corrupted.api.updateCycleMemory(fragment()), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);

    const ambiguousCycle = JSON.stringify({ constellationFragments: "voyageurs" });
    const cycle = createHarness({ "makerland:living-cycle": ambiguousCycle });
    assert.equal(cycle.api.updateCycleMemory(fragment()), false);
    assert.equal(cycle.storage.value("makerland:living-cycle"), ambiguousCycle);

    const ambiguousTraveler = JSON.stringify({ travelerConcepts: "C001" });
    const traveler = createHarness({ "makerland:living-cycle": ambiguousTraveler });
    assert.equal(traveler.api.updateCycleMemory(fragment()), false);
    assert.equal(traveler.storage.value("makerland:living-cycle"), ambiguousTraveler);
});

test("voyageur : lecture, écriture et politique indisponibles ne remplacent pas le cycle", () => {
    const unreadable = createHarness({}, { throwOnGet: true });
    assert.equal(unreadable.api.updateCycleMemory(fragment()), false);
    assert.equal(unreadable.storage.calls.set, 0);

    const raw = JSON.stringify({ travelerStories: 2 });
    const unwritable = createHarness({ "makerland:living-cycle": raw }, { throwOnSet: true });
    assert.equal(unwritable.api.updateCycleMemory(fragment()), false);
    assert.equal(unwritable.storage.value("makerland:living-cycle"), raw);

    const withoutPolicy = createHarness({}, { withoutPolicy: true });
    assert.equal(withoutPolicy.api.updateCycleMemory(fragment()), false);
    assert.equal(withoutPolicy.storage.value("makerland:living-cycle"), null);
});

test("voyageur : une écriture obsolète est refusée sans effacer la contribution récente", () => {
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] }) });
    const store = harness.window.MakerlandLivingCycleStorage;
    const stale = store.read();
    const newer = store.read();
    newer.memory.currentSeason = "automne";
    assert.equal(store.write(newer.memory, newer.raw), true);
    stale.memory.travelerStories = 1;
    assert.equal(store.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        dialogues: ["D001"],
        currentSeason: "automne"
    });
});

test("voyageur : le chemin d'interaction sauvegarde une trace valide du cycle", () => {
    const harness = createHarness();
    const saved = harness.api.saveFragment("Une rencontre avec le vivant");
    assert.ok(saved);
    const memory = read(harness.storage);
    assert.equal(memory.travelerStories, 1);
    assert.deepEqual(memory.constellationFragments, ["voyageurs"]);
    assert.deepEqual(memory.travelerConcepts, []);
});
