# RV-089 - Living Archives Volume I

## Source

Archive ZIP recuperee depuis le dossier Google Drive fourni :

`https://drive.google.com/drive/folders/1eser2AkDQIuXnGJJ_3P4qDnPWkoQEN7H`

Le ZIP contenait :

- `D001_Pourquoi_les_Recits_Vivants.md`
- `D002_Naissance_de_la_pensee_dialogique.md`
- `D003_Naissance_de_la_Cosmologie_des_Recits_Vivants.md`
- `D004_Naissance_des_Cartes_Narratives.md`
- `D005_Naissance_de_lOeuvre_immersive.md`
- `D006_Naissance_de_Makerland.md`
- `D007_Naissance_de_la_Bibliotheque_Vivante.md`
- `D008_Naissance_de_la_Boussole_Vivante.md`
- `D009_Naissance_de_lAtelier_IA.md`
- `D010_Naissance_des_Archives_Vivantes.md`
- `INDEX.md`
- `README.md`

Les contenus Markdown ont ete lus en UTF-8 afin de preserver les accents et la structure fournie.

## Architecture creee

Nouveau dossier :

`atelier/archives/`

Il contient :

- `index.html` : entree du Volume I.
- `d001.html` a `d010.html` : pages de consultation individuelles.
- `archive-volume.js` : renderer local du volume.
- `markdown/` : copie locale des dix fichiers Markdown source, avec noms ASCII stables.

## Fonctionnement

`archive-volume.js` construit l'index et les pages detaillees depuis les fichiers Markdown locaux.

Le rendu extrait :

- titre principal ;
- statut ;
- note ;
- contenu Markdown rendu en HTML ;
- navigation precedente / suivante ;
- retours vers Archives, Atelier, Bibliotheque et Makerland.

Les pages detaillees utilisent `data-archive-id` pour charger l'archive correspondante.

## Composants RV-087 reutilises

- `archive-card`
- `archive-fragment`
- `archive-quote`
- `archive-navigation`
- styles `css/archive-components.css`

Le renderer prend aussi en charge les blockquotes Markdown. Le Volume I fourni ne contient pas encore de blocs citation distincts ; aucune citation n'a donc ete inventee.

## Fichiers crees

- `atelier/archives/archive-volume.js`
- `atelier/archives/index.html`
- `atelier/archives/d001.html`
- `atelier/archives/d002.html`
- `atelier/archives/d003.html`
- `atelier/archives/d004.html`
- `atelier/archives/d005.html`
- `atelier/archives/d006.html`
- `atelier/archives/d007.html`
- `atelier/archives/d008.html`
- `atelier/archives/d009.html`
- `atelier/archives/d010.html`
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
- `reports/RV-089_REPORT.md`

## Fichiers modifies

- `atelier/index.html` : ajout d'une entree vers les Archives Vivantes.
- `css/archive-components.css` : styles de rendu Markdown et navigation du volume.

## Evolutivite

L'architecture permet d'ajouter D011, D012, D013, etc. en ajoutant :

1. un fichier Markdown source dans `atelier/archives/markdown/` ;
2. une entree dans la liste `ARCHIVES` de `archive-volume.js` ;
3. une page HTML detaillee suivant le squelette existant.

La structure pourra ensuite etre automatisee davantage si le volume d'archives augmente fortement.

## Contraintes respectees

- Aucun moteur narratif modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun LivingEcho modifie.
- Aucun NarrativeMemory modifie.
- Aucune navigation globale modifiee.
- Aucun JSON metier modifie.
- Aucun appel reseau externe au runtime.
- Aucun contenu d'archive reformule.

## Validation

- `node --check atelier/archives/archive-volume.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Captures

Captures non generees dans cette passe. La validation effectuee porte sur la structure, les liens, le rendu statique attendu et les controles syntaxiques.
