(function () {
    const ENCOUNTERS_KEY = "makerland.guardianEncounters.v1";
    const OPENED_KEY = "makerland.livingNotebook.opened";
    const PAGE_TURN_CLASS = "is-turning";

    let state = {
        page: 0,
        pages: [],
        root: null,
        startX: 0,
        deltaX: 0,
        turning: false
    };

    function readJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeOpened() {
        try {
            localStorage.setItem(OPENED_KEY, "true");
        } catch (error) {
            return;
        }
    }

    function hasOpened() {
        try {
            return localStorage.getItem(OPENED_KEY) === "true";
        } catch (error) {
            return true;
        }
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? ""
            : date.toLocaleDateString("fr-FR");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function encounters() {
        const payload = readJson(ENCOUNTERS_KEY);
        return Array.isArray(payload.encounters)
            ? payload.encounters
            : [];
    }

    function blankPage(index) {
        return {
            type: "blank",
            title: "Page en attente",
            text: index === 0
                ? "Cette page attend encore une rencontre."
                : "Un murmure viendra peut-être s'inscrire ici plus tard."
        };
    }

    function buildPages() {
        const met = encounters().map(encounter => ({
            type: "encounter",
            title: encounter.guardianName || "Gardien des Récits Vivants",
            illustration: encounter.illustration || "✦",
            whisper: encounter.whisper || "",
            place: encounter.territoryLabel || "Territoire des Récits Vivants",
            date: formatDate(encounter.firstEncounteredAt),
            href: resolveHref(encounter.territoryHref)
        }));

        const minimum = Math.max(3, met.length + 2);
        const pages = met.slice();

        while (pages.length < minimum) {
            pages.push(blankPage(pages.length));
        }

        return pages;
    }

    function resolveHref(href) {
        if (!href) {
            return "../index.html";
        }

        if (href.indexOf("http") === 0 || href.indexOf("../") === 0) {
            return href;
        }

        return "../" + href;
    }

    function renderCover() {
        return [
            "<section class=\"living-notebook__cover\" aria-label=\"Couverture du Carnet du Voyageur\">",
            "<span data-notebook-seal=\"cover\"></span>",
            "<h3>Carnet du Voyageur</h3>",
            "<p>Récits Vivants</p>",
            "</section>"
        ].join("");
    }

    function renderPage(page) {
        if (!page || page.type === "blank") {
            return [
                "<article class=\"living-notebook__page living-notebook__page--blank\">",
                "<header>",
                "<span data-notebook-seal=\"page\"></span>",
                "<span>Page libre</span>",
                "</header>",
                "<div class=\"living-notebook__page-body\">",
                "<p>" + escapeHtml(page && page.text) + "</p>",
                "</div>",
                "</article>"
            ].join("");
        }

        return [
            "<article class=\"living-notebook__page\">",
            "<header>",
            "<span data-notebook-seal=\"page\"></span>",
            "<div>",
            "<h3>" + escapeHtml(page.title) + "</h3>",
            "<p>" + escapeHtml(page.place) + (page.date ? " · " + escapeHtml(page.date) : "") + "</p>",
            "</div>",
            "</header>",
            "<div class=\"living-notebook__page-body\">",
            "<div class=\"living-notebook__guardian\" aria-hidden=\"true\">" + escapeHtml(page.illustration) + "</div>",
            "<blockquote>" + escapeHtml(page.whisper) + "</blockquote>",
            "<a class=\"placeholder-return\" href=\"" + escapeHtml(page.href) + "\">Revenir dans ce territoire</a>",
            "</div>",
            "</article>"
        ].join("");
    }

    function render() {
        if (!state.root) {
            return;
        }

        const opened = hasOpened();
        const current = state.pages[state.page];
        state.root.className = opened
            ? "living-notebook is-open"
            : "living-notebook";

        state.root.innerHTML = [
            renderCover(),
            "<div class=\"living-notebook__spread\" tabindex=\"0\" aria-live=\"polite\">",
            renderPage(current),
            "</div>",
            "<nav class=\"living-notebook__nav\" aria-label=\"Navigation du carnet\">",
            "<button type=\"button\" data-notebook-prev aria-label=\"Page précédente\">←</button>",
            "<span>Page " + String(state.page + 1) + "</span>",
            "<button type=\"button\" data-notebook-next aria-label=\"Page suivante\">→</button>",
            "</nav>"
        ].join("");

        state.root.querySelector("[data-notebook-prev]").disabled = state.page === 0;
        state.root.querySelector("[data-notebook-next]").disabled = state.page >= state.pages.length - 1;
        hydrateSeals();
        bindRenderedEvents();

        if (state.turning) {
            const spread = state.root.querySelector(".living-notebook__spread");
            if (spread) {
                spread.classList.add(PAGE_TURN_CLASS);
            }

            state.turning = false;
        }

        if (!opened) {
            window.setTimeout(() => {
                state.root.classList.add("is-open");
                writeOpened();
            }, 120);
        }
    }

    function hydrateSeals() {
        if (!window.RVSeal || !window.RVSeal.create || !state.root) {
            return;
        }

        state.root.querySelectorAll("[data-notebook-seal]").forEach(target => {
            const seal = window.RVSeal.create({
                variant: target.dataset.notebookSeal === "cover" ? "notebook" : "notebook-page",
                hidden: target.dataset.notebookSeal !== "cover"
            });
            target.replaceWith(seal);
        });
    }

    function turn(direction) {
        const next = Math.max(0, Math.min(state.pages.length - 1, state.page + direction));
        if (next === state.page || !state.root) {
            return;
        }

        const spread = state.root.querySelector(".living-notebook__spread");
        if (spread) {
            spread.classList.add(PAGE_TURN_CLASS);
        }

        window.setTimeout(() => {
            state.page = next;
            state.turning = true;
            render();
        }, 180);
    }

    function bindRenderedEvents() {
        const prev = state.root.querySelector("[data-notebook-prev]");
        const next = state.root.querySelector("[data-notebook-next]");
        const spread = state.root.querySelector(".living-notebook__spread");

        if (prev) {
            prev.addEventListener("click", () => turn(-1));
        }

        if (next) {
            next.addEventListener("click", () => turn(1));
        }

        if (!spread) {
            return;
        }

        spread.addEventListener("keydown", event => {
            if (event.key === "ArrowLeft") {
                turn(-1);
            }

            if (event.key === "ArrowRight") {
                turn(1);
            }
        });

        spread.addEventListener("pointerdown", event => {
            state.startX = event.clientX;
            state.deltaX = 0;
        });

        spread.addEventListener("pointermove", event => {
            if (!state.startX) {
                return;
            }

            state.deltaX = event.clientX - state.startX;
        });

        spread.addEventListener("pointerup", () => {
            if (Math.abs(state.deltaX) > 48) {
                turn(state.deltaX < 0 ? 1 : -1);
            }

            state.startX = 0;
            state.deltaX = 0;
        });
    }

    function init() {
        const root = document.querySelector("[data-living-notebook]");
        if (!root) {
            return;
        }

        state.root = root;
        state.pages = buildPages();
        render();
    }

    window.LivingNotebook = {
        init,
        buildPages
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
