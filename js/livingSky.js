(function () {
    const TRAVELER_KEY = "makerland:traveler-constellation";
    const LEGACY_STORY_KEY = "makerland_stories";
    const CYCLE_KEY = "makerland:living-cycle";
    const SCRIPT_URL = document.currentScript
        ? document.currentScript.src
        : window.location.href;

    const DATA_PATHS = {
        themes: new URL("../data/constellation-themes.json", SCRIPT_URL).href,
        concepts: new URL("../data/concept-network.json", SCRIPT_URL).href,
        works: new URL("../data/work-network.json", SCRIPT_URL).href,
        mapping: new URL("../data/archive-mapping.json", SCRIPT_URL).href
    };

    const state = {
        data: null,
        stars: [],
        territories: [],
        elements: {},
        panelHistoryOpen: false
    };

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Ciel Vivant : impossible de charger " + path);
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

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function tokenize(value) {
        return normalize(value)
            .replace(/[^a-z0-9]+/g, " ")
            .split(/\s+/)
            .filter(token => token.length > 3);
    }

    function unique(values) {
        return Array.from(new Set((values || []).filter(Boolean)));
    }

    function hash(value) {
        return String(value || "").split("").reduce((total, char) => {
            return ((total << 5) - total) + char.charCodeAt(0);
        }, 0);
    }

    function positiveHash(value) {
        return Math.abs(hash(value));
    }

    function themeById(id) {
        return state.data.themes.themes.find(theme => theme.id === id) ||
            state.data.themes.themes.find(theme => theme.id === state.data.themes.fallbackTheme);
    }

    function classify(text) {
        const words = tokenize(text);
        const scored = state.data.themes.themes.map(theme => ({
            theme,
            score: theme.keywords.reduce((total, keyword) => {
                return total + (words.includes(normalize(keyword)) ? 1 : 0);
            }, 0)
        })).sort((a, b) => b.score - a.score);
        return scored[0] && scored[0].score > 0
            ? scored[0].theme
            : themeById(state.data.themes.fallbackTheme);
    }

    function readFragments() {
        const traveler = readJson(TRAVELER_KEY, {});
        const fragments = Array.isArray(traveler.fragments) ? traveler.fragments : [];
        if (fragments.length) {
            return fragments;
        }

        const legacy = readJson(LEGACY_STORY_KEY, []);
        return Array.isArray(legacy)
            ? legacy.map(story => ({
                id: "LEGACY-" + story.id,
                text: story.text,
                date: story.date,
                season: "locale",
                moment: "memoire",
                category: {},
                concepts: [],
                resonance: {}
            }))
            : [];
    }

    function coordinates(id) {
        const seed = positiveHash(id);
        return {
            x: 7 + (seed % 86),
            y: 9 + (Math.floor(seed / 97) % 74)
        };
    }

    function buildStars() {
        state.stars = readFragments().map(fragment => {
            const theme = fragment.category && fragment.category.id
                ? themeById(fragment.category.id)
                : classify(fragment.text);
            const point = coordinates(fragment.id);
            return {
                id: fragment.id,
                text: fragment.text || "",
                date: fragment.date || new Date().toISOString(),
                season: fragment.season || "",
                moment: fragment.moment || "",
                category: theme.id,
                categoryLabel: theme.label,
                symbol: theme.symbol,
                color: theme.color,
                concepts: unique((fragment.concepts || []).concat(conceptsFromTheme(theme))),
                resonance: fragment.resonance || {},
                x: point.x,
                y: point.y,
                r: 2.6 + Math.min(String(fragment.text || "").length, 120) / 55
            };
        });
        state.territories = buildTerritories();
    }

    function conceptsFromTheme(theme) {
        const hints = (theme.conceptHints || []).map(normalize);
        return state.data.concepts.concepts
            .filter(concept => hints.some(hint => normalize(concept.name).includes(hint)))
            .map(concept => concept.id)
            .slice(0, 4);
    }

    function buildTerritories() {
        return state.data.themes.themes.map(theme => {
            const stars = state.stars.filter(star => star.category === theme.id);
            const concepts = unique(stars.flatMap(star => star.concepts).concat(conceptsFromTheme(theme)));
            const archives = unique([]
                .concat(theme.archiveHints || [])
                .concat(stars.flatMap(star => (star.resonance.archives || []).map(item => item.id))));
            const works = unique([]
                .concat(theme.workHints || [])
                .concat(stars.flatMap(star => (star.resonance.works || []).map(item => item.id))));
            return {
                id: theme.id,
                label: theme.label,
                symbol: theme.symbol,
                color: theme.color,
                quote: theme.quote,
                stars,
                concepts,
                archives,
                works,
                stage: territoryStage(stars.length)
            };
        });
    }

    function territoryStage(count) {
        const thresholds = state.data.themes.thresholds;
        if (count >= thresholds.luminousTerritory) return "territoire lumineux";
        if (count >= thresholds.developedConstellation) return "constellation developpee";
        if (count >= thresholds.firstConstellation) return "premiere constellation";
        if (count >= thresholds.firstLink) return "premier lien";
        return "etoile en attente";
    }

    function labelForConcept(id) {
        const concept = state.data.concepts.concepts.find(item => item.id === id);
        return concept ? concept.name : id;
    }

    function labelForWork(id) {
        const work = state.data.works.works.find(item => item.id === id);
        return work ? cleanTitle(work.title) : id;
    }

    function labelForArchive(id) {
        const archive = state.data.mapping.mappings.find(item => item.id === id);
        return archive ? id + " - " + archive.label : id;
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

    function buildLayer() {
        const screen = document.getElementById("e08_constellation");
        if (!screen || screen.querySelector("[data-living-sky]")) {
            return;
        }
        const layer = document.createElement("aside");
        layer.className = "living-sky";
        layer.dataset.mode = "sky";
        layer.setAttribute("data-living-sky", "");
        layer.setAttribute("aria-label", "Ciel vivant des voyageurs");
        layer.innerHTML = [
            "<nav class=\"living-sky__modes\" aria-label=\"Modes du Ciel Vivant\">",
            "<button class=\"living-sky__mode is-active\" type=\"button\" data-sky-mode=\"sky\">Ciel</button>",
            "<button class=\"living-sky__mode\" type=\"button\" data-sky-mode=\"territories\">Territoires</button>",
            "<button class=\"living-sky__mode\" type=\"button\" data-sky-mode=\"growth\">Croissance</button>",
            "</nav>",
            "<section class=\"living-sky__stage\" data-sky-stage></section>",
            "<section class=\"living-sky__territories\" data-sky-territories></section>",
            "<section class=\"living-sky__growth\" data-sky-growth></section>",
            "<article class=\"living-sky__panel\" data-sky-panel aria-live=\"polite\"></article>"
        ].join("");
        screen.appendChild(layer);
        state.elements.layer = layer;
        state.elements.stage = layer.querySelector("[data-sky-stage]");
        state.elements.territories = layer.querySelector("[data-sky-territories]");
        state.elements.growth = layer.querySelector("[data-sky-growth]");
        state.elements.panel = layer.querySelector("[data-sky-panel]");
        bindModes(layer);
        bindPanelClosing(layer);
    }

    function bindModes(layer) {
        layer.querySelectorAll("[data-sky-mode]").forEach(button => {
            button.addEventListener("click", () => {
                const mode = button.dataset.skyMode;
                layer.dataset.mode = mode;
                layer.querySelectorAll("[data-sky-mode]").forEach(item => {
                    item.classList.toggle("is-active", item === button);
                });
            });
        });
    }

    function render() {
        buildStars();
        buildLayer();
        renderSky();
        renderTerritories();
        renderGrowth();
        rememberSkyState();
    }

    function renderSky() {
        const lines = state.territories.flatMap(territory => {
            const stars = territory.stars.slice(0, 25);
            if (stars.length < 2) return [];
            return stars.slice(1).map((star, index) => {
                const previous = stars[index];
                return `<line class="living-sky__link" x1="${previous.x}" y1="${previous.y}" x2="${star.x}" y2="${star.y}"></line>`;
            });
        });
        const stars = state.stars.map((star, index) => {
            return `<circle class="living-sky__star" data-star-id="${escapeHtml(star.id)}" cx="${star.x}" cy="${star.y}" r="${star.r.toFixed(1)}" fill="${star.color}" style="animation-delay:${Math.min(index * .05, 1.4)}s"></circle>`;
        });
        const labels = state.territories
            .filter(territory => territory.stars.length)
            .map(territory => {
                const center = centerFor(territory.stars);
                return `<text class="living-sky__label" data-territory-id="${territory.id}" x="${center.x}" y="${center.y + 11}">${escapeHtml(territory.label)}</text>`;
            });

        state.elements.stage.innerHTML = `<svg class="living-sky__svg" viewBox="0 0 100 100" aria-hidden="false">${lines.join("")}${stars.join("")}${labels.join("")}</svg>`;
        state.elements.stage.querySelectorAll("[data-star-id]").forEach(node => {
            node.addEventListener("click", () => showStar(node.dataset.starId));
        });
        state.elements.stage.querySelectorAll("[data-territory-id]").forEach(node => {
            node.addEventListener("click", () => showTerritory(node.dataset.territoryId));
        });
    }

    function centerFor(stars) {
        const x = stars.reduce((total, star) => total + star.x, 0) / stars.length;
        const y = stars.reduce((total, star) => total + star.y, 0) / stars.length;
        return { x, y };
    }

    function bindPanelClosing(layer) {
        layer.addEventListener("click", event => {
            if (!state.elements.panel.classList.contains("is-visible")) return;
            if (event.target.closest(".living-sky__panel")) return;
            if (event.target.closest(".living-sky__modes")) return;
            if (event.target.closest("[data-star-id]")) return;
            if (event.target.closest("[data-territory-id]")) return;
            if (event.target.closest("[data-territory-card]")) return;
            closePanel(true);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closePanel(true);
            }
        });

        window.addEventListener("popstate", () => {
            if (state.panelHistoryOpen) {
                closePanel(false);
            }
        });
    }

    function panelCloseButton() {
        return "<button class=\"living-sky__close\" type=\"button\" aria-label=\"Fermer\">×</button>";
    }

    function bindPanelButton() {
        const button = state.elements.panel.querySelector(".living-sky__close");
        if (button) {
            button.addEventListener("click", () => closePanel(true));
        }
    }

    function openPanel() {
        state.elements.panel.classList.add("is-visible");
        if (!state.panelHistoryOpen && window.history && window.history.pushState) {
            window.history.pushState({ livingSkyPanel: true }, "", window.location.href);
            state.panelHistoryOpen = true;
        }
    }

    function closePanel(useHistoryBack) {
        if (!state.elements.panel || !state.elements.panel.classList.contains("is-visible")) {
            return;
        }
        state.elements.panel.classList.remove("is-visible");
        if (useHistoryBack && state.panelHistoryOpen && window.history) {
            state.panelHistoryOpen = false;
            window.history.back();
            return;
        }
        state.panelHistoryOpen = false;
    }

    function renderTerritories() {
        state.elements.territories.innerHTML = state.territories.map(territory => {
            return [
                `<article class="living-sky__territory" data-territory-card="${territory.id}">`,
                `<h3>${territory.symbol} Constellation ${escapeHtml(territory.label)}</h3>`,
                `<p>${territory.stars.length} etoiles - ${territory.stage}</p>`,
                `<p>${escapeHtml(territory.quote)}</p>`,
                "</article>"
            ].join("");
        }).join("");
        state.elements.territories.querySelectorAll("[data-territory-card]").forEach(card => {
            card.addEventListener("click", () => showTerritory(card.dataset.territoryCard));
        });
    }

    function renderGrowth() {
        const total = state.stars.length;
        const active = state.territories.filter(territory => territory.stars.length).length;
        const strongest = state.territories
            .slice()
            .sort((a, b) => b.stars.length - a.stars.length)[0];
        state.elements.growth.innerHTML = [
            "<article class=\"living-sky__growth-card\">",
            "<h3>Croissance du ciel</h3>",
            `<p>${total} etoiles locales</p>`,
            `<p>${active} constellations habitees</p>`,
            `<p>${strongest && strongest.stars.length ? "Territoire le plus lumineux : " + escapeHtml(strongest.label) : "Le ciel attend sa premiere etoile."}</p>`,
            "</article>",
            "<article class=\"living-sky__growth-card\">",
            "<h3>Seuils</h3>",
            "<p>2 etoiles : premier lien<br>5 etoiles : premiere constellation<br>10 etoiles : constellation developpee<br>25 etoiles : territoire lumineux</p>",
            "</article>"
        ].join("");
    }

    function showStar(id) {
        const star = state.stars.find(item => item.id === id);
        if (!star) return;
        const archive = firstLabel(star.resonance.archives, item => labelForArchive(item.id || item)) ||
            labelForArchive(themeById(star.category).archiveHints[0]);
        const work = firstLabel(star.resonance.works, item => cleanTitle(item.label || item.id || item)) ||
            labelForWork(themeById(star.category).workHints[0]);
        const concept = star.concepts.length ? labelForConcept(star.concepts[0]) : star.categoryLabel;
        state.elements.panel.innerHTML = [
            panelCloseButton(),
            "<h2>✦ Etoile du voyage</h2>",
            `<p>« ${escapeHtml(star.text)} »</p>`,
            `<p>${formatDate(star.date)}<br>Constellation : ${escapeHtml(star.categoryLabel)}</p>`,
            "<div class=\"living-sky__chips\">",
            `<span>${escapeHtml(archive)}</span>`,
            `<span>${escapeHtml(work)}</span>`,
            `<span>${escapeHtml(concept)}</span>`,
            "</div>"
        ].join("");
        bindPanelButton();
        openPanel();
    }

    function showTerritory(id) {
        const territory = state.territories.find(item => item.id === id);
        if (!territory) return;
        const chips = []
            .concat(territory.archives.slice(0, 2).map(labelForArchive))
            .concat(territory.works.slice(0, 2).map(labelForWork))
            .concat(territory.concepts.slice(0, 3).map(labelForConcept));
        state.elements.panel.innerHTML = [
            panelCloseButton(),
            `<h2>${territory.symbol} Constellation ${escapeHtml(territory.label)}</h2>`,
            `<p>${territory.stars.length} etoiles - ${territory.stage}</p>`,
            `<p>${escapeHtml(territory.quote)}</p>`,
            chips.length ? `<div class="living-sky__chips">${chips.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""
        ].join("");
        bindPanelButton();
        openPanel();
    }

    function firstLabel(items, formatter) {
        if (!Array.isArray(items) || !items.length) return "";
        const first = items[0];
        return formatter(first);
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? "date locale"
            : date.toLocaleDateString("fr-FR");
    }

    function bindStoryUpdates() {
        const button = document.getElementById("shareStoryButton");
        if (!button) return;
        button.addEventListener("click", () => {
            window.setTimeout(render, 160);
        }, true);
    }

    function rememberSkyState() {
        const cycle = readJson(CYCLE_KEY, {});
        cycle.livingSky = {
            stars: state.stars.length,
            territories: state.territories.filter(territory => territory.stars.length).length,
            updatedAt: new Date().toISOString()
        };
        const dominant = state.territories.slice().sort((a, b) => b.stars.length - a.stars.length)[0];
        if (dominant && dominant.stars.length) {
            cycle.livingSky.lastGuideWhisper = "La constellation " + dominant.label + " grandit.";
        }
        writeJson(CYCLE_KEY, cycle);
    }

    function audit() {
        const empty = state.territories.filter(territory => !territory.stars.length).map(territory => territory.id);
        const uncategorized = state.stars.filter(star => !star.category).map(star => star.id);
        const counts = state.territories.map(territory => territory.stars.length);
        const max = Math.max(0, ...counts);
        const min = Math.min(...counts);
        return {
            stars: state.stars.length,
            emptyTerritories: empty,
            uncategorizedStars: uncategorized,
            imbalance: max - min
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
            fetchJson(DATA_PATHS.themes),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([themes, concepts, works, mapping]) => {
            state.data = { themes, concepts, works, mapping };
            render();
            bindStoryUpdates();
        }).catch(error => {
            console.warn(error.message);
        });
    }

    window.LivingSky = {
        init,
        render,
        audit
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
