# UX-047 — Harmonisation des panneaux de lecture

## Objectif

Uniformiser le comportement responsive des panneaux narratifs afin que les textes restent accessibles et que les actions ne sortent jamais de l'écran, notamment en smartphone portrait et paysage.

## Cause identifiée

Les panneaux du Premier Voyage utilisaient déjà des hauteurs maximales et parfois `overflow:auto`, mais le défilement concernait tout le panneau. En cas de faible hauteur disponible, les boutons pouvaient donc accompagner le contenu dans le flux de défilement, au lieu de rester immédiatement accessibles.

La Météo intérieure et l'accueil de la Boussole possédaient aussi des positions absolues sans borne verticale calculée depuis leur position réelle. Sur les formats très bas, leur zone de lecture pouvait dépasser la hauteur utile.

## Fichiers modifiés

- `css/firstJourney.css`
- `css/style.css`

## Adaptations réalisées

### Premier Voyage

- Ajout de variables CSS de hauteur sûre fondées sur `100dvh`, `env(safe-area-inset-*)` et la hauteur réelle du décor.
- Les panneaux du Premier Voyage utilisent désormais une structure flex verticale.
- Les textes longs du Passeport et de la Forêt de l'Arche défilent à l'intérieur de leur propre zone.
- Le texte principal des étapes devient scrollable lorsque la hauteur disponible est insuffisante.
- Les boutons d'action restent dans la partie visible du panneau.
- En paysage compact, les marges, paddings, citations et boutons sont légèrement resserrés afin d'éviter les sorties d'écran.
- En portrait mobile, la position du panneau est remontée automatiquement uniquement lorsque la hauteur disponible devient insuffisante.

### Météo intérieure

- Le bloc d'introduction reçoit une hauteur maximale calculée depuis sa position réelle.
- Le texte ne peut plus dépasser la fenêtre en faible hauteur.

### Boussole Vivante

- Le message d'accueil de la Boussole reçoit une hauteur maximale calculée depuis sa position réelle.
- Les variantes portrait et paysage compact conservent la même logique de borne verticale.

## Validation responsive prévue

Écrans contrôlés :

- smartphone portrait ;
- smartphone paysage ;
- tablette portrait ;
- tablette paysage ;
- desktop.

Panneaux contrôlés :

- Premier Voyage ;
- Météo intérieure ;
- Boussole Vivante ;
- Passeport du Premier Voyage ;
- Forêt de l'Arche.

## Résultat attendu

Aucun panneau narratif concerné ne sort de l'écran. Les titres restent visibles, le début du texte reste accessible, les contenus longs peuvent défiler localement et les boutons d'action demeurent utilisables.
