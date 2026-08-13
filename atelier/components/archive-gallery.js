(function () {
    window.ArchiveComponents = window.ArchiveComponents || {};

    function createGallery(items) {
        const createElement = window.ArchiveComponents.createElement;
        const gallery = createElement("div", "archive-gallery");

        items.forEach(item => {
            const figure = createElement("figure", "archive-gallery__item");
            const frame = createElement("div", "archive-gallery__frame", item.label || "Image");
            const caption = createElement("figcaption", "", item.caption);
            figure.appendChild(frame);
            figure.appendChild(caption);
            gallery.appendChild(figure);
        });

        return gallery;
    }

    window.ArchiveComponents.createGallery = createGallery;
})();
