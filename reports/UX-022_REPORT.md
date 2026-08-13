# UX-022 - Transformer le Premier Voyage en histoire

## Synthese

UX-022 transforme le Premier Voyage en fil narratif.

Le parcours ne se presente plus comme une visite guidee de lieux successifs. Chaque etape repond maintenant a une question simple que peut se poser un nouveau visiteur.

## Nouvelle structure

1. Meteo
   Question : `Pourquoi ce territoire existe-t-il ?`

2. Bibliotheque Vivante
   Question : `A quoi ressemblent les oeuvres qui naissent ici ?`

3. Atelier IA
   Question : `Comment naissent-elles ?`

4. Archive D001
   Question : `Peut-on voir leurs coulisses ?`

5. Constellation
   Question : `Comment toutes ces oeuvres dialoguent-elles entre elles ?`

## Principe narratif

Chaque etape commence par :

`Vous vous demandez peut-etre...`

Puis elle apporte une reponse breve, concrete et accessible.

Cette structure aide le visiteur a retenir le sens du parcours sans avoir l'impression de suivre un tutoriel.

## Conclusion modifiee

La fin ne dit plus simplement que le voyage est termine.

Elle explique que le visiteur connait maintenant les cinq lieux fondateurs de Makerland, puis l'invite a explorer librement le reste du territoire.

## Fichier modifie

- `js/firstJourney.js`

## Contraintes respectees

- Aucune route modifiee.
- Aucune destination modifiee.
- Aucun moteur global modifie.
- Aucun JSON modifie.
- Aucun changement CSS.
- Aucun changement HTML.

## Validations

- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK, avec avertissement CRLF attendu.
- Verification locale : l'etape 1 affiche `Pourquoi ce territoire existe-t-il ?`.
- Verification locale : l'etape 1 commence par `Vous vous demandez peut-etre...`.
- Verification locale : la conclusion affiche `Vous connaissez maintenant les cinq lieux fondateurs de Makerland.`
- Verification locale : la navigation du Premier Voyage reste intacte jusqu'a la Constellation.
