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

const ENTRY_RITE_WELCOME_DELAY = 360;

const WHISPER_FADE_IN_DURATION = 1000;

const WHISPER_MIN_READING_DURATION = 4000;

const WHISPER_READING_DURATION_PER_WORD = 90;

const WHISPER_MAX_READING_DURATION = 8000;

const WHISPER_FADE_OUT_DURATION = 800;

const ENTRY_RITE_SCREEN_REVEAL_BUFFER = 100;

const ENTRY_RITE_CLEANUP_DURATION = 1150;

const ENTRY_RITE_AUDIO_HOOKS = {

    wind: "entry-rite:wind",

    birds: "entry-rite:birds",

    pages: "entry-rite:pages",

    distantBell: "entry-rite:distant-bell"

};

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

    const timing =
        getEntryRiteTiming();

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

    dispatchEntryRiteCue(
        "threshold"
    );

    if (current) {

        current.classList.add(
            "entry-rite-departing"
        );

    }

    window.setTimeout(
        () => {

            document.body.classList.add(
                "entry-rite-welcome-visible"
            );

            dispatchEntryRiteCue(
                "welcome"
            );

        },
        ENTRY_RITE_WELCOME_DELAY
    );

    window.setTimeout(
        () => {

            document.body.classList.remove(
                "entry-rite-welcome-visible"
            );

        },
        timing.hideWelcomeAt
    );

    window.setTimeout(
        () => {

            show(
                screenId
            );

            dispatchEntryRiteCue(
                "meteo"
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
        timing.showNextScreenAt
    );

    window.setTimeout(
        () => {

            cleanupEntryRite(
                current,
                screenId
            );

        },
        timing.cleanupAt
    );

    resetIdleTimer();

}

function getEntryRiteTiming() {

    const whisper =
        document.getElementById(
            "entryRiteWelcome"
        );

    const readingDuration =
        getWhisperReadingDuration(
            getWhisperText(
                whisper
            )
        );

    const hideWelcomeAt =
        ENTRY_RITE_WELCOME_DELAY +
        WHISPER_FADE_IN_DURATION +
        readingDuration;

    const showNextScreenAt =
        hideWelcomeAt +
        WHISPER_FADE_OUT_DURATION +
        ENTRY_RITE_SCREEN_REVEAL_BUFFER;

    return {

        readingDuration,

        hideWelcomeAt,

        showNextScreenAt,

        cleanupAt:
            showNextScreenAt +
            ENTRY_RITE_CLEANUP_DURATION

    };

}

function getWhisperText(element) {

    if (!element) return "";

    return element
        .textContent
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}

function getWhisperReadingDuration(text) {

    const wordCount =
        countWords(
            text
        );

    const calculatedDuration =
        wordCount *
        WHISPER_READING_DURATION_PER_WORD;

    return clamp(
        calculatedDuration,
        WHISPER_MIN_READING_DURATION,
        WHISPER_MAX_READING_DURATION
    );

}

function countWords(text) {

    if (!text) return 0;

    return text
        .split(
            /\s+/
        )
        .filter(Boolean)
        .length;

}

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(
            value,
            min
        ),
        max
    );

}

function dispatchEntryRiteCue(cue) {

    window.dispatchEvent(
        new CustomEvent(
            "entryRiteCue",
            {
                detail: {
                    cue,
                    audioHooks:
                        ENTRY_RITE_AUDIO_HOOKS
                }
            }
        )
    );

}

function cleanupEntryRite(
    previous,
    screenId
) {

    document.body.classList.remove(
        "entry-rite-running",
        "entry-rite-welcome-visible"
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

    getWhisperReadingDuration,

    getCurrent,

    getHistory,

    onChange

};

})();
