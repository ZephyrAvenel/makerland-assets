# RV-092 - La Constellation Vivante

## Objectif

Transformer le Graphe Vivant RV-091 en premiere experience consultable.

Le visiteur peut partir d'un concept, d'une oeuvre ou d'une archive et voir apparaitre les relations vers archives, livres, images, figures, articles candidats et salles Makerland.

## Sources utilisees

Uniquement les livrables RV-090/RV-091 :

- `docs/patrimoine/`
- `data/archive-assets.json`
- `data/archive-mapping.json`
- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`

## Fichiers crees

- `constellation/vivante/index.html`
- `css/living-constellation.css`
- `js/livingConstellation.js`
- `docs/patrimoine/CONSTELLATION_VIVANTE.md`
- `reports/RV-092_REPORT.md`

## Fonctionnement

La page charge les JSON relationnels en local, construit un index de navigation, puis affiche :

- une liste de concepts ;
- une liste d'oeuvres ;
- une liste d'archives ;
- une recherche ;
- une carte SVG relationnelle ;
- un panneau de relations detaillees.

Chaque relation navigable peut devenir a son tour le centre de la constellation.

## Points particuliers

- `Ecologie narrative` est exposee comme entree relationnelle derivee du corpus iconographique (`micro-ecologie-narrative.png`), sans modification des donnees sources.
- Les articles sont representes par les blocs/titres candidats de `PAGE_CATALOG.md`.
- Les packs narratifs ne sont pas inventes : ils restent vides lorsque RV-091 ne fournit pas de donnees structurees.

## Contraintes respectees

- Aucun moteur modifie.
- Aucune navigation globale modifiee.
- Aucun JSON metier modifie.
- Aucune salle existante modifiee.
- Aucun HTML existant modifie.
- Aucun CSS de production existant modifie.

## Validations

- `node --check js/livingConstellation.js` : OK.
- JSON relationnels : OK.
- `git diff --cached --check` : OK.
