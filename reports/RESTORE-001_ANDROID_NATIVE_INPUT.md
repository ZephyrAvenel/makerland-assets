# RESTORE-001 - Restauration du mecanisme natif de saisie Android

## Objectif

Restaurer le chemin natif de saisie Android dans la Constellation, a partir du dernier etat fonctionnel identifie par GIT-FORENSICS-001 :

```text
b946564
```

La restauration ne fait pas de rollback global. Elle reprend uniquement le principe essentiel de `b946564` :

```text
premier toucher -> textarea#storyInput -> focus natif Android -> clavier Android
```

## Reference historique

Dans `b946564`, le formulaire de contribution etait directement present dans la Constellation :

```html
<div class="constellation-panel">
    <textarea id="storyInput"></textarea>
    <button id="shareStoryButton">Partager</button>
</div>
```

Le textarea etait positionne comme surface tactile directe :

```css
.constellation-panel textarea{
    position:absolute;
    inset:0 0 auto;
    width:100%;
    height:66%;
    background:transparent;
}
```

Il n'existait pas de reveil intermediaire, pas de focus JavaScript force, et pas de couche silencieuse rendant le panneau inerte.

## Regression identifiee

Le commit `60d4ef5` (`SCENE-001`) a ajoute l'etat `constellation-scene-silent`.

La regression provenait de cette logique :

```css
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .constellation-panel{
    opacity:0 !important;
    transform:translateY(8px);
    pointer-events:none !important;
}
```

Le textarea existait toujours dans le DOM, mais le premier toucher Android ne pouvait plus suivre le chemin natif vers `#storyInput`.

## Restauration appliquee

### 1. `css/constellationScene.css`

Le panneau d'ecriture a ete retire de la liste des elements masques pendant `constellation-scene-silent`.

Avant :

```css
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .constellation-panel,
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .living-constellation-experience__quote,
...
```

Apres :

```css
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .living-constellation-experience__quote,
...
```

La regle corrective precedente :

```css
#e08_constellation.constellation-scene-silent:not(.constellation-scene-awakened) .constellation-panel{
    pointer-events:auto !important;
}
```

a ete supprimee, car elle ne suffisait pas : le panneau restait soumis au masquage `opacity:0` et a une logique contradictoire.

Resultat attendu :

- `.constellation-panel` conserve son style courant ;
- `textarea#storyInput` reste dans le hit-testing ;
- aucun `pointer-events:none` de la scene silencieuse ne bloque le champ.

### 2. `js/livingOverlayManager.js`

L'etat `WRITE` ne force plus le focus sur le textarea.

Avant :

```js
activate("WRITE", {
    close: closeWriting,
    element: panel,
    focus: textarea
});
```

Le gestionnaire appelait ensuite :

```js
window.setTimeout(() => target.focus({ preventScroll: true }), 40);
```

Sur Android, ce focus differe n'est pas equivalent au focus natif provoque par le toucher utilisateur.

Apres :

```js
activate("WRITE", {
    close: closeWriting,
    element: panel,
    skipFocus: true
});
```

Et :

```js
function focusLayer(layer) {
    if (layer.skipFocus) return;
    ...
}
```

Resultat attendu :

- le premier toucher n'est pas remplace par un focus JavaScript ;
- Android reste responsable de l'ouverture du clavier ;
- `LivingOverlayManager` conserve l'etat `WRITE`, mais seulement comme synchronisation visuelle et logique.

## Elements recents conserves

Les elements suivants sont conserves :

- `LivingOverlayManager` ;
- l'etat `WRITE` ;
- les notifications et cues d'overlay ;
- la scene silencieuse ;
- la respiration du decor ;
- le style actuel de la Constellation ;
- la carte d'ecriture plein panneau de `FIX-004` ;
- l'exclusion plein ecran de `FIX-003` dans `app.js`.

La restauration ne supprime donc pas l'architecture recente. Elle retire seulement ce qui empechait le textarea de recevoir le geste natif.

## Pourquoi cette combinaison respecte Android

Android Chrome ouvre le clavier de maniere fiable lorsque :

1. le geste utilisateur touche directement un champ texte ;
2. le champ n'est pas masque par une couche de hit-testing ;
3. aucun `preventDefault()` ne consomme le geste ;
4. aucun `focus()` asynchrone ne remplace le focus natif.

La restauration respecte ces conditions :

- `#storyInput` reste present ;
- `#storyInput` recouvre la carte d'ecriture via les styles existants ;
- `.constellation-panel` n'est plus neutralise par `constellation-scene-silent` ;
- `WRITE` ne demande plus `textarea.focus()` ;
- le plein ecran immersif continue d'ignorer les cibles de saisie.

## Validation realisee

Validations terminales :

```text
node --check js/livingOverlayManager.js
git diff --check
```

Validation logique par inspection :

- aucun `textarea.focus()` n'est ajoute ;
- aucun `click()` artificiel n'est ajoute ;
- aucun changement HTML n'est necessaire ;
- aucun JSON n'est modifie ;
- le premier toucher peut atteindre `textarea#storyInput` sans reveil intermediaire.

Validation appareil a effectuer manuellement :

```text
ouvrir la Constellation sur Android
toucher directement la carte d'ecriture
verifier : curseur visible
verifier : clavier Android ouvert
ecrire un texte
partager le recit
```

## Fichiers modifies

```text
css/constellationScene.css
js/livingOverlayManager.js
reports/RESTORE-001_ANDROID_NATIVE_INPUT.md
```

## Proposition de commit

Apres validation manuelle Android, commit propose :

```text
RESTORE-001 - Restore native Android constellation input
```
