# UX-CARET-005 - Alignement du curseur vivant et bouton de partage

## Objectif

Corriger deux ecarts visuels dans la Constellation des Recits Vivants sans modifier le mecanisme Android de saisie, le focus natif, le clavier, le partage, LivingOverlayManager ou la navigation.

## Fichiers modifies

- `js/livingCaret.js`
- `css/livingOverlayManager.css`

## Curseur vivant

Le curseur decoratif utilisait le rectangle du caractere suivant pour calculer sa position. Sur certains rendus de textarea, notamment tablette Android, cette mesure pouvait decaler la plume lumineuse par rapport au caret natif.

La correction conserve le principe du miroir hors ecran, mais utilise maintenant un marqueur de largeur zero :

- `display:inline-block` ;
- `width:0` ;
- hauteur alignee sur la `line-height` calculee ;
- copie plus complete des proprietes typographiques (`word-spacing`, `text-indent`, `direction`).

Le module continue uniquement de lire :

- `selectionStart` ;
- les metriques CSS du textarea ;
- la position mesuree du marqueur.

Aucun appel a `focus()`, `click()` ou `dispatchEvent()` n'a ete ajoute.

## Bouton "Partager mon recit"

Le bouton HTML etait rendu comme un bouton autonome sous la carte, alors que l'image contient deja le bouton dessine.

La correction repositionne le bouton HTML comme une surimpression :

- largeur : `84%` de la carte ;
- position horizontale : `left:8%` ;
- position verticale : immediatement sous la zone d'ecriture, avec un decalage responsive ;
- fond, bordure, ombre et flou retires ;
- centrage interne avec `display:flex` ;
- libelle en capitales, dore, pose sur le bouton illustre.

Le bouton conserve son identifiant `shareStoryButton` et son comportement existant.

## Contraintes respectees

Non modifies :

- focus Android ;
- textarea natif ;
- clavier Android ;
- logique de partage ;
- LivingOverlayManager ;
- overlays ;
- navigation ;
- contenu HTML.

## Validations

- `node --check js/livingCaret.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Resultat attendu

La Plume de Lumiere se superpose au caret natif et suit la position de saisie caractere par caractere. Le libelle **Partager mon recit** est centre sur le bouton dessine dans l'image et ne donne plus l'impression d'etre place apres l'illustration.
