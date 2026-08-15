# CURSOR-001 - Position du caret de la Constellation

## Objectif

Aligner le curseur clignotant de la zone d'ecriture de la Constellation avec le curseur dessine dans la nouvelle illustration `ecran-8-constellation-v2.png`.

## Fichier modifie

- `css/livingOverlayManager.css`

Aucun JavaScript n'a ete modifie.

## Valeurs appliquees

### Desktop et tablette paysage

Le `textarea#storyInput` reste positionne sur toute la carte afin de conserver le focus natif Android.

- `top: 0`
- `padding-top: clamp(38px, calc(var(--screen-content-height) * .048), 50px)`
- `padding-left: clamp(28px, calc(var(--screen-content-width) * .032), 46px)`
- `caret-color: #d69cff`

Le curseur decoratif `.constellation-panel::before` est aligne sur la meme zone :

- `left: clamp(28px, calc(var(--screen-content-width) * .022), 38px)`
- `top: clamp(38px, calc(var(--screen-content-height) * .048), 50px)`
- hauteur : `clamp(30px, calc(var(--screen-content-height) * .046), 46px)`

### Mobile portrait

Le panneau conserve son comportement restaure.

- `top: 0`
- `padding-top: 44px`
- `padding-left/right: 22px`
- `padding-bottom: 14px`

## Animation du caret

Le faux caret decoratif reste visible tant que le champ est vide.

Il utilise :

- `livingWritingCue` pour le clignotement doux ;
- `livingWritingCaretColor` pour la variation progressive or, violet, cyan et rose.

Lorsque du texte est saisi, la classe `has-writing-value` masque le caret decoratif afin de laisser le contenu du visiteur respirer.

## Compatibilite preservee

La correction conserve :

- le `textarea` natif ;
- le focus Android natif ;
- le clavier Android ;
- le bouton `Partager mon recit` ;
- `LivingOverlayManager` ;
- `constellationScene` ;
- les overlays ;
- la navigation ;
- le responsive existant.

## Validation

- `git diff --check` : OK.
- `git diff --cached --check` : OK.
- Verification du perimetre : modification CSS uniquement + rapport.

## Note technique

Le caret natif des navigateurs ne permet pas une animation multicolore fiable en CSS pur. La solution conserve donc le caret natif via `caret-color` et ajoute un caret decoratif non interactif (`pointer-events:none`) exactement aligne au debut du champ lorsque celui-ci est vide.
