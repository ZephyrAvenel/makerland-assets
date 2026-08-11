# RV-030 Report - Passage Vivant vers l'Atlas

## Resume

RV-030 transforme `e05_cartes`, destination de la direction `Decouvrir`, en Passage Vivant vers l'Atlas des Recits Vivants publie.

Destination validee :

`https://zephyravenel.github.io/atlas-recits-vivants/`

## Documents de reference lus

- `docs/LIVING_EXPERIENCE_CHARTER.md`
- `docs/LIVING_PASSAGES_MANIFESTO.md`
- `docs/LIVING_PLACES_GUIDE.md`
- `docs/LIVING_COMPASS_INVENTORY.md`

## Modifications realisees

### `js/archwayPassage.js`

- Generalisation simple du passage existant via `createLivingPassage(config)`.
- Conservation du passage de l'Arche sur `e04_oeuvre`.
- Ajout d'un second passage configure pour `e05_cartes`.
- Ajout de la destination externe de l'Atlas dans la configuration du passage.
- Reutilisation du temps de lecture adaptatif via `Navigation.getWhisperReadingDuration`.
- Respect de `prefers-reduced-motion`.

### `css/style.css`

- Ajout des etats visuels du Passage Atlas.
- Reutilisation des classes visuelles de l'Arche : halo, brume, particules, Murmure, invitation et voile.
- Ajustements propres a `e05_cartes` pour centrer la lumiere sur la grande carte.
- Ajout d'une meilleure lisibilite du Murmure avec voile discret et halo doux.
- Ajustements mobile paysage pour conserver le Murmure et le bouton lisibles.
- Extension des regles `prefers-reduced-motion` au Passage Atlas.

### Documentation

- Creation de `docs/LIVING_ATLAS_PASSAGE.md`.

## Rythme du passage

Le Passage Atlas utilise les durees suivantes :

- installation du lieu : 420 ms ;
- apparition du Murmure : 1180 ms apres l'arrivee ;
- fondu d'apparition du Murmure : 1000 ms ;
- temps de lecture : calcule automatiquement, minimum 4000 ms, maximum 8000 ms ;
- disparition du Murmure : 1500 ms ;
- apparition de l'invitation : 220 ms apres la disparition ;
- traversee lumineuse : 980 ms avant ouverture externe.

## Murmure utilise

```text
Les cartes n'enferment pas le monde.
Elles ouvrent des chemins pour le regarder autrement.
```

## Validation

- `node --check js/archwayPassage.js` : OK.
- Verification documentaire : OK.
- Verification de la destination configuree : `https://zephyravenel.github.io/atlas-recits-vivants/`.
- Aucun JSON edite.
- Aucun changement sur ZoneRenderer.
- Aucun changement sur BookRenderer.
- Aucun changement sur NarrativeMemory.
- Aucun changement sur LivingEcho.
- Aucun changement sur les livres ou la Bibliotheque.

## Verification responsive

Les styles ont ete verifies statiquement pour :

- Desktop ;
- Android portrait ;
- Android paysage ;
- `prefers-reduced-motion`.

Les contraintes principales sont respectees :

- le Murmure reste place dans la zone haute de la carte ;
- le bouton apparait sous la carte et reste persistant ;
- le Passage Atlas utilise les memes comportements de reduction de mouvement que l'Arche ;
- l'ouverture externe conserve `Navigation.openExternal`.

## Notes

Le depot ne contient pas de script de test automatise ni de `package.json`. La validation JavaScript a donc ete effectuee avec `node --check` sur le fichier modifie.

Le navigateur integre de l'environnement Codex a bloque l'ouverture locale de `http://127.0.0.1:8130/index.html` et `http://localhost:8130/index.html` avec `ERR_BLOCKED_BY_CLIENT`. Les validations responsive et console n'ont donc pas pu etre executees visuellement dans cette session. Elles restent a confirmer dans un navigateur local non bloque avant fusion.
