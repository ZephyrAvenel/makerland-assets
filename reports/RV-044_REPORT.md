# RV-044 - Meteo : correction de la taille des bulles et des textes

Date : 2026-08-11

Branche : `agent/rv-044-meteo-bubble-sizing`

## Objectif

Corriger les debordements de texte dans les bulles de l'ecran `e02_meteo`, en particulier sur smartphone portrait et paysage, sans modifier le fonctionnement de la page.

## Fichier modifie

- `css/style.css`

## Corrections appliquees

- Les bulles meteo sont maintenant centrees autour de leur hitbox avec `display:flex` sur les zones de `e02_meteo`.
- Leur largeur et leur hauteur minimale sont augmentees via `clamp()`.
- Le padding interne est augmente pour eviter que les textes touchent les contours.
- Le texte principal utilise une taille minimale plus confortable.
- Les textes secondaires utilisent une taille minimale plus lisible, un interlignage plus ample et une marge superieure dediee.
- Des media queries ciblees ajustent le rendu en smartphone portrait et paysage.

## Contraintes respectees

- Aucun HTML modifie.
- Aucun JavaScript modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune destination modifiee.
- Aucun changement du rythme d'apparition RV-043.
- Aucun changement des cinq choix meteo.

## Validation

- Controle CSS cible : seules les regles `#e02_meteo` des zones et bulles meteo sont ajustees.
- Portrait smartphone : bulles agrandies, sous-textes plus lisibles.
- Paysage smartphone : bulles agrandies, line-height augmente pour eviter les debordements.
- Desktop : proportions conservees par les limites `clamp()`.
- `git diff --check` : OK.
