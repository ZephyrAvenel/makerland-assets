# Immersive Library Network

## Objectif

RV-014 transforme la salle `Portes ouvertes` en point d'entree vers un reseau de bibliotheques immersives.
Les cartes ne pointent plus directement vers une ressource Blogger unique.
Elles ouvrent des salles autonomes, chacune pilotee par les donnees.

## Donnees

Les nouvelles salles sont decrites dans:

`data/library-extensions.json`

Chaque salle contient:

- `id`
- `screenId`
- `containerId`
- `title`
- `subtitle`
- `previous`
- `next`
- `returnTo`
- `resources`

Chaque ressource contient:

- `id`
- `title`
- `description`
- `category`
- `url`
- `qr`
- `status`

Une ressource sans URL ou avec `status: "coming_soon"` est affichee comme a venir et ne peut pas etre ouverte.

## Salles RV-014

### Carnets gratuits

Ecran: `e06_carnets`

Cette salle accueille:

- Carnet des Brumes;
- Carnet des Transitions Interieures;
- Carnet du Vol Libre;
- futurs carnets.

Les carnets sont actuellement declares comme `coming_soon`, faute d'URL reelle disponible dans le depot.

### Manifestes & Textes ouverts

Ecran: `e06_manifestes`

Cette salle accueille:

- Manifeste pour une litterature des possibles;
- Le Numerique est un recit;
- Statuts et pensees fondatrices;
- Vers une rehumanisation symbolique.

Le manifeste connu dans le depot est publie.
Les autres textes restent extensibles et peuvent recevoir leurs URLs plus tard.

### Oeuvres libres

Ecran: `e06_ressources_libres`

Cette salle accueille:

- Le Grand Bestiaire Anti-Agressivite;
- Guides;
- PDF et extraits;
- Ressources gratuites.

Le Grand Bestiaire devient un ouvrage de cette salle, au lieu d'etre ouvert directement depuis `Portes ouvertes`.

## Ajouter une future salle

Pour ajouter une salle:

1. ajouter une entree dans `data/library-extensions.json`;
2. ajouter une section HTML avec un `screenId` correspondant;
3. ajouter un conteneur avec le `containerId` declare;
4. renseigner les ressources dans le JSON.

Le moteur de navigation principal n'a pas besoin d'etre modifie.

## Philosophie

La Bibliotheque Vivante devient un reseau de territoires editoriaux.
Chaque salle reste un lieu, et chaque ressource devient une porte discrete vers un texte, un carnet, un PDF, une carte ou une future publication.
