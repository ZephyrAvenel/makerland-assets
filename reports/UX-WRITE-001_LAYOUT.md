# UX-WRITE-001 - Position de la zone de saisie dans la carte illustree

## Objectif

Ajuster uniquement le rendu visuel de `#storyInput` afin que le texte saisi commence dans la zone libre de la carte illustree, sans modifier le fonctionnement natif Android restaure par RESTORE-001.

## Fichier modifie

```text
css/livingOverlayManager.css
```

## Ajustement applique

Le `textarea` conserve :

- `position:absolute`;
- `inset:0`;
- `width:100%`;
- `height:100%`;
- `background:transparent`;
- le curseur natif du navigateur ;
- sa surface de hit-testing sur toute la carte.

Seul le padding interne a ete modifie.

Avant :

```css
padding:14px 16px;
```

Apres :

```css
padding:
    clamp(34px, calc(var(--screen-content-height) * .055), 58px)
    clamp(24px, calc(var(--screen-content-width) * .032), 46px)
    clamp(22px, calc(var(--screen-content-height) * .04), 42px);
```

En portrait mobile, le padding est reduit pour conserver une zone de saisie utilisable :

```css
padding:26px 22px 18px;
```

## Ce qui n'a pas ete modifie

- aucun JavaScript ;
- aucun appel `focus()` ;
- aucun comportement de `LivingOverlayManager` ;
- aucune logique Android ;
- aucun bouton ;
- aucun HTML ;
- aucun JSON ;
- aucune navigation.

## Pourquoi le focus natif reste preserve

Le `textarea` recouvre toujours toute la carte. Le padding agit uniquement sur la zone de composition du texte a l'interieur du champ, pas sur la surface tactile du champ.

Le premier toucher peut donc encore atteindre directement `textarea#storyInput`, ce qui laisse Android gerer naturellement :

- le focus ;
- le curseur ;
- l'ouverture du clavier.

## Validation

Validation terminale :

```text
git diff --check
```

Validation manuelle recommandee :

```text
ouvrir la Constellation
toucher la carte d'ecriture
verifier que le clavier Android s'ouvre au premier toucher
saisir quelques mots
verifier que le texte ne recouvre pas les elements imprimes de la carte
verifier que le bouton "Partager mon recit" reste inchangé
```
