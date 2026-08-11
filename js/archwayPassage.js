/****************************************************
MAKERLAND V3.0-C
archwayPassage.js
****************************************************/

function createLivingPassage(config) {

/****************************************
 STATE
****************************************/

let screen = null;

let passage = null;

let gate = null;

let whisper = null;

let timers = [];

let ready = false;

let passing = false;

/****************************************
 INIT
****************************************/

function init() {

    screen =
        document.getElementById(
            config.screenId
        );

    if (!screen) return;

    createPassage();

    bindEvents();

}

function createPassage() {

    passage =
        document.createElement(
            "div"
        );

    passage.className =
        "archway-passage " +
        config.className;

    passage.setAttribute(
        "aria-live",
        "polite"
    );

    passage.innerHTML =
        `
        <div class="archway-ambient" aria-hidden="true">
            <div class="archway-halo"></div>
            <div class="archway-mist"></div>
            <div class="archway-particles"></div>
        </div>

        <p class="archway-whisper"></p>

        <div
            class="archway-gate"
            role="link"
            tabindex="0"
            aria-disabled="true">
            <span class="archway-invitation"></span>
        </div>

        <div class="archway-veil" aria-hidden="true"></div>
        `;

    whisper =
        passage.querySelector(
            ".archway-whisper"
        );

    gate =
        passage.querySelector(
            ".archway-gate"
        );

    const invitation =
        passage.querySelector(
            ".archway-invitation"
        );

    if (invitation) {

        invitation.textContent =
            config.invitation;

    }

    gate.setAttribute(
        "aria-label",
        config.invitation +
            " vers " +
            config.destination.label
    );

    gate.setAttribute(
        "title",
        config.destination.label
    );

    screen.appendChild(
        passage
    );

}

function bindEvents() {

    window.addEventListener(
        "screenChanged",
        event => {

            if (
                event.detail.screen ===
                config.screenId
            ) {

                activate();

                return;

            }

            deactivate();

        }
    );

    gate.addEventListener(
        "click",
        triggerPassage
    );

    gate.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) return;

            event.preventDefault();

            triggerPassage();

        }
    );

}

/****************************************
 LIFE CYCLE
****************************************/

function activate() {

    reset();

    const lines =
        getWhisperLines();

    whisper.replaceChildren(
        ...lines.map(line => {

            const span =
                document.createElement(
                    "span"
                );

            span.textContent =
                line + " ";

            return span;

        })
    );

    passage.dataset.weather =
        getSelectedWeather();

    screen.classList.add(
        config.activeScreenClass
    );

    passage.classList.add(
        "archway-passage-active"
    );

    if (prefersReducedMotion()) {

        revealReduced();

        return;

    }

    setTimer(
        () => {

            passage.classList.add(
                "archway-forest-visible"
            );

            dispatchCue(
                config.placeCue
            );

        },
        config.timings.forestSettle
    );

    setTimer(
        () => {

            passage.classList.add(
                "archway-whisper-visible"
            );

            dispatchCue(
                "whisper"
            );

        },
        config.timings.whisperShow
    );

    const readingDuration =
        getReadingDuration(
            lines.join(" ")
        );

    const hideWhisperAt =
        config.timings.whisperShow +
        config.timings.whisperFadeIn +
        readingDuration;

    setTimer(
        () => {

            passage.classList.remove(
                "archway-whisper-visible"
            );

        },
        hideWhisperAt
    );

    setTimer(
        revealInvitation,
        hideWhisperAt +
            config.timings.whisperFadeOut +
            config.timings.invitationBuffer
    );

}

function deactivate() {

    reset();

    if (screen) {

        screen.classList.remove(
            config.activeScreenClass,
            config.passingScreenClass
        );

    }

}

function revealReduced() {

    passage.classList.add(
        "archway-forest-visible",
        "archway-whisper-visible"
    );

    revealInvitation();

}

function revealInvitation() {

    ready =
        true;

    gate.setAttribute(
        "aria-disabled",
        "false"
    );

    passage.classList.add(
        "archway-ready"
    );

}

function reset() {

    clearTimers();

    ready =
        false;

    passing =
        false;

    if (gate) {

        gate.setAttribute(
            "aria-disabled",
            "true"
        );

    }

    if (passage) {

        passage.className =
            "archway-passage " +
            config.className;

    }

}

/****************************************
 PASSAGE
****************************************/

function triggerPassage() {

    if (
        !ready ||
        passing
    ) return;

    passing =
        true;

    passage.classList.add(
        "archway-passing"
    );

    screen.classList.add(
        config.passingScreenClass
    );

    dispatchCue(
        "passage"
    );

    if (prefersReducedMotion()) {

        openDestination();

        return;

    }

    setTimer(
        openDestination,
        config.timings.passageDuration
    );

}

function openDestination() {

    if (
        typeof Navigation !== "undefined" &&
        Navigation.openExternal
    ) {

        Navigation.openExternal(
            config.destination.url
        );

    }

}

/****************************************
 HELPERS
****************************************/

function getWhisperLines() {

    const selectedWeather =
        getSelectedWeather();

    if (
        config.useWeatherWhispers &&
        config.whispers[selectedWeather]
    ) {

        return config.whispers[selectedWeather];

    }

    return config.whispers.default;

}

function getSelectedWeather() {

    if (
        typeof App !== "undefined" &&
        App.getState
    ) {

        const appState =
            App.getState();

        if (
            appState &&
            appState.selectedWeather
        ) {

            return appState.selectedWeather;

        }

    }

    return "default";

}

function getReadingDuration(text) {

    if (
        typeof Navigation !== "undefined" &&
        Navigation.getWhisperReadingDuration
    ) {

        return Navigation.getWhisperReadingDuration(
            text
        );

    }

    const wordCount =
        text
            .split(/\s+/)
            .filter(Boolean)
            .length;

    return Math.min(
        Math.max(
            wordCount * 90,
            4000
        ),
        8000
    );

}

function prefersReducedMotion() {

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}

function setTimer(
    callback,
    delay
) {

    const timer =
        window.setTimeout(
            callback,
            delay
        );

    timers.push(
        timer
    );

}

function clearTimers() {

    timers.forEach(
        timer => window.clearTimeout(
            timer
        )
    );

    timers = [];

}

function dispatchCue(cue) {

    window.dispatchEvent(
        new CustomEvent(
            config.cueEventName,
            {
                detail: {
                    cue,
                    screen:
                        config.screenId,
                    destination:
                        config.destination.label
                }
            }
        )
    );

}

/****************************************
 PUBLIC API
****************************************/

return {

    init

};

}

const ArchwayPassage = createLivingPassage({

    screenId: "e04_oeuvre",

    className: "archway-passage-forest",

    activeScreenClass: "archway-screen-active",

    passingScreenClass: "archway-screen-passing",

    cueEventName: "archwayPassageCue",

    placeCue: "forest",

    useWeatherWhispers: false,

    destination: {
        label: "Oeuvre immersive des Recits Vivants",
        url: "https://wood-demonstrate.unicornplatform.page/zephyr_avenel/"
    },

    invitation: "Franchir le seuil",

    timings: {
        forestSettle: 420,
        whisperShow: 1180,
        whisperFadeIn: 1000,
        whisperFadeOut: 800,
        invitationBuffer: 220,
        passageDuration: 980
    },

    whispers: {
        default: [
            "Tous les chemins ne demandent pas d'etre compris.",
            "Certains demandent seulement d'etre empruntes."
        ],
        eclaircie: [
            "Certaines lumieres revelent des chemins deja presents."
        ],
        brouillard: [
            "Lorsque les reperes disparaissent, un premier pas peut suffire."
        ],
        tempete: [
            "Meme les arbres plient parfois.",
            "Les racines, elles, continuent de tenir."
        ],
        transition: [
            "Les passages ont leur propre rythme."
        ],
        je_ne_sais_pas: [
            "Il n'est pas necessaire de nommer le seuil avant de le franchir."
        ]
    }

});

const AtlasPassage = createLivingPassage({

    screenId: "e05_cartes",

    className: "atlas-passage",

    activeScreenClass: "atlas-passage-screen-active",

    passingScreenClass: "atlas-passage-screen-passing",

    cueEventName: "atlasPassageCue",

    placeCue: "atlas",

    useWeatherWhispers: false,

    destination: {
        label: "Atlas des Recits Vivants",
        url: "https://zephyravenel.github.io/atlas-recits-vivants/"
    },

    invitation: "\u2726 Ouvrir l'Atlas",

    timings: {
        forestSettle: 420,
        whisperShow: 1180,
        whisperFadeIn: 1000,
        whisperFadeOut: 1500,
        invitationBuffer: 220,
        passageDuration: 980
    },

    whispers: {
        default: [
            "Les cartes n'enferment pas le monde.",
            "Elles ouvrent des chemins pour le regarder autrement."
        ]
    }

});

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ArchwayPassage.init();

        AtlasPassage.init();

    }
);
