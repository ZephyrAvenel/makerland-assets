# RV-054 - Actualisation forcee du manifest PWA

Date: 2026-08-11

Branche: `agent/rv-054-manifest-cache-bust`

## Objectif

Forcer Chrome / Android a recharger le manifest PWA apres le renommage final de l'application.

## Verification du manifest

Le manifest reellement reference est `manifest.json`.

- `name`: `Récits Vivants`
- `short_name`: `Récits`

Les champs suivants sont restes inchanges:

- `start_url`
- `scope`
- `display`
- `background_color`
- `theme_color`
- `icons`

## Reference HTML modifiee

Fichier modifie: `index.html`

Avant:

`<link rel="manifest" href="manifest.json">`

Apres:

`<link rel="manifest" href="manifest.json?v=2">`

## Manifest unique

Recherche effectuee:

- `manifest.json`
- `manifest.webmanifest`
- `rel="manifest"`

Resultat:

- Une seule reference active `<link rel="manifest">` dans `index.html`.
- Aucun `manifest.webmanifest` utilise par l'application.
- Aucune autre page HTML ne reference un ancien manifest.

## Perimetre respecte

- Aucun JavaScript modifie.
- Aucun CSS modifie.
- Aucun JSON metier modifie.
- Aucun service worker ajoute.
- Icones conservees.
- `start_url` conserve.
- `scope` conserve.
- `display` conserve.
- `theme_color` conserve.

## Validation

- `manifest.json` valide en JSON.
- Le lien HTML pointe vers `manifest.json?v=2`.
- `git diff --check` OK.
