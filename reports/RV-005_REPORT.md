# RV-005 - Les Echos Vivants

## Objectif

Transformer la Boussole Vivante en lieu de resonance.
Apres le choix de la meteo interieure, le lieu peut laisser apparaitre un murmure discret, puis le laisser disparaitre.

## Architecture

Nouveau module:

- `js/livingEcho.js`

Le module est independant et recoit uniquement:

- `selectedWeather`
- `visitCount`
- `weatherHistory`

Il retourne:

- `message`
- `intensity`
- `glow`
- `delay`

`App` n'ajoute aucune logique de choix de texte.
Il appelle `LivingEcho.create(...)`, affiche le resultat dans `#livingEcho`, puis applique le delai et la disparition.

## Design

- Aucun panneau.
- Aucune boite.
- Texte blanc casse.
- Halo leger selon la meteo.
- Apparition apres 2 a 4 secondes.
- Fondu doux.
- Disparition progressive.
- Respect de `prefers-reduced-motion`.

## Intensite

- Premiere visite: un murmure simple.
- Apres 10 visites: possibilite de deux phrases.
- Apres 30 visites: possibilite rare d'un murmure plus profond.

## Fichiers modifies

- `index.html`
- `js/app.js`
- `css/style.css`

## Fichiers crees

- `js/livingEcho.js`
- `docs/LIVING_ECHOES.md`
- `reports/RV-005_REPORT.md`

## Fichiers non modifies

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `data/zones-v3-final-beta.json`

## Captures

- `outputs/RV-005_CAPTURE_PC.png`
- `outputs/RV-005_CAPTURE_TABLET.png`
- `outputs/RV-005_CAPTURE_SMARTPHONE_PORTRAIT.png`
- `outputs/RV-005_CAPTURE_SMARTPHONE_LANDSCAPE.png`

## Validations effectuees

- Verification syntaxe JavaScript.
- Verification parsing JSON.
- Verification `DEBUG_ZONES = false`.
- Verification absence de modification des fichiers interdits.
- Verification absence d'ancien bouton HTML.
- Verification absence d'appel reseau applicatif.
- Verification des cinq meteos.
- Verification premiere visite.
- Verification apres plusieurs visites.
- Verification responsive PC.
- Verification responsive tablette.
- Verification responsive smartphone portrait.
- Verification responsive smartphone paysage.

## Note

Les erreurs reseau Statsig observees pendant les tests navigateur proviennent de l'environnement Codex.
Elles ne proviennent pas de Makerland.
