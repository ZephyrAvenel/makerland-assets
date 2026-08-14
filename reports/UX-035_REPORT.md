# UX-035 — Instituer le Sceau des Récits Vivants

## Objectif

Faire de l'emblème officiel des Récits Vivants un sceau patrimonial commun aux grands lieux du territoire, sans l'utiliser comme bouton et sans modifier les parcours, les moteurs ou les contenus métier.

## Composant partagé

Un composant autonome a été créé :

- `js/rvSeal.js`

Il expose :

- `RVSeal.create(options)` pour générer le sceau ;
- `RVSeal.hydrateDeclarativeSeals()` pour remplir les emplacements déclaratifs ;
- `RVSeal.addStandaloneSeals()` pour les pages autonomes ;
- `RVSeal.addImmersiveSeal(screenId)` pour les écrans de l'expérience principale.

Toutes les nouvelles intégrations passent par ce composant.

## Intégrations réalisées

### Accueil

- Le sceau d'accueil utilise désormais un emplacement déclaratif `data-rv-seal="home"`.
- L'image est injectée par `RVSeal`, avec `alt="Emblème des Récits Vivants"`.

### Premier Voyage

- Le sceau apparaît au-dessus du titre de la page intermédiaire `Votre premier voyage`.

### Passeport du Voyageur

- Le sceau apparaît en tête de la conclusion patrimoniale.
- Un second sceau est injecté en filigrane dans le Passeport du Voyageur.
- Opacité du filigrane : `0.09`, conforme à la cible de 8 à 10 %.

### Archives Vivantes

- Le sceau est chargé sur l'index des Archives Vivantes.
- Le sceau apparaît sur chaque archive D001 à D010 via le même composant.
- Il est placé dans l'en-tête, comme un cachet officiel discret.

### Constellation

- Le sceau est ajouté sur la page Constellation autonome.
- Dans l'expérience principale, il est également posé sur l'écran `e08_constellation`.

### Atelier des Récits

- Le sceau remplace le pictogramme générique de la page Atelier autonome.
- Dans l'expérience principale, il est ajouté sur l'écran `e07_atelier`.

### Forêt de l'Arche

- Le sceau est ajouté à l'épilogue du Premier Voyage.
- Dans l'expérience principale, un sceau très discret est superposé à l'écran `e04_oeuvre` avec une opacité réduite, comme un cachet suspendu dans le passage.

### Bibliothèque Vivante, Boussole Vivante et Cartes Narratives

- Le sceau est ajouté discrètement sur les écrans immersifs :
  - `e06_fiction` ;
  - `e06_essais` ;
  - `e03_boussole` ;
  - `e05_cartes`.

## Styles

Classes réutilisables créées :

- `.rv-seal`
- `.rv-seal--screen`
- `.rv-seal--journey`
- `.rv-seal--passport`
- `.rv-seal--watermark`
- `.rv-seal--archive`
- `.rv-seal--place`
- variantes de lieu : `.rv-seal--library`, `.rv-seal--atelier`, `.rv-seal--constellation`, `.rv-seal--cards`, `.rv-seal--compass`, `.rv-seal--forest`

Le sceau :

- n'est jamais un bouton ;
- utilise `pointer-events:none` ;
- conserve une lueur douce ;
- ne possède aucune animation permanente ;
- reste responsive.

## Fichiers modifiés

- `index.html`
- `js/rvSeal.js`
- `js/firstJourney.js`
- `css/style.css`
- `css/firstJourney.css`
- `css/placeholder.css`
- `atelier/index.html`
- `atelier/archives/index.html`
- `atelier/archives/d001.html` à `atelier/archives/d010.html`
- `constellation/index.html`
- `reports/UX-035_REPORT.md`

## Contraintes respectées

- Aucun BookRenderer modifié.
- Aucun ZoneRenderer modifié.
- Aucun JSON métier modifié.
- Aucune navigation globale modifiée.
- Le sceau n'est pas utilisé comme élément interactif.

## Validations

- `node --check js/rvSeal.js` : OK
- `node --check js/firstJourney.js` : OK
- Chemins d'asset vérifiés :
  - `assets/logo_rv.png`
  - `atelier/../assets/logo_rv.png`
  - `atelier/archives/../../assets/logo_rv.png`
  - `constellation/../assets/logo_rv.png`
- `git diff --check` : OK
- `git diff --cached --check` : OK

Note : aucun navigateur intégré contrôlable n'est disponible dans cette session. La validation desktop/tablette/mobile a donc été limitée à l'analyse statique des positions, dimensions, chemins d'asset et règles responsive.
