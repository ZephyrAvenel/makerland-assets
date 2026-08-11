# RV-031B Report - Verification des hitboxes de la Boussole

## Resume

Mission strictement diagnostique. Aucun fichier de production n'a ete modifie.

Objectif : comprendre pourquoi `Explorer` peut encore ouvrir le Passage de l'Arche alors que RV-031A a corrige `porte_principale` vers `e05_cartes`.

## Base analysee

Branche de diagnostic :

`agent/rv-031b-compass-hitboxes-diagnostic`

Base :

`origin/main` a `3667581`, merge de RV-031A.

RV-031A est donc bien presente dans la base analysee.

## JSON charges par le projet

Le fichier effectivement charge par ZoneRenderer est :

```text
data/zones-v3-final-beta.json
```

Preuves :

- `js/zoneRenderer.js` declare `ZONES_SOURCE = "data/zones-v3-final-beta.json"`.
- `ZoneRenderer.load()` appelle `fetch(ZONES_SOURCE)`.
- `App.loadData()` appelle `ZoneRenderer.load()`.
- `ZoneRenderer.bindEvents()` relance `ZoneRenderer.render(event.detail.screen)` a chaque `screenChanged`.

Aucun autre JSON ne contient de zones actives pour `e03_boussole`.

## Zones actives de `e03_boussole`

Dans `data/zones-v3-final-beta.json`, l'ecran `e03_boussole` contient une seule zone :

```json
"porte_principale": {
  "x": 655,
  "y": 190,
  "w": 235,
  "h": 575,
  "type": "navigation",
  "action": "goto",
  "target": "e05_cartes"
}
```

Coordonnees en base 1536 x 1024 :

- gauche : `655`
- haut : `190`
- droite : `890`
- bas : `765`

Conclusion partielle : dans le depot actuel, `porte_principale` ne pointe plus vers `e04_oeuvre`. Elle pointe bien vers `e05_cartes`.

## Destinations HTML de la Boussole

Dans `index.html`, les cinq directions organiques sont :

| Direction | `data-target-screen` |
| --- | --- |
| `creer` | `e07_atelier` |
| `explorer` | `e05_cartes` |
| `decouvrir` | `e06_essais` |
| `repere` | `e08_constellation` |
| `contempler` | `e04_oeuvre` |

Ces cinq cibles existent comme sections HTML.

## Quelle hitbox recoit reellement le clic ?

Deux couches interactives coexistent sur `e03_boussole` :

1. Les directions organiques HTML, dans `.living-compass`.
2. La zone JSON `porte_principale`, creee par ZoneRenderer.

Ordre de priorite observe dans le code :

- `.living-compass` a `z-index: 35`.
- `.living-compass-direction.is-suggested` monte a `z-index: 42`.
- ZoneRenderer applique `element.style.zIndex = "50"` a chaque `.makerland-zone`.

Donc, lorsqu'une direction organique se trouve sous `porte_principale`, la zone ZoneRenderer passe au-dessus et peut recevoir le clic avant la direction HTML.

La hitbox reellement utilisee dans la zone de chevauchement est donc :

```text
fichier : data/zones-v3-final-beta.json
ecran : e03_boussole
id : porte_principale
coordonnees : x=655, y=190, w=235, h=575
z-index effectif : 50
destination actuelle : goto -> e05_cartes
```

## Chevauchements

Les calculs ci-dessous utilisent la base 1536 x 1024 et les positions CSS des directions.

### Desktop

| Direction | Chevauche `porte_principale` ? |
| --- | --- |
| Explorer | Oui |
| Decouvrir | Oui |
| Creer | Non |
| Contempler | Non |
| Trouver un repere | Non |

### Mobile portrait

| Direction | Chevauche `porte_principale` ? |
| --- | --- |
| Explorer | Oui |
| Decouvrir | Oui |
| Creer | Non |
| Contempler | Non |
| Trouver un repere | Non |

### Mobile paysage

| Direction | Chevauche `porte_principale` ? |
| --- | --- |
| Explorer | Oui |
| Decouvrir | Oui |
| Creer | Non |
| Contempler | Non |
| Trouver un repere | Non |

Conclusion partielle : `Explorer` et `Decouvrir` sont bien dans la zone couverte par `porte_principale`. Cette zone est au-dessus des directions organiques.

## Occurrences importantes

Occurrences runtime pertinentes :

- `index.html` :
  - `explorer -> e05_cartes`
  - `decouvrir -> e06_essais`
  - `contempler -> e04_oeuvre`
- `js/archwayPassage.js` :
  - `ArchwayPassage` sur `e04_oeuvre`
  - `AtlasPassage` sur `e05_cartes`
- `data/zones-v3-final-beta.json` :
  - `e03_boussole.zones.porte_principale -> goto e05_cartes`

Occurrences anciennes mais documentaires :

- `docs/FIRST_PASSAGES.md`
- `docs/MAKERLAND_TERRITORIES.md`
- `docs/LIVING_COMPASS_INVENTORY.md`
- anciens rapports RV-006, RV-007, RV-029, RV-030, RV-031

Ces occurrences ne sont pas executees par l'application.

## Cache interne possible

Il n'existe pas de service worker ni de cache applicatif dedie aux zones.

En revanche, deux effets de cache ou de memoire peuvent expliquer l'observation :

1. `ZoneRenderer.load()` utilise `fetch("data/zones-v3-final-beta.json")` sans cache-buster ni option `cache: "no-store"`.
2. Une fois charge, `zonesData` reste en memoire dans le module ZoneRenderer jusqu'au rechargement complet de la page.

Donc si un navigateur avait deja charge l'ancien JSON avant RV-031A, ou si GitHub Pages / le navigateur sert encore une version cachee de `data/zones-v3-final-beta.json`, `porte_principale` peut encore contenir :

```json
"action": "e04_oeuvre"
```

Dans ce cas, comme `Explorer` et `Decouvrir` chevauchent `porte_principale`, les deux peuvent ouvrir `e04_oeuvre`.

## Conclusion

La hitbox reellement utilisee lorsque le clic tombe sur la zone centrale est :

```text
data/zones-v3-final-beta.json
screens.e03_boussole.zones.porte_principale
x=655, y=190, w=235, h=575
z-index effectif 50
```

Dans le depot actuel, cette hitbox est correcte :

```text
action = goto
target = e05_cartes
```

Conclusion claire :

```text
RV-031A est correct dans le depot actuel, mais la version observee qui ouvre encore e04_oeuvre n'est pas la version RV-031A du JSON actuellement chargee.
```

La cause la plus probable est donc :

```text
ancien data/zones-v3-final-beta.json encore servi par cache navigateur / cache GitHub Pages / page deja ouverte avec zonesData en memoire.
```

Aucune correction n'a ete appliquee dans cette mission.
