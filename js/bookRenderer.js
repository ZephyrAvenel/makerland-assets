/****************************************************
MAKERLAND V3.0-C
bookRenderer.js
****************************************************/

const Books = {

data: null,

async load() {

    try {

        const response = await fetch("data/livres-v2.json");

        this.data = await response.json();

        console.log("Livres chargés");

        return this.data;

    } catch (error) {

        console.error("Erreur chargement livres", error);

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

renderCategory(category, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const books =
        this.getByCategory(category);

    books.forEach(book => {

        container.appendChild(
            this.renderBook(book)
        );

    });

},

renderBook(book) {

    const card =
        document.createElement("div");

    card.className =
        "makerland-book-card";

    card.innerHTML = `

        <div class="book-cover">

            ${
                book.cover
                ? `<img src="${book.cover}" alt="${book.title}">`
                : ``
            }

        </div>

        <div class="book-content">

            <h3>${book.title}</h3>

            ${
                book.subtitle
                ? `<p>${book.subtitle}</p>`
                : ``
            }

            ${
                book.description
                ? `<div class="book-description">${book.description}</div>`
                : ``
            }

            <div class="book-actions">

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

                this.trackClick(book.id);

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

                this.showQR(book.qr);

            }
        );

    this.trackView(book.id);

    return card;

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

    image.src = qrUrl;

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

    Books.renderCategory(
        "fiction",
        "fiction-container"
    );

    Books.renderCategory(
        "essais",
        "essais-container"
    );

    Books.renderCategory(
        "atlas",
        "atlas-container"
    );

    Books.renderCategory(
        "portes_ouvertes",
        "portes-container"
    );

}

);