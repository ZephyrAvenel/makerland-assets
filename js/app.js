/****************************************************
MAKERLAND V3.0-C
app.js
****************************************************/

const App = (() => {

/****************************************
 CONFIG
****************************************/

const VERSION = "3.0-C";

const DEBUG = false;

const WEATHER_ZONE_IDS = [

    "eclaircie",

    "transition",

    "je_ne_sais_pas",

    "brouillard",

    "tempete"

];

/****************************************
 STATE
****************************************/

const state = {

    initialized: false,

    currentScreen: null,

    zonesLoaded: false,

    booksLoaded: false,

    storiesLoaded: false,

    selectedWeather: null,

    startedAt: null

};

/****************************************
 HELPERS
****************************************/

function log(...args) {

    if (DEBUG) {

        console.log(
            "[Makerland]",
            ...args
        );

    }

}

/****************************************
 LOADING SCREEN
****************************************/

function showLoading() {

    const loader =
        document.getElementById(
            "loadingScreen"
        );

    if (loader) {

        loader.style.display =
            "flex";

    }

}

function hideLoading() {

    const loader =
        document.getElementById(
            "loadingScreen"
        );

    if (loader) {

        loader.style.display =
            "none";

    }

}

/****************************************
 LOAD DATA
****************************************/

async function loadData() {

    log(
        "Chargement données..."
    );

    try {

        await ZoneRenderer.load();

        state.zonesLoaded =
            true;

    } catch(error) {

        console.error(
            "Erreur zones",
            error
        );

    }

    try {

        await Books.load();

        state.booksLoaded =
            true;

    } catch(error) {

        console.error(
            "Erreur livres",
            error
        );

    }

try {

    if (
        typeof Constellation !==
        "undefined"
    ) {

        state.storiesLoaded = true;

    }

} catch(error) {

    console.error(
        "Erreur constellation",
        error
    );

}
}

/****************************************
 INIT MODULES
****************************************/

function initModules() {

    log(
        "Initialisation modules"
    );

    Navigation.init();

 ZoneRenderer.bindEvents();

    if (
        typeof Constellation !==
        "undefined" &&
        Constellation.init
    ) {

        Constellation.init();

    }

}

/****************************************
 EVENTS
****************************************/

function bindEvents() {

    window.addEventListener(

        "screenChanged",

        event => {

            state.currentScreen =
                event.detail.screen;

            log(
                "Écran actif :",
                state.currentScreen
            );

        }

    );

    document.addEventListener(

        "click",

        captureWeatherSelection,

        true

    );

    window.addEventListener(

        "error",

        event => {

            console.error(
                "Erreur globale",
                event.error
            );

        }

    );

}

function captureWeatherSelection(event) {

    const zone =
        event.target.closest(
            ".makerland-zone"
        );

    if (
        !zone ||
        state.currentScreen !== "e02_meteo" ||
        !WEATHER_ZONE_IDS.includes(zone.dataset.id)
    ) return;

    state.selectedWeather =
        zone.dataset.id;

    log(
        "Météo intérieure :",
        state.selectedWeather
    );

}

/****************************************
 START
****************************************/

async function start() {

    showLoading();

    log(
        "Démarrage Makerland"
    );

    state.startedAt =
        new Date();

 await loadData();

 bindEvents();

 initModules();

    Navigation.goTo(
        "e01_accueil"
    );

    hideLoading();

    state.initialized =
        true;

    log(
        "Makerland prêt"
    );

    if (DEBUG) {

        console.table(
            state
        );

    }

}

/****************************************
 PUBLIC API
****************************************/

function getVersion() {

    return VERSION;

}

function getState() {

    return {

        ...state

    };

}

function getStatus() {

    return {

        version:
            VERSION,

        initialized:
            state.initialized,

        currentScreen:
            state.currentScreen,

        zonesLoaded:
            state.zonesLoaded,

        booksLoaded:
            state.booksLoaded,

        storiesLoaded:
            state.storiesLoaded,

        selectedWeather:
            state.selectedWeather

    };

}

/****************************************
 EXPORT
****************************************/

return {

    start,

    getVersion,

    getState,

    getStatus

};

})();

/****************************************************
AUTO START
****************************************************/

document.addEventListener(

"DOMContentLoaded",

async () => {

    await App.start();

}

);
