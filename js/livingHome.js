(function () {
    const FIRST_KEY = "makerland.firstJourney";
    const JOURNEY_KEY = "makerland_living_journey";
    const PATHS_KEY = "makerland.living.paths";
    const CYCLE_KEY = "makerland:living-cycle";

    const QUOTES = [
        "Les recits changent notre maniere d'habiter le monde.",
        "Chaque oeuvre est une porte.",
        "Certaines questions ouvrent davantage qu'elles ne ferment.",
        "Les chemins savent attendre ceux qui les cherchent.",
        "Une idee devient vivante lorsqu'elle trouve un lieu."
    ];

    const PLACES = [
        ["Bibliotheque", "Les oeuvres publiees."],
        ["Atelier", "La ou elles prennent forme."],
        ["Constellation", "Les liens entre elles."],
        ["Carnet", "La memoire de votre voyage."],
        ["Archives", "Les coulisses de la creation."]
    ];

    let root = null;
    let currentScreen = null;

    function init() {
        ensureRoot();
        bindEvents();
        render("e01_accueil");
    }

    function bindEvents() {
        window.addEventListener("screenChanged", event => {
            render(event.detail.screen);
        });
    }

    function ensureRoot() {
        if (root) return;
        root = document.createElement("div");
        root.className = "living-home";
        root.setAttribute("data-living-home", "");
        root.setAttribute("aria-live", "polite");
        document.getElementById("app").appendChild(root);
    }

    function render(screenId) {
        currentScreen = screenId;

        if (!root) return;

        if (screenId !== "e01_accueil") {
            document.body.classList.remove("living-home-ready");
            root.innerHTML = "";
            return;
        }

        document.body.classList.add("living-home-ready");
        const known = isKnownVisitor();
        root.innerHTML = [
            renderDoors(known)
        ].join("");
        bindActions();
    }

    function renderThreshold() {
        return [
            "<section class=\"living-home__threshold\" aria-label=\"Seuil des Recits Vivants\">",
            "<p>Chaque recit ouvre une porte.<br>Chaque porte conduit vers un territoire.<br>Le voyage commence toujours par une premiere rencontre.</p>",
            "<span class=\"living-home__promise\">Une oeuvre immersive de Zephyr Avenel</span>",
            "</section>"
        ].join("");
    }

    function renderDaily() {
        return [
            "<aside class=\"living-home__daily\" aria-label=\"Phrase du jour\">",
            `<p>${escapeHtml(dailyQuote())}</p>`,
            "</aside>"
        ].join("");
    }

    function renderSeason() {
        const context = seasonalContext();
        return [
            "<aside class=\"living-home__season\" aria-label=\"Temps du territoire\">",
            `<p>Aujourd'hui : ${escapeHtml(context.season)} - ${escapeHtml(context.moment)}</p>`,
            "</aside>"
        ].join("");
    }

    function renderGuide() {
        return [
            "<section class=\"living-home__guide\" aria-label=\"Premier regard\">",
            "<p>Ici, rien n'est a reussir.</p>",
            "<p>Vous etes simplement invite a explorer.</p>",
            "</section>"
        ].join("");
    }

    function renderPlaces() {
        return [
            "<section class=\"living-home__places\" aria-label=\"Lieux des Recits Vivants\">",
            PLACES.map(place => [
                "<article class=\"living-home__place\">",
                `<strong>${escapeHtml(place[0])}</strong>`,
                `<span>${escapeHtml(place[1])}</span>`,
                "</article>"
            ].join("")).join(""),
            "</section>"
        ].join("");
    }

    function renderReturn() {
        const memory = readJson(JOURNEY_KEY, {});
        const paths = readJson(PATHS_KEY, {});
        const label = lastKnownLabel(memory, paths);
        return [
            "<aside class=\"living-home__return\" aria-label=\"Retour au voyage\">",
            "<p>Bienvenue de retour.</p>",
            `<p>Votre dernier chemin : ${escapeHtml(label)}.</p>`,
            "<button type=\"button\" data-living-home-continue>Continuer</button>",
            "</aside>"
        ].join("");
    }

    function renderDoors(known) {
        return [
            "<nav class=\"living-home__doors\" aria-label=\"Facons d'entrer dans les Recits Vivants\">",
            "<button type=\"button\" class=\"living-home__door\" data-living-home-first>",
            "<strong>Je decouvre</strong>",
            "<span>Un premier voyage d'environ cinq minutes.</span>",
            "</button>",
            "<button type=\"button\" class=\"living-home__door\" data-living-home-resume>",
            "<strong>Je poursuis mon voyage</strong>",
            `<span>${known ? "Reprendre la derniere trace ouverte." : "Ouvrir le Carnet quand il existera deja une trace."}</span>`,
            "</button>",
            "<button type=\"button\" class=\"living-home__door\" data-living-home-free>",
            "<strong>J'explore librement</strong>",
            "<span>Entrer sans guidage, au rythme des Recits Vivants.</span>",
            "</button>",
            "</nav>"
        ].join("");
    }

    function bindActions() {
        const first = root.querySelector("[data-living-home-first]");
        if (first) {
            first.addEventListener("click", () => {
                document.dispatchEvent(new CustomEvent("makerland:firstJourney:intro"));
            });
        }

        const free = root.querySelector("[data-living-home-free]");
        if (free) {
            free.addEventListener("click", () => navigateTo("e02_meteo"));
        }

        const resume = root.querySelector("[data-living-home-resume]");
        if (resume) {
            resume.addEventListener("click", resumeJourney);
        }

        const continueButton = root.querySelector("[data-living-home-continue]");
        if (continueButton) {
            continueButton.addEventListener("click", resumeJourney);
        }
    }

    function resumeJourney() {
        const firstJourney = readJson(FIRST_KEY, {});
        if (firstJourney.active && !firstJourney.completed) {
            document.dispatchEvent(new CustomEvent("makerland:firstJourney:resume"));
            return;
        }

        const memory = readJson(JOURNEY_KEY, {});
        if (memory.lastScreen && memory.lastScreen !== "e01_accueil") {
            navigateTo(memory.lastScreen);
            return;
        }
        window.location.href = "carnet/";
    }

    function navigateTo(screenId) {
        if (typeof Navigation !== "undefined" && Navigation.goTo) {
            Navigation.goTo(screenId);
        }
    }

    function isKnownVisitor() {
        const first = readJson(FIRST_KEY, {});
        const journey = readJson(JOURNEY_KEY, {});
        const paths = readJson(PATHS_KEY, {});
        return Boolean(
            first.choice ||
            first.completed ||
            journey && journey.visited && Object.keys(journey.visited).length > 1 ||
            paths && ((paths.started || []).length || (paths.completed || []).length)
        );
    }

    function lastKnownLabel(memory, paths) {
        if (paths && paths.activePath) {
            return readablePath(paths.activePath);
        }

        const places = {
            e01_accueil: "Accueil",
            e02_meteo: "Meteo interieure",
            e03_boussole: "Boussole Vivante",
            e04_oeuvre: "Foret de l'Arche",
            e05_cartes: "Cartes Narratives",
            e06_fiction: "Bibliotheque Vivante",
            e07_atelier: "L'Atelier des Recits",
            e08_constellation: "Constellation",
            e09_voyage: "Carnet de Voyage"
        };

        return places[memory.lastScreen] || places[memory.lastPlace] || "Les Recits Vivants";
    }

    function readablePath(value) {
        return String(value || "chemin vivant")
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function dailyQuote() {
        const now = new Date();
        const seed = Math.floor(now.getTime() / 86400000);
        return QUOTES[seed % QUOTES.length];
    }

    function seasonalContext() {
        const cycle = readJson(CYCLE_KEY, {});
        const now = new Date();
        return {
            season: cycle.currentSeason || seasonForMonth(now.getMonth()),
            moment: momentForHour(now.getHours())
        };
    }

    function seasonForMonth(month) {
        if (month >= 2 && month <= 4) return "printemps";
        if (month >= 5 && month <= 7) return "ete";
        if (month >= 8 && month <= 10) return "automne";
        return "hiver";
    }

    function momentForHour(hour) {
        if (hour >= 5 && hour < 8) return "aube";
        if (hour >= 8 && hour < 12) return "matin";
        if (hour >= 12 && hour < 17) return "midi";
        if (hour >= 17 && hour < 21) return "crepuscule";
        return "nuit";
    }

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || "null") || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    document.addEventListener("DOMContentLoaded", init);
})();
