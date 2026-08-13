(function () {
    const FALLBACK = {
        label: "\u2190 Revenir au voyage",
        href: "../index.html"
    };

    const CONTEXTS = {
        boussole: {
            label: "\u2190 Revenir au voyage",
            href: "../index.html#e03_boussole"
        },
        meteo: {
            label: "\u2190 Revenir au voyage",
            href: "../index.html#e02_meteo"
        },
        bibliotheque: FALLBACK
    };

    function detectContext() {
        let stored = null;

        try {
            stored =
                sessionStorage.getItem("makerland:atelier:return") ||
                sessionStorage.getItem("makerlandReturnContext");
        } catch (error) {
            stored = null;
        }

        if (stored && CONTEXTS[stored]) {
            return CONTEXTS[stored];
        }

        const referrer = document.referrer || "";

        if (referrer.indexOf("e03_boussole") !== -1) {
            return CONTEXTS.boussole;
        }

        if (referrer.indexOf("e02_meteo") !== -1) {
            return CONTEXTS.meteo;
        }

        return FALLBACK;
    }

    function resolveHref(href) {
        const depth = document.body.dataset.depth || "sub";
        return depth === "root" ? href : href.replace("../", "../../");
    }

    function initReturnLinks() {
        const context = detectContext();

        document
            .querySelectorAll("[data-atelier-return]")
            .forEach(link => {
                link.textContent = context.label;
                link.href = resolveHref(context.href);
            });
    }

    function initAtelierHomeLink() {
        if ((document.body.dataset.depth || "sub") !== "sub") {
            return;
        }

        if (document.querySelector("[data-atelier-home]")) {
            return;
        }

        const returnLink = document.querySelector("[data-atelier-return]");
        if (!returnLink || !returnLink.parentNode) {
            return;
        }

        const link = document.createElement("a");
        link.className = "placeholder-return";
        link.href = "../";
        link.textContent = "Retour Atelier";
        link.setAttribute("data-atelier-home", "");
        returnLink.parentNode.insertBefore(link, returnLink);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initReturnLinks();
            initAtelierHomeLink();
        });
    } else {
        initReturnLinks();
        initAtelierHomeLink();
    }
})();
