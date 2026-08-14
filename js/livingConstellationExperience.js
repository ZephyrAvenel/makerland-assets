(function () {
    const MEMORY_KEY = "makerland.traveler.constellation";
    const TRAVELER_KEY = "makerland:traveler-constellation";
    const CYCLE_KEY = "makerland:living-cycle";
    const SEASONS_KEY = "makerland:living-seasons";

    const SCRIPT_URL = document.currentScript
        ? document.currentScript.src
        : window.location.href;

    const DATA_PATHS = {
        daily: new URL("../data/daily-resonances.json", SCRIPT_URL).href,
        concepts: new URL("../data/concept-network.json", SCRIPT_URL).href,
        works: new URL("../data/work-network.json", SCRIPT_URL).href,
        assets: new URL("../data/archive-assets.json", SCRIPT_URL).href,
        mapping: new URL("../data/archive-mapping.json", SCRIPT_URL).href
    };

    const state = {
        data: null,
        memory: null,
        daily: null,
        cards: null,
        elements: {}
    };

    function fetchJson(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error("Living Constellation Experience : impossible de charger " + path);
            }
            return response.json();
        });
    }

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Le module reste une amelioration locale non bloquante.
        }
    }

    function dayIndex(date) {
        return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    }

    function seasonFor(date) {
        const cycle = readJson(CYCLE_KEY, {});
        if (cycle.currentSeason) return cycle.currentSeason;
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return "printemps";
        if (month >= 5 && month <= 7) return "ete";
        if (month >= 8 && month <= 10) return "automne";
        return "hiver";
    }

    function momentFor(date) {
        const cycle = readJson(CYCLE_KEY, {});
        if (cycle.currentMoment) return cycle.currentMoment;
        const hour = date.getHours();
        if (hour >= 5 && hour < 8) return "dawn";
        if (hour >= 8 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "noon";
        if (hour >= 17 && hour < 21) return "dusk";
        return "night";
    }

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function cleanTitle(value) {
        return String(value || "")
            .replace(/Makerland/g, "Territoire des Recits Vivants")
            .replace(/Atelier IA/g, "Atelier des Recits")
            .replace(/\.(png|jpe?g|gif|webp|svg)$/i, "")
            .replace(/^COUVERTURE[-_\s]*/i, "")
            .replace(/^Couverture\s*-\s*/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function pickDaily(date) {
        const season = seasonFor(date);
        const candidates = state.data.daily.resonances.filter(item => {
            return item.season === "all" || item.season === season || item.season === seasonKey(season);
        });
        const pool = candidates.length ? candidates : state.data.daily.resonances;
        return pool[dayIndex(date) % pool.length];
    }

    function seasonKey(label) {
        return {
            printemps: "spring",
            ete: "summer",
            automne: "autumn",
            hiver: "winter"
        }[label] || label;
    }

    function readMemory() {
        const traveler = readJson(TRAVELER_KEY, {});
        const seasons = readJson(SEASONS_KEY, {});
        const memory = readJson(MEMORY_KEY, {});
        memory.visits = Number(memory.visits || 0) + 1;
        memory.storyCount = Array.isArray(traveler.fragments)
            ? traveler.fragments.length
            : Number(memory.storyCount || 0);
        memory.archivesOpened = Array.isArray(memory.archivesOpened) ? memory.archivesOpened : [];
        memory.conceptsSeen = Array.isArray(memory.conceptsSeen) ? memory.conceptsSeen : [];
        memory.worksDiscovered = Array.isArray(memory.worksDiscovered) ? memory.worksDiscovered : [];
        memory.imagesMet = Array.isArray(memory.imagesMet) ? memory.imagesMet : [];
        if (!memory.firstSeen) {
            memory.firstSeen = seasons.firstSeen || new Date().toISOString();
        }
        memory.lastSeen = new Date().toISOString();
        writeJson(MEMORY_KEY, memory);
        return memory;
    }

    function selectCards(date, daily) {
        const index = dayIndex(date);
        const concept = selectConcept(index, daily);
        const archive = selectArchive(index, concept);
        const work = selectWork(index, concept, archive);
        const image = selectImage(index, concept, archive, work);
        return { archive, concept, work, image };
    }

    function selectConcept(index, daily) {
        const hints = (daily.conceptHints || []).map(normalize);
        const preferred = state.data.concepts.concepts.filter(concept => {
            return hints.some(hint => normalize(concept.name).includes(hint));
        });
        const pool = preferred.length ? preferred : state.data.concepts.concepts;
        return pool[index % pool.length];
    }

    function selectArchive(index, concept) {
        const ids = concept && concept.archives && concept.archives.length
            ? concept.archives
            : state.data.mapping.mappings.map(item => item.id);
        const id = ids[index % ids.length];
        return state.data.mapping.mappings.find(item => item.id === id) || state.data.mapping.mappings[index % state.data.mapping.mappings.length];
    }

    function selectWork(index, concept, archive) {
        const ids = []
            .concat(concept && concept.works ? concept.works : [])
            .concat(archive && archive.books ? archive.books : []);
        const uniqueIds = Array.from(new Set(ids));
        const pool = uniqueIds.length
            ? state.data.works.works.filter(work => uniqueIds.includes(work.id))
            : state.data.works.works;
        return pool[index % pool.length];
    }

    function selectImage(index, concept, archive, work) {
        const ids = []
            .concat(concept && concept.images ? concept.images : [])
            .concat(archive && archive.images ? archive.images : [])
            .concat(work && work.images ? work.images : []);
        const uniqueIds = Array.from(new Set(ids));
        const pool = uniqueIds.length
            ? state.data.assets.assets.filter(asset => uniqueIds.includes(asset.id))
            : state.data.assets.assets.filter(asset => !asset.isTechnicalTexture);
        return pool[index % pool.length];
    }

    function buildLayer() {
        const screen = document.getElementById("e08_constellation");
        if (!screen || screen.querySelector("[data-living-constellation-experience]")) {
            return;
        }

        const layer = document.createElement("aside");
        layer.className = "living-constellation-experience";
        layer.setAttribute("data-living-constellation-experience", "");
        layer.setAttribute("aria-label", "Experience vivante de la Constellation");
        layer.innerHTML = [
            "<section class=\"living-constellation-experience__quote\" data-lce-quote></section>",
            "<section class=\"living-constellation-experience__cards\" data-lce-cards aria-label=\"Resonances du jour\"></section>",
            "<section class=\"living-constellation-experience__response\" data-lce-response aria-live=\"polite\"></section>",
            "<section class=\"living-constellation-experience__detail\" data-lce-detail aria-live=\"polite\"></section>"
        ].join("");
        screen.appendChild(layer);
        state.elements.quote = layer.querySelector("[data-lce-quote]");
        state.elements.cards = layer.querySelector("[data-lce-cards]");
        state.elements.response = layer.querySelector("[data-lce-response]");
        state.elements.detail = layer.querySelector("[data-lce-detail]");
    }

    function render() {
        buildLayer();
        renderQuote();
        renderCards();
        queueCue("today", state.elements.quote, 7200);
        queueCue("resonances", state.elements.cards, 8600);
    }

    function renderQuote() {
        const date = new Date();
        const season = seasonFor(date);
        const moment = momentFor(date);
        const seasonal = state.data.daily.seasonalPhrases[season] || "";
        const momentPhrase = state.data.daily.momentPhrases[moment] || "";
        state.elements.quote.innerHTML = [
            "<span>Lieu vivant</span>",
            "<h2>Constellation Vivante</h2>",
            "<p>Les oeuvres, les archives, les images et les idees ne restent pas isolees. Ici, elles commencent a se repondre.</p>",
            `<blockquote>${escapeHtml(state.daily.quote)}</blockquote>`,
            `<p class="living-constellation-experience__whisper">${escapeHtml(seasonal || momentPhrase)}</p>`
        ].join("");
    }

    function renderCards() {
        const archive = state.data.mapping.mappings.find(item => item.id === "D010") || state.cards.archive;
        const cards = [
            {
                type: "Archive Vivante",
                title: archive.id,
                text: archive.label,
                href: "atelier/archives/d010.html",
                action: "Ouvrir D010"
            },
            {
                type: "Concept Vivant",
                title: state.cards.concept.name,
                text: "Une idee du Graphe Vivant revient aujourd'hui.",
                detailType: "concept"
            },
            {
                type: "Image patrimoniale",
                title: cleanTitle(state.cards.image.name),
                text: state.cards.image.subject || "Une image issue du patrimoine RV-090.",
                image: assetPath(state.cards.image),
                detailType: "image"
            },
            {
                type: "Oeuvre en resonance",
                title: cleanTitle(state.cards.work.title),
                text: "Une oeuvre deja reliee au patrimoine des Recits Vivants.",
                image: coverPath(state.cards.work),
                detailType: "work"
            }
        ];

        state.elements.cards.innerHTML = [
            "<h2>Resonances proposees</h2>",
            "<div class=\"living-constellation-experience__card-grid\">",
            cards.map((card, index) => [
            card.href
                ? `<a class="living-constellation-experience__card" href="${escapeHtml(card.href)}" data-lce-card="${index}">`
                : `<button type="button" class="living-constellation-experience__card" data-lce-card="${index}">`,
            `<span>${escapeHtml(card.type)}</span>`,
            `<h3>${escapeHtml(card.title)}</h3>`,
            `<p>${escapeHtml(card.text || "")}</p>`,
            card.image ? `<img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title)}">` : "",
            card.action ? `<em>${escapeHtml(card.action)}</em>` : "<em>Explorer</em>",
            card.href ? "</a>" : "</button>"
            ].join("")).join(""),
            "</div>"
        ].join("");

        state.elements.cards.querySelectorAll("[data-lce-card]").forEach(button => {
            const card = cards[Number(button.getAttribute("data-lce-card"))];
            if (!card || card.href) return;
            button.addEventListener("click", () => renderDetailCard(card));
        });
    }

    function renderDetailCard(card) {
        closeResponse();
        const image = card.image
            ? `<img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title)}">`
            : "";
        const context = detailContext(card.detailType);
        state.elements.detail.innerHTML = [
            "<button type=\"button\" class=\"living-constellation-experience__close\" data-lce-close aria-label=\"Fermer\">x</button>",
            `<span>${escapeHtml(card.type)}</span>`,
            `<h2>${escapeHtml(card.title)}</h2>`,
            image,
            `<p>${escapeHtml(card.text || "")}</p>`,
            `<p>${escapeHtml(context)}</p>`
        ].join("");
        registerOverlay("RELATION", closeDetail, state.elements.detail);
        state.elements.detail.classList.add("is-visible");
        state.elements.detail.querySelector("[data-lce-close]").addEventListener("click", () => {
            closeDetail();
            clearOverlay("RELATION");
        });
    }

    function registerOverlay(id, close, element) {
        if (!window.LivingOverlayManager) return;
        window.LivingOverlayManager.activate(id, {
            close,
            element
        });
    }

    function clearOverlay(id) {
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.clear(id);
        }
    }

    function queueCue(id, element, duration) {
        if (window.LivingOverlayManager) {
            window.LivingOverlayManager.cue(id, element, { duration });
        }
    }

    function closeDetail() {
        if (state.elements.detail) {
            state.elements.detail.classList.remove("is-visible");
        }
    }

    function closeResponse() {
        if (state.elements.response) {
            state.elements.response.classList.remove("is-visible");
        }
        window.clearTimeout(state.responseTimer);
    }

    function detailContext(type) {
        if (type === "concept") {
            return "Cette fiche resume une idee reliee aux archives, aux oeuvres et aux salles du Graphe Vivant.";
        }
        if (type === "image") {
            return "Cette image appartient au patrimoine des Recits Vivants et peut accompagner plusieurs lectures.";
        }
        return "Cette oeuvre entre en resonance avec les archives, les concepts et les chemins disponibles dans la Constellation.";
    }

    function coverPath(work) {
        if (!work) return "";
        const direct = firstValue(work, ["src", "cover", "coverUrl", "image", "urlImage", "thumbnail"]);
        if (direct) return assetPath(direct);
        const assetId = work.coverImage || work.coverAsset || work.imageId;
        const asset = findAsset(assetId);
        return assetPath(asset);
    }

    function findAsset(id) {
        if (!id || !state.data || !state.data.assets || !Array.isArray(state.data.assets.assets)) return null;
        return state.data.assets.assets.find(asset => asset.id === id) || null;
    }

    function firstValue(source, keys) {
        for (let index = 0; index < keys.length; index += 1) {
            const value = source && source[keys[index]];
            if (typeof value === "string" && value.trim()) return value.trim();
        }
        return "";
    }

    function assetPath(asset) {
        const path = typeof asset === "string"
            ? asset
            : firstValue(asset, ["src", "cover", "coverUrl", "image", "urlImage", "extractedPath", "path", "file", "filename"]);
        if (!path) return "";
        if (/^https?:\/\//.test(path)) return encodeURI(path);
        if (path.indexOf("raw.githubusercontent.com/") === 0) return encodeURI("https://" + path);
        return encodeURI(path);
    }

    function bindSharing() {
        const button = document.getElementById("shareStoryButton");
        const textarea = document.getElementById("storyInput");
        if (!button || !textarea) return;

        button.addEventListener("click", () => {
            const text = textarea.value.trim();
            if (!text) return;
            setTimeout(() => renderShareResponse(text), 80);
        }, true);
    }

    function renderShareResponse(text) {
        const traveler = window.TravelerConstellation && window.TravelerConstellation.readMemory
            ? window.TravelerConstellation.readMemory()
            : readJson(TRAVELER_KEY, {});
        const fragment = Array.isArray(traveler.fragments) ? traveler.fragments[0] : null;
        const chips = responseChips(fragment);
        const stage = stageForCount(Array.isArray(traveler.fragments) ? traveler.fragments.length : state.memory.storyCount);

        state.memory.storyCount = Array.isArray(traveler.fragments) ? traveler.fragments.length : state.memory.storyCount + 1;
        state.memory.conceptsSeen = mergeIds(state.memory.conceptsSeen, fragment && fragment.concepts);
        state.memory.archivesOpened = mergeIds(state.memory.archivesOpened, chips.archives.map(item => item.id));
        state.memory.worksDiscovered = mergeIds(state.memory.worksDiscovered, chips.works.map(item => item.id));
        state.memory.imagesMet = mergeIds(state.memory.imagesMet, chips.images.map(item => item.id));
        writeJson(MEMORY_KEY, state.memory);

        state.elements.response.innerHTML = [
            `<h2>${escapeHtml(stage)}</h2>`,
            "<p>Votre recit rejoint desormais la Constellation.</p>",
            chips.all.length ? "<p>Ce fragment resonne avec :</p>" : "",
            chips.all.length ? `<div class="living-constellation-experience__chips">${chips.all.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : "",
            "<p>Le territoire garde cette trace uniquement dans ce navigateur.</p>"
        ].join("");
        registerOverlay("NOTICE", closeResponse, state.elements.response);
        state.elements.response.classList.add("is-visible");
        window.clearTimeout(state.responseTimer);
        state.responseTimer = window.setTimeout(() => {
            closeResponse();
            clearOverlay("NOTICE");
        }, 9000);
    }

    function responseChips(fragment) {
        const resonance = fragment && fragment.resonance ? fragment.resonance : {};
        const concepts = (resonance.concepts || []).slice(0, 2);
        const archives = (resonance.archives || []).slice(0, 1);
        const works = (resonance.works || []).slice(0, 1);
        const images = (resonance.images || []).slice(0, 1);
        const rooms = (resonance.rooms || []).slice(0, 1);
        const all = []
            .concat(concepts.map(item => item.label || item.id))
            .concat(archives.map(item => item.id))
            .concat(works.map(item => cleanTitle(item.label || item.id)))
            .concat(rooms.map(item => item.label || item.id));
        return { concepts, archives, works, images, rooms, all };
    }

    function mergeIds(existing, incoming) {
        return Array.from(new Set((existing || []).concat(incoming || []).filter(Boolean)));
    }

    function stageForCount(count) {
        if (count >= 7) return "✦ Constellation personnelle";
        if (count >= 3) return "✦ Trois etoiles";
        return "✦ Premiere etoile";
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function init() {
        Promise.all([
            fetchJson(DATA_PATHS.daily),
            fetchJson(DATA_PATHS.concepts),
            fetchJson(DATA_PATHS.works),
            fetchJson(DATA_PATHS.assets),
            fetchJson(DATA_PATHS.mapping)
        ]).then(([daily, concepts, works, assets, mapping]) => {
            const date = new Date();
            state.data = { daily, concepts, works, assets, mapping };
            state.memory = readMemory();
            state.daily = pickDaily(date);
            state.cards = selectCards(date, state.daily);
            render();
            bindSharing();
        }).catch(error => {
            console.warn(error.message);
        });
    }

    window.LivingConstellationExperience = {
        init,
        readMemory
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
