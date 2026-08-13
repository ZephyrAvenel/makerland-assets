/****************************************************
MAKERLAND
livingJourney.js
****************************************************/

const LivingJourney = (() => {

const STORAGE_KEY =
    "makerland_living_journey";

const ARRIVAL_CLASS =
    "journey-arriving";

const RETURN_CLASS =
    "journey-returning";

const MESSAGE_VISIBLE_CLASS =
    "journey-notice-visible";

const MESSAGE_DURATION =
    3600;

const CLEANUP_DELAY =
    720;

const PLACES = {

    e01_accueil: {
        id: "seuil",
        name: "Le Seuil",
        signature: "naissance"
    },

    e02_meteo: {
        id: "meteo",
        name: "Meteo interieure",
        signature: "contemplation"
    },

    e03_boussole: {
        id: "boussole",
        name: "Boussole Vivante",
        signature: "respiration"
    },

    e04_oeuvre: {
        id: "oeuvre",
        name: "Foret de l'Arche",
        signature: "passage"
    },

    e05_cartes: {
        id: "cartes",
        name: "Cartes Narratives",
        signature: "invitation"
    },

    e07_atelier: {
        id: "atelier",
        name: "Atelier IA",
        signature: "creation"
    },

    e08_constellation: {
        id: "constellation",
        name: "Constellation",
        signature: "rencontre"
    },

    e09_voyage: {
        id: "voyage",
        name: "Voyage",
        signature: "continuation"
    }

};

const LIBRARY_PLACE = {
    id: "bibliotheque",
    name: "Bibliotheque Vivante",
    signature: "silence"
};

const HINTS = [
    "Vous pouvez revenir ici plus tard.",
    "Tous les chemins restent ouverts.",
    "Certains lieux demandent plusieurs passages.",
    "Rien ne vous oblige a tout explorer aujourd'hui.",
    "Les recits savent attendre."
];

let previousScreen = null;

let noticeElement = null;

let noticeTimer = null;

/****************************************
 INIT
****************************************/

function init() {

    ensureNotice();

    window.addEventListener(
        "screenChanged",
        event => {
            handleScreenChange(
                event.detail.screen
            );
        }
    );

}

/****************************************
 SCREEN CHANGE
****************************************/

function handleScreenChange(screenId) {

    const place =
        getPlace(screenId);

    if (!place) {

        previousScreen =
            screenId;

        return;

    }

    const memory =
        loadMemory();

    const wasVisited =
        Boolean(
            memory.visited[place.id]
        );

    applyPlaceSignature(
        place,
        wasVisited
    );

    animateArrival(
        screenId,
        wasVisited
    );

    showJourneyMessage(
        previousScreen,
        screenId,
        memory
    );

    memory.visited[place.id] =
        (memory.visited[place.id] || 0) + 1;

    memory.lastScreen =
        screenId;

    memory.lastPlace =
        place.id;

    saveMemory(memory);

    previousScreen =
        screenId;

}

function animateArrival(
    screenId,
    wasVisited
) {

    const screen =
        document.getElementById(
            screenId
        );

    if (!screen) return;

    screen.classList.remove(
        ARRIVAL_CLASS,
        RETURN_CLASS
    );

    screen.offsetWidth;

    screen.classList.add(
        ARRIVAL_CLASS
    );

    if (wasVisited) {

        screen.classList.add(
            RETURN_CLASS
        );

    }

    window.setTimeout(
        () => {

            screen.classList.remove(
                ARRIVAL_CLASS,
                RETURN_CLASS
            );

        },
        CLEANUP_DELAY
    );

}

/****************************************
 PLACE SIGNATURE
****************************************/

function getPlace(screenId) {

    if (
        screenId &&
        screenId.indexOf("e06_") === 0
    ) {

        return LIBRARY_PLACE;

    }

    return PLACES[screenId] || null;

}

function applyPlaceSignature(
    place,
    wasVisited
) {

    document.body.dataset.journeyPlace =
        place.id;

    document.body.dataset.journeySignature =
        place.signature;

    document.body.dataset.journeyVisited =
        wasVisited ? "true" : "false";

}

/****************************************
 JOURNEY MESSAGES
****************************************/

function showJourneyMessage(
    fromScreen,
    toScreen,
    memory
) {

    const from =
        getPlace(fromScreen);

    const to =
        getPlace(toScreen);

    if (
        !to ||
        !noticeElement
    ) return;

    let message = "";

    if (
        from &&
        from.id !== to.id
    ) {

        message =
            "Vous venez de quitter : " +
            from.name;

    } else if (
        shouldShowHint(memory)
    ) {

        message =
            HINTS[
                Math.floor(
                    Math.random() * HINTS.length
                )
            ];

    }

    if (!message) return;

    noticeElement.textContent =
        message;

    noticeElement.classList.add(
        MESSAGE_VISIBLE_CLASS
    );

    if (noticeTimer) {

        window.clearTimeout(
            noticeTimer
        );

    }

    noticeTimer =
        window.setTimeout(
            () => {

                noticeElement.classList.remove(
                    MESSAGE_VISIBLE_CLASS
                );

            },
            MESSAGE_DURATION
        );

}

function shouldShowHint(memory) {

    const count =
        Object
            .values(memory.visited)
            .reduce(
                (total, value) => total + value,
                0
            );

    if (count < 3) return false;

    return Math.random() < .28;

}

function ensureNotice() {

    noticeElement =
        document.getElementById(
            "journeyNotice"
        );

    if (noticeElement) return;

    noticeElement =
        document.createElement("p");

    noticeElement.id =
        "journeyNotice";

    noticeElement.className =
        "journey-notice";

    noticeElement.setAttribute(
        "aria-live",
        "polite"
    );

    document.body.appendChild(
        noticeElement
    );

}

/****************************************
 MEMORY
****************************************/

function loadMemory() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (saved) {

            return JSON.parse(saved);

        }

    } catch(error) {

        return createMemory();

    }

    return createMemory();

}

function createMemory() {

    return {
        visited: {},
        lastScreen: null,
        lastPlace: null
    };

}

function saveMemory(memory) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memory)
        );

    } catch(error) {

        // The journey continues without local memory if storage is unavailable.

    }

}

/****************************************
 PUBLIC API
****************************************/

return {
    init
};

})();

document.addEventListener(
    "DOMContentLoaded",
    () => {
        LivingJourney.init();
    }
);
