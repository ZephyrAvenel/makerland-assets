# RV-006 - Reveler les territoires existants

## Resume

Mission d'analyse et de cartographie.
Aucune fonctionnalite n'a ete ajoutee.
Aucun moteur n'a ete modifie.

Objectif: identifier les territoires deja presents dans Makerland et proposer une articulation narrative fondee uniquement sur le contenu reel du depot.

## Branche

- Branche: `agent/rv-006-reveal-existing-territories`
- Base locale: branche RV-005 existante, contenant les missions RV-001 a RV-005.
- `main` n'a pas ete modifie.

## Fichiers crees

- `docs/MAKERLAND_TERRITORIES.md`
- `reports/RV-006_REPORT.md`

## Fichiers volontairement non modifies

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/app.js`
- `js/livingEcho.js`
- `data/zones-v3-final-beta.json`
- `data/livres-v2.json`
- `index.html`
- `css/style.css`

## Inventaire complet des ecrans

| Ecran | Image | Etat JSON | Zones | Fonction actuelle | Potentiel narratif |
| --- | --- | --- | ---: | --- | --- |
| `e01_accueil` | `ecran-1-accueil.png` | `measured` | 1 | Accueil | Le Seuil |
| `e02_meteo` | `ecran-2-question.png` | `measured` | 5 | Meteo interieure | Choix du paysage de depart |
| `e03_boussole` | `ecran-3-boussole.png` | `beta` | 1 | Boussole Vivante | Coeur d'orientation |
| `e04_oeuvre` | `ecran-4-oeuvre.png` | `draft` | 0 | Foret et arche lumineuse | Explorer |
| `e05_cartes` | `ecran-5-cartes.png` | `draft` | 0 | Cartes narratives | Decouvrir |
| `e06_fiction` | `ecran-6-fiction.png` | `draft` | 0 | Rayon fiction | Bibliotheque Vivante |
| `e06_essais` | `ecran-6-essais.png` | `draft` | 0 | Rayon essais | Bibliotheque Vivante |
| `e06_atlas` | `ecran-6-atlas.png` | `draft` | 0 | Rayon atlas | Reperes / Bibliotheque |
| `e06_portes` | `ecran-6-portes-ouvertes.png` | `draft` | 0 | Portes ouvertes | Ressources ouvertes |
| `e07_atelier` | `ecran-7-atelier.png` | `beta` | 6 | Atelier IA | Creer |
| `e08_constellation` | `ecran-8-constellation.png` | `beta` | 3 | Recits partages localement | Trouver un repere |
| `e09_voyage` | `ecran-9-voyage.png` | `beta` | 4 | Liens externes et QR | Continuer / emporter |

Toutes les images d'ecran sont presentes dans `ecrans/` et utilisent la resolution `1536 x 1024`.

## Interactions et transitions existantes

### Parcours principal fonctionnel

```text
e01_accueil
  -> zone entrer
  -> e02_meteo
      -> zones eclaircie / transition / je_ne_sais_pas / brouillard / tempete
      -> e03_boussole
          -> zone porte_principale
          -> e04_oeuvre
```

### Zones presentes mais non encore raccordees

`e07_atelier` contient six zones:

- `dialogue_ia`
- `cartographie`
- `images`
- `clarification`
- `evolution`
- `entrer_atelier`

Ces zones emettent des actions de type `atelier:*`.
Aucun gestionnaire correspondant n'est present dans le depot.

`e08_constellation` contient trois zones:

- `story_input`
- `share_story`
- `how_it_works`

Ces actions ne sont pas raccordees au registre `ZoneRenderer`.
Le module `Constellation` gere cependant un formulaire DOM local avec `storyInput` et `shareStoryButton`.

`e09_voyage` contient quatre zones:

- trois zones externes fonctionnelles via `openURL`;
- une zone `qr_central` de type `qr`, sans gestionnaire `qr` actuel dans `ZoneRenderer`.

### Ecrans presents sans zones

- `e04_oeuvre`
- `e05_cartes`
- `e06_fiction`
- `e06_essais`
- `e06_atlas`
- `e06_portes`

Ces ecrans existent dans le DOM et dans le JSON, mais ne contiennent pas encore de zones interactives.

## Ressources disponibles

### Images d'ecrans

12 images:

- accueil;
- meteo;
- boussole;
- oeuvre;
- cartes;
- quatre rayons de bibliotheque;
- atelier;
- constellation;
- voyage.

### Couvertures

10 couvertures locales dans `covers/`:

- `art-augmente.jpg`
- `atlas1.jpg`
- `atlas2.jpg`
- `cosmologie.jpg`
- `ecriture-augmentee.jpg`
- `horizons-infini.jpg`
- `lumieres-fractales.jpg`
- `marges-vivantes.jpg`
- `metamorphose-zephyr.jpg`
- `seuil-etoiles.jpg`

### Livres et ressources

`data/livres-v2.json` contient 13 ressources:

- fiction: 4;
- essais: 4;
- atlas: 2;
- portes ouvertes: 3.

### QR Codes

3 QR Codes locaux:

- `QR-01-Portail-ZephyrAvenel.png`
- `QR-02-Oeuvre-Immersive.png`
- `QR-03-Bibliotheque-Vivante.png`

## Tableau de correspondance

| Direction de la Boussole | Territoire existant conseille | Justification |
| --- | --- | --- |
| Explorer | `e04_oeuvre` | Le visuel montre un chemin et une arche dans une foret immersive. |
| Decouvrir | `e05_cartes` | L'ecran presente explicitement des cartes narratives et des portes. |
| Contempler | `e06_fiction` / `e06_essais` | La bibliotheque permet une halte de lecture et d'approfondissement. |
| Creer | `e07_atelier` | L'atelier porte deja le vocabulaire de creation, clarification et cartographie. |
| Trouver un repere | `e08_constellation` / `e06_atlas` / `e06_portes` | Ces ecrans proposent traces, atlas et ressources ouvertes. |

`e09_voyage` semble plutot etre une sortie douce ou un prolongement final qu'une premiere direction.

## Carte globale proposee

```text
Le Seuil
  -> Meteo interieure
      -> Boussole Vivante
          -> Explorer
              -> e04_oeuvre
          -> Decouvrir
              -> e05_cartes
          -> Contempler
              -> e06_fiction
              -> e06_essais
          -> Creer
              -> e07_atelier
          -> Trouver un repere
              -> e08_constellation
              -> e06_atlas
              -> e06_portes
          -> Continuer / emporter
              -> e09_voyage
```

## Analyse narrative

### Territories deja suffisamment lisibles

`e01_accueil`, `e02_meteo` et `e03_boussole` forment un parcours coherent.
Le visiteur entre, situe son paysage interieur, puis arrive dans un lieu d'orientation.

### Territoires forts mais encore non relies

`e04_oeuvre`, `e05_cartes`, `e06_*`, `e07_atelier`, `e08_constellation` et `e09_voyage` possedent une identite visuelle claire.
Ils ne sont pas encore pleinement habitables car leurs liens et actions ne sont pas tous raccordes.

### Ambiguites reperees

- `e06_*` partage le meme numero d'ecran pour quatre rayons distincts.
- `e05_cartes` montre des cartes interactives visuellement, mais aucune zone JSON n'est declaree.
- `e07_atelier` possede des zones d'action sans gestionnaires.
- `e08_constellation` combine zones JSON et formulaire DOM local; l'interaction exacte devra etre clarifiee.
- `e09_voyage` declare une action QR non geree par le registre actuel.

## Recommandations

### A - Deja pret

- `e01_accueil`
- `e02_meteo`
- `e03_boussole`

Ces ecrans doivent rester la colonne vertebrale actuelle.

### B - A enrichir

Priorite 1:

- relier les directions de la Boussole aux territoires existants;
- commencer par `Explorer -> e04_oeuvre`, `Creer -> e07_atelier`, `Trouver un repere -> e08_constellation`.

Priorite 2:

- rendre `e05_cartes` interactif via zones JSON;
- raccorder la Bibliotheque Vivante depuis une direction ou depuis `e05_cartes`;
- clarifier la navigation entre les quatre rayons `e06_*`.

Priorite 3:

- raccorder les actions `atelier:*`;
- harmoniser la Constellation avec `ZoneRenderer`;
- ajouter un gestionnaire `qr` si l'action QR doit devenir active.

### C - A creer

Aucun nouveau territoire n'est prioritaire avant la mise en coherence de l'existant.

Espaces absents ou seulement evoques:

- NFC;
- packs narratifs;
- carnets interactifs;
- objets physiques connectes;
- pages detaillees d'oeuvres immersives.

## Validation

Verifications effectuees:

- inventaire de `index.html`;
- inventaire de `data/zones-v3-final-beta.json`;
- inventaire de `data/livres-v2.json`;
- inventaire de `ecrans/`;
- inventaire de `covers/`;
- inventaire de `qr/`;
- lecture de `ZoneRenderer`;
- lecture de `BookRenderer`;
- lecture de `Constellation`;
- lecture de `UIRenderer`;
- verification que la mission ne modifie pas les moteurs ni le JSON.

Conclusion: Makerland possede deja assez de territoires pour etendre la Boussole sans creer de nouveaux lieux.
La prochaine etape devrait etre une mission de raccordement JSON, pas une mission de creation d'ecrans.

