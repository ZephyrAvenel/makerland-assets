# Le Livre des Rencontres

## Rôle

Le Carnet de Voyage conserve déjà les traces locales du parcours.

Avec les Gardiens des Récits Vivants, il devient progressivement un Livre des Rencontres : non pas un historique technique, mais un lieu où le visiteur retrouve les paroles qui l'ont accompagné.

## Les Gardiens

Les Gardiens ne sont ni des mascottes, ni des guides obligatoires.

Ils apparaissent parfois lorsqu'un territoire s'ouvre. Leur rôle n'est pas d'expliquer la page, mais d'ouvrir une disponibilité intérieure.

Une rencontre est enregistrée uniquement lorsqu'une parole a réellement été affichée.

## Mémoire locale

Les rencontres sont stockées dans :

`makerland.guardianEncounters.v1`

Structure :

```json
{
  "version": 1,
  "encounters": [
    {
      "key": "gardien::parole",
      "guardianId": "profondeurs",
      "guardianName": "La Gardienne des Profondeurs",
      "illustration": "✦",
      "variant": "depths",
      "territoryId": "e07_atelier",
      "territoryLabel": "Atelier des Récits",
      "territoryHref": "atelier/",
      "whisper": "Message affiché",
      "firstEncounteredAt": "2026-08-14T00:00:00.000Z"
    }
  ]
}
```

Une même parole d'un même Gardien n'est jamais enregistrée deux fois. Un Gardien peut cependant laisser plusieurs paroles différentes.

## Affichage dans le Carnet

La section `Les Paroles des Gardiens` apparaît dans le Carnet de Voyage avant les autres mémoires.

Si aucune rencontre n'existe encore, une carte d'attente explique simplement que les paroles pourront être retrouvées plus tard.

Lorsqu'une rencontre existe, elle devient une page patrimoniale :

- nom du Gardien ;
- figure symbolique ;
- parole rencontrée ;
- territoire de rencontre ;
- date de première rencontre ;
- lien de retour vers le territoire.

## Philosophie

Le système évite tout vocabulaire de collection, de badge, de niveau ou de récompense.

Le Carnet ne dit pas au visiteur qu'il a gagné quelque chose.

Il lui permet seulement de retrouver ce qui est venu à sa rencontre.

## Évolutions futures

La structure pourra accueillir plus tard :

- les paroles des Gardiens ;
- les rencontres importantes ;
- les passages favoris ;
- les citations des œuvres ;
- les cartes qui ont marqué le voyageur ;
- les fragments issus des Archives Vivantes.

L'objectif est de faire évoluer le Carnet vers un journal intérieur du territoire, sans compte utilisateur, sans serveur et sans suivi externe.
