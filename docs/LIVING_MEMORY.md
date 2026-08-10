# La Memoire Vivante

## Philosophie

La Memoire Vivante est une memoire du lieu.
Elle ne cherche pas a identifier une personne.
Elle garde seulement la trace legere d'un parcours deja traverse dans Makerland.

Cette memoire n'analyse pas.
Elle ne profile pas.
Elle n'attribue aucun score.
Elle permet simplement a la Boussole de reconnaitre qu'un chemin existe deja.

## Donnees conservees

Les donnees restent locales au navigateur, dans `localStorage`, sous la cle:

```text
makerland.narrativeMemory.v1
```

Structure actuelle:

```json
{
  "visitCount": 0,
  "firstVisit": null,
  "lastVisit": null,
  "lastWeather": null,
  "lastDirection": null,
  "weatherHistory": [],
  "directionHistory": [],
  "milestones": []
}
```

Les historiques sont limites aux derniers passages afin de rester simples et legers.

## Ce qui n'est pas conserve

La Memoire Vivante ne conserve pas:

- nom;
- email;
- identifiant;
- adresse IP;
- compte utilisateur;
- donnees transmises a un serveur;
- information permettant d'identifier une personne.

## Fonctionnement

Quand le visiteur choisit une meteo, `NarrativeMemory.rememberWeather(selectedWeather)` conserve cette meteo localement.

Quand la Boussole s'ouvre, `NarrativeMemory.rememberVisit(...)` augmente le nombre approximatif de visites, met a jour la derniere visite et conserve la direction suggeree.

La Boussole peut ensuite afficher un murmure tres court:

- premiere visite: `Bienvenue.`
- deuxieme visite: `Heureux de vous revoir.`
- visites suivantes: `La Boussole vous reconnait.`

Selon l'historique, elle peut aussi faire apparaitre une observation douce:

- `Vous revenez souvent lorsque le paysage est voile.`
- `Les paysages changent.`
- `La creation semble vous appeler.`
- `Votre chemin s'elargit.`

Ces phrases restent non psychologiques et non prescriptives.

## Reversibilite

Le visiteur peut effacer cette memoire a tout moment en vidant les donnees locales du navigateur.

Le module expose aussi:

```js
NarrativeMemory.reset();
```

Cette fonction supprime la cle locale utilisee par Makerland.

## Principes ethiques

- La memoire appartient au lieu, pas a une identite.
- Aucune donnee n'est transmise.
- Aucune prediction n'est faite.
- Aucun score n'est produit.
- La memoire accompagne sans enfermer.
- Les observations doivent toujours pouvoir etre ignorees.
- Toute evolution future devra rester locale, explicable et reversible.
