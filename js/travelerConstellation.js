(function () {
    const STORAGE_KEY = "makerland:traveler-constellation";
    const CYCLE_KEY = "makerland:living-cycle";
    const SEASONS_KEY = "makerland:living-seasons";
    const MAX_STARS = 34;

    const SCRIPT_URL = document.currentScript
        ? document.currentScript.src
        : window.location.href;

    const DATA_PATHS = {
        categories: new URL("../data/traveler-categories.json", SCRIPT_URL).href,
        concepts: new URL("../data/concept-network.json", SCRIPT_URL).href,
        works: new URL("../data/work-network.json", SCRIPT_URL).href,
        assets: new URL("../data/archive-assets.json", SCRIPT_URL).href,
        mapping: new URL("../data/archive-mapping.json", SCRIPT_URL).href
    };

    const MOMENT_LABELS = {
        dawn: "aube",
        morning: "matin",
        noon: "midi",
        dusk: "crepuscule",
        night: "nuit"
    };

    const state = {
        data: null,
        memory: null,
        elements: {}
    };

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Constellation des Voyageurs : impossible de charger " + path);
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
            // La memoire locale reste une trace poetique, jamais une dependance.
        }
    }

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function tokens(value) {
        return normalize(value)
            .replace(/[^a-z0-9]+/g, " ")
            .split(/\s+/)
            .filter(token => token.length > 3);
    }

    function unique(values) {
        return Array.from(new Set(values.filter(Boolean)));
    }

    function localSeason(date) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return "printemps";
        if (month >= 5 && month <= 7) return "ete";
        if (month >= 8 && month <= 10) return "automne";
        return "hiver";
    }

    function localMoment(date) {
        const hour = date.getHours();
        if (hour >= 5 && hour < 8) return "dawn";
        if (hour >= 8 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "noon";
        if (hour >= 17 && hour < 21) return "dusk";
        return "night";
    }

    function readJourneyContext(date) {
        const cycle = readJson(CYCLE_KEY, {});
        const seasons = readJson(SEASONS_KEY, {});
        return {
            season: cycle.currentSeason || localSeason(date),
            moment: cycle.currentMoment || localMoment(date),
            firstSeen: seasons.firstSeen || cycle.firstSeen || date.toISOString(),
            place: cycle.lastVisitedPlace || "constellation:constellation",
            room: document.querySelector(".screen[style*='display: block']")?.id || "e08_constellation"
        };
    }

    function classify(text) {
        const textTokens = tokens(text);
        const categories = state.data.categories.categories;
        const scored = categories.map(category => {
            const score = category.keywords.reduce((total, keyword) => {
                return total + (textTokens.includes(normalize(keyword)) ? 1 : 0);
            }, 0);
            return { category, score };
        }).sort((a, b) => b.score - a.score);

        return scored[0] && scored[0].score > 0
            ? scored[0].category
            : state.data.categories.fallback;
    }

    function scoreList(items, textTokens, textBuilder, limit) {
        return items
            .map(item => {
                const haystack = new Set(tokens(textBuilder(item)));
                const score = textTokens.reduce((total, token) => {
                    return total + (haystack.has(token) ? 1 : 0);
                }, 0);
                return {
                    id: item.id,
                    label: item.name || item.title || item.label || item.id,
                    score
                };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
            .slice(0, limit);
    }

    function findConceptIdsByNames(names) {
        const wanted = names.map(normalize);
        return state.data.concepts.concepts
            .filter(concept => wanted.some(name => normalize(concept.name).includes(name)))
            .map(concept => concept.id);
    }

    function resonanceFor(text, category) {
        const textTokens = unique(tokens(text).concat(tokens(category.label), tokens((category.concepts || []).join(" "))));
        const concepts = scoreList(
            state.data.concepts.concepts,
            textTokens,
            concept => [
                concept.name,
                concept.archives.join(" "),
                concept.works.join(" "),
                concept.articleBlocks.join(" ")
            ].join(" "),
            4
        );
        const conceptIds = unique(concepts.map(item => item.id).concat(findConceptIdsByNames(category.concepts || [])));
        const works = scoreList(
            state.data.works.works,
            textTokens.concat(conceptIds),
            work => [work.title, work.concepts.join(" "), work.archives.join(" ")].join(" "),
            3
        );
        const archives = scoreList(
            state.data.mapping.mappings,
            textTokens.concat(conceptIds),
            archive => [archive.id, archive.label, archive.concepts.join(" "), archive.books.join(" ")].join(" "),
            3
        );
        const images = scoreList(
            state.data.assets.assets,
            textTokens.concat(conceptIds),
            asset => [asset.name, asset.subject, asset.concepts.join(" "), asset.archiveCandidates.join(" ")].join(" "),
            3
        );

        return {
            concepts: concepts.length ? concepts : conceptIds.slice(0, 3).map(id => ({
                id,
                label: labelForConcept(id),
                score: 1
            })),
            works,
            archives,
            images,
            rooms: roomsFor(category, textTokens)
        };
    }

    function labelForConcept(id) {
        const concept = state.data.concepts.concepts.find(item => item.id === id);
        return concept ? concept.name : id;
    }

    function roomsFor(category, textTokens) {
        const rules = [
            ["ROOM-ATELIER", "Atelier IA", ["dialogue", "creation", "question", "clarifier", "image"]],
            ["ROOM-CONSTELLATION", "Constellation", ["constellation", "resonance", "rencontre", "partager"]],
            ["ROOM-BIBLIOTHEQUE", "Bibliotheque", ["livre", "transmission", "memoire", "lecture"]],
            ["ROOM-BOUSSOLE", "Boussole", ["seuil", "chemin", "choisir", "repere"]],
            ["ROOM-OEUVRE", "Oeuvre immersive", ["vivant", "foret", "territoire", "monde"]]
        ];
        return rules
            .map(([id, label, words]) => ({
                id,
                label,
                score: words.reduce((total, word) => {
                    return total + (textTokens.includes(word) || normalize(category.label).includes(word) ? 1 : 0);
                }, 0)
            }))
            .filter(room => room.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 2);
    }

    function readMemory() {
        const memory = readJson(STORAGE_KEY, {});
        memory.fragments = Array.isArray(memory.fragments) ? memory.fragments : [];
        memory.visits = Number(memory.visits || 0);
        if (!memory.firstSeen) {
            memory.firstSeen = new Date().toISOString();
        }
        return memory;
    }

    function saveFragment(text) {
        const clean = String(text || "").trim();
        if (!clean) {
            return null;
        }

        const date = new Date();
        const context = readJourneyContext(date);
        const category = classify(clean);
        const resonance = resonanceFor(clean, category);
        const fragment = {
            id: "TRV-" + date.getTime(),
            text: clean,
            date: date.toISOString(),
            season: context.season,
            moment: MOMENT_LABELS[context.moment] || context.moment,
            place: context.place,
            room: context.room,
            category: {
                id: category.id,
                label: category.label,
                symbol: category.symbol
            },
            shine: Number((0.56 + Math.min(clean.length, 140) / 420).toFixed(2)),
            concepts: resonance.concepts.map(item => item.id),
            resonance
        };

        state.memory.fragments.unshift(fragment);
        state.memory.fragments = state.memory.fragments.slice(0, 80);
        state.memory.visits += 1;
        state.memory.lastFragment = fragment.id;
        writeJson(STORAGE_KEY, state.memory);
        updateCycleMemory(fragment);
        render();
        return fragment;
    }

    function updateCycleMemory(fragment) {
        const cycle = readJson(CYCLE_KEY, {});
        cycle.constellationFragments = Array.isArray(cycle.constellationFragments)
            ? cycle.constellationFragments
            : [];
        if (!cycle.constellationFragments.includes("voyageurs")) {
            cycle.constellationFragments.push("voyageurs");
        }
        cycle.travelerStories = Number(cycle.travelerStories || 0) + 1;
        cycle.travelerConcepts = unique((cycle.travelerConcepts || []).concat(fragment.concepts));
        writeJson(CYCLE_KEY, cycle);
    }

    function buildLayer() {
        const screen = document.getElementById("e08_constellation");
        if (!screen || screen.querySelector("[data-traveler-constellation]")) {
            return;
        }

        const layer = document.createElement("aside");
        layer.className = "traveler-constellation";
        layer.setAttribute("data-traveler-constellation", "");
        layer.setAttribute("aria-label", "Constellation locale des voyageurs");
        layer.innerHTML = [
            "<svg class=\"traveler-constellation__sky\" data-traveler-sky viewBox=\"0 0 320 220\" aria-hidden=\"true\"></svg>",
            "<article class=\"traveler-constellation__card\" data-traveler-card aria-live=\"polite\"></article>",
            "<article class=\"traveler-constellation__memory\" data-traveler-memory></article>"
        ].join("");
        screen.appendChild(layer);

        state.elements.layer = layer;
        state.elements.sky = layer.querySelector("[data-traveler-sky]");
        state.elements.card = layer.querySelector("[data-traveler-card]");
        state.elements.memory = layer.querySelector("[data-traveler-memory]");
    }

    function render() {
        buildLayer();
        renderSky();
        renderCard();
        renderMemory();
    }

    function starsForFragments() {
        return state.memory.fragments.slice(0, MAX_STARS).map((fragment, index) => {
            const categorySeed = Math.abs(hash(fragment.category.id)) % 7;
            return {
                fragment,
                x: 34 + ((index * 43 + categorySeed * 17) % 248),
                y: 26 + ((index * 29 + categorySeed * 23) % 166),
                r: 2.4 + Math.min(fragment.shine || 0.6, 1) * 2.4
            };
        });
    }

    function hash(value) {
        return String(value).split("").reduce((total, char) => {
            return ((total << 5) - total) + char.charCodeAt(0);
        }, 0);
    }

    function renderSky() {
        if (!state.elements.sky) return;
        const stars = starsForFragments();
        const byCategory = {};
        stars.forEach(star => {
            byCategory[star.fragment.category.id] = byCategory[star.fragment.category.id] || [];
            byCategory[star.fragment.category.id].push(star);
        });

        const lines = Object.keys(byCategory).flatMap(key => {
            const group = byCategory[key].slice(0, 8);
            return group.slice(1).map((star, index) => {
                const previous = group[index];
                return `<line class="traveler-constellation__line" x1="${previous.x}" y1="${previous.y}" x2="${star.x}" y2="${star.y}"></line>`;
            });
        });

        const circles = stars.map((star, index) => {
            return `<circle class="traveler-constellation__star" cx="${star.x}" cy="${star.y}" r="${star.r}" style="animation-delay:${Math.min(index * 0.08, 1.2)}s"></circle>`;
        });

        state.elements.sky.innerHTML = lines.concat(circles).join("");
    }

    function renderCard() {
        if (!state.elements.card) return;
        const fragment = state.memory.fragments[0];
        if (!fragment) {
            state.elements.card.classList.remove("is-visible");
            state.elements.card.innerHTML = [
                "<h2>✦ La Constellation attend</h2>",
                "<p>Chaque phrase deposee ici restera uniquement dans ce navigateur et pourra rejoindre une famille de recits.</p>"
            ].join("");
            return;
        }

        const resonance = fragment.resonance;
        const links = unique([]
            .concat((resonance.works || []).map(item => item.label))
            .concat((resonance.archives || []).map(item => item.id))
            .concat((resonance.concepts || []).map(item => item.label))
            .concat((resonance.rooms || []).map(item => item.label)))
            .slice(0, 5);

        state.elements.card.innerHTML = [
            "<h2>✦ Aujourd'hui</h2>",
            `<p>Votre recit rejoint la constellation ${fragment.category.symbol} ${fragment.category.label}.</p>`,
            `<p class="traveler-constellation__meta">${fragment.season} · ${fragment.moment} · ${fragment.room}</p>`,
            links.length
                ? `<div class="traveler-constellation__links">${links.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>`
                : ""
        ].join("");
        requestAnimationFrame(() => state.elements.card.classList.add("is-visible"));
    }

    function renderMemory() {
        if (!state.elements.memory) return;
        const cycle = readJson(CYCLE_KEY, {});
        const places = Array.isArray(cycle.visitedPlaceIds) ? cycle.visitedPlaceIds.length : 0;
        const concepts = unique(state.memory.fragments.flatMap(fragment => fragment.concepts || [])).length;
        const first = new Date(state.memory.firstSeen);
        const date = Number.isNaN(first.getTime())
            ? "ce voyage"
            : first.toLocaleDateString("fr-FR");

        state.elements.memory.innerHTML = [
            "<h3>Votre constellation</h3>",
            "<p class=\"traveler-constellation__memory-list\">",
            `${state.memory.fragments.length} recits<br>`,
            `${places} lieux<br>`,
            `${concepts} concepts<br>`,
            `${state.memory.visits} visites<br>`,
            `Depuis le ${date}`,
            "</p>"
        ].join("");
    }

    function renderPaths() {
        if (!state.elements.paths) return;
        const counts = {};
        state.memory.fragments.forEach(fragment => {
            counts[fragment.category.id] = (counts[fragment.category.id] || 0) + 1;
        });
        const paths = state.data.categories.categories
            .filter(category => counts[category.id])
            .sort((a, b) => counts[b.id] - counts[a.id])
            .slice(0, 5);

        state.elements.paths.innerHTML = [
            "<h3>Chemins ouverts</h3>",
            "<div>",
            paths.length
                ? paths.map(path => `<span>${path.symbol} ${path.label}</span>`).join("")
                : "<span>Les recits du vivant</span><span>Les recits du seuil</span>",
            "</div>"
        ].join("");
    }

    function ensurePathsLayer() {
        buildLayer();
        if (!state.elements.layer || (state.elements.paths && state.elements.paths.isConnected)) {
            return;
        }
        const paths = document.createElement("article");
        paths.className = "traveler-constellation__paths";
        paths.setAttribute("data-traveler-paths", "");
        paths.setAttribute("aria-live", "polite");
        state.elements.layer.appendChild(paths);
        state.elements.paths = paths;
        registerPathsOverlay();
    }

    function registerPathsOverlay() {
        if (!window.LivingOverlayManager) return;
        window.LivingOverlayManager.register("TRAVELER_PATHS", {
            close: closePaths,
            element: state.elements.paths,
            skipFocus: true
        });
    }

    function openPaths() {
        if (!state.data || !state.memory) return;
        ensurePathsLayer();
        renderPaths();
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.activate("TRAVELER_PATHS", {
                close: closePaths,
                element: state.elements.paths,
                skipFocus: true
            });
        }
    }

    function closePaths() {
        if (state.elements.paths && state.elements.paths.isConnected) {
            state.elements.paths.remove();
        }
        state.elements.paths = null;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function bindSharing() {
        const button = document.getElementById("shareStoryButton");
        const textarea = document.getElementById("storyInput");
        if (!button || !textarea) return;

        button.addEventListener("click", () => {
            closePaths();
            saveFragment(textarea.value);
        }, true);
    }

    function init() {
        Promise.all([
            fetchJson(DATA_PATHS.categories),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([categories, concepts, works, assets, mapping]) => {
            state.data = { categories, concepts, works, assets, mapping };
            state.memory = readMemory();
            bindSharing();
            render();
        }).catch(error => {
            console.warn(error.message);
        });
    }

    window.TravelerConstellation = {
        init,
        saveFragment: text => state.data ? saveFragment(text) : null,
        readMemory,
        openPaths,
        closePaths
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
