/****************************************************
MAKERLAND V3.0-C
bookRenderer.js
****************************************************/

const Books = {

data: null,

layout: null,

extensions: null,

rooms: [

    {
        screenId: "e06_fiction",
        containerId: "fiction-container",
        category: "fiction",
        title: "Fictions symboliques",
        previous: null,
        next: "e06_essais"
    },

    {
        screenId: "e06_essais",
        containerId: "essais-container",
        category: "essais",
        title: "Essais",
        previous: "e06_fiction",
        next: "e06_atlas"
    },

    {
        screenId: "e06_atlas",
        containerId: "atlas-container",
        category: "atlas",
        title: "Atlas des Recits Vivants",
        previous: "e06_essais",
        next: "e06_portes"
    },

    {
        screenId: "e06_portes",
        containerId: "portes-container",
        category: "portes_ouvertes",
        title: "Ressources",
        previous: "e06_atlas",
        next: null
    }

],

async load() {

    try {

        const [
            booksResponse,
            layoutResponse,
            extensionsResponse
        ] = await Promise.all([

            fetch(
                "data/livres-v2.json"
            ),

            fetch(
                "data/library-layout.json"
            ),

            fetch(
                "data/library-extensions.json"
            )

        ]);

        this.data =
            await booksResponse.json();

        this.layout =
            await layoutResponse.json();

        this.extensions =
            await extensionsResponse.json();

        console.log(
            "Bibliotheque chargee"
        );

        return this.data;

    } catch (error) {

        console.error(
            "Erreur chargement bibliotheque",
            error
        );

    }

},

getAll() {

    return this.data.resources;

},

getByCategory(category) {

    return this.data.resources.filter(
        book => book.category === category
    );

},

getFeatured() {

    return this.data.resources.filter(
        book => book.featured === true
    );

},

getById(id) {

    return this.data.resources.find(
        book => book.id === id
    );

},

getRoomByCategory(category) {

    return this.rooms.find(
        room => room.category === category
    );

},

getLayout(category) {

    return (
        this.layout &&
        this.layout.rooms &&
        this.layout.rooms[category]
    ) || null;

},

renderCategory(category, containerId) {

    const room =
        this.getRoomByCategory(
            category
        ) || {
            category,
            containerId,
            title: category,
            previous: null,
            next: null
        };

    this.renderRoom(
        {
            ...room,
            containerId
        }
    );

},

renderLibrary() {

    this.rooms.forEach(
        room => {

            this.renderRoom(
                room
            );

        }
    );

    this.renderExtensionLibrary();

},

renderRoom(room) {

    const container =
        document.getElementById(
            room.containerId
        );

    const layout =
        this.getLayout(
            room.category
        );

    if (
        !container ||
        !layout
    ) return;

    container.innerHTML =
        "";

    container.className =
        "books-container living-library-room";

    container.dataset.room =
        room.category;

    const contentZone =
        document.createElement(
            "div"
        );

    contentZone.className =
        "living-library-content-zone";

    this.applyImageBox(
        contentZone,
        layout.contentZone
    );

    const books =
        this.getByCategory(
            room.category
        );

    books.forEach(
        (book, index) => {

            const slot =
                layout.slots[index];

            if (!slot) return;

            contentZone.appendChild(
                this.renderBook(
                    book,
                    slot
                )
            );

        }
    );

    contentZone.appendChild(
        this.renderRoomNavigation(
            room,
            layout.navigation
        )
    );

    container.appendChild(
        contentZone
    );

    if (!room.next) {

        container.appendChild(
            this.renderVisitEnd()
        );

    }

},

renderBook(
    book,
    slot
) {

    const displayTitle =
        this.getDisplayTitle(
            book
        );

    const canOpen =
        (
            Boolean(book.url) ||
            Boolean(book.targetScreen)
        ) &&
        book.available !== false &&
        book.status !== "coming_soon";

    const hasQR =
        Boolean(book.qr) &&
        canOpen;

    const volume =
        document.createElement(
            "article"
        );

    volume.className =
        "living-library-volume";

    const coverButton =
        document.createElement(
            "button"
        );

    coverButton.className =
        "living-library-cover-button";

    coverButton.type =
        "button";

    coverButton.setAttribute(
        "aria-label",
        canOpen
            ? "Ouvrir " + displayTitle
            : displayTitle + " a venir"
    );

    coverButton.setAttribute(
        "title",
        canOpen
            ? "Ouvrir " + displayTitle
            : displayTitle + " a venir"
    );

    if (!canOpen) {

        coverButton.disabled =
            true;

    }

    this.applySlotBox(
        coverButton,
        slot.cover
    );

    const cover =
        document.createElement(
            "span"
        );

    cover.className =
        "living-library-cover";

    if (book.cover) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            book.cover;

        image.alt =
            displayTitle;

        cover.appendChild(
            image
        );

    } else {

        const title =
            document.createElement(
                "span"
            );

        title.textContent =
            displayTitle;

        cover.appendChild(
            title
        );

    }

    coverButton.appendChild(
        cover
    );

    if (canOpen) {

        coverButton.addEventListener(
            "click",
            () => {

                this.openBook(
                    book,
                    volume
                );

            }
        );

    }

    const qrButton =
        document.createElement(
            "button"
        );

    qrButton.className =
        "living-library-qr-button";

    qrButton.type =
        "button";

    qrButton.setAttribute(
        "aria-label",
        "Afficher le QR " + displayTitle
    );

    qrButton.setAttribute(
        "title",
        "Afficher le QR " + displayTitle
    );

    this.applySlotBox(
        qrButton,
        slot.qr
    );

    if (hasQR) {

        const qr =
            document.createElement(
                "img"
            );

        qr.src =
            book.qr;

        qr.alt =
            "";

        qrButton.appendChild(
            qr
        );

    } else {

        qrButton.textContent =
            "QR";

    }

    if (hasQR) {

        qrButton.addEventListener(
            "click",
            () => {

                this.showQR(
                    book.qr
                );

            }
        );

    }

    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        displayTitle;

    volume.append(
        coverButton,
        heading
    );

    if (hasQR) {

        volume.appendChild(
            qrButton
        );

    }

    this.trackView(
        book.id
    );

    return volume;

},

renderExtensionLibrary() {

    if (
        !this.extensions ||
        !Array.isArray(this.extensions.rooms)
    ) return;

    this.extensions.rooms.forEach(
        room => {

            this.renderExtensionRoom(
                room
            );

        }
    );

},

renderExtensionRoom(room) {

    const container =
        document.getElementById(
            room.containerId
        );

    if (!container) return;

    container.innerHTML =
        "";

    container.className =
        "books-container living-library-room " +
        "living-library-extension-room";

    container.dataset.room =
        room.id;

    const hall =
        document.createElement(
            "div"
        );

    hall.className =
        "living-library-extension-hall";

    const header =
        document.createElement(
            "header"
        );

    header.className =
        "living-library-extension-header";

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        room.title;

    const subtitle =
        document.createElement(
            "p"
        );

    subtitle.textContent =
        room.subtitle || "";

    header.append(
        title,
        subtitle
    );

    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "living-library-extension-grid";

    (
        room.resources || []
    ).forEach(resource => {

        grid.appendChild(
            this.renderExtensionResource(
                resource
            )
        );

    });

    hall.append(
        header,
        grid,
        this.renderExtensionNavigation(
            room
        )
    );

    container.appendChild(
        hall
    );

},

renderExtensionResource(resource) {

    const canOpen =
        Boolean(resource.url) &&
        resource.status !== "coming_soon";

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "living-library-extension-book";

    if (!canOpen) {

        card.classList.add(
            "living-library-extension-book-coming-soon"
        );

    }

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "living-library-extension-cover";

    button.type =
        "button";

    button.disabled =
        !canOpen;

    button.setAttribute(
        "aria-label",
        canOpen
            ? "Ouvrir " + resource.title
            : resource.title + " a venir"
    );

    button.setAttribute(
        "title",
        canOpen
            ? "Ouvrir " + resource.title
            : resource.title + " a venir"
    );

    if (resource.cover) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            resource.cover;

        image.alt =
            resource.title;

        button.appendChild(
            image
        );

    } else {

        const title =
            document.createElement(
                "span"
            );

        title.textContent =
            resource.title;

        button.appendChild(
            title
        );

    }

    if (canOpen) {

        button.addEventListener(
            "click",
            () => {

                this.openBook(
                    resource,
                    card
                );

            }
        );

    }

    const description =
        document.createElement(
            "p"
        );

    description.textContent =
        resource.description || "";

    card.append(
        button,
        description
    );

    if (
        resource.qr &&
        canOpen
    ) {

        const qrButton =
            document.createElement(
                "button"
            );

        qrButton.className =
            "living-library-extension-qr";

        qrButton.type =
            "button";

        qrButton.setAttribute(
            "aria-label",
            "Afficher le QR " + resource.title
        );

        qrButton.setAttribute(
            "title",
            "Afficher le QR " + resource.title
        );

        const qr =
            document.createElement(
                "img"
            );

        qr.src =
            resource.qr;

        qr.alt =
            "";

        qrButton.appendChild(
            qr
        );

        qrButton.addEventListener(
            "click",
            () => {

                this.showQR(
                    resource.qr
                );

            }
        );

        card.appendChild(
            qrButton
        );

    }

    return card;

},

renderExtensionNavigation(room) {

    const navigation =
        document.createElement(
            "div"
        );

    navigation.className =
        "living-library-navigation " +
        "living-library-extension-navigation";

    if (room.previous) {

        navigation.appendChild(
            this.renderRoomButton(
                "previous",
                "Salle precedente",
                room.previous,
                {}
            )
        );

    }

    if (room.next) {

        navigation.appendChild(
            this.renderRoomButton(
                "next",
                "Salle suivante",
                room.next,
                {}
            )
        );

    }

    if (room.returnTo) {

        navigation.appendChild(
            this.renderRoomButton(
                "return",
                "Retour Bibliotheque principale",
                room.returnTo,
                {}
            )
        );

    }

    return navigation;

},

openBook(
    book,
    volume
) {

    if (
        !book
    ) return;

    if (book.targetScreen) {

        this.trackClick(
            book.id
        );

        this.goToRoom(
            book.targetScreen
        );

        return;

    }

    if (!book.url) return;

    if (volume) {

        volume.classList.add(
            "living-library-volume-opening"
        );

    }

    window.setTimeout(
        () => {

            this.trackClick(
                book.id
            );

            window.open(
                book.url,
                "_blank"
            );

            if (volume) {

                volume.classList.remove(
                    "living-library-volume-opening"
                );

            }

        },
        220
    );

},

getDisplayTitle(book) {

    return (
        book &&
        (
            book.label ||
            book.title
        )
    ) || "";

},

renderRoomNavigation(
    room,
    navigationLayout = {}
) {

    const navigation =
        document.createElement(
            "div"
        );

    navigation.className =
        "living-library-navigation";

    if (
        room.previous &&
        navigationLayout.previous
    ) {

        navigation.appendChild(
            this.renderRoomButton(
                "previous",
                "Salle precedente",
                room.previous,
                navigationLayout.previous
            )
        );

    }

    if (
        room.next &&
        navigationLayout.next
    ) {

        navigation.appendChild(
            this.renderRoomButton(
                "next",
                "Salle suivante",
                room.next,
                navigationLayout.next
            )
        );

    }

    if (
        !room.next &&
        navigationLayout.next
    ) {

        navigation.appendChild(
            this.renderFinishButton(
                navigationLayout.next
            )
        );

    }

    return navigation;

},

renderFinishButton(layoutBox) {

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "living-library-room-button " +
        "living-library-room-button-finish";

    button.type =
        "button";

    button.textContent =
        "Terminer la visite";

    this.applyNavBox(
        button,
        layoutBox
    );

    button.addEventListener(
        "click",
        () => {

            this.showVisitEnd();

        }
    );

    return button;

},

renderRoomButton(
    direction,
    label,
    target,
    layoutBox
) {

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "living-library-room-button " +
        "living-library-room-button-" +
        direction;

    button.type =
        "button";

    button.dataset.targetScreen =
        target;

    button.textContent =
        direction === "previous"
            ? "< " + label
            : direction === "return"
                ? label
                : label + " >";

    this.applyNavBox(
        button,
        layoutBox
    );

    button.addEventListener(
        "click",
        () => {

            this.goToRoom(
                target
            );

        }
    );

    return button;

},

renderVisitEnd() {

    const panel =
        document.createElement(
            "div"
        );

    panel.className =
        "living-library-end";

    panel.setAttribute(
        "aria-live",
        "polite"
    );

    panel.innerHTML = `

        <div class="living-library-end-inner">

            <p>
                Vous avez parcouru cette partie de la Bibliotheque Vivante.
            </p>

            <p>
                Chaque livre demeure une porte.
                Vous pourrez toujours revenir explorer d'autres chemins.
            </p>

            <div class="living-library-end-actions">

                <button type="button" data-target-screen="e04_oeuvre">
                    Retour vers l'Oeuvre
                </button>

                <button type="button" data-target-screen="e03_boussole">
                    Retour vers la Boussole Vivante
                </button>

                <button type="button" data-target-screen="e01_accueil">
                    Retour a l'Accueil
                </button>

            </div>

        </div>

    `;

    panel
        .querySelectorAll(
            "[data-target-screen]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.goToRoom(
                            button.dataset.targetScreen
                        );

                    }
                );

            }
        );

    return panel;

},

showVisitEnd() {

    const panel =
        document.querySelector(
            "#portes-container .living-library-end"
        );

    if (!panel) return;

    panel.classList.add(
        "living-library-end-visible"
    );

},

goToRoom(target) {

    if (!target) return;

    document
        .querySelectorAll(
            ".living-library-room"
        )
        .forEach(
            room => room.classList.add(
                "living-library-room-fading"
            )
        );

    window.setTimeout(
        () => {

            if (
                typeof Navigation !== "undefined" &&
                Navigation.goTo
            ) {

                Navigation.goTo(
                    target
                );

            }

            document
                .querySelectorAll(
                    ".living-library-room"
                )
                .forEach(
                    room => room.classList.remove(
                        "living-library-room-fading"
                    )
                );

        },
        260
    );

},

applyImageBox(
    element,
    box
) {

    if (!box) return;

    element.style.left =
        "calc(var(--screen-content-left) + " +
        "var(--screen-content-width) * " +
        (box.left / 100) +
        ")";

    element.style.top =
        "calc(var(--screen-content-top) + " +
        "var(--screen-content-height) * " +
        (box.top / 100) +
        ")";

    element.style.width =
        "calc(var(--screen-content-width) * " +
        (box.width / 100) +
        ")";

    element.style.height =
        "calc(var(--screen-content-height) * " +
        (box.height / 100) +
        ")";

},

applySlotBox(
    element,
    box
) {

    if (!box) return;

    if (
        typeof box.x !== "number" ||
        typeof box.y !== "number" ||
        typeof box.w !== "number" ||
        typeof box.h !== "number"
    ) return;

    element.style.left =
        box.x + "%";

    element.style.top =
        box.y + "%";

    element.style.width =
        box.w + "%";

    element.style.height =
        box.h + "%";

},

applyNavBox(
    element,
    box
) {

    this.applySlotBox(
        element,
        box
    );

},

showQR(qrUrl) {

    const modal =
        document.getElementById(
            "qrModal"
        );

    const image =
        document.getElementById(
            "qrImage"
        );

    if (
        !modal ||
        !image ||
        !qrUrl
    ) return;

    image.src =
        qrUrl;

    modal.classList.add(
        "active"
    );

},

trackView(bookId) {

    const key =
        `makerland_views_${bookId}`;

    let views =
        localStorage.getItem(key) || 0;

    views++;

    localStorage.setItem(
        key,
        views
    );

},

trackClick(bookId) {

    const key =
        `makerland_clicks_${bookId}`;

    let clicks =
        localStorage.getItem(key) || 0;

    clicks++;

    localStorage.setItem(
        key,
        clicks
    );

},

getStats(bookId) {

    return {

        views:
            localStorage.getItem(
                `makerland_views_${bookId}`
            ) || 0,

        clicks:
            localStorage.getItem(
                `makerland_clicks_${bookId}`
            ) || 0

    };

}

};

/****************************************************
INITIALISATION
****************************************************/

document.addEventListener(
"DOMContentLoaded",
async () => {

    await Books.load();

    Books.renderLibrary();

}

);
