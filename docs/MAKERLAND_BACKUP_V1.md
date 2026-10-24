# Sauvegarde portable Makerland V1

## Format

Une sauvegarde V1 est un fichier JSON local dont la racine suit ce schéma :

```json
{
  "format": "makerland-backup-v1",
  "version": 1,
  "createdAt": "2026-10-24T12:00:00.000Z",
  "supportedKeys": ["…registre V1…"],
  "savedKeys": ["makerland.firstJourney"],
  "memories": {
    "makerland.firstJourney": "{\"completed\":true}"
  },
  "warnings": []
}
```

`memories` contient les **chaînes brutes** de `localStorage`, jamais des objets JSON normalisés. Une valeur JSON invalide est donc exportée sans correction ; elle reçoit l’avertissement `invalid-json-preserved`.

La sauvegarde est refusée si une lecture échoue ou si sa représentation dépasse 4 Mo. Elle ne modifie aucune clé locale.

## Registre V1 inclus

- `makerland.firstJourney`
- `makerland.narrativeMemory.v1`
- `makerland_living_journey`
- `makerland:living-cycle`
- `makerland:traveler-constellation`
- `makerland:living-seasons`
- `makerland.traveler.constellation`
- `makerland.living.paths`
- `makerland.guardianEncounters.v1`
- `makerland.guardianWhispers`
- `makerland.livingGuide.memory`
- `recitsVivants.constellation.memory`
- `makerland_stories` (textes personnels)
- `makerland:traveling-fragment:last`

Les clés absentes ne sont pas ajoutées artificiellement au fichier ; elles restent néanmoins déclarées dans `supportedKeys` afin que le futur import connaisse le registre exact de cette version.

## Exclusions intentionnelles

Les clés de session (`makerland:atelier:object:*`, contexte de retour Atelier), `makerland.livingNotebook.opened`, les compteurs dynamiques `makerland_views_*` / `makerland_clicks_*` et toute clé étrangère sont exclus. Elles sont temporaires, techniques ou ne représentent pas un souvenir personnel exportable. V1 n’utilise jamais un préfixe global ni un export aveugle de `localStorage`.

## Préparation de l’import futur

L’import devra vérifier le format, la version, le registre, les types de toutes les valeurs brutes et les conflits avec l’état local. Il devra afficher une prévisualisation, demander une confirmation, puis créer un point de retour local avant toute restauration.

`localStorage` ne fournit pas de transaction atomique multi-clés : une restauration V2 devra donc préparer et vérifier toutes les opérations avant écriture, conserver un journal de récupération local et signaler sans ambiguïté tout échec partiel. Aucun import ni aucune restauration n’est activé en V1.
