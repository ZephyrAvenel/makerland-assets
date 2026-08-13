(function () {
    const DATA_PATHS = {
        graph: "../../data/living-graph.json",
        concepts: "../../data/concept-network.json",
        works: "../../data/work-network.json",
        assets: "../../data/archive-assets.json",
        mapping: "../../data/archive-mapping.json"
    };

    const SPECIAL_ENTRIES = [
        {
            id: "TERM-ECOLOGIE-NARRATIVE",
            type: "concept",
            name: "Écologie narrative",
            source: "Entrée relationnelle issue du fichier micro-ecologie-narrative.png"
        }
    ];

    let state = {
        graph: null,
        concepts: null,
        works: null,
        assets: null,
        mapping: null,
        activeId: null,
        index: new Map()
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
                throw new Error("Impossible de charger " + path);
            }
            return response.json();
        });
    }

    function nodeLabel(id) {
        const item = state.index.get(id);
        return item ? item.label : id;
    }

    function assetById(id) {
        return state.assets.assets.find(asset => asset.id === id);
    }

    function conceptById(id) {
        return state.concepts.concepts.find(concept => concept.id === id);
    }

    function workById(id) {
        return state.works.works.find(work => work.id === id);
    }

    function archiveById(id) {
        return state.mapping.mappings.find(archive => archive.id === id);
    }

    function graphNode(id) {
        return state.graph.nodes.find(node => node.id === id);
    }

    function addIndex(id, type, label, payload) {
        state.index.set(id, { id, type, label, payload });
    }

    function buildIndex() {
        state.index = new Map();

        state.concepts.concepts.forEach(concept => {
            addIndex(concept.id, "concept", concept.name, concept);
        });

        SPECIAL_ENTRIES.forEach(entry => {
            addIndex(entry.id, entry.type, entry.name, entry);
        });

        state.works.works.forEach(work => {
            addIndex(work.id, "work", cleanTitle(work.title), work);
        });

        state.mapping.mappings.forEach(archive => {
            addIndex(archive.id, "archive", archive.id + " — " + archive.label, archive);
        });

        state.assets.assets.forEach(asset => {
            addIndex(asset.id, "image", cleanTitle(asset.name), asset);
            if (asset.figureId) {
                addIndex(asset.figureId, "figure", cleanTitle(asset.name), asset);
            }
        });

        state.graph.rooms.forEach(room => {
            addIndex(room.id, "room", room.name, room);
        });

        state.graph.nodes
            .filter(node => node.type === "article-block")
            .forEach(node => addIndex(node.id, "article", node.label, node));
    }

    function specialRelations(entry) {
        const matchingAssets = state.assets.assets.filter(asset =>
            normalize(asset.name + " " + asset.subject + " " + asset.concepts.join(" ")).includes("ecologie")
        );
        const images = matchingAssets.map(asset => asset.id);
        const figures = matchingAssets.map(asset => asset.figureId).filter(Boolean);
        const archives = Array.from(new Set(matchingAssets.flatMap(asset => asset.archiveCandidates || [])));
        const rooms = ["ROOM-OEUVRE", "ROOM-CONSTELLATION", "ROOM-ATELIER"];
        const articles = state.graph.nodes
            .filter(node => node.type === "article-block" && normalize(node.label).includes("ecologie"))
            .map(node => node.id);

        return {
            id: entry.id,
            title: entry.name,
            type: "Entrée relationnelle",
            summary: entry.source,
            relations: {
                Archives: archives,
                "Œuvres": [],
                Images: images,
                Figures: figures,
                Articles: articles,
                Salles: rooms,
                "Packs narratifs": []
            }
        };
    }

    function conceptRelations(concept) {
        return {
            id: concept.id,
            title: concept.name,
            type: "Concept",
            summary: "Concept issu du catalogue patrimonial RV-090.",
            relations: {
                Archives: concept.archives,
                "Œuvres": concept.works,
                Images: concept.images,
                Figures: concept.figures,
                Articles: concept.articleBlocks,
                Salles: concept.rooms,
                "Packs narratifs": concept.narrativePacks
            }
        };
    }

    function workRelations(work) {
        return {
            id: work.id,
            title: cleanTitle(work.title),
            type: "Œuvre",
            summary: "Couverture ou livre candidat issu du catalogue RV-090.",
            relations: {
                Archives: work.archives,
                Concepts: work.concepts,
                Images: work.images,
                Figures: work.figures,
                Articles: work.articleBlocks,
                Salles: [work.primaryRoom].filter(Boolean),
                "Œuvres associées": work.associatedWorks
            }
        };
    }

    function archiveRelations(archive) {
        const archiveIndex = state.mapping.mappings.findIndex(item => item.id === archive.id);
        const sequence = [
            archiveIndex > 0 ? state.mapping.mappings[archiveIndex - 1].id : null,
            archiveIndex < state.mapping.mappings.length - 1 ? state.mapping.mappings[archiveIndex + 1].id : null
        ].filter(Boolean);

        const rooms = Array.from(new Set(archive.concepts.flatMap(conceptId => {
            const concept = conceptById(conceptId);
            return concept ? concept.rooms : [];
        })));

        return {
            id: archive.id,
            title: archive.id + " — " + archive.label,
            type: "Archive Vivante",
            summary: archive.note || "Archive issue du mapping patrimonial.",
            relations: {
                "Archives voisines": sequence,
                Concepts: archive.concepts,
                "Œuvres": archive.books,
                Images: archive.images,
                Figures: archive.figures,
                Salles: rooms,
                Articles: []
            }
        };
    }

    function imageRelations(asset) {
        const conceptIds = asset.concepts
            .map(name => state.concepts.concepts.find(concept => concept.name === name))
            .filter(Boolean)
            .map(concept => concept.id);

        return {
            id: asset.id,
            title: cleanTitle(asset.name),
            type: asset.isBookCover ? "Image de couverture" : "Image",
            summary: asset.subject || "Image issue du corpus patrimonial.",
            relations: {
                Archives: asset.archiveCandidates,
                Concepts: conceptIds,
                "Œuvres": asset.bookId ? [asset.bookId] : [],
                Figures: asset.figureId ? [asset.figureId] : [],
                Salles: state.graph.edges.filter(edge => edge.source === asset.id && edge.type === "image_room").map(edge => edge.target),
                Articles: []
            }
        };
    }

    function roomRelations(room) {
        return {
            id: room.id,
            title: room.name,
            type: "Salle Makerland",
            summary: room.role,
            relations: {
                Archives: room.archives,
                Concepts: room.concepts,
                "Œuvres": room.works,
                Images: room.images,
                Figures: room.figures,
                Articles: []
            }
        };
    }

    function relationModel(id) {
        const entry = state.index.get(id);
        if (!entry) {
            return null;
        }

        if (id === "TERM-ECOLOGIE-NARRATIVE") {
            return specialRelations(entry.payload);
        }
        if (entry.type === "concept") {
            return conceptRelations(entry.payload);
        }
        if (entry.type === "work") {
            return workRelations(entry.payload);
        }
        if (entry.type === "archive") {
            return archiveRelations(entry.payload);
        }
        if (entry.type === "image" || entry.type === "figure") {
            return imageRelations(entry.payload);
        }
        if (entry.type === "room") {
            return roomRelations(entry.payload);
        }
        if (entry.type === "article") {
            return {
                id,
                title: entry.label,
                type: "Bloc / article candidat",
                summary: "Bloc detecté dans PAGE_CATALOG.md.",
                relations: {
                    Concepts: state.graph.edges.filter(edge => edge.target === id && edge.type === "concept_article_block").map(edge => edge.source)
                }
            };
        }
        return null;
    }

    function createChip(entry) {
        const button = create("button", "graph-chip", entry.label);
        button.type = "button";
        button.dataset.nodeId = entry.id;
        button.setAttribute("aria-pressed", entry.id === state.activeId ? "true" : "false");
        if (entry.id === state.activeId) {
            button.classList.add("is-active");
        }
        button.addEventListener("click", () => selectNode(entry.id));
        return button;
    }

    function renderLists(filter = "") {
        const query = normalize(filter);
        const concepts = [
            ...SPECIAL_ENTRIES.map(entry => state.index.get(entry.id)),
            ...state.concepts.concepts.map(concept => state.index.get(concept.id))
        ].filter(Boolean);
        const works = state.works.works.map(work => state.index.get(work.id)).filter(Boolean);
        const archives = state.mapping.mappings.map(archive => state.index.get(archive.id)).filter(Boolean);

        [
            ["[data-concept-list]", concepts],
            ["[data-work-list]", works],
            ["[data-archive-list]", archives]
        ].forEach(([selector, entries]) => {
            const host = $(selector);
            if (!host) {
                return;
            }
            host.innerHTML = "";
            entries
                .filter(entry => !query || normalize(entry.label).includes(query))
                .slice(0, 32)
                .forEach(entry => host.appendChild(createChip(entry)));
        });
    }

    function relationList(title, ids) {
        const column = create("section", "relation-column");
        column.appendChild(create("h3", "", title));
        if (!ids || !ids.length) {
            column.appendChild(create("p", "relation-empty", "Aucune relation directe dans RV-091."));
            return column;
        }

        const list = create("ul");
        ids.slice(0, 24).forEach(id => {
            const item = create("li");
            if (!state.index.has(id)) {
                item.appendChild(create("span", "relation-empty", nodeLabel(id)));
                list.appendChild(item);
                return;
            }
            const button = create("button", "relation-link", nodeLabel(id));
            button.type = "button";
            button.addEventListener("click", () => {
                selectNode(id);
            });
            item.appendChild(button);
            list.appendChild(item);
        });
        column.appendChild(list);
        return column;
    }

    function renderDetail(model) {
        const host = $("[data-graph-detail]");
        if (!host || !model) {
            return;
        }
        host.innerHTML = "";
        host.appendChild(create("p", "placeholder-meta", model.type));
        host.appendChild(create("h2", "", model.title));
        host.appendChild(create("p", "", model.summary));

        const grid = create("div", "relation-grid");
        Object.entries(model.relations).forEach(([title, ids]) => {
            grid.appendChild(relationList(title, ids));
        });
        host.appendChild(grid);
    }

    function renderMap(model) {
        const host = $("[data-graph-map]");
        if (!host || !model) {
            return;
        }

        const relationIds = Object.values(model.relations).flat().filter(Boolean).slice(0, 18);
        const nodes = [{ id: model.id, label: model.title, focus: true }].concat(
            relationIds.map(id => ({ id, label: nodeLabel(id), focus: false }))
        );

        const width = 860;
        const height = 360;
        const center = { x: width / 2, y: height / 2 };
        const radius = 132;
        const positioned = nodes.map((node, index) => {
            if (index === 0) {
                return { ...node, x: center.x, y: center.y };
            }
            const angle = ((index - 1) / Math.max(1, nodes.length - 1)) * Math.PI * 2 - Math.PI / 2;
            return {
                ...node,
                x: center.x + Math.cos(angle) * radius * (index % 2 ? 1.22 : 1),
                y: center.y + Math.sin(angle) * radius * (index % 3 ? 1 : .78)
            };
        });

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);
        svg.setAttribute("class", "living-constellation-svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Carte relationnelle de " + model.title);

        positioned.slice(1).forEach(node => {
            const edge = document.createElementNS("http://www.w3.org/2000/svg", "path");
            edge.setAttribute("class", "graph-edge");
            edge.setAttribute("d", `M ${center.x} ${center.y} C ${(center.x + node.x) / 2} ${center.y - 34}, ${(center.x + node.x) / 2} ${node.y + 34}, ${node.x} ${node.y}`);
            svg.appendChild(edge);
        });

        positioned.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("tabindex", "0");
            group.setAttribute("role", "button");
            group.setAttribute("aria-label", node.label);
            group.addEventListener("click", () => {
                if (!node.focus && state.index.has(node.id)) {
                    selectNode(node.id);
                }
            });

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("class", "graph-node" + (node.focus ? " is-focus" : ""));
            circle.setAttribute("cx", node.x);
            circle.setAttribute("cy", node.y);
            circle.setAttribute("r", node.focus ? "34" : "22");
            group.appendChild(circle);

            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("class", "graph-label");
            label.setAttribute("x", node.x);
            label.setAttribute("y", node.y + (node.focus ? 54 : 40));
            label.textContent = node.label.length > 28 ? node.label.slice(0, 25) + "..." : node.label;
            group.appendChild(label);
            svg.appendChild(group);
        });

        host.innerHTML = "";
        host.appendChild(svg);
    }

    function selectNode(id) {
        state.activeId = id;
        const model = relationModel(id);
        renderLists($("[data-graph-search]")?.value || "");
        renderMap(model);
        renderDetail(model);
    }

    function initSearch() {
        const input = $("[data-graph-search]");
        if (!input) {
            return;
        }
        input.addEventListener("input", () => renderLists(input.value));
    }

    function init() {
        Promise.all([
            fetchJson(DATA_PATHS.graph),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ])
            .then(([graph, concepts, works, assets, mapping]) => {
                state = { ...state, graph, concepts, works, assets, mapping };
                buildIndex();
                initSearch();
                renderLists();
                const marginWork = state.works.works.find(work => normalize(work.title).includes("marges vivantes"));
                selectNode(marginWork ? marginWork.id : "TERM-ECOLOGIE-NARRATIVE");
            })
            .catch(error => {
                const host = $("[data-graph-detail]");
                if (host) {
                    host.innerHTML = "";
                    host.appendChild(create("p", "relation-empty", error.message));
                }
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
