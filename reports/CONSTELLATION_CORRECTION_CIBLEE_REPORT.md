# Correction ciblee - Constellation

## Objectif

Appliquer les corrections ciblees demandees sur la Constellation :

- corriger le bouton de retour de la vue `Ecoute` ;
- afficher la couverture reelle dans la carte `Oeuvre en resonance` ;
- reduire les superpositions en portrait sur les panneaux de Constellation.

## Probleme 1 - Retour depuis Ecoute

### Cause

La page `constellation/recit-009/index.html` contenait un lien de retour vers `../../index.html`.
Ce lien renvoyait donc vers l'accueil du territoire au lieu de revenir a la page Constellation.

### Correction

Le lien a ete remplace par `../index.html`, qui correspond a `constellation/index.html`.
Le libelle visible devient :

`Retour a la Constellation`

### Fichier modifie

- `constellation/recit-009/index.html`

## Probleme 2 - Couverture de l'oeuvre en resonance

### Cause

La carte `Oeuvre en resonance` affichait uniquement le titre nettoye de l'oeuvre.
Elle ne resolvait pas le champ patrimonial `coverImage`, pourtant present dans `data/work-network.json`.

### Correction

Le module `js/livingConstellationExperience.js` resout maintenant l'image dans cet ordre :

1. champs directs si disponibles : `src`, `cover`, `coverUrl`, `image`, `urlImage`, `thumbnail` ;
2. champ `coverImage` / `coverAsset` / `imageId` ;
3. correspondance dans `data/archive-assets.json` ;
4. absence d'image si aucune source n'est disponible.

Les chemins `raw.githubusercontent.com/...` sans protocole sont convertis en URL HTTPS utilisable.
Les images affichees possedent maintenant un attribut `alt`.

### Fichier modifie

- `js/livingConstellationExperience.js`

## Probleme 3 - Superpositions en portrait

### Cause

Plusieurs panneaux utilisaient des dimensions tres compactes en portrait, parfois calculees pour des largeurs de paysage.
Les panneaux pouvaient rester trop etroits, se superposer au texte ou ne pas defiler correctement.

### Correction

Des media queries portrait ont ete ajoutees ou completees pour :

- transformer les resonances en panneau bas lisible ;
- limiter les panneaux a une hauteur maximale ;
- activer `overflow:auto` sur les panneaux qui peuvent depasser ;
- garantir une largeur suffisante en portrait ;
- conserver les couches interactives dans leur propre niveau visuel ;
- eviter que les contenus visibles soient bloques par un calque trop petit ou mal place.

### Fichiers modifies

- `css/living-constellation-experience.css`
- `css/livingPaths.css`
- `css/livingExhibitions.css`
- `css/livingSky.css`

## Captures

Les captures avant/apres n'ont pas ete produites dans cet environnement.
Les validations demandees sur appareils reels restent a effectuer manuellement apres merge.

## Validations

A executer avant livraison :

- `node --check js/livingConstellationExperience.js`
- `git diff --check`
- `git diff --cached --check`

## Resultat attendu

- La vue `Ecoute` revient a la Constellation.
- La carte `Oeuvre en resonance` affiche la couverture reelle lorsqu'elle est presente dans le patrimoine.
- Les panneaux de Constellation restent lisibles en portrait et limitent les chevauchements sur les largeurs critiques.
