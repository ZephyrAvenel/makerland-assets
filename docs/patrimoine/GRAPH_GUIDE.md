# Guide de maintenance du Graphe Vivant

## Structure

Le graphe est constitue de trois fichiers machine :

- `data/living-graph.json` : graphe global, tous nœuds et relations.
- `data/concept-network.json` : vue centree sur les concepts.
- `data/work-network.json` : vue centree sur les œuvres/couvertures.

## Sources

Le graphe RV-091 depend exclusivement des livrables RV-090 :

- `data/archive-assets.json`
- `data/archive-mapping.json`
- `docs/patrimoine/CONCEPT_CATALOG.md`
- `docs/patrimoine/PAGE_CATALOG.md`

## Types de nœuds

| Type | Description |
| --- | --- |
| archive | Archives D001-D010 |
| concept | Concepts patrimoniaux |
| work | Livre ou couverture candidate |
| image | Image patrimoniale |
| figure | Figure issue d'une image |
| room | Salle Makerland |
| article-block | Bloc/titre de la page immersive |

## Extension future

Pour ajouter D011, D012 ou une nouvelle ressource :

1. Completer les catalogues RV-090.
2. Ajouter les correspondances dans `data/archive-mapping.json`.
3. Regenerer le graphe.
4. Verifier les JSON.
5. Mettre a jour les documents relationnels.

## Principe

Le graphe ne doit pas devenir une couche narrative autonome. Il doit rester une infrastructure documentaire : il relie, il rend visible, il prepare les futures archives illustrees.
