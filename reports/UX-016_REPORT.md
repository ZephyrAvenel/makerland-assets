# UX-016 — Reparer les chambres de l'Atelier IA

## Objectif

Corriger le rendu vide des chambres de l'Atelier IA apres UX-015. Les pages concernees sont :

- Dialoguer
- Cartographier
- Imaginer
- Clarifier
- Evoluer

## Cause exacte

Le probleme principal venait de `atelier/living-cycle.js`.

La fonction `renderBreadcrumb()` utilisait :

```js
document.querySelector("[data-cycle-breadcrumb]")
```

Or les pages de l'Atelier portent l'attribut `data-cycle-breadcrumb` a deux endroits :

- sur le `<body>` pour stocker le chemin narratif ;
- sur le paragraphe `.living-breadcrumb` pour afficher ce chemin.

Le selecteur trouvait donc le `<body>` en premier. Puis le script executait :

```js
target.textContent = path;
```

Comme `target` etait le `<body>`, tout le contenu de la page etait remplace par le seul fil d'Ariane. C'est pourquoi les chambres affichaient uniquement :

`Bibliotheque -> Atelier -> ...`

et plus aucun titre, texte, archive, carte ou bouton.

## Correction appliquee

Fichier modifie :

- `atelier/living-cycle.js`

Le selecteur cible maintenant explicitement le paragraphe d'affichage :

```js
document.querySelector(".living-breadcrumb[data-cycle-breadcrumb]") ||
document.querySelector("main [data-cycle-breadcrumb]")
```

Le `<body>` reste la source de donnees, mais n'est plus jamais utilise comme cible d'ecriture.

## Correction complementaire

Fichier modifie :

- `atelier/components/archive-section.js`

La salle Dialogue affiche maintenant aussi ses rubriques et cartes d'archives reliees a D001-D010, comme les quatre autres chambres. Avant cette correction complementaire, la salle etait rendue correctement mais exposait surtout ses fragments et sa navigation interne ; les liens D001/D002 etaient moins visibles que dans les autres salles.

## Verification des donnees

Les donnees d'objets de `atelier/objects.json` sont chargees pour les cinq ids :

- `dialogue`
- `cartographie`
- `images`
- `clarification`
- `evolution`

Chaque chambre affiche 4 objets interactifs.

## Verification des archives

Les liens d'archives sont injectes dans les chambres :

- Dialogue : 7 liens vers D001-D010
- Cartographie : 7 liens vers D001-D010
- Images : 7 liens vers D001-D010
- Clarification : 7 liens vers D001-D010
- Evolution : 7 liens vers D001-D010

Navigation testee depuis Dialogue vers :

- `atelier/archives/d001.html`

Resultat : archive rendue, contenu Markdown visible, aucune erreur console.

## Verification navigateur locale

Serveur local temporaire :

`http://127.0.0.1:8765/`

Resultats observes dans le navigateur :

| Chambre | Titre visible | Archives injectees | Objets | Retour Atelier | Erreurs console |
| --- | --- | ---: | ---: | --- | --- |
| Dialogue | Oui | 7 blocs | 4 | Oui | Aucune |
| Cartographie | Oui | 8 blocs | 4 | Oui | Aucune |
| Images | Oui | 8 blocs | 4 | Oui | Aucune |
| Clarification | Oui | 8 blocs | 4 | Oui | Aucune |
| Evolution | Oui | 8 blocs | 4 | Oui | Aucune |

## Routes verifiees

- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`
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

Audit local des liens HTML internes `atelier/` : OK.

## Validations

- `node --check atelier/living-cycle.js` : OK
- `node --check atelier/components/archive-section.js` : OK
- Rendu navigateur des cinq chambres : OK
- Navigation vers archive D001 : OK
- Erreurs console : aucune observee
- `git diff --cached --check` : a executer avant commit final

## Impact

Aucun moteur global n'a ete modifie :

- Navigation globale : non modifiee
- BookRenderer : non modifie
- ZoneRenderer : non modifie
- NarrativeMemory : non modifie
- LivingEcho : non modifie
- JSON metier : non modifie

La correction restaure le rendu des chambres sans modifier les routes ni les contenus editoriaux principaux.
