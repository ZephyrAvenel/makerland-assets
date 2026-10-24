/* Makerland — archives manuelles locales V1 */
const MakerlandMemoryArchives = (() => {
    const backupApi = window.MakerlandMemoryBackup;
    const importApi = window.MakerlandMemoryImport;
    const { FORMAT, VERSION, MAX_BACKUP_BYTES, prepareBackup, validateBackup, downloadBackup } = backupApi;
    const ARCHIVE_FORMAT = "makerland-memory-archive-v1";
    const DB_NAME = "makerland-memory-archives";
    const STORE_NAME = "archives";
    const MAX_NAME_LENGTH = 80;

    function validateName(value) {
        const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
        if (!name) throw new Error("Donnez un nom à cette archive.");
        if (name.length > MAX_NAME_LENGTH) throw new Error(`Le nom d'une archive ne peut pas dépasser ${MAX_NAME_LENGTH} caractères.`);
        if (/[\u0000-\u001f\u007f]/.test(name)) throw new Error("Le nom contient un caractère non pris en charge.");
        return name;
    }

    function validateArchive(record) {
        if (!isPlainObject(record) || record.format !== ARCHIVE_FORMAT || record.version !== VERSION
            || typeof record.id !== "string" || !record.id.length || typeof record.name !== "string"
            || !isIsoDate(record.createdAt) || !Number.isInteger(record.memoryCount) || record.memoryCount <= 0
            || !validateBackup(record.backup) || record.memoryCount !== record.backup.savedKeys.length) return false;
        try { return record.name === validateName(record.name); } catch (error) { return false; }
    }

    function createArchive({ name, storage = window.localStorage, repository, now = new Date(), id = createId() } = {}) {
        if (!repository || typeof repository.add !== "function" || typeof repository.get !== "function") {
            return Promise.reject(new Error("Le stockage des archives n'est pas disponible."));
        }
        let prepared;
        try { prepared = prepareBackup({ storage, now }); } catch (error) { return Promise.reject(error); }
        if (!prepared.backup.savedKeys.length) return Promise.reject(new Error("Aucun souvenir Makerland n'est présent : l'archive n'a pas été créée."));
        const record = {
            format: ARCHIVE_FORMAT,
            version: VERSION,
            id,
            name: validateName(name),
            createdAt: now.toISOString(),
            memoryCount: prepared.backup.savedKeys.length,
            backup: prepared.backup
        };
        if (!validateArchive(record)) return Promise.reject(new Error("L'archive préparée n'est pas valide."));
        return repository.add(record)
            .then(() => repository.get(record.id))
            .then(saved => {
                if (!validateArchive(saved) || JSON.stringify(saved) !== JSON.stringify(record)) throw new Error("L'archive n'a pas pu être relue après son enregistrement.");
                return saved;
            });
    }

    function listArchives({ repository } = {}) {
        if (!repository || typeof repository.list !== "function") return Promise.reject(new Error("Le stockage des archives n'est pas disponible."));
        return repository.list().then(records => {
            if (!Array.isArray(records)) throw new Error("La liste des archives est illisible.");
            return records.filter(validateArchive).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
        });
    }

    function readArchive(id, { repository } = {}) {
        if (typeof id !== "string" || !id || !repository || typeof repository.get !== "function") return Promise.reject(new Error("Cette archive ne peut pas être lue."));
        return repository.get(id).then(record => {
            if (!record) throw new Error("Cette archive n'existe plus.");
            if (!validateArchive(record)) throw new Error("Cette archive est illisible ou incompatible ; elle n'est pas restaurée.");
            return record;
        });
    }

    function inspectArchive(id, { repository, storage = window.localStorage } = {}) {
        return readArchive(id, { repository }).then(record => ({ record, inspection: importApi.inspectImport(record.backup, { storage }) }));
    }

    function restoreArchive(archiveInspection, { storage = window.localStorage, now = new Date() } = {}) {
        if (!archiveInspection || !validateArchive(archiveInspection.record)) throw new Error("L'examen de l'archive est invalide.");
        return importApi.applyImport(archiveInspection.inspection, { storage, now });
    }

    function prepareArchiveExport(id, { repository } = {}) {
        return readArchive(id, { repository }).then(record => {
            const serialized = JSON.stringify(record.backup, null, 2);
            if (byteLength(serialized) > MAX_BACKUP_BYTES) throw new Error("Cette archive dépasse la taille portable maximale.");
            return { record, prepared: { backup: record.backup, serialized } };
        });
    }

    function exportArchive(id, { repository, documentRef = document, urlApi = URL } = {}) {
        return prepareArchiveExport(id, { repository }).then(value => {
            downloadBackup(value.prepared, documentRef, urlApi, archiveFilename(value.record));
            return value.record;
        });
    }

    function deleteArchive(id, { repository } = {}) {
        if (typeof id !== "string" || !id || !repository || typeof repository.delete !== "function" || typeof repository.get !== "function") return Promise.reject(new Error("Cette archive ne peut pas être supprimée."));
        return repository.get(id).then(record => {
            if (!record) throw new Error("Cette archive n'existe plus.");
            return repository.delete(id).then(() => repository.get(id)).then(remaining => {
                if (remaining !== undefined && remaining !== null) throw new Error("L'archive n'a pas pu être supprimée.");
                return record;
            });
        });
    }

    function openRepository(indexedDb = window.indexedDB) {
        if (!indexedDb || typeof indexedDb.open !== "function") return Promise.reject(new Error("Les archives locales ne sont pas disponibles dans ce navigateur."));
        return new Promise((resolve, reject) => {
            let request;
            try { request = indexedDb.open(DB_NAME, 1); } catch (error) { reject(new Error("L'ouverture des archives locales a échoué.")); return; }
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
            };
            request.onerror = () => reject(new Error("L'ouverture des archives locales a échoué."));
            request.onblocked = () => reject(new Error("Les archives locales sont bloquées par une autre page."));
            request.onsuccess = () => resolve(indexedRepository(request.result));
        });
    }

    function indexedRepository(db) {
        function request(mode, method, value) {
            return new Promise((resolve, reject) => {
                let tx;
                try { tx = db.transaction(STORE_NAME, mode); } catch (error) { reject(new Error("La transaction d'archive n'a pas pu démarrer.")); return; }
                const store = tx.objectStore(STORE_NAME);
                tx.onabort = tx.onerror = () => reject(new Error("La transaction d'archive a échoué."));
                let operation;
                try { operation = arguments.length === 2 ? store[method]() : store[method](value); } catch (error) { reject(new Error("L'opération sur l'archive a échoué.")); return; }
                operation.onsuccess = () => resolve(operation.result);
                operation.onerror = () => reject(new Error("L'opération sur l'archive a échoué."));
            });
        }
        return {
            add(record) { return request("readwrite", "add", record); },
            get(id) { return request("readonly", "get", id); },
            list() { return request("readonly", "getAll"); },
            delete(id) { return request("readwrite", "delete", id); }
        };
    }

    function archiveFilename(record) {
        const safeName = record.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "archive";
        return `makerland-archive-${safeName}-${record.createdAt.slice(0, 10)}.json`;
    }

    function createId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
        return `archive-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function renderArchivePreview(container, value) {
        container.replaceChildren();
        const title = document.createElement("p");
        title.textContent = `Archive « ${value.record.name} », créée le ${new Date(value.record.createdAt).toLocaleString("fr-FR")} : ${value.record.memoryCount} mémoire${value.record.memoryCount > 1 ? "s" : ""}.`;
        const list = document.createElement("ul");
        value.inspection.changes.forEach(change => {
            const item = document.createElement("li");
            item.textContent = `${change.label} : ${change.action === "add" ? "ajoutée" : change.action === "replace" ? "remplacée" : "déjà identique"}.`;
            list.appendChild(item);
        });
        const warning = document.createElement("p");
        warning.textContent = value.inspection.personalTextCount ? "Cette archive peut contenir des textes personnels, qui ne sont pas affichés ici." : "Les mémoires absentes de l'archive resteront inchangées.";
        container.append(title, list, warning);
    }

    function init() {
        const nameInput = document.getElementById("memoryArchiveName");
        const createButton = document.getElementById("memoryArchiveCreate");
        const list = document.getElementById("memoryArchiveList");
        const preview = document.getElementById("memoryArchivePreview");
        const confirm = document.getElementById("memoryArchiveConfirm");
        const restore = document.getElementById("memoryArchiveRestore");
        const cancel = document.getElementById("memoryArchiveCancel");
        const status = document.getElementById("memoryArchiveStatus");
        if (!nameInput || !createButton || !list || !preview || !confirm || !restore || !cancel || !status) return;
        let repository = null;
        let selected = null;
        const setStatus = (message, state = "") => { status.textContent = message; status.dataset.state = state; };
        const resetInspection = () => { selected = null; confirm.checked = false; restore.disabled = true; preview.hidden = true; preview.replaceChildren(); };
        const renderList = async () => {
            list.replaceChildren();
            const archives = await listArchives({ repository });
            if (!archives.length) {
                const empty = document.createElement("p"); empty.className = "memory-archive__empty";
                empty.textContent = "Vous n'avez pas encore créé d'archive. Vous pourrez conserver ici un moment de votre parcours lorsque vous le souhaiterez.";
                list.appendChild(empty); return;
            }
            archives.forEach(record => {
                const item = document.createElement("article"); item.className = "memory-archive__item";
                const title = document.createElement("h4"); title.textContent = record.name;
                const details = document.createElement("p"); details.textContent = `${new Date(record.createdAt).toLocaleString("fr-FR")} · ${record.memoryCount} mémoire${record.memoryCount > 1 ? "s" : ""}`;
                const actions = document.createElement("div"); actions.className = "memory-backup-panel__actions";
                const examine = document.createElement("button"); examine.type = "button"; examine.className = "memory-backup-panel__secondary"; examine.textContent = "Examiner";
                examine.addEventListener("click", async () => { try { selected = await inspectArchive(record.id, { repository }); renderArchivePreview(preview, selected); preview.hidden = false; restore.disabled = !confirm.checked; setStatus("Archive examinée. Confirmez la restauration si vous souhaitez continuer.", "success"); } catch (error) { resetInspection(); setStatus(error.message, "error"); } });
                const exportButton = document.createElement("button"); exportButton.type = "button"; exportButton.className = "memory-backup-panel__secondary"; exportButton.textContent = "Exporter";
                exportButton.addEventListener("click", async () => {
                    try {
                        const prepared = await prepareArchiveExport(record.id, { repository });
                        if (typeof Blob === "undefined" || !URL || typeof URL.createObjectURL !== "function") throw new Error("Le téléchargement local n'est pas disponible dans ce navigateur.");
                        const link = document.createElement("a");
                        const url = URL.createObjectURL(new Blob([prepared.prepared.serialized], { type: "application/json;charset=utf-8" }));
                        link.className = "memory-backup-panel__secondary";
                        link.href = url;
                        link.download = archiveFilename(prepared.record);
                        link.textContent = "Télécharger cette archive";
                        link.addEventListener("click", () => { setStatus("L'archive est téléchargée dans un fichier local.", "success"); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }, { once: true });
                        exportButton.replaceWith(link);
                        setStatus("Archive prête : choisissez « Télécharger cette archive » pour enregistrer le fichier.", "success");
                    } catch (error) { setStatus(error.message, "error"); }
                }, { once: true });
                const remove = document.createElement("button"); remove.type = "button"; remove.className = "memory-backup-panel__secondary"; remove.textContent = "Supprimer";
                remove.addEventListener("click", () => {
                    const confirmRemove = document.createElement("button"); confirmRemove.type = "button"; confirmRemove.className = "memory-backup-panel__secondary"; confirmRemove.textContent = `Confirmer la suppression de « ${record.name} »`;
                    confirmRemove.addEventListener("click", async () => { try { await deleteArchive(record.id, { repository }); resetInspection(); await renderList(); setStatus("L'archive a été supprimée à votre demande.", "success"); } catch (error) { setStatus(error.message, "error"); } });
                    remove.replaceWith(confirmRemove);
                });
                actions.append(examine, exportButton, remove); item.append(title, details, actions); list.appendChild(item);
            });
        };
        createButton.addEventListener("click", async () => { try { const record = await createArchive({ name: nameInput.value, repository }); nameInput.value = ""; await renderList(); setStatus(`L'archive « ${record.name} » a été créée et relue localement.`, "success"); } catch (error) { setStatus(error.message, "error"); } });
        confirm.addEventListener("change", () => { restore.disabled = !selected || !confirm.checked; });
        cancel.addEventListener("click", () => { resetInspection(); setStatus("Restauration d'archive annulée avant toute écriture."); });
        restore.addEventListener("click", () => { if (!selected || !confirm.checked) { setStatus("La confirmation explicite est nécessaire.", "error"); return; } try { const result = restoreArchive(selected); setStatus(`${result.changedKeys.length} mémoire${result.changedKeys.length > 1 ? "s" : ""} restaurée${result.changedKeys.length > 1 ? "s" : ""}. Un point de retour local est conservé.`, "success"); resetInspection(); } catch (error) { setStatus(error.message, "error"); } });
        openRepository().then(value => { repository = value; return renderList(); }).catch(error => { createButton.disabled = true; setStatus(`${error.message} Aucune archive n'a été créée.`, "error"); });
    }

    function byteLength(value) { return typeof TextEncoder !== "undefined" ? new TextEncoder().encode(value).length : value.length; }
    function isPlainObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]"; }
    function isIsoDate(value) { return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value; }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
    return { ARCHIVE_FORMAT, DB_NAME, STORE_NAME, MAX_NAME_LENGTH, validateName, validateArchive, createArchive, listArchives, readArchive, inspectArchive, restoreArchive, prepareArchiveExport, exportArchive, deleteArchive, openRepository, archiveFilename };
})();
window.MakerlandMemoryArchives = MakerlandMemoryArchives;
