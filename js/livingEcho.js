const LivingEcho = (() => {

const DEFAULT_WEATHER =
    "je_ne_sais_pas";

const ECHOES = {

    brouillard: [

        "Le premier repère suffit.",

        "Le chemin ne demande pas encore d'être vu.",

        "Vous n'avez pas besoin de tout comprendre aujourd'hui.",

        "Une lumière suffit parfois."

    ],

    tempete: [

        "Respirez.",

        "Le mouvement n'est pas toujours une urgence.",

        "Même dans la tempête, une direction existe.",

        "Le calme reviendra."

    ],

    transition: [

        "Quelque chose évolue.",

        "Ne retenez pas ce qui veut changer.",

        "Les passages ont leur propre rythme.",

        "Continuez doucement."

    ],

    eclaircie: [

        "La lumière n'efface pas le chemin.",

        "Vous distinguez déjà quelque chose.",

        "Continuez.",

        "Le paysage devient lisible."

    ],

    je_ne_sais_pas: [

        "Ne pas savoir est parfois le début.",

        "Aucun nom n'est nécessaire aujourd'hui.",

        "Le monde peut attendre avec vous.",

        "Tout n'a pas besoin d'être décidé."

    ]

};

const DEEP_ECHOES = {

    brouillard: [

        "Certains chemins apprennent à luire lentement."

    ],

    tempete: [

        "Même ce qui traverse finit par déposer une forme."

    ],

    transition: [

        "Les seuils savent parfois attendre avec nous."

    ],

    eclaircie: [

        "La clarté devient un lieu lorsqu'elle ne force rien."

    ],

    je_ne_sais_pas: [

        "Le non-savoir peut devenir une chambre ouverte."

    ]

};

function create(context = {}) {

    const selectedWeather =
        context.selectedWeather ||
        DEFAULT_WEATHER;

    const weatherHistory =
        Array.isArray(context.weatherHistory)
            ? context.weatherHistory
            : [];

    const visitCount =
        Math.max(
            0,
            Number(context.visitCount) || 0
        );

    const weatherEchoes =
        ECHOES[selectedWeather] ||
        ECHOES[DEFAULT_WEATHER];

    const messageParts = [

        pick(weatherEchoes)

    ];

    const canAddSecondPhrase =
        visitCount >= 10 &&
        Math.random() < 0.42;

    if (canAddSecondPhrase) {

        const historyEcho =
            getHistoryEcho(
                selectedWeather,
                weatherHistory
            );

        if (historyEcho) {

            messageParts.push(
                historyEcho
            );

        }

    }

    const canAddDeepEcho =
        visitCount >= 30 &&
        Math.random() < 0.08;

    if (canAddDeepEcho) {

        messageParts.splice(
            0,
            messageParts.length,
            pick(
                DEEP_ECHOES[selectedWeather] ||
                DEEP_ECHOES[DEFAULT_WEATHER]
            )
        );

    }

    const intensity =
        getIntensity(
            visitCount,
            messageParts.length
        );

    return {

        message:
            messageParts.join(" "),

        intensity,

        glow:
            getGlow(
                selectedWeather,
                intensity
            ),

        delay:
            getDelay()

    };

}

function pick(items) {

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];

}

function getHistoryEcho(
    selectedWeather,
    weatherHistory
) {

    const values =
        weatherHistory
            .map(entry => {

                if (
                    entry &&
                    typeof entry === "object"
                ) {

                    return entry.value;

                }

                return entry;

            })
            .filter(Boolean);

    if (!values.length) return "";

    const sameWeatherCount =
        values.filter(
            value => value === selectedWeather
        ).length;

    if (sameWeatherCount >= 4) {

        return getRecurringEcho(
            selectedWeather
        );

    }

    if (new Set(values).size >= 3) {

        return "Les paysages changent, et le lieu demeure.";

    }

    return "";

}

function getRecurringEcho(selectedWeather) {

    const echoes = {

        brouillard:
            "La lumière peut rester petite.",

        tempete:
            "La Boussole ne se détourne pas.",

        transition:
            "Le passage peut garder son rythme.",

        eclaircie:
            "La clarté revient sans presser.",

        je_ne_sais_pas:
            "L'attente aussi peut orienter."

    };

    return echoes[selectedWeather] || "";

}

function getIntensity(
    visitCount,
    phraseCount
) {

    const visitIntensity =
        visitCount >= 30
            ? 3
            : visitCount >= 10
                ? 2
                : 1;

    return Math.min(
        3,
        Math.max(
            visitIntensity,
            phraseCount
        )
    );

}

function getGlow(
    selectedWeather,
    intensity
) {

    const glowByWeather = {

        brouillard:
            "mist",

        tempete:
            "cool",

        transition:
            "passage",

        eclaircie:
            "warm",

        je_ne_sais_pas:
            "soft"

    };

    return [

        glowByWeather[selectedWeather] ||
            glowByWeather[DEFAULT_WEATHER],

        "level-" + intensity

    ].join(" ");

}

function getDelay() {

    return 2000 +
        Math.round(
            Math.random() * 2000
        );

}

return {

    create

};

})();
