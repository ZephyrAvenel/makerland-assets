/* Makerland — import local récupérable V1 */
const MakerlandMemoryImport = (() => {
    const backupApi = window.MakerlandMemoryBackup;
    const { FORMAT, VERSION, MAX_BACKUP_BYTES, MEMORY_REGISTRY, validateBackup } = backupApi;
    const SUPPORTED_KEYS = MEMORY_REGISTRY.map(entry => entry.key);
    const RECOVERY_KEY = "makerland.backup.recovery.v1";
    const RECOVERY_FORMAT = "makerland-backup-recovery-v1";
    const RECOVERY_VERSION = 1;

    function parseBackupText(text) {
        if (typeof text !== "string" || byteLength(text) > MAX_BACKUP_BYTES) throw new Error("Le fichier dépasse la taille portable maximale de 4 Mo.");
        let backup;
        try { backup = JSON.parse(text); } catch (error) { throw new Error("Ce fichier n'est pas un JSON Makerland lisible."); }
        if (!validateBackup(backup)) throw new Error("Cette sauvegarde n'est pas compatible avec le format Makerland V1.");
        return backup;
    }

    function inspectImport(backup, { storage = window.localStorage } = {}) {
        if (!validateBackup(backup)) throw new Error("Cette sauvegarde n'est pas compatible avec le format Makerland V1.");
        const recovery = getRecoveryStatus({ storage });
        if (recovery.state !== "none") throw new Error(recoveryMessage(recovery));
        const baseline = readValues(backup.savedKeys, storage);
        const changes = backup.savedKeys.map(key => ({
            key,
            label: entryFor(key).label,
            kind: entryFor(key).kind,
            action: baseline[key] === null ? "add" : baseline[key] === backup.memories[key] ? "unchanged" : "replace"
        }));
        return { backup, baseline, changes, personalTextCount: changes.filter(change => change.kind === "texte-personnel").length };
    }

    function applyImport(inspection, { storage = window.localStorage, now = new Date() } = {}) {
        if (!inspection || !validateBackup(inspection.backup) || !isPlainObject(inspection.baseline)) throw new Error("La prévisualisation n'est plus valide.");
        if (getRecoveryStatus({ storage }).state !== "none") throw new Error("Un point de retour doit être résolu avant une nouvelle restauration.");
        const current = readValues(inspection.backup.savedKeys, storage);
        if (!sameValues(current, inspection.baseline)) throw new Error("Les souvenirs locaux ont changé depuis l'examen : examinez de nouveau la sauvegarde.");
        const changedKeys = inspection.backup.savedKeys.filter(key => current[key] !== inspection.backup.memories[key]);
        const journal = {
            format: RECOVERY_FORMAT, version: RECOVERY_VERSION, status: "pending", createdAt: now.toISOString(),
            keys: [...inspection.backup.savedKeys], before: current, target: { ...inspection.backup.memories }, appliedKeys: []
        };
        writeJournal(journal, storage);
        try {
            for (const key of changedKeys) {
                storage.setItem(key, journal.target[key]);
                if (storage.getItem(key) !== journal.target[key]) throw new Error(`Vérification impossible pour « ${entryFor(key).label} ».`);
                journal.appliedKeys.push(key);
                writeJournal(journal, storage);
            }
            journal.status = "available";
            journal.completedAt = new Date().toISOString();
            writeJournal(journal, storage);
            return { ok: true, changedKeys, recoveryAvailable: true };
        } catch (error) {
            const rollback = restoreJournal(journal, storage, "rolled-back");
            if (rollback.ok) throw new Error(`La restauration a échoué ; l'état précédent a été rétabli. ${error.message}`);
            throw new Error(`La restauration a échoué et une récupération est nécessaire. ${error.message}`);
        }
    }

    function getRecoveryStatus({ storage = window.localStorage } = {}) {
        let raw;
        try { raw = storage.getItem(RECOVERY_KEY); } catch (error) { return { state: "unavailable" }; }
        if (raw === null) return { state: "none" };
        try { const journal = JSON.parse(raw); return validateJournal(journal) ? { state: "journal", journal } : { state: "invalid" }; } catch (error) { return { state: "invalid" }; }
    }

    function recoverPreviousState({ storage = window.localStorage } = {}) {
        const recovery = getRecoveryStatus({ storage });
        if (recovery.state !== "journal") throw new Error(recoveryMessage(recovery));
        const result = restoreJournal(recovery.journal, storage, "recovered");
        if (!result.ok) throw new Error("La récupération n'a pas pu restaurer toutes les valeurs. Le point de retour est conservé.");
        return { ok: true, restoredKeys: recovery.journal.keys };
    }

    function discardRecoveryPoint({ storage = window.localStorage } = {}) {
        const recovery = getRecoveryStatus({ storage });
        if (recovery.state !== "journal" || !["available", "recovered", "rolled-back"].includes(recovery.journal.status)) throw new Error("Aucun point de retour terminé ne peut être supprimé.");
        storage.removeItem(RECOVERY_KEY);
        if (storage.getItem(RECOVERY_KEY) !== null) throw new Error("Le point de retour n'a pas pu être supprimé.");
        return { ok: true };
    }

    function restoreJournal(journal, storage, status) {
        try {
            for (const key of journal.keys) {
                if (journal.before[key] === null) storage.removeItem(key); else storage.setItem(key, journal.before[key]);
                if (storage.getItem(key) !== journal.before[key]) throw new Error("Retour arrière incomplet.");
            }
            journal.status = status;
            journal.recoveredAt = new Date().toISOString();
            writeJournal(journal, storage);
            return { ok: true };
        } catch (error) {
            try { journal.status = "rollback-failed"; writeJournal(journal, storage); } catch (ignored) { /* le journal initial est conservé */ }
            return { ok: false, error };
        }
    }

    function writeJournal(journal, storage) {
        const raw = JSON.stringify(journal);
        if (byteLength(raw) > MAX_BACKUP_BYTES) throw new Error("Le point de retour dépasse la capacité sûre de cette restauration.");
        storage.setItem(RECOVERY_KEY, raw);
        if (storage.getItem(RECOVERY_KEY) !== raw) throw new Error("Le point de retour n'a pas pu être vérifié.");
    }

    function validateJournal(journal) {
        if (!isPlainObject(journal) || journal.format !== RECOVERY_FORMAT || journal.version !== RECOVERY_VERSION || !["pending", "available", "rolled-back", "recovered", "rollback-failed"].includes(journal.status)) return false;
        if (!isIsoDate(journal.createdAt) || !Array.isArray(journal.keys) || !isPlainObject(journal.before) || !isPlainObject(journal.target) || !Array.isArray(journal.appliedKeys)) return false;
        if (new Set(journal.keys).size !== journal.keys.length || journal.keys.some(key => !SUPPORTED_KEYS.includes(key))) return false;
        if (journal.keys.some(key => !(journal.before[key] === null || typeof journal.before[key] === "string") || typeof journal.target[key] !== "string")) return false;
        return journal.appliedKeys.every(key => journal.keys.includes(key));
    }

    function readValues(keys, storage) {
        if (!storage || typeof storage.getItem !== "function") throw new Error("Le stockage local n'est pas disponible.");
        const values = {};
        for (const key of keys) {
            try { values[key] = storage.getItem(key); } catch (error) { throw new Error(`Lecture impossible pour « ${entryFor(key).label} ».`); }
        }
        return values;
    }

    function renderPreview(container, inspection) {
        container.replaceChildren();
        const heading = document.createElement("p");
        heading.textContent = `Sauvegarde créée le ${new Date(inspection.backup.createdAt).toLocaleString("fr-FR")} : ${inspection.changes.length} mémoire${inspection.changes.length > 1 ? "s" : ""}.`;
        const list = document.createElement("ul");
        inspection.changes.forEach(change => { const item = document.createElement("li"); item.textContent = `${change.label} : ${change.action === "add" ? "ajoutée" : change.action === "replace" ? "remplacée" : "déjà identique"}.`; list.appendChild(item); });
        const note = document.createElement("p"); const absent = SUPPORTED_KEYS.length - inspection.changes.length;
        note.textContent = `${absent} mémoire${absent > 1 ? "s" : ""} absente${absent > 1 ? "s" : ""} du fichier restera/ont inchangée(s).${inspection.personalTextCount ? " Cette sauvegarde contient des textes personnels." : ""}`;
        container.append(heading, list, note);
    }

    function init() {
        const input = document.getElementById("memoryBackupFile"); const examine = document.getElementById("memoryBackupExamine");
        const restore = document.getElementById("memoryBackupRestore"); const cancel = document.getElementById("memoryBackupCancel");
        const confirm = document.getElementById("memoryBackupConfirm"); const preview = document.getElementById("memoryBackupPreview");
        const recovery = document.getElementById("memoryBackupRecovery"); const status = document.getElementById("memoryBackupStatus");
        if (!input || !examine || !restore || !cancel || !confirm || !preview || !recovery || !status) return;
        let inspection = null;
        const setStatus = (message, state = "") => { status.textContent = message; status.dataset.state = state; };
        const reset = ({ keepFile = false } = {}) => { inspection = null; if (!keepFile) input.value = ""; confirm.checked = false; restore.disabled = true; preview.hidden = true; preview.replaceChildren(); };
        const renderRecovery = () => {
            const current = getRecoveryStatus(); recovery.replaceChildren();
            if (current.state === "none") return;
            const message = document.createElement("p"); message.textContent = recoveryMessage(current); recovery.appendChild(message);
            if (current.state !== "journal") return;
            if (["pending", "rollback-failed", "available"].includes(current.journal.status)) {
                const recover = document.createElement("button"); recover.type = "button"; recover.className = "memory-backup-panel__secondary"; recover.textContent = "Récupérer l'état précédent";
                recover.addEventListener("click", () => { try { recoverPreviousState(); setStatus("L'état antérieur a été récupéré.", "success"); renderRecovery(); } catch (error) { setStatus(error.message, "error"); } }); recovery.appendChild(recover);
            }
            if (["available", "recovered", "rolled-back"].includes(current.journal.status)) {
                const discard = document.createElement("button"); discard.type = "button"; discard.className = "memory-backup-panel__secondary"; discard.textContent = "Supprimer ce point de retour";
                discard.addEventListener("click", () => { try { discardRecoveryPoint(); setStatus("Le point de retour a été supprimé à votre demande.", "success"); renderRecovery(); } catch (error) { setStatus(error.message, "error"); } }); recovery.appendChild(discard);
            }
        };
        input.addEventListener("change", () => { reset({ keepFile: true }); setStatus(input.files && input.files[0] ? "Fichier choisi : examinez-le avant toute restauration." : ""); });
        confirm.addEventListener("change", () => { restore.disabled = !inspection || !confirm.checked; });
        cancel.addEventListener("click", () => { reset(); setStatus("Import annulé avant toute écriture."); });
        examine.addEventListener("click", async () => {
            const file = input.files && input.files[0]; if (!file) { setStatus("Choisissez d'abord un fichier JSON.", "error"); return; }
            if (file.size > MAX_BACKUP_BYTES) { setStatus("Ce fichier dépasse la taille portable maximale de 4 Mo.", "error"); return; }
            try { inspection = inspectImport(parseBackupText(await file.text())); renderPreview(preview, inspection); preview.hidden = false; restore.disabled = !confirm.checked; setStatus("Sauvegarde reconnue. Vérifiez le résumé puis confirmez la restauration.", "success"); }
            catch (error) { inspection = null; restore.disabled = true; setStatus(error.message, "error"); }
        });
        restore.addEventListener("click", () => { if (!inspection || !confirm.checked) { setStatus("La confirmation explicite est nécessaire.", "error"); return; } try { const result = applyImport(inspection); setStatus(`${result.changedKeys.length} mémoire${result.changedKeys.length > 1 ? "s" : ""} restaurée${result.changedKeys.length > 1 ? "s" : ""}. Un point de retour local est conservé jusqu'à votre action.`, "success"); reset(); renderRecovery(); } catch (error) { setStatus(error.message, "error"); renderRecovery(); } });
        renderRecovery();
    }

    function entryFor(key) { return MEMORY_REGISTRY.find(entry => entry.key === key); }
    function recoveryMessage(recovery) {
        if (recovery.state === "journal") return recovery.journal.status === "pending" || recovery.journal.status === "rollback-failed" ? "Une récupération locale est nécessaire avant toute restauration." : "Un point de retour local existe encore. Restaurez-le ou supprimez-le volontairement avant une nouvelle restauration.";
        if (recovery.state === "invalid") return "Le journal de récupération local est illisible : aucune restauration n'est lancée.";
        return "Le stockage local n'est pas disponible pour vérifier le point de retour.";
    }
    function sameValues(left, right) { return Object.keys(left).length === Object.keys(right).length && Object.keys(left).every(key => left[key] === right[key]); }
    function byteLength(value) { return typeof TextEncoder !== "undefined" ? new TextEncoder().encode(value).length : value.length; }
    function isPlainObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]"; }
    function isIsoDate(value) { return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value; }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
    return { FORMAT, VERSION, MAX_BACKUP_BYTES, RECOVERY_KEY, parseBackupText, inspectImport, applyImport, getRecoveryStatus, recoverPreviousState, discardRecoveryPoint, validateJournal };
})();
window.MakerlandMemoryImport = MakerlandMemoryImport;
