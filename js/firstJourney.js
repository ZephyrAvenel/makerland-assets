(function () {
    const STORAGE_KEY = "makerland.firstJourney";
    const JOURNEY_KEY = "makerland_living_journey";
    const PATHS_KEY = "makerland.living.paths";
    const EXISTING_MEMORY_AT_LOAD = hasPreviousMakerlandMemory();

    const STEPS = [
        {
            screen: "e02_meteo",
            title: "Pourquoi ce territoire existe-t-il ?",
            place: "Le Seuil des Climats",
            subtitle: "Votre premiere rencontre.",
            text: "Vous vous demandez peut-etre pourquoi ce voyage commence par un paysage interieur. Parce que les Recits Vivants ne cherchent pas seulement a etre compris. Ils demandent d'abord depuis quel climat vous les rencontrez.",
            quote: "Choisir un climat, c'est deja commencer a habiter le territoire."
        },
        {
            screen: "e06_fiction",
            title: "A quoi ressemblent les oeuvres qui naissent ici ?",
            place: "Bibliotheque Vivante",
            subtitle: "Les oeuvres publiees.",
            text: "Vous vous demandez peut-etre ce que l'on trouve dans cette bibliotheque. Des oeuvres qui ne donnent pas seulement un recit a lire, mais un lieu a traverser, une question a habiter, une facon de regarder autrement.",
            quote: "Lire, ici, c'est deja entrer dans un territoire."
        },
        {
            screen: "e07_atelier",
            title: "Comment naissent-elles ?",
            place: "L'Atelier des Recits",
            subtitle: "La ou les idees prennent forme.",
            text: "Vous vous demandez peut-etre comment une idee devient une oeuvre. L'Atelier montre les questions, les dialogues, les cartes, les images et les reprises qui transforment peu a peu une intuition en forme partageable.",
            quote: "L'intelligence artificielle devient ici un compagnon de recherche."
        },
        {
            screen: "e07_atelier",
            title: "Peut-on voir leurs coulisses ?",
            place: "Archives Vivantes",
            subtitle: "Les coulisses de la creation.",
            text: "Vous vous demandez peut-etre si l'on peut voir la naissance d'une oeuvre. Les Archives Vivantes conservent les traces : intuitions, conversations, hesitations et decisions qui ont rendu les Recits Vivants possibles.",
            quote: "D001 ouvre la question fondatrice : pourquoi les Recits Vivants ?",
            href: "atelier/archives/d001.html"
        },
        {
            screen: "e08_constellation",
            title: "Comment dialoguent-elles entre elles ?",
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
        transitioning: false,
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
            document.body.classList.add("first-journey-active");
            if (state.memory.phase === "forest") {
                if (syncScreen("e04_oeuvre", renderForestThreshold)) renderForestThreshold();
                return;
            }
            if (state.memory.phase === "conclusion") {
                if (syncScreen("e08_constellation", renderConclusion)) renderConclusion();
                return;
            }
            const step = STEPS[state.memory.step] || STEPS[0];
            if (!syncScreen(step.screen, renderStep)) return;
            renderStep();
            return;
        }

        if (screenId === "e01_accueil") {
            document.body.classList.remove("first-journey-active");
            clearRoot();
            return;
        }

        document.body.classList.remove("first-journey-active");
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
            "<section class=\"first-journey__welcome\" role=\"dialog\" aria-label=\"Bienvenue dans les Recits Vivants\">",
            "<h2>Bienvenue</h2>",
            "<p>Les Recits Vivants ne sont ni un jeu, ni une bibliotheque classique.</p>",
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
            "<p>En cinq etapes, vous allez decouvrir comment naissent les Recits Vivants.</p>",
            "<p>Vous ne visiterez pas seulement des lieux.</p>",
            "<p>Vous suivrez le chemin qui conduit d'une intuition a une oeuvre.</p>",
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
        const transitionClass = state.transitioning ? " is-transitioning" : "";
        const action = step.href
            ? `<a href="${step.href}">Ouvrir D001</a>`
            : `<button type="button" data-first-journey-open>Voir ce lieu</button>`;

        state.root.innerHTML = [
            `<aside class="first-journey__step${transitionClass}" aria-label="Premier Voyage">`,
            `<p class=\"first-journey__progress\">Etape ${state.memory.step + 1} / ${STEPS.length}</p>`,
            `<h3>${escapeHtml(step.title)}</h3>`,
            "<div class=\"first-journey__place-card\">",
            `<strong>${escapeHtml(step.place)}</strong>`,
            `<span>${escapeHtml(step.subtitle)}</span>`,
            "</div>",
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
            finish.addEventListener("click", showConclusion);
        }

        const pause = state.root.querySelector("[data-first-journey-pause]");
        if (pause) {
            pause.addEventListener("click", pauseJourney);
        }
    }

    function startJourney() {
        document.body.classList.remove("first-journey-intro-ready");
        document.body.classList.add("first-journey-active");
        state.memory = {
            choice: "guided",
            active: true,
            completed: false,
            phase: "steps",
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
        document.body.classList.remove("first-journey-active");
        state.memory.active = false;
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        renderForCurrentScreen(state.currentScreen);
    }

    function finishJourney() {
        document.body.classList.remove("first-journey-active");
        state.memory.active = false;
        state.memory.completed = true;
        state.memory.completedAt = new Date().toISOString();
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        state.root.innerHTML = [
            "<aside class=\"first-journey__step\" aria-label=\"Premier Voyage termine\">",
            "<h3>Vous connaissez maintenant les cinq portes des Recits Vivants.</h3>",
            "<p>Le seuil est desormais derriere vous.</p>",
            "<p>Vous avez decouvert comment une intuition devient une oeuvre, puis rejoint d'autres recits.</p>",
            "<p>A partir d'ici, il n'existe plus de chemin unique.</p>",
            "<p>Chaque lecteur compose desormais sa propre traversee.</p>",
            "</aside>"
        ].join("");
    }

    function moveStep(direction) {
        const nextStep = Math.max(0, Math.min(STEPS.length - 1, state.memory.step + direction));
        state.transitioning = true;
        renderStep();

        window.setTimeout(() => {
            state.memory.step = nextStep;
            state.memory.active = true;
            state.memory.phase = "steps";
            state.memory.updatedAt = new Date().toISOString();
            writeMemory(state.memory);
            state.transitioning = false;
            navigateTo(STEPS[nextStep].screen);
            renderStep();
        }, 300);
    }

    function showConclusion() {
        state.memory.active = true;
        state.memory.completed = false;
        state.memory.phase = "conclusion";
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        renderConclusion();
    }

    function renderConclusion() {
        state.root.innerHTML = [
            "<aside class=\"first-journey__step first-journey__conclusion\" aria-label=\"Conclusion du Premier Voyage\">",
            "<h3>Vous connaissez maintenant les cinq portes des Recits Vivants.</h3>",
            "<p>Le seuil est desormais derriere vous.</p>",
            "<p>Vous avez decouvert comment une intuition devient une oeuvre, puis rejoint d'autres recits.</p>",
            "<p>A partir d'ici, il n'existe plus de chemin unique.</p>",
            "<p>Chaque lecteur compose desormais sa propre traversee.</p>",
            "<div class=\"first-journey__actions\">",
            "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-forest>Continuer vers la Foret de l'Arche</button>",
            "<button type=\"button\" data-first-journey-free>Explorer librement</button>",
            "<button type=\"button\" data-first-journey-replay>Refaire le premier voyage</button>",
            "</div>",
            "</aside>"
        ].join("");
        state.root.querySelector("[data-first-journey-forest]").addEventListener("click", showForestThreshold);
        state.root.querySelector("[data-first-journey-free]").addEventListener("click", finishAndClear);
        state.root.querySelector("[data-first-journey-replay]").addEventListener("click", startJourney);
    }

    function showForestThreshold() {
        state.memory.active = true;
        state.memory.completed = false;
        state.memory.phase = "forest";
        state.memory.updatedAt = new Date().toISOString();
        writeMemory(state.memory);
        navigateTo("e04_oeuvre");
        renderForestThreshold();
    }

    function renderForestThreshold() {
        state.root.innerHTML = [
            "<section class=\"first-journey__forest\" role=\"dialog\" aria-label=\"La Foret de l'Arche\">",
            "<p class=\"first-journey__progress\">Epilogue du Premier Voyage</p>",
            "<h2>La Foret de l'Arche</h2>",
            "<span class=\"first-journey__forest-subtitle\">Le seuil de l'Oeuvre immersive</span>",
            "<div class=\"first-journey__forest-text\">",
            "<p>Vous avez parcouru les cinq lieux fondateurs des Recits Vivants.</p>",
            "<p>Vous connaissez desormais leur origine, leurs oeuvres, leur atelier, leurs archives et les liens qui les unissent.</p>",
            "<p>Mais un territoire ne se comprend jamais entierement depuis son seuil.</p>",
            "<p>Il arrive un moment ou il faut accepter de le traverser.</p>",
            "<p>La Foret de l'Arche n'est plus un lieu d'explication.</p>",
            "<p>C'est le premier pas dans l'Oeuvre immersive.</p>",
            "<p>A partir d'ici, le recit ne vous sera plus presente.</p>",
            "<p>C'est vous qui le parcourrez.</p>",
            "</div>",
            "<div class=\"first-journey__actions\">",
            "<button type=\"button\" class=\"first-journey__primary\" data-first-journey-enter-forest>Entrer dans l'Oeuvre immersive</button>",
            "<button type=\"button\" data-first-journey-territory>Retour au Territoire</button>",
            "<button type=\"button\" data-first-journey-free>Explorer librement</button>",
            "</div>",
            "</section>"
        ].join("");
        state.root.querySelector("[data-first-journey-enter-forest]").addEventListener("click", finishAndClear);
        state.root.querySelector("[data-first-journey-territory]").addEventListener("click", returnToTerritory);
        state.root.querySelector("[data-first-journey-free]").addEventListener("click", finishAndClear);
    }

    function finishAndClear() {
        finishJourney();
        clearRoot();
    }

    function returnToTerritory() {
        finishJourney();
        clearRoot();
        navigateTo("e01_accueil");
    }

    function syncScreen(screenId, renderer) {
        if (state.currentScreen !== screenId && !state.syncingScreen) {
            state.syncingScreen = true;
            window.setTimeout(() => {
                navigateTo(screenId);
                state.syncingScreen = false;
                if (renderer) renderer();
            }, 0);
            return false;
        }
        return true;
    }

    function navigateTo(screenId) {
        if (typeof Navigation !== "undefined" && Navigation.goTo) {
            Navigation.goTo(screenId);
        }
    }

    function clearRoot() {
        document.body.classList.remove("first-journey-intro-ready");
        document.body.classList.remove("first-journey-active");
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
