# RV-087 - Archives Vivantes de l'Atelier IA - Phase 1

## Objectif

RV-087 transforme les cinq salles de l'Atelier IA en espaces editoriaux extensibles. La mission ne livre pas les archives definitives : elle installe l'architecture qui permettra d'ajouter progressivement dialogues, brouillons, cartes, images, versions, decisions editoriales et fragments.

## Salles concernees

- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`

## Architecture retenue

Chaque salle conserve son contenu narratif existant et recoit une nouvelle racine :

`<section class="archive-shell" data-archive-room="..."></section>`

Les composants JavaScript generent ensuite :

- une introduction d'archive ;
- un panneau `Pourquoi cette salle ?` ;
- un sommaire dynamique en accordeons natifs `details/summary` ;
- les rubriques documentaires futures ;
- des modeles de cartes documentaires ;
- une citation vivante ;
- un fragment ;
- une timeline ;
- une galerie ;
- une navigation interne vers les autres salles de l'Atelier.

## Composants crees

### `atelier/components/archive-card.js`

Cree le modele de carte documentaire permettant d'afficher :

- titre ;
- date ;
- type ;
- origine ;
- resume ;
- lien futur.

### `atelier/components/archive-fragment.js`

Cree un composant de fragment court, pense pour les notes, intuitions et phrases de travail.

### `atelier/components/archive-quote.js`

Cree le composant `Citation vivante`, reutilisable dans toutes les salles.

### `atelier/components/archive-timeline.js`

Cree une timeline reutilisable pour les versions, jalons et evolutions.

### `atelier/components/archive-gallery.js`

Prepare une galerie pour images, schemas, cartes, croquis et comparaisons.

### `atelier/components/archive-navigation.js`

Genere la navigation interne entre les cinq salles de l'Atelier, sans modifier la navigation globale.

### `atelier/components/archive-section.js`

Orchestre les composants precedents et porte les configurations editoriales des cinq salles.

## CSS dedie

Un fichier dedie a ete cree :

`css/archive-components.css`

Il definit :

- la mise en page des archives ;
- les cartes documentaires ;
- les accordeons ;
- les fragments ;
- les citations ;
- la timeline ;
- la galerie ;
- la navigation interne ;
- les adaptations mobile ;
- le respect de `prefers-reduced-motion`.

## Justification des choix

L'architecture repose sur de petits composants natifs et factorises. Elle evite de dupliquer de gros blocs HTML dans chaque salle et permet d'ajouter plus tard de nombreux documents sans reconstruire les pages.

Les accordeons utilisent `details/summary`, ce qui donne une navigation clavier native et une base accessible sans JavaScript complexe.

Le CSS est separe afin de ne pas surcharger `placeholder.css` et de limiter les risques de regression sur Constellation, Carnet ou les autres lieux.

## Fichiers modifies

- `atelier/dialogue/index.html`
- `atelier/cartographie/index.html`
- `atelier/images/index.html`
- `atelier/clarification/index.html`
- `atelier/evolution/index.html`
- `css/archive-components.css`
- `atelier/components/archive-card.js`
- `atelier/components/archive-fragment.js`
- `atelier/components/archive-quote.js`
- `atelier/components/archive-timeline.js`
- `atelier/components/archive-gallery.js`
- `atelier/components/archive-navigation.js`
- `atelier/components/archive-section.js`
- `reports/RV-087_REPORT.md`

## Contraintes respectees

- Aucun moteur narratif modifie.
- Aucun pack narratif modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun LivingEcho modifie.
- Aucun NarrativeMemory modifie.
- Aucune navigation globale modifiee.
- Aucun JSON metier modifie.
- Aucune bibliotheque externe ajoutee.

## Validation

- `node --check atelier/components/archive-card.js` : OK.
- `node --check atelier/components/archive-fragment.js` : OK.
- `node --check atelier/components/archive-quote.js` : OK.
- `node --check atelier/components/archive-timeline.js` : OK.
- `node --check atelier/components/archive-gallery.js` : OK.
- `node --check atelier/components/archive-navigation.js` : OK.
- `node --check atelier/components/archive-section.js` : OK.
- `git diff --check` : OK.

## Verification responsive

Les composants utilisent :

- largeurs fluides `width:min(...)` ;
- grilles `auto-fit` ;
- accordeons natifs ;
- adaptation mobile a `max-width:680px` ;
- textes limites en largeur ;
- aucune position fixe.

Ils sont donc compatibles desktop, tablette et mobile sans modifier la composition generale des salles.

## Pistes RV-088

- Deplacer les configurations editoriales vers un fichier JSON non metier dedie aux archives.
- Ajouter les premiers vrais documents dans une salle pilote.
- Ajouter une recherche locale dans les archives lorsque le volume augmentera.
- Ajouter un filtre par type : dialogue, brouillon, image, version, carte.
- Relier les archives au Carnet de Voyage pour memoriser les documents consultes.
