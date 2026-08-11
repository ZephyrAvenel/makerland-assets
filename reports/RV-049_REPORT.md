# RV-049 - Optimisation de la reactivite lors du changement d'orientation

Date : 2026-08-11

Branche : `agent/rv-049-orientation-reactivity`

## Objectif

Reduire la latence perceptible apres rotation Android, sans supprimer la securite introduite par RV-048 pour les changements de viewport encore instables.

## Origine de la latence

RV-048 effectuait :

- un repositionnement immediat via `requestAnimationFrame` ;
- un second repositionnement fixe 180 ms plus tard.

Ce second passage etait volontairement protecteur pour Android, car `visualViewport` peut continuer a changer apres `orientationchange`.
Cependant, lorsque le viewport etait deja stabilise, ce deuxieme recalcul restait programme inutilement et pouvait donner une sensation de latence.

## Solution retenue

Le delai fixe de 180 ms a ete remplace par une verification conditionnelle plus courte :

- le premier repositionnement reste immediat via `requestAnimationFrame` ;
- une verification a 72 ms compare la signature du viewport ;
- le second repositionnement n'est execute que si `innerWidth`, `innerHeight`, `visualViewport.width` ou `visualViewport.height` ont encore change.

La signature comparee est composee de :

`innerWidth x innerHeight x visualViewport.width x visualViewport.height`

Cela conserve la securite Android lorsque la hauteur utile continue d'evoluer, tout en evitant un second recalcul quand le viewport est deja stable.

## Fichiers modifies

- `js/zoneRenderer.js`
- `reports/RV-049_REPORT.md`

## Contraintes respectees

- Aucun HTML modifie.
- Aucun CSS modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune destination modifiee.
- Aucun timing RV-043 modifie.
- Aucune taille ou position visuelle des bulles modifiee.

## Validation

- `node --check js/zoneRenderer.js` : OK.
- `git diff --check` : OK.

## Resultat attendu

- Ouverture directe portrait : comportement conserve.
- Ouverture directe paysage : comportement conserve.
- Rotation portrait vers paysage : reflow immediat, second passage seulement si le viewport change encore.
- Rotation paysage vers portrait : meme comportement, sans rechargement de page.
