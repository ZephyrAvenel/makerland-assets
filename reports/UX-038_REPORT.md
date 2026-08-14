# UX-038 — Le Carnet Vivant

## Objectif

Transformer la section des paroles des Gardiens en un objet de lecture : un carnet ancien, composé d'une couverture et de pages.

La mission conserve les données UX-037 et ne modifie pas le stockage existant.

## Fichiers créés

- `js/livingNotebook.js`
- `css/livingNotebook.css`
- `reports/UX-038_REPORT.md`

## Fichiers modifiés

- `carnet/index.html`

## Architecture

Le composant `LivingNotebook` lit directement :

- `makerland.guardianEncounters.v1`

Il ne crée pas de nouvelle mémoire de rencontres.

Il ajoute seulement une mémoire locale technique légère :

- `makerland.livingNotebook.opened`

Cette clé sert uniquement à jouer l'ouverture de la couverture une première fois.

## Rendu

Le Carnet affiche désormais :

- une couverture sobre ;
- le Sceau des Récits Vivants ;
- le titre `Carnet du Voyageur` ;
- le sous-titre `Récits Vivants` ;
- des pages papier ivoire ;
- un en-tête discret avec sceau, titre, lieu et date ;
- le murmure du Gardien ;
- un lien `Revenir dans ce territoire` ;
- des pages blanches si peu de rencontres existent.

## Interactions

Desktop :

- flèches gauche/droite ;
- clavier avec `ArrowLeft` et `ArrowRight` ;
- glissement horizontal.

Mobile :

- glissement horizontal ;
- boutons discrets.

L'animation de page reste volontairement légère :

- durée courte ;
- pas de 3D spectaculaire ;
- simple impression de feuille.

## Contraintes respectées

- Stockage UX-037 conservé.
- Aucune donnée serveur.
- Aucune navigation globale modifiée.
- Aucun BookRenderer modifié.
- Aucun ZoneRenderer modifié.
- Aucun JSON métier modifié.
- Aucun vocabulaire de progression, collection, badge ou score.

## Validations

- `node --check js/livingNotebook.js` : OK
- `node --check carnet/carnet.js` : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK

## Note

Le Carnet conserve les autres sections existantes sous la vue vivante. Cette mission transforme la mémoire des Gardiens en premier objet-carnet, sans supprimer les traces déjà présentes dans le Carnet de Voyage.
