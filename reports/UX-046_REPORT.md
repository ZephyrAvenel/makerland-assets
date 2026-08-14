# UX-046 — Harmonisation responsive de Makerland

## Objectif

Établir une stratégie responsive commune afin que Makerland reste lisible et immersif en smartphone portrait, smartphone paysage, tablette portrait, tablette paysage et desktop.

## Adaptations réalisées

### Base commune

Fichier : `css/style.css`

- Ajout d'un `box-sizing:border-box` global.
- Harmonisation des contrôles de formulaire avec `font:inherit`.
- Ajout d'une règle paysage compact pour limiter les débordements des murmures, panneaux et notifications.
- Les éléments longs utilisent désormais un défilement interne discret lorsque la hauteur disponible est faible.

Raison : éviter les calculs de largeur/hauteur imprévisibles et empêcher les panneaux de sortir du viewport en paysage compact.

### Accueil

Fichier : `css/livingHome.css`

- Ajustement du panneau des chemins en paysage compact.
- Le bouton de la section ouverte ne dépasse plus du viewport.
- La disposition horizontale UX-045 est conservée.

Raison : préserver le paysage, le sceau, le titre et le texte d'introduction tout en gardant les chemins accessibles.

### Premier Voyage

Fichier : `css/firstJourney.css`

- Ajout d'une règle paysage commune.
- Les cartes du Premier Voyage, de l'introduction et de la Forêt peuvent défiler en interne si la hauteur est insuffisante.
- La mise en page portrait existante n'a pas été modifiée.

Raison : éviter les contenus tronqués sur smartphone paysage et tablette paysage.

### Pages éditoriales

Fichier : `css/placeholder.css`

- En paysage, les pages longues utilisent mieux la largeur disponible.
- Les marges verticales sont réduites en paysage compact.
- Les grilles éditoriales, cycles et cartes de chemin deviennent plus denses.
- Les boutons de retour et cartes réduisent légèrement leur encombrement en faible hauteur.

Raison : conserver une lecture aérée en portrait et éviter les pertes verticales en paysage.

### Archives Vivantes

Fichier : `css/archive-components.css`

- Les grilles documentaires exploitent davantage la largeur en paysage.
- Les blocs d'archives, citations, fragments et Markdown réduisent leur padding en faible hauteur.
- Les textes conservent une hauteur de ligne lisible.

Raison : faciliter la lecture des archives sur tablette paysage sans créer de blocs disproportionnés.

### Carnet du Voyageur

Fichier : `css/livingNotebook.css`

- En paysage, les pages du carnet disposent d'une hauteur maximale et d'un défilement interne.
- En paysage compact, la couverture, la page et la navigation sont légèrement réduites.

Raison : préserver l'impression d'objet tout en évitant qu'une page du carnet sorte de l'écran.

## Validations effectuées

- `git diff --check` : OK.
- `node --check` sur tous les fichiers JavaScript de `js/` : OK.
- Audit DOM automatisé en paysage compact `915x412` sur :
  - `e01_accueil`
  - `e02_meteo`
  - `e03_boussole`
  - `e04_oeuvre`
  - `e05_cartes`
  - `e06_fiction`
  - `e07_atelier`
  - `e08_constellation`
  - `e09_voyage`

Résultat : aucun débordement détecté après harmonisation.

## Écrans restant à optimiser

Les pages éditoriales autonomes très longues pourront bénéficier plus tard d'une revue visuelle page par page. La présente mission met en place les règles communes de densité, de grilles et de défilement interne, sans refonte spécifique de contenu.

## Fichiers modifiés

- `css/style.css`
- `css/livingHome.css`
- `css/firstJourney.css`
- `css/placeholder.css`
- `css/archive-components.css`
- `css/livingNotebook.css`
- `reports/UX-046_REPORT.md`

## Périmètre respecté

Aucune modification fonctionnelle n'a été apportée.

Aucun JavaScript, JSON métier, moteur narratif, `BookRenderer`, `ZoneRenderer`, navigation ou action existante n'a été modifié.
