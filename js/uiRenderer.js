const UIRenderer = (() => {

const renderers = {};

function clear() {

    document
        .querySelectorAll(".ui-panel")
        .forEach(
            element => element.remove()
        );

}

function render(screenId) {

    clear();

    const renderer =
        renderers[screenId];

    if (renderer) {

        renderer(
            screenId
        );

    }

}

function register(screenId, renderer) {

    if (
        !screenId ||
        typeof renderer !== "function"
    ) return;

    renderers[screenId] =
        renderer;

}

console.log(
    "UIRenderer charge"
);

return {

    render,

    clear,

    register

};

})();
