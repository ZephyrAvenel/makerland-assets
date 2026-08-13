# Makerland 1.0 — Foundation & Living Territory

Makerland 1.0 constitue la premiere version patrimoniale de reference du projet. Elle marque l'achevement du premier grand cycle de developpement consacre a transformer Makerland en territoire vivant des Recits Vivants.

Cette release ne correspond pas a une nouvelle fonctionnalite isolee. Elle conserve l'etat complet du depot apres la mise en place des lieux, des archives, du patrimoine documentaire, du Graphe Vivant, de la Constellation Vivante, du Guide Vivant, du Conservateur, des Grandes Constellations et des Chemins Vivants.

## Perimetre historique

- RV-068 -> RV-076 : Territoire vivant, Atelier, Constellation, memoire locale et Carnet de Voyage.
- RV-077 -> RV-081 : documents fondateurs, vision, manifeste, cosmologie et Livre Vivant.
- RV-082 -> RV-089 : Archives Vivantes et integration du premier volume documentaire.
- RV-090 : inventaire patrimonial de l'oeuvre immersive.
- RV-091 : Graphe Vivant de Makerland.
- RV-092 : Constellation Vivante.
- RV-093 : Guide Vivant.
- RV-094 : Conservateur Vivant.
- RV-095 : restauration patrimoniale.
- RV-097 : Constellation des Voyageurs.
- RV-098 : Living Constellation Experience.
- RV-099 : Living Sky.
- RV-100 : Grandes Constellations Vivantes.
- RV-101 : Chemins Vivants.

## Architecture generale

Makerland 1.0 repose sur plusieurs familles de fichiers.

- `index.html` porte l'experience principale et les lieux initiaux.
- `css/` rassemble les styles de production, les composants patrimoniaux et les experiences autonomes.
- `js/` contient les modules autonomes du territoire vivant, sans dependance externe.
- `data/` regroupe les donnees structurantes non metier ajoutees pour les archives, le graphe, les chemins, les saisons et les constellations.
- `atelier/` accueille les chambres de l'Atelier IA et les Archives Vivantes consultables.
- `constellation/` accueille les pages narratives liees a la Constellation des Recits Vivants.
- `docs/` conserve la documentation fondatrice, patrimoniale, historique et conceptuelle.
- `reports/` conserve les rapports de mission.

## Principales fonctionnalites conservees

- Bibliotheque Vivante.
- Boussole Vivante et suggestions narratives.
- Cartes Narratives et passage vers l'Atlas.
- Passage de l'Arche vers l'oeuvre immersive.
- Atelier IA structure en chambres vivantes.
- Archives Vivantes consultables.
- Inventaire patrimonial de l'oeuvre immersive.
- Graphe Vivant et reseaux conceptuels.
- Constellation Vivante, Ciel Vivant et Grandes Constellations.
- Guide Vivant et Conservateur Vivant.
- Chemins Vivants.
- Carnet de Voyage et memoire locale non intrusive.
- Configuration PWA de l'application.

## Philosophie

Makerland n'est pas pense comme une application utilitaire. Il est concu comme un territoire culturel numerique ou les oeuvres, les dialogues, les cartes, les archives, les images, les concepts et les visiteurs demeurent relies.

La version 1.0 fixe un principe durable : chaque evolution future devra enrichir l'habitabilite du territoire plutot que multiplier les effets ou les fonctionnalites. Les animations restent lentes, les donnees personnelles restent locales, la navigation demeure libre et les relations narratives priment sur la captation de l'attention.

## Statistiques de la release

Ces statistiques correspondent au depot suivi par Git au moment de la preparation de Makerland 1.0, avant ajout de l'archive ZIP comme artefact externe.

| Mesure | Valeur |
| --- | ---: |
| Fichiers suivis | 294 |
| Pages HTML | 41 |
| Modules JavaScript | 33 |
| Lignes JavaScript | 9539 |
| Fichiers JSON | 18 |
| Documents Markdown / texte | 162 |
| Images raster | 28 |
| SVG | 2 |
| Rapports RV suivis | 92 |

## Archive patrimoniale

L'archive officielle associee a cette release est :

`Makerland-1.0.zip`

Elle est produite depuis le commit de release avec `git archive`, ce qui exclut naturellement :

- `.git/`
- `node_modules/`
- fichiers non suivis locaux
- caches et fichiers temporaires non versionnes

Elle conserve le contenu versionne du projet : HTML, CSS, JavaScript, JSON, Markdown, SVG, images, documentation, rapports et assets.

## Reference

Tag Git :

`makerland-v1.0.0`

Titre de release :

`Makerland 1.0 — Foundation & Living Territory`
