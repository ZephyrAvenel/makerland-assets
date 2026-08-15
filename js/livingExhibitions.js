(function () {
    const TRAVELER_KEY = "makerland:traveler-constellation";
    const CYCLE_KEY = "makerland:living-cycle";
    const SCRIPT_URL = document.currentScript
        ? document.currentScript.src
        : window.location.href;

    const DATA_PATHS = {
        themes: new URL("../data/constellation-themes.json", SCRIPT_URL).href,
        graph: new URL("../data/living-graph.json", SCRIPT_URL).href,
        concepts: new URL("../data/concept-network.json", SCRIPT_URL).href,
        works: new URL("../data/work-network.json", SCRIPT_URL).href,
        assets: new URL("../data/archive-assets.json", SCRIPT_URL).href,
        mapping: new URL("../data/archive-mapping.json", SCRIPT_URL).href
    };

    const EXHIBITION_IDS = [
        "dialogue",
        "liberte",
        "monde-commun",
        "transformation",
        "transmission",
        "esperance",
        "seuil",
        "vivant"
    ];

    const EXHIBITION_COPY = {
        dialogue: {
            title: "Dialogue",
            opening: "Chaque conversation peut devenir un atelier de pensee.",
            intro: "Cette constellation rassemble les lieux ou la parole transforme l'intuition en chemin."
        },
        liberte: {
            title: "Liberte",
            opening: "Choisir un chemin ne ferme pas les autres.",
            intro: "La Liberte traverse les seuils, les cartes et les oeuvres qui rendent le prochain pas possible."
        },
        "monde-commun": {
            title: "Monde commun",
            opening: "Un territoire devient commun lorsque plusieurs recits acceptent de se repondre.",
            intro: "Cette constellation revele les relations entre les cartes, les archives et les formes habitables du monde."
        },
        transformation: {
            title: "Transformation",
            opening: "Ce qui change cherche parfois simplement une forme plus juste.",
            intro: "Ici se rencontrent les archives du devenir, les oeuvres du passage et les images de metamorphose."
        },
        transmission: {
            title: "Transmission",
            opening: "Transmettre, c'est confier une lumiere sans imposer sa route.",
            intro: "Cette constellation relie livres, archives, lecteurs, bibliotheque et traces partagees."
        },
        esperance: {
            title: "Esperance",
            opening: "Une lumiere basse peut suffire a rouvrir le paysage.",
            intro: "L'Esperance rassemble les fragments qui permettent de continuer sans effacer l'ombre."
        },
        seuil: {
            title: "Seuil",
            opening: "Un seuil ne transporte pas brutalement. Il prepare.",
            intro: "Cette constellation suit les portes, les passages, les archetypes et les lieux de franchissement."
        },
        vivant: {
            title: "Vivant",
            opening: "Le vivant n'explique pas toujours. Il accueille.",
            intro: "Cette constellation rassemble les oeuvres, concepts et images qui font respirer les Recits Vivants."
        }
    };

    const state = {
        data: null,
        exhibitions: [],
        activeId: "dialogue",
        elements: {}
    };

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Grandes Constellations : impossible de charger " + path);
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

    function unique(values) {
        return Array.from(new Set((values || []).filter(Boolean)));
    }

    function cleanTitle(value) {
        return String(value || "")
            .replace(/Makerland/g, "Territoire des Recits Vivants")
            .replace(/Atelier IA/g, "Atelier des Recits")
            .replace(/\.(png|jpe?g|gif|webp|svg)$/i, "")
            .replace(/^COUVERTURE[-_\s]*/i, "")
            .replace(/^Couverture\s*-\s*/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function themeFor(id) {
        if (id === "vivant") {
            return state.data.themes.themes.find(theme => theme.id === "nature");
        }
        return state.data.themes.themes.find(theme => theme.id === id);
    }

    function matchingConcepts(theme, copy) {
        const hints = unique([]
            .concat(theme.conceptHints || [])
            .concat(theme.keywords || [])
            .concat([copy.title]));
        return state.data.concepts.concepts.filter(concept => {
            const text = normalize([concept.name, concept.articleBlocks.join(" ")].join(" "));
            return hints.some(hint => text.indexOf(normalize(hint)) !== -1);
        }).slice(0, 8);
    }

    function buildExhibition(id) {
        const theme = themeFor(id);
        const copy = EXHIBITION_COPY[id];
        const concepts = matchingConcepts(theme, copy);
        const conceptIds = concepts.map(concept => concept.id);
        const archives = archivesFor(theme, conceptIds);
        const archiveIds = archives.map(archive => archive.id);
        const works = worksFor(theme, conceptIds, archiveIds);
        const workIds = works.map(work => work.id);
        const images = imagesFor(concepts, archives, works);
        const figures = images.filter(asset => asset.figureId).slice(0, 8);
        const articles = unique(concepts.flatMap(concept => concept.articleBlocks || []).concat(works.flatMap(work => work.articleBlocks || []))).slice(0, 8);
        const rooms = roomsFor(conceptIds, archiveIds, workIds);
        const travelerStars = starsFor(id, theme);

        return {
            id,
            title: copy.title,
            opening: copy.opening,
            intro: copy.intro,
            color: theme.color,
            concepts,
            archives,
            works,
            images: images.slice(0, 8),
            figures,
            articles,
            rooms,
            packs: unique(concepts.flatMap(concept => concept.narrativePacks || [])).slice(0, 5),
            objects: [],
            travelerStars,
            path: pathFor(copy, archives, works, rooms, figures)
        };
    }

    function archivesFor(theme, conceptIds) {
        const ids = unique([]
            .concat(theme.archiveHints || [])
            .concat(state.data.concepts.concepts
                .filter(concept => conceptIds.includes(concept.id))
                .flatMap(concept => concept.archives || [])));
        return state.data.mapping.mappings.filter(archive => ids.includes(archive.id)).slice(0, 8);
    }

    function worksFor(theme, conceptIds, archiveIds) {
        const ids = unique([]
            .concat(theme.workHints || [])
            .concat(state.data.concepts.concepts
                .filter(concept => conceptIds.includes(concept.id))
                .flatMap(concept => concept.works || []))
            .concat(state.data.mapping.mappings
                .filter(archive => archiveIds.includes(archive.id))
                .flatMap(archive => archive.books || [])));
        return state.data.works.works.filter(work => ids.includes(work.id)).slice(0, 8);
    }

    function imagesFor(concepts, archives, works) {
        const conceptNames = concepts.map(concept => concept.name);
        const ids = unique([]
            .concat(concepts.flatMap(concept => concept.images || []))
            .concat(archives.flatMap(archive => archive.images || []))
            .concat(works.flatMap(work => work.images || [])));
        return state.data.assets.assets.filter(asset => {
            return ids.includes(asset.id) ||
                conceptNames.some(name => (asset.concepts || []).some(assetConcept => normalize(assetConcept) === normalize(name)));
        }).filter(asset => !asset.isTechnicalTexture);
    }

    function roomsFor(conceptIds, archiveIds, workIds) {
        return (state.data.graph.rooms || []).filter(room => {
            return intersects(room.concepts, conceptIds) ||
                intersects(room.archives, archiveIds) ||
                intersects(room.works, workIds);
        }).slice(0, 6);
    }

    function intersects(a, b) {
        return (a || []).some(item => (b || []).includes(item));
    }

    function starsFor(id, theme) {
        const memory = readJson(TRAVELER_KEY, {});
        const fragments = Array.isArray(memory.fragments) ? memory.fragments : [];
        return fragments.filter(fragment => {
            const category = fragment.category && fragment.category.id;
            if (id === "vivant") {
                return category === "nature" || category === "renaissance" || category === "resonance";
            }
            return category === id || normalize(fragment.text).indexOf(normalize(theme.label)) !== -1;
        });
    }

    function pathFor(copy, archives, works, rooms, figures) {
        return unique([
            copy.title,
            archives[0] ? archives[0].id : "",
            works[0] ? cleanTitle(works[0].title) : "",
            rooms[0] ? rooms[0].name : "",
            figures[0] ? figures[0].figureId : "",
            "Constellation Vivante",
            "Oeuvre immersive"
        ]).slice(0, 7);
    }

    function buildLayer() {
        const screen = document.getElementById("e08_constellation");
        if (!screen || screen.querySelector("[data-living-exhibitions]")) {
            return;
        }
        const layer = document.createElement("aside");
        layer.className = "living-exhibitions";
        layer.setAttribute("data-living-exhibitions", "");
        layer.setAttribute("aria-label", "Grandes Constellations Vivantes");
        layer.innerHTML = [
            "<section class=\"living-exhibitions__panel\" data-exhibition-panel>",
            "<nav class=\"living-exhibitions__list\" data-exhibition-list aria-label=\"Grandes Constellations\"></nav>",
            "<article class=\"living-exhibitions__detail\" data-exhibition-detail aria-live=\"polite\"></article>",
            "</section>"
        ].join("");
        screen.appendChild(layer);
        state.elements.layer = layer;
        state.elements.list = layer.querySelector("[data-exhibition-list]");
        state.elements.detail = layer.querySelector("[data-exhibition-detail]");
        state.elements.panel = layer.querySelector("[data-exhibition-panel]");
    }

    function render() {
        buildLayer();
        renderList();
        renderDetail();
        rememberFeatured();
    }

    function featuredExhibition() {
        const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        return state.exhibitions[week % state.exhibitions.length];
    }

    function renderList() {
        state.elements.list.innerHTML = state.exhibitions.map(exhibition => {
            return `<button type="button" class="living-exhibitions__tab${exhibition.id === state.activeId ? " is-active" : ""}" data-exhibition-id="${exhibition.id}">${escapeHtml(exhibition.title)}</button>`;
        }).join("");
        state.elements.list.querySelectorAll("[data-exhibition-id]").forEach(button => {
            button.addEventListener("click", () => {
                state.activeId = button.dataset.exhibitionId;
                renderList();
                renderDetail();
            });
        });
    }

    function renderDetail() {
        const exhibition = state.exhibitions.find(item => item.id === state.activeId) || state.exhibitions[0];
        state.elements.detail.innerHTML = [
            `<h2>${escapeHtml(exhibition.title)}</h2>`,
            `<p>${escapeHtml(exhibition.opening)}</p>`,
            `<p>${escapeHtml(exhibition.intro)}</p>`,
            "<div class=\"living-exhibitions__path\">",
            exhibition.path.map(step => `<span>${escapeHtml(step)}</span>`).join(""),
            "</div>",
            "<div class=\"living-exhibitions__grid\">",
            block("Concepts", exhibition.concepts.map(item => item.name)),
            block("Archives", exhibition.archives.map(item => item.id + " - " + item.label)),
            block("Oeuvres et livres", exhibition.works.map(item => cleanTitle(item.title))),
            block("Images patrimoniales", exhibition.images.map(item => item.id + " - " + cleanTitle(item.name))),
            block("Figures", exhibition.figures.map(item => item.figureId + " - " + cleanTitle(item.name))),
            block("Articles", exhibition.articles),
            block("Salles des Recits Vivants", exhibition.rooms.map(item => cleanTitle(item.name))),
            block("Packs narratifs", exhibition.packs.length ? exhibition.packs : ["Aucune relation structuree dans les catalogues actuels"]),
            block("Objets NFC", exhibition.objects.length ? exhibition.objects : ["Aucun objet NFC disponible dans les catalogues actuels"]),
            "</div>",
            `<p class="living-exhibitions__stats">${exhibition.travelerStars.length} etoiles locales dans cette famille. ${coverageLine(exhibition)}</p>`,
            "<button type=\"button\" class=\"living-exhibitions__close\" data-close-exhibitions>Refermer l'exposition</button>"
        ].join("");
        state.elements.detail.querySelector("[data-close-exhibitions]").addEventListener("click", () => {
            closeExhibitions();
            clearOverlay("EXHIBITION");
        });
    }

    function openExhibitions() {
        if (!state.elements.layer) return;
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.activate("EXHIBITION", {
                close: closeExhibitions,
                element: state.elements.panel
            });
        }
        state.elements.layer.classList.add("is-open");
    }

    function closeExhibitions() {
        if (state.elements.layer) {
            state.elements.layer.classList.remove("is-open");
        }
    }

    function clearOverlay(id) {
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.clear(id);
        }
    }

    function block(title, items) {
        const values = (items || []).filter(Boolean).slice(0, 5);
        return [
            "<section class=\"living-exhibitions__block\">",
            `<h3>${escapeHtml(title)}</h3>`,
            "<ul>",
            (values.length ? values : ["Aucune relation disponible"]).map(item => `<li>${escapeHtml(item)}</li>`).join(""),
            "</ul>",
            "</section>"
        ].join("");
    }

    function coverageLine(exhibition) {
        return [
            exhibition.archives.length + " archives",
            exhibition.works.length + " oeuvres",
            exhibition.concepts.length + " concepts",
            exhibition.images.length + " images",
            exhibition.figures.length + " figures"
        ].join(" - ");
    }

    function rememberFeatured() {
        const cycle = readJson(CYCLE_KEY, {});
        const featured = featuredExhibition();
        cycle.livingExhibitions = {
            featured: featured.title,
            explored: state.activeId,
            updatedAt: new Date().toISOString()
        };
        writeJson(CYCLE_KEY, cycle);
    }

    function statistics() {
        return state.exhibitions.reduce((stats, exhibition) => {
            stats.constellations += 1;
            stats.archives += exhibition.archives.length;
            stats.works += exhibition.works.length;
            stats.concepts += exhibition.concepts.length;
            stats.images += exhibition.images.length;
            stats.figures += exhibition.figures.length;
            stats.rooms += exhibition.rooms.length;
            return stats;
        }, {
            constellations: 0,
            archives: 0,
            works: 0,
            concepts: 0,
            images: 0,
            figures: 0,
            rooms: 0
        });
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
            fetchJson(DATA_PATHS.graph),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([themes, graph, concepts, works, assets, mapping]) => {
            state.data = { themes, graph, concepts, works, assets, mapping };
            state.exhibitions = EXHIBITION_IDS.map(buildExhibition);
            render();
        }).catch(error => {
            console.warn(error.message);
        });
    }

    window.LivingExhibitions = {
        init,
        statistics: () => statistics()
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
