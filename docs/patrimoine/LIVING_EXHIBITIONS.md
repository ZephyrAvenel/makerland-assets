# Grandes Constellations Vivantes

RV-100 transforme les familles du Ciel Vivant en expositions editoriales permanentes.

Une Grande Constellation n'ajoute aucune relation nouvelle. Elle revele les relations deja presentes dans le patrimoine de Makerland : archives, concepts, oeuvres, livres, images, figures, articles et salles.

## Philosophie

Les Grandes Constellations ne sont pas des menus.

Elles sont des expositions vivantes : des ensembles coherents ou le visiteur peut comprendre comment une idee traverse plusieurs formes du territoire.

Chaque exposition peut accueillir les recits des voyageurs, mais elle ne represente jamais des personnes. Elle rassemble des fragments, des ressources et des relations.

## Architecture

La couche RV-100 est autonome :

- `js/livingExhibitions.js`
- `css/livingExhibitions.css`

Elle est chargee sur l'ecran `e08_constellation`.

Elle ne modifie aucun moteur global, aucune navigation, aucun rendu de livre et aucun JSON metier.

## Les huit expositions

Les Grandes Constellations sont :

1. Dialogue
2. Liberte
3. Monde commun
4. Transformation
5. Transmission
6. Esperance
7. Seuil
8. Vivant

Elles s'appuient sur les familles RV-099 et sur les catalogues RV-090/RV-091.

## Sources utilisees

- `data/constellation-themes.json`
- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`
- `makerland:traveler-constellation`
- `makerland:living-cycle`

## Fonctionnement

Pour chaque exposition, le module :

1. recherche les concepts correspondant aux indices editoriaux ;
2. rassemble les archives reliees a ces concepts ;
3. deduit les oeuvres et livres associes ;
4. recupere images patrimoniales, figures et articles ;
5. relie les salles Makerland deja presentes dans le Graphe Vivant ;
6. compte les etoiles locales issues des recits voyageurs.

## Parcours narratif

Chaque exposition propose un chemin simple :

Grande Constellation

Archive Vivante

Oeuvre ou livre

Salle Makerland

Figure

Constellation Vivante

Oeuvre immersive

Le visiteur peut suivre ce parcours ou l'interrompre a tout moment.

## Exposition tournante

Le module selectionne une exposition mise a l'honneur selon la semaine courante.

Cette rotation est locale et deterministe. Elle ne demande aucun serveur.

## Integration avec le Guide Vivant

Le module inscrit dans `makerland:living-cycle` l'exposition actuellement mise a l'honneur.

Le Guide Vivant pourra ainsi formuler plus tard des phrases comme :

> Aujourd'hui, la Grande Constellation de la Transmission est mise a l'honneur.

## Integration avec le Ciel Vivant

Lorsque plusieurs etoiles locales existent dans une famille, l'exposition affiche leur nombre. Les constellations peuvent ainsi grandir avec les recits sans changer l'architecture.

## Evolutions futures

- Ajouter des liens profonds vers les archives HTML.
- Relier les objets NFC lorsqu'ils seront catalogues.
- Permettre une lecture plein ecran de chaque exposition.
- Faire apparaitre les expositions dans le Carnet de Voyage.
- Produire une version imprimable pour la revue ou les dossiers patrimoniaux.

La regle demeure : les Grandes Constellations ne creent pas le patrimoine. Elles rendent visible ce qui est deja relie.
