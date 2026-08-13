# UX-025 - Raffinement editorial des Archives Vivantes

## Objectif

Transformer les Archives Vivantes en un espace editorial plus coherent avec l'identite publique des Recits Vivants, sans modifier les moteurs, les routes globales ni les JSON metier.

## Modifications realisees

- Remplacement des mentions visibles `Archives Vivantes de Makerland` par `Archives Vivantes des Recits Vivants`.
- Remplacement des boutons herites du prototype :
  - `Retour Archives` devient `Retour aux Archives`.
  - `Retour Atelier` devient `Retour a l'Atelier`.
  - `Retour Bibliotheque` devient `Retour a la Bibliotheque Vivante`.
  - `Retour Makerland` devient `Retour au Territoire`.
- Harmonisation de l'index des Archives Vivantes : le Volume I est presente comme le premier volume fondateur des Recits Vivants.
- Ajustement de D006 en `Naissance du Territoire des Recits Vivants` pour retirer l'ancienne identite publique de l'archive visible.
- Remplacement dans les notes Markdown de `integration Makerland` par `integration aux Recits Vivants`.

## Presentation patrimoniale

- Les cartes d'archives affichent des metadonnees plus editoriales : `Volume`, `Origine`, `Statut`.
- Les cartes recoivent un rendu plus proche d'un document patrimonial : fond legerement nuance, separation douce des metadonnees, ombre interne discrete.
- Le composant `Fragment` a ete affine pour evoquer un extrait retrouve : respiration accrue, largeur de lecture limitee, texte plus ample, halo discret.

## Fichiers modifies

- `atelier/archives/index.html`
- `atelier/archives/archive-volume.js`
- `atelier/archives/markdown/D001_Pourquoi_les_Recits_Vivants.md`
- `atelier/archives/markdown/D002_Naissance_de_la_pensee_dialogique.md`
- `atelier/archives/markdown/D003_Naissance_de_la_Cosmologie_des_Recits_Vivants.md`
- `atelier/archives/markdown/D004_Naissance_des_Cartes_Narratives.md`
- `atelier/archives/markdown/D005_Naissance_de_lOeuvre_immersive.md`
- `atelier/archives/markdown/D006_Naissance_de_Makerland.md`
- `atelier/archives/markdown/D007_Naissance_de_la_Bibliotheque_Vivante.md`
- `atelier/archives/markdown/D008_Naissance_de_la_Boussole_Vivante.md`
- `atelier/archives/markdown/D009_Naissance_de_lAtelier_IA.md`
- `atelier/archives/markdown/D010_Naissance_des_Archives_Vivantes.md`
- `atelier/components/archive-card.js`
- `atelier/components/archive-section.js`
- `css/archive-components.css`

## Validation

- Recherche des mentions visibles de Makerland dans `atelier/archives` et `atelier/components` : plus aucune occurrence visible, hors chemin technique du fichier Markdown D006 conserve pour compatibilite.
- Index des Archives : 10 cartes rendues, libelles de retour harmonises, aucune mention visible de Makerland.
- Navigation Archives -> D001 -> Retour aux Archives : OK.
- D001 : carte d'archive, fragment et navigation rendus correctement.
- Mobile portrait 412 x 915 : aucun debordement horizontal detecte.
- Mobile paysage 915 x 412 : aucun debordement horizontal detecte.
- `node --check atelier/archives/archive-volume.js` : OK.
- `node --check atelier/components/archive-card.js` : OK.
- `node --check atelier/components/archive-section.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : a executer apres staging.

## Note

Aucune navigation globale, aucun moteur, aucun JSON metier, aucun BookRenderer et aucun ZoneRenderer n'a ete modifie.
