/* Makerland — sauvegarde portable locale V1 */
const MakerlandMemoryBackup = (() => {
    const FORMAT = "makerland-backup-v1";
    const VERSION = 1;
    const MAX_BACKUP_BYTES = 4 * 1024 * 1024;

    // Ce registre est volontairement fermé : aucune donnée d'un autre site n'est exportée.
    const MEMORY_REGISTRY = Object.freeze([
        { key: "makerland.firstJourney", label: "Premier Voyage", kind: "parcours" },
        { key: "makerland.narrativeMemory.v1", label: "Mémoire narrative", kind: "parcours" },
        { key: "makerland_living_journey", label: "Voyage vivant", kind: "parcours" },
        { key: "makerland:living-cycle", label: "Cycle vivant", kind: "parcours" },
        { key: "makerland:traveler-constellation", label: "Constellation du Voyageur", kind: "parcours" },
        { key: "makerland:living-seasons", label: "Saisons", kind: "parcours" },
        { key: "makerland.traveler.constellation", label: "Expérience de Constellation", kind: "parcours" },
        { key: "makerland.living.paths", label: "Chemins vivants", kind: "parcours" },
        { key: "makerland.guardianEncounters.v1", label: "Rencontres avec les gardiens", kind: "souvenir" },
        { key: "makerland.guardianWhispers", label: "Murmures des gardiens", kind: "souvenir" },
        { key: "makerland.livingGuide.memory", label: "Repères du guide vivant", kind: "parcours" },
        { key: "recitsVivants.constellation.memory", label: "Mémoire de Constellation", kind: "parcours" },
        { key: "makerland_stories", label: "Récits personnels partagés à la Constellation", kind: "texte-personnel" },
        { key: "makerland:traveling-fragment:last", label: "Dernier fragment voyageur", kind: "souvenir" }
    ]);

    const SUPPORTED_KEYS = Object.freeze(MEMORY_REGISTRY.map(entry => entry.key));

    function prepareBackup({ storage = window.localStorage, now = new Date() } = {}) {
        if (!storage || typeof storage.getItem !== "function") {
            throw new Error("Le stockage local n'est pas disponible.");
        }

        const memories = {};
        const warnings = [];

        MEMORY_REGISTRY.forEach(entry => {
            let raw;
            try {
                raw = storage.getItem(entry.key);
            } catch (error) {
                throw new Error(`Lecture impossible pour « ${entry.label} ».`);
            }

            if (raw === null) return;
            memories[entry.key] = raw;

            try {
                JSON.parse(raw);
            } catch (error) {
                warnings.push({ key: entry.key, code: "invalid-json-preserved" });
            }
        });

        const backup = {
            format: FORMAT,
            version: VERSION,
            createdAt: now.toISOString(),
            supportedKeys: [...SUPPORTED_KEYS],
            savedKeys: Object.keys(memories),
            memories,
            warnings
        };

        const serialized = JSON.stringify(backup, null, 2);
        if (byteLength(serialized) > MAX_BACKUP_BYTES) {
            throw new Error("La sauvegarde dépasse la taille portable maximale de 4 Mo.");
        }
        if (!validateBackup(backup)) {
            throw new Error("La sauvegarde préparée n'est pas conforme au format Makerland V1.");
        }

        return { backup, serialized };
    }

    function validateBackup(backup) {
        if (!isPlainObject(backup) || backup.format !== FORMAT || backup.version !== VERSION) return false;
        if (!isIsoDate(backup.createdAt) || !Array.isArray(backup.supportedKeys) || !Array.isArray(backup.savedKeys)) return false;
        if (!isPlainObject(backup.memories) || !Array.isArray(backup.warnings)) return false;
        if (backup.supportedKeys.length !== SUPPORTED_KEYS.length || backup.supportedKeys.some((key, index) => key !== SUPPORTED_KEYS[index])) return false;
        if (new Set(backup.savedKeys).size !== backup.savedKeys.length) return false;
        if (backup.savedKeys.some(key => !SUPPORTED_KEYS.includes(key))) return false;
        if (Object.keys(backup.memories).some(key => !backup.savedKeys.includes(key) || typeof backup.memories[key] !== "string")) return false;
        if (backup.savedKeys.some(key => typeof backup.memories[key] !== "string")) return false;
        return backup.warnings.every(warning => isPlainObject(warning) && SUPPORTED_KEYS.includes(warning.key) && warning.code === "invalid-json-preserved");
    }

    function downloadBackup(prepared, documentRef = document, urlApi = URL, filename = null) {
        if (!prepared || !validateBackup(prepared.backup) || typeof prepared.serialized !== "string") {
            throw new Error("La sauvegarde à télécharger est invalide.");
        }
        if (typeof Blob === "undefined" || !urlApi || typeof urlApi.createObjectURL !== "function") {
            throw new Error("Le téléchargement local n'est pas disponible dans ce navigateur.");
        }

        const blob = new Blob([prepared.serialized], { type: "application/json;charset=utf-8" });
        const url = urlApi.createObjectURL(blob);
        const link = documentRef.createElement("a");
        const day = prepared.backup.createdAt.slice(0, 10);
        link.href = url;
        link.download = filename || `makerland-souvenirs-${day}.json`;
        link.hidden = true;
        documentRef.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => urlApi.revokeObjectURL(url), 1000);
    }

    function byteLength(value) {
        if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(value).length;
        return value.length;
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
    }

    function isIsoDate(value) {
        return typeof value === "string" && Number.isFinite(Date.parse(value));
    }

    function init() {
        const trigger = document.getElementById("memoryBackupButton");
        const panel = document.getElementById("memoryBackupPanel");
        const close = document.getElementById("memoryBackupClose");
        const exportButton = document.getElementById("memoryBackupExport");
        const status = document.getElementById("memoryBackupStatus");
        if (!trigger || !panel || !close || !exportButton || !status) return;

        const setOpen = open => {
            panel.hidden = !open;
            trigger.setAttribute("aria-expanded", String(open));
            if (open) exportButton.focus();
        };

        trigger.addEventListener("click", () => setOpen(panel.hidden));
        close.addEventListener("click", () => setOpen(false));
        panel.querySelectorAll("[data-memory-backup-target]").forEach(link => {
            link.addEventListener("click", () => {
                const target = document.getElementById(link.dataset.memoryBackupTarget);
                if (!target) return;
                panel.scrollTop = Math.max(0, target.offsetTop - panel.offsetTop - 8);
                target.focus({ preventScroll: true });
            });
        });
        exportButton.addEventListener("click", () => {
            status.textContent = "Préparation de votre fichier local…";
            status.dataset.state = "working";
            try {
                const prepared = prepareBackup();
                downloadBackup(prepared);
                const count = prepared.backup.savedKeys.length;
                status.textContent = `${count} mémoire${count > 1 ? "s" : ""} sauvegardée${count > 1 ? "s" : ""} dans un fichier local.`;
                status.dataset.state = "success";
            } catch (error) {
                status.textContent = `Aucun fichier n'a été créé : ${error.message}`;
                status.dataset.state = "error";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    return { FORMAT, VERSION, MAX_BACKUP_BYTES, MEMORY_REGISTRY, prepareBackup, validateBackup, downloadBackup };
})();

window.MakerlandMemoryBackup = MakerlandMemoryBackup;
