(function () {
    const KEY = "makerland:living-cycle";

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

    function rememberCurrentPage(memory) {
        const page = document.body.dataset.cyclePage;
        const type = document.body.dataset.cycleType;

        if (!page || !type) {
            return memory;
        }

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
        const target = document.querySelector("[data-cycle-breadcrumb]");
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

        target.innerHTML = [
            "<h2>Trace du voyage</h2>",
            "<p>Vous avez explore :</p>",
            "<ul>",
            "<li>" + atelierCount + " chambres de l'Atelier</li>",
            "<li>" + constellationCount + " fragments de la Constellation</li>",
            "<li>" + objectCount + " objets vivants</li>",
            "</ul>"
        ].join("");
    }

    function renderEcho() {
        const target = document.querySelector("[data-cycle-echo]");
        const type = document.body.dataset.cycleType;

        if (!target) {
            return;
        }

        if (type === "atelier") {
            target.textContent =
                "Certaines creations de cette salle resonnent deja dans la Constellation.";
        }

        if (type === "constellation") {
            target.textContent =
                "Ce recit est ne dans l'Atelier IA.";
        }
    }

    function init() {
        const memory = rememberCurrentPage(readMemory());
        writeMemory(memory);
        renderBreadcrumb();
        renderMemory(memory);
        renderEcho();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
