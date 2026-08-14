# PRESENCE-001 - Le lieu accompagne le visiteur

## Objectif

Ajouter une première qualité de présence à la Constellation Vivante.

Le lieu ne doit pas attirer l'attention comme une interface. Il doit continuer à exister, même lorsque le visiteur reste silencieux.

## Fichiers modifiés

- `css/constellationScene.css`
- `js/constellationScene.js`
- `reports/PRESENCE-001_REPORT.md`

## Choix de mise en scène

### Silence respecté

Aucun nouveau panneau n'est affiché après attente.

Aucun deuxième murmure n'est lancé.

Le murmure initial reste unique, puis le silence reprend sa place.

### Présence après contemplation

Après environ 14,5 secondes sans interaction, le lieu peut entrer dans l'état :

```text
constellation-presence-listening
```

Effets :

- très lente variation de lumière dans le ciel ;
- lanterne légèrement plus attentive ;
- aucune instruction ;
- aucun texte.

### Présence profonde

Après environ 28,5 secondes sans interaction, le lieu peut entrer dans l'état :

```text
constellation-presence-deep
```

Effets :

- halo très discret autour du voyageur ;
- étoile de réponse très faible ;
- sensation que le paysage continue à vivre.

### Interaction après attente

Toute interaction dans la couche de scène :

- coupe les temporisations de présence ;
- retire les états de présence ;
- laisse l'interaction normale reprendre.

Le visiteur ne se bat jamais contre une animation.

## Gardiens

Aucun Gardien explicite n'a été ajouté.

La présence des Gardiens reste suggérée par :

- la lanterne ;
- la lumière ;
- la rareté.

Cette approche évite une apparition mécanique ou intrusive.

## Voyageur

Le personnage central devient un point de présence silencieuse.

Il ne parle pas.

Il ne s'anime pas comme un personnage.

Un halo très doux peut apparaître après une longue contemplation, pour rappeler qu'il était déjà là avant l'arrivée du visiteur.

## Contraintes respectées

- aucune navigation modifiée ;
- aucune route modifiée ;
- aucun JSON métier modifié ;
- aucun contenu éditorial modifié ;
- aucun parcours existant modifié ;
- aucune nouvelle donnée stockée.

## Validation fonctionnelle

Le module reste autonome dans `ConstellationScene`.

Il ajoute seulement :

- deux temporisations de présence ;
- deux classes CSS de silence prolongé ;
- des animations basées sur `opacity` et `transform`.

## Validations effectuées

- `node --check js/constellationScene.js`
- `git diff --check`
- `git diff --cached --check`

## Captures

Les captures avant/après n'ont pas été produites depuis l'environnement Codex.

Les vérifications visuelles restent à effectuer manuellement sur :

- arrivée ;
- contemplation prolongée ;
- reprise après plusieurs secondes de silence ;
- interaction après attente ;
- desktop ;
- tablette ;
- mobile portrait ;
- mobile paysage.

## Résultat attendu

La Constellation ne donne plus seulement l'impression de réagir au visiteur.

Elle donne plus clairement l'impression d'exister avec ou sans lui.

Le paysage n'attend pas un clic. Il continue simplement de respirer.
