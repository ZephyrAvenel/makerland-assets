# RV-093 - Le Guide Vivant de Makerland

## Objectif

Créer une presence narrative discrete capable de transformer les relations du Graphe Vivant en suggestions d'exploration.

Le Guide Vivant n'est pas un chatbot et ne fait aucun appel externe.

## Sources utilisees

Uniquement les donnees deja presentes :

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

## Fichiers crees

- `js/livingGuide.js`
- `docs/patrimoine/GUIDE_VIVANT.md`
- `reports/RV-093_REPORT.md`

## Fichiers modifies

- `constellation/index.html` : ajout d'une entree locale vers la Constellation Vivante.
- `constellation/vivante/index.html` : ajout du conteneur du Guide et chargement du module.
- `js/livingConstellation.js` : emission et reception d'evenements locaux de selection.

## Architecture

`livingGuide.js` est autonome :

- il charge les JSON relationnels ;
- il construit un index de libelles ;
- il ecoute `living-graph:selected` ;
- il calcule une suggestion narrative ;
- il affiche une carte discrete ;
- il memorise localement les nœuds rencontres.

Le bouton `Explorer` emet :

`living-graph:request-selection`

La Constellation Vivante peut alors recentrer le graphe sur la relation suggeree.

## Familles de suggestions

- Resonance
- Prolongement
- Origine
- Transformation
- Correspondance
- Retour

## Memoire locale

Cle utilisee :

`makerland.livingGuide.memory`

Donnees stockees :

- `visited`
- `last`
- `updatedAt`

Aucune donnee n'est envoyee a un serveur.

## Statistiques exploitees

- 318 nœuds dans `living-graph.json`
- 713 relations
- 26 concepts
- 10 archives
- 10 œuvres / couvertures
- 98 images patrimoniales
- 88 figures
- 6 salles

## Contraintes respectees

- Aucun moteur modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun NarrativeMemory modifie.
- Aucun LivingEcho modifie.
- Aucun JSON metier modifie.
- Aucune navigation globale modifiee.
- Aucun appel API.
- Aucune IA.

## Validations

- `node --check js/livingGuide.js` : OK.
- `node --check js/livingConstellation.js` : OK.
- JSON relationnels : OK.
- `git diff --cached --check` : OK.
