(function () {
    const DEFAULT_ALT = "Emblème des Récits Vivants";
    const ROOT_SRC = "assets/logo_rv.png";

    function assetPath() {
        const depth = document.body ? document.body.dataset.depth : "";
        const archiveDepth = document.body ? document.body.dataset.archiveDepth : "";

        if (archiveDepth === "detail") {
            return "../../" + ROOT_SRC;
        }

        if (depth === "archives") {
            return "../../" + ROOT_SRC;
        }

        if (depth === "root" || document.body.dataset.cycleType === "constellation") {
            return "../" + ROOT_SRC;
        }

        if (document.body.dataset.journalPage) {
            return "../" + ROOT_SRC;
        }

        return ROOT_SRC;
    }

    function create(options) {
        const settings = options || {};
        const seal = document.createElement("span");
        const image = document.createElement("img");

        seal.className = [
            "rv-seal",
            settings.variant ? "rv-seal--" + settings.variant : "",
            settings.className || ""
        ].filter(Boolean).join(" ");

        if (settings.label && !settings.hidden) {
            seal.setAttribute("aria-label", settings.label);
        }

        if (settings.hidden) {
            seal.setAttribute("aria-hidden", "true");
        }

        image.src = settings.src || assetPath();
        image.alt = settings.hidden ? "" : (settings.alt || DEFAULT_ALT);
        image.loading = "lazy";
        image.decoding = "async";

        seal.appendChild(image);
        return seal;
    }

    function addStandaloneSeals() {
        return;
    }

    function hydrateDeclarativeSeals() {
        document.querySelectorAll("[data-rv-seal]").forEach(target => {
            if (target.querySelector("img")) {
                return;
            }

            const seal = create({
                variant: target.dataset.rvSeal || "inline",
                label: DEFAULT_ALT
            });
            const image = seal.querySelector("img");

            if (image) {
                target.appendChild(image);
            }
        });
    }

    function addImmersiveSeal(screenId) {
        const screen = document.getElementById(screenId);
        if (!screen || screen.querySelector(".rv-seal--screen")) {
            return;
        }

        const supported = {
            e03_boussole: "compass",
            e04_oeuvre: "forest"
        };

        if (!supported[screenId]) {
            return;
        }

        screen.appendChild(
            create({
                variant: "screen",
                className: "rv-seal--" + supported[screenId],
                label: DEFAULT_ALT
            })
        );
    }

    function bindImmersiveScreens() {
        window.addEventListener("screenChanged", event => {
            if (!event.detail || !event.detail.screen) {
                return;
            }

            addImmersiveSeal(event.detail.screen);
        });

    }

    function init() {
        hydrateDeclarativeSeals();
        addStandaloneSeals();
        bindImmersiveScreens();
    }

    window.RVSeal = {
        create,
        hydrateDeclarativeSeals,
        addStandaloneSeals,
        addImmersiveSeal
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
