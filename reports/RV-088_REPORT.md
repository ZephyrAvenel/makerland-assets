# RV-088 - Archives Vivantes Phase 2 - Salle Dialoguer

## Objectif

RV-088 transforme la salle `atelier/dialogue/` en premiere salle d'archives editoriales reelle. Le visiteur n'y voit plus seulement une structure documentaire : il ouvre un premier carnet de travail autour du dialogue comme atelier de pensee.

## Fichiers modifies

- `atelier/components/archive-section.js`
- `css/archive-components.css`
- `reports/RV-088_REPORT.md`

## Composants utilises

La mission reutilise exclusivement les composants crees en RV-087 :

- `archive-card`
- `archive-fragment`
- `archive-quote`
- `archive-timeline`
- `archive-navigation`

Aucun nouveau composant JavaScript n'a ete cree.

## Organisation de la salle Dialoguer

### 1. Dialogue fondateur

Une grande carte d'introduction presente :

- `Le dialogue comme atelier de pensee`
- l'origine progressive des Recits Vivants ;
- le role des echanges, hypotheses, doutes, reformulations et intuitions.

### 2. Fragments de conversations

Trois fragments statiques ont ete ajoutes :

- Fragment 001 : rendre un recit habitable.
- Fragment 002 : pourquoi les Recits Vivants.
- Fragment 003 : l'IA comme compagnon de recherche plutot que comme autorite.

Chaque fragment est affiche avec le composant `archive-fragment`.

### 3. Ce qui a emerge

Une timeline retrace la chaine :

Dialogue -> Narratologie dialogique -> Atlas -> Oeuvre immersive -> Makerland -> Archives Vivantes

La timeline utilise le composant `archive-timeline`.

### 4. Citations

Trois citations statiques ont ete ajoutees avec le composant `archive-quote` :

- `Une oeuvre n'est jamais completement terminee. Elle change avec celui qui la rencontre.`
- `Les recits vivants ne sont pas produits. Ils sont cultives.`
- `L'IA n'ecrit pas a ma place. Elle m'aide a explorer des possibles.`

### 5. Navigation interne

La navigation elegante vers les autres salles de l'Atelier reste generee par `archive-navigation` :

- Cartographier
- Imaginer
- Clarifier
- Evoluer

## Choix techniques

Le rendu specialise de la salle Dialogue est implemente dans `archive-section.js` via `createDialogueArchive`. Les autres salles restent sur le rendu generique RV-087.

Le CSS ajoute seulement deux grilles :

- `.archive-fragment-grid`
- `.archive-quote-grid`

Ces grilles conservent les styles Makerland, restent fluides et ne changent aucune autre page hors archives.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucun appel reseau.
- Aucune modification de Navigation.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun nouveau composant hors architecture RV-087.

## Validation

- `node --check atelier/components/archive-section.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Suite RV-089

RV-089 pourra commencer a remplacer les fragments statiques par de veritables archives issues du travail de creation :

- dialogues fondateurs de la Carte interieure ;
- naissance de l'Anneau des Recits Vivants ;
- narratologie dialogique ;
- ERIA ;
- packs narratifs ;
- objets NFC ;
- brouillons d'articles ;
- couvertures successives.
