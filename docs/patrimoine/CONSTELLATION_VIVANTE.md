# Constellation Vivante

La Constellation Vivante est la premiere experience interactive construite a partir du Graphe Vivant RV-091.

Elle ne remplace pas les catalogues patrimoniaux. Elle les rend explorables.

## Role

La page permet de partir d'un point du territoire :

- concept ;
- archive ;
- oeuvre ;
- image ;
- figure ;
- salle ;
- bloc / article candidat.

Puis elle revele les relations deja presentes dans :

- `data/living-graph.json` ;
- `data/concept-network.json` ;
- `data/work-network.json` ;
- `data/archive-assets.json` ;
- `data/archive-mapping.json`.

## Experience creee

Page :

`constellation/vivante/index.html`

Le visiteur peut :

- cliquer sur un concept ;
- cliquer sur une oeuvre ;
- ouvrir une archive ;
- passer d'une image a une figure ;
- rejoindre une salle documentaire ;
- observer un graphe SVG genere localement.

## Entree "Ecologie narrative"

`Ecologie narrative` n'est pas encore un concept source dans `CONCEPT_CATALOG.md`.

La Constellation Vivante l'expose comme entree relationnelle issue du corpus iconographique RV-090, notamment a partir de :

`micro-ecologie-narrative.png`

Cette entree ne modifie pas les donnees sources. Elle sert uniquement de porte de lecture vers les relations deja presentes.

## Articles et packs narratifs

RV-091 ne contient pas encore de catalogue dedie aux articles ni aux packs narratifs.

La Constellation Vivante affiche donc :

- les blocs/titres detectes comme articles candidats ;
- les packs narratifs comme relation non structuree lorsque la source ne les fournit pas.

Cette limite est volontaire. Elle evite d'inventer des liens.

## Extension future

Lorsque les futures missions ajouteront :

- un catalogue d'articles ;
- un catalogue de packs narratifs ;
- les archives D011+ ;
- des objets NFC ;
- des pages illustrees d'archives ;

la Constellation Vivante pourra les rendre navigables sans changer son principe :

un point du graphe devient une porte vers tous ses liens.
