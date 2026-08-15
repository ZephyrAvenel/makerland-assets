# UX-CARET-003 - Plume de lumiere vivante

## Objectif

Ajouter un curseur decoratif vivant dans la carte `Constellation des Recits Vivants`, sans modifier le comportement natif de saisie.

## Principe retenu

Le `textarea#storyInput` reste l'element natif qui recoit le toucher, le focus, le curseur logique et le clavier Android.

Un element decoratif independant est ajoute dans `.constellation-panel` :

```html
<span class="rv-living-caret" aria-hidden="true"></span>
```

Cet element :

- utilise `pointer-events:none` ;
- ne recoit jamais le focus ;
- ne declenche aucun evenement de saisie ;
- suit la position logique du caret via `selectionStart` ;
- reste visible pendant l'ecriture.

## Fichiers crees

- `css/livingCaret.css`
- `js/livingCaret.js`

## Fichiers modifies

- `index.html`

Le fichier charge maintenant :

- `css/livingCaret.css` apres `css/livingOverlayManager.css` ;
- `js/livingCaret.js` apres `js/constellationScene.js`.

## Positionnement

Le module `livingCaret.js` utilise un miroir de texte hors ecran pour calculer la position reelle du curseur dans le `textarea`.

Evenements observes :

- `input`
- `keyup`
- `click`
- `mouseup`
- `touchend`
- `pointerup`
- `focus`
- `blur`
- `select`
- `scroll`
- `compositionupdate`
- `selectionchange`
- `resize`

Ces evenements ne sont utilises que pour lire la position du caret et mettre a jour la transformation CSS de `.rv-living-caret`.

## Interdictions respectees

Le module ne contient aucun appel a :

- `focus()`
- `click()`
- `dispatchEvent()`

Il ne modifie pas :

- `LivingOverlayManager` ;
- `constellationScene` ;
- la navigation ;
- les overlays ;
- le plein ecran ;
- la logique Android ;
- le bouton `Partager mon recit`.

## Direction artistique

La plume utilise une palette sobre :

- ivoire chaud ;
- or doux ;
- ambre ;
- lumiere diffuse tres courte.

Animation :

- respiration lente : `3.7s` ;
- halo limite a environ `3px` ;
- aucune animation rapide ;
- respect de `prefers-reduced-motion`.

## Compatibilite

La compatibilite Android est preservee car le premier toucher continue d'atteindre directement le `textarea`.

La plume lumineuse est purement visuelle et ne participe jamais au hit-testing.

## Validation

- `node --check js/livingCaret.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Note

Le caret natif reste present avec une couleur chaude et discrete. La plume lumineuse devient le repere visuel principal, mais le navigateur conserve l'entier controle de la saisie.
