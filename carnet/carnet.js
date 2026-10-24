(function () {
    const NARRATIVE_KEY = "makerland.narrativeMemory.v1";
    const GUARDIAN_ENCOUNTERS_KEY = "makerland.guardianEncounters.v1";

    const RESONANCES = [
        "Les chemins changent avec ceux qui les parcourent.",
        "Rien n'oblige a tout decouvrir aujourd'hui.",
        "Certains recits demandent plusieurs rencontres.",
        "Les lieux gardent parfois la memoire des visiteurs.",
        "Chaque retour eclaire autrement ce qui a deja ete traverse."
    ];

    const PLACES = [
        "Bibliotheque",
        "Atelier",
        "Carnet",
        "Constellation",
        "Transmission",
        "Oeuvres",
        "Boussole",
        "Cartes Narratives"
    ];

    const PLACE_LABELS = {
        "atelier:atelier": "l'Atelier",
        "atelier:dialogue": "la chambre Dialogue",
        "atelier:cartographie": "la chambre Cartographie",
        "atelier:images": "la chambre Images",
        "atelier:clarification": "la chambre Clarification",
        "atelier:evolution": "la chambre Evolution",
        "constellation:constellation": "la Constellation",
        "constellation:chemin": "le Chemin",
        "constellation:fonctionnement": "le Fonctionnement",
        "constellation:transmission": "la Transmission",
        "constellation:temoignages": "les Temoignages",
        "carnet:carnet": "le Carnet"
    };

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

    const ARCHIVE_DIALOGUES = [
        ["D001", "Pourquoi les Recits Vivants"],
        ["D002", "Naissance de la pensee dialogique"],
        ["D003", "Naissance de la Cosmologie des Recits Vivants"],
        ["D004", "Naissance des Cartes Narratives"],
        ["D005", "Naissance de l'Oeuvre immersive"],
        ["D006", "Naissance du Territoire des Recits Vivants"],
        ["D007", "Naissance de la Bibliotheque Vivante"],
        ["D008", "Naissance de la Boussole Vivante"],
        ["D009", "Naissance de l'Atelier des Recits"],
        ["D010", "Naissance des Archives Vivantes"]
    ];

    function readJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (error) {
            return {};
        }
    }

    function addUnique(list, value) {
        const values = Array.isArray(list) ? list : [];
        return values.includes(value) ? values : values.concat(value);
    }

    function readLivingCycle() {
        const storage = window.MakerlandLivingCycleStorage;

        if (!storage || !storage.read || !storage.write) {
            return { memory: {}, raw: null, writable: false, storage: null };
        }

        try {
            const state = storage.read();

            if (!state || !state.memory || typeof state.memory !== "object") {
                return { memory: {}, raw: null, writable: false, storage: null };
            }

            return { ...state, storage };
        } catch (error) {
            return { memory: {}, raw: null, writable: false, storage: null };
        }
    }

    function rememberCarnet() {
        const state = readLivingCycle();
        const cycle = state.memory;
        const places = Array.isArray(cycle.visitedPlaces)
            ? cycle.visitedPlaces
            : [];

        if (!places.some(place => place.id === "carnet:carnet")) {
            places.push({
                id: "carnet:carnet",
                label: "Carnet",
                firstSeen: new Date().toISOString()
            });
        }

        cycle.visitedPlaces = places;
        cycle.visitedPlaceIds = addUnique(cycle.visitedPlaceIds, "carnet:carnet");
        cycle.milestones = addUnique(cycle.milestones, "Carnet ouvert");

        if (state.writable && state.storage) {
            state.storage.write(cycle, state.raw);
        }

        return cycle;
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
        const heading = document.createElement("h3");
        const list = document.createElement("ul");

        card.className = "placeholder-card journal-card";
        heading.textContent = title;
        card.appendChild(heading);

        lines.forEach(line => {
            const item = document.createElement("li");
            item.textContent = line;
            list.appendChild(item);
        });

        card.appendChild(list);
        return card;
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? "Non encore visite"
            : date.toLocaleDateString("fr-FR");
    }

    function renderResonance() {
        const target = document.querySelector("[data-journal-resonance]");

        if (!target) {
            return;
        }

        const index = Math.floor(Math.random() * RESONANCES.length);
        target.textContent = RESONANCES[index];
    }

    function renderGuardianWords() {
        const target = document.querySelector("[data-journal-guardian-words]");

        if (!target) {
            return;
        }

        const payload = readJson(GUARDIAN_ENCOUNTERS_KEY);
        const encounters = Array.isArray(payload.encounters)
            ? payload.encounters
            : [];

        if (!encounters.length) {
            const waiting = document.createElement("article");
            waiting.className = "placeholder-card journal-card journal-guardian-empty";
            waiting.innerHTML = [
                "<h3>Les Paroles des Gardiens</h3>",
                "<p>Les Gardiens des Recits Vivants apparaissent parfois au detour d'un chemin.</p>",
                "<p>Leurs paroles ne demandent pas a etre retenues. Elles demandent seulement a pouvoir etre retrouvees lorsque le voyage en aura de nouveau besoin.</p>"
            ].join("");
            target.appendChild(waiting);
            return;
        }

        encounters.forEach(encounter => {
            const details = encounter && typeof encounter === "object" ? encounter : {};
            const card = document.createElement("article");
            const seal = document.createElement("span");
            const figure = document.createElement("div");
            const heading = document.createElement("h3");
            const whisper = document.createElement("blockquote");
            const meta = document.createElement("p");
            const link = document.createElement("a");

            card.className = "placeholder-card journal-card journal-guardian-card";
            seal.className = "journal-guardian-seal";
            seal.setAttribute("aria-hidden", "true");
            figure.className = "journal-guardian-figure";
            figure.setAttribute("aria-hidden", "true");
            figure.textContent = details.illustration || "✦";
            heading.textContent = details.guardianName || "Gardien des Recits Vivants";
            whisper.textContent = details.whisper || "";
            meta.className = "journal-guardian-meta";
            meta.appendChild(document.createTextNode("Rencontree :"));
            meta.appendChild(document.createElement("br"));
            meta.appendChild(document.createTextNode(
                details.territoryLabel || "Territoire des Recits Vivants"
            ));
            meta.appendChild(document.createElement("br"));
            meta.appendChild(document.createTextNode(formatDate(details.firstEncounteredAt)));
            link.className = "placeholder-return";
            link.setAttribute("href", resolveEncounterHref(details));
            link.textContent = "Revenir dans ce territoire";
            card.appendChild(seal);
            card.appendChild(figure);
            card.appendChild(heading);
            card.appendChild(whisper);
            card.appendChild(meta);
            card.appendChild(link);
            target.appendChild(card);
        });
    }

    function resolveEncounterHref(encounter) {
        const href = encounter && typeof encounter.territoryHref === "string" &&
            encounter.territoryHref
            ? encounter.territoryHref
            : "../index.html";

        if (/^https?:\/\//i.test(href) || href.indexOf("../") === 0) {
            return href;
        }

        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
            return "../index.html";
        }

        return "../" + href;
    }

    function renderTraces(memory, cycle, books) {
        const target = document.querySelector("[data-journal-traces]");

        if (!target) {
            return;
        }

        const atelierRooms = cycle.atelierRooms || [];
        const fragments = cycle.constellationFragments || [];
        const objects = cycle.atelierObjectIds || [];
        const seasonalFragments = cycle.seasonalFragments || [];

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
            createCard("Atelier des Recits", [
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
            ]),
            createCard("Premiers souvenirs", [
                (cycle.milestones || []).join(", ") ||
                    "Les premiers souvenirs s'inscriront au fil du voyage"
            ]),
            createCard("Fragments saisonniers", [
                seasonalFragments.slice(-3).join(", ") ||
                    "Les saisons inscriront parfois une phrase ici"
            ])
        ].forEach(card => target.appendChild(card));
    }

    function hasVisitedPlace(cycle, id) {
        return (cycle.visitedPlaceIds || []).includes(id);
    }

    function hasVisitedPath(memory, cycle, place) {
        if (place === "Bibliotheque") {
            return true;
        }

        if (place === "Atelier") {
            return (cycle.atelierRooms || []).length > 0;
        }

        if (place === "Carnet") {
            return hasVisitedPlace(cycle, "carnet:carnet");
        }

        if (place === "Constellation") {
            return (cycle.constellationFragments || []).length > 0;
        }

        if (place === "Transmission") {
            return hasVisitedPlace(cycle, "constellation:transmission");
        }

        if (place === "Oeuvres") {
            return Boolean(cycle.lastImmersiveWork);
        }

        if (place === "Boussole") {
            return Boolean(memory.lastDirection || memory.lastWeather);
        }

        if (place === "Cartes Narratives") {
            return (cycle.cartes || []).length > 0;
        }

        return false;
    }

    function renderPath(memory, cycle) {
        const target = document.querySelector("[data-journal-path]");

        if (!target) {
            return;
        }

        PLACES.forEach(place => {
            const node = document.createElement("span");
            node.className = hasVisitedPath(memory, cycle, place)
                ? "journal-path-node is-lit"
                : "journal-path-node";
            node.textContent = place;
            target.appendChild(node);
        });
    }

    function renderFirstSteps(cycle) {
        const target = document.querySelector("[data-journal-first-steps]");

        if (!target) {
            return;
        }

        const places = Array.isArray(cycle.visitedPlaces)
            ? cycle.visitedPlaces
            : [];
        const steps = places
            .filter(place => place.id !== "carnet:carnet")
            .slice(0, 5)
            .map(place => PLACE_LABELS[place.id] || place.label || place.id);
        const lines = ["Vous avez commence votre voyage dans la Bibliotheque."];

        steps.forEach((label, index) => {
            lines.push(
                (index === 0 ? "Puis vous avez decouvert " : "Puis ") +
                    label +
                    "."
            );
        });

        if (steps.length === 0) {
            lines.push("Les prochains lieux traverses viendront doucement s'y inscrire.");
        }

        target.textContent = "";
        lines.forEach(line => {
            const paragraph = document.createElement("p");
            paragraph.textContent = line;
            target.appendChild(paragraph);
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

    function renderDialogues(cycle) {
        const target = document.querySelector("[data-journal-dialogues]");

        if (!target) {
            return;
        }

        const visited = cycle.archiveDialogs && typeof cycle.archiveDialogs === "object"
            ? cycle.archiveDialogs
            : {};

        ARCHIVE_DIALOGUES.forEach(item => {
            const id = item[0];
            const known = visited[id];
            const card = document.createElement("article");
            const heading = document.createElement("h3");
            const title = document.createElement("p");
            const list = document.createElement("ul");
            const state = document.createElement("li");
            const lastVisit = document.createElement("li");
            const link = document.createElement("a");

            card.className = known
                ? "placeholder-card journal-card journal-dialogue is-known"
                : "placeholder-card journal-card journal-dialogue";
            heading.textContent = id;
            title.textContent = known && known.title ? known.title : item[1];
            state.textContent = "Etat : " + (known ? "rencontre" : "a rencontrer");
            lastVisit.textContent = "Derniere visite : " +
                formatDate(known && known.lastVisited);
            link.className = "placeholder-return";
            link.setAttribute("href", "../atelier/archives/" + id.toLowerCase() + ".html");
            link.textContent = "Reprendre";
            list.appendChild(state);
            list.appendChild(lastVisit);
            card.appendChild(heading);
            card.appendChild(title);
            card.appendChild(list);
            card.appendChild(link);
            target.appendChild(card);
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
        const cycle = rememberCarnet();
        const books = getBookStats();

        renderResonance();
        renderGuardianWords();
        renderTraces(memory, cycle, books);
        renderFirstSteps(cycle);
        renderPath(memory, cycle);
        renderObjects(cycle);
        renderDialogues(cycle);
        renderEncounters(cycle, books);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
