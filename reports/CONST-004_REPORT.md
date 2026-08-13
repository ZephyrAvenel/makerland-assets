# CONST-004 - Optimisation de la Constellation des Recits Vivants

## Objectif

Optimiser l'ergonomie de la Constellation sans modifier son identite graphique, ses parcours, ses destinations ni les moteurs globaux.

## Probleme identifie

Deux surfaces pouvaient gener l'interaction :

- `.living-sky__panel` restait en `pointer-events:auto` meme lorsqu'il etait invisible (`opacity:0`). Il pouvait donc intercepter des clics alors que le panneau n'etait pas perceptible.
- `.living-paths__progress` se superposait au bouton `Commencer` en paysage smartphone. Il gardait `pointer-events:auto`, ce qui expliquait que certains elements visibles ne repondent pas au toucher.

## Corrections appliquees

- `css/livingSky.css`
  - panneau de detail reduit en largeur et hauteur ;
  - `pointer-events:none` par defaut ;
  - `pointer-events:auto` uniquement quand le panneau est visible ;
  - espacements internes, paragraphes et badges legerement compactes.

- `css/livingPaths.css`
  - panneau des Chemins Vivants reduit et recentre ;
  - surface externe du panneau rendue traversable avec `pointer-events:none` ;
  - contenu interactif limite aux cartes et au detail ;
  - cinq cartes de chemin compactees ;
  - etirement de grille supprime via `align-content:start` ;
  - rail de progression rendu non bloquant ;
  - rail masque en paysage bas pour eviter tout recouvrement.

- `js/livingPaths.js`
  - lignes d'etapes restructurees localement pour afficher une ligne compacte avec filet pointille entre le lieu et l'action `Ouvrir`.

## Validation responsive

Tests effectues en local via serveur statique `http://127.0.0.1:8765/index.html`.

- Desktop `1280 x 720`
  - panneau Chemins ouvert : environ 35,6 % de la surface ;
  - plus de 60 % du fond reste visible ;
  - cartes de chemin reduites d'environ 118 px a 60 px de haut ;
  - boutons `Ouvrir` visibles.

- Smartphone portrait type Samsung `412 x 915`
  - panneau ouvert : environ 13,8 % de la surface ;
  - cinq cartes visibles dans la largeur ;
  - boutons `Ouvrir` visibles ;
  - panneau non bloquant hors contenu.

- Smartphone paysage type Samsung `915 x 412`
  - panneau ouvert : environ 28,5 % de la surface ;
  - rail de progression non bloquant et masque sur paysage bas ;
  - cartes visibles ;
  - boutons `Ouvrir` visibles.

## Validations techniques

- `node --check js/livingPaths.js` : OK
- `git diff --check` : OK

## Fichiers modifies

- `css/livingSky.css`
- `css/livingPaths.css`
- `js/livingPaths.js`
- `reports/CONST-004_REPORT.md`

## Anomalies restantes

Aucune anomalie bloquante observee dans le perimetre CONST-004.

Les avertissements reseau vus pendant l'automatisation provenaient de l'environnement du navigateur integre, pas du projet local.
