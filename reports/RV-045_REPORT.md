# RV-045 - Meteo : bulles agrandies et stabilisees

Date : 2026-08-11

Branche : `agent/rv-045-meteo-bubble-responsive`

## Objectif

Stabiliser les cinq bulles de l'ecran `e02_meteo` en portrait et paysage mobile, afin que le texte principal et le sous-texte restent dans les contours et que les bulles demeurent visibles apres rotation.

## Fichier modifie

- `css/style.css`

## Corrections appliquees

- Le rendu interne des bulles remplit maintenant la zone meteo avec `width:100%`, `height:100%` et `box-sizing:border-box`.
- Les dimensions mobiles sont appliquees directement aux conteneurs `.makerland-zone` de `e02_meteo`, ce qui stabilise aussi la zone cliquable.
- En portrait, les bulles utilisent :
  - largeur : `clamp(68px, 19vw, 86px)`
  - hauteur : `clamp(126px, 18vh, 168px)`
- En paysage mobile, les bulles utilisent :
  - largeur : `clamp(92px, 14.6vw, 124px)`
  - hauteur : `clamp(104px, 32vh, 136px)`
- Les paddings, tailles de police et interlignages ont ete ajustes pour les textes longs, notamment `Je ne sais pas` et `Tempete`.

## Contraintes respectees

- Aucun HTML modifie.
- Aucun JavaScript modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune destination modifiee.
- Rythme d'apparition RV-043 conserve.
- Identite visuelle generale conservee.

## Validation

- Portrait : les bulles restent visibles et disposent de plus de hauteur pour les textes longs.
- Paysage : les bulles sont remontees legerement pour rester dans la zone visible.
- Desktop : le rendu conserve les proportions existantes.
- `git diff --check` : OK.
