/****************************************************
MAKERLAND V3.0-C
bookRenderer.js
****************************************************/

const Books = {

data: null,

rooms: [

    {
        screenId: "e06_fiction",
        containerId: "fiction-container",
        category: "fiction",
        title: "Romans",
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
        title: "Atlas",
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

        const response =
            await fetch(
                "data/livres-v2.json"
            );

        this.data =
            await response.json();

        console.log(
            "Livres charges"
        );

        return this.data;

    } catch (error) {

        console.error(
            "Erreur chargement livres",
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

},

renderRoom(room) {

    const container =
        document.getElementById(
            room.containerId
        );

    if (!container) return;

    container.innerHTML =
        "";

    container.classList.add(
        "living-library-room"
    );

    container.dataset.room =
        room.category;

    const books =
        this.getByCategory(
            room.category
        );

    const shelf =
        document.createElement(
            "div"
        );

    shelf.className =
        "living-library-shelf";

    books.forEach(
        (book, index) => {

            shelf.appendChild(
                this.renderBook(
                    book,
                    index
                )
            );

        }
    );

    container.appendChild(
        shelf
    );

    container.appendChild(
        this.renderRoomNavigation(
            room
        )
    );

},

renderBook(
    book,
    index = 0
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "living-library-volume";

    card.dataset.index =
        String(index + 1);

    card.innerHTML = `

        <div class="living-library-cover">

            ${
                book.cover
                ? `<img src="${book.cover}" alt="${book.title}">`
                : `<span>${book.title}</span>`
            }

        </div>

        <div class="living-library-caption">

            <h3>${book.title}</h3>

            <div class="living-library-actions">

                <button
                    class="book-open"
                    data-url="${book.url}"
                >
                    Ouvrir
                </button>

                <button
                    class="book-qr"
                    data-qr="${book.qr}"
                >
                    QR
                </button>

            </div>

        </div>

    `;

    card
        .querySelector(".book-open")
        .addEventListener(
            "click",
            () => {

                this.trackClick(
                    book.id
                );

                window.open(
                    book.url,
                    "_blank"
                );

            }
        );

    card
        .querySelector(".book-qr")
        .addEventListener(
            "click",
            () => {

                this.showQR(
                    book.qr
                );

            }
        );

    this.trackView(
        book.id
    );

    return card;

},

renderRoomNavigation(room) {

    const navigation =
        document.createElement(
            "div"
        );

    navigation.className =
        "living-library-navigation";

    if (room.previous) {

        navigation.appendChild(
            this.renderRoomButton(
                "previous",
                "Salle precedente",
                room.previous
            )
        );

    } else {

        navigation.appendChild(
            this.renderRoomSpacer()
        );

    }

    if (room.next) {

        navigation.appendChild(
            this.renderRoomButton(
                "next",
                "Salle suivante",
                room.next
            )
        );

    } else {

        navigation.appendChild(
            this.renderRoomSpacer()
        );

    }

    return navigation;

},

renderRoomButton(
    direction,
    label,
    target
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
            : label + " >";

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

renderRoomSpacer() {

    const spacer =
        document.createElement(
            "span"
        );

    spacer.className =
        "living-library-room-spacer";

    spacer.setAttribute(
        "aria-hidden",
        "true"
    );

    return spacer;

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
