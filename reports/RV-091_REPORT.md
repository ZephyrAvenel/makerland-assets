# RV-091 - Le Graphe Vivant de Makerland

## Sources utilisees

Sources RV-090 exclusivement :

- `docs/patrimoine/`
- `data/archive-assets.json`
- `data/archive-mapping.json`

## Livrables crees

- `docs/patrimoine/LIVING_GRAPH.md`
- `docs/patrimoine/CONCEPT_RELATIONS.md`
- `docs/patrimoine/WORK_RELATIONS.md`
- `docs/patrimoine/IMAGE_RELATIONS.md`
- `docs/patrimoine/TIMELINE_RELATIONS.md`
- `docs/patrimoine/GRAPH_GUIDE.md`
- `docs/patrimoine/assets/LIVING_GRAPH.svg`
- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`

## Statistiques

| Mesure | Nombre |
| --- | --- |
| Concepts | 26 |
| Archives | 10 |
| Œuvres / couvertures | 10 |
| Images patrimoniales | 98 |
| Figures | 88 |
| Salles | 6 |
| Blocs / articles candidats | 80 |
| Nœuds du graphe | 318 |
| Relations | 713 |

## Architecture retenue

Le graphe repose sur trois vues JSON :

- `living-graph.json` pour la vue globale.
- `concept-network.json` pour les parcours par concept.
- `work-network.json` pour les parcours par livre/couverture.

Les documents Markdown sont des vues lisibles de ces relations.

## Limites documentees

- Les articles ne disposent pas encore d'un catalogue dedie dans RV-090 ; ils sont donc representes par les blocs/titres detectes dans `PAGE_CATALOG.md`.
- Les packs narratifs ne sont pas structures dans RV-090 ; les relations sont laissees vides volontairement.
- Les relations sont une premiere passe patrimoniale, destinee a etre affinee avec les futures archives D011+.

## Validations

- JSON `living-graph.json` valide.
- JSON `concept-network.json` valide.
- JSON `work-network.json` valide.
- `git diff --cached --check` a executer avant commit.
