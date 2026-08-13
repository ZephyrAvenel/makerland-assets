# RV-084 - Memoire Vivante du Voyageur

## Objectif

RV-084 ajoute une memoire locale et discrete du parcours du visiteur dans les lieux vivants de Makerland. Cette memoire ne cree aucun compte, n'envoie aucune donnee et reste limitee a `localStorage`.

## Fichiers modifies

- `atelier/living-cycle.js`
- `atelier/atelier-objects.js`
- `carnet/carnet.js`
- `carnet/index.html`
- `css/placeholder.css`

## Memoire locale ajoutee

La cle principale reste :

`makerland:living-cycle`

Elle peut maintenant conserver :

- `visitedPlaces` : lieux visites avec identifiant, libelle et date locale de premiere rencontre.
- `visitedPlaceIds` : identifiants simples pour marquer les lieux deja parcourus.
- `milestones` : premiers souvenirs narratifs, par exemple `Premiere visite de l'Atelier`, `Dialogue explore`, `Constellation decouverte`, `Carnet ouvert`, `Transmission visitee`.
- `lastVisitedPlace` : dernier lieu inscrit.
- `currentPlaceWasKnown` : indication interne permettant d'afficher parfois une phrase de retour.
- `atelierObjectIds` et `atelierObjects` : objets vivants deja rencontres dans les chambres de l'Atelier.

## Interactions ajoutees

### Carnet du Voyage

Le Carnet inscrit desormais son ouverture dans la memoire locale et affiche une nouvelle section :

`Vos premiers pas`

Cette section raconte automatiquement les premiers lieux traverses sous forme de phrases simples et poetiques.

### Lieux deja parcourus

Les liens vers des chambres deja visitees peuvent recevoir un marquage discret :

`Deja parcouru`

Le style reste volontairement faible : bordure plus chaude, halo leger, badge discret.

### Objets rencontres

Les objets vivants consultes dans l'Atelier sont maintenant reconnus depuis `localStorage`, et pas seulement depuis `sessionStorage`. Un objet deja rencontre reste donc marque lors d'une visite ulterieure.

### Cycle Vivant

Le Carnet illumine progressivement les etapes du cycle selon les traces presentes :

- Bibliotheque
- Atelier
- Carnet
- Constellation
- Transmission
- Oeuvres
- Boussole
- Cartes Narratives

Cette representation ne mesure rien et ne cree aucun score.

### Phrases vivantes de retour

Lorsqu'un lieu deja connu est revisite, `living-cycle.js` peut afficher rarement une phrase douce, par exemple :

- `Ce lieu vous reconnait.`
- `Certaines idees murissent en silence.`
- `Vous poursuivez un recit commence plus tot.`
- `Les chemins changent avec ceux qui les parcourent.`

## Respect des contraintes

- Aucun compte.
- Aucun serveur.
- Aucun appel reseau ajoute.
- Aucun cookie externe.
- Aucun changement de navigation globale.
- Aucun changement de BookRenderer.
- Aucun changement de ZoneRenderer.
- Aucun changement de NarrativeMemory.
- Aucun changement de LivingEcho.
- Aucun JSON metier modifie.

## Validation

- `node --check atelier/living-cycle.js` : OK.
- `node --check atelier/atelier-objects.js` : OK.
- `node --check carnet/carnet.js` : OK.
- `git diff --check` : OK.

## Ameliorations possibles pour RV-085

- Relier progressivement les Cartes Narratives a la memoire du Carnet.
- Inscrire les passages vers les oeuvres immersives dans `lastImmersiveWork`.
- Ajouter une interface locale de suppression de la memoire du voyage.
- Etendre les marqueurs discrets aux futures pages de la Constellation.
- Ajouter des libelles editoriaux plus precis pour les livres et fragments ouverts.
