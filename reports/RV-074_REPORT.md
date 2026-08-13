# RV-074 - Les objets vivants de l'Atelier IA

## Resume

La mission ajoute une couche d'objets explorables dans les cinq chambres internes de l'Atelier IA. Chaque objet ouvre une fiche immersive sans quitter la salle, puis revient exactement a la meme position lorsque la fiche est fermee.

## Architecture ajoutee

- `atelier/objects.json`: source de donnees des objets vivants et des fiches.
- `atelier/atelier-objects.js`: rendu generique des objets, ouverture des fiches, fermeture locale, memoire de session.
- `css/placeholder.css`: styles des objets, halos, etats consultes, fiche immersive et responsive.

Les pages HTML conservent une structure legere: chaque chambre expose seulement un conteneur `data-atelier-objects`. Les contenus des fiches sont generes depuis le JSON.

## Chambres couvertes

- Dialoguer: carnet de dialogue, premiere question, conversation fondatrice, intuition marquante.
- Cartographier: carte narrative, spirale, constellation, polarite.
- Imaginer: image retenue, image abandonnee, prompt creatif, variantes.
- Clarifier: brouillon, annotation, correction, changement de structure.
- Evoluer: journal des versions, jalon RV, grande evolution, perspective.

## Memoire locale

Les objets consultes sont marques en session via `sessionStorage` avec le prefixe `makerland:atelier:object:`. Cette memoire reste locale a l'onglet et ne modifie aucune donnee persistante.

## Identite graphique

Les effets restent limites:

- halo leger;
- elevation de 2 a 3 px;
- transition 260 ms;
- fiche immersive arrondie;
- fond sombre translucide;
- respect de `prefers-reduced-motion`.

## Contraintes respectees

- Aucune modification de Navigation.
- Aucune modification de ZoneRenderer.
- Aucune modification de BookRenderer.
- Aucune modification de NarrativeMemory, LivingJourney ou LivingEcho.
- Aucune modification de la meteo, de la bibliotheque, des cartes, de la boussole ou des oeuvres immersives.
- Aucune illustration existante remplacee.

## Validation

- `node --check atelier/atelier-objects.js`: OK.
- `node --check atelier/atelier-return.js`: OK.
- Validation JSON de `atelier/objects.json`: OK.
- `git diff --check`: OK.

## Extension future

De nouveaux objets peuvent etre ajoutes en declarant simplement de nouvelles entrees dans `atelier/objects.json`. Le moteur peut accueillir davantage de fiches sans modification des chambres HTML principales.
