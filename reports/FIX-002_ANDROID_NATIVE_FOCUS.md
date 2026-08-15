# FIX-002 - Donner le premier toucher directement au textarea Android

## Objectif

Restaurer le focus natif Android sur `#storyInput` sans supprimer la scene silencieuse de la Constellation et sans modifier le fonctionnement du `LivingOverlayManager`.

## Probleme corrige

FIX-001 eveillait la scene depuis un `pointerdown` capte sur l'ecran parent, puis appelait :

```js
textarea.focus()
```

Ce chemin restait fragile sur Chrome Android, car le premier toucher ne ciblait pas directement le champ de saisie. Le clavier mobile peut refuser de s'ouvrir lorsque le focus est demande par JavaScript apres un geste dont la cible initiale n'est pas le `textarea`.

## Correction appliquee

Fichiers modifies :

- `css/constellationScene.css`
- `js/constellationScene.js`

### CSS

La scene silencieuse continue de masquer visuellement `.constellation-panel`, mais une exception limitee lui rend le hit testing :

```css
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .constellation-panel {
    pointer-events: auto !important;
}
```

Effet :

- le panneau reste invisible pendant l'arrivee silencieuse ;
- le reste de la scene silencieuse conserve son comportement ;
- la zone d'ecriture et `#storyInput` restent accessibles au premier toucher ;
- aucun overlay invisible ne doit recouvrir cette zone via cette regle.

### JavaScript

Le reveil par coordonnees et le `textarea.focus()` force ont ete retires.

La scene se reveille maintenant uniquement lorsque le focus natif arrive sur le champ :

```js
textarea.addEventListener("focusin", awaken);
```

Chemin attendu :

```text
toucher Android
-> #storyInput recoit directement le geste
-> focus natif navigateur
-> clavier Android
-> focusin
-> awaken()
-> sortie de constellation-scene-silent
-> LivingOverlayManager active WRITE via ses ecouteurs existants
```

## Points preserves

- `constellation-scene-silent` n'est pas supprime.
- Les animations scenographiques sont conservees.
- Le `LivingOverlayManager` n'est pas modifie.
- Les overlays `SKY`, `PATH`, `NOTICE`, `EXHIBITION` et autres etats ne sont pas modifies.
- Aucune route n'est modifiee.
- Aucun JSON n'est modifie.

## Verification logique

Avant le premier focus :

- `.constellation-panel` reste sous l'etat silencieux ;
- `opacity: 0 !important` reste appliquee ;
- `pointer-events: auto !important` permet au champ de recevoir le premier toucher ;
- aucun `focus()` JavaScript n'est appele pour declencher le clavier.

Apres le premier focus :

- `focusin` declenche `awaken()`;
- `constellation-scene-silent` est retiree ;
- la regle de masquage silencieux ne s'applique plus ;
- le panneau devient visible via les styles existants ;
- le `LivingOverlayManager` prend le relais normalement.

## Validation demandee sur Android

Scenario manuel a confirmer sur appareil reel :

1. ouvrir la Constellation ;
2. ne pas attendre la fin de la scene ;
3. toucher directement la zone d'ecriture ;
4. verifier que le curseur apparait immediatement ;
5. verifier que le clavier Android s'ouvre immediatement ;
6. verifier qu'aucune deuxieme pression n'est necessaire ;
7. verifier qu'aucun `focus()` JavaScript force n'est requis.

## Validations terminales

- `node --check js/constellationScene.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.
