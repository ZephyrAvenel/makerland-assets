(function () {
    const DATA_PATH = "data/living-guardians.json";
    const STORAGE_KEY = "makerland.guardianWhispers";
    const ENCOUNTERS_KEY = "makerland.guardianEncounters.v1";
    const DEFAULT_SETTINGS = {
        visibleDuration: 8000,
        deployDelay: 400,
        fadeDuration: 300,
        chance: 0.72
    };

    const TERRITORY_META = {
        e02_meteo: {
            label: "Le Seuil des Climats",
            href: "index.html"
        },
        e03_boussole: {
            label: "Boussole Vivante",
            href: "index.html"
        },
        e04_oeuvre: {
            label: "Forêt de l'Arche",
            href: "index.html"
        },
        e05_cartes: {
            label: "Cartes Narratives",
            href: "index.html"
        },
        e06_fiction: {
            label: "Bibliothèque Vivante",
            href: "index.html"
        },
        e06_essais: {
            label: "Bibliothèque Vivante",
            href: "index.html"
        },
        e07_atelier: {
            label: "Atelier des Récits",
            href: "atelier/"
        },
        archives: {
            label: "Archives Vivantes",
            href: "atelier/archives/"
        },
        e08_constellation: {
            label: "Constellation",
            href: "constellation/"
        }
    };

    let data = null;
    let root = null;
    let visibleTimer = null;
    let deployTimer = null;
    let dismissTimer = null;
    let dismissalBound = false;

    function dataPath() {
        const depth = document.body ? document.body.dataset.depth : "";
        const archiveDepth = document.body ? document.body.dataset.archiveDepth : "";

        if (archiveDepth === "detail" || depth === "archives") {
            return "../../" + DATA_PATH;
        }

        if (depth === "sub") {
            return "../../" + DATA_PATH;
        }

        if (depth === "root" || document.body.dataset.cycleType === "constellation") {
            return "../" + DATA_PATH;
        }

        return DATA_PATH;
    }

    function loadData() {
        if (data) {
            return Promise.resolve(data);
        }

        return fetch(dataPath())
            .then(response => {
                if (!response.ok) {
                    throw new Error("Gardiens introuvables");
                }

                return response.json();
            })
            .then(payload => {
                data = payload;
                return data;
            })
            .catch(() => null);
    }

    function ensureRoot() {
        if (root) {
            return root;
        }

        root = document.createElement("aside");
        root.className = "guardian-whisper";
        root.setAttribute("aria-live", "polite");
        root.setAttribute("aria-hidden", "true");
        document.body.appendChild(root);
        return root;
    }

    function resolveTerritory(screenId) {
        if (screenId) {
            return screenId;
        }

        if (document.body.dataset.archiveDepth || document.body.dataset.cyclePage === "archives") {
            return "archives";
        }

        if (document.body.dataset.cyclePage === "atelier") {
            return "e07_atelier";
        }

        if (document.body.dataset.cycleType === "atelier") {
            return "e07_atelier";
        }

        if (document.body.dataset.cycleType === "constellation") {
            return "e08_constellation";
        }

        return "";
    }

    function shouldSkip(screenId) {
        if (document.body.classList.contains("first-journey-active")) {
            return true;
        }

        if (screenId === "e01_accueil") {
            return true;
        }

        return false;
    }

    function canShowForScreen(screenId) {
        const territoryId = resolveTerritory(screenId);

        return [
            "e02_meteo",
            "e03_boussole",
            "e04_oeuvre",
            "e05_cartes",
            "e06_fiction",
            "e06_essais",
            "e07_atelier",
            "e08_constellation",
            "archives"
        ].includes(territoryId);
    }

    function readMemory() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeMemory(memory) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        } catch (error) {
            return;
        }
    }

    function readEncounters() {
        try {
            const saved = JSON.parse(localStorage.getItem(ENCOUNTERS_KEY)) || {};
            return {
                version: 1,
                encounters: Array.isArray(saved.encounters) ? saved.encounters : []
            };
        } catch (error) {
            return {
                version: 1,
                encounters: []
            };
        }
    }

    function writeEncounters(payload) {
        try {
            localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(payload));
        } catch (error) {
            return;
        }
    }

    function rememberEncounter(guardianId, guardian, message, territoryId) {
        const payload = readEncounters();
        const key = guardianId + "::" + message;

        if (payload.encounters.some(encounter => encounter.key === key)) {
            return;
        }

        const meta = TERRITORY_META[territoryId] || {};
        payload.encounters.push({
            key,
            guardianId,
            guardianName: guardian.name,
            illustration: guardian.sigil || "✦",
            variant: guardian.variant || "",
            territoryId,
            territoryLabel: meta.label || territoryId,
            territoryHref: meta.href || "index.html",
            whisper: message,
            firstEncounteredAt: new Date().toISOString()
        });

        writeEncounters(payload);
    }

    function pickGuardian(config, payload, memory) {
        const ids = [config.primary].concat(config.compatible || []).filter(Boolean);
        const available = ids.filter(id => payload.guardians && payload.guardians[id]);

        if (!available.length) {
            return null;
        }

        if (Math.random() < 0.62 && payload.guardians[config.primary]) {
            return config.primary;
        }

        const last = memory.lastGuardian || "";
        const candidates = available.filter(id => id !== last);
        const pool = candidates.length ? candidates : available;

        return pool[Math.floor(Math.random() * pool.length)];
    }

    function pickMessage(guardian, memory) {
        const messages = guardian.messages || [];
        if (!messages.length) {
            return "";
        }

        const last = memory.lastMessage || "";
        const candidates = messages.filter(message => message !== last);
        const pool = candidates.length ? candidates : messages;

        return pool[Math.floor(Math.random() * pool.length)];
    }

    function render(guardian, message, position) {
        const host = ensureRoot();
        host.className = [
            "guardian-whisper",
            "guardian-whisper--" + (position || "right"),
            "guardian-whisper--" + guardian.variant
        ].join(" ");

        host.innerHTML = [
            "<div class=\"guardian-whisper__figure\" aria-hidden=\"true\">",
            `<span>${escapeHtml(guardian.sigil || "✦")}</span>`,
            "</div>",
            "<div class=\"guardian-whisper__bubble\">",
            `<strong>${escapeHtml(guardian.name)}</strong>`,
            `<p>${escapeHtml(message)}</p>`,
            "<span class=\"guardian-whisper__dust\" aria-hidden=\"true\"></span>",
            "</div>"
        ].join("");

        host.setAttribute("aria-hidden", "false");
        host.classList.add("is-guardian-visible");

        window.clearTimeout(deployTimer);
        deployTimer = window.setTimeout(() => {
            host.classList.add("is-bubble-visible");
        }, settings().deployDelay);

        window.clearTimeout(visibleTimer);
        visibleTimer = window.setTimeout(dismiss, settings().visibleDuration);
    }

    function settings() {
        return Object.assign({}, DEFAULT_SETTINGS, data && data.settings ? data.settings : {});
    }

    function showForScreen(screenId, options) {
        if (shouldSkip(screenId)) {
            return false;
        }

        const territoryId = resolveTerritory(screenId);

        return loadData().then(payload => {
            if (!payload || !payload.territories || !payload.guardians) {
                return false;
            }

            const territory = payload.territories[territoryId];
            if (!territory) {
                return false;
            }

            const memory = readMemory();
            const forced = options && options.force;
            if (!forced && Math.random() > settings().chance) {
                return false;
            }

            const guardianId = pickGuardian(territory, payload, memory);
            const guardian = payload.guardians[guardianId];
            if (!guardian) {
                return false;
            }

            const message = pickMessage(guardian, memory);
            if (!message) {
                return false;
            }

            memory.lastGuardian = guardianId;
            memory.lastMessage = message;
            memory.lastTerritory = territoryId;
            memory.lastSeenAt = new Date().toISOString();
            writeMemory(memory);
            rememberEncounter(guardianId, guardian, message, territoryId);

            dismiss(true);
            render(guardian, message, territory.position);
            return true;
        });
    }

    function dismiss(immediate) {
        window.clearTimeout(visibleTimer);
        window.clearTimeout(deployTimer);
        window.clearTimeout(dismissTimer);

        if (!root) {
            return;
        }

        if (immediate) {
            root.remove();
            root = null;
            return;
        }

        root.classList.add("is-dismissing");
        root.classList.remove("is-bubble-visible");
        root.setAttribute("aria-hidden", "true");

        dismissTimer = window.setTimeout(() => {
            if (!root) {
                return;
            }

            root.remove();
            root = null;
        }, settings().fadeDuration);
    }

    function dismissOnInteraction() {
        if (!root || !root.classList.contains("is-guardian-visible")) {
            return;
        }

        dismiss(false);
    }

    function bindDismissal() {
        if (dismissalBound) {
            return;
        }

        dismissalBound = true;
        document.addEventListener("pointerdown", dismissOnInteraction, { capture: true, passive: true });
        document.addEventListener("touchstart", dismissOnInteraction, { capture: true, passive: true });
        document.addEventListener("wheel", dismissOnInteraction, { capture: true, passive: true });
        window.addEventListener("scroll", dismissOnInteraction, { capture: true, passive: true });
        window.addEventListener("beforeunload", () => dismiss(true));
        document.addEventListener("keydown", dismissOnInteraction, true);
    }

    function initStandalone() {
        const territory = resolveTerritory("");
        if (territory) {
            window.setTimeout(() => {
                showForScreen(territory);
            }, 700);
        }
    }

    function init() {
        bindDismissal();

        window.addEventListener("screenChanged", event => {
            if (!event.detail || !event.detail.screen) {
                return;
            }

            showForScreen(event.detail.screen);
        });

        initStandalone();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    window.LivingGuardianWhisper = {
        showForScreen,
        dismiss,
        resolveTerritory,
        canShowForScreen
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
