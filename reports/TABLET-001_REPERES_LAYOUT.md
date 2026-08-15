# TABLET-001 - Restaurer l'acces a Reperes sur tablette

## Objectif

Restaurer l'acces complet a l'entree **Reperes** dans la Boussole Vivante sur tablette, en portrait comme en paysage, sans modifier la navigation, la logique JavaScript, les overlays ni le contenu.

## Diagnostic

L'entree **Reperes** etait bien presente dans le DOM et conservait ses capacites d'interaction (`pointer-events:auto` sur `.living-compass-direction`).

La cause principale etait responsive :

- en portrait, la regle generique placait **Reperes** a `top:min(92%, calc(100% - var(--compass-safe-bottom)))`, trop pres du bas de la zone utile ;
- en paysage tablette, les regles compactes ne s'appliquaient pas lorsque la hauteur depassait `480px`, ce qui laissait la position de base trop basse ;
- cette zone basse entre en concurrence avec les appels narratifs et les panneaux inferieurs de la Boussole, rendant **Reperes** masque ou difficilement accessible.

Le probleme n'etait pas lie a une route absente, a un gestionnaire de clic casse, ni a une modification de navigation.

## Correction

Fichier modifie :

- `css/style.css`

Deux dispositions specifiques tablette ont ete ajoutees pour `#e03_boussole` :

- tablette portrait : repositionnement de la constellation des entrees avec **Reperes** remonte a `82%` de la zone utile ;
- tablette paysage : ajout d'une geometrie dediee aux ecrans larges mais non desktop, avec **Reperes** a `81%`.

Les entrees suivantes restent visibles et separees :

- Explorer ;
- Creer ;
- Decouvrir ;
- Reperes ;
- Contempler.

La correction est bornee par media queries afin d'eviter les regressions :

- mobile portrait conserve les regles existantes ;
- mobile paysage compact conserve les regles existantes ;
- desktop large conserve la disposition actuelle.

## Validation

Commandes executees :

- `git diff --check`
- `git diff --cached --check`

Aucun JavaScript n'a ete modifie ; `node --check` n'etait donc pas requis.

## Resultat attendu

Sur tablette Android portrait et paysage, **Reperes** reste accessible, lisible et distinct de **Decouvrir**, sans chevauchement avec les textes narratifs ni les panneaux inferieurs.
