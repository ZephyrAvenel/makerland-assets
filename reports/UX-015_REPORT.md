# UX-015 — Reparation complete de l'Atelier IA

## Objectif

Rendre l'Atelier IA pleinement navigable et operationnel sur tablette Android : entree dans l'Atelier, ouverture des cinq chambres, contenu non vide, objets interactifs, rubriques consultables et retour fluide vers l'Atelier.

## Diagnostic

### Donnees des chambres

Les donnees des objets vivants existent bien dans `atelier/objects.json` pour les cinq chambres :

- `dialogue`
- `cartographie`
- `images`
- `clarification`
- `evolution`

Le script responsable du chargement est `atelier/atelier-objects.js`. Les chemins de donnees sont corrects :

- Atelier racine : `objects.json`
- Chambres : `../objects.json`

### Routes principales

Les hitboxes de l'ecran `e07_atelier` sont definies dans `data/immersive-zones.json` et pointent bien vers :

- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`
- `atelier/`

Les routes existent toutes.

### Cause exacte des zones vides ou non operationnelles

Le probleme ne venait pas des images ni du moteur global. Il venait des composants internes de l'Atelier :

1. `atelier/components/archive-section.js` affichait plusieurs zones documentaires sous forme de modeles generiques.
2. Certains boutons `Explorer` etaient des boutons HTML sans destination.
3. Une carte documentaire possedait un lien `href="#"`, donc visuellement presente mais fonctionnellement inactive.
4. Les chambres proposaient une poursuite vers la chambre suivante, mais pas de retour contextuel explicite vers l'Atelier.
5. Les fiches d'objets vivants pouvaient se fermer par clic et Escape, mais pas via le bouton Retour Android.

Ces points donnaient l'impression, sur tablette, que les chambres etaient presentes mais partiellement vides ou non interactives.

## Corrections apportees

### Rubriques d'archives reactives

Fichier modifie :

- `atelier/components/archive-section.js`

Les rubriques de chaque chambre possedent maintenant un vrai lien `Explorer` vers une archive D001-D010 pertinente.

Exemples :

- Dialogue -> `D001`, `D002`, `D008`
- Cartographie -> `D003`, `D004`, `D006`
- Images -> `D005`, `D006`, `D007`
- Clarification -> `D008`, `D010`
- Evolution -> `D006`, `D009`, `D010`

Les cartes generiques "Modele de document" / "Entree documentaire" ont ete remplacees par des cartes consultables reliees aux Archives Vivantes.

### Retour Atelier dans les chambres

Fichier modifie :

- `atelier/atelier-return.js`

Un lien `Retour Atelier` est ajoute automatiquement sur les pages de chambre (`data-depth="sub"`), juste avant le retour au voyage. Cela permet le parcours demande :

Atelier IA -> Dialogue -> Cartographie -> Images -> Clarification -> Evolution -> retour Atelier.

### Fiches d'objets vivants

Fichier modifie :

- `atelier/atelier-objects.js`

Les fiches d'objets vivants conservent :

- clic souris ;
- interaction tactile ;
- fermeture par clic exterieur ;
- fermeture par Escape.

Ajout :

- fermeture par bouton Retour Android via `history.pushState` / `popstate`.

L'etat de consultation locale des objets reste conserve comme auparavant.

### Style des liens Explorer

Fichier modifie :

- `css/archive-components.css`

Le style `.archive-explore` fonctionne maintenant correctement pour des liens `<a>` aussi bien que pour des boutons, avec une apparence identique.

## Routes verifiees

Routes Atelier :

- `atelier/`
- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`

Routes Archives :

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

Audit local des liens internes du dossier `atelier/` : OK.

## Validations

- `node --check atelier/atelier-objects.js` : OK
- `node --check atelier/atelier-return.js` : OK
- `node --check atelier/components/archive-section.js` : OK
- Audit des routes Atelier : OK
- Audit des liens HTML internes `atelier/` : OK
- `git diff --check` : a executer avant commit final

## Anomalies restantes

Aucun appareil Android physique n'est connecte dans cet environnement. La verification tactile Android repose donc sur les evenements standards utilises par le code :

- liens HTML natifs pour les chambres ;
- boutons natifs pour les objets ;
- fermeture Retour Android via l'historique navigateur.

## Impact

Non modifies :

- Navigation globale
- BookRenderer
- ZoneRenderer
- NarrativeMemory
- LivingEcho
- JSON metier
- images
- parcours principaux

L'Atelier IA est maintenant navigable, rempli par ses composants internes et reaccessible sans impasse.
