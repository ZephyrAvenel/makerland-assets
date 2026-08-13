# RV-097 - La Constellation des Voyageurs

## Objectif

Transformer la Constellation des Recits Vivants en une memoire collective poetique locale, ou chaque phrase deposee devient une etoile reliee aux categories narratives et au patrimoine de Makerland.

## Fichiers crees

- `js/travelerConstellation.js`
- `css/traveler-constellation.css`
- `data/traveler-categories.json`
- `docs/patrimoine/TRAVELER_CONSTELLATION.md`

## Fichier modifie

- `index.html`

La modification d'`index.html` se limite au chargement du CSS et du module autonome.

## Architecture

Le module s'accroche au formulaire existant de `e08_constellation`.

Lorsqu'un voyageur partage une phrase, l'ancien module `constellation.js` continue d'enregistrer la trace simple dans `makerland_stories`. Le nouveau module cree en parallele un fragment enrichi dans `makerland:traveler-constellation`.

## Donnees enregistrees localement

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
- resonances avec concepts, oeuvres, archives, images et salles.

## Categories

Le fichier `data/traveler-categories.json` contient dix familles :

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

## Resonance patrimoniale

Les correspondances sont calculees localement a partir de :

- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

Aucun appel reseau externe, aucune IA et aucun serveur ne sont utilises.

## Interface

Le module ajoute :

- une visualisation SVG legere ;
- une carte poetique indiquant la constellation rejointe ;
- une memoire personnelle discrete ;
- des chemins d'exploration derives des categories deja rencontrees.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation globale modifiee.
- Aucun `BookRenderer`, `ZoneRenderer`, `NarrativeMemory` ou `LivingEcho` modifie.
- Aucun JSON metier existant modifie.
- Fonctionnement entierement local.
- Respect de `prefers-reduced-motion`.

## Validation

- `node --check js/travelerConstellation.js` : OK.
- Validation JSON de `data/traveler-categories.json` : OK.
- `git diff --check` : OK sur les fichiers de travail.
- `git diff --cached --check` : OK.
