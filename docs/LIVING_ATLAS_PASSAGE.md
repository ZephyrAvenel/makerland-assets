# Living Atlas Passage

Mission RV-030 - Passage Vivant vers l'Atlas des Recits Vivants

## Role du passage

Le Passage Vivant vers l'Atlas transforme `e05_cartes` en seuil narratif. Il ne remplace pas l'Atlas publie et ne recree pas son contenu dans Makerland. Il prepare simplement le visiteur a franchir une nouvelle salle du meme univers.

La logique est :

```text
Boussole Vivante
  |
  v
Explorer
  |
  v
e05_cartes
  |
  v
Passage Vivant
  |
  v
Atlas des Recits Vivants
```

Destination :

`https://zephyravenel.github.io/atlas-recits-vivants/`

## Lien avec la Boussole

La direction `Explorer` de la Boussole pointe vers `e05_cartes`. RV-031 actualise cette cartographie afin que le Passage Atlas devienne la branche naturelle de l'exploration. La Boussole ne devient pas un menu externe : elle ouvre un lieu intermediaire qui accueille le visiteur avant l'ouverture de l'Atlas.

Le visiteur ne quitte donc pas brutalement Makerland. Il traverse une carte, lit un Murmure, puis choisit le moment d'ouvrir l'Atlas.

## Lien avec l'Atlas

L'Atlas existe deja comme publication autonome. Makerland devient son seuil vivant :

- `e05_cartes` affiche l'illustration existante de la grande carte ;
- un Murmure du Veilleur prepare le passage ;
- l'invitation `✦ Ouvrir l'Atlas` reste disponible sans urgence ;
- l'ouverture externe utilise `Navigation.openExternal`.

## Murmure du Veilleur

Le Murmure actuel est :

```text
Les cartes n'enferment pas le monde.
Elles ouvrent des chemins pour le regarder autrement.
```

Il suit le meme principe de lecture adaptative que les autres Murmures :

- apparition progressive ;
- temps de lecture calcule par `Navigation.getWhisperReadingDuration` ;
- duree minimale de 4 secondes ;
- duree maximale de 8 secondes ;
- disparition douce ;
- apparition ensuite seulement de l'invitation.

## Reutilisation

RV-030 generalise legerement `js/archwayPassage.js` en creant une fabrique interne de Passages Vivants. Deux passages utilisent maintenant cette structure :

- `ArchwayPassage` pour `e04_oeuvre` ;
- `AtlasPassage` pour `e05_cartes`.

Chaque passage configure :

- son ecran ;
- ses classes CSS d'etat ;
- son Murmure ;
- son invitation ;
- sa destination ;
- son evenement de rythme ;
- ses durees.

Cette approche permet d'ajouter plus tard d'autres seuils sans creer un nouveau moteur.

## Bonnes pratiques

- Ne pas transformer un passage en simple lien.
- Conserver un temps de lecture humain.
- Laisser l'invitation persistante une fois apparue.
- Ne jamais creer de sentiment d'urgence.
- Utiliser `transform`, `opacity` et `filter` pour les animations.
- Respecter `prefers-reduced-motion`.
- Garder les destinations configurees dans le passage plutot que dispersees dans le code.

## Limites

Le passage ouvre l'Atlas dans un nouvel onglet via `Navigation.openExternal`, comme les autres destinations externes de Makerland. L'Atlas reste heberge comme site autonome.
