/****************************************************
MAKERLAND V3.0-C
zoneRenderer.js
****************************************************/

const ZoneRenderer = (() => {

/****************************************
 CONFIG
****************************************/

let BASE_WIDTH = null;

let BASE_HEIGHT = null;

const DEBUG_ZONES = false;

const ZONES_SOURCE =
    "data/zones-v3-final-beta.json";

const ACTION_ALIASES = {

    external: "openURL",

    navigation: "goto"

};

const EVENT_ACTION_TYPES = [

    "openBook",

    "openPack",

    "showDialog",

    "playAudio",

    "launchNFC"

];

/****************************************
 STATE
****************************************/

let zonesData = null;

let currentScreen = null;

const actionHandlers = {

    goto(action) {

        if (
            typeof Navigation !== "undefined" &&
            Navigation.goTo
        ) {

            Navigation.goTo(
                action.target
            );

        }

    },

    openURL(action) {

        if (
            typeof Navigation !== "undefined" &&
            Navigation.openExternal
        ) {

            Navigation.openExternal(
                action.url || action.target
            );

        }

    },

};

EVENT_ACTION_TYPES.forEach(
    type => {

        actionHandlers[type] =
            action => dispatchZoneAction(
                type,
                action
            );

    }
);

/****************************************
 LOAD JSON
****************************************/

async function load() {

    try {

        const response =
            await fetch(
                ZONES_SOURCE
            );

        const data =
            await response.json();

        zonesData =
            data.screens;

        syncBaseResolution(
            data.resolution
        );

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

    positionZone(
        container,
        element,
        zone
    );

    applyDebugStyle(
        element
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

    if (
        !BASE_WIDTH ||
        !BASE_HEIGHT
    ) {

        console.warn(
            "Resolution zones manquante"
        );

        return;

    }

    const rect =
        getContentRect(
            container
        );

    const scale =
        rect.scale;

    const left =
        rect.left +
        (zone.x * scale);

    const top =
        rect.top +
        (zone.y * scale);

    element.style.position =
        "absolute";

    element.style.left =
        left
        + "px";

    element.style.top =
        top
        + "px";

    element.style.width =
        (zone.w * scale)
        + "px";

    element.style.height =
        (zone.h * scale)
        + "px";

    element.style.cursor =
        "pointer";

    element.style.zIndex =
        "50";

}

function getContentRect(
    container
) {

    const containerRect =
        container.getBoundingClientRect();

    const scale =
        Math.min(
            containerRect.width / BASE_WIDTH,
            containerRect.height / BASE_HEIGHT
        );

    const width =
        BASE_WIDTH * scale;

    const height =
        BASE_HEIGHT * scale;

    return {
        left:
            (containerRect.width - width) / 2,
        top:
            (containerRect.height - height) / 2,
        width,
        height,
        scale
    };

}

/****************************************
 DEBUG STYLE
****************************************/

function applyDebugStyle(
    element
) {

    element.style.border =
        DEBUG_ZONES
            ? "2px solid orange"
            : "0";

    element.style.background =
        DEBUG_ZONES
            ? "rgba(255, 165, 0, .22)"
            : "transparent";

    element.style.boxSizing =
        "border-box";

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
                zone
            );

        }
    );

}

function executeAction(
    zone
) {

    const action =
        normalizeAction(
            zone
        );

    if (!action) return;

    const handler =
        actionHandlers[
            action.type
        ];

    if (handler) {

        handler(
            action
        );

        return;

    }

    dispatchZoneAction(
        action.type,
        action
    );

}

function normalizeAction(
    zone
) {

    if (
        !zone ||
        !zone.action
    ) return null;

    if (
        typeof zone.action === "object"
    ) {

        return {
            ...zone.action,
            type:
                zone.action.type ||
                ACTION_ALIASES[zone.type] ||
                zone.type ||
                "custom",
            zone
        };

    }

    if (
        zone.type === "external" ||
        zone.action.startsWith("http")
    ) {

        return {
            type: "openURL",
            url: zone.action,
            zone
        };

    }

    if (
        zone.type === "navigation"
    ) {

        return {
            type: "goto",
            target: zone.action,
            zone
        };

    }

    const parsedAction =
        parseActionString(
            zone.action
        );

    if (
        parsedAction &&
        actionHandlers[parsedAction.type]
    ) {

        return {
            ...parsedAction,
            zone
        };

    }

    return {
        type: zone.type || "custom",
        target: zone.action,
        zone
    };

}

function parseActionString(
    value
) {

    const separatorIndex =
        value.indexOf(":");

    if (separatorIndex <= 0) return null;

    const type =
        value.slice(
            0,
            separatorIndex
        );

    const target =
        value.slice(
            separatorIndex + 1
        );

    return {
        type,
        target,
        url:
            type === "openURL"
                ? target
                : undefined
    };

}

function dispatchZoneAction(
    type,
    action
) {

    window.dispatchEvent(

        new CustomEvent(
            "zoneAction",
            {
                detail: {
                    type,
                    action,
                    screen:
                        currentScreen
                }
            }
        )

    );

}

function registerAction(
    type,
    handler
) {

    if (
        !type ||
        typeof handler !== "function"
    ) return;

    actionHandlers[type] =
        handler;

}

function syncBaseResolution(
    resolution
) {

    if (!resolution) return;

    if (resolution.width) {

        BASE_WIDTH =
            resolution.width;

    }

    if (resolution.height) {

        BASE_HEIGHT =
            resolution.height;

    }

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

    bindEvents,

    enableDebug,

    registerAction,

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
