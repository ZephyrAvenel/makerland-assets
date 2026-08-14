# UX-028 - Reprise du Premier Voyage et Boussole Vivante

## Objectifs

Cette mission corrige deux points independants :

- empecher le Premier Voyage de reprendre automatiquement une ancienne etape au lancement de l'application ;
- integrer la Boussole Vivante et les Cartes Narratives dans le Premier Voyage.

## Origine du bug de reprise

Le module `js/firstJourney.js` relisait `makerland.firstJourney` au demarrage.

Lorsque cette memoire contenait encore :

- `active: true` ;
- `completed: false` ;
- une `step` sauvegardee ;

le rendu initial sur `e01_accueil` declenchait aussitot la synchronisation vers l'etape memorisee. L'utilisateur pouvait donc ouvrir l'application et etre renvoye directement vers une etape avancee, par exemple `Etape 4 / 5`, sans avoir choisi de reprendre.

## Correction appliquee

Le Seuil reste maintenant prioritaire au demarrage.

Sur `e01_accueil`, une memoire active du Premier Voyage n'entraine plus aucune reprise implicite. La couche du Premier Voyage reste fermee.

La reprise devient explicite :

- `Je decouvre` ouvre toujours la page intermediaire puis demarre a l'etape 1 ;
- `Je poursuis mon voyage` reprend le Premier Voyage uniquement si une memoire active existe ;
- `J'explore librement` conserve sa navigation libre et ne declenche pas le Premier Voyage.

## Ajout de la Boussole Vivante

Une nouvelle etape a ete inseree apres la Bibliotheque Vivante.

### Etape 3 / 6

Titre :

`Comment s'orienter dans ce territoire ?`

Lieu :

`Boussole Vivante - Les Cartes Narratives`

Texte :

`Vous decouvrez que les Recits Vivants ne proposent pas un chemin unique. Les Cartes Narratives offrent des reperes pour explorer un territoire selon differentes questions, tensions, themes ou experiences. Elles n'indiquent pas une direction obligatoire. Elles invitent chacun a construire son propre parcours.`

Citation :

`Une carte n'impose jamais un chemin. Elle rend le territoire habitable.`

## Renumerotation

Le Premier Voyage compte maintenant six etapes :

1. Le Seuil des Climats.
2. Bibliotheque Vivante.
3. Boussole Vivante - Les Cartes Narratives.
4. L'Atelier des Recits.
5. Archives Vivantes.
6. Constellation.

La conclusion et la Foret de l'Arche restent hors numerotation, comme seuil final vers l'Oeuvre immersive.

## Fichiers modifies

- `js/firstJourney.js`
- `js/livingHome.js`
- `reports/UX-028_REPORT.md`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun JSON metier modifie.
- Aucune destination globale modifiee.

## Validations

- `node --check js/firstJourney.js` : OK.
- `node --check js/livingHome.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Validation fonctionnelle attendue

- Ouverture de l'application : le Seuil `Les Recits Vivants` reste prioritaire, meme si `makerland.firstJourney.active` etait encore vrai.
- `Je decouvre` : commence toujours a `Etape 1 / 6`.
- `Je poursuis mon voyage` : reprend l'etat actif sauvegarde du Premier Voyage, puis bascule vers la reprise generale si aucun Premier Voyage n'est actif.
- `J'explore librement` : n'affecte pas l'etat du Premier Voyage.
- La nouvelle etape `Etape 3 / 6` affiche la Boussole Vivante et les Cartes Narratives.
- Le parcours poursuit ensuite vers Atelier, Archives, Constellation, Conclusion, puis Foret de l'Arche.

## Note

La validation visuelle desktop, mobile portrait et mobile paysage reste a effectuer dans un navigateur reel. L'environnement Codex disponible pendant cette mission ne permettait pas une verification navigateur stable.
