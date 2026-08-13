(function () {
    const STORAGE_PREFIX = "makerland:atelier:object:";
    const OBJECT_RESONANCES = {
        "carnet-dialogue": ["Ce carnet eclaire aussi Transmission", "../../constellation/transmission/"],
        "premiere-question": ["Cette question rejoint Cartographie", "../cartographie/"],
        "conversation-fondatrice": ["Cette conversation resonne avec la Constellation", "../../constellation/"],
        "carte-narrative": ["Cette carte ouvre Chemin", "../../constellation/chemin/"],
        "spirale": ["Cette forme rejoint Fonctionnement", "../../constellation/fonctionnement/"],
        "constellation": ["Cette etoile repond a la Constellation", "../../constellation/"],
        "image-retenue": ["Cette image appelle Clarification", "../clarification/"],
        "prompt-creatif": ["Ce prompt poursuit Dialogue", "../dialogue/"],
        "brouillon": ["Ce brouillon conduit vers Clarification", "../clarification/"],
        "journal-versions": ["Ce journal rejoint Transmission", "../../constellation/transmission/"],
        "jalon-rv": ["Ce jalon ouvre Evolution", "../evolution/"]
    };
    let drawerHistoryOpen = false;

    function getRoomId() {
        const host = document.querySelector("[data-atelier-objects]");
        return host ? host.dataset.atelierObjects : "";
    }

    function getDataPath() {
        const depth = document.body.dataset.depth || "sub";
        return depth === "root" ? "objects.json" : "../objects.json";
    }

    function remember(id) {
        try {
            sessionStorage.setItem(STORAGE_PREFIX + id, "1");
            updateCycleMemory(id);
        } catch (error) {
            return;
        }
    }

    function updateCycleMemory(id) {
        const key = "makerland:living-cycle";
        let memory = {};

        try {
            memory = JSON.parse(localStorage.getItem(key) || "{}");
        } catch (error) {
            memory = {};
        }

        const objects = Array.isArray(memory.atelierObjectIds)
            ? memory.atelierObjectIds
            : [];

        if (!objects.includes(id)) {
            objects.push(id);
        }

        memory.atelierObjectIds = objects;
        memory.atelierObjects = objects.length;

        try {
            localStorage.setItem(key, JSON.stringify(memory));
        } catch (error) {
            return;
        }
    }

    function hasSeen(id) {
        try {
            const memory = JSON.parse(
                localStorage.getItem("makerland:living-cycle") || "{}"
            );
            const objects = Array.isArray(memory.atelierObjectIds)
                ? memory.atelierObjectIds
                : [];
            return (
                sessionStorage.getItem(STORAGE_PREFIX + id) === "1" ||
                objects.includes(id)
            );
        } catch (error) {
            return false;
        }
    }

    function createOverlay() {
        const overlay = document.createElement("div");
        overlay.className = "object-drawer";
        overlay.hidden = true;
        overlay.innerHTML = [
            '<div class="object-drawer__backdrop" data-object-close></div>',
            '<article class="object-drawer__card" role="dialog" aria-modal="true" aria-labelledby="objectDrawerTitle">',
            '<button class="object-drawer__close" type="button" data-object-close>Fermer</button>',
            '<p class="placeholder-meta">Objet vivant</p>',
            '<h2 id="objectDrawerTitle"></h2>',
            '<p class="object-drawer__intro"></p>',
            '<p class="object-drawer__content"></p>',
            '<a class="object-drawer__resonance" hidden></a>',
            '<a class="object-drawer__more" hidden>Explorer davantage</a>',
            '</article>'
        ].join("");

        document.body.appendChild(overlay);
        overlay.addEventListener("click", event => {
            if (event.target.matches("[data-object-close]")) {
                closeOverlay(overlay, true);
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !overlay.hidden) {
                closeOverlay(overlay, true);
            }
        });
        window.addEventListener("popstate", () => {
            if (drawerHistoryOpen && !overlay.hidden) {
                closeOverlay(overlay, false);
            }
        });

        return overlay;
    }

    function openOverlay(overlay, item, trigger) {
        overlay.querySelector("#objectDrawerTitle").textContent = item.title;
        overlay.querySelector(".object-drawer__intro").textContent = item.intro;
        overlay.querySelector(".object-drawer__content").textContent = item.content;

        const resonance = overlay.querySelector(".object-drawer__resonance");
        const relation = OBJECT_RESONANCES[item.id];
        if (relation) {
            resonance.hidden = false;
            resonance.href = relation[1];
            resonance.textContent = relation[0];
        } else {
            resonance.hidden = true;
            resonance.removeAttribute("href");
        }

        const more = overlay.querySelector(".object-drawer__more");
        if (item.moreHref) {
            more.hidden = false;
            more.href = item.moreHref;
            more.textContent = item.moreLabel || "Explorer davantage";
        } else {
            more.hidden = true;
            more.removeAttribute("href");
        }

        overlay.hidden = false;
        overlay.classList.add("is-open");
        if (!drawerHistoryOpen && window.history && window.history.pushState) {
            window.history.pushState({ atelierObjectDrawer: true }, "", window.location.href);
            drawerHistoryOpen = true;
        }
        remember(item.id);
        trigger.classList.add("is-explored");
        trigger.querySelector(".object-node__status").textContent = "Explore";
        overlay.querySelector(".object-drawer__close").focus();
    }

    function closeOverlay(overlay, useHistoryBack) {
        overlay.classList.remove("is-open");
        overlay.hidden = true;
        if (useHistoryBack && drawerHistoryOpen && window.history) {
            drawerHistoryOpen = false;
            window.history.back();
            return;
        }
        drawerHistoryOpen = false;
    }

    function createNode(item, overlay) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "object-node";
        if (hasSeen(item.id)) {
            button.classList.add("is-explored");
        }
        button.innerHTML = [
            '<span class="object-node__spark"></span>',
            '<span class="object-node__label"></span>',
            '<span class="object-node__status"></span>'
        ].join("");
        button.querySelector(".object-node__label").textContent = item.label;
        button.querySelector(".object-node__status").textContent =
            hasSeen(item.id) ? "Explore" : "A explorer";
        button.addEventListener("click", () => openOverlay(overlay, item, button));
        return button;
    }

    function renderObjects(items) {
        const host = document.querySelector("[data-atelier-objects]");
        if (!host || !items.length) {
            return;
        }

        const overlay = createOverlay();
        const grid = document.createElement("div");
        grid.className = "object-field";
        items.forEach(item => grid.appendChild(createNode(item, overlay)));
        host.appendChild(grid);
    }

    function init() {
        const roomId = getRoomId();
        if (!roomId) {
            return;
        }

        fetch(getDataPath())
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                if (!data || !Array.isArray(data[roomId])) {
                    return;
                }
                renderObjects(data[roomId]);
            })
            .catch(() => {});
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
