(function () {
    const SCREEN_ID = "e08_constellation";
    const DEFAULT_STATE = "SKY";
    const NOTICE_DURATION = 6800;

    const state = {
        screen: null,
        active: DEFAULT_STATE,
        layers: {},
        noticeQueue: [],
        noticeTimer: null,
        noticeNode: null,
        cues: {},
        cueOrder: [],
        cueTimer: null,
        activeCue: "",
        activatedAt: 0,
        lastFocus: null
    };

    function screen() {
        if (!state.screen) {
            state.screen = document.getElementById(SCREEN_ID);
        }
        return state.screen;
    }

    function ensureNoticeNode() {
        const host = screen();
        if (!host) return null;
        if (state.noticeNode && state.noticeNode.isConnected) return state.noticeNode;
        const node = document.createElement("aside");
        node.className = "living-overlay-notice";
        node.setAttribute("aria-live", "polite");
        node.setAttribute("data-living-overlay-notice", "");
        host.appendChild(node);
        state.noticeNode = node;
        return node;
    }

    function setState(next) {
        const host = screen();
        state.active = next || DEFAULT_STATE;
        if (host) {
            host.dataset.livingOverlayState = state.active;
        }
        if (state.active !== DEFAULT_STATE) {
            hideActiveCue();
            window.clearTimeout(state.cueTimer);
        } else {
            scheduleCue();
        }
    }

    function register(id, options) {
        if (!id) return;
        state.layers[id] = Object.assign({
            close: null,
            element: null,
            focus: null
        }, options || {});
    }

    function closeLayer(id) {
        const layer = state.layers[id];
        if (!layer || typeof layer.close !== "function") return;
        layer.close();
    }

    function closeOthers(activeId, keep) {
        const preserved = Array.isArray(keep) ? keep : [];
        Object.keys(state.layers).forEach(id => {
            if (id !== activeId && !preserved.includes(id)) {
                closeLayer(id);
            }
        });
    }

    function activate(id, options) {
        const layer = Object.assign({}, state.layers[id] || {}, options || {});
        state.lastFocus = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : state.lastFocus;
        closeOthers(id, options && options.keep);
        if (options) {
            register(id, layer);
        }
        state.activatedAt = Date.now();
        setState(id || DEFAULT_STATE);
        window.clearTimeout(state.noticeTimer);
        window.clearTimeout(state.cueTimer);
        hideNotice();
        focusLayer(layer);
    }

    function focusLayer(layer) {
        const target = layer.focus ||
            (layer.element && layer.element.querySelector("button, a, [tabindex]:not([tabindex='-1'])"));
        if (target && typeof target.focus === "function") {
            window.setTimeout(() => target.focus({ preventScroll: true }), 40);
        }
    }

    function clear(id) {
        if (id && state.active !== id) return;
        setState(DEFAULT_STATE);
        if (state.lastFocus && typeof state.lastFocus.focus === "function") {
            window.setTimeout(() => state.lastFocus.focus({ preventScroll: true }), 40);
        }
    }

    function cue(id, element, options) {
        if (!id || !element) return;
        element.setAttribute("data-living-overlay-cue", id);
        state.cues[id] = Object.assign({
            element,
            duration: 7600
        }, options || {});
        if (!state.cueOrder.includes(id)) {
            state.cueOrder.push(id);
        }
        scheduleCue();
    }

    function scheduleCue() {
        if (state.active !== DEFAULT_STATE || state.cueTimer || !state.cueOrder.length) return;
        state.cueTimer = window.setTimeout(playNextCue, state.activeCue ? 800 : 250);
    }

    function playNextCue() {
        state.cueTimer = null;
        if (state.active !== DEFAULT_STATE || !state.cueOrder.length) return;
        hideActiveCue();
        const next = nextCueId();
        const cueItem = state.cues[next];
        if (!cueItem || !cueItem.element || !cueItem.element.isConnected) {
            delete state.cues[next];
            state.cueOrder = state.cueOrder.filter(id => id !== next);
            scheduleCue();
            return;
        }
        state.activeCue = next;
        cueItem.element.classList.add("is-living-overlay-cued");
        state.cueTimer = window.setTimeout(() => {
            hideActiveCue();
            scheduleCue();
        }, cueItem.duration);
    }

    function nextCueId() {
        if (!state.activeCue) return state.cueOrder[0];
        const current = state.cueOrder.indexOf(state.activeCue);
        return state.cueOrder[(current + 1) % state.cueOrder.length] || state.cueOrder[0];
    }

    function hideActiveCue() {
        Object.keys(state.cues).forEach(id => {
            const cueItem = state.cues[id];
            if (cueItem && cueItem.element) {
                cueItem.element.classList.remove("is-living-overlay-cued");
            }
        });
    }

    function closeActive() {
        if (state.active === DEFAULT_STATE) return;
        closeLayer(state.active);
        clear(state.active);
    }

    function notify(message, options) {
        if (!message) return;
        state.noticeQueue.push(Object.assign({
            message,
            duration: NOTICE_DURATION
        }, options || {}));
        if (!state.noticeTimer) {
            playNextNotice();
        }
    }

    function playNextNotice() {
        const item = state.noticeQueue.shift();
        if (!item) {
            state.noticeTimer = null;
            return;
        }
        const node = ensureNoticeNode();
        if (!node) return;
        closeOthers("NOTICE");
        setState("NOTICE");
        node.textContent = item.message;
        node.classList.add("is-visible");
        state.noticeTimer = window.setTimeout(() => {
            hideNotice();
            setState(DEFAULT_STATE);
            state.noticeTimer = window.setTimeout(playNextNotice, 260);
        }, item.duration);
    }

    function hideNotice() {
        if (state.noticeNode) {
            state.noticeNode.classList.remove("is-visible");
        }
    }

    function init() {
        const host = screen();
        if (!host) return;
        setState(DEFAULT_STATE);
        bindWriting(host);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeActive();
            }
        });
        document.addEventListener("pointerdown", event => {
            if (state.active === DEFAULT_STATE || Date.now() - state.activatedAt < 120) return;
            const layer = state.layers[state.active];
            if (layer && layer.element && layer.element.contains(event.target)) return;
            closeActive();
        });
    }

    function bindWriting(host) {
        const panel = host.querySelector(".constellation-panel");
        const textarea = host.querySelector("#storyInput");
        const button = host.querySelector("#shareStoryButton");
        if (!panel || !textarea || !button) return;

        const openWriting = () => {
            if (state.active === "WRITE") {
                panel.classList.add("is-writing-active");
                return;
            }
            activate("WRITE", {
                close: closeWriting,
                element: panel,
                focus: textarea
            });
            panel.classList.add("is-writing-active");
        };

        const releaseWriting = () => {
            closeWriting();
            clear("WRITE");
        };

        panel.addEventListener("pointerdown", openWriting);
        textarea.addEventListener("focus", openWriting);
        textarea.addEventListener("input", openWriting);
        button.addEventListener("click", () => {
            window.setTimeout(releaseWriting, 140);
        });
    }

    function closeWriting() {
        const host = screen();
        const panel = host ? host.querySelector(".constellation-panel") : null;
        if (panel) {
            panel.classList.remove("is-writing-active");
        }
    }

    window.LivingOverlayManager = {
        init,
        register,
        activate,
        clear,
        closeActive,
        notify,
        cue,
        state: () => state.active
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
