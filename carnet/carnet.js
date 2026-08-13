(function () {
    const NARRATIVE_KEY = "makerland.narrativeMemory.v1";
    const CYCLE_KEY = "makerland:living-cycle";

    const RESONANCES = [
        "Les chemins changent avec ceux qui les parcourent.",
        "Rien n'oblige a tout decouvrir aujourd'hui.",
        "Certains recits demandent plusieurs rencontres.",
        "Les lieux gardent parfois la memoire des visiteurs.",
        "Chaque retour eclaire autrement ce qui a deja ete traverse."
    ];

    const PLACES = [
        "Bibliotheque",
        "Boussole",
        "Cartes Narratives",
        "Oeuvre immersive",
        "Atelier",
        "Constellation"
    ];

    const OBJECT_LABELS = {
        "carnet-dialogue": "Carnet de dialogue",
        "premiere-question": "Premiere question",
        "conversation-fondatrice": "Conversation fondatrice",
        "intuition-marquante": "Intuition marquante",
        "carte-narrative": "Carte narrative",
        "spirale": "Spirale",
        "constellation": "Constellation",
        "polarite": "Polarite",
        "image-retenue": "Image retenue",
        "image-abandonnee": "Image abandonnee",
        "prompt-creatif": "Prompt creatif",
        "variantes": "Variantes",
        "brouillon": "Brouillon",
        "annotation": "Annotation",
        "correction": "Correction",
        "structure": "Changement de structure",
        "journal-versions": "Journal des versions",
        "jalon-rv": "Jalon RV",
        "grande-evolution": "Grande evolution",
        "perspective": "Perspective"
    };

    function readJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (error) {
            return {};
        }
    }

    function getBookStats() {
        const stats = [];

        try {
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);

                if (!key || key.indexOf("makerland_clicks_") !== 0) {
                    continue;
                }

                const id = key.replace("makerland_clicks_", "");
                const count = Number(localStorage.getItem(key) || 0);

                if (count > 0) {
                    stats.push({ id, count });
                }
            }
        } catch (error) {
            return [];
        }

        return stats;
    }

    function formatValue(value) {
        if (!value) {
            return "Non encore inscrit";
        }

        return String(value)
            .replace(/_/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function createCard(title, lines) {
        const card = document.createElement("article");
        card.className = "placeholder-card journal-card";
        card.innerHTML = [
            "<h3>" + title + "</h3>",
            "<ul>",
            lines.map(line => "<li>" + line + "</li>").join(""),
            "</ul>"
        ].join("");
        return card;
    }

    function renderResonance() {
        const target = document.querySelector("[data-journal-resonance]");

        if (!target) {
            return;
        }

        const index = Math.floor(Math.random() * RESONANCES.length);
        target.textContent = RESONANCES[index];
    }

    function renderTraces(memory, cycle, books) {
        const target = document.querySelector("[data-journal-traces]");

        if (!target) {
            return;
        }

        const atelierRooms = cycle.atelierRooms || [];
        const fragments = cycle.constellationFragments || [];
        const objects = cycle.atelierObjectIds || [];

        [
            createCard("Bibliotheque", [
                books.length + " oeuvres ouvertes ou approchees"
            ]),
            createCard("Boussole", [
                "Derniere meteo : " + formatValue(memory.lastWeather),
                "Derniere direction : " + formatValue(memory.lastDirection)
            ]),
            createCard("Cartes Narratives", [
                "Cartes rencontrees : " + ((cycle.cartes || []).length || "a venir")
            ]),
            createCard("Atelier IA", [
                "Chambres visitees : " + atelierRooms.length,
                atelierRooms.map(formatValue).join(", ") || "Aucune chambre inscrite"
            ]),
            createCard("Constellation", [
                "Fragments decouverts : " + fragments.length
            ]),
            createCard("Oeuvres immersives", [
                "Derniere oeuvre : " + (cycle.lastImmersiveWork || "A inscrire")
            ]),
            createCard("Objets vivants", [
                "Objets explores : " + objects.length
            ])
        ].forEach(card => target.appendChild(card));
    }

    function renderPath(cycle) {
        const target = document.querySelector("[data-journal-path]");

        if (!target) {
            return;
        }

        const visited = new Set([
            "Bibliotheque",
            "Boussole",
            (cycle.atelierRooms || []).length ? "Atelier" : "",
            (cycle.constellationFragments || []).length ? "Constellation" : ""
        ]);

        PLACES.forEach(place => {
            const node = document.createElement("span");
            node.className = visited.has(place)
                ? "journal-path-node is-lit"
                : "journal-path-node";
            node.textContent = place;
            target.appendChild(node);
        });
    }

    function renderObjects(cycle) {
        const target = document.querySelector("[data-journal-objects]");

        if (!target) {
            return;
        }

        const objects = cycle.atelierObjectIds || [];
        const labels = objects.length
            ? objects.map(id => OBJECT_LABELS[id] || formatValue(id))
            : ["Carnets", "Cartes", "Dialogues", "Fragments", "Constellations"];

        labels.forEach(label => {
            const tag = document.createElement("span");
            tag.textContent = label;
            target.appendChild(tag);
        });
    }

    function renderEncounters(cycle, books) {
        const target = document.querySelector("[data-journal-encounters]");

        if (!target) {
            return;
        }

        const atelierRooms = (cycle.atelierRooms || []).slice(-5);
        const fragments = (cycle.constellationFragments || []).slice(-7);
        const objectIds = (cycle.atelierObjectIds || []).slice(-7);

        [
            createCard("Dernieres oeuvres ouvertes", [
                books.map(book => formatValue(book.id)).join(", ") ||
                    "Aucune oeuvre inscrite pour le moment"
            ]),
            createCard("Derniers fragments lus", [
                fragments.map(formatValue).join(", ") ||
                    "Aucun fragment inscrit pour le moment"
            ]),
            createCard("Derniers dialogues consultes", [
                atelierRooms.map(formatValue).join(", ") ||
                    "Aucune chambre inscrite pour le moment"
            ]),
            createCard("Objets vivants rencontres", [
                objectIds
                    .map(id => OBJECT_LABELS[id] || formatValue(id))
                    .join(", ") ||
                    "Aucun objet inscrit pour le moment"
            ])
        ].forEach(card => target.appendChild(card));
    }

    function init() {
        const memory = readJson(NARRATIVE_KEY);
        const cycle = readJson(CYCLE_KEY);
        const books = getBookStats();

        renderResonance();
        renderTraces(memory, cycle, books);
        renderPath(cycle);
        renderObjects(cycle);
        renderEncounters(cycle, books);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
