# UX-048 — Harmonisation complète des panneaux de lecture

## Objectif

Rendre les panneaux narratifs et les panneaux de chemin entièrement lisibles sur smartphone et tablette, en portrait comme en paysage, sans changement fonctionnel ni modification des données.

## Cause traitée

Après UX-047, plusieurs panneaux disposaient d'une hauteur bornée, mais leur comportement restait hétérogène :

- certains contenus défilaient dans une sous-zone trop courte ;
- certaines citations pouvaient rester proches de la zone d'action ;
- les panneaux relationnels utilisaient chacun leur propre logique de scroll ;
- les pages statiques de lecture ne prévoyaient pas toujours une respiration finale.

## Fichiers modifiés

- `css/firstJourney.css`
- `css/livingPaths.css`
- `css/livingExhibitions.css`
- `css/placeholder.css`
- `css/archive-components.css`
- `css/living-constellation.css`

## Adaptations réalisées

### Premier Voyage

- Le panneau d'étape devient le conteneur scrollable principal.
- Les boutons restent dans le flux et utilisent un comportement sticky.
- Le texte principal n'est plus limité à une sous-zone isolée : citation, encadré et paragraphe peuvent défiler ensemble.
- Les variantes paysage compact conservent les ajustements UX-046/UX-047.

### Chemins Vivants

- La colonne de détail reçoit une respiration finale avec `clamp()` et `dvh`.
- Les actions restent accessibles grâce à un positionnement sticky.
- Le scroll reste local au panneau, sans changement de logique JavaScript.

### Grandes Constellations

- La zone de détail reçoit la même respiration finale.
- Le bouton de fermeture reste accessible dans le panneau.

### Pages de lecture

- Les pages utilisant `placeholder.css` gagnent une marge basse responsive.
- Les pages Archives reçoivent une respiration finale spécifique pour `archive-shell` et `archive-markdown`.
- La Constellation Vivante reçoit le même principe dans son panneau de détail.

## Contraintes respectées

- Aucun JavaScript métier modifié.
- Aucun JSON modifié.
- Aucune navigation modifiée.
- Préservation du design existant.
- Corrections CSS uniquement.

## Validations

Validations classiques demandées :

- `git diff --check`
- `node --check` sur les fichiers JavaScript
- `git diff --cached --check`

Les vérifications sur appareils réels restent prévues après merge, conformément à la consigne.
