/****************************************************
MAKERLAND
immersiveLayer.js
****************************************************/

const ImmersiveLayer = (() => {

const SOURCE =
    "data/immersive-zones.json";

let zoneData = {};

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

    layer.setAttribute(
        "aria-label",
        "Zones interactives du lieu"
    );

    zones.forEach(zone => {

        layer.appendChild(
            createZone(zone)
        );

    });

    screen.appendChild(layer);

}

function createZone(zone) {

    const element =
        zone.href ?
            document.createElement("a") :
            document.createElement("button");

    element.className =
        "immersive-zone";

    element.dataset.zoneId =
        zone.id;

    element.setAttribute(
        "aria-label",
        zone.label || zone.id
    );

    element.title =
        zone.label || "";

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

    return element;

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
