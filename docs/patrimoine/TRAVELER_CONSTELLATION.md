# Constellation des Voyageurs

La Constellation des Voyageurs transforme les phrases deposees dans Makerland en traces locales, reliees aux familles poetiques du territoire.

Elle n'est pas un livre d'or. Elle ne publie rien. Elle n'envoie aucune donnee. Elle donne simplement une forme sensible a ce que le visiteur choisit de laisser dans son propre navigateur.

## Philosophie

Chaque phrase devient une etoile.

Chaque etoile rejoint une famille narrative.

Chaque famille peut entrer en resonance avec les concepts, les archives, les oeuvres et les salles deja presents dans le Graphe Vivant.

La Constellation ne cherche pas a collecter. Elle cherche a rendre visible une memoire poetique et locale du passage.

## Architecture

La couche RV-097 est autonome :

- `js/travelerConstellation.js`
- `css/traveler-constellation.css`
- `data/traveler-categories.json`

Elle s'accroche au formulaire existant de `e08_constellation` sans modifier le moteur global, la navigation, `BookRenderer`, `ZoneRenderer`, `NarrativeMemory` ou `LivingEcho`.

## Memoire locale

Les fragments enrichis sont conserves dans :

`makerland:traveler-constellation`

Chaque fragment contient :

- texte ;
- date ;
- saison ;
- moment de la journee ;
- lieu visite ;
- salle active ;
- categorie narrative ;
- eclat ;
- concepts associes ;
- premieres resonances patrimoniales.

Le module met aussi a jour tres discretement `makerland:living-cycle` afin que le Carnet et les autres lieux puissent savoir qu'une trace de voyageur existe.

## Categories narratives

Les categories sont definies dans `data/traveler-categories.json`.

Elles reposent sur un dictionnaire local simple :

- Nature ;
- Esperance ;
- Liberte ;
- Seuil ;
- Transformation ;
- Dialogue ;
- Renaissance ;
- Transmission ;
- Monde commun ;
- Resonance.

Si aucune correspondance n'est trouvee, la phrase rejoint la famille Resonance.

## Resonances patrimoniales

Le module lit exclusivement :

- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

Il recherche des correspondances lexicales simples avec :

- concepts ;
- oeuvres ;
- archives ;
- images ;
- salles.

Aucune IA, aucune API et aucun serveur ne sont utilises.

## Vue Constellation

La visualisation est un SVG leger.

Les fragments deviennent des etoiles. Les etoiles d'une meme famille sont reliees par des lignes tres discretes. Les animations utilisent `opacity` et le rendu SVG natif, avec respect de `prefers-reduced-motion`.

## Evolutions possibles

Les prochaines versions pourront :

- afficher une vue detaillee par famille ;
- faire remonter certaines resonances dans le Carnet de Voyage ;
- relier les fragments a la Constellation Vivante RV-092 ;
- permettre une exportation locale des etoiles ;
- proposer une suppression selective des fragments.

Ces extensions devront conserver le principe fondateur : la Constellation accompagne le visiteur sans le profiler.
