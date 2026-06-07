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

/****************************************
 STATE
****************************************/

let currentScreen = null;

let historyStack = [];

let idleTimer = null;

let listeners = [];

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
        currentScreen &&
        currentScreen !== screenId
    ) {

        historyStack.push(
            currentScreen
        );

    }

    show(screenId);

    resetIdleTimer();

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
