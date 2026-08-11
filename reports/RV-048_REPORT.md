# RV-048 - Recalcul des zones meteo apres changement d'orientation

Date : 2026-08-11

Branche : `agent/rv-048-zone-reflow-on-orientation`

## Diagnostic

Le calcul des zones interactives est effectue dans `js/zoneRenderer.js`.

Fonctions concernees :

- `positionZone()` calcule `left`, `top`, `width`, `height` et `--makerland-zone-scale`.
- `getContentRect()` calcule la zone utile a partir du rectangle de l'ecran actif.
- `refresh()` etait appele sur `window.resize`.

Le probleme venait du comportement de `refresh()` : il appelait `render(currentScreen)`, ce qui supprimait toutes les `.makerland-zone`, puis les recreait.

Sur `e02_meteo`, cette recreation relancait les animations CSS RV-043 des zones meteo. Apres rotation Android, les zones pouvaient donc sembler disparaitre ou rester partiellement visibles, car elles repartaient dans leur sequence d'apparition au lieu d'etre simplement repositionnees.

## Correction appliquee

`refresh()` ne recree plus les zones lorsqu'elles existent deja.

Il appelle maintenant `repositionCurrentZones()`, qui :

- retrouve l'ecran courant ;
- retrouve la configuration JSON de cet ecran ;
- parcourt les `.makerland-zone` existantes ;
- reapplique `positionZone()` avec le nouveau rectangle de viewport ;
- conserve les elements DOM existants et leur etat d'animation.

Un fallback conserve l'ancien rendu uniquement si aucune zone n'existe encore.

## Evenements surveilles

Le recalcul est maintenant planifie sur :

- `window.resize`
- `window.orientationchange`
- `visualViewport.resize` si disponible
- `visualViewport.scroll` si disponible

Le recalcul est planifie avec :

- `requestAnimationFrame` pour un repositionnement rapide ;
- un second passage apres 180 ms pour laisser Android stabiliser la hauteur utile apres rotation ou changement de barre navigateur.

## Contraintes respectees

- Aucun HTML modifie.
- Aucun CSS modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucun timing RV-043 modifie.
- Aucune taille, typographie, marge ou position visuelle des bulles modifiee.

## Validation

- `node --check js/zoneRenderer.js` : OK.
- `git diff --check` : OK.
- Verification code : le moteur repositionne les zones existantes au lieu de les recreer.

## Limite de validation locale

Les captures navigateur demandees n'ont pas pu etre produites depuis cet environnement : le navigateur integre bloque l'ouverture `file://` et n'a pas pu joindre le serveur local `127.0.0.1` depuis sa sandbox. Aucune tentative de contournement n'a ete effectuee.
