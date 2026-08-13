(function () {
    const SCRIPT_URL = document.currentScript ? document.currentScript.src : window.location.href;

    function dataPath(fileName) {
        return new URL("../data/" + fileName, SCRIPT_URL).href;
    }

    const DATA_PATHS = {
        graph: dataPath("living-graph.json"),
        concepts: dataPath("concept-network.json"),
        works: dataPath("work-network.json"),
        assets: dataPath("archive-assets.json"),
        mapping: dataPath("archive-mapping.json")
    };

    const MEMORY_KEY = "makerland.livingGuide.memory";
    const GUIDE_STYLE_ID = "living-guide-style";

    let state = {
        graph: null,
        concepts: null,
        works: null,
        assets: null,
        mapping: null,
        labels: new Map(),
        ready: false
    };

    function $(selector) {
        return document.querySelector(selector);
    }

    function create(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
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

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Guide Vivant : impossible de charger " + path);
            }
            return response.json();
        });
    }

    function readMemory() {
        try {
            return JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}");
        } catch (error) {
            return {};
        }
    }

    function writeMemory(memory) {
        try {
            localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
        } catch (error) {
            // La mémoire locale est un confort narratif, jamais une dépendance.
        }
    }

    function remember(nodeId) {
        const memory = readMemory();
        const now = new Date().toISOString();
        memory.visited = Array.isArray(memory.visited) ? memory.visited : [];
        if (!memory.visited.includes(nodeId)) {
            memory.visited.push(nodeId);
        }
        memory.last = nodeId;
        memory.updatedAt = now;
        writeMemory(memory);
        return memory;
    }

    function label(id) {
        return state.labels.get(id) || id;
    }

    function buildLabels() {
        state.labels = new Map();
        state.mapping.mappings.forEach(item => state.labels.set(item.id, item.id + " — " + item.label));
        state.concepts.concepts.forEach(item => state.labels.set(item.id, item.name));
        state.works.works.forEach(item => state.labels.set(item.id, cleanTitle(item.title)));
        state.assets.assets.forEach(item => {
            state.labels.set(item.id, cleanTitle(item.name));
            if (item.figureId) {
                state.labels.set(item.figureId, cleanTitle(item.name));
            }
            if (item.bookId) {
                state.labels.set(item.bookId, cleanTitle(item.name));
            }
        });
        state.graph.rooms.forEach(item => state.labels.set(item.id, item.name));
        state.graph.nodes
            .filter(item => item.type === "article-block")
            .forEach(item => state.labels.set(item.id, item.label));
    }

    function nodeType(id) {
        const node = state.graph.nodes.find(item => item.id === id);
        if (node) {
            return node.type;
        }
        if (/^D\d{3}$/.test(id)) return "archive";
        if (/^CON-/.test(id)) return "concept";
        if (/^BOOK-/.test(id)) return "work";
        if (/^IMG-/.test(id)) return "image";
        if (/^FIG-/.test(id)) return "figure";
        if (/^ROOM-/.test(id)) return "room";
        if (/^BLOCK-/.test(id)) return "article-block";
        return "node";
    }

    function unique(values) {
        return Array.from(new Set(values.filter(Boolean)));
    }

    function archiveById(id) {
        return state.mapping.mappings.find(item => item.id === id);
    }

    function conceptById(id) {
        return state.concepts.concepts.find(item => item.id === id);
    }

    function workById(id) {
        return state.works.works.find(item => item.id === id);
    }

    function assetById(id) {
        return state.assets.assets.find(item => item.id === id || item.figureId === id || item.bookId === id);
    }

    function relatedFromSelection(id) {
        const type = nodeType(id);
        if (id === "TERM-ECOLOGIE-NARRATIVE") {
            const assets = state.assets.assets.filter(asset => normalize(asset.name + " " + asset.subject).includes("ecologie"));
            return {
                source: id,
                title: "Écologie narrative",
                type: "concept",
                archives: unique(assets.flatMap(asset => asset.archiveCandidates || [])),
                concepts: [],
                works: [],
                images: assets.map(asset => asset.id),
                figures: assets.map(asset => asset.figureId).filter(Boolean),
                rooms: ["ROOM-OEUVRE", "ROOM-CONSTELLATION", "ROOM-ATELIER"],
                articles: []
            };
        }
        if (type === "concept") {
            const concept = conceptById(id);
            return {
                source: id,
                title: label(id),
                type,
                archives: concept.archives || [],
                concepts: [],
                works: concept.works || [],
                images: concept.images || [],
                figures: concept.figures || [],
                rooms: concept.rooms || [],
                articles: concept.articleBlocks || []
            };
        }
        if (type === "work") {
            const work = workById(id);
            return {
                source: id,
                title: label(id),
                type,
                archives: work.archives || [],
                concepts: work.concepts || [],
                works: work.associatedWorks || [],
                images: work.images || [],
                figures: work.figures || [],
                rooms: [work.primaryRoom].filter(Boolean),
                articles: work.articleBlocks || []
            };
        }
        if (type === "archive") {
            const archive = archiveById(id);
            return {
                source: id,
                title: label(id),
                type,
                archives: unique([
                    previousArchive(id),
                    nextArchive(id)
                ]),
                concepts: archive.concepts || [],
                works: archive.books || [],
                images: archive.images || [],
                figures: archive.figures || [],
                rooms: roomsFromConcepts(archive.concepts || []),
                articles: []
            };
        }
        if (type === "image" || type === "book-image" || type === "figure") {
            const asset = assetById(id);
            const conceptIds = (asset.concepts || [])
                .map(name => state.concepts.concepts.find(concept => concept.name === name))
                .filter(Boolean)
                .map(concept => concept.id);
            return {
                source: id,
                title: label(id),
                type,
                archives: asset.archiveCandidates || [],
                concepts: conceptIds,
                works: asset.bookId ? [asset.bookId] : [],
                images: asset.id ? [asset.id] : [],
                figures: asset.figureId ? [asset.figureId] : [],
                rooms: graphTargets(asset.id, "image_room"),
                articles: []
            };
        }
        if (type === "room") {
            const room = state.graph.rooms.find(item => item.id === id);
            return {
                source: id,
                title: label(id),
                type,
                archives: room.archives || [],
                concepts: room.concepts || [],
                works: room.works || [],
                images: room.images || [],
                figures: room.figures || [],
                rooms: [],
                articles: []
            };
        }
        return null;
    }

    function previousArchive(id) {
        const index = state.mapping.mappings.findIndex(item => item.id === id);
        return index > 0 ? state.mapping.mappings[index - 1].id : null;
    }

    function nextArchive(id) {
        const index = state.mapping.mappings.findIndex(item => item.id === id);
        return index >= 0 && index < state.mapping.mappings.length - 1
            ? state.mapping.mappings[index + 1].id
            : null;
    }

    function roomsFromConcepts(conceptIds) {
        return unique(conceptIds.flatMap(conceptId => {
            const concept = conceptById(conceptId);
            return concept ? concept.rooms : [];
        }));
    }

    function graphTargets(source, edgeType) {
        return state.graph.edges
            .filter(edge => edge.source === source && edge.type === edgeType)
            .map(edge => edge.target);
    }

    function firstAvailable(relations, keys) {
        for (const key of keys) {
            if (relations[key] && relations[key].length) {
                return {
                    key,
                    items: relations[key]
                };
            }
        }
        return null;
    }

    function chooseSuggestion(context, memory) {
        const alreadySeen = context.concepts.find(id => memory.visited && memory.visited.includes(id));
        if (alreadySeen) {
            return {
                family: "Retour",
                text: "Vous avez déjà rencontré cette idée. Elle revient ici sous une autre forme.",
                target: alreadySeen
            };
        }

        if (context.type === "archive") {
            const link = firstAvailable(context, ["works", "concepts", "rooms", "images"]);
            return {
                family: "Résonance",
                text: "Cette archive dialogue avec " + listLabels(link ? link.items : []) + ".",
                target: link && link.items[0]
            };
        }

        if (context.type === "work") {
            const link = firstAvailable(context, ["archives", "concepts", "rooms", "images"]);
            return {
                family: "Origine",
                text: "Cette œuvre laisse voir ses origines dans " + listLabels(link ? link.items : []) + ".",
                target: link && link.items[0]
            };
        }

        if (context.type === "image" || context.type === "figure" || context.type === "book-image") {
            const link = firstAvailable(context, ["concepts", "archives", "works", "rooms"]);
            return {
                family: "Correspondance",
                text: "Cette image apparaît dans un réseau de correspondances avec " + listLabels(link ? link.items : []) + ".",
                target: link && link.items[0]
            };
        }

        if (context.type === "room") {
            const link = firstAvailable(context, ["concepts", "archives", "works", "images"]);
            return {
                family: "Prolongement",
                text: "Ce lieu peut se prolonger vers " + listLabels(link ? link.items : []) + ".",
                target: link && link.items[0]
            };
        }

        const link = firstAvailable(context, ["works", "archives", "images", "rooms", "figures"]);
        return {
            family: "Transformation",
            text: "Cette idée possède plusieurs prolongements dans " + listLabels(link ? link.items : []) + ".",
            target: link && link.items[0]
        };
    }

    function listLabels(ids) {
        if (!ids || !ids.length) {
            return "une autre partie du territoire";
        }
        return ids.slice(0, 3).map(label).join(", ");
    }

    function injectStyles() {
        if (document.getElementById(GUIDE_STYLE_ID)) {
            return;
        }
        const style = create("style");
        style.id = GUIDE_STYLE_ID;
        style.textContent = `
            [data-living-guide]{margin:0 20px 22px}
            .living-guide-card{
                padding:18px 20px;
                border:1px solid rgba(255,224,158,.18);
                border-radius:20px;
                background:
                    radial-gradient(circle at 12% 0, rgba(255,211,128,.12), transparent 44%),
                    rgba(7,16,29,.34);
                box-shadow:0 18px 42px rgba(0,0,0,.2), 0 0 34px rgba(255,198,96,.08);
                text-align:left;
            }
            .living-guide-title{
                margin:0 0 8px;
                color:rgba(255,224,158,.9);
                font-family:Arial, sans-serif;
                font-size:12px;
                letter-spacing:.09em;
                text-transform:uppercase;
            }
            .living-guide-card p{
                max-width:none;
                margin:0;
                color:rgba(255,246,222,.8);
                font-size:clamp(14px, 2.3vw, 17px);
                line-height:1.55;
            }
            .living-guide-action{
                display:inline-flex;
                margin-top:14px;
                padding:8px 12px;
                border:1px solid rgba(255,224,158,.24);
                border-radius:999px;
                color:#ffe0a0;
                background:transparent;
                cursor:pointer;
                font:13px Arial, sans-serif;
            }
            .living-guide-action:hover,
            .living-guide-action:focus-visible{
                border-color:rgba(255,224,158,.52);
                outline:none;
                box-shadow:0 0 22px rgba(255,198,96,.12);
            }
        `;
        document.head.appendChild(style);
    }

    function renderGuide(context, suggestion) {
        const host = $("[data-living-guide]");
        if (!host || !suggestion) {
            return;
        }
        host.innerHTML = "";
        const card = create("article", "living-guide-card");
        card.appendChild(create("p", "living-guide-title", "✦ Le Guide Vivant"));
        card.appendChild(create("p", "", suggestion.text));
        if (suggestion.target) {
            const button = create("button", "living-guide-action", "Explorer");
            button.type = "button";
            button.addEventListener("click", () => {
                document.dispatchEvent(new CustomEvent("living-guide:explore", {
                    detail: {
                        from: context.source,
                        target: suggestion.target,
                        family: suggestion.family
                    }
                }));
                document.dispatchEvent(new CustomEvent("living-graph:request-selection", {
                    detail: {
                        id: suggestion.target
                    }
                }));
            });
            card.appendChild(button);
        }
        host.appendChild(card);
    }

    function onSelection(id) {
        if (!state.ready) {
            return;
        }
        const context = relatedFromSelection(id);
        if (!context) {
            return;
        }
        const memory = remember(id);
        const suggestion = chooseSuggestion(context, memory);
        renderGuide(context, suggestion);
    }

    function initData() {
        return Promise.all([
            fetchJson(DATA_PATHS.graph),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([graph, concepts, works, assets, mapping]) => {
            state = {
                ...state,
                graph,
                concepts,
                works,
                assets,
                mapping,
                ready: true
            };
            buildLabels();
        });
    }

    function initEvents() {
        document.addEventListener("living-graph:selected", event => {
            if (event.detail && event.detail.id) {
                onSelection(event.detail.id);
            }
        });
    }

    function init() {
        const host = $("[data-living-guide]");
        if (!host) {
            return;
        }
        injectStyles();
        initEvents();
        initData()
            .then(() => {
                const defaultWork = state.works.works.find(work => normalize(work.title).includes("marges vivantes"));
                onSelection(defaultWork ? defaultWork.id : "D001");
            })
            .catch(error => {
                host.innerHTML = "";
                const card = create("article", "living-guide-card");
                card.appendChild(create("p", "living-guide-title", "✦ Le Guide Vivant"));
                card.appendChild(create("p", "", error.message));
                host.appendChild(card);
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
