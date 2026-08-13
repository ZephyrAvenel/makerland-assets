(function () {
    const MEMORY_KEY = "makerland:living-seasons";
    const CYCLE_KEY = "makerland:living-cycle";
    const DAY_MS = 24 * 60 * 60 * 1000;

    const SEASONS = {
        spring: {
            label: "printemps",
            place: "Dialogue",
            fragment: "Les premieres questions ouvrent parfois plus que les reponses."
        },
        summer: {
            label: "ete",
            place: "Cartographie",
            fragment: "Les cartes s'elargissent lorsque la lumiere devient plus franche."
        },
        autumn: {
            label: "automne",
            place: "Transmission",
            fragment: "Ce qui tombe nourrit parfois la prochaine forme."
        },
        winter: {
            label: "hiver",
            place: "Carnet",
            fragment: "Le silence garde certaines traces mieux que la vitesse."
        }
    };

    const MOMENTS = {
        dawn: [
            "Le territoire s'eveille.",
            "Une lumiere basse ouvre les premiers chemins."
        ],
        morning: [
            "La lumiere change les chemins.",
            "Les lieux reprennent doucement leur forme."
        ],
        noon: [
            "Certaines cartes deviennent plus lisibles.",
            "Le jour rassemble les fragments."
        ],
        dusk: [
            "Certaines idees preferent le soir.",
            "Le paysage ralentit avec la lumiere."
        ],
        night: [
            "La nuit laisse les recits respirer.",
            "Les chemins restent ouverts meme dans l'ombre."
        ]
    };

    function readJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            return;
        }
    }

    function seasonForMonth(month) {
        if (month >= 2 && month <= 4) {
            return "spring";
        }

        if (month >= 5 && month <= 7) {
            return "summer";
        }

        if (month >= 8 && month <= 10) {
            return "autumn";
        }

        return "winter";
    }

    function momentForHour(hour) {
        if (hour >= 5 && hour < 8) {
            return "dawn";
        }

        if (hour >= 8 && hour < 12) {
            return "morning";
        }

        if (hour >= 12 && hour < 17) {
            return "noon";
        }

        if (hour >= 17 && hour < 21) {
            return "dusk";
        }

        return "night";
    }

    function getContext(date) {
        const season = seasonForMonth(date.getMonth());
        const moment = momentForHour(date.getHours());

        return {
            season,
            moment,
            seasonLabel: SEASONS[season].label,
            seasonalPlace: SEASONS[season].place
        };
    }

    function rememberVisit(date) {
        const memory = readJson(MEMORY_KEY);

        if (!memory.firstSeen) {
            memory.firstSeen = date.toISOString();
        }

        memory.lastSeen = date.toISOString();
        writeJson(MEMORY_KEY, memory);
        return memory;
    }

    function updateCycle(context) {
        const cycle = readJson(CYCLE_KEY);
        cycle.currentSeason = context.seasonLabel;
        cycle.currentMoment = context.moment;
        cycle.seasonalPlace = context.seasonalPlace;
        cycle.seasonalFragments = Array.isArray(cycle.seasonalFragments)
            ? cycle.seasonalFragments
            : [];

        const fragment = SEASONS[context.season].fragment;
        if (!cycle.seasonalFragments.includes(fragment)) {
            cycle.seasonalFragments.push(fragment);
        }

        writeJson(CYCLE_KEY, cycle);
    }

    function applyClasses(context) {
        document.body.classList.add("living-season-ready");
        document.body.classList.add("season-" + context.season);
        document.body.classList.add("moment-" + context.moment);
        document.body.style.setProperty("--living-season", context.seasonLabel);
    }

    function daysSinceFirstVisit(memory, date) {
        if (!memory.firstSeen) {
            return 0;
        }

        const first = new Date(memory.firstSeen);
        if (Number.isNaN(first.getTime())) {
            return 0;
        }

        return Math.floor((date.getTime() - first.getTime()) / DAY_MS);
    }

    function shouldShowWhisper(memory, date) {
        const today = date.toISOString().slice(0, 10);
        if (memory.lastWhisperDay === today) {
            return false;
        }

        return Math.random() < 0.22;
    }

    function pickWhisper(context, memory, date) {
        const days = daysSinceFirstVisit(memory, date);

        if (days >= 2 && days % 7 === 0) {
            return "Il y a quelque temps, vous avez commence ce chemin.";
        }

        const options = MOMENTS[context.moment] || [];
        const seasonal = SEASONS[context.season].fragment;
        return Math.random() < 0.38
            ? seasonal
            : options[Math.floor(Math.random() * options.length)];
    }

    function renderWhisper(context, memory, date) {
        if (!shouldShowWhisper(memory, date)) {
            return;
        }

        const main =
            document.querySelector("main") ||
            document.querySelector("#app") ||
            document.body;
        const whisper = document.createElement("aside");
        whisper.className = "seasonal-whisper";
        whisper.textContent = pickWhisper(context, memory, date);

        if (main.firstElementChild) {
            main.insertBefore(whisper, main.firstElementChild.nextSibling);
        } else {
            main.appendChild(whisper);
        }

        memory.lastWhisperDay = date.toISOString().slice(0, 10);
        writeJson(MEMORY_KEY, memory);
    }

    function init() {
        const now = new Date();
        const context = getContext(now);
        const memory = rememberVisit(now);

        applyClasses(context);
        updateCycle(context);
        renderWhisper(context, memory, now);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
