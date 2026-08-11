# RV-037 - Lisibilite des en-tetes et restauration des boutons Retour

## Resume

RV-037 est une mission strictement visuelle.

Aucune destination de navigation, aucune logique JavaScript de navigation, aucun moteur et aucun JSON n'ont ete modifies.

## Ajustements realises

### Boutons Retour

- Ajout du bouton `Retour a la Boussole Vivante` sur `e04_oeuvre`, qui n'en possedait pas encore.
- Augmentation du `z-index` de `.living-return-button` afin que les retours restent visibles au-dessus des couches BookRenderer et des passages immersifs.
- Les boutons conservent la destination existante `e03_boussole`.

### Lisibilite des textes superieurs

- Legere augmentation du titre de l'ecran Meteo.
- Legere augmentation du sous-titre de l'ecran Meteo.
- Restauration du sous-titre Meteo en portrait mobile, auparavant masque par CSS.
- Legere augmentation du Murmure des Passages Vivants, utilise notamment par la Foret et les Cartes Narratives.

## Navigation verifiee

| Porte | Destination conservee |
| --- | --- |
| Explorer | `e05_cartes` |
| Decouvrir | `e04_oeuvre` |
| Contempler | `e06_fiction` |
| Creer | `e07_atelier` |
| Trouver un repere | `e08_constellation` |

## Boutons Retour verifies

Les boutons `data-return-screen="e03_boussole"` sont presents sur les salles secondaires, y compris :

- `e04_oeuvre`
- `e05_cartes`
- `e06_fiction`
- `e07_atelier`
- `e08_constellation`

## Validation

- Controle statique des cinq destinations de la Boussole.
- Controle statique des boutons Retour vers `e03_boussole`.
- `git diff --check` : OK.

## Limite

La mission n'a pas modifie les animations ni les transitions. Les validations visuelles Android portrait doivent etre confirmees dans le navigateur cible apres deploiement GitHub Pages.
