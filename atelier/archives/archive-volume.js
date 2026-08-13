(function () {
    const ARCHIVES = [
        ["d001", "markdown/D001_Pourquoi_les_Recits_Vivants.md"],
        ["d002", "markdown/D002_Naissance_de_la_pensee_dialogique.md"],
        ["d003", "markdown/D003_Naissance_de_la_Cosmologie_des_Recits_Vivants.md"],
        ["d004", "markdown/D004_Naissance_des_Cartes_Narratives.md"],
        ["d005", "markdown/D005_Naissance_de_lOeuvre_immersive.md"],
        ["d006", "markdown/D006_Naissance_de_Makerland.md"],
        ["d007", "markdown/D007_Naissance_de_la_Bibliotheque_Vivante.md"],
        ["d008", "markdown/D008_Naissance_de_la_Boussole_Vivante.md"],
        ["d009", "markdown/D009_Naissance_de_lAtelier_IA.md"],
        ["d010", "markdown/D010_Naissance_des_Archives_Vivantes.md"]
    ];
    const CYCLE_KEY = "makerland:living-cycle";

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    }

    function readCycle() {
        try {
            return JSON.parse(localStorage.getItem(CYCLE_KEY)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeCycle(value) {
        try {
            localStorage.setItem(CYCLE_KEY, JSON.stringify(value));
        } catch (error) {
            return;
        }
    }

    function rememberArchive(record) {
        const cycle = readCycle();
        const id = record.id.toUpperCase();
        const archives = cycle.archiveDialogs && typeof cycle.archiveDialogs === "object"
            ? cycle.archiveDialogs
            : {};

        archives[id] = {
            id,
            title: record.meta.title,
            status: record.meta.status || "Archive Vivante",
            lastVisited: new Date().toISOString(),
            href: "atelier/archives/" + record.id + ".html"
        };

        cycle.archiveDialogs = archives;
        cycle.dialogues = Array.isArray(cycle.dialogues) ? cycle.dialogues : [];

        if (!cycle.dialogues.includes(id)) {
            cycle.dialogues.push(id);
        }

        writeCycle(cycle);
    }

    function markdownPath(path) {
        return document.body.dataset.archiveDepth === "detail"
            ? path
            : path;
    }

    function fetchMarkdown(path) {
        return fetch(markdownPath(path)).then(response => {
            if (!response.ok) {
                throw new Error("Archive introuvable : " + path);
            }

            return response.text();
        });
    }

    function parseMetadata(markdown) {
        const lines = markdown.split(/\r?\n/);
        const titleLine = lines.find(line => line.indexOf("# ") === 0) || "";
        const title = titleLine.replace(/^#\s+/, "").trim();
        const statusIndex = lines.findIndex(line => line.trim() === "## Statut");
        const noteIndex = lines.findIndex(line => line.trim() === "## Note");

        return {
            title,
            status:
                statusIndex >= 0 && lines[statusIndex + 1]
                    ? lines[statusIndex + 1].trim()
                    : "Archive Vivante",
            note:
                noteIndex >= 0 && lines[noteIndex + 1]
                    ? lines.slice(noteIndex + 1).join("\n").trim()
                    : ""
        };
    }

    function markdownToHtml(markdown) {
        const container = createElement("div", "archive-markdown");
        const lines = markdown.split(/\r?\n/);
        let paragraph = [];
        let list = null;

        function flushParagraph() {
            if (!paragraph.length) {
                return;
            }

            const p = createElement("p", "", paragraph.join(" "));
            container.appendChild(p);
            paragraph = [];
        }

        function flushList() {
            if (list) {
                container.appendChild(list);
                list = null;
            }
        }

        lines.forEach(line => {
            const trimmed = line.trim();

            if (!trimmed) {
                flushParagraph();
                flushList();
                return;
            }

            if (trimmed.indexOf("# ") === 0) {
                flushParagraph();
                flushList();
                container.appendChild(createElement("h1", "", trimmed.replace(/^#\s+/, "")));
                return;
            }

            if (trimmed.indexOf("## ") === 0) {
                flushParagraph();
                flushList();
                container.appendChild(createElement("h2", "", trimmed.replace(/^##\s+/, "")));
                return;
            }

            if (trimmed.indexOf(">") === 0) {
                flushParagraph();
                flushList();
                container.appendChild(
                    createElement("blockquote", "", trimmed.replace(/^>\s?/, ""))
                );
                return;
            }

            if (trimmed.indexOf("- ") === 0) {
                flushParagraph();
                if (!list) {
                    list = createElement("ul", "");
                }
                list.appendChild(createElement("li", "", trimmed.replace(/^-\s+/, "")));
                return;
            }

            paragraph.push(trimmed);
        });

        flushParagraph();
        flushList();
        return container;
    }

    function extractBlockquotes(markdown) {
        return markdown
            .split(/\r?\n/)
            .filter(line => line.trim().indexOf(">") === 0)
            .map(line => line.trim().replace(/^>\s?/, ""))
            .filter(Boolean);
    }

    function detailHref(index) {
        return ARCHIVES[index][0] + ".html";
    }

    function renderArchiveNav(index) {
        const nav = createElement("nav", "archive-volume-nav");
        nav.setAttribute("aria-label", "Navigation des Archives Vivantes");

        if (index > 0) {
            const previous = createElement("a", "placeholder-return", "Archive precedente");
            previous.href = detailHref(index - 1);
            nav.appendChild(previous);
        }

        if (index < ARCHIVES.length - 1) {
            const next = createElement("a", "placeholder-return", "Archive suivante");
            next.href = detailHref(index + 1);
            nav.appendChild(next);
        }

        [
            ["Retour Archives", "index.html"],
            ["Retour Atelier", "../"],
            ["Retour Bibliotheque", "../../index.html"],
            ["Retour Makerland", "../../index.html"]
        ].forEach(link => {
            const anchor = createElement("a", "placeholder-return", link[0]);
            anchor.href = link[1];
            nav.appendChild(anchor);
        });

        return nav;
    }

    function renderIndex(records) {
        const host = document.querySelector("[data-archive-list]");
        const components = window.ArchiveComponents;

        if (!host || !components) {
            return;
        }

        records.forEach(record => {
            host.appendChild(
                components.createArchiveCard({
                    title: record.meta.title,
                    type: record.id.toUpperCase(),
                    date: "Volume I",
                    origin: "Archives Vivantes de Makerland",
                    status: record.meta.status,
                    summary: record.meta.note,
                    href: record.href,
                    linkLabel: "Explorer"
                })
            );
        });
    }

    function renderDetail(record, index) {
        const host = document.querySelector("[data-archive-detail]");
        const components = window.ArchiveComponents;

        if (!host || !components) {
            return;
        }

        host.appendChild(
            components.createArchiveCard({
                title: record.meta.title,
                type: record.id.toUpperCase(),
                date: "Volume I",
                origin: "Archives Vivantes de Makerland",
                status: record.meta.status,
                summary: "Archive officielle issue du Volume I."
            })
        );
        host.appendChild(markdownToHtml(record.markdown));
        extractBlockquotes(record.markdown).forEach(quote => {
            host.appendChild(components.createQuote({ text: quote }));
        });
        host.appendChild(components.createFragment({ text: record.meta.note }));
        host.appendChild(renderArchiveNav(index));
    }

    function init() {
        const isIndex = Boolean(document.querySelector("[data-archive-list]"));
        const detailId = document.body.dataset.archiveId;

        Promise.all(
            ARCHIVES.map(item =>
                fetchMarkdown(item[1]).then(markdown => ({
                    id: item[0],
                    path: item[1],
                    href: item[0] + ".html",
                    markdown,
                    meta: parseMetadata(markdown)
                }))
            )
        )
            .then(records => {
                if (isIndex) {
                    renderIndex(records);
                    return;
                }

                const index = records.findIndex(record => record.id === detailId);
                if (index >= 0) {
                    rememberArchive(records[index]);
                    renderDetail(records[index], index);
                }
            })
            .catch(error => {
                const host =
                    document.querySelector("[data-archive-detail]") ||
                    document.querySelector("[data-archive-list]");
                if (host) {
                    host.appendChild(createElement("p", "placeholder-note", error.message));
                }
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
