# UX-026 - Identite du Territoire des Recits Vivants

## Objectif

Renforcer l'impression que le Seuil, le Premier Voyage, l'Atelier, les Archives, la Constellation et le Carnet appartiennent a un meme territoire vivant, sans modifier les moteurs ni les parcours.

## Modifications realisees

- Ajout d'une signature de lieu homogene sur les pages editoriales principales :
  - Atelier des Recits : `La ou les oeuvres prennent forme.`
  - Archives Vivantes : `Les traces de la creation.`
  - Constellation : `Les liens entre toutes les oeuvres.`
  - Carnet de Voyage : `La memoire de votre traversee.`
- Ajout d'une carte de lieu dans chaque etape du Premier Voyage, avec le meme rythme : nom du lieu, definition courte, respiration avant le texte.
- Renforcement du Fil Rouge avec le libelle commun `Lieu vivant`.
- Harmonisation du vocabulaire public :
  - `Atelier IA` devient `Atelier des Recits` dans les libelles visibles concernes.
  - Les anciennes mentions visibles de Makerland dans le parcours editorial ont ete remplacees par `Recits Vivants` ou `Territoire`.
- Uniformisation de plusieurs boutons generiques `Retour` en `Retour au Territoire`, sans changer leur destination.
- Correction de caracteres d'encodage dans la Constellation Vivante.

## Styles

- Creation de `.place-signature` dans `css/placeholder.css`.
- Ajout de `.first-journey__place-card` dans `css/firstJourney.css`.
- Ajout de `.narrative-thread__kicker` dans `css/narrativeThread.css`.

Ces ajouts reutilisent la palette, les halos, les bordures et les respirations deja presents.

## Fichiers modifies

- `js/firstJourney.js`
- `js/narrativeThread.js`
- `js/livingHome.js`
- `atelier/living-cycle.js`
- `carnet/carnet.js`
- pages HTML de l'Atelier, des Archives, de la Constellation et du Carnet concernees par les libelles visibles
- `css/firstJourney.css`
- `css/narrativeThread.css`
- `css/placeholder.css`

## Validation

- Parcours Premier Voyage controle jusqu'a l'etape Constellation : les signatures de lieu apparaissent pour Meteo, Bibliotheque, Atelier, Archives et Constellation.
- Controle des libelles visibles : les occurrences restantes de `Makerland` dans le perimetre modifie sont uniquement internes (`hasPreviousMakerlandMemory`) ou techniques (`D006_Naissance_de_Makerland.md`).
- Controle des signatures : `.place-signature`, `.first-journey__place-card` et `.narrative-thread__kicker` sont presents.
- Controle responsive statique : les styles utilisent des largeurs fluides, `clamp()` et des composants deja compatibles mobile.
- `node --check js/firstJourney.js` : OK.
- `node --check js/narrativeThread.js` : OK.
- `node --check js/livingHome.js` : OK.
- `node --check js/livingJourney.js` : OK.
- `node --check js/livingConstellation.js` : OK.
- `node --check js/livingConstellationExperience.js` : OK.
- `node --check js/livingExhibitions.js` : OK.
- `node --check atelier/living-cycle.js` : OK.
- `node --check carnet/carnet.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : a executer apres staging.

## Limite de validation

Le navigateur integre a permis de confirmer les signatures du Premier Voyage jusqu'a la Constellation. Les tentatives de validation headless complete des pages Constellation enrichies ont ete interrompues par l'outillage local avant la fin du chargement ; les controles syntaxiques, statiques et de vocabulaire ont donc ete conserves comme validation principale.

## Garanties

Aucune route, destination, navigation globale, JSON metier, BookRenderer, ZoneRenderer ou moteur narratif n'a ete modifie.
