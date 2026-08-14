# UX-042 — Les chemins deviennent un panneau accordéon discret

## Objectif

Réduire la présence visuelle des choix de parcours sur l'accueil afin que le premier regard reste porté par le paysage, le sceau, le titre et le texte d'introduction.

## Modifications réalisées

### Accordéon de parcours

Les chemins d'entrée sont désormais présentés sous forme d'accordéon :

- `Premier voyage accompli` ou `Je decouvre` ;
- `Je poursuis mon voyage` ;
- `J'explore librement`.

Une seule section est ouverte simultanément. Au chargement, le parcours principal reste ouvert.

### Hiérarchie visuelle

Un court en-tête a été ajouté :

> Choisissez votre maniere d'entrer

Les chemins sont plus bas, plus compacts et n'occupent plus la composition comme trois cartes principales.

### Interactions conservées

Les actions existantes sont inchangées :

- le Premier Voyage reste lancé par l'action principale ;
- la reprise du voyage utilise le même gestionnaire ;
- l'exploration libre conserve la même destination.

### Animation

L'ouverture et la fermeture des sections utilisent :

- `max-height` ;
- `opacity` ;
- `transform`.

La durée est comprise entre 250 et 300 ms selon la propriété animée.

### Responsive

Les règles responsive ont été ajustées pour :

- réduire la largeur et la hauteur du panneau ;
- compacter fortement le mode paysage ;
- éviter que le panneau masque le texte d'accueil ou l'image centrale.

## Fichiers modifiés

- `js/livingHome.js`
- `css/livingHome.css`

## Validations

- `node --check js/livingHome.js` : OK.
- `git diff --check` : OK.
- Recherche des anciennes classes UX-041 (`path-main`, `path-secondary`, `paths-toggle`, `paths-more`) : aucune référence restante.

## Limites

Aucun script npm n'a été exécuté : le dossier ne contient pas de `package.json`.

## Garantie de périmètre

Aucune modification n'a été apportée à la navigation globale, aux moteurs, aux JSON métier, à `BookRenderer`, à `ZoneRenderer`, au Premier Voyage, à la reprise ou à l'exploration libre. La mission modifie uniquement la présentation de ces chemins sur l'accueil.
