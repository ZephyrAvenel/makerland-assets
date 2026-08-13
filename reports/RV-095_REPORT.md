# RV-095 - Restauration du Patrimoine Vivant

## Objectif

Produire un plan documentaire de restauration a partir de l'audit du Conservateur Vivant, sans modifier les donnees patrimoniales existantes ni les fichiers de production.

## Sources utilisees

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`
- `js/livingCurator.js`

## Livrables crees

- `docs/patrimoine/PATRIMONY_RESTORATION_PLAN.md`
- `docs/patrimoine/ORPHAN_NODES.md`
- `docs/patrimoine/MISSING_RELATIONS.md`
- `docs/patrimoine/CURATOR_RECOMMENDATIONS.md`
- `docs/patrimoine/CONSERVATION_DASHBOARD.md`
- `data/restoration-plan.json`

## Statistiques

| Indicateur | Valeur |
| --- | ---: |
| Archives | 10 |
| Concepts | 26 |
| Oeuvres | 10 |
| Images | 101 |
| Noeuds du graphe | 318 |
| Relations du graphe | 713 |
| Noeuds orphelins | 49 |
| Concepts sans illustration | 5 |
| Archives sans oeuvre | 4 |
| Oeuvres sans concepts | 3 |
| Images non reliees | 3 |
| Densite relationnelle actuelle | 2.24 |
| Densite estimee apres restauration | 2.44 |

## Priorisation

- Faible risque : 22
- Validation editoriale souhaitable : 42
- Decision exclusivement humaine : 0

## Validation

- `node --check js/livingCurator.js` : OK.
- Validation JSON de `data/restoration-plan.json` : OK.
- `git diff --check` sur les livrables RV-095 : OK.
- `git diff --cached --check` : OK apres staging.

## Notes

Cette mission ne modifie aucun HTML, CSS, JavaScript de production, moteur ou JSON metier. Le fichier `data/restoration-plan.json` est un livrable documentaire de planification ; il ne remplace pas les catalogues existants.
