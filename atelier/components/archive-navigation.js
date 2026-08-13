(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    const ROOMS = [
        ["dialogue", "Dialoguer", "../dialogue/"],
        ["cartographie", "Cartographier", "../cartographie/"],
        ["images", "Imaginer", "../images/"],
        ["clarification", "Clarifier", "../clarification/"],
        ["evolution", "Evoluer", "../evolution/"]
    ];

    function createNavigation(currentRoom) {
        const createElement = window.ArchiveComponents.createElement;
        const nav = createElement("nav", "archive-navigation");
        nav.setAttribute("aria-label", "Navigation interne des archives de l'Atelier");
        nav.appendChild(createElement("h2", "", "Explorer les autres salles"));

        const list = createElement("div", "archive-navigation__links");
        ROOMS.forEach(room => {
            const link = createElement("a", "", room[1]);
            link.href = room[2];

            if (room[0] === currentRoom) {
                link.setAttribute("aria-current", "page");
            }

            list.appendChild(link);
        });

        nav.appendChild(list);
        return nav;
    }

    window.ArchiveComponents.createNavigation = createNavigation;
})();
