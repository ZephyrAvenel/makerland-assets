const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
    createDocument,
    FakeElement,
    createStorage,
    createWindow,
    runScript
} = require("./memory-test-helpers");

function indexSource() {
    return fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
}

function read(storage) {
    return JSON.parse(storage.value("makerland:living-cycle"));
}

function createHomeHarness(initial = {}, options = {}) {
    const document = createDocument({ readyState: "loading" });
    document.currentScript = { src: "https://makerland.test/js/livingExhibitions.js" };
    const storage = createStorage(initial, options);
    const window = createWindow();
    window.location = { href: "https://makerland.test/" };
    const math = Object.create(Math);
    math.random = () => 1;
    const context = {
        Date,
        JSON,
        Math: math,
        Number,
        Object,
        Set,
        URL,
        fetch() {
            return Promise.resolve({ ok: false });
        },
        console: { warn() {} },
        document,
        localStorage: storage,
        window
    };

    runScript("atelier/living-cycle.js", context);
    const seasons = runScript(
        "js/livingSeasons.js",
        context,
        "{ getContext, updateCycle }",
        { insideIife: true }
    );
    const exhibitions = runScript(
        "js/livingExhibitions.js",
        context,
        "{ rememberFeatured, state }",
        { insideIife: true }
    );
    exhibitions.state.exhibitions = [{ title: "Dialogue" }];
    exhibitions.state.activeId = "dialogue";

    return { context, document, exhibitions, seasons, storage, window };
}

test("accueil : living-cycle est chargé une seule fois avant saisons, Sky et Expositions", () => {
    const source = indexSource();
    const cycle = source.indexOf('src="atelier/living-cycle.js"');
    const seasons = source.indexOf('src="js/livingSeasons.js"');
    const sky = source.indexOf('src="js/livingSky.js"');
    const exhibitions = source.indexOf('src="js/livingExhibitions.js"');

    assert.ok(cycle >= 0);
    assert.equal(source.match(/src="atelier\/living-cycle\.js"/g).length, 1);
    assert.ok(cycle < seasons);
    assert.ok(seasons < sky);
    assert.ok(sky < exhibitions);
});

test("accueil : la politique est disponible avant la persistance des Expositions", () => {
    const harness = createHomeHarness();
    assert.ok(harness.window.MakerlandLivingCycleStorage);
    assert.equal(harness.exhibitions.rememberFeatured(), true);
    assert.equal(read(harness.storage).livingExhibitions.featured, "Dialogue");
});

test("accueil : saisons et Expositions conservent ensemble les traces valides", () => {
    const harness = createHomeHarness({
        "makerland:living-cycle": JSON.stringify({
            customLegacyNote: "à garder",
            atelierObjectIds: ["brouillon"],
            visitedPlaceIds: ["carnet:carnet"]
        })
    });
    const context = harness.seasons.getContext(new Date("2026-10-24T12:00:00.000Z"));

    assert.equal(harness.seasons.updateCycle(context), true);
    assert.equal(harness.exhibitions.rememberFeatured(), true);
    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.equal(memory.currentSeason, "automne");
    assert.equal(memory.livingExhibitions.explored, "dialogue");
});

test("accueil : cycle corrompu ou ambigu reste intact lors des initialisations protégées", () => {
    const raw = "{corrompu";
    const corrupted = createHomeHarness({ "makerland:living-cycle": raw });
    corrupted.document.dispatch("DOMContentLoaded");
    assert.equal(corrupted.exhibitions.rememberFeatured(), false);
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);

    const ambiguousRaw = JSON.stringify({ livingExhibitions: [] });
    const ambiguous = createHomeHarness({ "makerland:living-cycle": ambiguousRaw });
    ambiguous.document.dispatch("DOMContentLoaded");
    assert.equal(ambiguous.exhibitions.rememberFeatured(), false);
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);
});

test("accueil : le retour asynchrone des catalogues persiste l'exposition après son rendu", async () => {
    const document = createDocument({ readyState: "complete" });
    document.currentScript = { src: "https://makerland.test/js/livingExhibitions.js" };
    const storage = createStorage();
    const window = createWindow();
    window.location = { href: "https://makerland.test/" };
    const screen = new FakeElement("section");
    const list = new FakeElement("nav");
    const detail = new FakeElement("article");
    const panel = new FakeElement("section");
    const close = new FakeElement("button");
    const createElement = document.createElement.bind(document);
    list.querySelectorAll = () => [];
    detail.querySelector = () => close;
    screen.querySelector = () => null;
    document.createElement = tagName => {
        const element = createElement(tagName);
        if (tagName === "aside") {
            element.querySelector = selector => ({
                "[data-exhibition-list]": list,
                "[data-exhibition-detail]": detail,
                "[data-exhibition-panel]": panel
            })[selector] || null;
        }
        return element;
    };
    document.setElement("e08_constellation", screen);
    const themeIds = ["dialogue", "liberte", "monde-commun", "transformation", "transmission", "esperance", "seuil", "nature"];
    const responses = [
        { themes: themeIds.map(id => ({ id, label: id })) },
        { rooms: [] },
        { concepts: [] },
        { works: [] },
        { assets: [] },
        { mappings: [] }
    ];
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
        console: { warn() {} },
        fetch() {
            const payload = responses.shift();
            return Promise.resolve({ ok: true, json: () => Promise.resolve(payload) });
        }
    };

    runScript("atelier/living-cycle.js", context);
    runScript("js/livingExhibitions.js", context);
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(read(storage).livingExhibitions.explored, "dialogue");
    assert.equal(screen.children.length, 1);
});

test("livingSky : caractérisation hors périmètre — une corruption est encore réécrite", () => {
    const document = createDocument({ readyState: "loading" });
    document.currentScript = { src: "https://makerland.test/js/livingSky.js" };
    const storage = createStorage({ "makerland:living-cycle": "{corrompu" });
    const window = createWindow();
    window.location = { href: "https://makerland.test/" };
    const context = { Date, JSON, Math, Number, Object, Set, URL, document, localStorage: storage, window };
    const api = runScript(
        "js/livingSky.js",
        context,
        "{ rememberSkyState, state }",
        { insideIife: true }
    );
    api.state.stars = [];
    api.state.territories = [];

    api.rememberSkyState();
    assert.notEqual(storage.value("makerland:living-cycle"), "{corrompu");
    assert.ok(read(storage).livingSky);
});
