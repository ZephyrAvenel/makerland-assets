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
    document.currentScript = { src: "https://makerland.test/js/livingSky.js" };
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
        window,
        fetch: options.fetch || (() => Promise.reject(new Error("fetch non configuré")))
    };

    if (!options.withoutPolicy) {
        runScript("atelier/living-cycle.js", context);
    }
    const api = runScript(
        "js/livingSky.js",
        context,
        "{ fetchJson, readCycle, rememberSkyState, state }",
        { insideIife: true }
    );
    api.state.stars = [{ id: "S1" }];
    api.state.territories = [{ label: "Dialogue", stars: [{ id: "S1" }] }];
    return { api, context, document, storage, window };
}

test("livingSky : une clé absente reçoit la trace du Ciel", () => {
    const harness = createHarness();
    assert.equal(harness.api.rememberSkyState(), true);
    const memory = read(harness.storage);
    assert.equal(memory.livingSky.stars, 1);
    assert.equal(memory.livingSky.territories, 1);
    assert.equal(typeof memory.livingSky.updatedAt, "string");
    assert.equal(memory.livingSky.lastGuideWhisper, "La constellation Dialogue grandit.");
});

test("livingSky : cycle valide ou incomplet conserve les autres traces et les propriétés inconnues", () => {
    const initial = {
        customLegacyNote: "à garder",
        currentSeason: "automne",
        atelierObjectIds: ["brouillon"],
        travelingFragments: ["Une trace"],
        dialogues: ["D001"],
        visitedPlaceIds: ["carnet:carnet"],
        livingExhibitions: { featured: "Dialogue" },
        livingSky: { historicMarker: "à préserver" }
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    assert.equal(harness.api.rememberSkyState(), true);
    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.equal(memory.currentSeason, "automne");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.equal(memory.livingExhibitions.featured, "Dialogue");
    assert.equal(memory.livingSky.historicMarker, "à préserver");
});

test("livingSky : JSON corrompu, cycle ambigu et sous-objet ambigu restent intacts", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    assert.equal(corrupted.api.rememberSkyState(), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);

    const ambiguousCycle = JSON.stringify({ visitedPlaces: "pas un tableau" });
    const cycle = createHarness({ "makerland:living-cycle": ambiguousCycle });
    assert.equal(cycle.api.rememberSkyState(), false);
    assert.equal(cycle.storage.value("makerland:living-cycle"), ambiguousCycle);

    const ambiguousSky = JSON.stringify({ livingSky: { stars: "un" } });
    const sky = createHarness({ "makerland:living-cycle": ambiguousSky });
    assert.equal(sky.api.rememberSkyState(), false);
    assert.equal(sky.storage.value("makerland:living-cycle"), ambiguousSky);
});

test("livingSky : lecture, écriture et politique indisponibles ne remplacent pas le cycle", () => {
    const unreadable = createHarness({}, { throwOnGet: true });
    assert.equal(unreadable.api.rememberSkyState(), false);
    assert.equal(unreadable.storage.calls.set, 0);

    const raw = JSON.stringify({ currentSeason: "automne" });
    const unwritable = createHarness({ "makerland:living-cycle": raw }, { throwOnSet: true });
    assert.equal(unwritable.api.rememberSkyState(), false);
    assert.equal(unwritable.storage.value("makerland:living-cycle"), raw);

    const withoutPolicy = createHarness({}, { withoutPolicy: true });
    assert.equal(withoutPolicy.api.rememberSkyState(), false);
    assert.equal(withoutPolicy.storage.value("makerland:living-cycle"), null);
});

test("livingSky : une contribution plus récente pendant le chargement différé est conservée", async () => {
    let resolveFetch;
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] })
    }, {
        fetch: () => new Promise(resolve => {
            resolveFetch = resolve;
        })
    });
    const catalogue = harness.api.fetchJson("/data/sky.json");
    await Promise.resolve();

    const store = harness.window.MakerlandLivingCycleStorage;
    const newer = store.read();
    newer.memory.livingExhibitions = { featured: "Dialogue" };
    assert.equal(store.write(newer.memory, newer.raw), true);

    resolveFetch({ ok: true, json: () => Promise.resolve({ constellations: [] }) });
    await catalogue;
    assert.equal(harness.api.rememberSkyState(), true);
    const memory = read(harness.storage);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.livingExhibitions.featured, "Dialogue");
    assert.equal(memory.livingSky.stars, 1);
});

test("livingSky : catalogue invalide ou erreur réseau ne crée aucune écriture de cycle", async () => {
    const raw = JSON.stringify({ dialogues: ["D001"] });
    const invalidResponse = createHarness({ "makerland:living-cycle": raw }, {
        fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    });
    await assert.rejects(invalidResponse.api.fetchJson("/data/sky.json"));
    assert.equal(invalidResponse.storage.value("makerland:living-cycle"), raw);

    const networkFailure = createHarness({ "makerland:living-cycle": raw }, {
        fetch: () => Promise.reject(new Error("réseau indisponible"))
    });
    await assert.rejects(networkFailure.api.fetchJson("/data/sky.json"));
    assert.equal(networkFailure.storage.value("makerland:living-cycle"), raw);
});

test("livingSky : une écriture obsolète est refusée sans perte", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] })
    });
    const store = harness.window.MakerlandLivingCycleStorage;
    const stale = store.read();
    const newer = store.read();
    newer.memory.currentSeason = "automne";
    assert.equal(store.write(newer.memory, newer.raw), true);
    stale.memory.livingSky = { stars: 1, territories: 1, updatedAt: "2026-10-24" };
    assert.equal(store.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        dialogues: ["D001"],
        currentSeason: "automne"
    });
});
