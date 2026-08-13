# Ciel Vivant

RV-099 introduit le Ciel Vivant de la Constellation des Recits Vivants.

Le Ciel Vivant ne represente pas des utilisateurs. Il represente des fragments de recits. Chaque phrase deposee localement devient une etoile stable, reliee aux autres etoiles de sa famille narrative.

## Philosophie

La Constellation ne doit pas se remplir vite. Elle doit grandir lentement.

Une etoile signifie qu'une parole a ete deposee. Une constellation signifie que plusieurs fragments commencent a se repondre. Un territoire lumineux signifie qu'une famille de recits devient suffisamment habitee pour former un paysage.

## Architecture

La couche RV-099 est autonome :

- `js/livingSky.js`
- `css/livingSky.css`
- `data/constellation-themes.json`

Elle est chargee sur l'ecran `e08_constellation` sans modifier les moteurs globaux.

## Sources locales

Le Ciel lit :

- `makerland:traveler-constellation` pour les fragments enrichis RV-097 ;
- `makerland_stories` comme repli pour les anciennes traces ;
- `makerland:living-cycle` pour inscrire une synthese locale du ciel ;
- `data/constellation-themes.json` pour les familles narratives ;
- `data/concept-network.json`, `data/work-network.json` et `data/archive-mapping.json` pour les libelles patrimoniaux.

## Algorithme de placement

Chaque etoile recoit des coordonnees locales calculees de maniere deterministe a partir de son identifiant.

Le calcul repose sur un hash simple :

1. l'identifiant est transforme en entier ;
2. cet entier produit une coordonnee `x` entre 7 et 93 ;
3. une seconde portion du meme hash produit une coordonnee `y` entre 9 et 83.

Ainsi, le ciel reste stable apres rechargement sans stocker de coordonnees supplementaires.

## Familles

Les familles sont :

- Nature ;
- Esperance ;
- Liberte ;
- Monde commun ;
- Transmission ;
- Transformation ;
- Seuil ;
- Dialogue ;
- Renaissance ;
- Resonance.

Chaque famille possede des mots-clefs, une couleur, des concepts, des archives, des oeuvres et une citation.

## Seuils de croissance

- 2 etoiles : premier lien ;
- 5 etoiles : premiere constellation ;
- 10 etoiles : constellation developpee ;
- 25 etoiles : territoire lumineux.

Ces seuils ne creent aucune recompense. Ils servent seulement a nommer l'etat poetique d'un territoire.

## Trois modes

### Le Ciel

Mode contemplatif. Les etoiles et les liens sont visibles.

### Les Territoires

Mode editorial. Les familles affichent leur nombre d'etoiles, leurs concepts, archives et oeuvres associes.

### La Croissance

Mode patrimonial. La page montre l'evolution locale du ciel : nombre d'etoiles, constellations habitees et seuils.

## Guide Vivant

Le module inscrit une courte synthese dans `makerland:living-cycle`. Les futures couches du Guide Vivant pourront la lire pour formuler des phrases comme :

> La constellation du Dialogue grandit.

## Conservateur Vivant

Le module expose `LivingSky.audit()` afin de signaler :

- etoiles sans categorie ;
- territoires vides ;
- desequilibre entre familles.

Le Conservateur ne modifie rien. Il observe seulement l'etat local du ciel.

## Respect de l'experience

Toutes les animations sont discretes et respectent `prefers-reduced-motion`.

Le Ciel n'appelle aucun serveur, aucune API et aucune IA distante.
