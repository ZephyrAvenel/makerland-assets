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
    const targets = new Map();
    const document = createDocument({
        readyState: "loading",
        querySelector(selector) {
            return targets.get(selector) || null;
        }
    });
    const storage = createStorage(initial, options);
    const window = createWindow();
    const context = {
        Date,
        JSON,
        Math,
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
        "carnet/carnet.js",
        context,
        "{ createCard, init, readLivingCycle, rememberCarnet, renderDialogues, renderFirstSteps, renderGuardianWords }",
        { insideIife: true }
    );

    return { api, context, document, storage, targets, window };
}

function objectsApi(harness) {
    return runScript(
        "atelier/atelier-objects.js",
        harness.context,
        "{ updateCycleMemory }",
        { insideIife: true }
    );
}

test("Carnet : une clé absente crée la trace du Carnet avec la politique partagée", () => {
    const harness = createHarness();
    harness.document.dispatch("DOMContentLoaded");

    const memory = read(harness.storage);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.deepEqual(memory.milestones, ["Carnet ouvert"]);
    assert.equal(memory.visitedPlaces[0].id, "carnet:carnet");
});

test("Carnet : une mémoire valide ou historiquement incomplète préserve les champs existants", () => {
    const initial = {
        customLegacyNote: "à garder",
        atelierObjectIds: ["brouillon"],
        travelingFragments: ["Une trace"],
        dialogues: ["D001"]
    };
    const harness = createHarness({ "makerland:living-cycle": JSON.stringify(initial) });
    harness.api.rememberCarnet();

    const memory = read(harness.storage);
    assert.equal(memory.customLegacyNote, "à garder");
    assert.deepEqual(memory.atelierObjectIds, ["brouillon"]);
    assert.deepEqual(memory.travelingFragments, ["Une trace"]);
    assert.deepEqual(memory.dialogues, ["D001"]);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
});

test("Carnet : JSON invalide ou structure ambiguë reste intact sans écriture", () => {
    const raw = "{corrompu";
    const corrupted = createHarness({ "makerland:living-cycle": raw });
    corrupted.document.dispatch("DOMContentLoaded");
    assert.equal(corrupted.storage.value("makerland:living-cycle"), raw);
    assert.equal(corrupted.storage.calls.set, 0);

    const ambiguousRaw = JSON.stringify({ visitedPlaces: "pas un tableau" });
    const ambiguous = createHarness({ "makerland:living-cycle": ambiguousRaw });
    ambiguous.document.dispatch("DOMContentLoaded");
    assert.equal(ambiguous.storage.value("makerland:living-cycle"), ambiguousRaw);
    assert.equal(ambiguous.storage.calls.set, 0);
});

test("Carnet : lecture ou écriture impossible ne déclenche pas de remplacement", () => {
    const unreadable = createHarness({}, { throwOnGet: true });
    unreadable.api.rememberCarnet();
    assert.equal(unreadable.storage.calls.set, 0);

    const raw = JSON.stringify({ customLegacyNote: "à garder" });
    const unwritable = createHarness(
        { "makerland:living-cycle": raw },
        { throwOnSet: true }
    );
    unwritable.api.rememberCarnet();
    assert.equal(unwritable.storage.value("makerland:living-cycle"), raw);
});

test("Carnet : sans politique commune, aucune écriture de cycle n'est tentée", () => {
    const harness = createHarness({}, { withoutPolicy: true });
    harness.api.rememberCarnet();
    assert.equal(harness.storage.value("makerland:living-cycle"), null);
    assert.equal(harness.storage.calls.set, 0);
});

test("Carnet et Atelier : les écritures séquentielles conservent les contributions mutuelles", () => {
    const atelierThenCarnet = createHarness();
    assert.equal(objectsApi(atelierThenCarnet).updateCycleMemory("brouillon"), true);
    atelierThenCarnet.api.rememberCarnet();
    assert.deepEqual(read(atelierThenCarnet.storage).atelierObjectIds, ["brouillon"]);

    const carnetThenAtelier = createHarness();
    carnetThenAtelier.api.rememberCarnet();
    assert.equal(objectsApi(carnetThenAtelier).updateCycleMemory("annotation"), true);
    const memory = read(carnetThenAtelier.storage);
    assert.deepEqual(memory.visitedPlaceIds, ["carnet:carnet"]);
    assert.deepEqual(memory.atelierObjectIds, ["annotation"]);
});

test("politique commune : le Carnet refuse une écriture devenue obsolète", () => {
    const harness = createHarness({
        "makerland:living-cycle": JSON.stringify({ customLegacyNote: "à garder" })
    });
    const storage = harness.window.MakerlandLivingCycleStorage;
    const stale = storage.read();
    const newer = storage.read();
    newer.memory.atelierObjectIds = ["brouillon"];

    assert.equal(storage.write(newer.memory, newer.raw), true);
    stale.memory.visitedPlaceIds = ["carnet:carnet"];
    assert.equal(storage.write(stale.memory, stale.raw), false);
    assert.deepEqual(read(harness.storage), {
        customLegacyNote: "à garder",
        atelierObjectIds: ["brouillon"]
    });
});

test("Carnet : les textes locaux dangereux restent textuels dans les cartes et premières étapes", () => {
    const harness = createHarness();
    const payload = "<img src=x onerror=alert(1)>\n<script>alerte()</script> \"éè\"";
    const card = harness.api.createCard("<b>titre</b>", [payload]);

    assert.equal(card.innerHTML, "");
    assert.equal(card.children[0].tagName, "h3");
    assert.equal(card.children[0].textContent, "<b>titre</b>");
    assert.equal(card.children[1].children[0].textContent, payload);

    const target = harness.document.createElement("section");
    harness.targets.set("[data-journal-first-steps]", target);
    harness.api.renderFirstSteps({
        visitedPlaces: [{ id: "inconnu", label: payload }]
    });
    assert.equal(target.innerHTML, "");
    assert.equal(target.children[1].textContent, "Puis vous avez decouvert " + payload + ".");
});

test("Carnet : les titres de dialogue, paroles et URL locales non fiables ne créent pas de HTML actif", () => {
    const harness = createHarness({
        "makerland.guardianEncounters.v1": JSON.stringify({
            encounters: [{
                illustration: "<img src=x onerror=alert(1)>",
                guardianName: "<b>Gardien</b>",
                whisper: "<script>alerte()</script>",
                territoryLabel: "\"Territoire\"",
                territoryHref: "javascript:alert(1)",
                firstEncounteredAt: "2026-10-24T12:00:00.000Z"
            }]
        })
    });
    const guardianTarget = harness.document.createElement("section");
    const dialogueTarget = harness.document.createElement("section");
    harness.targets.set("[data-journal-guardian-words]", guardianTarget);
    harness.targets.set("[data-journal-dialogues]", dialogueTarget);

    harness.api.renderGuardianWords();
    harness.api.renderDialogues({
        archiveDialogs: { D001: { title: "<img src=x onerror=alert(1)>" } }
    });

    const guardian = guardianTarget.children[0];
    assert.equal(guardian.innerHTML, "");
    assert.equal(guardian.children[1].textContent, "<img src=x onerror=alert(1)>");
    assert.equal(guardian.children[2].textContent, "<b>Gardien</b>");
    assert.equal(guardian.children[3].textContent, "<script>alerte()</script>");
    assert.equal(guardian.children[5].getAttribute("href"), "../index.html");

    const dialogue = dialogueTarget.children[0];
    assert.equal(dialogue.innerHTML, "");
    assert.equal(dialogue.children[1].textContent, "<img src=x onerror=alert(1)>");
});

test("Carnet : une rencontre locale incomplète ne bloque pas le rendu", () => {
    const harness = createHarness({
        "makerland.guardianEncounters.v1": JSON.stringify({
            encounters: [null, { territoryHref: { unexpected: true } }]
        })
    });
    const target = harness.document.createElement("section");
    harness.targets.set("[data-journal-guardian-words]", target);

    assert.doesNotThrow(() => harness.api.renderGuardianWords());
    assert.equal(target.children[1].children[5].getAttribute("href"), "../index.html");
});
