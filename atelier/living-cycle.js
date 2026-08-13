(function () {
    const KEY = "makerland:living-cycle";
    const RETURN_ECHOES = [
        "Ce lieu vous reconnait.",
        "Certaines idees murissent en silence.",
        "Vous poursuivez un recit commence plus tot.",
        "Les chemins changent avec ceux qui les parcourent."
    ];
    const PLACE_LABELS = {
        "atelier:atelier": "Atelier",
        "atelier:dialogue": "Dialogue",
        "atelier:cartographie": "Cartographie",
        "atelier:images": "Images",
        "atelier:clarification": "Clarification",
        "atelier:evolution": "Evolution",
        "constellation:constellation": "Constellation",
        "constellation:chemin": "Chemin",
        "constellation:fonctionnement": "Fonctionnement",
        "constellation:transmission": "Transmission",
        "constellation:temoignages": "Temoignages",
        "constellation:carnet": "Carnet de la Constellation"
    };
    const MILESTONES = {
        "atelier:atelier": "Premiere visite de l'Atelier",
        "atelier:dialogue": "Dialogue explore",
        "constellation:constellation": "Constellation decouverte",
        "constellation:transmission": "Transmission visitee",
        "constellation:carnet": "Carnet ouvert"
    };
    const LINK_TARGETS = {
        "atelier:dialogue": "dialogue/",
        "atelier:cartographie": "cartographie/",
        "atelier:images": "images/",
        "atelier:clarification": "clarification/",
        "atelier:evolution": "evolution/",
        "constellation:chemin": "chemin/",
        "constellation:fonctionnement": "fonctionnement/",
        "constellation:transmission": "transmission/",
        "constellation:temoignages": "temoignages/"
    };

    function readMemory() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeMemory(memory) {
        try {
            localStorage.setItem(KEY, JSON.stringify(memory));
        } catch (error) {
            return;
        }
    }

    function addUnique(list, value) {
        const values = Array.isArray(list) ? list : [];
        return values.includes(value) ? values : values.concat(value);
    }

    function rememberPlace(memory, id) {
        const places = Array.isArray(memory.visitedPlaces)
            ? memory.visitedPlaces
            : [];
        const alreadyVisited = places.some(place => place.id === id);

        if (!alreadyVisited) {
            places.push({
                id,
                label: PLACE_LABELS[id] || id,
                firstSeen: new Date().toISOString()
            });
        }

        memory.visitedPlaces = places;
        memory.visitedPlaceIds = addUnique(memory.visitedPlaceIds, id);
        memory.lastVisitedPlace = id;
        memory.currentPlaceWasKnown = alreadyVisited;

        if (MILESTONES[id]) {
            memory.milestones = addUnique(memory.milestones, MILESTONES[id]);
        }

        return memory;
    }

    function rememberCurrentPage(memory) {
        const page = document.body.dataset.cyclePage;
        const type = document.body.dataset.cycleType;

        if (!page || !type) {
            return memory;
        }

        const placeId = type + ":" + page;
        rememberPlace(memory, placeId);

        if (type === "atelier") {
            memory.atelierRooms = addUnique(memory.atelierRooms, page);
        }

        if (type === "constellation") {
            memory.constellationFragments = addUnique(
                memory.constellationFragments,
                page
            );
        }

        return memory;
    }

    function renderBreadcrumb() {
        const target =
            document.querySelector(".living-breadcrumb[data-cycle-breadcrumb]") ||
            document.querySelector("main [data-cycle-breadcrumb]");
        const path = document.body.dataset.cycleBreadcrumb;

        if (!target || !path) {
            return;
        }

        target.textContent = path;
    }

    function renderMemory(memory) {
        const target = document.querySelector("[data-cycle-memory]");

        if (!target) {
            return;
        }

        const atelierCount = (memory.atelierRooms || []).length;
        const constellationCount =
            (memory.constellationFragments || []).length;
        const objectCount = Number(memory.atelierObjects || 0);
        const milestoneCount = (memory.milestones || []).length;

        target.innerHTML = [
            "<h2>Trace du voyage</h2>",
            "<p>Vous avez explore :</p>",
            "<ul>",
            "<li>" + atelierCount + " chambres de l'Atelier</li>",
            "<li>" + constellationCount + " fragments de la Constellation</li>",
            "<li>" + objectCount + " objets vivants</li>",
            "<li>" + milestoneCount + " premiers souvenirs</li>",
            "</ul>"
        ].join("");
    }

    function renderEcho(memory) {
        const target = document.querySelector("[data-cycle-echo]");
        const type = document.body.dataset.cycleType;

        if (!target) {
            return;
        }

        if (memory.currentPlaceWasKnown && Math.random() < 0.34) {
            target.textContent =
                RETURN_ECHOES[Math.floor(Math.random() * RETURN_ECHOES.length)];
            target.classList.add("is-living-return");
            return;
        }

        if (type === "atelier") {
            target.textContent =
                "Certaines creations de cette salle resonnent deja dans la Constellation.";
        }

        if (type === "constellation") {
            target.textContent =
                "Ce recit est ne dans l'Atelier des Recits.";
        }
    }

    function renderVisitedMarkers(memory) {
        const visited = new Set(memory.visitedPlaceIds || []);

        document.querySelectorAll("a[href]").forEach(link => {
            const href = link.getAttribute("href") || "";
            const match = Object.keys(LINK_TARGETS).find(id =>
                visited.has(id) && href.indexOf(LINK_TARGETS[id]) !== -1
            );

            if (!match || link.querySelector(".visited-place-mark")) {
                return;
            }

            link.classList.add("is-visited-place");
            const mark = document.createElement("span");
            mark.className = "visited-place-mark";
            mark.textContent = "Deja parcouru";
            link.appendChild(mark);
        });
    }

    function init() {
        const memory = rememberCurrentPage(readMemory());
        writeMemory(memory);
        renderBreadcrumb();
        renderMemory(memory);
        renderEcho(memory);
        renderVisitedMarkers(memory);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
