(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    function createFragment(fragment) {
        const createElement = window.ArchiveComponents.createElement;
        const card = createElement("article", "archive-fragment");
        card.appendChild(createElement("span", "archive-meta", fragment.type || "Fragment"));
        card.appendChild(createElement("p", "", fragment.text));
        return card;
    }

    window.ArchiveComponents.createFragment = createFragment;
})();
