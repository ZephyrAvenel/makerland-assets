# Living Compass Inventory

Mission RV-029 - Inventaire des territoires existants

Ce document etablit une cartographie des territoires deja presents dans Makerland. Il ne propose aucune nouvelle fonctionnalite et n'invente aucun nouvel espace. Il sert de reference pour relier progressivement la Boussole Vivante aux lieux reellement disponibles dans le depot.

## Sources analysees

- `docs/LIVING_EXPERIENCE_CHARTER.md`
- `docs/LIVING_PASSAGES_MANIFESTO.md`
- `docs/LIVING_PLACES_GUIDE.md`
- `docs/MAKERLAND_TERRITORIES.md`
- `index.html`
- `data/zones-v3-final-beta.json`
- `data/livres-v2.json`
- `data/library-layout.json`
- `data/library-extensions.json`
- `js/navigation.js`
- `js/app.js`
- `js/bookRenderer.js`
- `js/archwayPassage.js`
- `js/constellation.js`
- `js/zoneRenderer.js`

## Synthese

Le parcours central deja present est :

```text
Accueil
  |
  v
Meteo interieure
  |
  v
Boussole Vivante
  |-- Explorer ----------------> Foret de l'Arche -> Oeuvre immersive externe
  |-- Decouvrir ---------------> Cartes
  |-- Contempler --------------> Bibliotheque Vivante
  |-- Creer -------------------> Atelier
  `-- Trouver un repere -------> Constellation
```

La Boussole relie donc deja les cinq directions organiques a cinq ecrans existants. Plusieurs territoires existent aussi comme prolongements internes de la Bibliotheque Vivante, mais ne sont pas des entrees directes depuis la Boussole.

## Inventaire des territoires

| Territoire | Fonction | URL / ecran | Etat | Point d'entree actuel | Passage narratif actuel | Potentiel |
| --- | --- | --- | --- | --- | --- | --- |
| Le Seuil | Accueil initial, entree dans l'experience | `e01_accueil` | Termine | Premier ecran | Rite d'accueil, Murmure du Veilleur, bouton `Entrer` rendu par ZoneRenderer | Aucun changement necessaire pour l'inventaire |
| Meteo interieure | Choix du paysage interieur de depart | `e02_meteo` | Termine | `e01_accueil` puis zone `entrer` | Apparition progressive du titre, du texte et des cinq cartes | Aucun changement necessaire |
| Boussole Vivante | Lieu central d'orientation | `e03_boussole` | Termine | Meteo interieure | Texte d'accueil selon `selectedWeather`, direction suggeree, memoire et echos vivants | Point central de liaison des futurs passages |
| Foret de l'Arche | Seuil vers l'oeuvre immersive | `e04_oeuvre` | Partiellement termine | Boussole, direction `Explorer` | `ArchwayPassage` prepare un Murmure, une invitation et une traversee vers l'URL externe | Rite de passage deja present, a consolider selon les missions dediees |
| Oeuvre immersive externe | Destination immersive principale | `https://wood-demonstrate.unicornplatform.page/zephyr_avenel/` | Externe, fonctionnelle comme destination | Foret de l'Arche, puis ouverture externe | Passage par l'Arche, puis ouverture externe | Garder comme destination de l'Arche, configurable |
| Cartes | Territoire de cartes ou de decouverte | `e05_cartes` | Prototype / prepare | Boussole, direction `Decouvrir` | Aucun passage narratif interne identifie | Necessite une refonte future ou un rite dedie |
| Bibliotheque Vivante - Fictions | Premiere salle de bibliotheque | `e06_fiction` | Termine | Boussole, direction `Contempler` | Salle immersive generee par BookRenderer | Peut rester l'entree principale de la Bibliotheque |
| Bibliotheque Vivante - Essais | Deuxieme salle de bibliotheque | `e06_essais` | Termine | Navigation interne depuis Fictions | Transition de salle via BookRenderer | Deja habitable, non directe depuis la Boussole |
| Bibliotheque Vivante - Atlas | Troisieme salle de bibliotheque | `e06_atlas` | Termine avec Atlas III a venir | Navigation interne depuis Essais | Transition de salle via BookRenderer | Deja habitable, avec un ouvrage explicitement en attente |
| Bibliotheque Vivante - Portes ouvertes | Quatrieme salle de bibliotheque | `e06_portes` | Termine | Navigation interne depuis Atlas | Transition de salle, puis portes vers sous-bibliotheques | Sert de carrefour vers les ressources ouvertes |
| Sous-bibliotheque Carnets | Index vivant des carnets gratuits | `e06_carnets` | Prepare / en attente | Portes ouvertes | Salle immersive pilotee par `library-extensions.json` | Contenu majoritairement `coming_soon` |
| Sous-bibliotheque Manifestes | Index des manifestes et textes ouverts | `e06_manifestes` | Partiellement termine | Portes ouvertes ou navigation interne des sous-bibliotheques | Salle immersive pilotee par `library-extensions.json` | Un texte publie, autres ressources a venir |
| Sous-bibliotheque Oeuvres libres | Index des oeuvres libres et ressources gratuites | `e06_ressources_libres` | Partiellement termine | Portes ouvertes ou navigation interne des sous-bibliotheques | Salle immersive pilotee par `library-extensions.json` | Une ressource publiee, autres ressources a venir |
| Atelier | Espace de creation et de pratiques | `e07_atelier` | Beta / prototype | Boussole, direction `Creer` | Zones interactives declarees dans le JSON | Necessite une integration future des actions `atelier:*` |
| Constellation | Recit commun, depot et partage de fragments | `e08_constellation` | Beta | Boussole, direction `Trouver un repere` | Interface locale et zones JSON pour saisie, partage et aide | Peut devenir un territoire habitable avec rite propre |
| Voyage | Espace de sortie vers ressources externes | `e09_voyage` | Beta, non relie au parcours principal | Inaccessible depuis la Boussole dans l'etat actuel | Zones externes vers oeuvre immersive, blog, portail et QR central | Territoire existant a relier ou a requalifier |

## Detail par familles

### Seuil, Meteo, Boussole

Ces trois lieux forment le rite d'entree principal. Ils respectent deja les principes de seuil, respiration, accueil et orientation douce. Ils ne sont pas des territoires a creer, mais le socle a partir duquel les autres lieux doivent devenir accessibles.

### Foret et Arche

`e04_oeuvre` est la destination actuelle de la direction `Explorer`. Le fichier `js/archwayPassage.js` associe cet ecran a un passage vers l'oeuvre immersive externe. Le territoire est donc deja relie, mais il reste un seuil plutot qu'un lieu de contenu autonome.

### Cartes

`e05_cartes` est relie a la direction `Decouvrir`. Le depot contient l'ecran et l'image correspondante, mais aucune zone interactive n'est declaree dans `data/zones-v3-final-beta.json`. Dans l'etat actuel, il s'agit d'un territoire prepare mais encore silencieux.

### Bibliotheque Vivante

La Bibliotheque est le territoire le plus structure apres la Boussole. Elle contient quatre salles principales :

- Fictions symboliques
- Essais
- Atlas des Recits Vivants
- Portes ouvertes

Elle contient aussi trois sous-bibliotheques extensibles :

- Carnets gratuits
- Manifestes et textes ouverts
- Oeuvres libres

Les salles sont pilotees par `bookRenderer.js`, `livres-v2.json`, `library-layout.json` et `library-extensions.json`. Elles sont des territoires reels, mais seules les Fictions sont accessibles directement depuis la Boussole.

### Atelier

`e07_atelier` existe comme ecran beta et possede six zones JSON. Ces zones correspondent a des intentions d'atelier : dialogue IA, cartographie, images, clarification, evolution et entree atelier. Les actions sont declarees, mais leur experience narrative reste a completer.

### Constellation

`e08_constellation` est relie a la direction `Trouver un repere`. Il possede un module dedie, une zone de texte, un bouton de partage et une zone d'aide. C'est un territoire utilisable en beta, avec un fort potentiel d'hospitalite narrative autour du recit commun.

### Voyage

`e09_voyage` existe dans le JSON et dans le HTML. Il propose des sorties vers l'oeuvre immersive, le blog, le portail Zephyr Avenel et un QR central. Il n'est pas relie directement par une direction de la Boussole dans l'etat actuel du depot.

## Carte generale des relations

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
  |   e04_oeuvre
  |     |
  |     v
  |   Oeuvre immersive externe
  |
  |-- Decouvrir
  |     |
  |     v
  |   e05_cartes
  |
  |-- Contempler
  |     |
  |     v
  |   e06_fiction
  |     |
  |     v
  |   e06_essais
  |     |
  |     v
  |   e06_atlas
  |     |
  |     v
  |   e06_portes
  |     |-- e06_carnets
  |     |-- e06_manifestes
  |     `-- e06_ressources_libres
  |
  |-- Creer
  |     |
  |     v
  |   e07_atelier
  |
  `-- Trouver un repere
        |
        v
      e08_constellation

e09_voyage existe comme territoire beta, mais reste hors de cette chaine principale.
```

## Territoires existants non encore accessibles directement depuis la Boussole

Ces territoires existent dans le depot, mais ne sont pas des destinations directes des cinq directions de la Boussole :

| Territoire | Acces actuel | Observation |
| --- | --- | --- |
| `e06_essais` | Depuis `e06_fiction` | Salle terminee, accessible indirectement |
| `e06_atlas` | Depuis `e06_essais` | Salle terminee, accessible indirectement |
| `e06_portes` | Depuis `e06_atlas` | Salle terminee, carrefour des sous-bibliotheques |
| `e06_carnets` | Depuis `e06_portes` | Sous-bibliotheque preparee, ressources a venir |
| `e06_manifestes` | Depuis `e06_portes` ou sous-navigation | Sous-bibliotheque partiellement publiee |
| `e06_ressources_libres` | Depuis `e06_portes` ou sous-navigation | Sous-bibliotheque partiellement publiee |
| `e09_voyage` | Pas de point d'entree principal identifie | Territoire beta a relier ou requalifier |

## Priorisation d'integration

### Priorite 1 - Territoires termines ou presque termines, mais sous-utilises

- `e09_voyage` : existe en beta, possede des zones externes, mais n'est pas relie au parcours principal.
- `e06_essais`, `e06_atlas`, `e06_portes` : salles habitables et fonctionnelles, accessibles indirectement mais non representees comme directions directes.
- `e06_manifestes` et `e06_ressources_libres` : sous-bibliotheques deja structurees, avec au moins une ressource publiee.

### Priorite 2 - Territoires presents mais demandant un enrichissement narratif

- `e05_cartes` : relie depuis la Boussole, mais sans interaction interne declaree.
- `e07_atelier` : relie depuis la Boussole, zones existantes, actions specialisees encore a habiter.
- `e08_constellation` : relie depuis la Boussole, module present, a renforcer comme lieu vivant autonome.
- `e06_carnets` : salle deja structuree, mais ressources majoritairement en attente.

### Priorite 3 - Espaces conceptuels ou ressources en attente

- Atlas des Recits Vivants III : declare comme `coming_soon`.
- Carnets futurs, guides, PDF, extraits et ressources gratuites : presents comme emplacements de contenu, pas encore comme territoires finalises.
- Objets NFC, packs narratifs et autres extensions mentionnees dans la vision globale : concepts documentes, mais aucun territoire autonome complet n'a ete identifie dans le depot actuel.

## Conclusion

Le depot contient deja une cartographie substantielle : un seuil, une meteo, une boussole, une foret, une bibliotheque en plusieurs salles, un atelier, une constellation, un espace voyage et plusieurs sous-bibliotheques.

La prochaine evolution de la Boussole ne devrait donc pas commencer par l'ajout de nouveaux lieux. Elle devrait d'abord clarifier les passages vers les territoires deja presents, en respectant la logique des trois textes fondateurs :

- accueillir avec la Charte de l'Experience Vivante ;
- traverser avec le Living Passages Manifesto ;
- habiter avec le Living Places Guide.
