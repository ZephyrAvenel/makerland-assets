(function () {
    const SCREEN_ID = "e08_constellation";
    const MEMORY_KEY = "recitsVivants.constellation.memory";
    const VISIBLE_CLASS = "constellation-scene-visible";
    const SILENT_CLASS = "constellation-scene-silent";
    const INVITING_CLASS = "constellation-scene-inviting";
    const MEETING_CLASS = "constellation-scene-meeting";
    const RELATION_CLASS = "constellation-scene-relation";
    const CARD_READY_CLASS = "constellation-scene-card-ready";
    const CARD_OPEN_CLASS = "constellation-scene-card-open";
    const AWAKENED_CLASS = "constellation-scene-awakened";
    const PRESENCE_CLASS = "constellation-presence-listening";
    const DEEP_PRESENCE_CLASS = "constellation-presence-deep";
    const RETURNING_CLASS = "constellation-memory-returning";
    const STAR_MEMORY_CLASS = "constellation-memory-star";
    const CARD_MEMORY_CLASS = "constellation-memory-card";
    const RELATION_MEMORY_CLASS = "constellation-memory-relations";
    const GUARDIAN_MEMORY_CLASS = "constellation-memory-guardian";

    const WHISPERS = [
        "Ici, les recits se repondent.",
        "Certaines etoiles gardent la memoire des passages.",
        "Une lumiere deja rencontree ne brille jamais tout a fait pareil."
    ];

    const state = {
        screen: null,
        layer: null,
        timers: [],
        presenceTimers: [],
        memory: null,
        visibleSession: false
    };

    function clearTimers() {
        state.timers.forEach(timer => window.clearTimeout(timer));
        state.timers = [];
    }

    function clearPresenceTimers() {
        state.presenceTimers.forEach(timer => window.clearTimeout(timer));
        state.presenceTimers = [];
    }

    function schedule(callback, delay) {
        const timer = window.setTimeout(callback, delay);
        state.timers.push(timer);
    }

    function schedulePresence(callback, delay) {
        const timer = window.setTimeout(callback, delay);
        state.presenceTimers.push(timer);
    }

    function isVisible(element) {
        return Boolean(element && element.offsetParent !== null);
    }

    function readMemory() {
        try {
            const memory = JSON.parse(localStorage.getItem(MEMORY_KEY)) || {};
            return normalizeMemory(memory);
        } catch (error) {
            return normalizeMemory({});
        }
    }

    function writeMemory() {
        try {
            localStorage.setItem(MEMORY_KEY, JSON.stringify(state.memory));
        } catch (error) {
            return;
        }
    }

    function normalizeMemory(memory) {
        return {
            visits: Number(memory.visits || 0),
            stars: Array.isArray(memory.stars) ? memory.stars : [],
            cards: Array.isArray(memory.cards) ? memory.cards : [],
            relations: Array.isArray(memory.relations) ? memory.relations : [],
            lastVisitedAt: memory.lastVisitedAt || "",
            lastWhisperIndex: Number.isInteger(memory.lastWhisperIndex)
                ? memory.lastWhisperIndex
                : -1
        };
    }

    function remember(listName, value) {
        if (!state.memory) return;
        const list = Array.isArray(state.memory[listName]) ? state.memory[listName] : [];
        if (!list.includes(value)) {
            list.push(value);
        }
        state.memory[listName] = list;
        writeMemory();
        applyMemoryClasses();
    }

    function nextWhisperIndex() {
        if (!state.memory) return 0;
        const next = (state.memory.lastWhisperIndex + 1) % WHISPERS.length;
        state.memory.lastWhisperIndex = next;
        writeMemory();
        return next;
    }

    function registerVisit() {
        if (!state.memory || state.visibleSession) return;
        state.visibleSession = true;
        state.memory.visits += 1;
        state.memory.lastVisitedAt = new Date().toISOString();
        writeMemory();
    }

    function endVisitSession() {
        state.visibleSession = false;
        clearTimers();
        clearPresenceTimers();
    }

    function applyMemoryClasses() {
        if (!state.screen || !state.memory) return;
        state.screen.classList.toggle(RETURNING_CLASS, state.memory.visits > 1);
        state.screen.classList.toggle(STAR_MEMORY_CLASS, state.memory.stars.length > 0);
        state.screen.classList.toggle(CARD_MEMORY_CLASS, state.memory.cards.length > 0);
        state.screen.classList.toggle(RELATION_MEMORY_CLASS, state.memory.relations.length > 0);
        state.screen.classList.toggle(GUARDIAN_MEMORY_CLASS, shouldSuggestGuardianPresence());
        state.screen.dataset.constellationVisitTone = String(state.memory.visits % 3);
    }

    function shouldSuggestGuardianPresence() {
        if (!state.memory) return false;
        return state.memory.visits > 2 && state.memory.relations.length > 0 && state.memory.visits % 4 === 0;
    }

    function buildLayer() {
        if (!state.screen || state.screen.querySelector("[data-constellation-scene]")) {
            state.layer = state.screen
                ? state.screen.querySelector("[data-constellation-scene]")
                : null;
            return;
        }

        const layer = document.createElement("aside");
        layer.className = "constellation-scene";
        layer.setAttribute("data-constellation-scene", "");
        layer.setAttribute("aria-label", "Arrivee silencieuse dans la Constellation");
        layer.innerHTML = [
            "<div class=\"constellation-scene__sky-drift\" aria-hidden=\"true\"></div>",
            "<div class=\"constellation-scene__lantern\" aria-hidden=\"true\"></div>",
            "<div class=\"constellation-scene__card-light\" aria-hidden=\"true\"></div>",
            "<div class=\"constellation-scene__presence-light\" aria-hidden=\"true\"></div>",
            "<div class=\"constellation-scene__traveler-presence\" aria-hidden=\"true\"></div>",
            "<p class=\"constellation-scene__whisper\" aria-live=\"polite\">Ici, les recits se repondent.</p>",
            "<button type=\"button\" class=\"constellation-scene__approach\" data-constellation-approach aria-label=\"Approcher une etoile de la Constellation\"></button>",
            "<span class=\"constellation-scene__answer-star\" aria-hidden=\"true\"></span>",
            "<span class=\"constellation-scene__relation-line\" aria-hidden=\"true\"></span>",
            "<p class=\"constellation-scene__first-words\" aria-live=\"polite\">Les recits ne vivent jamais seuls.</p>",
            "<button type=\"button\" class=\"constellation-scene__card-target\" data-constellation-card aria-label=\"Approcher une carte suspendue\"></button>",
            "<article class=\"constellation-scene__card-reveal\" data-constellation-card-reveal aria-live=\"polite\">",
            "<h2>Une parole suspendue</h2>",
            "<p>Chaque relation eclaire une autre histoire.</p>",
            "<button type=\"button\" data-constellation-explore>Explorer...</button>",
            "</article>"
        ].join("");

        state.screen.appendChild(layer);
        state.layer = layer;
        layer.querySelector("[data-constellation-approach]").addEventListener("click", startMeeting);
        layer.querySelector("[data-constellation-card]").addEventListener("click", revealCard);
        layer.querySelector("[data-constellation-explore]").addEventListener("click", awaken);
        layer.addEventListener("pointerdown", markInteraction, true);
        layer.addEventListener("keydown", markInteraction, true);
    }

    function bindWritingAwakening() {
        if (!state.screen || state.screen.dataset.constellationWritingAwakeningBound === "true") {
            return;
        }

        const textarea = state.screen.querySelector("#storyInput");
        if (!textarea) return;

        state.screen.dataset.constellationWritingAwakeningBound = "true";
        textarea.addEventListener("focusin", awaken);
    }

    function resetScene() {
        if (!state.screen) return;
        clearTimers();
        clearPresenceTimers();
        registerVisit();
        applyMemoryClasses();
        const whisper = state.layer ? state.layer.querySelector(".constellation-scene__whisper") : null;
        if (whisper) {
            whisper.textContent = WHISPERS[nextWhisperIndex()];
        }
        state.screen.classList.add(SILENT_CLASS);
        state.screen.classList.remove(
            VISIBLE_CLASS,
            INVITING_CLASS,
            MEETING_CLASS,
            RELATION_CLASS,
            CARD_READY_CLASS,
            CARD_OPEN_CLASS,
            AWAKENED_CLASS,
            PRESENCE_CLASS,
            DEEP_PRESENCE_CLASS
        );

        schedule(() => {
            if (isVisible(state.screen)) {
                state.screen.classList.add(VISIBLE_CLASS);
            }
        }, 700);

        schedule(() => {
            if (isVisible(state.screen)) {
                state.screen.classList.add(INVITING_CLASS);
            }
        }, 7600);

        beginPresenceCycle();
    }

    function beginPresenceCycle() {
        clearPresenceTimers();
        schedulePresence(() => {
            if (canPresenceAppear()) {
                state.screen.classList.add(PRESENCE_CLASS);
            }
        }, 14500);

        schedulePresence(() => {
            if (canPresenceAppear()) {
                state.screen.classList.add(DEEP_PRESENCE_CLASS);
            }
        }, 28500);
    }

    function canPresenceAppear() {
        return Boolean(
            state.screen &&
            isVisible(state.screen) &&
            !state.screen.classList.contains(MEETING_CLASS) &&
            !state.screen.classList.contains(CARD_OPEN_CLASS) &&
            !state.screen.classList.contains(AWAKENED_CLASS)
        );
    }

    function markInteraction() {
        clearPresenceTimers();
        if (state.screen) {
            state.screen.classList.remove(PRESENCE_CLASS, DEEP_PRESENCE_CLASS);
        }
    }

    function startMeeting() {
        if (!state.screen || state.screen.classList.contains(MEETING_CLASS)) {
            return;
        }
        clearTimers();
        clearPresenceTimers();
        state.screen.classList.remove(PRESENCE_CLASS, DEEP_PRESENCE_CLASS);
        activateOverlay("STAR");
        remember("stars", "first-star");
        state.screen.classList.add(MEETING_CLASS);
        state.screen.classList.remove(INVITING_CLASS);

        schedule(() => {
            if (isVisible(state.screen)) {
                remember("stars", "answer-star");
                remember("relations", "first-relation");
                state.screen.classList.add(RELATION_CLASS);
            }
        }, 1400);

        schedule(() => {
            if (isVisible(state.screen)) {
                state.screen.classList.add(CARD_READY_CLASS);
            }
        }, 3300);
    }

    function revealCard() {
        if (!state.screen || !state.screen.classList.contains(CARD_READY_CLASS)) {
            return;
        }
        activateOverlay("CARD", ["STAR"]);
        remember("cards", "suspended-card");
        state.screen.classList.add(CARD_OPEN_CLASS);
    }

    function awaken() {
        if (!state.screen) {
            return;
        }
        if (state.screen.classList.contains(AWAKENED_CLASS)) {
            state.screen.classList.remove(SILENT_CLASS);
            return;
        }
        clearTimers();
        clearPresenceTimers();
        state.screen.classList.add(AWAKENED_CLASS);
        state.screen.classList.remove(SILENT_CLASS, INVITING_CLASS, PRESENCE_CLASS, DEEP_PRESENCE_CLASS);
        clearOverlay("CARD");
    }

    function activateOverlay(id, keep) {
        if (!window.LivingOverlayManager) return;
        window.LivingOverlayManager.activate(id, {
            close: closeSceneInteraction,
            element: state.layer,
            keep
        });
    }

    function clearOverlay(id) {
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.clear(id);
        }
    }

    function closeSceneInteraction() {
        clearTimers();
        clearPresenceTimers();
        if (!state.screen) return;
        state.screen.classList.remove(
            MEETING_CLASS,
            RELATION_CLASS,
            CARD_READY_CLASS,
            CARD_OPEN_CLASS,
            PRESENCE_CLASS,
            DEEP_PRESENCE_CLASS
        );
    }

    function observeVisibility() {
        if (!state.screen) return;

        let wasVisible = isVisible(state.screen);
        if (wasVisible) {
            resetScene();
        }

        const observer = new MutationObserver(() => {
            const visible = isVisible(state.screen);
            if (visible && !wasVisible) {
                resetScene();
            } else if (!visible && wasVisible) {
                endVisitSession();
            }
            wasVisible = visible;
        });

        observer.observe(state.screen, {
            attributes: true,
            attributeFilter: ["class", "style"]
        });
    }

    function init() {
        state.screen = document.getElementById(SCREEN_ID);
        if (!state.screen) return;
        state.memory = readMemory();
        buildLayer();
        bindWritingAwakening();
        applyMemoryClasses();
        observeVisibility();
    }

    window.ConstellationScene = {
        init,
        startMeeting,
        readMemory: () => state.memory || readMemory(),
        awaken
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
