(function () {
    const MEMORY_KEY = "makerland.living.paths";
    const CYCLE_KEY = "makerland:living-cycle";
    const SCRIPT_URL = document.currentScript
        ? document.currentScript.src
        : window.location.href;

    const DATA_PATHS = {
        paths: new URL("../data/living-paths.json", SCRIPT_URL).href,
        graph: new URL("../data/living-graph.json", SCRIPT_URL).href,
        concepts: new URL("../data/concept-network.json", SCRIPT_URL).href,
        works: new URL("../data/work-network.json", SCRIPT_URL).href,
        mapping: new URL("../data/archive-mapping.json", SCRIPT_URL).href
    };

    const state = {
        data: null,
        paths: [],
        activeId: "decouvrir",
        elements: {},
        memory: null
    };

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Chemins Vivants : impossible de charger " + path);
            }
            return response.json();
        });
    }

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            return;
        }
    }

    function unique(values) {
        return Array.from(new Set((values || []).filter(Boolean)));
    }

    function cleanTitle(value) {
        return String(value || "")
            .replace(/\.(png|jpe?g|gif|webp|svg)$/i, "")
            .replace(/^COUVERTURE[-_\s]*/i, "")
            .replace(/^Couverture\s*-\s*/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function readMemory() {
        const memory = readJson(MEMORY_KEY, {});
        memory.started = Array.isArray(memory.started) ? memory.started : [];
        memory.completed = Array.isArray(memory.completed) ? memory.completed : [];
        memory.steps = memory.steps && typeof memory.steps === "object" ? memory.steps : {};
        memory.resources = memory.resources && typeof memory.resources === "object" ? memory.resources : {
            archives: [],
            works: [],
            concepts: [],
            constellations: []
        };
        return memory;
    }

    function writeMemory() {
        writeJson(MEMORY_KEY, state.memory);
    }

    function currentSeason() {
        const cycle = readJson(CYCLE_KEY, {});
        return cycle.currentSeason || "";
    }

    function chooseInitialPath(paths) {
        const season = currentSeason();
        const seasonal = paths.find(path => path.seasonPriority === season);
        if (seasonal) return seasonal.id;
        return paths[0] ? paths[0].id : "decouvrir";
    }

    function labelFor(id) {
        if (!id) return "";
        if (/^D\d{3}$/.test(id)) {
            const archive = state.data.mapping.mappings.find(item => item.id === id);
            return archive ? id + " - " + archive.label : id;
        }
        if (/^BOOK-/.test(id)) {
            const work = state.data.works.works.find(item => item.id === id);
            return work ? cleanTitle(work.title) : id;
        }
        if (/^CON-/.test(id)) {
            const concept = state.data.concepts.concepts.find(item => item.id === id);
            return concept ? concept.name : id;
        }
        if (/^ROOM-/.test(id)) {
            const room = (state.data.graph.rooms || []).find(item => item.id === id);
            return room ? room.name : id;
        }
        return id;
    }

    function resolveStep(step) {
        const hints = step.resourceHints || [];
        const resolved = Object.assign({}, step, {
            resources: hints.map(id => ({
                id,
                label: labelFor(id)
            }))
        });
        return withResolvedDestination(resolved);
    }

    function withResolvedDestination(step) {
        if (step.target || step.href) {
            return step;
        }

        const firstHint = (step.resourceHints || [])[0] || "";

        if (step.kind === "archive" && /^D\d{3}$/.test(firstHint)) {
            return Object.assign({}, step, {
                href: "atelier/archives/" + firstHint.toLowerCase() + ".html"
            });
        }

        if (step.kind === "concept") {
            return Object.assign({}, step, { href: "constellation/vivante/" });
        }

        if (step.kind === "work") {
            return Object.assign({}, step, { target: "e06_fiction" });
        }

        if (step.kind === "image") {
            return Object.assign({}, step, { href: "docs/patrimoine/IMAGE_CATALOG.md" });
        }

        if (step.kind === "figure") {
            return Object.assign({}, step, { href: "docs/patrimoine/FIGURE_CATALOG.md" });
        }

        return step;
    }

    function buildPaths() {
        state.paths = state.data.paths.paths.map(path => {
            const steps = path.steps.map(resolveStep);
            const resources = unique(steps.flatMap(step => (step.resourceHints || [])));
            return Object.assign({}, path, {
                steps,
                resources
            });
        });
        state.activeId = state.memory.activePath || chooseInitialPath(state.paths);
    }

    function buildLayer() {
        const screen = document.getElementById("e08_constellation");
        if (!screen || screen.querySelector("[data-living-paths]")) {
            return;
        }

        const layer = document.createElement("aside");
        layer.className = "living-paths";
        layer.setAttribute("data-living-paths", "");
        layer.setAttribute("aria-label", "Chemins Vivants");
        layer.innerHTML = [
            "<section class=\"living-paths__entry\" data-path-entry></section>",
            "<section class=\"living-paths__panel\" data-path-panel>",
            "<nav class=\"living-paths__cards\" data-path-cards aria-label=\"Choisir un chemin vivant\"></nav>",
            "<article class=\"living-paths__detail\" data-path-detail aria-live=\"polite\"></article>",
            "</section>",
            "<section class=\"living-paths__progress\" data-path-progress aria-live=\"polite\"></section>"
        ].join("");
        screen.appendChild(layer);
        state.elements.layer = layer;
        state.elements.entry = layer.querySelector("[data-path-entry]");
        state.elements.cards = layer.querySelector("[data-path-cards]");
        state.elements.detail = layer.querySelector("[data-path-detail]");
        state.elements.progress = layer.querySelector("[data-path-progress]");
    }

    function render() {
        buildLayer();
        renderEntry();
        renderCards();
        renderDetail();
        renderProgress();
    }

    function activePath() {
        return state.paths.find(path => path.id === state.activeId) || state.paths[0];
    }

    function renderEntry() {
        const path = activePath();
        state.elements.entry.innerHTML = [
            "<h2>✦ Chemin Vivant</h2>",
            `<p>${escapeHtml(path.title)}</p>`,
            `<p>${escapeHtml(path.duration)} · ${path.steps.length} etapes</p>`,
            "<button type=\"button\" data-open-paths>Commencer</button>"
        ].join("");
        state.elements.entry.querySelector("[data-open-paths]").addEventListener("click", () => {
            startPath(path.id);
            state.elements.layer.classList.add("is-open");
            render();
        });
    }

    function renderCards() {
        state.elements.cards.innerHTML = state.paths.map(path => {
            return [
                `<button type="button" class="living-paths__card${path.id === state.activeId ? " is-active" : ""}" data-path-id="${path.id}">`,
                `<h3>${escapeHtml(path.title)}</h3>`,
                `<p>${escapeHtml(path.duration)}<br>${path.steps.length} etapes</p>`,
                "</button>"
            ].join("");
        }).join("");
        state.elements.cards.querySelectorAll("[data-path-id]").forEach(button => {
            button.addEventListener("click", () => {
                state.activeId = button.dataset.pathId;
                state.memory.activePath = state.activeId;
                writeMemory();
                renderCards();
                renderDetail();
                renderProgress();
            });
        });
    }

    function renderDetail() {
        const path = activePath();
        const index = currentStepIndex(path);
        state.elements.detail.innerHTML = [
            `<h2>${escapeHtml(path.title)}</h2>`,
            `<p>${escapeHtml(path.opening)}</p>`,
            `<p>${escapeHtml(path.intent)}</p>`,
            "<div class=\"living-paths__meta\">",
            `<span>${escapeHtml(path.duration)}</span>`,
            `<span>${path.steps.length} etapes</span>`,
            `<span>${escapeHtml(path.seasonPriority === "all" ? "toutes saisons" : path.seasonPriority)}</span>`,
            "</div>",
            "<ol class=\"living-paths__steps\">",
            path.steps.map((step, stepIndex) => renderStep(path, step, stepIndex, index)).join(""),
            "</ol>",
            "<div class=\"living-paths__actions\">",
            "<button type=\"button\" data-next-step>Etape suivante</button>",
            "<button type=\"button\" data-complete-path>Marquer comme termine</button>",
            "<button type=\"button\" data-close-paths>Quitter le chemin</button>",
            "</div>",
            renderDashboard()
        ].join("");
        bindDetailActions(path);
    }

    function renderStep(path, step, stepIndex, currentIndex) {
        const status = stepIndex < currentIndex ? " is-done" : stepIndex === currentIndex ? " is-current" : "";
        const resources = (step.resources || []).map(resource => resource.label).filter(Boolean).slice(0, 2).join(" · ");
        const action = step.target
            ? `<button type="button" data-go-screen="${step.target}">Ouvrir</button>`
            : step.href
                ? `<a href="${step.href}">Ouvrir</a>`
                : "";
        return [
            `<li class="living-paths__step${status}">`,
            "<span class=\"living-paths__dot\"></span>",
            "<span>",
            `<strong>${escapeHtml(step.label)}</strong>`,
            resources ? `<br><small>${escapeHtml(resources)}</small>` : "",
            "</span>",
            action,
            "</li>"
        ].join("");
    }

    function bindDetailActions(path) {
        state.elements.detail.querySelector("[data-next-step]").addEventListener("click", () => {
            advancePath(path);
            renderDetail();
            renderProgress();
        });
        state.elements.detail.querySelector("[data-complete-path]").addEventListener("click", () => {
            completePath(path);
            renderDetail();
            renderProgress();
        });
        state.elements.detail.querySelector("[data-close-paths]").addEventListener("click", () => {
            state.elements.layer.classList.remove("is-open");
        });
        state.elements.detail.querySelectorAll("[data-go-screen]").forEach(button => {
            button.addEventListener("click", () => {
                markResourceStep(path);
                state.elements.layer.classList.remove("is-open");
                if (typeof Navigation !== "undefined" && Navigation.goTo) {
                    Navigation.goTo(button.dataset.goScreen);
                }
            });
        });
    }

    function startPath(id) {
        state.activeId = id;
        state.memory.activePath = id;
        if (!state.memory.started.includes(id)) {
            state.memory.started.push(id);
        }
        state.memory.steps[id] = Number(state.memory.steps[id] || 0);
        writeMemory();
    }

    function currentStepIndex(path) {
        return Math.min(Number(state.memory.steps[path.id] || 0), path.steps.length - 1);
    }

    function advancePath(path) {
        startPath(path.id);
        const next = Math.min(Number(state.memory.steps[path.id] || 0) + 1, path.steps.length - 1);
        state.memory.steps[path.id] = next;
        rememberResources(path.steps[next]);
        writeMemory();
    }

    function completePath(path) {
        startPath(path.id);
        state.memory.steps[path.id] = path.steps.length - 1;
        if (!state.memory.completed.includes(path.id)) {
            state.memory.completed.push(path.id);
        }
        path.steps.forEach(rememberResources);
        writeMemory();
    }

    function markResourceStep(path) {
        const step = path.steps[currentStepIndex(path)];
        rememberResources(step);
        writeMemory();
    }

    function rememberResources(step) {
        (step.resourceHints || []).forEach(id => {
            if (/^D\d{3}$/.test(id)) {
                state.memory.resources.archives = unique(state.memory.resources.archives.concat(id));
            } else if (/^BOOK-/.test(id)) {
                state.memory.resources.works = unique(state.memory.resources.works.concat(id));
            } else if (/^CON-/.test(id)) {
                state.memory.resources.concepts = unique(state.memory.resources.concepts.concat(id));
            } else if (/^ROOM-CONSTELLATION/.test(id)) {
                state.memory.resources.constellations = unique(state.memory.resources.constellations.concat(id));
            }
        });
    }

    function renderProgress() {
        const path = activePath();
        const current = currentStepIndex(path);
        const rail = path.steps.map((_, index) => index <= current ? "●" : "○").join("────");
        state.elements.progress.innerHTML = [
            `<h3>Votre chemin</h3>`,
            `<p>${escapeHtml(path.title)} · Etape ${current + 1} / ${path.steps.length}</p>`,
            `<div class="living-paths__rail">${rail}</div>`
        ].join("");
    }

    function renderDashboard() {
        const resources = state.memory.resources;
        return [
            "<aside class=\"living-paths__dashboard\">",
            "<h3>Tableau de bord</h3>",
            `<p>${state.memory.started.length} chemins commences<br>`,
            `${state.memory.completed.length} chemins termines<br>`,
            `${resources.constellations.length} constellations visitees<br>`,
            `${resources.archives.length} archives decouvertes<br>`,
            `${resources.works.length} oeuvres rencontrees</p>`,
            "</aside>"
        ].join("");
    }

    function statistics() {
        const steps = state.paths.map(path => path.steps.length);
        const resources = unique(state.paths.flatMap(path => path.resources));
        return {
            paths: state.paths.length,
            averageSteps: steps.length
                ? Number((steps.reduce((total, count) => total + count, 0) / steps.length).toFixed(1))
                : 0,
            resources: resources.length
        };
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function init() {
        Promise.all([
            fetchJson(DATA_PATHS.paths),
            fetchJson(DATA_PATHS.graph),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([paths, graph, concepts, works, mapping]) => {
            state.data = { paths, graph, concepts, works, mapping };
            state.memory = readMemory();
            buildPaths();
            render();
        }).catch(error => {
            console.warn(error.message);
        });
    }

    window.LivingPaths = {
        init,
        readMemory,
        statistics: () => statistics()
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
