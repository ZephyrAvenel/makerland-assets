(function () {
    const STORAGE_KEY = "makerland.firstJourney";
    const JOURNEY_KEY = "makerland_living_journey";
    const PATHS_KEY = "makerland.living.paths";
    const EXISTING_MEMORY_AT_LOAD = hasPreviousMakerlandMemory();

    const STEPS = [
        {
            screen: "e02_meteo",
            title: "Pourquoi ce territoire existe-t-il ?",
            place: "Meteo",
            subtitle: "Votre premier climat.",
            text: "Vous vous demandez peut-etre pourquoi Makerland commence par un paysage interieur. Parce que les Recits Vivants ne cherchent pas seulement a etre compris. Ils demandent d'abord depuis quel climat vous les rencontrez.",
            quote: "Choisir un climat, c'est deja commencer a habiter le territoire."
        },
        {
            screen: "e06_fiction",
            title: "A quoi ressemblent les oeuvres qui naissent ici ?",
            place: "Les Marges Vivantes",
            subtitle: "Un livre comme premiere porte.",
            text: "Vous vous demandez peut-etre ce que l'on trouve dans cette bibliotheque. Des oeuvres qui ne donnent pas seulement un recit a lire, mais un lieu a traverser, une question a habiter, une facon de regarder autrement.",
            quote: "Lire, ici, c'est deja entrer dans un territoire."
        },
        {
            screen: "e07_atelier",
            title: "Comment naissent-elles ?",
            place: "Atelier IA",
            subtitle: "La ou les idees prennent forme.",
            text: "Vous vous demandez peut-etre comment une idee devient une oeuvre. L'Atelier montre les questions, les dialogues, les cartes, les images et les reprises qui transforment peu a peu une intuition en forme partageable.",
            quote: "L'intelligence artificielle n'est pas une autorite. Elle devient un compagnon de recherche."
        },
        {
            screen: "e07_atelier",
            title: "Peut-on voir leurs coulisses ?",
            place: "Archive D001",
            subtitle: "Les coulisses de la creation.",
            text: "Vous vous demandez peut-etre si l'on peut voir la naissance d'une oeuvre. Les Archives Vivantes conservent les traces : intuitions, conversations, hesitations et decisions qui ont rendu Makerland possible.",
            quote: "D001 ouvre la question fondatrice : pourquoi les Recits Vivants ?",
            href: "atelier/archives/d001.html"
        },
        {
            screen: "e08_constellation",
            title: "Comment toutes ces oeuvres dialoguent-elles entre elles ?",
            place: "Constellation",
            subtitle: "Les liens entre les oeuvres.",
            text: "Vous vous demandez peut-etre ce qui relie tout cela. La Constellation montre que les oeuvres, les archives, les images, les concepts et les lecteurs se repondent dans un meme ciel.",
            quote: "Chaque recit peut devenir une etoile, puis rejoindre d'autres chemins."
        }
    ];

    const state = {
        root: null,
        currentScreen: null,
        syncingScreen: false,
        memory: readMemory()
    };

    function init() {
        ensureRoot();
        bindEvents();
        renderForCurrentScreen("e01_accueil");
    }

    function bindEvents() {
        document.addEventListener("makerland:firstJourney:intro", renderIntro);
        document.addEventListener("makerland:firstJourney:start", startJourney);

        window.addEventListener("screenChanged", event => {
            renderForCurrentScreen(event.detail.screen);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && state.memory.active) {
                pauseJourney();
            }
        });
    }

    function ensureRoot() {
        if (state.root) return;
        state.root = document.createElement("div");
        state.root.className = "first-journey";
        state.root.setAttribute("data-first-journey", "");
        state.root.setAttribute("aria-live", "polite");
        document.getElementById("app").appendChild(state.root);
    }

    function renderForCurrentScreen(screenId) {
        state.currentScreen = screenId;
        state.memory = readMemory();

        if (!state.root) return;

        if (shouldShowWelcome(screenId)) {
            renderWelcome();
            return;
        }

        if (state.memory.active && !state.memory.completed) {
            document.body.classList.remove("first-journey-intro-ready");
            const step = STEPS[state.memory.step] || STEPS[0];
            if (screenId !== step.screen && !state.syncingScreen) {
                state.syncingScreen = true;
                window.setTimeout(() => {
                    navigateTo(step.screen);
                    state.syncingScreen = false;
                }, 0);
                return;
            }
            renderStep();
            return;
        }

        if (screenId === "e01_accueil") {
            clearRoot();
            return;
        }

        clearRoot();
    }

    function shouldShowWelcome(screenId) {
        if (document.querySelector("[data-living-home]")) {
            return false;
        }

        return screenId === "e01_accueil" &&
            !state.memory.choice &&
            !state.memory.completed &&
            !EXISTING_MEMORY_AT_LOAD;
    }

    function renderWelcome() {
        state.root.innerHTML = [
            "<section class=\"first-journey__welcome\" role=\"dialog\" aria-label=\"Bienvenue dans Makerland\">",
            "<h2>Bienvenue</h2>",
            "<p>Makerland n'est ni un jeu, ni une bibliotheque classique.</p>",
            "<p>C'est un territoire ou l'on explore la naissance des idees, des recits et des oeuvres.</p>",
            "<p>Vous pouvez suivre un premier voyage guide ou explorer librement.</p>",
            "<div class=\"first-journey__actions\">",
            "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-start>Faire mon premier voyage</button>",
            "<button type=\"button\" data-first-journey-free>Explorer librement</button>",
            "</div>",
            "</section>"
        ].join("");

        state.root.querySelector("[data-first-journey-start]").addEventListener("click", startJourney);
        state.root.querySelector("[data-first-journey-free]").addEventListener("click", dismissJourney);
    }

    function renderIntro() {
        if (!state.root) return;
        document.body.classList.add("first-journey-intro-ready");
        state.root.innerHTML = [
            "<section class=\"first-journey__intro\" role=\"dialog\" aria-label=\"Votre premier voyage\">",
            "<h2>Votre premier voyage</h2>",
            "<p>Les Recits Vivants ne se decouvrent pas en une seule fois.</p>",
            "<p>Ils se traversent.</p>",
            "<p>Durant quelques minutes, je vais vous faire decouvrir cinq lieux essentiels de Makerland.</p>",
            "<p>Il ne s'agit pas de tout comprendre. Seulement de sentir comment ce territoire est construit.</p>",
            "<div class=\"first-journey__actions\">",
            "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-start>Commencer le voyage</button>",
            "<button type=\"button\" data-first-journey-threshold>Retour au seuil</button>",
            "</div>",
            "</section>"
        ].join("");

        state.root.querySelector("[data-first-journey-start]").addEventListener("click", startJourney);
        state.root.querySelector("[data-first-journey-threshold]").addEventListener("click", clearRoot);
    }

    function renderStep() {
        const step = STEPS[state.memory.step] || STEPS[0];
        const isLast = state.memory.step >= STEPS.length - 1;
        const action = step.href
            ? `<a href="${step.href}">Ouvrir D001</a>`
            : `<button type="button" data-first-journey-open>Voir ce lieu</button>`;

        state.root.innerHTML = [
            "<aside class=\"first-journey__step\" aria-label=\"Premier Voyage\">",
            `<p class=\"first-journey__progress\">Etape ${state.memory.step + 1} / ${STEPS.length}</p>`,
            `<h3>${escapeHtml(step.title)}</h3>`,
            `<span class=\"first-journey__subtitle\">${escapeHtml(step.place)} - ${escapeHtml(step.subtitle)}</span>`,
            `<p>${escapeHtml(step.text)}</p>`,
            `<blockquote class=\"first-journey__quote\">${escapeHtml(step.quote)}</blockquote>`,
            "<div class=\"first-journey__actions\">",
            action,
            state.memory.step > 0 ? "<button type=\"button\" data-first-journey-prev>Retour</button>" : "",
            isLast
                ? "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-finish>Terminer le voyage</button>"
                : "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-next>Continuer</button>",
            "<button type=\"button\" data-first-journey-pause>Explorer librement</button>",
            "</div>",
            "</aside>"
        ].join("");

        bindStepActions(step);
    }

    function renderReplay() {
        state.root.innerHTML = [
            "<section class=\"first-journey__replay\" aria-label=\"Premier Voyage\">",
            `<button type=\"button\" data-first-journey-replay>${state.memory.active ? "Reprendre le Premier Voyage" : "Refaire le Premier Voyage"}</button>`,
            "</section>"
        ].join("");
        state.root.querySelector("[data-first-journey-replay]").addEventListener("click", startJourney);
    }

    function bindStepActions(step) {
        const openButton = state.root.querySelector("[data-first-journey-open]");
        if (openButton) {
            openButton.addEventListener("click", () => navigateTo(step.screen));
        }

        const previous = state.root.querySelector("[data-first-journey-prev]");
        if (previous) {
            previous.addEventListener("click", () => moveStep(-1));
        }

        const next = state.root.querySelector("[data-first-journey-next]");
        if (next) {
            next.addEventListener("click", () => moveStep(1));
        }

        const finish = state.root.querySelector("[data-first-journey-finish]");
        if (finish) {
            finish.addEventListener("click", finishJourney);
        }

        const pause = state.root.querySelector("[data-first-journey-pause]");
        if (pause) {
            pause.addEventListener("click", pauseJourney);
        }
    }

    function startJourney() {
        document.body.classList.remove("first-journey-intro-ready");
        state.memory = {
            choice: "guided",
            active: true,
            completed: false,
            step: 0,
            startedAt: state.memory.startedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        writeMemory(state.memory);
        navigateTo(STEPS[0].screen);
        renderStep();
    }

    function dismissJourney() {
        state.memory.choice = "free";
        state.memory.active = false;
        state.memory.completed = false;
        state.memory.dismissedAt = new Date().toISOString();
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        clearRoot();
    }

    function pauseJourney() {
        state.memory.active = false;
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        renderForCurrentScreen(state.currentScreen);
    }

    function finishJourney() {
        state.memory.active = false;
        state.memory.completed = true;
        state.memory.completedAt = new Date().toISOString();
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        state.root.innerHTML = [
            "<aside class=\"first-journey__step\" aria-label=\"Premier Voyage termine\">",
            "<h3>Vous connaissez maintenant les cinq lieux fondateurs de Makerland.</h3>",
            "<p>Le reste du territoire vous appartient desormais.</p>",
            "<p>Chaque oeuvre, chaque archive et chaque chemin pourra etre explore librement, a votre rythme.</p>",
            "<p>Bienvenue dans les Recits Vivants.</p>",
            "<div class=\"first-journey__actions\">",
            "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-free>Explorer librement</button>",
            "<button type=\"button\" data-first-journey-replay>Refaire le Premier Voyage</button>",
            "</div>",
            "</aside>"
        ].join("");
        state.root.querySelector("[data-first-journey-free]").addEventListener("click", clearRoot);
        state.root.querySelector("[data-first-journey-replay]").addEventListener("click", startJourney);
    }

    function moveStep(direction) {
        const nextStep = Math.max(0, Math.min(STEPS.length - 1, state.memory.step + direction));
        state.memory.step = nextStep;
        state.memory.active = true;
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        navigateTo(STEPS[nextStep].screen);
        renderStep();
    }

    function navigateTo(screenId) {
        if (typeof Navigation !== "undefined" && Navigation.goTo) {
            Navigation.goTo(screenId);
        }
    }

    function clearRoot() {
        document.body.classList.remove("first-journey-intro-ready");
        state.root.innerHTML = "";
    }

    function hasPreviousMakerlandMemory() {
        try {
            const journey = JSON.parse(localStorage.getItem(JOURNEY_KEY) || "null");
            const paths = JSON.parse(localStorage.getItem(PATHS_KEY) || "null");
            return Boolean(
                journey && journey.visited && Object.keys(journey.visited).length ||
                paths && (paths.started || paths.completed)
            );
        } catch (error) {
            return false;
        }
    }

    function readMemory() {
        try {
            const memory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            memory.step = Number.isInteger(memory.step) ? memory.step : 0;
            return memory;
        } catch (error) {
            return { step: 0 };
        }
    }

    function writeMemory(memory) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        } catch (error) {
            return;
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
