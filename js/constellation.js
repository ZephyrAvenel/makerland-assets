/****************************************************
MAKERLAND V3.0-C
constellation.js
****************************************************/

const Constellation = (() => {

const STORAGE_KEY =
    "makerland_stories";

let stories = [];

/****************************************
 INIT
****************************************/

async function init() {

    loadStories();

    bindEvents();

    renderStories();

    console.log(
        "Constellation initialisée"
    );

}

/****************************************
 LOAD
****************************************/

function loadStories() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    stories =
        saved
        ? JSON.parse(saved)
        : [];

    return stories;

}

/****************************************
 SAVE
****************************************/

function saveStory(text) {

    if (
        !text ||
        text.trim() === ""
    ) {

        return false;

    }

    const story = {

        id:
            Date.now(),

        date:
            new Date()
            .toISOString(),

        text:
            text.trim(),

        source:
            "makerland"

    };

    stories.unshift(
        story
    );

    persist();

    renderStories();

    return true;

}

/****************************************
 STORAGE
****************************************/

function persist() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            stories
        )

    );

}

/****************************************
 DELETE
****************************************/

function removeStory(id) {

    stories =
        stories.filter(

            story =>
                story.id !== id

        );

    persist();

    renderStories();

}

/****************************************
 CLEAR
****************************************/

function clearStories() {

    stories = [];

    persist();

    renderStories();

}

/****************************************
 EXPORT
****************************************/

function exportStories() {

    const blob =
        new Blob(

            [

                JSON.stringify(
                    stories,
                    null,
                    2
                )

            ],

            {

                type:
                    "application/json"

            }

        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;

    link.download =
        "makerland-stories.json";

    link.click();

}

/****************************************
 RENDER
****************************************/

function renderStories() {

    const container =
        document.getElementById(
            "storiesContainer"
        );

    if (!container)
        return;

    container.innerHTML = "";

    stories.forEach(
        story => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "story-card";

            card.innerHTML = `

                <div class="story-text">

                    ${story.text}

                </div>

                <div class="story-date">

                    ${new Date(
                        story.date
                    ).toLocaleString()}

                </div>

            `;

            container.appendChild(
                card
            );

        }
    );

}

/****************************************
 EVENTS
****************************************/

function bindEvents() {

    const button =
        document.getElementById(
            "shareStoryButton"
        );

    const textarea =
        document.getElementById(
            "storyInput"
        );

    if (
        !button ||
        !textarea
    ) {

        return;

    }

    button.addEventListener(

        "click",

        () => {

            const success =
                saveStory(
                    textarea.value
                );

            if (success) {

                textarea.value =
                    "";

            }

        }

    );

}

/****************************************
 PUBLIC API
****************************************/

return {

    init,

    saveStory,

    loadStories,

    renderStories,

    clearStories,

    exportStories,

    removeStory

};

})();
