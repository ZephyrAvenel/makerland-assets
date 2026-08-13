(function () {
    const KEY = "makerland:living-cycle";
    const FRAGMENT_KEY = "makerland:traveling-fragment:last";

    const RESONANCES = {
        "atelier:atelier": {
            intro: "L'Atelier ouvre plusieurs chemins vers les lieux ou les oeuvres continuent.",
            links: [
                ["Dialoguer", "dialogue/"],
                ["Cartographier", "cartographie/"],
                ["Constellation", "../constellation/"]
            ]
        },
        "atelier:dialogue": {
            intro: "Cette conversation pourrait se poursuivre dans la Constellation.",
            links: [
                ["Cartographie", "../cartographie/"],
                ["Transmission", "../../constellation/transmission/"],
                ["Carnet", "../../carnet/"]
            ],
            fragment: "Une question juste agrandit parfois le paysage."
        },
        "atelier:cartographie": {
            intro: "Certaines cartes deviennent des chemins.",
            links: [
                ["Chemin", "../../constellation/chemin/"],
                ["Fonctionnement", "../../constellation/fonctionnement/"],
                ["Dialogue", "../dialogue/"]
            ],
            fragment: "Relier, c'est deja commencer a habiter."
        },
        "atelier:images": {
            intro: "Une image peut rejoindre plus tard un fragment, un carnet ou une oeuvre.",
            links: [
                ["Clarification", "../clarification/"],
                ["Carnet", "../../carnet/"],
                ["Constellation", "../../constellation/"]
            ],
            fragment: "Certaines images gardent la lumiere d'une intuition."
        },
        "atelier:clarification": {
            intro: "Ce qui se clarifie ici peut ensuite etre transmis ailleurs.",
            links: [
                ["Dialogue", "../dialogue/"],
                ["Evolution", "../evolution/"],
                ["Transmission", "../../constellation/transmission/"]
            ],
            fragment: "Clarifier, c'est laisser une phrase respirer."
        },
        "atelier:evolution": {
            intro: "Une oeuvre qui evolue finit souvent par chercher un lecteur.",
            links: [
                ["Transmission", "../../constellation/transmission/"],
                ["Constellation", "../../constellation/"],
                ["Carnet", "../../carnet/"]
            ],
            fragment: "Rien n'est completement termine lorsque le regard reste vivant."
        },
        "constellation:constellation": {
            intro: "La Constellation renvoie vers les coulisses de ce qui l'a nourrie.",
            links: [
                ["Atelier", "../atelier/"],
                ["Transmission", "transmission/"],
                ["Carnet", "../carnet/"]
            ]
        },
        "constellation:chemin": {
            intro: "Un chemin peut redevenir une carte.",
            links: [
                ["Cartographie", "../../atelier/cartographie/"],
                ["Carnet", "../../carnet/"],
                ["Fonctionnement", "../fonctionnement/"]
            ]
        },
        "constellation:fonctionnement": {
            intro: "Ce qui se relie ici peut ensuite circuler.",
            links: [
                ["Transmission", "../transmission/"],
                ["Atelier", "../../atelier/"],
                ["Carnet", "../../carnet/"]
            ]
        },
        "constellation:transmission": {
            intro: "Ce qui est transmis est souvent ne dans l'Atelier.",
            links: [
                ["Evolution", "../../atelier/evolution/"],
                ["Dialogue", "../../atelier/dialogue/"],
                ["Carnet", "../../carnet/"]
            ],
            fragment: "Transmettre, c'est laisser une porte disponible."
        },
        "constellation:temoignages": {
            intro: "Chaque temoignage peut devenir une nouvelle etoile du voyage.",
            links: [
                ["Carnet", "../../carnet/"],
                ["Chemin", "../chemin/"],
                ["Atelier", "../../atelier/"]
            ]
        },
        "carnet:carnet": {
            intro: "Le Carnet rassemble ce qui reste disponible pour de prochains passages.",
            links: [
                ["Atelier", "../atelier/"],
                ["Constellation", "../constellation/"],
                ["Transmission", "../constellation/transmission/"]
            ]
        }
    };

    function readMemory() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeMemory(memory) {
        try {
            localStorage.setItem(KEY, JSON.stringify(memory));
        } catch (error) {
            return;
        }
    }

    function currentId() {
        const type = document.body.dataset.cycleType;
        const page =
            document.body.dataset.cyclePage ||
            document.body.dataset.journalPage;

        if (document.body.classList.contains("travel-journal")) {
            return "carnet:carnet";
        }

        return type && page ? type + ":" + page : "";
    }

    function createSection(title, className) {
        const section = document.createElement("section");
        section.className = "room-section " + className;
        section.innerHTML = "<h2>" + title + "</h2>";
        return section;
    }

    function appendBeforeReturn(section) {
        const main = document.querySelector("main");

        if (!main) {
            return;
        }

        const firstDirectReturn = Array.from(main.children).find(child =>
            child.classList.contains("placeholder-return")
        );

        main.insertBefore(section, firstDirectReturn || null);
    }

    function renderCards(config) {
        if (!config || !config.links || !config.links.length) {
            return;
        }

        const section = createSection("Cette idee resonne avec", "place-resonance");
        const intro = document.createElement("p");
        intro.textContent = config.intro;
        section.appendChild(intro);

        const grid = document.createElement("div");
        grid.className = "resonance-grid";
        config.links.forEach(link => {
            const card = document.createElement("a");
            card.className = "resonance-card";
            card.href = link[1];
            card.innerHTML = "<span>&#9678;</span><strong>" + link[0] + "</strong>";
            grid.appendChild(card);
        });

        section.appendChild(grid);
        appendBeforeReturn(section);
    }

    function renderPersonalConstellation(memory) {
        const places = Array.isArray(memory.visitedPlaces)
            ? memory.visitedPlaces.slice(-5)
            : [];

        if (places.length < 2) {
            return;
        }

        const section = createSection(
            "Votre constellation actuelle",
            "personal-constellation"
        );
        const path = document.createElement("div");
        path.className = "personal-constellation__path";

        places.forEach(place => {
            const node = document.createElement("span");
            node.textContent = place.label || place.id;
            path.appendChild(node);
        });

        section.appendChild(path);
        appendBeforeReturn(section);
    }

    function renderTravelingFragment(config, memory) {
        if (!config || !config.fragment || Math.random() > 0.18) {
            return;
        }

        const last = localStorage.getItem(FRAGMENT_KEY);
        if (last === config.fragment) {
            return;
        }

        localStorage.setItem(FRAGMENT_KEY, config.fragment);
        memory.travelingFragments = Array.isArray(memory.travelingFragments)
            ? memory.travelingFragments
            : [];

        if (!memory.travelingFragments.includes(config.fragment)) {
            memory.travelingFragments.push(config.fragment);
            writeMemory(memory);
        }

        const aside = document.createElement("aside");
        aside.className = "traveling-fragment";
        aside.textContent = config.fragment;
        appendBeforeReturn(aside);
    }

    function renderThreads() {
        const section = document.querySelector(".place-resonance");
        if (!section) {
            return;
        }

        const threads = document.createElement("div");
        threads.className = "resonance-threads";
        threads.setAttribute("aria-hidden", "true");
        threads.innerHTML = "<span></span><span></span><span></span>";
        section.appendChild(threads);
    }

    function init() {
        const id = currentId();
        const config = RESONANCES[id];
        const memory = readMemory();

        renderCards(config);
        renderPersonalConstellation(memory);
        renderTravelingFragment(config, memory);
        renderThreads();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
