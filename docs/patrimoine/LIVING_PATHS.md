# Chemins Vivants

RV-101 introduit les Chemins Vivants : des parcours narratifs autonomes qui proposent une maniere d'habiter Makerland sans remplacer l'exploration libre.

Un chemin n'est pas une obligation. C'est une invitation.

## Philosophie

Makerland n'est pas un site que l'on consomme page apres page. C'est un territoire que l'on traverse selon une intention.

Les Chemins Vivants permettent au visiteur de choisir un rythme :

- decouvrir ;
- approfondir ;
- creer ;
- contempler ;
- transmettre.

Chaque chemin peut etre quitte a tout moment.

## Architecture

La couche est autonome :

- `js/livingPaths.js`
- `css/livingPaths.css`
- `data/living-paths.json`

Elle est chargee sur l'ecran `e08_constellation` et ne modifie aucun moteur global.

## Sources

Les chemins reutilisent :

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-mapping.json`
- les Grandes Constellations RV-100 ;
- la memoire locale `makerland:living-cycle`.

Aucun contenu nouveau n'est cree au runtime. Les etapes referencent uniquement des ressources deja presentes.

## Les cinq chemins

### Je decouvre

Premier passage. Il relie Accueil, Constellation, Archive Vivante, oeuvre, Bibliotheque et Carnet.

### J'approfondis

Chemin de retour. Il s'appuie sur la memoire locale et met en avant des ressources relationnelles.

### Je cree

Chemin des coulisses : Atelier IA, dialogues, cartographies, images, clarifications et evolutions.

### Je contemple

Chemin lent : oeuvre immersive, figures, images patrimoniales, citations, seuils et Constellation.

### Je transmets

Chemin des circulations : Bibliotheque, archives, articles, Constellation et Transmission.

## Memoire locale

Le module stocke uniquement dans le navigateur :

`makerland.living.paths`

Cette memoire conserve :

- chemins commences ;
- chemins termines ;
- etapes parcourues ;
- archives decouvertes ;
- oeuvres rencontrees ;
- concepts croises ;
- constellations visitees.

Aucune donnee n'est envoyee.

## Carte de progression

Chaque chemin affiche une progression simple :

`●────○────○────○────○`

Cette carte ne mesure pas une performance. Elle aide simplement le visiteur a savoir ou il se trouve dans son propre parcours.

## Variantes saisonnieres

Le module lit la saison courante via `makerland:living-cycle`.

- hiver : Contempler ;
- printemps : Creer ;
- ete : Decouvrir ;
- automne : Transmettre.

Cette preference ne force jamais le choix.

## Evolutions possibles

- Relier directement chaque etape aux pages d'archives HTML.
- Faire remonter les chemins dans le Carnet de Voyage.
- Proposer des variantes de chemins selon les Grandes Constellations explorees.
- Integrer les futurs objets NFC lorsque leurs relations seront cataloguees.

La regle demeure : les Chemins Vivants n'enferment pas. Ils ouvrent.
