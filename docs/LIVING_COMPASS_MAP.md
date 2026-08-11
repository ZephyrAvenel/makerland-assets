# Living Compass Map

Mission RV-031 - Cartographie vivante de la Boussole

## Principe

La Boussole Vivante n'est pas un menu. Elle organise les premiers passages vers les lieux deja presents dans Makerland.

RV-031 clarifie la correspondance entre les cinq directions organiques, les ecrans existants et les Passages Vivants disponibles.

## Cartographie finale

| Direction | Destination directe | Lieu ouvert | Passage Vivant associe | Connexions secondaires |
| --- | --- | --- | --- | --- |
| Explorer | `e05_cartes` | Cartes narratives / Passage vers l'Atlas | `AtlasPassage` | Atlas des Recits Vivants externe |
| Decouvrir | `e04_oeuvre` | Foret de l'Arche | `ArchwayPassage` | Oeuvre immersive externe |
| Creer | `e07_atelier` | Atelier | Aucun passage dedie dans l'etat actuel | Zones JSON d'atelier declarees |
| Contempler | `e04_oeuvre` | Foret de l'Arche | `ArchwayPassage` | Oeuvre immersive externe |
| Trouver un repere | `e08_constellation` | Constellation | Aucun passage dedie dans l'etat actuel | Recit commun, aide et partage |

## Carte generale

```text
e01_accueil
  |
  v
e02_meteo
  |
  v
e03_boussole
  |-- Explorer
  |     |
  |     v
  |   e05_cartes
  |     |
  |     v
  |   Passage Atlas
  |     |
  |     v
  |   https://zephyravenel.github.io/atlas-recits-vivants/
  |
  |-- Decouvrir
  |     |
  |     v
  |   e04_oeuvre
  |     |
  |     v
  |   Passage de l'Arche
  |     |
  |     v
  |   Oeuvre immersive externe
  |
  |-- Creer
  |     |
  |     v
  |   e07_atelier
  |
  |-- Contempler
  |     |
  |     v
  |   e04_oeuvre
  |     |
  |     v
  |   Passage de l'Arche
  |     |
  |     v
  |   Oeuvre immersive externe
  |
  `-- Trouver un repere
        |
        v
      e08_constellation
```

## Choix de cartographie

### Explorer vers `e05_cartes`

Le Passage Atlas cree en RV-030 transforme `e05_cartes` en seuil vivant vers l'Atlas publie. RV-031 place donc la direction `Explorer` sur ce passage, car l'Atlas est le territoire naturel de l'exploration.

### Decouvrir vers `e04_oeuvre`

La direction `Decouvrir` retrouve la Foret de l'Arche afin que le passage vers l'oeuvre immersive reste directement accessible depuis la Boussole.

### Contempler vers `e04_oeuvre`

La direction `Contempler` ouvre la Foret de l'Arche. Elle prepare l'acces a l'oeuvre immersive par un Passage Vivant deja existant.

### Creer vers `e07_atelier`

L'Atelier existe comme ecran beta et possede deja des zones JSON. La direction `Creer` reste donc connectee a ce lieu.

### Trouver un repere vers `e08_constellation`

La Constellation est le lieu le plus coherent pour la recherche de reperes. Elle conserve sa destination directe depuis la Boussole.

## Territoires secondaires

Ces territoires existent, mais ne sont pas des directions directes de la Boussole :

- `e06_fiction` : salle precedente de la Bibliotheque Vivante ;
- `e06_essais` : salle interne de la Bibliotheque Vivante ;
- `e06_atlas` : salle interne de la Bibliotheque Vivante ;
- `e06_portes` : carrefour vers les sous-bibliotheques ;
- `e06_carnets` : sous-bibliotheque des carnets ;
- `e06_manifestes` : sous-bibliotheque des manifestes ;
- `e06_ressources_libres` : sous-bibliotheque des oeuvres libres ;
- `e09_voyage` : ecran beta de sorties externes, present dans le depot mais non integre aux cinq directions principales.

## Validation attendue

Chaque direction de la Boussole doit posseder un `data-target-screen` correspondant a un `section id` existant dans `index.html`.

La carte finale respecte cette contrainte :

- `e05_cartes` existe ;
- `e04_oeuvre` existe ;
- `e07_atelier` existe ;
- `e04_oeuvre` existe ;
- `e08_constellation` existe.

## Limite documentee

`e09_voyage` reste un territoire present mais non relie directement depuis la Boussole. RV-031 ne cree pas de sixieme direction et ne deplace pas les contenus existants. Une future mission pourra choisir de le relier comme sortie secondaire, si ce role reste pertinent dans l'architecture narrative.
