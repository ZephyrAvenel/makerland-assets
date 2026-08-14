# UX-049 — Rendre le Passeport du Voyageur cohérent

## Objectif

Clarifier le rôle du Passeport du Voyageur affiché à la fin du Premier Voyage afin qu'aucun élément non interactif ne ressemble à un bouton cassé.

## Diagnostic

Le Passeport du Voyageur est généré dans `js/firstJourney.js` par `renderPassportCard()`.

Élément HTML concerné :

```html
<section class="first-journey__passport-card" aria-label="Passeport du Voyageur">
```

Il ne s'agit pas d'un bouton :

- aucun `onclick` ;
- aucun `href` ;
- aucun `data-*` utilisé pour un gestionnaire de clic ;
- aucun état `disabled` ;
- aucun gestionnaire JavaScript associé ;
- aucun élément transparent ou conflit de `z-index` identifié autour de cette section.

Les boutons réellement interactifs du panneau sont :

- `data-first-journey-forest` : entrer dans la Forêt de l'Arche ;
- `data-first-journey-free` : explorer librement ;
- `data-first-journey-territory` : retour au Seuil.

## Cause

Le Passeport était une section informative, mais son style visuel utilisait un fond, une bordure et une mise en valeur proches des boutons patrimoniaux de l'interface. Sur mobile, cette présentation pouvait suggérer une action absente.

## Correction appliquée

- Ajout d'un libellé visible : `Trace du voyage`.
- Conservation du contenu informatif existant.
- Atténuation du style visuel :
  - bordure plus discrète ;
  - fond moins contrasté ;
  - ombre interne réduite ;
  - curseur neutre.

Le Passeport reste donc une trace/certificat informatif, sans comportement interactif ambigu.

## Fichiers modifiés

- `js/firstJourney.js`
- `css/firstJourney.css`

## Comportement obtenu

À la fin du Premier Voyage :

- le Passeport du Voyageur est lisible comme une trace patrimoniale ;
- il ne ressemble plus à un bouton cassé ;
- les trois actions principales restent les seuls éléments interactifs du panneau ;
- aucune navigation existante n'est modifiée.

## Validations

Validations classiques prévues :

- `node --check js/firstJourney.js`
- `git diff --check`
- `git diff --cached --check`

Les vérifications mobiles réelles pourront confirmer visuellement que le Passeport n'est plus perçu comme une zone cliquable.
