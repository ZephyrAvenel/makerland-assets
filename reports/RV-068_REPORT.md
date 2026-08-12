# RV-068 - Couche interactive Atelier IA et Constellation

## Resume

RV-068 transforme les illustrations existantes de l'Atelier IA et de la Constellation en lieux interactifs sans modifier les images.

La solution ajoute une couche transparente superposee aux decors, pilotee par des coordonnees relatives en pourcentage.

## Fichiers ajoutes

- `data/immersive-zones.json`
- `js/immersiveLayer.js`
- `css/placeholder.css`
- `atelier/index.html`
- `atelier/dialogue/index.html`
- `atelier/cartographie/index.html`
- `atelier/images/index.html`
- `atelier/clarification/index.html`
- `atelier/evolution/index.html`
- `constellation/index.html`
- `constellation/carnet/index.html`
- `constellation/comment/index.html`
- `constellation/collectif/index.html`
- `constellation/recit-001/index.html` a `constellation/recit-012/index.html`

## Fichiers modifies

- `index.html`: ajout du chargement de `js/immersiveLayer.js`.
- `css/style.css`: styles de la couche tactile transparente, du halo discret et repositionnement du formulaire Constellation sur le parchemin central existant.

## Architecture

`data/immersive-zones.json` decrit les zones tactiles en pourcentage de la zone utile de l'image.

`js/immersiveLayer.js` charge ce fichier, ecoute les changements d'ecran, puis genere automatiquement les zones interactives sur:

- `e07_atelier`;
- `e08_constellation`.

Les zones restent invisibles au repos. Au toucher, au focus clavier ou au survol desktop, elles revelent un halo dore discret et une legere elevation.

## Atelier IA

Les cinq cartes de l'illustration ouvrent:

- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`

Le bouton dessine `ENTRER DANS L'ATELIER` ouvre:

- `atelier/`

Les boutons dessines restent fonctionnels:

- Retour Bibliotheque -> `e06_fiction`
- Retour Oeuvre -> `e04_oeuvre`

## Constellation

Les douze citations suspendues ouvrent des fiches provisoires:

- `constellation/recit-001/` a `constellation/recit-012/`

Les autres zones ouvrent:

- Carnet -> `constellation/carnet/`
- Comment ca fonctionne -> `constellation/comment/`
- Vos mots. Une constellation. -> `constellation/collectif/`

Les boutons dessines restent fonctionnels:

- Retour Bibliotheque -> `e06_fiction`
- Retour Oeuvre -> `e04_oeuvre`

La zone centrale de partage existante reste fonctionnelle. Le formulaire HTML existant est positionne au-dessus du parchemin central dessine, sans ajouter de nouveau visuel.

## Contraintes respectees

- Aucune image modifiee.
- Aucun texte visible des illustrations modifie.
- Aucun JSON metier existant modifie.
- `ZoneRenderer`, `Navigation`, `BookRenderer`, `NarrativeMemory` et `LivingEcho` non modifies.
- Les coordonnees de la nouvelle couche sont relatives et independantes de la taille d'ecran.

## Validations realisees

- `node --check js/immersiveLayer.js`
- Validation JSON de `data/immersive-zones.json`
- `git diff --check`

## Limites

Les pages creees sont volontairement provisoires. Elles constituent des destinations reelles et navigables, mais leur contenu narratif complet devra etre developpe dans de futures missions.
