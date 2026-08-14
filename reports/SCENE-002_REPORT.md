# SCENE-002 - La premiere rencontre

## Objectif

Créer la première interaction vivante de la Constellation après l'arrivée silencieuse de SCENE-001.

Le visiteur ne doit pas avoir l'impression d'ouvrir une fenêtre. Le paysage doit répondre directement par ses propres éléments : étoile, lumière, ligne, carte suspendue.

## Fichiers modifiés

- `css/constellationScene.css`
- `js/constellationScene.js`
- `reports/SCENE-002_REPORT.md`

## Comportement ajouté

La première étoile introduite par SCENE-001 ne réveille plus immédiatement les panneaux existants.

Elle déclenche désormais une séquence en quatre temps :

1. l'étoile touchée s'illumine et grandit légèrement ;
2. une seconde étoile répond ;
3. une ligne lumineuse apparaît fugitivement entre les deux ;
4. une carte suspendue reçoit une lumière douce et devient approchable.

## Parole du paysage

Une phrase courte apparaît près de la rencontre :

> Les recits ne vivent jamais seuls.

Elle apparaît sans panneau, sans fond opaque et disparaît naturellement.

## Carte suspendue

Après la réponse du paysage, une zone de carte suspendue devient disponible.

Au toucher :

- la carte reçoit une animation douce ;
- un titre apparaît ;
- une courte phrase apparaît ;
- un lien discret `Explorer...` permet de réveiller les couches existantes.

Le paysage reste visible pendant toute la séquence.

## Panneaux existants

Les panneaux existants restent différés pendant la première rencontre :

- Lieu Vivant ;
- Chemin Vivant ;
- Résonances ;
- Concepts ;
- Grandes Constellations ;
- formulaire central.

Ils peuvent réapparaître seulement après le choix explicite `Explorer...`.

## Contraintes respectées

- aucune route modifiée ;
- aucune navigation modifiée ;
- aucun JSON métier modifié ;
- aucun contenu éditorial existant modifié ;
- aucun moteur global modifié ;
- réutilisation de la couche `ConstellationScene` créée en SCENE-001.

## Accessibilité

Les deux zones interactives de scène sont des boutons :

- première étoile ;
- carte suspendue.

Elles possèdent chacune un libellé `aria-label` et un état `focus-visible`.

## Responsive

Les positions utilisent les variables existantes de l'écran :

- `--screen-content-left`
- `--screen-content-top`
- `--screen-content-width`
- `--screen-content-height`

Des ajustements sont prévus pour :

- mobile ;
- mobile paysage ;
- `prefers-reduced-motion`.

## Captures

Les captures avant/après n'ont pas été produites depuis l'environnement Codex.

La validation visuelle finale reste à effectuer manuellement sur :

- desktop ;
- tablette ;
- mobile portrait ;
- mobile paysage.

## Validations effectuées

- `node --check js/constellationScene.js`
- `git diff --check`
- `git diff --cached --check`

## Notes pour la suite

SCENE-002 installe le premier dialogue entre le visiteur et le ciel.

La prochaine étape pourra transformer les cartes suspendues en véritables objets narratifs, sans revenir à une logique de panneaux centraux.
