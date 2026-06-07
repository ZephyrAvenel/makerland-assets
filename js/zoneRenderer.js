/****************************************************
MAKERLAND V3.0-C
zoneRenderer.js
****************************************************/

const ZoneRenderer = (() => {

/****************************************
 CONFIG
****************************************/

const BASE_WIDTH = 1536;

const BASE_HEIGHT = 1024;

const DEBUG_ZONES = false;

/****************************************
 STATE
****************************************/

let zonesData = null;

let currentScreen = null;

/****************************************
 LOAD JSON
****************************************/

async function load() {

    try {

        const response =
            await fetch(
                "data/zones-v2.json"
            );

        const data =
            await response.json();

        zonesData =
            data.screens;

        console.log(
            "Zones chargées"
        );

        return zonesData;

    } catch(error) {

        console.error(
            "Erreur zones",
            error
        );

    }

}

/****************************************
 RENDER SCREEN
****************************************/

function render(screenId) {

    if (!zonesData) return;

    currentScreen =
        screenId;

    clear();

    const screen =
        document.getElementById(
            screenId
        );

    if (!screen) return;

    const config =
        zonesData[screenId];

    if (
        !config ||
        !config.zones
    ) return;

    Object.entries(
        config.zones
    ).forEach(
        ([id, zone]) => {

            createZone(
                screen,
                id,
                zone
            );

        }
    );

}

/****************************************
 CLEAR
****************************************/

function clear() {

    document
        .querySelectorAll(
            ".makerland-zone"
        )
        .forEach(
            zone => zone.remove()
        );

}

/****************************************
 CREATE ZONE
****************************************/

function createZone(
    container,
    id,
    zone
) {

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "makerland-zone";

    element.dataset.id =
        id;

    if (
        DEBUG_ZONES
    ) {

        element.style.border =
            "2px solid red";

        element.style.background =
            "rgba(255,0,0,.15)";

    }

    positionZone(
        container,
        element,
        zone
    );

    attachAction(
        element,
        zone
    );

    container.appendChild(
        element
    );

}

/****************************************
 POSITION
****************************************/

function positionZone(
    container,
    element,
    zone
) {

    const rect =
        container.getBoundingClientRect();

    const ratioX =
        rect.width /
        BASE_WIDTH;

    const ratioY =
        rect.height /
        BASE_HEIGHT;

    element.style.position =
        "absolute";

    element.style.left =
        (zone.x * ratioX)
        + "px";

    element.style.top =
        (zone.y * ratioY)
        + "px";

    element.style.width =
        (zone.w * ratioX)
        + "px";

    element.style.height =
        (zone.h * ratioY)
        + "px";

    element.style.cursor =
        "pointer";

    element.style.zIndex =
        "50";

}

/****************************************
 ACTIONS
****************************************/

function attachAction(
    element,
    zone
) {

    element.addEventListener(
        "click",
        () => {

            executeAction(
                zone.action
            );

        }
    );

}

function executeAction(
    action
) {

    if (!action) return;

    if (
        action.startsWith(
            "http"
        )
    ) {

        Navigation
            .openExternal(
                action
            );

        return;

    }

    Navigation.goTo(
        action
    );

}

/****************************************
 RESIZE
****************************************/

function refresh() {

    if (
        currentScreen
    ) {

        render(
            currentScreen
        );

    }

}

/****************************************
 EVENTS
****************************************/

function bindEvents() {

    window.addEventListener(

        "resize",

        () => {

            refresh();

        }

    );

    window.addEventListener(

        "screenChanged",

        event => {

            render(
                event.detail.screen
            );

        }

    );

}

/****************************************
 DEBUG
****************************************/

function enableDebug() {

    console.log(
        "Debug ON"
    );

    location.reload();

}

/****************************************
 PUBLIC API
****************************************/

return {

    load,

    render,

    refresh,

    enableDebug,

    clear

};

})();

/****************************************************
AUTO INIT
****************************************************/

document.addEventListener(

"DOMContentLoaded",

async () => {

    await ZoneRenderer.load();

    ZoneRenderer.refresh();

}

);

/****************************************************
CSS MINIMUM REQUIS

.makerland-zone {

position:absolute;

}

.screen {

position:relative;

}

****************************************************/