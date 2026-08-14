# UX-029 - Ajouter les Cartes Narratives au Premier Voyage

## Objectif

Integrer les Cartes Narratives comme lieu majeur du Premier Voyage, avant l'Atelier des Recits, afin que le parcours guide raconte plus clairement comment les idees deviennent des chemins.

## Etape ajoutee

### Etape 4 / 7

Titre :

`Comment les idees deviennent-elles des chemins ?`

Lieu :

`Cartes Narratives`

Sous-titre :

`Ici les idees deviennent des chemins.`

Texte :

`Les Recits Vivants ne proposent pas seulement des reponses. Ils offrent des cartes pour explorer une question, une relation, un paysage interieur ou une transformation. Chaque carte ouvre un chemin different. En les parcourant, vous decouvrez qu'une idee peut devenir un territoire a habiter.`

Citation :

`Les cartes n'enferment pas le monde. Elles ouvrent des chemins pour le regarder autrement.`

Bouton principal de lieu :

`Ouvrir l'Atlas`

Destination :

`https://zephyravenel.github.io/atlas-recits-vivants/`

## Comportement de l'Atlas

Le lien ouvre l'Atlas dans le meme onglet, comme un lien standard.

L'etape courante reste conservee dans `localStorage` avec la cle `makerland.firstJourney`. Un retour navigateur vers Makerland retrouve donc le Premier Voyage sur l'etape active, tant que la session de navigation revient sur la page de l'application.

## Renumerotation

Le Premier Voyage contient maintenant sept etapes :

1. Le Seuil des Climats.
2. Bibliotheque Vivante.
3. Boussole Vivante.
4. Cartes Narratives.
5. L'Atelier des Recits.
6. Archives Vivantes.
7. Constellation.

La conclusion et la Foret de l'Arche restent hors numerotation.

## Fichiers modifies

- `js/firstJourney.js`
- `reports/UX-029_REPORT.md`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucune navigation generale modifiee.
- Aucun style modifie.

## Validations

- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.
- Parcours complet du Premier Voyage : controle statique OK.
- Ouverture de l'Atlas : lien direct en meme onglet vers `https://zephyravenel.github.io/atlas-recits-vivants/`.
- Retour au parcours : l'etape reste conservee dans `makerland.firstJourney`.
- Numerotation coherente jusqu'a la Foret de l'Arche : OK.

## Note de validation visuelle

La validation navigateur reelle desktop, mobile portrait et mobile paysage reste a effectuer hors de cet environnement. Les controles effectues ici portent sur la syntaxe JavaScript, le diff Git et la coherence du flux dans `js/firstJourney.js`.
