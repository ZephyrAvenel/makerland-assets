/****************************************************
MAKERLAND
immersiveLayer.js
****************************************************/

const ImmersiveLayer = (() => {

const SOURCE =
    "data/immersive-zones.json";

let zoneData = {};

let whisperTimer = null;

let starTimer = null;

/****************************************
 INIT
****************************************/

async function init() {

    await load();

    bindEvents();

    renderCurrentScreen();

}

async function load() {

    try {

        const response =
            await fetch(SOURCE);

        const data =
            await response.json();

        zoneData =
            data.screens || {};

    } catch(error) {

        console.error(
            "Erreur couches immersives",
            error
        );

    }

}

/****************************************
 RENDER
****************************************/

function render(screenId) {

    clear();

    const screen =
        document.getElementById(screenId);

    const zones =
        zoneData[screenId];

    if (
        !screen ||
        !zones
    ) return;

    const layer =
        document.createElement("div");

    layer.className =
        "immersive-zone-layer";

    layer.dataset.screen =
        screenId;

    layer.setAttribute(
        "aria-label",
        "Zones interactives du lieu"
    );

    zones.forEach(zone => {

        layer.appendChild(
            createZone(zone)
        );

    });

    if (
        screenId === "e08_constellation"
    ) {

        const star =
            document.createElement("div");

        star.className =
            "immersive-constellation-star";

        layer.appendChild(star);

    }

    screen.appendChild(layer);

}

function createZone(zone) {

    const element =
        zone.href ?
            document.createElement("a") :
            document.createElement("button");

    element.className =
        [
            "immersive-zone",
            getZoneKind(zone)
        ].join(" ");

    element.dataset.zoneId =
        zone.id;

    element.setAttribute(
        "aria-label",
        zone.label || zone.id
    );

    element.title =
        zone.label || "";

    if (zone.whisper) {

        element.dataset.whisper =
            zone.whisper;

        const whisper =
            document.createElement("span");

        whisper.className =
            "immersive-zone-whisper";

        whisper.textContent =
            zone.whisper;

        element.appendChild(whisper);

    }

    element.style.left =
        zone.x + "%";

    element.style.top =
        zone.y + "%";

    element.style.width =
        zone.w + "%";

    element.style.height =
        zone.h + "%";

    if (zone.href) {

        element.href =
            zone.href;

    } else {

        element.type =
            "button";

        element.addEventListener(
            "click",
            () => openScreen(zone.screen)
        );

    }

    bindZonePresence(
        element,
        zone
    );

    return element;

}

function getZoneKind(zone) {

    if (
        zone.id &&
        zone.id.indexOf("atelier_") === 0
    ) {

        return "immersive-zone-atelier";

    }

    if (
        zone.id &&
        zone.id.indexOf("constellation_recit_") === 0
    ) {

        return "immersive-zone-constellation-card";

    }

    return "immersive-zone-generic";

}

function bindZonePresence(
    element,
    zone
) {

    [
        "pointerenter",
        "focus",
        "pointerdown"
    ].forEach(eventName => {

        element.addEventListener(
            eventName,
            () => activateZone(element, zone)
        );

    });

}

function activateZone(
    element,
    zone
) {

    element.classList.add(
        "is-awake"
    );

    if (whisperTimer) {

        window.clearTimeout(
            whisperTimer
        );

    }

    whisperTimer =
        window.setTimeout(
            () => {

                element.classList.remove(
                    "is-awake"
                );

                whisperTimer =
                    null;

            },
            3000
        );

    if (
        zone.id &&
        zone.id.indexOf("constellation_recit_") === 0
    ) {

        revealConstellationStar(element);

    }

}

function revealConstellationStar(element) {

    const layer =
        element.closest(
            ".immersive-zone-layer"
        );

    if (!layer) return;

    const star =
        layer.querySelector(
            ".immersive-constellation-star"
        );

    if (!star) return;

    star.classList.add(
        "is-visible"
    );

    if (starTimer) {

        window.clearTimeout(
            starTimer
        );

    }

    starTimer =
        window.setTimeout(
            () => {

                star.classList.remove(
                    "is-visible"
                );

                starTimer =
                    null;

            },
            1800
        );

}

function clear() {

    document
        .querySelectorAll(".immersive-zone-layer")
        .forEach(layer => layer.remove());

}

/****************************************
 NAVIGATION
****************************************/

function openScreen(screenId) {

    if (
        !screenId ||
        typeof Navigation === "undefined" ||
        !Navigation.goTo
    ) return;

    Navigation.goTo(screenId);

}

function renderCurrentScreen() {

    if (
        typeof Navigation === "undefined" ||
        !Navigation.getCurrent
    ) return;

    render(
        Navigation.getCurrent()
    );

}

/****************************************
 EVENTS
****************************************/

function bindEvents() {

    window.addEventListener(
        "screenChanged",
        event => render(event.detail.screen)
    );

}

/****************************************
 PUBLIC API
****************************************/

return {
    init,
    render
};

})();

document.addEventListener(
    "DOMContentLoaded",
    () => {
        ImmersiveLayer.init();
    }
);
