# RV-099 - Constellation Vivante Evolutive

## Objectif

Transformer la Constellation des Recits Vivants en ciel vivant local : chaque recit depose devient une etoile stable, reliee aux autres etoiles de sa famille narrative.

## Fichiers crees

- `js/livingSky.js`
- `css/livingSky.css`
- `data/constellation-themes.json`
- `docs/patrimoine/LIVING_SKY.md`

## Fichier modifie

- `index.html`

La modification se limite au chargement du CSS et du module autonome.

## Fonctionnement

Le module lit les fragments de `makerland:traveler-constellation` crees par RV-097. Si aucun fragment enrichi n'existe encore, il peut lire les anciennes traces `makerland_stories`.

Chaque fragment devient une etoile avec :

- identifiant ;
- texte ;
- date ;
- saison ;
- moment ;
- categorie ;
- concepts associes ;
- coordonnees locales deterministes.

## Modes prevus

- Le Ciel : visualisation poetique des etoiles et des liens.
- Les Territoires : regroupement editorial par famille.
- La Croissance : lecture patrimoniale de l'evolution locale.

## Familles

Le fichier `data/constellation-themes.json` contient dix familles :

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

## Integration locale

Le module met a jour `makerland:living-cycle` avec un resume du ciel afin que le Guide Vivant puisse plus tard formuler une suggestion discrete.

Il expose aussi `LivingSky.audit()` pour les usages futurs du Conservateur Vivant.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation modifiee.
- Aucun `BookRenderer`, `ZoneRenderer`, `NarrativeMemory` ou `LivingEcho` modifie.
- Aucun JSON metier existant modifie.
- Aucun serveur.
- Aucune IA.
- Fonctionnement local uniquement.
- Respect de `prefers-reduced-motion`.

## Validation

- `node --check js/livingSky.js` : OK.
- Validation JSON de `data/constellation-themes.json` : OK.
- `git diff --check` : OK sur les fichiers de travail.
- `git diff --cached --check` : OK.
