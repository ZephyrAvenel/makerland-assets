# RELEASE-001 - Deploiement de la restauration Android de la Constellation

## Synthese

La branche `sandbox/android-input-restore` a ete integree dans `main` pour deployer la restauration validee de la saisie native Android dans la Constellation.

Cette mission n'a pas ajoute de correction fonctionnelle supplementaire. Les seules interventions effectuees pendant le deploiement concernent :

- la mise a jour locale de `main` depuis `origin/main` ;
- le merge de la branche de restauration ;
- la resolution de conflits Git limites aux fichiers `livingPaths` et `livingExhibitions` ;
- la creation du present rapport.

## Branches

- Branche source : `sandbox/android-input-restore`
- Branche cible : `main`
- SHA de merge production : `55d33a970e0ae31d2b778022bfa27213c00ee059`
- Resultat du push : `main` pousse avec succes vers `origin/main`.

## Pull Request

Aucune Pull Request existante correspondant a la branche `sandbox/android-input-restore` n'a pu etre identifiee localement.

Le poste ne dispose pas de `gh`, de `hub`, ni de jeton GitHub expose dans l'environnement. La creation ou la mise a jour d'une Pull Request via CLI n'etait donc pas disponible depuis cet environnement.

Conformement a la consigne de deploiement, la branche de restauration a ete fusionnee directement dans la branche cible `main`.

## Commits integres

- `c251d47` - UX-WRITE-002 - Align constellation textarea
- `0b9fdc7` - UX-WRITE-001 - Position constellation writing text
- `51ac943` - Fix compass repere access in landscape
- `e55462f` - RESTORE-001 - Restore native Android constellation input
- `d740ca8` - FIX-004 - Make writing card a native textarea target
- `03955e8` - FIX-003 - Exclude text inputs from fullscreen trigger
- `69d0a03` - FIX-002 - Restore native Android writing focus
- `4fbf71e` - Add visible writing cue to Constellation
- `ce59bb4` - Restore Constellation writing layer
- `b3a90d9` - Add single-layer Constellation overlay manager
- `9b330b9` - Fix Constellation return cover and portrait panels

## Conflits rencontres

Trois conflits ont ete rencontres pendant le merge :

- `css/livingExhibitions.css`
- `css/livingPaths.css`
- `js/livingPaths.js`

Resolution appliquee :

- conservation des adaptations responsives de `main` ;
- conservation des apports de la branche de restauration lies au `LivingOverlayManager` ;
- maintien du bouton `Continuer librement`, de la fermeture externe et de la fermeture `Escape` ;
- aucun changement ajoute au mecanisme restaure de focus natif Android.

## Verifications

Commandes executees avec succes :

- `node --check js/app.js`
- `node --check js/constellationScene.js`
- `node --check js/livingConstellationExperience.js`
- `node --check js/livingExhibitions.js`
- `node --check js/livingOverlayManager.js`
- `node --check js/livingPaths.js`
- `node --check js/livingSky.js`
- `git diff --check`
- `git diff --cached --check`

## GitHub Pages

La configuration GitHub Pages n'a pas ete modifiee.

Aucune branche `gh-pages` n'a ete detectee localement. Le deploiement attendu reste donc celui de la branche publiee par le depot, avec l'URL de test :

`https://zephyravenel.github.io/makerland-assets/`

## Fichiers volontairement exclus

Les fichiers suivants etaient non suivis et n'ont pas ete ajoutes au deploiement :

- `Makerland-1.0.zip`
- `reports/DIAG-001_WRITING_FOCUS.md`
- `reports/DIAG-002_INPUT_FOCUS.md`
- `reports/DIAG-003_TOUCH_PATH.md`
- `reports/DIAG-004_STORY_INPUT_RENDERING.md`
- `reports/DIAG-005_TOUCH_TARGET.md`
- `reports/FIX-001_SCENE_TO_WRITE.md`
- `reports/GIT-FORENSICS-001_ANDROID_INPUT.md`
- `reports/RV-035_REPORT.md`
- `reports/RV-052_REPORT.md`
- `reports/RV-054A_REPORT.md`
- `reports/RV-059_REPORT.md`

## Etat attendu

Apres push de `main`, GitHub Pages devra servir la version contenant :

- `RESTORE-001`
- `UX-WRITE-001`
- `UX-WRITE-002`

Le comportement Android valide doit etre conserve :

- premier toucher natif sur `textarea#storyInput` ;
- curseur visible ;
- clavier Android ouvert naturellement ;
- absence de `focus()` JavaScript force ;
- aucun overlay ne bloque le premier toucher.
