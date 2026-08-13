# RV-076 - Le Carnet de Voyage des Recits Vivants

## Resume

La mission cree un nouveau lieu autonome: `/carnet/`. Ce Carnet de Voyage rassemble les traces locales du parcours sans compte, sans serveur, sans cookie externe et sans vocabulaire de progression.

## Espaces crees

- `carnet/index.html`: synthese du voyage.
- `carnet/rencontres/index.html`: page `Ce qui vous a accompagne`.
- `carnet/carnet.js`: lecture locale des traces et rendu des cartes.

## Donnees utilisees

Le Carnet lit uniquement des donnees locales:

- `localStorage["makerland.narrativeMemory.v1"]` pour la derniere meteo et la derniere direction.
- `localStorage["makerland:living-cycle"]` pour les chambres Atelier, fragments Constellation et objets vivants.
- compteurs locaux `makerland_clicks_*` pour les oeuvres ouvertes.

Aucune donnee n'est envoyee. Aucun compte n'est cree.

## Contenus affiches

Le Carnet presente:

- les traces du voyage;
- la derniere meteo et la derniere direction;
- les chambres de l'Atelier visitees;
- les fragments de la Constellation decouverts;
- les objets vivants explores;
- une carte simple des chemins;
- une phrase de resonance aleatoire;
- une page dediee aux rencontres recentes.

## Acces ajoutes

- Depuis l'Atelier: lien `Ouvrir le Carnet de Voyage`.
- Depuis la Constellation: lien `Ouvrir le Carnet de Voyage`.
- Depuis la Bibliotheque: bouton dans le panneau final de visite rendu par `BookRenderer`.

## Contraintes respectees

- Aucune illustration modifiee.
- Navigation existante conservee.
- Pas de serveur.
- Pas de compte.
- Pas de gamification.
- Aucune mention de niveau, points, badge ou pourcentage.

## Validation

- `node --check carnet/carnet.js`: OK.
- `node --check js/bookRenderer.js`: OK.
- `node --check atelier/atelier-objects.js`: OK.
- `git diff --check`: OK.
- Verification ASCII des fichiers modifies: OK.

## Extension future

La structure permet d'ajouter plus tard:

- livres lus;
- cartes favorites;
- oeuvres preferees;
- citations conservees;
- chemins frequents.

Ces ajouts pourront se faire en enrichissant les sources locales lues par `carnet/carnet.js`, sans modifier la structure principale du Carnet.
