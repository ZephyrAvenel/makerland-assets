# RV-039 - Repositionnement intelligent du bouton Retour

## Resume

RV-039 repositionne le bouton `Retour a la Boussole Vivante` afin qu'il reste visible sans masquer les titres, sous-titres, citations ou pictogrammes centraux.

La correction est strictement visuelle.

## Modification realisee

- Le bouton reste en `position: fixed`.
- Il est deplace du centre superieur vers le haut gauche du viewport.
- Le placement respecte `env(safe-area-inset-top)` et `env(safe-area-inset-left)`.
- Son emprise visuelle est reduite : padding, bordure, fond, ombre et couleur plus discrets.
- Le libelle visuel est raccourci en `← Boussole` via CSS, sans modifier le HTML.

## Fichiers modifies

- `css/style.css`
- `reports/RV-039_REPORT.md`

## Validation statique

Bouton Retour unique vers `e03_boussole` verifie sur :

- `e04_oeuvre` : 1 bouton
- `e05_cartes` : 1 bouton
- `e06_fiction` : 1 bouton
- `e07_atelier` : 1 bouton
- `e08_constellation` : 1 bouton

Destinations de la Boussole confirmees inchangees :

- Explorer -> `e05_cartes`
- Decouvrir -> `e04_oeuvre`
- Contempler -> `e06_fiction`
- Creer -> `e07_atelier`
- Trouver un repere -> `e08_constellation`

## Contraintes respectees

- Aucun HTML modifie.
- Aucun JavaScript modifie.
- Aucun JSON modifie.
- Aucun moteur modifie.
- Aucune destination modifiee.
- Aucune animation modifiee.

## Verification

- `git diff --check` : OK.

Les verifications Android portrait, Android paysage et Desktop doivent etre confirmees visuellement apres deploiement GitHub Pages.
