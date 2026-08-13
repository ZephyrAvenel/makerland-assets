(function (global) {
    const SCRIPT_URL =
        typeof document !== "undefined" && document.currentScript
            ? document.currentScript.src
            : "file:///js/livingCurator.js";

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

    const ROOM_RULES = [
        ["ROOM-BIBLIOTHEQUE", ["bibliotheque", "livre", "couverture", "atlas", "marge", "fractale", "etoile"]],
        ["ROOM-BOUSSOLE", ["boussole", "orientation", "meteo", "meteorologie", "repere", "passage"]],
        ["ROOM-ATELIER", ["atelier", "dialogue", "creation", "ecriture", "clarification", "image", "idee"]],
        ["ROOM-CONSTELLATION", ["constellation", "relation", "resonance", "transmission", "rencontre"]],
        ["ROOM-CARNET", ["carnet", "memoire", "trace", "voyage"]],
        ["ROOM-OEUVRE", ["oeuvre", "foret", "seuil", "spirale", "cosmologie", "recit", "vivant"]]
    ];

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
        return Array.from(new Set(values.filter(Boolean)));
    }

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Conservateur Vivant : impossible de charger " + path);
            }
            return response.json();
        });
    }

    function overlapScore(resourceTokens, candidateText) {
        const candidateTokens = new Set(tokenize(candidateText));
        return unique(resourceTokens).reduce((score, token) => {
            return score + (candidateTokens.has(token) ? 1 : 0);
        }, 0);
    }

    function cleanResource(resource) {
        return {
            id: resource.id || "RESOURCE-NOUVELLE",
            type: resource.type || "resource",
            title: resource.title || resource.name || "Ressource sans titre",
            summary: resource.summary || resource.description || "",
            concepts: Array.isArray(resource.concepts) ? resource.concepts : [],
            tags: Array.isArray(resource.tags) ? resource.tags : [],
            origin: resource.origin || "",
            date: resource.date || ""
        };
    }

    function resourceText(resource) {
        return [
            resource.id,
            resource.type,
            resource.title,
            resource.summary,
            resource.origin,
            resource.date,
            resource.concepts.join(" "),
            resource.tags.join(" ")
        ].join(" ");
    }

    function scoreList(items, resourceTokens, textBuilder, limit) {
        return items
            .map(item => ({
                id: item.id,
                label: item.name || item.label || item.title || item.id,
                score: overlapScore(resourceTokens, textBuilder(item)),
                reason: "Mots communs detectes dans les metadonnees."
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
            .slice(0, limit);
    }

    function conceptsFor(data, resourceTokens) {
        return scoreList(
            data.concepts.concepts,
            resourceTokens,
            concept => [
                concept.name,
                concept.archives.join(" "),
                concept.works.join(" "),
                concept.images.join(" "),
                concept.articleBlocks.join(" ")
            ].join(" "),
            8
        );
    }

    function archivesFor(data, resourceTokens) {
        return scoreList(
            data.mapping.mappings,
            resourceTokens,
            archive => [
                archive.id,
                archive.label,
                archive.concepts.join(" "),
                archive.books.join(" "),
                archive.images.join(" "),
                archive.figures.join(" ")
            ].join(" "),
            8
        );
    }

    function worksFor(data, resourceTokens) {
        return scoreList(
            data.works.works,
            resourceTokens,
            work => [
                work.title,
                work.concepts.join(" "),
                work.archives.join(" "),
                work.images.join(" "),
                work.articleBlocks.join(" ")
            ].join(" "),
            8
        );
    }

    function imagesFor(data, resourceTokens) {
        return scoreList(
            data.assets.assets,
            resourceTokens,
            asset => [
                asset.name,
                asset.subject,
                asset.concepts.join(" "),
                asset.archiveCandidates.join(" "),
                asset.bookId || "",
                asset.figureId || ""
            ].join(" "),
            10
        );
    }

    function roomsFor(resourceTokens) {
        return ROOM_RULES
            .map(([id, words]) => ({
                id,
                label: id.replace("ROOM-", "").toLowerCase(),
                score: words.reduce((score, word) => score + (resourceTokens.includes(word) ? 1 : 0), 0),
                reason: "Champ lexical de salle detecte dans les metadonnees."
            }))
            .filter(room => room.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    function timelineFor(resourceTokens) {
        const rules = [
            ["T-001", "Intuition des Recits Vivants", ["intuition", "source", "recit", "vivant"]],
            ["T-002", "Structuration par seuils et motifs", ["seuil", "friction", "devenir", "resonance"]],
            ["T-003", "Naissance des cartes", ["carte", "atlas", "orientation", "meteorologie"]],
            ["T-004", "Construction de la cosmologie", ["cosmologie", "plurivers", "micro"]],
            ["T-005", "Deploiement de l'oeuvre immersive", ["oeuvre", "immersive", "foret", "passage"]],
            ["T-006", "Mise en relation avec les livres", ["livre", "couverture", "lecture"]],
            ["T-007", "Orientation et boussole", ["boussole", "orientation", "repere"]],
            ["T-008", "Prefiguration de Makerland", ["makerland", "spirale", "constellation", "transmission"]],
            ["T-009", "Preparation des Archives Vivantes", ["archive", "patrimoine", "catalogue"]]
        ];

        return rules
            .map(([id, label, words]) => ({
                id,
                label,
                score: words.reduce((score, word) => score + (resourceTokens.includes(word) ? 1 : 0), 0),
                reason: "Correspondance avec la chronologie RV-090."
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    function suggest(data, resource) {
        const cleaned = cleanResource(resource);
        const tokens = tokenize(resourceText(cleaned));

        const suggestions = {
            concepts: conceptsFor(data, tokens),
            archives: archivesFor(data, tokens),
            works: worksFor(data, tokens),
            images: imagesFor(data, tokens),
            rooms: roomsFor(tokens),
            timeline: timelineFor(tokens)
        };

        return {
            resource: cleaned,
            suggestions,
            justification: buildJustification(cleaned, suggestions)
        };
    }

    function buildJustification(resource, suggestions) {
        const parts = [];
        if (suggestions.archives.length) {
            parts.push("archives " + suggestions.archives.slice(0, 3).map(item => item.id).join(", "));
        }
        if (suggestions.concepts.length) {
            parts.push("concepts " + suggestions.concepts.slice(0, 3).map(item => item.label).join(", "));
        }
        if (suggestions.rooms.length) {
            parts.push("salles " + suggestions.rooms.slice(0, 2).map(item => item.id).join(", "));
        }
        if (!parts.length) {
            return "Aucune relation forte detectee. Une analyse humaine est recommandee avant integration.";
        }
        return "La ressource \"" + resource.title + "\" pourrait etre reliee aux " + parts.join(" ; ") + ".";
    }

    function conservationReport(data, resource) {
        const result = suggest(data, resource);
        return {
            title: "Rapport de conservation",
            generatedAt: new Date().toISOString(),
            resource: result.resource,
            suggestions: result.suggestions,
            justification: result.justification,
            rules: [
                "Le Conservateur ne modifie jamais les donnees existantes.",
                "Les suggestions reposent uniquement sur les JSON relationnels locaux.",
                "Une relation suggeree doit rester validable par un humain."
            ]
        };
    }

    function graphDegree(data) {
        const counts = new Map();
        data.graph.edges.forEach(edge => {
            counts.set(edge.source, (counts.get(edge.source) || 0) + 1);
            counts.set(edge.target, (counts.get(edge.target) || 0) + 1);
        });
        return counts;
    }

    function audit(data) {
        const degree = graphDegree(data);
        const orphanNodes = data.graph.nodes
            .filter(node => !degree.get(node.id))
            .map(node => ({
                id: node.id,
                type: node.type,
                label: node.label
            }));

        const conceptsWithoutImages = data.concepts.concepts
            .filter(concept => !concept.images.length)
            .map(concept => ({
                id: concept.id,
                name: concept.name
            }));

        const archivesWithoutWorks = data.mapping.mappings
            .filter(archive => !archive.books.length)
            .map(archive => ({
                id: archive.id,
                label: archive.label
            }));

        const worksWithoutConcepts = data.works.works
            .filter(work => !work.concepts.length)
            .map(work => ({
                id: work.id,
                title: work.title
            }));

        const unlinkedImages = data.assets.assets
            .filter(asset => !asset.archiveCandidates.length && !asset.concepts.length && !asset.bookId && !asset.figureId)
            .map(asset => ({
                id: asset.id,
                name: asset.name
            }));

        return {
            orphanNodes,
            conceptsWithoutImages,
            archivesWithoutWorks,
            worksWithoutConcepts,
            unlinkedImages
        };
    }

    function health(data) {
        const checks = audit(data);
        const relations = data.graph.edges.length;
        const nodes = data.graph.nodes.length;
        return {
            archives: data.mapping.mappings.length,
            concepts: data.concepts.concepts.length,
            works: data.works.works.length,
            images: data.assets.assets.length,
            nodes,
            relations,
            orphanResources: checks.orphanNodes.length + checks.unlinkedImages.length,
            conceptsWithoutIllustration: checks.conceptsWithoutImages.length,
            archivesWithoutWork: checks.archivesWithoutWorks.length,
            worksWithoutConcepts: checks.worksWithoutConcepts.length,
            relationDensity: nodes ? Number((relations / nodes).toFixed(2)) : 0
        };
    }

    function load() {
        return Promise.all([
            fetchJson(DATA_PATHS.graph),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([graph, concepts, works, assets, mapping]) => ({
            graph,
            concepts,
            works,
            assets,
            mapping
        }));
    }

    const LivingCurator = {
        load,
        suggest,
        conservationReport,
        audit,
        health,
        normalize,
        tokenize
    };

    global.LivingCurator = LivingCurator;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = LivingCurator;
    }
})(typeof window !== "undefined" ? window : globalThis);
