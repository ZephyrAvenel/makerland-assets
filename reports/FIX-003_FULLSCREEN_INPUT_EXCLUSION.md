# FIX-003 - Exclure les zones de saisie du plein ecran immersif

## Objectif

Empecher `requestImmersiveFullscreen()` d'intercepter le premier geste utilisateur lorsqu'il est destine a une zone de saisie, en particulier `#storyInput` dans la Constellation.

## Fichier modifie

- `js/app.js`

Aucun autre fichier de production n'a ete modifie.

## Correction appliquee

Le gestionnaire global du mode immersif verifie maintenant la cible de l'evenement avant d'appeler `requestImmersiveFullscreen()`.

Sont exclus :

- `textarea`
- `input`
- `select`
- `[contenteditable]`
- descendants de ces elements via `closest(...)`

Si le premier geste cible une zone de saisie, le gestionnaire ne fait rien et laisse le navigateur traiter normalement le focus natif et l'ouverture du clavier Android.

## Point technique important

Les anciens ecouteurs utilisaient `once: true`.

Cette option ne pouvait pas etre conservee telle quelle : si le premier geste touchait `#storyInput`, l'ecouteur aurait ete retire sans demander le plein ecran, puis les autres zones de l'application n'auraient plus pu declencher le mode immersif.

La correction retire donc `once: true` et s'appuie sur la garde existante dans `requestImmersiveFullscreen()` :

```js
if (immersiveFullscreenRequested || isFullscreenActive()) return;
```

Ainsi :

- les zones de saisie ne declenchent pas le plein ecran ;
- le premier geste non-saisie conserve le comportement immersif ;
- les appels suivants restent sans effet une fois le plein ecran deja demande.

## Comportement attendu

### Sur `#storyInput`

```text
premier toucher
-> pas de requestImmersiveFullscreen()
-> focus natif du textarea
-> curseur visible
-> clavier Android ouvert
```

### Sur les autres zones

```text
premier toucher non-saisie
-> requestImmersiveFullscreen()
-> comportement existant conserve
```

## Modules non modifies

- `LivingOverlayManager`
- `constellationScene`
- CSS
- JSON
- navigation

## Validations terminales

- `node --check js/app.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Validation appareil reel a effectuer

Sur Android :

1. ouvrir la Constellation ;
2. toucher directement `#storyInput` ;
3. verifier que le curseur apparait immediatement ;
4. verifier que le clavier Android s'ouvre immediatement ;
5. toucher ensuite une zone non-saisie dans une session fraiche ;
6. verifier que le plein ecran immersif se declenche toujours.
