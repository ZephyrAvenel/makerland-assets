# UX-041 — Chemins de voyage repliables

## Objectif

Remplacer les trois grandes cartes de la page d'accueil par une navigation plus compacte, sans modifier les parcours existants.

## Fichier de la page d'accueil identifié

- `js/livingHome.js` génère la couche d'accueil des Récits Vivants.
- `css/livingHome.css` définit sa présentation responsive.

## Modifications réalisées

### Navigation compacte

Les trois anciennes cartes d'entrée ont été remplacées par un panneau unique :

- `Votre chemin` reste visible par défaut.
- `Je découvre` ou `Premier Voyage accompli ✓` conserve le lancement du Premier Voyage.
- `Autres chemins ▾` affiche les parcours secondaires à la demande.

### Chemins repliables

Le bouton `Autres chemins` ouvre et referme :

- `Je poursuis mon voyage`
- `J'explore librement`

Le déroulé utilise une transition CSS douce sur `max-height`, `opacity` et `transform`, avec une durée d'environ 220 à 260 ms.

### Fonctionnalités conservées

- `Je découvre` ouvre toujours la page d'introduction du Premier Voyage.
- `Je poursuis mon voyage` conserve la reprise existante.
- `J'explore librement` conserve l'entrée libre existante.
- L'état du Premier Voyage n'est pas modifié par cette présentation.

### Responsive

Le panneau a été compacté sur :

- desktop ;
- mobile portrait ;
- mobile paysage ;
- écrans à faible hauteur.

En paysage, les dimensions et espacements sont réduits afin de préserver la visibilité du titre, du texte d'introduction et de l'image centrale.

## Fichiers modifiés

- `js/livingHome.js`
- `css/livingHome.css`

## Validation

- `node --check js/livingHome.js` : OK.
- Anciennes classes `living-home__door` et `living-home__doors` : non référencées.
- Fonctionnalités existantes : conservées par les mêmes gestionnaires d'action.

## Remarques

Aucune modification n'a été apportée aux moteurs globaux, aux JSON métier, à `BookRenderer`, à `ZoneRenderer` ou à la navigation générale.
