# RV-069 - Donner vie aux lieux interactifs

## Resume

RV-069 enrichit la couche interactive creee en RV-068 sans modifier les illustrations de fond.

Les interactions restent discretes et utilisent uniquement des effets de presence:

- halo dore;
- legere elevation;
- apparition de phrases narratives;
- oscillation tres faible des cartes suspendues;
- etoile centrale temporaire dans la Constellation.

## Atelier IA

Les cinq cartes de l'Atelier affichent une phrase narrative lors du survol, du focus clavier ou du toucher:

- Dialogue avec l'IA: "Chaque oeuvre commence par une conversation."
- Cartographie des idees: "Les idees deviennent des territoires."
- Generation d'images: "Une intuition peut prendre une forme."
- Clarification et affinage: "Comprendre, c'est souvent relier."
- Evolution de l'oeuvre: "Une oeuvre n'est jamais completement terminee."

Le comportement de navigation reste celui de RV-068. Les liens continuent d'ouvrir leurs pages provisoires.

## Constellation

Les citations suspendues recoivent:

- une lueur discrete;
- une oscillation faible;
- une etoile centrale temporaire.

L'effet est declenche au survol, au focus clavier ou au toucher. Il disparait naturellement.

## Pages provisoires

Les pages provisoires RV-068 ont ete harmonisees:

- symbole d'entree;
- titre;
- courte introduction;
- texte commun:

```text
Ce lieu est en cours d'elaboration. Il ouvrira progressivement au fil des prochaines versions des Recits Vivants.
```

- bouton Retour.

## Performance

Les animations utilisent uniquement:

- `transform`;
- `opacity`;
- filtres lumineux deja limites aux halos.

Une clause `prefers-reduced-motion` neutralise les animations de la nouvelle couche.

## Fichiers modifies

- `data/immersive-zones.json`
- `js/immersiveLayer.js`
- `css/style.css`
- `css/placeholder.css`
- pages provisoires `atelier/**/index.html`
- pages provisoires `constellation/**/index.html`

## Contraintes respectees

- Aucune illustration modifiee.
- Aucun changement sur la Bibliotheque, la Boussole ou l'Oeuvre immersive.
- Aucune modification de `ZoneRenderer`, `Navigation`, `BookRenderer`, `NarrativeMemory` ou `LivingEcho`.
- Aucun changement des destinations introduites en RV-068.

## Validations realisees

- `node --check js/immersiveLayer.js`
- Validation JSON de `data/immersive-zones.json`
- Verification de l'existence des 25 destinations declarees
- `git diff --check`

## Limite

La validation tactile Android reelle devra etre confirmee sur appareil apres deploiement GitHub Pages. Les effets sont toutefois implementes avec `pointerdown`, `focus` et `pointerenter`, ce qui couvre les interactions tactiles et desktop sans dependance externe.
