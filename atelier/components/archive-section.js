(function () {
    const ROOMS = {
        dialogue: {
            title: "Archives du Dialogue",
            why: "Cette salle rassemble les conversations, questions et intuitions qui montrent comment une idee devient progressivement un espace de recherche.",
            sections: [
                ["Dialogues fondateurs", "Les premiers echanges qui ont ouvert une direction."],
                ["Conversations decisives", "Les moments ou une question a transforme le projet."],
                ["Grandes questions", "Les formulations qui restent ouvertes et continuent de travailler."],
                ["Intuitions", "Les fragments encore fragiles avant leur mise en forme."],
                ["Fragments", "Les phrases qui pourront voyager vers d'autres lieux."]
            ],
            quote: "Le dialogue n'est pas un outil de reponse. C'est une chambre ou l'intuition apprend a se deplacer.",
            fragment: "Une question juste ne ferme pas le chemin. Elle lui donne une forme habitable."
        },
        cartographie: {
            title: "Archives Cartographiques",
            why: "Cette salle accueillera les cartes fondatrices, les cartes de livres, les polarites et les representations du territoire.",
            sections: [
                ["Cartes fondatrices", "Les premieres formes de l'architecture narrative."],
                ["Cartes des livres", "Les relations propres a chaque oeuvre."],
                ["Cartes conceptuelles", "Les concepts qui structurent les Recits Vivants."],
                ["Cosmologie", "Les representations du territoire complet."],
                ["Territoires", "Les lieux actuels et les espaces encore a relier."]
            ],
            quote: "Une carte vivante ne remplace pas le chemin. Elle donne envie d'y entrer.",
            fragment: "Relier deux lieux suffit parfois a faire apparaitre un monde."
        },
        images: {
            title: "Archives Visuelles",
            why: "Cette salle preparera l'accueil des prompts, essais visuels, versions rejetees, images retenues et couvertures.",
            sections: [
                ["Prompts", "Les formulations qui ont appele une image."],
                ["Premiers essais", "Les images encore proches de l'intuition initiale."],
                ["Versions rejetees", "Les pistes ecartees parce qu'elles ne servaient pas le lieu."],
                ["Images retenues", "Les images qui ont trouve leur fonction narrative."],
                ["Couvertures", "Les seuils visuels des livres et atlas."]
            ],
            quote: "Une image juste ne montre pas tout. Elle laisse le visiteur sentir ou il arrive.",
            fragment: "Le climat d'une image precede souvent le sens d'un texte."
        },
        clarification: {
            title: "Archives de Clarification",
            why: "Cette salle accueillera les brouillons, reecritures, comparaisons, clarifications et versions finales.",
            sections: [
                ["Brouillons", "Les formulations avant discernement."],
                ["Reecritures", "Les passages successifs vers une phrase plus juste."],
                ["Comparaisons", "Les avant/apres qui rendent visible le travail."],
                ["Clarifications", "Les decisions editoriales qui retirent le bruit."],
                ["Versions finales", "Les formes retenues apres maturation."]
            ],
            quote: "Clarifier, c'est choisir ce qui doit rester vivant lorsque tout le reste peut tomber.",
            fragment: "Une phrase devient juste lorsqu'elle cesse de vouloir convaincre."
        },
        evolution: {
            title: "Archives de l'Evolution",
            why: "Cette salle preparera la chronologie des versions, bifurcations, grandes etapes et gestes de transmission.",
            sections: [
                ["Chronologie", "Les jalons qui structurent l'histoire du projet."],
                ["Grandes etapes", "Les moments ou Makerland a change de nature."],
                ["Versions", "Les iterations qui ont stabilise les lieux."],
                ["Bifurcations", "Les choix qui ont ecarte certaines directions."],
                ["Transmission", "Les passages vers les lecteurs et la Constellation."]
            ],
            quote: "Une oeuvre vivante avance moins par ajout que par fidelite progressive a ce qu'elle pressent.",
            fragment: "Chaque version laisse une trace, meme lorsqu'elle disparait de l'ecran."
        }
    };

    function createSummary(room) {
        const components = window.ArchiveComponents;
        const details = components.createElement("div", "archive-summary");

        room.sections.forEach(section => {
            const item = components.createElement("details", "archive-summary__item");
            const summary = components.createElement("summary", "", section[0]);
            const text = components.createElement("p", "", section[1]);
            const button = components.createElement("button", "archive-explore", "Explorer");
            button.type = "button";
            button.setAttribute("aria-label", "Explorer la rubrique " + section[0]);
            item.appendChild(summary);
            item.appendChild(text);
            item.appendChild(button);
            details.appendChild(item);
        });

        return details;
    }

    function createDocumentModels(room) {
        const components = window.ArchiveComponents;
        const grid = components.createElement("div", "archive-model-grid");

        [
            {
                title: "Modele de document",
                type: "Document",
                date: "Date future",
                origin: "Atelier IA",
                summary: "Ce modele pourra accueillir un titre, une date, un type, une origine, un resume et un lien."
            },
            {
                title: "Entree documentaire",
                type: "Archive",
                date: "A renseigner",
                origin: room.title,
                summary: "Chaque entree pourra etre ajoutee sans reconstruire l'architecture de la salle.",
                href: "#",
                linkLabel: "Explorer"
            }
        ].forEach(item => grid.appendChild(components.createArchiveCard(item)));

        return grid;
    }

    function createTimelineAndGallery(room) {
        const components = window.ArchiveComponents;
        const group = components.createElement("div", "archive-two-columns");
        group.appendChild(components.createTimeline([
            { date: "Etape 1", title: "Depot", text: "L'archive est identifiee et reliee a une salle." },
            { date: "Etape 2", title: "Lecture", text: "Elle est contextualisee pour rester comprehensible." },
            { date: "Etape 3", title: "Transmission", text: "Elle peut rejoindre un livre, une carte ou une resonance." }
        ]));
        group.appendChild(components.createGallery([
            { label: "Image", caption: "Emplacement pour une image, un schema ou une comparaison." },
            { label: "Carte", caption: "Emplacement pour une carte narrative ou un croquis." }
        ]));
        return group;
    }

    function createDialogueArchive(host) {
        const components = window.ArchiveComponents;
        const intro = components.createArchiveCard({
            title: "Le dialogue comme atelier de pensee",
            type: "Dialogue fondateur",
            date: "Archive vivante",
            origin: "Atelier IA",
            status: "Ouvert",
            summary: [
                "Les Recits Vivants ne sont pas nes d'une reponse instantanee.",
                "Ils se sont construits au fil de milliers d'echanges, d'hypotheses, de doutes, de reformulations et d'intuitions.",
                "Cette salle presente quelques fragments de cette conversation continue entre un auteur et une intelligence artificielle."
            ].join(" ")
        });
        const fragments = components.createElement("section", "archive-dialogue-block");
        const fragmentGrid = components.createElement("div", "archive-fragment-grid");
        const quotes = components.createElement("section", "archive-dialogue-block");
        const quoteGrid = components.createElement("div", "archive-quote-grid");

        fragments.appendChild(components.createElement("h2", "", "Fragments de conversations"));
        [
            {
                type: "Fragment 001",
                text: "Question : Comment rendre un recit habitable ? Emergence : Peut-etre qu'un recit ne cherche pas a convaincre. Il cherche a devenir un lieu ou quelqu'un peut demeurer."
            },
            {
                type: "Fragment 002",
                text: "Question : Pourquoi les Recits Vivants ? Emergence : Parce qu'ils ne cherchent pas a enfermer le monde dans une histoire unique."
            },
            {
                type: "Fragment 003",
                text: "Question : Et si l'IA devenait un compagnon de recherche plutot qu'une autorite ? Emergence : Le dialogue devient alors un espace ou chacun transforme sa comprehension."
            }
        ].forEach(fragment => {
            fragmentGrid.appendChild(components.createFragment(fragment));
        });
        fragments.appendChild(fragmentGrid);

        quotes.appendChild(components.createElement("h2", "", "Citations"));
        [
            "Une oeuvre n'est jamais completement terminee. Elle change avec celui qui la rencontre.",
            "Les recits vivants ne sont pas produits. Ils sont cultives.",
            "L'IA n'ecrit pas a ma place. Elle m'aide a explorer des possibles."
        ].forEach(text => {
            quoteGrid.appendChild(components.createQuote({ text }));
        });
        quotes.appendChild(quoteGrid);

        host.appendChild(intro);
        host.appendChild(fragments);
        host.appendChild(components.createTimeline([
            { date: "Dialogue", title: "La conversation commence", text: "Une question ouvre un espace de recherche." },
            { date: "Narratologie dialogique", title: "Le cadre se formule", text: "Le dialogue devient une maniere de penser les recits." },
            { date: "Atlas", title: "Les idees deviennent cartes", text: "Les concepts trouvent une forme territoriale." },
            { date: "Oeuvre immersive", title: "Le lecteur entre dans le lieu", text: "La lecture devient traversee." },
            { date: "Makerland", title: "Les lieux se relient", text: "Bibliotheque, Boussole, Atelier et Constellation forment un territoire." },
            { date: "Archives Vivantes", title: "La creation garde ses traces", text: "Les fragments deviennent consultables sans perdre leur mystere." }
        ]));
        host.appendChild(quotes);
        host.appendChild(components.createNavigation("dialogue"));
    }

    function init() {
        const host = document.querySelector("[data-archive-room]");
        const components = window.ArchiveComponents;

        if (!host || !components) {
            return;
        }

        const id = host.dataset.archiveRoom;
        const room = ROOMS[id];

        if (!room) {
            return;
        }

        if (id === "dialogue") {
            createDialogueArchive(host);
            return;
        }

        const header = components.createElement("header", "archive-header");
        header.appendChild(components.createElement("span", "archive-meta", "Archives Vivantes"));
        header.appendChild(components.createElement("h2", "", room.title));
        header.appendChild(components.createElement("p", "", room.why));

        const why = components.createElement("article", "archive-why placeholder-card");
        why.appendChild(components.createElement("h2", "", "Pourquoi cette salle ?"));
        why.appendChild(components.createElement("p", "", room.why));

        host.appendChild(header);
        host.appendChild(why);
        host.appendChild(createSummary(room));
        host.appendChild(createDocumentModels(room));
        host.appendChild(components.createQuote({ text: room.quote }));
        host.appendChild(components.createFragment({ text: room.fragment }));
        host.appendChild(createTimelineAndGallery(room));
        host.appendChild(components.createNavigation(id));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
