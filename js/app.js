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

const LIVING_COMPASS_DEFAULT_WEATHER =
    "je_ne_sais_pas";

const LIVING_COMPASS_TEXTS = {

    eclaircie: {
        message:
            "Vous commencez sous une éclaircie.\nLes chemins sont ouverts.\nPrenez celui qui vous appelle.",
        direction:
            "creer"
    },

    transition: {
        message:
            "Vous commencez au cœur d'un passage.\nRien n'oblige à tout comprendre avant d'avancer.",
        direction:
            "explorer"
    },

    je_ne_sais_pas: {
        message:
            "Vous commencez sans réponse définitive.\nLa curiosité est déjà une direction.",
        direction:
            "decouvrir"
    },

    brouillard: {
        message:
            "Vous commencez dans le brouillard.\nCherchons simplement un premier repère.",
        direction:
            "repere"
    },

    tempete: {
        message:
            "Vous commencez au milieu de la tempête.\nRien ne presse.\nLa boussole reste disponible.",
        direction:
            "contempler"
    }

};

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

    livingCompassTimer: null,

    livingEchoTimer: null,

    livingEchoHideTimer: null,

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

            if (
                state.currentScreen ===
                "e03_boussole"
            ) {

                prepareLivingCompass();

            } else {

                clearLivingEcho();

            }

        }

    );

    document.addEventListener(

        "click",

        handleCompassDirectionClick

    );

    document.addEventListener(

        "click",

        handleLivingReturnClick

    );

    document.addEventListener(

        "keydown",

        handleCompassDirectionKeydown

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

function handleCompassDirectionClick(event) {

    const direction =
        event.target.closest(
            ".living-compass-direction"
        );

    if (!direction) return;

    openCompassDirection(
        direction
    );

}

function handleLivingReturnClick(event) {

    const button =
        event.target.closest(
            "[data-return-screen]"
        );

    if (!button) return;

    const target =
        button.dataset.returnScreen;

    if (
        !target ||
        typeof Navigation === "undefined" ||
        !Navigation.goTo
    ) return;

    event.preventDefault();

    Navigation.goTo(
        target
    );

}

function handleCompassDirectionKeydown(event) {

    if (
        event.key !== "Enter" &&
        event.key !== " "
    ) return;

    const direction =
        event.target.closest(
            ".living-compass-direction"
        );

    if (!direction) return;

    event.preventDefault();

    openCompassDirection(
        direction
    );

}

function openCompassDirection(direction) {

    if (
        state.currentScreen !==
        "e03_boussole"
    ) return;

    const target =
        direction.dataset.targetScreen;

    if (
        !target ||
        typeof Navigation === "undefined" ||
        !Navigation.goTo
    ) return;

    const compass =
        document.querySelector(
            "#e03_boussole .living-compass"
        );

    if (
        compass &&
        compass.classList.contains(
            "living-compass-passing"
        )
    ) return;

    clearLivingEcho();

    if (compass) {

        compass.classList.add(
            "living-compass-passing"
        );

    }

    window.setTimeout(
        () => {

            Navigation.goTo(
                target
            );

            if (compass) {

                compass.classList.remove(
                    "living-compass-passing"
                );

            }

        },
        260
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

    if (
        typeof NarrativeMemory !== "undefined" &&
        NarrativeMemory.rememberWeather
    ) {

        NarrativeMemory.rememberWeather(
            state.selectedWeather
        );

    }

    log(
        "Météo intérieure :",
        state.selectedWeather
    );

}

function prepareLivingCompass() {

    const compass =
        document.querySelector(
            "#e03_boussole .living-compass"
        );

    if (!compass) return;

    const selectedWeather =
        state.selectedWeather ||
        LIVING_COMPASS_DEFAULT_WEATHER;

    const config =
        LIVING_COMPASS_TEXTS[selectedWeather] ||
        LIVING_COMPASS_TEXTS[
            LIVING_COMPASS_DEFAULT_WEATHER
        ];

    const memory =
        getLivingCompassMemory(
            selectedWeather,
            config.direction
        );

    const message =
        compass.querySelector(
            "#livingCompassMessage"
        );

    if (message) {

        const messageLines =
            [

                ...config.message
                .split("\n")
                .map(line => ({

                    text:
                        line,

                    className:
                        ""

                })),

                ...memory.whispers.map(line => ({

                    text:
                        line,

                    className:
                        "living-compass-memory"

                }))

            ]
                .map(line => {

                    const span =
                        document.createElement(
                            "span"
                        );

                    span.textContent =
                        line.text + " ";

                    if (line.className) {

                        span.className =
                            line.className;

                    }

                    return span;

                });

        message.replaceChildren(
            ...messageLines
        );

        message.setAttribute(
            "aria-label",
            [

                config.message,

                ...memory.whispers

            ].join(
                " "
            )
        );

    }

    compass.dataset.weather =
        selectedWeather;

    compass.dataset.suggestedDirection =
        config.direction;

    scheduleLivingEcho(
        selectedWeather,
        memory.memory
    );

    compass.classList.remove(
        "living-compass-ready"
    );

    if (state.livingCompassTimer) {

        window.clearTimeout(
            state.livingCompassTimer
        );

    }

    compass
        .querySelectorAll(
            ".living-compass-direction"
        )
        .forEach(direction => {

            direction.classList.toggle(
                "is-suggested",
                direction.dataset.direction ===
                    config.direction
            );

        });

    state.livingCompassTimer =
        window.setTimeout(
        () => {

            compass.classList.add(
                "living-compass-ready"
            );

        },
        420
        );

}

function clearLivingEcho() {

    if (state.livingEchoTimer) {

        window.clearTimeout(
            state.livingEchoTimer
        );

        state.livingEchoTimer =
            null;

    }

    if (state.livingEchoHideTimer) {

        window.clearTimeout(
            state.livingEchoHideTimer
        );

        state.livingEchoHideTimer =
            null;

    }

    const echo =
        document.getElementById(
            "livingEcho"
        );

    if (!echo) return;

    echo.className =
        "living-echo";

    echo.textContent =
        "";

}

function scheduleLivingEcho(
    selectedWeather,
    memory
) {

    clearLivingEcho();

    if (
        typeof LivingEcho === "undefined" ||
        !LivingEcho.create
    ) return;

    const echo =
        document.getElementById(
            "livingEcho"
        );

    if (!echo) return;

    const livingEcho =
        LivingEcho.create({

            selectedWeather,

            visitCount:
                memory && memory.visitCount,

            weatherHistory:
                memory && memory.weatherHistory

        });

    if (!livingEcho.message) return;

    echo.textContent =
        livingEcho.message;

    echo.dataset.intensity =
        String(
            livingEcho.intensity
        );

    echo.dataset.glow =
        livingEcho.glow;

    state.livingEchoTimer =
        window.setTimeout(
            () => {

                echo.classList.add(
                    "living-echo-visible"
                );

            },
            livingEcho.delay
        );

    state.livingEchoHideTimer =
        window.setTimeout(
            () => {

                echo.classList.remove(
                    "living-echo-visible"
                );

            },
            livingEcho.delay + 5200
        );

}

function getLivingCompassMemory(
    selectedWeather,
    suggestedDirection
) {

    if (
        typeof NarrativeMemory === "undefined" ||
        !NarrativeMemory.rememberVisit
    ) {

        return {

            memory: null,

            whispers: []

        };

    }

    const memory =
        NarrativeMemory.rememberVisit({

            weather:
                selectedWeather,

            direction:
                suggestedDirection

        });

    const whispers =
        NarrativeMemory.getCompassWhispers
            ? NarrativeMemory.getCompassWhispers(
                memory
            )
            : [];

    return {

        memory,

        whispers

    };

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
