const assert = require("node:assert/strict");
const test = require("node:test");
const { createDocument, createStorage, createWindow, runScript } = require("./memory-test-helpers");

function harness(initial = {}, options = {}) {
    const document = createDocument({ readyState: "loading" });
    const storage = createStorage(initial, options);
    const window = createWindow();
    window.location = { href: "https://makerland.test/index.html" };
    const context = { Date, JSON, Number, Object, Array, Set, URL, document, localStorage: storage, window, fetch: () => Promise.reject(new Error("non utilisé")) };
    const api = runScript("js/livingConstellationExperience.js", context, "{ readMemory, readConstellationMemory, writeConstellationMemory, state }", { insideIife: true });
    return { api, storage };
}

test("constellation vivante : une mémoire valide évolue et préserve ses propriétés inconnues", () => {
    const raw = JSON.stringify({
        visits: 2,
        archivesOpened: ["D001"],
        conceptsSeen: ["C001"],
        worksDiscovered: ["W001"],
        imagesMet: ["I001"],
        unknown: { note: "garder" }
    });
    const { api, storage } = harness({ "makerland.traveler.constellation": raw });
    const memory = api.readMemory();
    const saved = JSON.parse(storage.value("makerland.traveler.constellation"));

    assert.equal(memory.visits, 3);
    assert.equal(saved.unknown.note, "garder");
    assert.deepEqual(saved.archivesOpened, ["D001"]);
});

test("constellation vivante : JSON invalide, champ ambigu et lecture indisponible restent non destructifs", () => {
    const invalidRaw = "{constellation-invalide";
    const invalid = harness({ "makerland.traveler.constellation": invalidRaw });
    invalid.api.readMemory();
    assert.equal(invalid.storage.value("makerland.traveler.constellation"), invalidRaw);
    assert.equal(invalid.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ visits: "bad", archivesOpened: "D001", unknown: "garder" });
    const ambiguous = harness({ "makerland.traveler.constellation": ambiguousRaw });
    ambiguous.api.readMemory();
    assert.equal(ambiguous.storage.value("makerland.traveler.constellation"), ambiguousRaw);
    assert.equal(ambiguous.storage.calls.set, 0);

    const unavailable = harness({}, { throwOnGet: true });
    unavailable.api.readMemory();
    assert.equal(unavailable.storage.calls.set, 0);
});

test("constellation vivante : une écriture devenue obsolète est refusée", () => {
    const raw = JSON.stringify({ visits: 1, unknown: "garder" });
    const { api, storage } = harness({ "makerland.traveler.constellation": raw });
    const state = api.readConstellationMemory();
    storage.setItem("makerland.traveler.constellation", JSON.stringify({ visits: 7, unknown: "plus récent" }));

    assert.equal(api.writeConstellationMemory(state, { visits: 2, unknown: "ancien" }), false);
    assert.equal(JSON.parse(storage.value("makerland.traveler.constellation")).unknown, "plus récent");
});
