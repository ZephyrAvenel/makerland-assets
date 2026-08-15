# UX-CARET-004 - Plume de Lumiere

## Objectif

Raffiner le curseur decoratif de la Constellation pour qu'il ne ressemble plus a un repere technique, mais a une presence lumineuse discrete qui accompagne l'ecriture.

## Fichiers modifies

- `css/livingCaret.css`
- `js/livingCaret.js`

Aucun autre fichier de production n'a ete modifie.

## Choix artistiques

La plume a ete rapprochee d'une presence ancienne et manuscrite :

- trait tres fin de `2px` ;
- opacite moderee ;
- halo limite a `3px` maximum ;
- mouvement lent ;
- aucun scintillement rapide ;
- aucune couleur saturee ;
- aucun bleu ;
- aucun effet neon.

## Couleurs retenues

La palette a ete reduite a quatre familles proches :

- ivoire chaud : `rgba(255,250,232,.9)` ;
- or pale : `rgba(244,213,149,.88)` ;
- ambre doux : `rgba(230,180,105,.82)` ;
- cuivre leger : `rgba(161,94,55,.58)`.

La transition entre ces teintes est volontairement tres lente avec `rvLivingCaretTint` sur `18s`.

## Animation

Deux animations CSS composent la plume :

- `rvLivingCaretBreath` : respiration organique de `4.4s` ;
- `rvLivingCaretTint` : variation de teinte lente de `18s`.

La respiration utilise uniquement :

- `opacity` ;
- `filter: brightness()` avec parcimonie ;
- `box-shadow` fixe et tres limite.

## Signature lumineuse

Une minuscule signature a ete ajoutee a l'extremite superieure :

- `::before` : point de lumiere ivoire ;
- `::after` : eclat tres discret en croix.

Cette signature est plus visible lorsque la plume est immobile (`is-resting`) et s'attenue pendant la frappe (`is-typing`).

## Vie du curseur

Le module `livingCaret.js` ajoute uniquement deux classes visuelles :

- `is-typing` lorsque l'utilisateur saisit ou presse une touche ;
- `is-resting` apres environ `1300ms` sans frappe.

Ces classes ne modifient pas le focus, la selection, le contenu du champ, ni le comportement Android.

## Garantie fonctionnelle

La mission ne modifie pas :

- le `textarea` ;
- le focus natif ;
- le clavier Android ;
- `LivingOverlayManager` ;
- `constellationScene` ;
- les overlays ;
- la navigation ;
- le bouton `Partager mon recit`.

Le module ne contient aucun appel a :

- `focus()` ;
- `click()` ;
- `dispatchEvent()`.

## Performance

L'effet reste leger :

- aucune animation de layout ;
- aucune relecture continue ;
- mise a jour de position deja existante via `requestAnimationFrame` ;
- transition de position conservee a `0.08s`.

## Validation

- `node --check js/livingCaret.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Intention finale

La Plume de Lumiere doit rester presque imperceptible. Elle ne cherche pas a attirer l'attention : elle donne simplement l'impression que les mots apparaissent la ou une petite presence lumineuse les revele.
