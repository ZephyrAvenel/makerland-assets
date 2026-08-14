# FIX-004 - Toute la carte devient une zone de saisie native

## Objectif

Supprimer les zones mortes de la carte d'ecriture de la Constellation afin que le premier toucher sur la surface de saisie soit recu directement par `textarea#storyInput`.

## Fichier modifie

- `css/livingOverlayManager.css`

Aucun JavaScript n'a ete modifie.

## Correction appliquee

La structure visuelle de la zone d'ecriture a ete ajustee en CSS :

- `.constellation-panel` devient un conteneur sans padding ni gap ;
- `textarea#storyInput` est positionne en absolu avec `inset:0` ;
- le `textarea` couvre 100 % de la carte d'ecriture ;
- le bouton `Partager mon recit` est place sous la carte avec `top:calc(100% + 10px)` ;
- le curseur decoratif conserve `pointer-events:none` ;
- aucun `focus()` JavaScript n'a ete ajoute ;
- aucun `click()` simule ;
- aucun `pointerdown` artificiel.

## Chemin attendu sur Android

```text
premier toucher sur la carte
-> event.target = TEXTAREA#storyInput
-> document.elementFromPoint(...) = TEXTAREA#storyInput
-> focus natif navigateur
-> curseur visible
-> clavier Android ouvert
```

## Conservation de la scene silencieuse

La scene silencieuse reste active pour les autres elements.

La correction ne modifie pas :

- `constellationScene.js`
- `LivingOverlayManager`
- les etats `SKY`, `PATH`, `NOTICE`, `EXHIBITION`
- les routes
- les JSON

## Verification recommandee

Depuis DevTools Android, executer :

```js
(() => {
  const input = document.getElementById("storyInput");
  const rect = input.getBoundingClientRect();
  const points = [
    [rect.left + 4, rect.top + 4],
    [rect.left + rect.width / 2, rect.top + rect.height / 2],
    [rect.right - 4, rect.top + 4],
    [rect.left + 4, rect.bottom - 4],
    [rect.right - 4, rect.bottom - 4]
  ];
  console.table(points.map(([x, y]) => {
    const hit = document.elementFromPoint(x, y);
    return {
      x,
      y,
      hit: hit ? `${hit.tagName}${hit.id ? "#" + hit.id : ""}${hit.className ? "." + String(hit.className).replace(/\\s+/g, ".") : ""}` : "null"
    };
  }));
})();
```

Resultat attendu sur tous les points de la carte d'ecriture :

```text
TEXTAREA#storyInput
```

Le bouton de partage reste volontairement en dehors de cette surface.

## Validations terminales

- `git diff --check` : OK.
- `git diff --cached --check` : OK.
