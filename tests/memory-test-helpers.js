const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeClassList {
    constructor() {
        this.values = new Set();
    }

    add(...names) {
        names.forEach(name => this.values.add(name));
    }

    remove(...names) {
        names.forEach(name => this.values.delete(name));
    }

    contains(name) {
        return this.values.has(name);
    }
}

class FakeElement {
    constructor(tagName = "div") {
        this.tagName = tagName;
        this.children = [];
        this.className = "";
        this.classList = new FakeClassList();
        this.dataset = {};
        this.style = {
            values: {},
            setProperty(name, value) {
                this.values[name] = value;
            }
        };
        this.listeners = {};
        this.attributes = {};
        this.textContent = "";
        this._innerHTML = "";
        this.offsetWidth = 0;
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    addEventListener(type, callback) {
        this.listeners[type] = callback;
    }

    click() {
        if (this.listeners.click) this.listeners.click({ target: this });
    }

    set innerHTML(value) {
        this._innerHTML = value;
        this.children = [];
        this.selectorElements = new Map();
        const matches = String(value).match(/data-first-journey-[a-z-]+/g) || [];
        matches.forEach(attribute => {
            this.selectorElements.set(`[${attribute}]`, new FakeElement("button"));
        });
    }

    get innerHTML() {
        return this._innerHTML;
    }

    querySelector(selector) {
        return this.selectorElements && this.selectorElements.get(selector) || null;
    }
}

function createStorage(initial = {}, options = {}) {
    const values = new Map(Object.entries(initial));
    const calls = { get: 0, set: 0, remove: 0, setKeys: [] };

    return {
        calls,
        getItem(key) {
            calls.get += 1;
            if (options.throwOnGet) throw new Error("storage read unavailable");
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            calls.set += 1;
            calls.setKeys.push(key);
            if (options.throwOnSet) throw new Error("storage write unavailable");
            values.set(key, String(value));
        },
        removeItem(key) {
            calls.remove += 1;
            values.delete(key);
        },
        value(key) {
            return values.has(key) ? values.get(key) : null;
        }
    };
}

function createEventTarget() {
    const listeners = new Map();

    return {
        addEventListener(type, callback) {
            const callbacks = listeners.get(type) || [];
            callbacks.push(callback);
            listeners.set(type, callbacks);
        },
        dispatch(type, detail = {}) {
            (listeners.get(type) || []).forEach(callback => callback({
                detail,
                key: detail.key,
                target: detail.target
            }));
        }
    };
}

function createDocument(options = {}) {
    const events = createEventTarget();
    const elements = new Map();
    const body = new FakeElement("body");
    body.dataset = { ...(options.bodyDataset || {}) };
    const app = new FakeElement("main");
    elements.set("app", app);

    return {
        ...events,
        body,
        readyState: options.readyState || "loading",
        createElement(tagName) {
            return new FakeElement(tagName);
        },
        createTextNode(value) {
            const node = new FakeElement("#text");
            node.textContent = String(value);
            return node;
        },
        getElementById(id) {
            return elements.get(id) || null;
        },
        setElement(id, element) {
            elements.set(id, element);
        },
        querySelector(selector) {
            if (options.querySelector) return options.querySelector(selector);
            return null;
        },
        querySelectorAll() {
            return [];
        }
    };
}

function source(relativePath) {
    return fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
}

function runScript(relativePath, context, exportExpression, options = {}) {
    context.globalThis = context;
    let script = source(relativePath);

    if (exportExpression && options.insideIife) {
        script = script.replace(
            /\}\)\(\);\s*$/,
            `globalThis.__testApi = ${exportExpression};\n})();`
        );
    } else if (exportExpression) {
        script += `\nglobalThis.__testApi = ${exportExpression};`;
    }

    vm.runInNewContext(script, context);
    return context.__testApi;
}

function createWindow(options = {}) {
    const events = createEventTarget();
    const timers = [];

    return {
        ...events,
        setTimeout(callback) {
            timers.push(callback);
            callback();
            return timers.length;
        },
        clearTimeout() {},
        timers
    };
}

module.exports = {
    FakeElement,
    createDocument,
    createStorage,
    createWindow,
    runScript
};
