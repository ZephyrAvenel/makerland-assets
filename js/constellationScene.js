(function () {
    const SCREEN_ID = "e08_constellation";
    const VISIBLE_CLASS = "constellation-scene-visible";
    const SILENT_CLASS = "constellation-scene-silent";
    const INVITING_CLASS = "constellation-scene-inviting";
    const MEETING_CLASS = "constellation-scene-meeting";
    const RELATION_CLASS = "constellation-scene-relation";
    const CARD_READY_CLASS = "constellation-scene-card-ready";
    const CARD_OPEN_CLASS = "constellation-scene-card-open";
    const AWAKENED_CLASS = "constellation-scene-awakened";

    const state = {
        screen: null,
        layer: null,
        timers: []
    };

    function clearTimers() {
        state.timers.forEach(timer => window.clearTimeout(timer));
        state.timers = [];
    }

    function schedule(callback, delay) {
        const timer = window.setTimeout(callback, delay);
        state.timers.push(timer);
    }

    function isVisible(element) {
        return Boolean(element && element.offsetParent !== null);
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
    }

    function resetScene() {
        if (!state.screen) return;
        clearTimers();
        state.screen.classList.add(SILENT_CLASS);
        state.screen.classList.remove(
            VISIBLE_CLASS,
            INVITING_CLASS,
            MEETING_CLASS,
            RELATION_CLASS,
            CARD_READY_CLASS,
            CARD_OPEN_CLASS,
            AWAKENED_CLASS
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
    }

    function startMeeting() {
        if (!state.screen || state.screen.classList.contains(MEETING_CLASS)) {
            return;
        }
        clearTimers();
        state.screen.classList.add(MEETING_CLASS);
        state.screen.classList.remove(INVITING_CLASS);

        schedule(() => {
            if (isVisible(state.screen)) {
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
        state.screen.classList.add(CARD_OPEN_CLASS);
    }

    function awaken() {
        if (!state.screen || state.screen.classList.contains(AWAKENED_CLASS)) {
            return;
        }
        clearTimers();
        state.screen.classList.add(AWAKENED_CLASS);
        state.screen.classList.remove(INVITING_CLASS);
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
        buildLayer();
        observeVisibility();
    }

    window.ConstellationScene = {
        init,
        startMeeting,
        awaken
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
