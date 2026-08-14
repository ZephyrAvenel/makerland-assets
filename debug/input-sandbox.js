(function () {
    const EVENTS = [
        "touchstart",
        "pointerdown",
        "mousedown",
        "focus",
        "focusin",
        "click",
        "input",
        "blur"
    ];

    const textarea = document.getElementById("storyInput");
    const testButton = document.getElementById("testInputButton");
    const clearButton = document.getElementById("clearLogButton");
    const logNode = document.getElementById("eventLog");
    const currentStage = new URLSearchParams(window.location.search).get("stage") || "0";

    function describe(node) {
        if (!node) return "null";
        if (node === window) return "window";
        if (node === document) return "document";
        if (node.nodeType === Node.TEXT_NODE) return "#text";
        const id = node.id ? `#${node.id}` : "";
        const classes = node.classList && node.classList.length
            ? `.${Array.from(node.classList).join(".")}`
            : "";
        return `${node.tagName || node.nodeName}${id}${classes}`;
    }

    function eventPoint(event) {
        const touch = event.touches && event.touches[0]
            ? event.touches[0]
            : event.changedTouches && event.changedTouches[0]
                ? event.changedTouches[0]
                : event;
        if (typeof touch.clientX !== "number" || typeof touch.clientY !== "number") {
            return null;
        }
        return {
            x: Math.round(touch.clientX),
            y: Math.round(touch.clientY)
        };
    }

    function writeLog(message) {
        const time = new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        logNode.textContent = `[${time}] ${message}\n${logNode.textContent}`;
    }

    function logEvent(event) {
        const point = eventPoint(event);
        const hit = point ? document.elementFromPoint(point.x, point.y) : null;
        const value = textarea ? textarea.value.length : 0;
        writeLog([
            event.type,
            `target=${describe(event.target)}`,
            `active=${describe(document.activeElement)}`,
            point ? `point=${point.x},${point.y}` : "point=null",
            `hit=${describe(hit)}`,
            `chars=${value}`
        ].join(" | "));
    }

    function setStage(stage) {
        const url = new URL(window.location.href);
        if (stage === "0") {
            url.searchParams.delete("stage");
        } else {
            url.searchParams.set("stage", stage);
        }
        window.location.href = url.toString();
    }

    EVENTS.forEach(type => {
        document.addEventListener(type, logEvent, true);
    });

    if (testButton) {
        testButton.addEventListener("click", () => {
            writeLog(`Test bouton | valeur="${textarea.value}" | active=${describe(document.activeElement)}`);
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            logNode.textContent = "";
        });
    }

    document.querySelectorAll("[data-stage]").forEach(button => {
        if (button.getAttribute("data-stage") === currentStage) {
            button.disabled = true;
        }
        button.addEventListener("click", () => {
            setStage(button.getAttribute("data-stage") || "0");
        });
    });

    writeLog(`Sandbox initialisee : etape ${currentStage}.`);
})();
