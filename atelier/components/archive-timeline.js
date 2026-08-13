(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    function createTimeline(items) {
        const createElement = window.ArchiveComponents.createElement;
        const timeline = createElement("div", "archive-timeline");

        items.forEach(item => {
            const node = createElement("article", "archive-timeline__item");
            node.appendChild(createElement("span", "archive-meta", item.date || "A venir"));
            node.appendChild(createElement("h3", "", item.title));
            node.appendChild(createElement("p", "", item.text));
            timeline.appendChild(node);
        });

        return timeline;
    }

    window.ArchiveComponents.createTimeline = createTimeline;
})();
