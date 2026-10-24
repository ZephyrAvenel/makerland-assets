const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
    path.join(__dirname, "..", "js", "constellation.js"),
    "utf8"
);

class FakeElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.className = "";
        this.style = {};
        this.textContent = "";
        this.href = "";
        this.download = "";
        this.clicked = false;
        this.listeners = {};
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    addEventListener(type, handler) {
        this.listeners[type] = handler;
    }

    click() {
        this.clicked = true;
    }

    set innerHTML(value) {
        this.children = [];
        this._innerHTML = value;
    }

    get innerHTML() {
        return this._innerHTML || "";
    }
}

function createStorage(initial = {}, options = {}) {
    const values = new Map(Object.entries(initial));
    const calls = { get: 0, set: 0 };

    return {
        calls,
        getItem(key) {
            calls.get += 1;
            if (options.throwOnGet) throw new Error("read unavailable");
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            calls.set += 1;
            if (options.throwOnSet) throw new Error("write unavailable");
            values.set(key, String(value));
        },
        value(key) {
            return values.has(key) ? values.get(key) : null;
        }
    };
}

function createHarness(initial = {}, options = {}) {
    const storage = createStorage(initial, options);
    const elements = new Map();
    const downloads = [];
    const document = {
        createElement(tagName) {
            const element = new FakeElement(tagName);
            if (tagName === "a") downloads.push(element);
            return element;
        },
        getElementById(id) {
            return elements.get(id) || null;
        }
    };

    const container = new FakeElement("div");
    elements.set("storiesContainer", container);

    const context = {
        Blob: class Blob {
            constructor(parts, options) {
                this.text = parts.join("");
                this.type = options.type;
            }
        },
        Date,
        JSON,
        Number,
        URL: { createObjectURL: blob => `blob:${blob.text}` },
        console: { log() {} },
        document,
        localStorage: storage
    };

    context.globalThis = context;
    vm.runInNewContext(`${source}\nglobalThis.ConstellationTestApi = Constellation;`, context);

    return {
        api: context.ConstellationTestApi,
        container,
        downloads,
        storage
    };
}

function validStories(text = "Un récit") {
    return [{
        id: 1,
        date: "2026-10-24T10:00:00.000Z",
        text,
        source: "makerland"
    }];
}

test("absence de clé : charge un tableau vide et permet l'ajout", () => {
    const harness = createHarness();

    assert.equal(harness.api.loadStories().length, 0);
    assert.equal(harness.api.saveStory("Premier texte"), true);
    assert.equal(JSON.parse(harness.storage.value("makerland_stories")).length, 1);
});

test("tableau valide : ajout, affichage, suppression et export sont préservés", () => {
    const harness = createHarness({ makerland_stories: JSON.stringify(validStories()) });

    assert.equal(harness.api.loadStories().length, 1);
    harness.api.renderStories();
    assert.equal(harness.container.children.length, 1);
    assert.equal(harness.api.saveStory("Nouveau récit"), true);
    assert.equal(harness.api.removeStory(1), true);
    harness.api.exportStories();

    const saved = JSON.parse(harness.storage.value("makerland_stories"));
    assert.equal(saved.length, 1);
    assert.equal(saved[0].text, "Nouveau récit");
    assert.equal(harness.downloads.length, 1);
    assert.equal(harness.downloads[0].download, "makerland-stories.json");
    assert.equal(harness.downloads[0].clicked, true);
});

test("lecture et affichage ne réécrivent ni la clé ni le schéma valide", () => {
    const original = validStories("Texte conservé");
    const raw = JSON.stringify(original);
    const harness = createHarness({ makerland_stories: raw });

    harness.api.loadStories();
    harness.api.renderStories();

    assert.equal(harness.storage.value("makerland_stories"), raw);
    assert.equal(harness.storage.calls.set, 0);
    assert.equal(harness.api.loadStories()[0].id, 1);
    assert.equal(harness.api.loadStories()[0].date, "2026-10-24T10:00:00.000Z");
    assert.equal(harness.api.loadStories()[0].source, "makerland");
});

test("Unicode et retours à la ligne restent du texte lisible", () => {
    const text = "Étoile 🌙\nDeuxième ligne";
    const harness = createHarness({ makerland_stories: JSON.stringify(validStories(text)) });

    harness.api.loadStories();
    harness.api.renderStories();

    const storyText = harness.container.children[0].children[0];
    assert.equal(storyText.textContent, text);
    assert.equal(storyText.style.whiteSpace, "pre-wrap");
});

for (const dangerousText of [
    "<b>balise</b>",
    "<img src=x onerror=alert(1)>",
    "<script>throw new Error('xss')</script>"
]) {
    test(`contenu dangereux rendu littéralement : ${dangerousText.slice(0, 18)}`, () => {
        const harness = createHarness({ makerland_stories: JSON.stringify(validStories(dangerousText)) });

        harness.api.loadStories();
        harness.api.renderStories();

        const card = harness.container.children[0];
        const storyText = card.children[0];
        assert.equal(card.children.length, 2);
        assert.equal(storyText.textContent, dangerousText);
        assert.equal(storyText.children.length, 0);
    });
}

test("JSON syntaxiquement invalide ne bloque pas le rendu et reste intact", () => {
    const raw = "{pas du JSON";
    const harness = createHarness({ makerland_stories: raw });

    assert.equal(harness.api.loadStories().length, 0);
    assert.doesNotThrow(() => harness.api.renderStories());
    assert.equal(harness.api.saveStory("Ne doit pas écraser"), false);
    assert.equal(harness.storage.value("makerland_stories"), raw);
    assert.equal(harness.storage.calls.set, 0);
});

test("une chaîne vide existante est considérée comme corrompue et reste intacte", () => {
    const harness = createHarness({ makerland_stories: "" });

    assert.equal(harness.api.loadStories().length, 0);
    assert.equal(harness.api.saveStory("Ne doit pas écraser"), false);
    assert.equal(harness.storage.value("makerland_stories"), "");
    assert.equal(harness.storage.calls.set, 0);
});

test("JSON valide mais structure incorrecte est préservé et verrouille les écritures", () => {
    const raw = JSON.stringify({ stories: validStories() });
    const harness = createHarness({ makerland_stories: raw });

    assert.equal(harness.api.loadStories().length, 0);
    assert.equal(harness.api.clearStories(), false);
    assert.equal(harness.storage.value("makerland_stories"), raw);
    assert.equal(harness.storage.calls.set, 0);
});

test("un échec de lecture verrouille les écritures sans accéder à un stockage réel", () => {
    const harness = createHarness({}, { throwOnGet: true });

    assert.equal(harness.api.loadStories().length, 0);
    assert.equal(harness.api.saveStory("Ne doit pas être écrit"), false);
    assert.equal(harness.storage.calls.set, 0);
});
