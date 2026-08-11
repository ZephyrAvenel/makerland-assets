# RV-032A Report - Rythme de l'ecran Meteo

## Resume

RV-032A affine uniquement le rythme d'apparition du texte sur `e02_meteo`.

La lisibilite apportee par RV-032 est conservee. Cette mission ajuste seulement les temporisations et la courbe d'animation.

## Fichier modifie

- `css/style.css`

## Nouveau rythme

La sequence conserve `entry-rite-arriving` :

- `0 ms` : le paysage apparait seul ;
- `900 ms` : debut de l'apparition du titre ;
- `1300 ms` : duree de l'apparition du titre ;
- `2200 ms` : titre completement visible ;
- `600 ms` : respiration silencieuse avec le titre seul ;
- `2800 ms` : debut de l'apparition du sous-titre ;
- `1400 ms` : duree de l'apparition du sous-titre.

## Courbe retenue

Les deux animations utilisent :

```css
cubic-bezier(.22, 1, .36, 1)
```

Cette courbe donne une entree plus progressive et plus contemplative qu'un fade-in rapide.

## Comportement fonctionnel

Aucun comportement fonctionnel n'a ete modifie.

Non modifies :

- HTML ;
- JavaScript ;
- JSON ;
- navigation ;
- moteurs ;
- hitboxes ;
- cartes meteo ;
- positions ;
- interactions.

## Validation

- `git diff --check` : OK.
- Verification du perimetre : seul `css/style.css` est modifie hors rapport.
- Aucun controle de syntaxe JavaScript requis, aucun JS n'a ete modifie.
