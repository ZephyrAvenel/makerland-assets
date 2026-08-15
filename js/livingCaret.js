(function () {
    const SCREEN_ID = "e08_constellation";
    const TEXTAREA_ID = "storyInput";
    const CARET_CLASS = "rv-living-caret";
    const MIRROR_CLASS = "rv-living-caret-mirror";

    let panel = null;
    let textarea = null;
    let caret = null;
    let mirror = null;
    let frame = 0;

    function init() {
        const screen = document.getElementById(SCREEN_ID);
        if (!screen) return;

        panel = screen.querySelector(".constellation-panel");
        textarea = screen.querySelector("#" + TEXTAREA_ID);
        if (!panel || !textarea) return;

        caret = panel.querySelector("." + CARET_CLASS);
        if (!caret) {
            caret = document.createElement("span");
            caret.className = CARET_CLASS;
            caret.setAttribute("aria-hidden", "true");
            panel.appendChild(caret);
        }

        mirror = document.createElement("div");
        mirror.className = MIRROR_CLASS;
        mirror.setAttribute("aria-hidden", "true");
        document.body.appendChild(mirror);

        [
            "input",
            "keyup",
            "click",
            "mouseup",
            "touchend",
            "pointerup",
            "focus",
            "blur",
            "select",
            "scroll",
            "compositionupdate"
        ].forEach(type => textarea.addEventListener(type, scheduleUpdate, { passive: true }));

        window.addEventListener("resize", scheduleUpdate, { passive: true });
        document.addEventListener("selectionchange", () => {
            if (document.activeElement === textarea) {
                scheduleUpdate();
            }
        });

        scheduleUpdate();
    }

    function scheduleUpdate() {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
            frame = 0;
            updateCaret();
        });
    }

    function updateCaret() {
        if (!panel || !textarea || !caret || !mirror) return;
        if (!textarea.isConnected || !caret.isConnected) return;

        const style = window.getComputedStyle(textarea);
        const rect = textarea.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const text = textarea.value || "";
        const index = clampSelection(textarea.selectionStart, text.length);

        copyTextMetrics(style);
        mirror.style.width = rect.width + "px";
        mirror.style.height = "auto";
        mirror.style.padding = style.padding;
        mirror.style.border = style.border;
        mirror.style.whiteSpace = "pre-wrap";
        mirror.style.overflowWrap = "break-word";
        mirror.style.wordBreak = style.wordBreak;

        mirror.textContent = text.slice(0, index);
        const marker = document.createElement("span");
        marker.textContent = text.slice(index, index + 1) || "\u200b";
        mirror.appendChild(marker);

        const markerRect = marker.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();
        const lineHeight = parseLineHeight(style);
        const x = rect.left - panelRect.left + markerRect.left - mirrorRect.left - textarea.scrollLeft;
        const y = rect.top - panelRect.top + markerRect.top - mirrorRect.top - textarea.scrollTop;

        caret.style.setProperty("--rv-caret-x", Math.round(x) + "px");
        caret.style.setProperty("--rv-caret-y", Math.round(y) + "px");
        caret.style.height = Math.max(22, Math.round(lineHeight * 1.05)) + "px";
        caret.classList.toggle("is-hidden", textarea.disabled || textarea.readOnly);
    }

    function clampSelection(value, length) {
        const position = Number.isFinite(value) ? value : 0;
        return Math.max(0, Math.min(position, length));
    }

    function parseLineHeight(style) {
        const numeric = parseFloat(style.lineHeight);
        if (Number.isFinite(numeric)) return numeric;
        const fontSize = parseFloat(style.fontSize);
        return Number.isFinite(fontSize) ? fontSize * 1.45 : 24;
    }

    function copyTextMetrics(style) {
        mirror.style.position = "fixed";
        mirror.style.left = "-9999px";
        mirror.style.top = "0";
        mirror.style.visibility = "hidden";
        mirror.style.boxSizing = style.boxSizing;
        mirror.style.font = style.font;
        mirror.style.fontFamily = style.fontFamily;
        mirror.style.fontSize = style.fontSize;
        mirror.style.fontStyle = style.fontStyle;
        mirror.style.fontWeight = style.fontWeight;
        mirror.style.letterSpacing = style.letterSpacing;
        mirror.style.lineHeight = style.lineHeight;
        mirror.style.textTransform = style.textTransform;
        mirror.style.textAlign = style.textAlign;
        mirror.style.tabSize = style.tabSize;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
