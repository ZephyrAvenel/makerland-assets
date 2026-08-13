(function () {
    const ROOMS = {
        dialogue: {
            title: "Archives du Dialogue",
            why: "Cette salle rassemble les conversations, questions et intuitions qui montrent comment une idee devient progressivement un espace de recherche.",
            sections: [
                ["Dialogues fondateurs", "Les premiers echanges qui ont ouvert une direction.", "../archives/d002.html"],
                ["Conversations decisives", "Les moments ou une question a transforme le projet.", "../archives/d001.html"],
                ["Grandes questions", "Les formulations qui restent ouvertes et continuent de travailler.", "../archives/d008.html"],
                ["Intuitions", "Les fragments encore fragiles avant leur mise en forme.", "../archives/d003.html"],
                ["Fragments", "Les phrases qui pourront voyager vers d'autres lieux.", "../archives/d010.html"]
            ],
            documents: [
                ["D001", "Pourquoi les Recits Vivants", "../archives/d001.html"],
                ["D002", "Naissance de la pensee dialogique", "../archives/d002.html"]
            ],
            quote: "Le dialogue n'est pas un outil de reponse. C'est une chambre ou l'intuition apprend a se deplacer.",
            fragment: "Une question juste ne ferme pas le chemin. Elle lui donne une forme habitable."
        },
        cartographie: {
            title: "Archives Cartographiques",
            why: "Cette salle accueillera les cartes fondatrices, les cartes de livres, les polarites et les representations du territoire.",
            sections: [
                ["Cartes fondatrices", "Les premieres formes de l'architecture narrative.", "../archives/d004.html"],
                ["Cartes des livres", "Les relations propres a chaque oeuvre.", "../archives/d007.html"],
                ["Cartes conceptuelles", "Les concepts qui structurent les Recits Vivants.", "../archives/d003.html"],
                ["Cosmologie", "Les representations du territoire complet.", "../archives/d003.html"],
                ["Territoires", "Les lieux actuels et les espaces encore a relier.", "../archives/d006.html"]
            ],
            documents: [
                ["D003", "Naissance de la Cosmologie des Recits Vivants", "../archives/d003.html"],
                ["D004", "Naissance des Cartes Narratives", "../archives/d004.html"]
            ],
            quote: "Une carte vivante ne remplace pas le chemin. Elle donne envie d'y entrer.",
            fragment: "Relier deux lieux suffit parfois a faire apparaitre un monde."
        },
        images: {
            title: "Archives Visuelles",
            why: "Cette salle preparera l'accueil des prompts, essais visuels, versions rejetees, images retenues et couvertures.",
            sections: [
                ["Prompts", "Les formulations qui ont appele une image.", "../archives/d005.html"],
                ["Premiers essais", "Les images encore proches de l'intuition initiale.", "../archives/d006.html"],
                ["Versions rejetees", "Les pistes ecartees parce qu'elles ne servaient pas le lieu.", "../archives/d010.html"],
                ["Images retenues", "Les images qui ont trouve leur fonction narrative.", "../archives/d005.html"],
                ["Couvertures", "Les seuils visuels des livres et atlas.", "../archives/d007.html"]
            ],
            documents: [
                ["D005", "Naissance de l'Oeuvre immersive", "../archives/d005.html"],
                ["D006", "Naissance du Territoire des Recits Vivants", "../archives/d006.html"]
            ],
            quote: "Une image juste ne montre pas tout. Elle laisse le visiteur sentir ou il arrive.",
            fragment: "Le climat d'une image precede souvent le sens d'un texte."
        },
        clarification: {
            title: "Archives de Clarification",
            why: "Cette salle accueillera les brouillons, reecritures, comparaisons, clarifications et versions finales.",
            sections: [
                ["Brouillons", "Les formulations avant discernement.", "../archives/d002.html"],
                ["Reecritures", "Les passages successifs vers une phrase plus juste.", "../archives/d010.html"],
                ["Comparaisons", "Les avant/apres qui rendent visible le travail.", "../archives/d005.html"],
                ["Clarifications", "Les decisions editoriales qui retirent le bruit.", "../archives/d008.html"],
                ["Versions finales", "Les formes retenues apres maturation.", "../archives/d010.html"]
            ],
            documents: [
                ["D008", "Naissance de la Boussole Vivante", "../archives/d008.html"],
                ["D010", "Naissance des Archives Vivantes", "../archives/d010.html"]
            ],
            quote: "Clarifier, c'est choisir ce qui doit rester vivant lorsque tout le reste peut tomber.",
            fragment: "Une phrase devient juste lorsqu'elle cesse de vouloir convaincre."
        },
        evolution: {
            title: "Archives de l'Evolution",
            why: "Cette salle preparera la chronologie des versions, bifurcations, grandes etapes et gestes de transmission.",
            sections: [
                ["Chronologie", "Les jalons qui structurent l'histoire du projet.", "../archives/d006.html"],
                ["Grandes etapes", "Les moments ou les Recits Vivants ont change de nature.", "../archives/d009.html"],
                ["Versions", "Les iterations qui ont stabilise les lieux.", "../archives/d010.html"],
                ["Bifurcations", "Les choix qui ont ecarte certaines directions.", "../archives/d001.html"],
                ["Transmission", "Les passages vers les lecteurs et la Constellation.", "../archives/d007.html"]
            ],
            documents: [
                ["D006", "Naissance du Territoire des Recits Vivants", "../archives/d006.html"],
                ["D009", "Naissance de l'Atelier des Recits", "../archives/d009.html"]
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
            const link = components.createElement("a", "archive-explore", "Explorer");
            link.href = section[2];
            link.setAttribute("aria-label", "Explorer la rubrique " + section[0]);
            item.appendChild(summary);
            item.appendChild(text);
            item.appendChild(link);
            details.appendChild(item);
        });

        return details;
    }

    function createDocumentModels(room) {
        const components = window.ArchiveComponents;
        const grid = components.createElement("div", "archive-model-grid");

        (room.documents || []).forEach(item => {
            grid.appendChild(components.createArchiveCard({
                title: item[1],
                type: item[0],
                date: "Volume I",
                origin: room.title,
                status: "Consultable",
                summary: "Archive reliee a cette chambre de l'Atelier.",
                href: item[2],
                linkLabel: "Explorer"
            }));
        });

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
            origin: "Atelier des Recits",
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
        host.appendChild(createSummary(ROOMS.dialogue));
        host.appendChild(createDocumentModels(ROOMS.dialogue));
        host.appendChild(fragments);
        host.appendChild(components.createTimeline([
            { date: "Dialogue", title: "La conversation commence", text: "Une question ouvre un espace de recherche." },
            { date: "Narratologie dialogique", title: "Le cadre se formule", text: "Le dialogue devient une maniere de penser les recits." },
            { date: "Atlas", title: "Les idees deviennent cartes", text: "Les concepts trouvent une forme territoriale." },
            { date: "Oeuvre immersive", title: "Le lecteur entre dans le lieu", text: "La lecture devient traversee." },
            { date: "Territoire", title: "Les lieux se relient", text: "Bibliotheque, Boussole, Atelier et Constellation forment un territoire." },
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
