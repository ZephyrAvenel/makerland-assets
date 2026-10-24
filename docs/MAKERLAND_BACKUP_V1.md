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

## Import et restauration locale

Makerland accepte uniquement un fichier dont `format` vaut exactement `makerland-backup-v1` et dont `version` vaut `1`. Avant toute écriture, l’application contrôle la date, le registre ordonné des 14 clés, les clés réellement sauvegardées, les types chaîne des valeurs brutes, les avertissements et la taille maximale de 4 Mo. Un fichier JSON invalide, incomplet, ambigu, surdimensionné ou comportant une clé étrangère est refusé.

La sélection d’un fichier ne modifie rien. La prévisualisation indique la date, les mémoires ajoutées, remplacées ou déjà identiques, les mémoires absentes (qui restent intactes) et la présence éventuelle de textes personnels. La restauration exige ensuite une case de confirmation explicite. Elle ne touche jamais une clé étrangère au registre, ni une clé V1 absente du fichier, et ne normalise pas les chaînes brutes : une mémoire interne invalide reste techniquement invalide après import et n’est pas présentée comme réparée.

## Point de retour et récupération

Avant la première écriture, Makerland enregistre dans la clé technique locale exclue de l’export `makerland.backup.recovery.v1` un journal contenant les valeurs antérieures — y compris l’absence de valeur — pour chaque clé concernée. Ce journal est relu et vérifié avant toute restauration. S’il ne peut pas être écrit ou vérifié, l’import est refusé sans modifier les souvenirs.

`localStorage` ne fournit pas de transaction atomique multi-clés. Après chaque écriture, Makerland relit donc la valeur restaurée. En cas d’échec, il tente de remettre toutes les valeurs antérieures puis signale sans ambiguïté le résultat. Si le retour arrière échoue ou si le navigateur est interrompu, le journal persistant bloque toute nouvelle restauration et propose une récupération contrôlée au prochain chargement.

Avant un retour volontaire, Makerland compare les valeurs actuelles aux valeurs apportées par l'import. Si elles ont évolué, aucune écriture n'est lancée : l'interface indique le nombre de mémoires concernées, permet de conserver les souvenirs actuels, ou demande une seconde confirmation distincte avant un remplacement explicite. Les valeurs sont relues une dernière fois après cet examen ; une nouvelle modification invalide la confirmation. Une récupération technique interrompue n'autorise jamais ce remplacement forcé lorsque l'origine d'un changement est incertaine.

Après une restauration réussie, le point de retour reste disponible localement : le visiteur peut récupérer l’état antérieur, ou le supprimer volontairement. Tant qu’il existe, une nouvelle restauration est refusée afin de ne pas l’écraser. Il n’est jamais supprimé automatiquement ; il subsiste jusqu’à la récupération ou à la suppression volontaire, sous réserve des limites ordinaires du stockage du navigateur.

La vérification préalable détecte aussi une modification des clés concernées entre la prévisualisation et la confirmation : dans ce cas, l’import est annulé et doit être examiné de nouveau. Ces mesures rendent l’opération récupérable, sans prétendre offrir une atomicité inter-onglets que `localStorage` ne possède pas.
