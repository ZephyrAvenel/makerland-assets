# SCENE-001 - Faire naitre le ciel

## Objectif

Créer la première scène de la Constellation Vivante en donnant priorité au paysage pendant les premières secondes.

La mission applique le principe établi par DESIGN-001 et DESIGN-002 :

> Le ciel d'abord. Les relations ensuite. Le parcours seulement si le visiteur le demande.

## Fichiers modifiés

- `index.html`
- `css/constellationScene.css`
- `js/constellationScene.js`
- `reports/SCENE-001_REPORT.md`

## Ce qui a été retiré de l'arrivée

Les éléments existants ne sont pas supprimés du projet, mais ils ne s'affichent plus automatiquement pendant l'arrivée silencieuse :

- panneau central de partage ;
- citation et cartes de résonance ;
- panneau Chemin Vivant ;
- entrée des Grandes Constellations ;
- mémoire personnelle et chemins locaux ;
- modes avancés du Ciel Vivant ;
- panneaux de détail.

Ces couches restent disponibles après l'approche volontaire du visiteur.

## Ce qui a été ajouté

Une couche autonome `ConstellationScene` a été créée.

Elle ajoute uniquement :

- respiration très lente du ciel ;
- halo discret de lanterne ;
- lumière douce sur les cartes suspendues ;
- murmure sans encadré : "Ici, les recits se repondent." ;
- étoile d'approche discrète après quelques secondes.

Aucune route, aucun JSON métier, aucun moteur global et aucune navigation n'ont été modifiés.

## Comportement de scène

Au moment où `#e08_constellation` devient visible :

1. l'état `constellation-scene-silent` est appliqué ;
2. les panneaux automatiques sont neutralisés ;
3. le paysage reste visible ;
4. après un court délai, le murmure apparaît puis disparaît ;
5. après plusieurs secondes, une étoile pulse légèrement ;
6. au toucher de cette étoile, l'état `constellation-scene-awakened` est appliqué ;
7. les couches existantes peuvent alors redevenir accessibles.

## Alignement avec DESIGN-001 et DESIGN-002

La scène respecte les lois de scénographie suivantes :

- le paysage reste le premier langage ;
- le ciel reste visible ;
- aucun panneau ne remplace le décor au chargement ;
- une interaction naît d'un élément du paysage ;
- le Chemin Vivant n'est plus imposé au premier regard ;
- le silence devient une partie active de l'expérience.

## Responsive

Les positions de la respiration, du murmure et de l'étoile d'approche utilisent les variables existantes :

- `--screen-content-left`
- `--screen-content-top`
- `--screen-content-width`
- `--screen-content-height`

Des ajustements spécifiques existent pour :

- mobile ;
- mobile paysage ;
- `prefers-reduced-motion`.

## Captures

Les captures avant/après n'ont pas été produites dans cette mission depuis l'environnement Codex.

La validation visuelle finale reste à effectuer sur appareils réels :

- desktop ;
- tablette ;
- mobile portrait ;
- mobile paysage.

## Validations effectuées

- `node --check js/constellationScene.js`
- `git diff --check`
- `git diff --cached --check`

## Anomalies restantes

Aucune anomalie fonctionnelle identifiée dans le périmètre de la mission.

La prochaine mission pourra affiner ce qui se passe après l'approche de la première étoile, notamment la manière dont les objets du décor répondent sans réafficher immédiatement trop de panneaux.
