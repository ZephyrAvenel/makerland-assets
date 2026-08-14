# UX-WRITE-002 - Alignement du textarea avec la carte illustree

## Objectif

Positionner visuellement `#storyInput` dans la grande zone vide de la carte illustree, sous le texte imprime de l'image.

## Contraintes respectees

- Aucun JavaScript modifie.
- Aucune logique de focus modifiee.
- Aucune logique `LivingOverlayManager` modifiee.
- Le bouton `Partager mon recit` reste inchange.
- Le textarea reste transparent.
- Le curseur natif du navigateur est conserve.

## Fichier modifie

```text
css/livingOverlayManager.css
```

## Modification appliquee

Le textarea n'utilise plus un grand padding haut comme seul mecanisme de placement.

Avant :

```css
inset:0;
height:100%;
padding: ...;
```

Apres :

```css
left:0;
right:0;
top:clamp(70px, calc(var(--screen-content-height) * .085), 90px);
bottom:0;
height:auto;
padding:8px ... ...;
```

Le champ commence donc environ 70 a 90 px plus bas dans la carte, ce qui preserve le texte imprime de l'image et place la premiere ligne saisie dans l'espace vide.

## Variante portrait

En portrait mobile, la carte est plus basse et plus compacte. Le top est adapte :

```css
top:52px;
bottom:0;
padding:6px 22px 14px;
```

Cette variante conserve une zone de saisie utilisable tout en evitant que le texte recouvre la partie imprimee de la carte.

## Impact Android

Le mecanisme natif Android reste preserve :

- aucun `focus()` force ;
- aucun `click()` simule ;
- aucun changement de hit-testing JavaScript ;
- le focus reste donne par le geste utilisateur sur le textarea.

## Validation

Validations terminales :

```text
git diff --check
git diff --cached --check
```

Validation manuelle recommandee :

```text
ouvrir la Constellation
toucher la zone basse de la carte illustree
verifier que le clavier Android s'ouvre
saisir un texte
verifier que la premiere ligne commence sous le texte imprime
verifier que le bouton Partager mon recit reste inchange
```
