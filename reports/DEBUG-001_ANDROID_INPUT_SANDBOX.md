# DEBUG-001 - Sandbox Android d'ecriture

## Objectif

Creer une page independante permettant de tester le comportement natif du clavier Android sans la complexite de la Constellation.

## Fichiers crees

- `debug/input-sandbox.html`
- `debug/input-sandbox.css`
- `debug/input-sandbox.js`

## Acces

Ouvrir :

```text
debug/input-sandbox.html
```

ou, depuis un serveur local :

```text
/debug/input-sandbox.html
```

## Principe

Au chargement initial, la page ne charge aucun module de la Constellation.

Elle contient uniquement :

- HTML ;
- CSS ;
- `textarea#storyInput` ;
- bouton `Tester la saisie` ;
- panneau de log.

Les modules Makerland peuvent ensuite etre charges via les boutons d'etape. Chaque bouton recharge la page avec `?stage=...` afin que les scripts de l'etape soient presents avant `DOMContentLoaded`.

Les etapes sont cumulatives : chaque etape ajoute un module supplementaire au socle precedent, afin d'identifier le premier ajout qui modifie le comportement natif du champ.

## Modules volontairement absents au chargement initial

La page ne charge pas automatiquement :

- `LivingSky`
- `LivingOverlayManager`
- `constellationScene`
- `travelerConstellation`
- `seasonalWhisper`
- `livingConstellationExperience`
- overlays immersifs

## Journal d'evenements

Le panneau de log affiche en temps reel :

- `touchstart`
- `pointerdown`
- `mousedown`
- `focus`
- `focusin`
- `click`
- `input`
- `blur`

Chaque ligne indique :

- `event.target`
- `document.activeElement`
- coordonnees du toucher si disponibles
- `document.elementFromPoint()`
- nombre de caracteres saisis

## Tableau de test Android

| Etape | Element ajoute | Clavier Android | Curseur | Saisie | Notes |
| --- | --- | --- | --- | --- | --- |
| 0 | textarea seul | A tester | A tester | A tester | Si cette ligne echoue, le probleme n'est pas lie a la Constellation. |
| 1 | app.js | A tester | A tester | A tester | Charge avant `DOMContentLoaded`, pour tester les gestionnaires globaux de `app.js`. |
| 2 | LivingOverlayManager | A tester | A tester | A tester | Ajoute `js/livingOverlayManager.js` apres `app.js`. |
| 3 | constellationScene | A tester | A tester | A tester | Ajoute `js/constellationScene.js` apres l'Overlay. |
| 4 | livingSky | A tester | A tester | A tester | Ajoute `js/livingSky.js` apres la Scene. |
| 5 | travelerConstellation | A tester | A tester | A tester | Ajoute `js/travelerConstellation.js` apres Sky. |
| 6 | livingConstellationExperience | A tester | A tester | A tester | Ajoute `js/livingConstellationExperience.js` apres Traveler. |

## Interpretation attendue

Si l'etape 0 fonctionne :

```text
Le textarea fonctionne normalement.
```

Si une etape ulterieure casse le focus ou le clavier Android, le dernier module charge devient le suspect principal.

## Validations terminales

- `node --check debug/input-sandbox.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.
