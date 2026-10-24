const assert = require("node:assert/strict");
const test = require("node:test");
const {
    FakeElement,
    createDocument,
    createStorage,
    createWindow,
    runScript
} = require("./memory-test-helpers");

function read(storage, key) {
    return JSON.parse(storage.value(key));
}

function narrativeHarness(initial = {}, options = {}) {
    const storage = createStorage(initial, options);
    const window = { localStorage: storage };
    const api = runScript("js/narrativeMemory.js", {
        Date,
        JSON,
        Math,
        Number,
        Set,
        window
    }, "NarrativeMemory");
    return { api, storage };
}

test("narrativeMemory : premier chargement crée une mémoire de repli sans écriture", () => {
    const { api, storage } = narrativeHarness();
    const memory = api.getMemory();

    assert.equal(memory.visitCount, 0);
    assert.equal(memory.firstVisit, null);
    assert.equal(memory.directionHistory.length, 0);
    assert.equal(storage.calls.set, 0);
});

test("narrativeMemory : visites, orientations et dates persistent au retour", () => {
    const { api, storage } = narrativeHarness();

    api.rememberVisit({ weather: "brouillard", direction: "explorer" });
    api.rememberVisit({ direction: "creer" });
    const first = read(storage, "makerland.narrativeMemory.v1");

    assert.equal(first.visitCount, 2);
    assert.equal(first.lastWeather, "brouillard");
    assert.equal(first.lastDirection, "creer");
    assert.equal(first.directionHistory.length, 2);
    assert.match(first.firstVisit, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(first.milestones.includes("first_visit"), true);

    const returned = narrativeHarness({ "makerland.narrativeMemory.v1": storage.value("makerland.narrativeMemory.v1") });
    assert.equal(returned.api.getMemory().visitCount, 2);
    assert.equal(returned.api.getMemory().directionHistory[0].value, "explorer");
});

test("narrativeMemory : les historiques sont bornés à 24 entrées", () => {
    const { api, storage } = narrativeHarness();

    for (let index = 0; index < 25; index += 1) {
        api.rememberDirection(`direction-${index}`);
    }

    const memory = read(storage, "makerland.narrativeMemory.v1");
    assert.equal(memory.directionHistory.length, 24);
    assert.equal(memory.directionHistory[0].value, "direction-1");
    assert.equal(memory.lastDirection, "direction-24");
});

test("narrativeMemory : JSON corrompu donne une mémoire de repli sans réécriture immédiate", () => {
    const raw = "{corrompu";
    const { api, storage } = narrativeHarness({ "makerland.narrativeMemory.v1": raw });

    assert.equal(api.getMemory().visitCount, 0);
    assert.equal(storage.value("makerland.narrativeMemory.v1"), raw);
    assert.equal(storage.calls.set, 0);
});

test("narrativeMemory : une écriture indisponible laisse le parcours utilisable en mémoire", () => {
    const { api, storage } = narrativeHarness({}, { throwOnSet: true });
    const memory = api.rememberWeather("tempete");

    assert.equal(memory.lastWeather, "tempete");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), null);
});

test("narrativeMemory : une action après JSON corrompu préserve la valeur sans récupération explicite", () => {
    const raw = "{corrompu";
    const { api, storage } = narrativeHarness({ "makerland.narrativeMemory.v1": raw });

    const memory = api.rememberDirection("explorer");
    assert.equal(memory.lastDirection, "explorer");
    assert.equal(storage.value("makerland.narrativeMemory.v1"), raw);
    assert.equal(storage.calls.set, 0);
});

test("narrativeMemory : une mémoire historique incomplète et ses propriétés inconnues sont préservées", () => {
    const initial = JSON.stringify({ visitCount: 2, customLegacyNote: "à garder" });
    const { api, storage } = narrativeHarness({ "makerland.narrativeMemory.v1": initial });

    api.rememberWeather("brouillard");
    const memory = read(storage, "makerland.narrativeMemory.v1");
    assert.equal(memory.visitCount, 2);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.equal(memory.lastWeather, "brouillard");
});

test("narrativeMemory : une structure racine ou un champ connu ambigu reste intact", () => {
    const rootRaw = "[]";
    const root = narrativeHarness({ "makerland.narrativeMemory.v1": rootRaw });
    root.api.rememberVisit();
    assert.equal(root.storage.value("makerland.narrativeMemory.v1"), rootRaw);

    const fieldRaw = JSON.stringify({ weatherHistory: "brouillard" });
    const field = narrativeHarness({ "makerland.narrativeMemory.v1": fieldRaw });
    field.api.rememberWeather("tempete");
    assert.equal(field.storage.value("makerland.narrativeMemory.v1"), fieldRaw);
});

test("narrativeMemory : lecture indisponible bloque toute écriture fondée sur un repli", () => {
    const { api, storage } = narrativeHarness({}, { throwOnGet: true });
    api.rememberVisit({ direction: "explorer" });
    assert.equal(storage.calls.set, 0);
});

test("narrativeMemory : une écriture obsolète est refusée sans effacer la valeur récente", () => {
    const { api, storage } = narrativeHarness({
        "makerland.narrativeMemory.v1": JSON.stringify({ visitCount: 1 })
    });
    const getItem = storage.getItem.bind(storage);
    let reads = 0;
    storage.getItem = key => {
        reads += 1;

        if (key === "makerland.narrativeMemory.v1" && reads === 2) {
            storage.setItem(key, JSON.stringify({ visitCount: 7, customLegacyNote: "récent" }));
        }

        return getItem(key);
    };

    api.rememberVisit();
    assert.deepEqual(read(storage, "makerland.narrativeMemory.v1"), {
        visitCount: 7,
        customLegacyNote: "récent"
    });
});

test("narrativeMemory : reset reste une suppression explicite limitée à sa clé", () => {
    const { api, storage } = narrativeHarness({
        "makerland.narrativeMemory.v1": JSON.stringify({ visitCount: 1 }),
        "makerland_living_journey": JSON.stringify({ visited: {} })
    });
    api.reset();
    assert.equal(storage.value("makerland.narrativeMemory.v1"), null);
    assert.equal(storage.value("makerland_living_journey"), JSON.stringify({ visited: {} }));
});

function livingJourneyHarness(initial = {}, options = {}) {
    const storage = createStorage(initial, options);
    const document = createDocument();
    const window = createWindow();
    ["e03_boussole", "e06_fiction"].forEach(id => document.setElement(id, new FakeElement("section")));
    const api = runScript("js/livingJourney.js", {
        JSON,
        Math,
        Object,
        document,
        localStorage: storage,
        window
    }, "LivingJourney");
    document.dispatch("DOMContentLoaded");
    return { api, document, storage, window };
}

test("livingJourney : les lieux connus, le dernier écran et le dernier lieu persistent", () => {
    const { document, storage, window } = livingJourneyHarness();

    window.dispatch("screenChanged", { screen: "e03_boussole" });
    window.dispatch("screenChanged", { screen: "e03_boussole" });
    window.dispatch("screenChanged", { screen: "e06_fiction" });
    const memory = read(storage, "makerland_living_journey");

    assert.deepEqual(memory.visited, { boussole: 2, bibliotheque: 1 });
    assert.equal(memory.lastScreen, "e06_fiction");
    assert.equal(memory.lastPlace, "bibliotheque");
    assert.equal(document.body.dataset.journeyPlace, "bibliotheque");
});

test("livingJourney : un écran hors cartographie ne crée pas de mémoire", () => {
    const { storage, window } = livingJourneyHarness();

    window.dispatch("screenChanged", { screen: "e99_inconnu" });
    assert.equal(storage.value("makerland_living_journey"), null);
});

test("livingJourney : JSON corrompu reste intact après navigation", () => {
    const raw = "{corrompu";
    const { storage, window } = livingJourneyHarness({ makerland_living_journey: raw });

    window.dispatch("screenChanged", { screen: "e03_boussole" });
    assert.equal(storage.value("makerland_living_journey"), raw);
    assert.equal(storage.calls.set, 0);
});

test("livingJourney : stockage indisponible ne bloque pas le changement d’écran", () => {
    const { window } = livingJourneyHarness({}, { throwOnGet: true, throwOnSet: true });

    assert.doesNotThrow(() => window.dispatch("screenChanged", { screen: "e03_boussole" }));
});

test("livingJourney : une mémoire ancienne sans visited reste lisible et peut reprendre l’écriture", () => {
    const { storage, window } = livingJourneyHarness({
        makerland_living_journey: JSON.stringify({ lastScreen: "e01_accueil" })
    });

    assert.doesNotThrow(() => window.dispatch("screenChanged", { screen: "e03_boussole" }));
    const memory = read(storage, "makerland_living_journey");
    assert.equal(memory.lastScreen, "e03_boussole");
    assert.equal(memory.visited.boussole, 1);
});

test("livingJourney : un visited de type inattendu reste intact et bloque les écritures", () => {
    const raw = JSON.stringify({ visited: [], lastScreen: "e01_accueil" });
    const { storage, window } = livingJourneyHarness({ makerland_living_journey: raw });

    assert.doesNotThrow(() => window.dispatch("screenChanged", { screen: "e03_boussole" }));
    assert.equal(storage.value("makerland_living_journey"), raw);
    assert.equal(storage.calls.set, 0);
});

test("livingJourney : un échec d’écriture laisse une mémoire valide inchangée", () => {
    const raw = JSON.stringify({ visited: { boussole: 1 }, lastScreen: "e03_boussole", lastPlace: "boussole" });
    const { storage, window } = livingJourneyHarness({ makerland_living_journey: raw }, { throwOnSet: true });

    assert.doesNotThrow(() => window.dispatch("screenChanged", { screen: "e03_boussole" }));
    assert.equal(storage.value("makerland_living_journey"), raw);
});

function firstJourneyHarness(initial = {}) {
    const storage = createStorage(initial);
    const document = createDocument();
    const window = createWindow();
    const navigation = { destinations: [], goTo(screen) { this.destinations.push(screen); } };
    runScript("js/firstJourney.js", {
        Date,
        JSON,
        Navigation: navigation,
        Number,
        Object,
        String,
        document,
        localStorage: storage,
        window
    });
    document.dispatch("DOMContentLoaded");
    const root = document.getElementById("app").children[0];
    return { document, navigation, root, storage };
}

test("firstJourney : premier voyage guidé crée une traversée en cours", () => {
    const { root, storage, navigation } = firstJourneyHarness();

    root.querySelector("[data-first-journey-start]").click();
    const memory = read(storage, "makerland.firstJourney");

    assert.equal(memory.choice, "guided");
    assert.equal(memory.active, true);
    assert.equal(memory.completed, false);
    assert.equal(memory.phase, "steps");
    assert.equal(memory.step, 0);
    assert.equal(navigation.destinations[0], "e02_meteo");
});

test("firstJourney : explorer librement conserve un choix sans traversée active", () => {
    const { root, storage } = firstJourneyHarness();

    root.querySelector("[data-first-journey-free]").click();
    const memory = read(storage, "makerland.firstJourney");

    assert.equal(memory.choice, "free");
    assert.equal(memory.active, false);
    assert.equal(memory.completed, false);
    assert.match(memory.dismissedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("firstJourney : sept étapes mènent à une traversée terminée", () => {
    const { root, storage } = firstJourneyHarness();

    root.querySelector("[data-first-journey-start]").click();
    for (let index = 0; index < 6; index += 1) {
        root.querySelector("[data-first-journey-next]").click();
    }
    root.querySelector("[data-first-journey-finish]").click();
    const memory = read(storage, "makerland.firstJourney");

    assert.equal(memory.active, false);
    assert.equal(memory.completed, true);
    assert.equal(memory.version, 1);
    assert.match(memory.completedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("firstJourney : une traversée ouverte reprend son étape après rechargement", () => {
    const initial = {
        choice: "guided",
        active: true,
        completed: false,
        phase: "steps",
        step: 3,
        startedAt: "2026-10-24T10:00:00.000Z"
    };
    const { document, navigation, storage } = firstJourneyHarness({
        "makerland.firstJourney": JSON.stringify(initial)
    });

    document.dispatch("makerland:firstJourney:resume");
    const memory = read(storage, "makerland.firstJourney");

    assert.equal(memory.step, 3);
    assert.equal(memory.active, true);
    assert.equal(navigation.destinations.at(-1), "e05_cartes");
});

test("firstJourney : une étape ancienne hors limites est ramenée à la première étape", () => {
    const { document, navigation, storage } = firstJourneyHarness({
        "makerland.firstJourney": JSON.stringify({
            choice: "guided",
            active: true,
            completed: false,
            phase: "steps",
            step: 99
        })
    });

    document.dispatch("makerland:firstJourney:resume");
    assert.equal(read(storage, "makerland.firstJourney").step, 0);
    assert.equal(navigation.destinations.at(-1), "e02_meteo");
});

test("firstJourney : recommencer après une traversée terminée remplace l’unique état actuel", () => {
    const initial = {
        choice: "guided",
        active: false,
        completed: true,
        step: 6,
        startedAt: "2026-10-24T10:00:00.000Z",
        completedAt: "2026-10-24T11:00:00.000Z"
    };
    const { document, storage } = firstJourneyHarness({
        "makerland.firstJourney": JSON.stringify(initial)
    });

    document.dispatch("makerland:firstJourney:resume");
    const memory = read(storage, "makerland.firstJourney");

    assert.equal(memory.active, true);
    assert.equal(memory.completed, false);
    assert.equal(memory.step, 0);
    assert.equal(memory.startedAt, initial.startedAt);
    assert.equal(memory.completedAt, undefined);
});

test("firstJourney : une autre mémoire de parcours masque l’accueil guidé", () => {
    const { root } = firstJourneyHarness({
        makerland_living_journey: JSON.stringify({ visited: { atelier: 1 } })
    });

    assert.equal(root.innerHTML, "");
});

test("firstJourney : JSON corrompu reste intact tant qu’aucune action ne réécrit la traversée", () => {
    const raw = "{corrompu";
    const { storage } = firstJourneyHarness({ "makerland.firstJourney": raw });

    assert.equal(storage.value("makerland.firstJourney"), raw);
    assert.equal(storage.calls.set, 0);
});

test.todo("firstJourney : recommencer devrait préserver plusieurs souvenirs plutôt qu’écraser l’unique état");

function livingCycleHarness(initial = {}, bodyDataset = {}) {
    const storage = createStorage(initial);
    const document = createDocument({ readyState: "complete", bodyDataset });
    runScript("atelier/living-cycle.js", {
        Date,
        JSON,
        Math,
        Number,
        Set,
        document,
        localStorage: storage
    });
    return { document, storage };
}

test("living-cycle : une page Atelier crée une trace de lieu, salle, date et jalon", () => {
    const { storage } = livingCycleHarness({}, { cycleType: "atelier", cyclePage: "dialogue" });
    const memory = read(storage, "makerland:living-cycle");

    assert.equal(memory.visitedPlaces[0].id, "atelier:dialogue");
    assert.equal(memory.visitedPlaceIds[0], "atelier:dialogue");
    assert.equal(memory.atelierRooms[0], "dialogue");
    assert.equal(memory.milestones[0], "Dialogue explore");
    assert.match(memory.visitedPlaces[0].firstSeen, /^\d{4}-\d{2}-\d{2}T/);
});

test("living-cycle : revoir un lieu conserve sa première date et marque le retour", () => {
    const first = livingCycleHarness({}, { cycleType: "constellation", cyclePage: "transmission" });
    const before = read(first.storage, "makerland:living-cycle");
    const second = livingCycleHarness({ "makerland:living-cycle": first.storage.value("makerland:living-cycle") }, {
        cycleType: "constellation",
        cyclePage: "transmission"
    });
    const after = read(second.storage, "makerland:living-cycle");

    assert.equal(after.visitedPlaces.length, 1);
    assert.equal(after.visitedPlaces[0].firstSeen, before.visitedPlaces[0].firstSeen);
    assert.equal(after.currentPlaceWasKnown, true);
    assert.equal(after.constellationFragments[0], "transmission");
});

test("living-cycle : les traces d’objets Atelier existantes sont conservées lors d’une visite", () => {
    const initial = {
        atelierObjectIds: ["carnet-dialogue"],
        atelierObjects: 1
    };
    const { storage } = livingCycleHarness({
        "makerland:living-cycle": JSON.stringify(initial)
    }, { cycleType: "atelier", cyclePage: "dialogue" });
    const memory = read(storage, "makerland:living-cycle");

    assert.deepEqual(memory.atelierObjectIds, ["carnet-dialogue"]);
    assert.equal(memory.atelierObjects, 1);
    assert.equal(memory.lastVisitedPlace, "atelier:dialogue");
});

test("living-cycle : JSON corrompu reste intact à l’initialisation", () => {
    const raw = "{corrompu";
    const { storage } = livingCycleHarness({ "makerland:living-cycle": raw }, {
        cycleType: "atelier",
        cyclePage: "atelier"
    });

    assert.equal(storage.value("makerland:living-cycle"), raw);
    assert.equal(storage.calls.set, 0);
});

test("living-cycle : une écriture indisponible n’interrompt pas l’initialisation", () => {
    const storage = createStorage({}, { throwOnSet: true });
    const document = createDocument({
        readyState: "complete",
        bodyDataset: { cycleType: "atelier", cyclePage: "dialogue" }
    });

    assert.doesNotThrow(() => runScript("atelier/living-cycle.js", {
        Date,
        JSON,
        Math,
        Number,
        Set,
        document,
        localStorage: storage
    }));
    assert.equal(storage.value("makerland:living-cycle"), null);
});

test("living-cycle : une structure incomplète conserve ses champs reconnus et reprend une visite", () => {
    const initial = { customLegacyNote: "à préserver", lastVisitedPlace: "atelier:atelier" };
    const { storage } = livingCycleHarness({
        "makerland:living-cycle": JSON.stringify(initial)
    }, { cycleType: "atelier", cyclePage: "dialogue" });
    const memory = read(storage, "makerland:living-cycle");

    assert.equal(memory.customLegacyNote, "à préserver");
    assert.equal(memory.lastVisitedPlace, "atelier:dialogue");
    assert.equal(memory.visitedPlaceIds[0], "atelier:dialogue");
});

test("living-cycle : un tableau de type inattendu reste intact et bloque l’écriture", () => {
    const raw = JSON.stringify({ visitedPlaces: "inattendu" });
    const { storage } = livingCycleHarness({
        "makerland:living-cycle": raw
    }, { cycleType: "atelier", cyclePage: "dialogue" });

    assert.equal(storage.value("makerland:living-cycle"), raw);
    assert.equal(storage.calls.set, 0);
});

test("living-cycle : une entrée de lieu ambiguë reste intacte et bloque l’écriture", () => {
    const raw = JSON.stringify({ visitedPlaces: [null] });
    const { storage } = livingCycleHarness({
        "makerland:living-cycle": raw
    }, { cycleType: "atelier", cyclePage: "dialogue" });

    assert.equal(storage.value("makerland:living-cycle"), raw);
    assert.equal(storage.calls.set, 0);
});

test("living-cycle : un échec de lecture bloque l’écriture automatique", () => {
    const storage = createStorage({}, { throwOnGet: true });
    const document = createDocument({
        readyState: "complete",
        bodyDataset: { cycleType: "atelier", cyclePage: "dialogue" }
    });

    assert.doesNotThrow(() => runScript("atelier/living-cycle.js", {
        Date,
        JSON,
        Math,
        Number,
        Set,
        document,
        localStorage: storage
    }));
    assert.equal(storage.calls.set, 0);
});
