/****************************************************
MAKERLAND V3.0-C
constellation.js
****************************************************/

const Constellation = (() => {

const STORAGE_KEY =
    "makerland_stories";

let stories = [];

let storageWriteBlocked = false;

function isPlainObject(value) {

    return Boolean(value) &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === "[object Object]";

}

function isValidStory(story) {

    const hasValidId =
        typeof story.id === "number" ||
        typeof story.id === "string";

    return isPlainObject(story) &&
        hasValidId &&
        typeof story.date === "string" &&
        !Number.isNaN(Date.parse(story.date)) &&
        typeof story.text === "string" &&
        typeof story.source === "string";

}

function isValidStories(value) {

    return Array.isArray(value) &&
        value.every(isValidStory);

}

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

    storageWriteBlocked = false;

    let saved;

    try {

        saved =
            localStorage.getItem(
                STORAGE_KEY
            );

    } catch(error) {

        storageWriteBlocked = true;
        stories = [];

        return stories;

    }

    if (saved === null) {

        stories = [];

        return stories;

    }

    try {

        const parsed =
            JSON.parse(saved);

        if (!isValidStories(parsed)) {

            storageWriteBlocked = true;
            stories = [];

            return stories;

        }

        stories = parsed;

    } catch(error) {

        storageWriteBlocked = true;
        stories = [];

    }

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

    if (storageWriteBlocked) {

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

    const nextStories = [
        story,
        ...stories
    ];

    if (!persist(nextStories)) {

        return false;

    }

    stories = nextStories;

    renderStories();

    return true;

}

/****************************************
 STORAGE
****************************************/

function persist(nextStories = stories) {

    if (storageWriteBlocked) {

        return false;

    }

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(
                nextStories
            )

        );

    } catch(error) {

        return false;

    }

    return true;

}

/****************************************
 DELETE
****************************************/

function removeStory(id) {

    if (storageWriteBlocked) {

        return false;

    }

    const nextStories =
        stories.filter(

            story =>
                story.id !== id

        );

    if (!persist(nextStories)) {

        return false;

    }

    stories = nextStories;

    renderStories();

    return true;

}

/****************************************
 CLEAR
****************************************/

function clearStories() {

    if (storageWriteBlocked) {

        return false;

    }

    if (!persist([])) {

        return false;

    }

    stories = [];

    renderStories();

    return true;

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

            const storyText =
                document.createElement(
                    "div"
                );

            storyText.className =
                "story-text";

            storyText.style.whiteSpace =
                "pre-wrap";

            storyText.textContent =
                story.text;

            const storyDate =
                document.createElement(
                    "div"
                );

            storyDate.className =
                "story-date";

            storyDate.textContent =
                new Date(
                    story.date
                ).toLocaleString();

            card.appendChild(storyText);

            card.appendChild(storyDate);

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
