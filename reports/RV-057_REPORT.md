# RV-057 - Affinage du langage visuel de la suggestion narrative

Date: 2026-08-12

Branche: `agent/rv-057-organic-compass-suggestion`

## Objectif

Conserver une suggestion narrative clairement perceptible sur la Boussole Vivante, tout en supprimant l'impression de rectangle sombre ou de bouton selectionne apparue apres RV-056.

## Correction appliquee

Fichier modifie:

- `css/style.css`

Changements:

- reduction forte du fond interne de `.living-compass-direction.is-suggested`;
- bordure conservee mais rendue tres peu contrastee;
- halo externe agrandi et diffuse via `::before`;
- respiration lente conservee;
- lumiere du texte conservee sans changement de taille;
- perception de suggestion portee par une lumiere organique plutot que par une boite.

## Effet recherche

La direction suggeree doit evoquer:

- une etoile legerement plus lumineuse;
- une porte qui rayonne;
- un chemin qui attire doucement le regard.

Elle ne doit plus evoquer:

- un menu;
- un bouton actif;
- une case selectionnee.

## Perimetre respecte

- Aucun HTML modifie.
- Aucun JavaScript modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune logique metier modifiee.
- Aucune correspondance meteo -> direction modifiee.

## Validation

- Le diff de production est limite a `css/style.css`.
- `git diff --check` OK.
- Aucun script lint local detecte (`package.json` absent).
