# UX-CLEAN-001 - Suppression du texte narratif fantome

## Objectif

Supprimer le grand texte narratif blanc qui apparaissait brievement derriere le panneau inferieur de la Constellation, notamment autour du libelle **Monde commun**.

## Origine exacte

Le texte provenait du teaser automatique des Grandes Constellations, genere dans :

- `js/livingExhibitions.js`

Element concerne :

- `.living-exhibitions__entry`

Ce bloc affichait notamment :

- `Grande Constellation`
- `Cette semaine : Monde commun`
- la phrase d'ouverture de la constellation mise en avant
- un bouton `Explorer`

Il etait ensuite enregistre dans la file d'attente du `LivingOverlayManager` via `queueCue("living-exhibition", ...)`.

## Diagnostic

Ce teaser n'etait plus coherent avec la mise en scene actuelle de la Constellation :

- il apparaissait en arriere-plan pendant certaines transitions ;
- il pouvait etre partiellement masque par le panneau inferieur **Vous pouvez maintenant** ;
- son texte devenait illisible ;
- il entrait en concurrence avec les panneaux utiles conserves : **Aujourd'hui**, **Premiere etoile** et **Vous pouvez maintenant**.

Le bloc etait specifique a l'ecran Constellation et ne servait pas aux autres lieux du territoire.

## Correction

Le teaser automatique `.living-exhibitions__entry` n'est plus genere dans la couche des Grandes Constellations.

La correction supprime :

- l'insertion du noeud `data-exhibition-entry` ;
- l'appel a `renderEntry()` lors du rendu initial.
- la fonction morte `renderEntry()` et son ancien appel a la file `queueCue("living-exhibition", ...)`.
- les styles CSS orphelins de `.living-exhibitions__entry` ;
- les references de masquage devenues inutiles dans les couches Scene et Overlay.

Le panneau detaille des Grandes Constellations reste dans le code du module, mais son teaser automatique ne peut plus apparaitre en surimpression.

## Fichiers modifies

- `js/livingExhibitions.js`
- `css/livingExhibitions.css`
- `css/livingOverlayManager.css`
- `css/constellationScene.css`
- `reports/UX-CLEAN-001_REMOVE_GHOST_TEXT.md`

## Elements conserves

Non modifies :

- la saisie Android ;
- le Living Caret ;
- LivingOverlayManager ;
- les overlays existants ;
- les panneaux **Aujourd'hui**, **Premiere etoile** et **Vous pouvez maintenant** ;
- les transitions generales de la Constellation.

## Validations

- `node --check js/livingExhibitions.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Resultat attendu

Le texte automatique lie a **Monde commun** ne peut plus apparaitre derriere la barre inferieure. Les transitions de la Constellation conservent leur rythme actuel, sans couche narrative illisible en arriere-plan.
