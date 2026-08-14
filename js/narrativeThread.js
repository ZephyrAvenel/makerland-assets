(function () {
    const PLACES = {
        e01_accueil: {
            id: "accueil",
            name: "Accueil",
            role: "Ici commence la traversee.",
            why: "Ce seuil vous aide a choisir comment entrer dans les Recits Vivants.",
            next: [
                ["Commencer par la Meteo", "e02_meteo"],
                ["Faire le Premier Voyage", "first"]
            ]
        },
        e02_meteo: {
            id: "meteo",
            name: "Le Seuil des Climats",
            role: "Une premiere rencontre.",
            why: "Cette salle ne juge pas votre etat. Elle aide simplement la Boussole a vous accueillir.",
            next: [["Continuer vers la Boussole", "e03_boussole"]]
        },
        e03_boussole: {
            id: "boussole",
            name: "Boussole Vivante",
            role: "Ici une direction peut apparaitre sans jamais s'imposer.",
            why: "La Boussole relie votre premiere impression aux grands lieux du territoire.",
            next: [
                ["Explorer les cartes", "e05_cartes"],
                ["Entrer dans l'Atelier", "e07_atelier"],
                ["Voir la Constellation", "e08_constellation"]
            ]
        },
        e05_cartes: {
            id: "cartes",
            name: "Cartes Narratives",
            role: "Ici les idees deviennent des chemins.",
            why: "Les cartes montrent que chaque concept peut devenir un territoire a explorer.",
            next: [
                ["Ouvrir la Bibliotheque", "e06_fiction"],
                ["Revenir a la Boussole", "e03_boussole"]
            ]
        },
        e06_fiction: {
            id: "bibliotheque",
            name: "Bibliotheque Vivante",
            role: "Ici vivent les oeuvres publiees.",
            why: "La Bibliotheque rassemble les oeuvres achevees, mais chacune garde un lien avec sa naissance.",
            next: [
                ["Voir les coulisses", "e07_atelier"],
                ["Chercher les liens", "e08_constellation"]
            ]
        },
        e06_essais: {
            id: "bibliotheque",
            name: "Bibliotheque Vivante",
            role: "Ici les essais prolongent les oeuvres.",
            why: "Cette salle garde les textes qui ouvrent les questions au lieu de les fermer.",
            next: [["Entrer dans l'Atelier", "e07_atelier"]]
        },
        e07_atelier: {
            id: "atelier",
            name: "Atelier des Recits",
            role: "La ou les oeuvres prennent forme.",
            why: "Cette salle montre comment les dialogues deviennent progressivement des oeuvres.",
            next: [
                ["Ouvrir les Archives", "archive"],
                ["Voir la Constellation", "e08_constellation"]
            ]
        },
        e08_constellation: {
            id: "constellation",
            name: "Constellation",
            role: "Ici apparaissent les liens entre les oeuvres.",
            why: "La Constellation revele comment archives, images, concepts et lecteurs se repondent.",
            next: [
                ["Ouvrir le Carnet", "carnet"],
                ["Retourner a l'Atelier", "e07_atelier"]
            ]
        },
        e09_voyage: {
            id: "carnet",
            name: "Carnet de Voyage",
            role: "Ici se poursuit votre propre voyage.",
            why: "Le Carnet garde une trace locale de ce que vous avez traverse, sans mesurer ni classer.",
            next: [
                ["Revenir a la Bibliotheque", "e06_fiction"],
                ["Explorer les liens", "e08_constellation"]
            ]
        },
        e04_oeuvre: {
            id: "oeuvre",
            name: "Foret de l'Arche",
            role: "Ici une oeuvre devient un passage.",
            why: "La Foret prepare le franchissement vers une lecture immersive.",
            next: [
                ["Revenir a la Boussole", "e03_boussole"],
                ["Chercher les liens", "e08_constellation"]
            ]
        }
    };

    const TRANSITIONS = {
        "bibliotheque>atelier": "Derriere chaque oeuvre existe un atelier.",
        "atelier>archive": "Chaque creation laisse une memoire.",
        "atelier>constellation": "Les coulisses commencent a reveler leurs liens.",
        "archive>constellation": "Les memoires revelent des liens invisibles.",
        "constellation>carnet": "Chaque rencontre devient une trace de votre voyage.",
        "boussole>cartes": "Une direction devient une premiere carte.",
        "cartes>bibliotheque": "Les cartes ouvrent vers les oeuvres.",
        "boussole>atelier": "Une intention peut rejoindre les coulisses de la creation.",
        "boussole>constellation": "Chercher un repere, c'est deja suivre un lien."
    };

    const MAP = [
        ["bibliotheque", "Bibliotheque"],
        ["atelier", "Atelier"],
        ["archive", "Archives"],
        ["constellation", "Constellation"],
        ["carnet", "Carnet"]
    ];

    const TRANSITION_VISIBLE_DURATION = 7200;
    const TRANSITION_FADE_DURATION = 650;

    let root = null;
    let lastPlace = null;
    let transitionElement = null;
    let transitionTimer = null;
    let transitionDismissalBound = false;

    function init() {
        ensureRoot();
        bindTransitionDismissal();
        window.addEventListener("screenChanged", event => {
            render(event.detail.screen);
        });
        render("e01_accueil");
    }

    function ensureRoot() {
        if (root) return;
        root = document.createElement("div");
        root.className = "narrative-thread";
        root.setAttribute("data-narrative-thread", "");
        root.setAttribute("aria-live", "polite");
        document.getElementById("app").appendChild(root);
    }

    function render(screenId) {
        const place = resolvePlace(screenId);
        if (!root || !place) {
            clear();
            lastPlace = place;
            return;
        }

        const previousPlace = lastPlace;
        lastPlace = place;

        if (screenId === "e01_accueil" || screenId === "e02_meteo") {
            clear();
            return;
        }

        root.innerHTML = [
            renderRole(place),
            renderWhy(place),
            renderMap(place),
            renderNext(place)
        ].join("");
        bindActions();
        showTransition(previousPlace, place);
    }

    function resolvePlace(screenId) {
        return PLACES[screenId] || null;
    }

    function renderRole(place) {
        return [
            "<aside class=\"narrative-thread__role\" aria-label=\"Role du lieu\">",
            "<span class=\"narrative-thread__kicker\">Lieu vivant</span>",
            `<strong>${escapeHtml(place.name)}</strong>`,
            `<span>${escapeHtml(place.role)}</span>`,
            "</aside>"
        ].join("");
    }

    function renderWhy(place) {
        return [
            "<aside class=\"narrative-thread__why\" aria-label=\"Pourquoi cette salle\">",
            "<strong>Pourquoi cette salle ?</strong>",
            `<p>${escapeHtml(place.why)}</p>`,
            "</aside>"
        ].join("");
    }

    function renderMap(place) {
        return [
            "<aside class=\"narrative-thread__map\" aria-label=\"Carte du territoire\">",
            "<p class=\"narrative-thread__map-title\">Le territoire</p>",
            "<div class=\"narrative-thread__map-grid\">",
            MAP.map(item => `<span class="narrative-thread__map-node${item[0] === place.id ? " is-current" : ""}">${escapeHtml(item[1])}</span>`).join(""),
            "</div>",
            "</aside>"
        ].join("");
    }

    function renderNext(place) {
        if (!place.next || !place.next.length) return "";
        return [
            "<aside class=\"narrative-thread__next\" aria-label=\"Continuer le voyage\">",
            "<strong>Vous pouvez maintenant :</strong>",
            "<div class=\"narrative-thread__next-actions\">",
            place.next.map(next => `<button type="button" data-thread-target="${escapeHtml(next[1])}">${escapeHtml(next[0])}</button>`).join(""),
            "</div>",
            "</aside>"
        ].join("");
    }

    function bindActions() {
        root.querySelectorAll("[data-thread-target]").forEach(button => {
            button.addEventListener("click", () => openTarget(button.dataset.threadTarget));
        });
    }

    function openTarget(target) {
        if (target === "first") {
            document.dispatchEvent(new CustomEvent("makerland:firstJourney:start"));
            return;
        }

        if (target === "archive") {
            window.location.href = "atelier/archives/";
            return;
        }

        if (target === "carnet") {
            window.location.href = "carnet/";
            return;
        }

        if (typeof Navigation !== "undefined" && Navigation.goTo) {
            Navigation.goTo(target);
        }
    }

    function showTransition(from, to) {
        if (!from || !to || from.id === to.id) return;
        const message = TRANSITIONS[from.id + ">" + to.id];
        if (!message) return;

        dismissTransition(true);
        const transition = document.createElement("aside");
        transition.className = "narrative-thread__transition";
        transition.innerHTML = `<p>${escapeHtml(message)}</p>`;
        root.appendChild(transition);
        transitionElement = transition;
        window.requestAnimationFrame(() => {
            transition.classList.add("is-visible");
        });
        transitionTimer = window.setTimeout(() => {
            dismissTransition(false);
        }, TRANSITION_VISIBLE_DURATION);
    }

    function bindTransitionDismissal() {
        if (transitionDismissalBound) return;
        transitionDismissalBound = true;

        document.addEventListener("pointerdown", dismissTransitionOnInteraction, { capture: true, passive: true });
        document.addEventListener("touchstart", dismissTransitionOnInteraction, { capture: true, passive: true });
        document.addEventListener("wheel", dismissTransitionOnInteraction, { capture: true, passive: true });
        window.addEventListener("scroll", dismissTransitionOnInteraction, { capture: true, passive: true });
        document.addEventListener("keydown", dismissTransitionOnInteraction, true);
    }

    function dismissTransitionOnInteraction() {
        dismissTransition(false);
    }

    function dismissTransition(immediate) {
        if (transitionTimer) {
            window.clearTimeout(transitionTimer);
            transitionTimer = null;
        }

        if (!transitionElement) return;

        const transition = transitionElement;
        transitionElement = null;

        if (immediate) {
            transition.remove();
            return;
        }

        transition.classList.remove("is-visible");
        transition.classList.add("is-dismissing");
        window.setTimeout(() => {
            transition.remove();
        }, TRANSITION_FADE_DURATION);
    }

    function clear() {
        dismissTransition(true);
        if (root) root.innerHTML = "";
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
