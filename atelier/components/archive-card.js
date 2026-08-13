(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    }

    function createArchiveCard(item) {
        const card = createElement("article", "archive-card");
        const meta = createElement("span", "archive-meta", item.type || "Archive");
        const title = createElement("h3", "", item.title);
        const summary = createElement("p", "", item.summary);
        const details = createElement("dl", "archive-details");

        [
            ["Volume", item.date || "A documenter"],
            ["Origine", item.origin || "Archive vivante"],
            ["Statut", item.status || "A enrichir"]
        ].forEach(pair => {
            const term = createElement("dt", "", pair[0]);
            const description = createElement("dd", "", pair[1]);
            details.appendChild(term);
            details.appendChild(description);
        });

        card.appendChild(meta);
        card.appendChild(title);
        card.appendChild(summary);
        card.appendChild(details);

        if (item.href) {
            const link = createElement("a", "archive-link", item.linkLabel || "Explorer");
            link.href = item.href;
            card.appendChild(link);
        }

        return card;
    }

    window.ArchiveComponents.createElement = createElement;
    window.ArchiveComponents.createArchiveCard = createArchiveCard;
})();
