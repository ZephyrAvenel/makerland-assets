# ZoneRenderer Architecture

## Fonctionnement general

`js/zoneRenderer.js` est le point unique de creation des zones interactives Makerland.
Il lit exclusivement `data/zones-v3-final-beta.json`, calcule les positions responsive a partir de la resolution de reference du fichier JSON, cree des zones HTML invisibles au-dessus des ecrans, puis execute une action au clic.

Le moteur ne porte aucune coordonnee metier en JavaScript. Les ecrans, zones, dimensions et actions doivent rester decrits dans le JSON.

## Cycle de vie

1. `ZoneRenderer.load()` charge `data/zones-v3-final-beta.json`.
2. La resolution de reference du JSON alimente le calcul responsive.
3. `Navigation.goTo(...)` declenche l'evenement `screenChanged`.
4. `ZoneRenderer.render(screenId)` supprime les anciennes zones, lit la configuration de l'ecran actif, puis cree les zones.
5. Au redimensionnement de la fenetre, `ZoneRenderer.refresh()` recree les zones avec les dimensions courantes.

## Structure JSON

Chaque ecran est decrit dans `screens`:

```json
{
  "e01_accueil": {
    "status": "measured",
    "background": "ecran-1-accueil.png",
    "zones": {
      "entrer": {
        "x": 518,
        "y": 720,
        "w": 500,
        "h": 120,
        "type": "navigation",
        "action": "e02_meteo"
      }
    }
  }
}
```

Champs de zone:

- `x`, `y`, `w`, `h`: position et taille dans la resolution de reference.
- `type`: intention generale de la zone.
- `action`: cible ou description d'action.

## Ajouter une nouvelle zone

Ajouter une entree dans le fichier JSON, dans l'ecran concerne:

```json
"ma_zone": {
  "x": 100,
  "y": 200,
  "w": 300,
  "h": 120,
  "type": "navigation",
  "action": "e04_oeuvre"
}
```

Aucune modification JavaScript n'est necessaire pour une zone de navigation ou un lien externe.

## Ajouter une nouvelle action

Le moteur accepte plusieurs formats.

Format historique:

```json
{
  "type": "navigation",
  "action": "e03_boussole"
}
```

Format chaine prefixee:

```json
{
  "type": "interaction",
  "action": "openBook:atlas-des-passages"
}
```

Format objet:

```json
{
  "type": "interaction",
  "action": {
    "type": "showDialog",
    "target": "dialogue-intro"
  }
}
```

Pour ajouter une action native, enregistrer un handler:

```js
ZoneRenderer.registerAction("showDialog", action => {
    // action.target contient la cible JSON.
});
```

Actions prevues par le registre:

- `goto`
- `openBook`
- `openPack`
- `openURL`
- `showDialog`
- `playAudio`
- `launchNFC`

Une action sans handler n'est pas perdue: le moteur emet un evenement `zoneAction` avec le detail de l'action et de l'ecran courant.

## Mode Debug

Le mode debug est controle dans `js/zoneRenderer.js`:

```js
const DEBUG_ZONES = false;
```

Quand `DEBUG_ZONES` vaut `false`, les zones restent invisibles en production.
Quand `DEBUG_ZONES` vaut `true`, chaque zone affiche une bordure orange et un fond orange translucide pour faciliter le reglage.

Le CSS global ne doit pas imposer de bordure ou de fond visible aux zones. Toute visualisation debug doit rester pilotee par `ZoneRenderer`.

## Bonnes pratiques

- Garder toutes les coordonnees dans `data/zones-v3-final-beta.json`.
- Ne pas creer de nouveau renderer d'interaction parallele.
- Ne pas dupliquer les zones dans `UIRenderer`.
- Preferer les actions JSON generiques aux conditions codees en dur.
- Conserver `Navigation`, `BookRenderer` et `Constellation` comme modules specialises.
- Tester chaque changement sur desktop, tablette, mobile portrait et mobile paysage.
