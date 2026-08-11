# La Traversee de l'Arche

## Intention

L'Arche marque un passage majeur des Recits Vivants.

Elle ne sert pas a ouvrir une page. Elle propose au visiteur de quitter un territoire pour entrer dans un autre.

Dans le parcours actuel, elle relie:

```text
Boussole Vivante
-> Foret avec l'Arche
-> Oeuvre immersive des Recits Vivants
```

## Role narratif

La Boussole aide a retrouver une orientation.

L'Arche invite a franchir.

L'Oeuvre immersive ouvre l'exploration.

Cette grammaire peut etre reutilisee pour les futurs passages importants de Makerland: bibliotheque vers oeuvre, atlas vers territoire, carnet vers monde, ou tout autre seuil narratif.

## Cycle de vie

Le module `ArchwayPassage` ecoute les changements d'ecran.

Lorsque `e04_oeuvre` devient actif:

1. la foret apparait progressivement;
2. la lumiere de l'Arche se reveille;
3. un Murmure du Veilleur apparait;
4. le temps de lecture est calcule avec la formule adaptative RV-024;
5. le Murmure disparait doucement;
6. l'invitation `Franchir le seuil` devient disponible;
7. au toucher, l'Arche respire puis un voile lumineux ouvre la destination.

Lorsque le visiteur quitte l'ecran, les classes et temporisations sont nettoyees.

## Murmures

Le Murmure actif reste generique:

```text
Tous les chemins ne demandent pas d'etre compris.
Certains demandent seulement d'etre empruntes.
```

Des variantes par meteo interieure sont preparees dans le module, mais elles ne sont pas encore activees.

Le drapeau `useWeatherWhispers` permettra plus tard de les utiliser sans changer l'architecture.

## Temps de lecture

Le module reutilise `Navigation.getWhisperReadingDuration`.

La formule reste celle de RV-024:

```text
readingDuration = clamp(wordCount * 90 ms, 4000 ms, 8000 ms)
```

Le Murmure de l'Arche beneficie donc toujours d'un temps de lecture minimal, puis d'un fondu de sortie avant que l'invitation devienne active.

## Destination

La destination est centralisee dans la configuration du module:

```text
Oeuvre immersive des Recits Vivants
https://wood-demonstrate.unicornplatform.page/zephyr_avenel/
```

Les animations ne contiennent pas l'URL. La destination peut donc evoluer dans la configuration du composant.

## Accessibilite

L'Arche est exposee comme un lien clavier lorsque l'invitation est prete.

Le module gere:

- clic;
- touche Entree;
- touche Espace;
- `aria-label`;
- `aria-disabled`;
- `title`;
- `prefers-reduced-motion`.

En mouvement reduit, les animations longues sont neutralisees et le passage reste utilisable immediatement.

## Performance

Les effets utilisent principalement:

- `opacity`;
- `transform`;
- `filter`.

Le module ne lance aucun calcul continu. Les temporisations sont creees a l'arrivee sur l'ecran et nettoyees au depart.

## Bonnes pratiques

Pour ajouter une future Arche:

1. ajouter une configuration de destination;
2. definir le texte d'invitation;
3. fournir les Murmures adaptes au passage;
4. reutiliser les memes classes de presence;
5. conserver une interaction sobre, lisible et reversible.

Une Arche juste ne pousse pas le visiteur. Elle rend le passage habitable.
