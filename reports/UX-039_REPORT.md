# UX-039 — Les lieux fondateurs de l'Institut Culturel Imaginaire

## Objectif

Restreindre la présence du Sceau officiel des Récits Vivants aux lieux fondateurs :

- Accueil ;
- Carnet du Voyageur ;
- Boussole Vivante ;
- Forêt de l'Arche.

Le sceau ne doit plus apparaître comme un logo généralisé dans toutes les salles.

## Fichiers modifiés

- `js/rvSeal.js`
- `js/firstJourney.js`
- `js/livingNotebook.js`
- `carnet/index.html`
- `css/style.css`
- `css/placeholder.css`
- `css/livingNotebook.css`

## Corrections réalisées

### Restriction des injections automatiques

`js/rvSeal.js` n'ajoute plus automatiquement le sceau dans :

- Atelier des Récits ;
- Archives Vivantes ;
- Constellation ;
- Bibliothèque Vivante ;
- Cartes Narratives.

Le composant conserve uniquement les injections d'écran pour :

- `e03_boussole` ;
- `e04_oeuvre`.

L'Accueil conserve son emplacement déclaratif existant :

- `data-rv-seal="home"`.

### Premier Voyage

Les sceaux qui apparaissaient dans :

- la page intermédiaire du Premier Voyage ;
- le Passeport du Voyageur ;
- le filigrane du Passeport ;

ont été supprimés afin de respecter la règle de rareté.

Le sceau de la Forêt de l'Arche est conservé, car ce lieu fait partie des quatre lieux fondateurs demandés.

### Carnet du Voyageur

Le Carnet Vivant utilise désormais le composant partagé `RVSeal.create()` au lieu d'images directes.

Le chemin d'asset du composant `rvSeal.js` a été rendu compatible avec les pages du Carnet.

### Boussole Vivante

Le sceau de la Boussole est conservé et légèrement renforcé :

- positionné en haut du territoire ;
- taille légèrement augmentée ;
- halo respirant discret ;
- respect de `prefers-reduced-motion`.

### Forêt de l'Arche

Le sceau de la Forêt est conservé avec un rendu plus intégré au paysage :

- position ajustée ;
- opacité réduite ;
- `mix-blend-mode: soft-light` ;
- traitement visuel plus proche d'une marque ancienne que d'un logo posé ;
- halo lent et discret ;
- respect de `prefers-reduced-motion`.

## Présence finale du sceau

Présent :

- Accueil ;
- Carnet du Voyageur ;
- Boussole Vivante ;
- Forêt de l'Arche.

Supprimé / non injecté :

- Bibliothèque Vivante ;
- Atelier des Récits ;
- Cartes Narratives ;
- Constellation ;
- Archives Vivantes ;
- pages D001 à D010 ;
- autres salles autonomes.

## Validations

- `node --check js/rvSeal.js` : OK
- `node --check js/firstJourney.js` : OK
- `node --check js/livingNotebook.js` : OK
- recherche des anciennes variantes non fondatrices : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK

## Note

La validation visuelle fine sur tablette et mobile devra être confirmée dans le navigateur cible. Les positions CSS ont été limitées aux écrans existants et ne modifient aucune navigation ni aucun moteur.
