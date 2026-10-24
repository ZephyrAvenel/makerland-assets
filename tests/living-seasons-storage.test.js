const assert = require("node:assert/strict");
const test = require("node:test");
const {
    createDocument,
    createStorage,
    createWindow,
    runScript
} = require("./memory-test-helpers");

const DATE = new Date("2026-10-24T12:00:00.000Z");

function read(storage) {
    return JSON.parse(storage.value("makerland:living-cycle"));
}

function createHarness(initial = {}, options = {}) {
    const document = createDocument({ readyState: "loading" });
    const storage = createStorage(initial, options);
    const window = createWindow();
    const math = Object.create(Math);
    math.random = () => 1;
    const context = {
        Date,
        JSON,
        Math: math,
        Number,
        Object,
        Set,
        document,
        localStorage: storage,
        window
    };

    if (!options.withoutPolicy) {
        runScript("atelier/living-cycle.js", context);
    }

    const api = runScript(
        "js/livingSeasons.js",
        context,
        "{ getContext, init, readCycle, updateCycle }",
        { insideIife: true }
    );

    return { api, context, document, storage, window };
}

function updateForAutumn(harness) {
    return harness.api.updateCycle(harness.api.getContext(DATE));
}

test("livingSeasons : une clé absente reçoit les traces saisonnières attendues", () => {
    const harness = createHarness();
    assert.equal(updateForAutumn(harness), true);

    assert.deepEqual(read(harness.storage), {
        currentSeason: "automne",
        currentMoment: "noon",
        seasonalPlace: "Transmission",
        seasonalFragments: ["Ce qui tombe nourrit parfois la prochaine forme."]
    });
});

test("livingSeasons : une mémoire valide ou incomplète conserve les traces des autres producteurs", () => {
    const initial = {
        customLegacyNote: "à garder",
        atelierObjectIds: ["brouillon"],
        travelingFragments: ["Une trace"],
        dialogues: ["D001"]
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    assert.equal(updateForAutumn(harness), true);

    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.equal(memory.currentSeason, "automne");
});

test("livingSeasons : JSON invalide ou structure ambiguë reste intact sans écriture", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    assert.equal(updateForAutumn(corrupted), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);
    assert.equal(corrupted.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ seasonalFragments: "pas un tableau" });
    const ambiguous = createHarness({ "makerland:living-cycle": ambiguousRaw });
    assert.equal(updateForAutumn(ambiguous), false);
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);
    assert.equal(ambiguous.storage.calls.set, 0);
});

test("livingSeasons : lecture, écriture ou politique indisponible ne remplace pas le cycle", () => {
    const unreadable = createHarness({}, { throwOnGet: true });
    assert.equal(updateForAutumn(unreadable), false);
    assert.equal(unreadable.storage.calls.set, 0);

    const raw = JSON.stringify({ customLegacyNote: "à garder" });
    const unwritable = createHarness(
        { "makerland:living-cycle": raw },
        { throwOnSet: true }
    );
    assert.equal(updateForAutumn(unwritable), false);
    assert.equal(unwritable.storage.value("makerland:living-cycle"), raw);

    const withoutPolicy = createHarness({}, { withoutPolicy: true });
    assert.equal(updateForAutumn(withoutPolicy), false);
    assert.equal(withoutPolicy.storage.value("makerland:living-cycle"), null);
});

test("livingSeasons : une écriture obsolète est refusée sans perte de la contribution plus récente", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ dialogues: ["D001"] })
    });
    const storage = harness.window.MakerlandLivingCycleStorage;
    const stale = storage.read();
    const newer = storage.read();
    newer.memory.atelierObjectIds = ["brouillon"];
    assert.equal(storage.write(newer.memory, newer.raw), true);

    stale.memory.currentSeason = "automne";
    assert.equal(storage.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        dialogues: ["D001"],
        atelierObjectIds: ["brouillon"]
    });
});

test("Carnet puis livingSeasons : une mémoire absente conserve les deux contributions", () => {
    const document = createDocument({ readyState: "loading" });
    const storage = createStorage();
    const window = createWindow();
    const math = Object.create(Math);
    math.random = () => 1;
    const context = { Date, JSON, Math: math, Number, Object, Set, document, localStorage: storage, window };

    runScript("atelier/living-cycle.js", context);
    runScript("carnet/carnet.js", context);
    runScript("js/livingSeasons.js", context);
    document.dispatch("DOMContentLoaded");

    const memory = read(storage);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.equal(memory.currentSeason, "automne");
    assert.ok(memory.seasonalFragments.length > 0);
});

test("Carnet puis livingSeasons : corruption et stockage indisponible restent non destructifs à l'initialisation", () => {
    const raw = "{corrompu";
    const document = createDocument({ readyState: "loading" });
    const storage = createStorage({ "makerland:living-cycle": raw });
    const window = createWindow();
    const math = Object.create(Math);
    math.random = () => 1;
    const context = { Date, JSON, Math: math, Number, Object, Set, document, localStorage: storage, window };
    runScript("atelier/living-cycle.js", context);
    runScript("carnet/carnet.js", context);
    runScript("js/livingSeasons.js", context);
    document.dispatch("DOMContentLoaded");
    assert.equal(storage.value("makerland:living-cycle"), raw);

    const unavailable = createHarness({}, { throwOnGet: true });
    runScript("carnet/carnet.js", unavailable.context);
    assert.doesNotThrow(() => unavailable.document.dispatch("DOMContentLoaded"));
    assert.equal(
        unavailable.storage.calls.setKeys.includes("makerland:living-cycle"),
        false
    );
});
