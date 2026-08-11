/****************************************************
MAKERLAND V3.0-C
navigation.js
****************************************************/

const Navigation = (() => {

/****************************************
 CONFIG
****************************************/

const HOME_SCREEN = "e01_accueil";

const IDLE_TIMEOUT = 180000;

const ENTRY_RITE_FROM = "e01_accueil";

const ENTRY_RITE_TO = "e02_meteo";

const ENTRY_RITE_SWITCH_DELAY = 900;

const ENTRY_RITE_TOTAL_DURATION = 2100;

/****************************************
 STATE
****************************************/

let currentScreen = null;

let historyStack = [];

let idleTimer = null;

let listeners = [];

let entryRiteRunning = false;

/****************************************
 INIT
****************************************/

function init() {

    console.log(
        "Navigation initialisée"
    );

    hideAll();

    goTo(HOME_SCREEN);

    startIdleTimer();

    bindGlobalEvents();

}

/****************************************
 SCREEN MANAGEMENT
****************************************/

function hideAll() {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.style.display =
                "none";

        });

}

function show(screenId) {

    const screen =
        document.getElementById(
            screenId
        );

    if (!screen) {

        console.warn(
            "Écran introuvable :",
            screenId
        );

        return;

    }

    hideAll();

    screen.style.display =
        "block";

    currentScreen =
        screenId;

    emitChange();

}

/****************************************
 NAVIGATION
****************************************/

function goTo(screenId) {

    if (
        shouldPlayEntryRite(
            screenId
        )
    ) {

        startEntryRite(
            screenId
        );

        return;

    }

    navigateTo(
        screenId,
        true
    );

}

function navigateTo(
    screenId,
    pushHistory
) {

    if (
        pushHistory &&
        currentScreen &&
        currentScreen !== screenId
       ) {

        historyStack.push(
        currentScreen
        );

    }

    show(
        screenId
    );

    if (
        typeof UIRenderer !== "undefined"
) {
    UIRenderer.render(screenId);
}

resetIdleTimer();

}

/****************************************
 ENTRY RITE
****************************************/

function shouldPlayEntryRite(screenId) {

    if (
        entryRiteRunning ||
        currentScreen !== ENTRY_RITE_FROM ||
        screenId !== ENTRY_RITE_TO
    ) {

        return false;

    }

    return !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}

function startEntryRite(screenId) {

    entryRiteRunning =
        true;

    historyStack.push(
        currentScreen
    );

    const current =
        document.getElementById(
            currentScreen
        );

    document.body.classList.add(
        "entry-rite-running"
    );

    if (current) {

        current.classList.add(
            "entry-rite-departing"
        );

    }

    window.setTimeout(
        () => {

            document.body.classList.add(
                "entry-rite-voice-visible"
            );

        },
        220
    );

    window.setTimeout(
        () => {

            document.body.classList.remove(
                "entry-rite-voice-visible"
            );

            show(
                screenId
            );

            if (
                typeof UIRenderer !== "undefined"
            ) {

                UIRenderer.render(
                    screenId
                );

            }

            const target =
                document.getElementById(
                    screenId
                );

            if (target) {

                target.classList.add(
                    "entry-rite-arriving"
                );

            }

        },
        ENTRY_RITE_SWITCH_DELAY
    );

    window.setTimeout(
        () => {

            cleanupEntryRite(
                current,
                screenId
            );

        },
        ENTRY_RITE_TOTAL_DURATION
    );

    resetIdleTimer();

}

function cleanupEntryRite(
    previous,
    screenId
) {

    document.body.classList.remove(
        "entry-rite-running",
        "entry-rite-voice-visible"
    );

    if (previous) {

        previous.classList.remove(
            "entry-rite-departing"
        );

    }

    const target =
        document.getElementById(
            screenId
        );

    if (target) {

        target.classList.remove(
            "entry-rite-arriving"
        );

    }

    entryRiteRunning =
        false;

}

function back() {

    if (
        historyStack.length === 0
    ) {

        goTo(HOME_SCREEN);

        return;

    }

    const previous =
        historyStack.pop();

    show(previous);

    resetIdleTimer();

}

function reset() {

    historyStack = [];

    goTo(HOME_SCREEN);

}

/****************************************
 EXTERNAL LINKS
****************************************/

function openExternal(url) {

    if (!url) return;

    window.open(
        url,
        "_blank"
    );

    resetIdleTimer();

}

/****************************************
 GETTERS
****************************************/

function getCurrent() {

    return currentScreen;

}

function getHistory() {

    return [
        ...historyStack
    ];

}

/****************************************
 EVENTS
****************************************/

function emitChange() {

    window.dispatchEvent(

        new CustomEvent(
            "screenChanged",
            {
                detail: {
                    screen:
                        currentScreen
                }
            }
        )

    );

    listeners.forEach(
        callback => {

            callback(
                currentScreen
            );

        }
    );

}

function onChange(
    callback
) {

    listeners.push(
        callback
    );

}

/****************************************
 IDLE MODE
****************************************/

function startIdleTimer() {

    clearTimeout(
        idleTimer
    );

    idleTimer = setTimeout(
        () => {

            console.log(
                "Retour accueil"
            );

            reset();

        },
        IDLE_TIMEOUT
    );

}

function resetIdleTimer() {

    startIdleTimer();

}

/****************************************
 USER ACTIVITY
****************************************/

function bindGlobalEvents() {

    [

        "click",
        "touchstart",
        "mousemove",
        "keydown"

    ].forEach(eventName => {

        document.addEventListener(

            eventName,

            () => {

                resetIdleTimer();

            }

        );

    });

}

/****************************************
 PUBLIC API
****************************************/

return {

    init,

    goTo,

    back,

    show,

    hideAll,

    reset,

    openExternal,

    getCurrent,

    getHistory,

    onChange

};

})();
