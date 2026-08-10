# RV-015 - Transformation des sous-bibliotheques en salles immersives

## Resume

RV-015 finalise l'immersion des sous-bibliotheques issues de `Portes ouvertes`.

Les sous-bibliotheques ne doivent plus donner l'impression d'une fenetre superposee.
Elles deviennent des pieces a part entiere de la Bibliotheque Vivante:

- Carnets gratuits;
- Manifestes & Textes ouverts;
- Oeuvres libres.

## Correction realisee

Les sous-salles RV-014 etaient deja des ecrans distincts.
La limite venait du fond visuel reutilise: les anciennes cartes, QR et textes de la salle principale restaient perceptibles dans l'image de fond.

RV-015 ajoute une scene centrale immersive qui:

- couvre les anciennes cartes;
- couvre les anciens QR de fond;
- couvre les anciens textes de la salle precedente;
- conserve les arches, fenetres, dorures et ambiance generale;
- reste integree a la Bibliotheque Vivante, sans effet de popup.

## Architecture

`data/library-extensions.json` reste l'unique source de donnees des sous-bibliotheques.

Le renderer lit automatiquement:

- titre;
- sous-titre;
- description;
- ressources;
- URLs;
- QR;
- etat `coming_soon`.

Aucun contenu de salle n'est code en dur dans le CSS ou le HTML.
Le CSS ne definit que l'ambiance visuelle et la disposition immersive.

## Navigation

Les sous-salles conservent:

- la transition fade existante;
- Salle precedente;
- Salle suivante lorsque disponible;
- `< Retour a la Bibliotheque principale`.

Le retour recharge `e06_portes`.
`Navigation` n'a pas ete modifie.

## Fichiers modifies

- `css/bookRenderer.css`
- `js/bookRenderer.js`
- `reports/RV-015_REPORT.md`

## Fichiers non modifies

Aucun changement n'a ete apporte a:

- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/zoneRenderer.js`
- `js/app.js`
- `data/zones-v3-final-beta.json`
- `data/library-layout.json`
- `data/library-extensions.json`

## Responsive

Les sous-salles utilisent une scene centrale adaptee a:

- Android portrait;
- Android paysage;
- iPhone;
- iPad;
- Desktop.

En mobile portrait, la scene occupe la largeur visible pour eviter l'effet de modal.
En mobile paysage, elle est resserree verticalement et conserve la navigation accessible.

## Validation

Verifications effectuees:

- `node --check js/bookRenderer.js`: OK
- JSON parse:
  - `data/livres-v2.json`: OK
  - `data/library-layout.json`: OK
  - `data/library-extensions.json`: OK
  - `data/zones-v3-final-beta.json`: OK
- chaque `targetScreen` de `Portes ouvertes` existe;
- chaque sous-salle possede son conteneur;
- aucun doublon d'ID de ressource;
- aucun diff sur les moteurs interdits;
- aucun diff sur `library-layout.json`;
- aucune modification de `library-extensions.json`.

## Resultat attendu

Le visiteur ne voit plus simultanement la salle principale et une fenetre superposee.
Il entre dans une nouvelle piece de la Bibliotheque Vivante, avec un contenu central propre et une navigation continue.
