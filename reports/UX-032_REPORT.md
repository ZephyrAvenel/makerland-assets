# UX-032 - Hierarchie de la salle Constellation

## Objectif

Rendre la salle Constellation lisible en moins de cinq secondes.

La hierarchie visee est :

1. Lieu vivant.
2. Texte d'introduction.
3. Chemin Vivant comme action principale.
4. Resonances proposees comme explorations secondaires.

## Modifications realisees

### Lieu vivant et introduction

Le haut de la salle affiche maintenant clairement :

- `Lieu vivant` ;
- `Constellation Vivante` ;
- une phrase expliquant que les oeuvres, archives, images et idees se repondent.

La citation de resonance du jour est conservee, mais son opacite est reduite afin qu'elle ne concurrence plus l'action principale.

### Chemin Vivant

La carte `Chemin Vivant` est repositionnee au centre de la composition et devient l'action principale visible.

Texte ajoute :

`Les oeuvres ne vivent jamais seules.`

`Chaque lecture cree de nouveaux liens.`

`Chaque retour eclaire un autre chemin.`

Bouton principal :

`Commencer le Chemin Vivant`

### Resonances proposees

Les quatre cartes inferieures sont maintenant regroupees sous le titre :

`Resonances proposees`

Elles deviennent interactives :

- `Archive Vivante` ouvre `atelier/archives/d010.html` ;
- `Concept Vivant` ouvre une fiche locale de concept ;
- `Image patrimoniale` ouvre une vue locale agrandie ;
- `Oeuvre en resonance` ouvre une fiche locale d'oeuvre.

Ces fiches sont rendues dans la salle, sans changer la navigation globale.

## Fichiers modifies

- `js/livingConstellationExperience.js`
- `js/livingPaths.js`
- `css/living-constellation-experience.css`
- `css/livingPaths.css`
- `reports/UX-032_REPORT.md`

## Contraintes respectees

- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun JSON metier modifie.
- Aucune navigation generale modifiee.
- Identite graphique conservee : verre depoli, halos, typographie, transitions douces.

## Validations

- `node --check js/livingConstellationExperience.js` : OK.
- `node --check js/livingPaths.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.
- Test desktop : non execute dans cet environnement.
- Test mobile portrait : non execute dans cet environnement.
- Test mobile paysage : non execute dans cet environnement.
- Aucun debordement : controle CSS statique, validation navigateur a realiser.
- Action principale identifiable : controle statique effectue sur la hierarchie DOM/CSS.

## Note de validation visuelle

L'environnement Codex disponible pour cette mission n'a pas permis une validation navigateur fiable. Les validations livrees couvrent la syntaxe JavaScript, le controle Git et la coherence statique de la hierarchie d'affichage.
