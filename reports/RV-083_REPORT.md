# RV-083 - Habiter les lieux

## Resume

La mission ouvre la phase editoriale de Makerland en transformant plusieurs pages Atelier et Constellation en lieux narratifs habitables.

Elle ne modifie aucun moteur, aucune navigation existante et aucun JSON metier.

## Lieux enrichis

### Atelier IA

Les cinq chambres ont ete reecrites autour d'une structure commune:

- grand titre;
- introduction narrative;
- citation mise en valeur;
- exemple reel issu des Recits Vivants;
- bloc `Dans les coulisses`;
- question au lecteur;
- navigation vers une autre salle;
- objets vivants conserves.

Salles concernees:

- `atelier/dialogue/`;
- `atelier/cartographie/`;
- `atelier/images/`;
- `atelier/clarification/`;
- `atelier/evolution/`.

### Constellation

Quatre nouveaux lieux editoriaux ont ete crees:

- `constellation/chemin/`;
- `constellation/fonctionnement/`;
- `constellation/transmission/`;
- `constellation/temoignages/`.

Ils presentent respectivement:

- le parcours d'un voyageur;
- les relations entre livres, cartes, NFC, oeuvre immersive, blog, citations et fragments;
- la transmission des oeuvres;
- une structure d'accueil pour de futurs temoignages.

## Composants crees

Les styles suivants ont ete ajoutes dans `css/placeholder.css`:

- `editorial-flow`;
- `editorial-card`;
- `room-next`;
- `revision-stack`;
- `compact-gallery`;
- `compact-timeline`;
- `path-cards`;
- `testimony-grid`.

Ces composants restent generiques et reutilisent l'identite graphique existante.

## Contraintes respectees

- Aucun HTML applicatif principal modifie.
- Aucun JavaScript modifie.
- Aucun JSON metier modifie.
- Aucun moteur modifie.
- Aucune navigation existante modifiee.
- Aucune animation existante modifiee.

## Validation

- Aucun JS modifie, donc aucun `node --check` requis pour un nouveau fichier.
- `git diff --check`: OK.
- Verification ASCII des fichiers modifies/crees: OK.
- Verification responsive structurelle: grilles fluides, largeurs limitees, cartes empilables sur mobile.

## Propositions pour RV-084

- Relier progressivement les nouvelles pages Constellation aux zones interactives existantes.
- Ajouter des contenus reels de temoignages lorsque la collecte editoriale sera prete.
- Enrichir les pages Atelier avec davantage d'exemples issus de manuscrits, cartes et variantes d'images.
- Creer une couche de donnees editoriales pour separer les contenus longs de la structure HTML.
