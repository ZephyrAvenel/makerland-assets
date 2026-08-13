# UX-020 - Le Silence du Seuil

## Synthese

UX-020 simplifie l'ecran d'accueil afin de retrouver une respiration visuelle.

Le seuil ne cherche plus a tout expliquer. Il conserve une seule idee principale, la promesse centrale de Makerland et trois portes d'entree.

## Simplifications realisees

- Suppression de l'affichage sur l'accueil de la phrase du jour.
- Suppression de l'affichage sur l'accueil de l'indication saison / moment.
- Suppression de l'encadre `Ici, rien n'est a reussir`.
- Suppression des mini-cartes explicatives des lieux.
- Suppression de la carte centrale `Bienvenue de retour`.
- Conservation des trois portes d'entree.
- Conservation de la promesse editoriale courte.

## Fil Rouge

Le Fil Rouge n'est pas affiche sur l'accueil.

Il reste disponible apres le seuil, notamment sur la Boussole, les Cartes, la Bibliotheque, l'Atelier et la Constellation.

## Premier Voyage

Le bouton `Refaire le Premier Voyage` reste disponible, mais devient une option secondaire placee en bas de l'ecran.

Il est precede visuellement par :

`Vous connaissez deja Makerland ?`

## Corrections responsive

- Les trois portes sont plus espacees sur desktop.
- Les cartes d'entree sont legerement moins hautes.
- Le seuil est replace pour laisser davantage respirer l'image.
- En paysage mobile, les portes restent compactes et sous la zone de presentation.
- En portrait mobile, les actions restent lisibles sans superposition avec les textes principaux.

## Captures

- Avant : etat UX-018/UX-019 documente par la surcharge de blocs dans le contexte de mission.
- Apres desktop : `reports/UX-020_DESKTOP.png`
- Apres smartphone portrait : `reports/UX-020_PORTRAIT.png`
- Apres smartphone paysage : `reports/UX-020_LANDSCAPE.png`

## Fichiers modifies

- `js/livingHome.js`
- `css/livingHome.css`
- `css/firstJourney.css`
- `docs/ux/SILENT_THRESHOLD.md`
- `reports/UX-020_REPORT.md`
- `reports/UX-020_DESKTOP.png`
- `reports/UX-020_PORTRAIT.png`
- `reports/UX-020_LANDSCAPE.png`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucune navigation modifiee.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Intervention limitee a la couche d'accueil et au bouton de reprise du Premier Voyage.

## Validations

- `node --check js/livingHome.js` : OK.
- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK, avec avertissements CRLF attendus.
- Verification locale desktop : OK.
- Verification locale smartphone portrait : OK.
- Verification locale smartphone paysage : OK.
- Aucun moteur global, aucune navigation et aucun JSON metier modifies.
