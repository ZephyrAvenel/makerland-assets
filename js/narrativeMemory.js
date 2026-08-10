const NarrativeMemory = (() => {

const STORAGE_KEY =
    "makerland.narrativeMemory.v1";

const MAX_HISTORY =
    24;

const DEFAULT_MEMORY = {

    visitCount: 0,

    firstVisit: null,

    lastVisit: null,

    lastWeather: null,

    lastDirection: null,

    weatherHistory: [],

    directionHistory: [],

    milestones: []

};

const WEATHER_MESSAGES = {

    brouillard:
        "Vous revenez souvent lorsque le paysage est voilé.",

    eclaircie:
        "L'éclaircie revient dans votre chemin.",

    transition:
        "Les passages reviennent dans votre chemin.",

    je_ne_sais_pas:
        "L'incertitude trouve ici un peu d'espace.",

    tempete:
        "La Boussole reste disponible, même dans le tumulte."

};

const DIRECTION_MESSAGES = {

    creer:
        "La création semble vous appeler.",

    explorer:
        "L'exploration revient dans votre chemin.",

    decouvrir:
        "La découverte reste proche.",

    repere:
        "Nous pouvons continuer à chercher des repères.",

    contempler:
        "La contemplation garde une place ouverte."

};

function now() {

    return new Date().toISOString();

}

function cloneDefaultMemory() {

    return {

        ...DEFAULT_MEMORY,

        weatherHistory: [],

        directionHistory: [],

        milestones: []

    };

}

function isStorageAvailable() {

    try {

        return typeof window !== "undefined" &&
            Boolean(window.localStorage);

    } catch(error) {

        return false;

    }

}

function normalizeMemory(memory) {

    return {

        ...cloneDefaultMemory(),

        ...memory,

        weatherHistory:
            Array.isArray(memory.weatherHistory)
                ? memory.weatherHistory.slice(-MAX_HISTORY)
                : [],

        directionHistory:
            Array.isArray(memory.directionHistory)
                ? memory.directionHistory.slice(-MAX_HISTORY)
                : [],

        milestones:
            Array.isArray(memory.milestones)
                ? memory.milestones
                : []

    };

}

function load() {

    if (!isStorageAvailable()) {

        return cloneDefaultMemory();

    }

    try {

        const raw =
            window.localStorage.getItem(
                STORAGE_KEY
            );

        if (!raw) {

            return cloneDefaultMemory();

        }

        return normalizeMemory(
            JSON.parse(raw)
        );

    } catch(error) {

        return cloneDefaultMemory();

    }

}

function save(memory) {

    if (!isStorageAvailable()) {

        return memory;

    }

    try {

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                normalizeMemory(memory)
            )
        );

    } catch(error) {

        return memory;

    }

    return memory;

}

function pushHistory(history, value, date) {

    if (!value) return history;

    return [

        ...history,

        {

            value,

            date

        }

    ].slice(-MAX_HISTORY);

}

function countValues(history) {

    return history.reduce(
        (counts, entry) => {

            counts[entry.value] =
                (counts[entry.value] || 0) + 1;

            return counts;

        },
        {}
    );

}

function uniqueCount(history) {

    return new Set(
        history.map(entry => entry.value)
    ).size;

}

function hasMilestone(memory, milestone) {

    return memory.milestones.includes(
        milestone
    );

}

function addMilestone(memory, milestone) {

    if (
        milestone &&
        !hasMilestone(memory, milestone)
    ) {

        memory.milestones = [

            ...memory.milestones,

            milestone

        ];

    }

}

function rememberWeather(selectedWeather) {

    if (!selectedWeather) {

        return getMemory();

    }

    const memory =
        load();

    const date =
        now();

    memory.lastWeather =
        selectedWeather;

    memory.weatherHistory =
        pushHistory(
            memory.weatherHistory,
            selectedWeather,
            date
        );

    addMilestone(
        memory,
        "weather:" + selectedWeather
    );

    return save(memory);

}

function rememberDirection(direction) {

    if (!direction) {

        return getMemory();

    }

    const memory =
        load();

    const date =
        now();

    memory.lastDirection =
        direction;

    memory.directionHistory =
        pushHistory(
            memory.directionHistory,
            direction,
            date
        );

    addMilestone(
        memory,
        "direction:" + direction
    );

    return save(memory);

}

function rememberVisit(details = {}) {

    const memory =
        load();

    const date =
        now();

    if (!memory.firstVisit) {

        memory.firstVisit =
            date;

    }

    memory.lastVisit =
        date;

    memory.visitCount =
        Math.max(
            0,
            Number(memory.visitCount) || 0
        ) + 1;

    if (details.weather) {

        memory.lastWeather =
            details.weather;

    }

    if (details.direction) {

        memory.lastDirection =
            details.direction;

        memory.directionHistory =
            pushHistory(
                memory.directionHistory,
                details.direction,
                date
            );

        addMilestone(
            memory,
            "direction:" + details.direction
        );

    }

    if (memory.visitCount === 1) {

        addMilestone(
            memory,
            "first_visit"
        );

    }

    if (memory.visitCount >= 10) {

        addMilestone(
            memory,
            "ten_visits"
        );

    }

    return save(memory);

}

function getVisitMessage(memory) {

    if (memory.visitCount <= 1) {

        return "Bienvenue.";

    }

    if (memory.visitCount === 2) {

        return "Heureux de vous revoir.";

    }

    return "La Boussole vous reconnaît.";

}

function getWeatherMessage(memory) {

    const counts =
        countValues(memory.weatherHistory);

    const weather =
        memory.lastWeather;

    if (
        weather &&
        counts[weather] >= 3 &&
        WEATHER_MESSAGES[weather]
    ) {

        return WEATHER_MESSAGES[weather];

    }

    if (
        uniqueCount(memory.weatherHistory) >= 3
    ) {

        return "Les paysages changent.";

    }

    return "";

}

function getDirectionMessage(memory) {

    const counts =
        countValues(memory.directionHistory);

    const direction =
        memory.lastDirection;

    if (
        uniqueCount(memory.directionHistory) >= 3
    ) {

        return "Votre chemin s'élargit.";

    }

    if (
        direction &&
        counts[direction] >= 3 &&
        DIRECTION_MESSAGES[direction]
    ) {

        return DIRECTION_MESSAGES[direction];

    }

    return "";

}

function getCompassWhispers(memory = getMemory()) {

    const pathMessages = [

        getWeatherMessage(memory),

        getDirectionMessage(memory)

    ].filter(Boolean);

    return [

        getVisitMessage(memory),

        pathMessages[0] || ""

    ].filter(Boolean);

}

function getMemory() {

    return load();

}

function reset() {

    if (!isStorageAvailable()) {

        return cloneDefaultMemory();

    }

    try {

        window.localStorage.removeItem(
            STORAGE_KEY
        );

    } catch(error) {

        return cloneDefaultMemory();

    }

    return cloneDefaultMemory();

}

return {

    rememberWeather,

    rememberDirection,

    rememberVisit,

    getCompassWhispers,

    getMemory,

    reset

};

})();
