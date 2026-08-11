# RV-051 - Alignement PWA Makerland sur Anneau des Recits Vivants

Date : 2026-08-11

Branche : `agent/rv-051-pwa-alignment`

## Reference analysee

Archive Google Drive :

`111QpkjS0VAZO2SC92xq6CyiRrHbEIMax`

Chemin extrait :

`.tmp-rv051/anneau/anneau_v8.8/anneau_v8.5/anneau_v8.5`

## Differences trouvees

### Manifest

Anneau possede `manifest.json`.

Makerland ne possedait aucun manifest.

Anneau :

- `name`
- `short_name`
- `start_url`
- `display: standalone`
- `background_color`
- `theme_color`
- une icone PNG 512x512

Makerland :

- aucun `manifest.json`
- aucun `manifest.webmanifest`

### Head HTML

Anneau possede :

- `<link rel="icon" type="image/png" href="assets/favicon.png">`
- `<link rel="apple-touch-icon" href="assets/favicon.png">`
- `<link rel="manifest" href="manifest.json">`
- `<meta name="theme-color" content="#08142b">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

Makerland possedait seulement :

- `<meta name="viewport" content="width=device-width,initial-scale=1">`

### Service worker

Anneau ne contient pas de service worker detecte.

Makerland ne contient pas de service worker.

Aucun service worker n'a donc ete ajoute.

### Capacites mobiles

Anneau ne contient pas :

- `mobile-web-app-capable`
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `display_override`
- `orientation`
- `scope`

Ces elements n'ont pas ete ajoutes a Makerland, sauf `scope` pour compatibilite GitHub Pages.

## Elements reproduits dans Makerland

- Ajout de `manifest.json`.
- Ajout de `display: standalone`.
- Ajout de `background_color: #08142b`.
- Ajout de `theme_color: #08142b`.
- Ajout d'une icone PWA 512x512.
- Ajout de `link rel="manifest"` dans `index.html`.
- Ajout de `link rel="icon"` dans `index.html`.
- Ajout de `link rel="apple-touch-icon"` dans `index.html`.
- Ajout de `meta theme-color` dans `index.html`.

## Elements volontairement adaptes

Anneau utilise :

`"start_url": "/"`

Makerland utilise :

`"start_url": "./"`

Justification : Anneau semble deploye a la racine de son domaine, alors que Makerland est publie sur GitHub Pages sous un chemin de depot. Une URL relative evite de lancer la PWA vers la racine du domaine GitHub Pages.

Makerland ajoute aussi :

`"scope": "./"`

Justification : cela borne l'application installee au repertoire de publication Makerland.

## Elements volontairement non reproduits

- Aucun service worker : absent de l'Anneau.
- Aucun `display_override` : absent de l'Anneau.
- Aucune orientation forcee : absent de l'Anneau et non souhaite pour Makerland.
- Aucun meta `mobile-web-app-capable` ou `apple-mobile-web-app-capable` : absent de l'Anneau, et non indispensable pour Chrome Android avec manifest `standalone`.
- Aucun changement de navigation ou de logique applicative.

## Fichiers modifies

- `index.html`
- `manifest.json`
- `assets/favicon.png`
- `reports/RV-051_REPORT.md`

## Validation

- `manifest.json` parse correctement en JSON.
- L'icone PWA mesure 512x512.
- `git diff --check` : OK.
- Aucun fichier JavaScript modifie.
- Comportement desktop attendu : inchangé, hormis les metadonnees PWA du navigateur.
