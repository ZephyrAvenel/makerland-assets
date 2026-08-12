# RV-056 - Suggestion narrative perceptible sur la Boussole Vivante

Date: 2026-08-12

Branche: `agent/rv-056-compass-suggestion-language`

## Objectif

Rendre la direction suggeree par la meteo interieure clairement perceptible sur smartphone Android, sans modifier la logique metier, les destinations, les correspondances meteo -> direction, les JSON ou les parcours.

## Diagnostic de depart

Le mecanisme fonctionnel etait deja correct:

- la meteo interieure est memorisee;
- la direction suggeree est calculee;
- `.is-suggested` est appliquee a une seule direction;
- `Transition -> Explorer` est bien conserve;
- aucune navigation automatique n'est declenchee.

Le probleme restant etait visuel: le halo etait encore trop discret pour etre immediatement lisible sur Android.

## Correction visuelle appliquee

Fichier modifie:

- `css/style.css`

Changements:

- creation d'un etat `.is-suggested` plus identifiable;
- halo plus ample, diffus et transparent autour de la direction;
- bordure doree subtile et vivante;
- respiration lente de 2,8 secondes;
- apparition narrative progressive lors de l'arrivee sur la Boussole;
- texte de la direction suggeree legerement plus lumineux;
- autres directions conservees disponibles, avec seulement une baisse de luminosite de 4 %.

## Apparition narrative

L'etat suggere apparait apres l'arrivee de la Boussole:

- debut: halo absent;
- naissance progressive du halo;
- apparition de la bordure lumineuse;
- respiration lente ensuite.

Le rendu vise une invitation claire, jamais une injonction.

## Correspondances conservees

| Meteo | Direction suggeree |
| --- | --- |
| Eclaircie | Contempler |
| Transition | Explorer |
| Je ne sais pas | Decouvrir |
| Brouillard | Trouver un repere |
| Tempete | Creer |

## Accessibilite

`prefers-reduced-motion` est respecte:

- la respiration est desactivee;
- le halo reste visible sous forme statique;
- aucune animation supplementaire n'est imposee.

## Perimetre respecte

- Aucun JavaScript modifie.
- Aucun HTML modifie.
- Aucun JSON modifie.
- Aucune destination modifiee.
- Aucun parcours modifie.
- Aucune correspondance meteo -> direction modifiee.

## Validation

- Verification des cinq mappings meteo effectuee dans `js/app.js`.
- `git diff --check` OK.
- Aucun script lint local detecte (`package.json` absent).
- Correction limitee a `css/style.css` et au present rapport.
