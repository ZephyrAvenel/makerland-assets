(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    function createQuote(quote) {
        const createElement = window.ArchiveComponents.createElement;
        const figure = createElement("figure", "archive-quote");
        const blockquote = createElement("blockquote", "", quote.text);

        figure.appendChild(blockquote);

        if (quote.source) {
            figure.appendChild(createElement("figcaption", "", quote.source));
        }

        return figure;
    }

    window.ArchiveComponents.createQuote = createQuote;
})();
