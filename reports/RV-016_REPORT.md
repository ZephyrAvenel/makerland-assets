# RV-016 - Sous-bibliotheques comme salles independantes

## Resume

RV-016 supprime l'impression d'overlay dans les sous-bibliotheques.
Les salles `Carnets`, `Manifestes` et `Oeuvres libres` deviennent des pieces independantes de la Bibliotheque Vivante.

## Correction realisee

Le panneau immersif central a ete agrandi et rendu quasi opaque afin de remplacer visuellement le contenu principal.

Il masque desormais:

- les anciennes cartes;
- les anciens QR de fond;
- les boutons `Decouvrir` / `Entrer` dessines dans l'image;
- les titres et textes de la salle principale;
- les indicateurs bas de page de la Bibliotheque Vivante.

Le decor general reste present:

- arches;
- fenetres;
- ciel;
- ambiance doree;
- elements lateraux de bibliotheque.

## Navigation

Dans une sous-bibliotheque, seule l'action suivante est affichee:

`< Retour a la Bibliotheque principale`

Les boutons suivants ne sont plus generes dans ces salles:

- Salle precedente;
- Salle suivante;
- Fin de visite;
- pagination.

Ils reapparaissent normalement dans les salles principales.

## Transitions

Les sous-salles continuent d'utiliser le fade existant de `bookRenderer.js`.
Le comportement reste:

```text
clic porte
-> fondu
-> salle immersive
-> retour
-> fondu
-> Bibliotheque principale
```

## Fichiers modifies

- `css/bookRenderer.css`
- `js/bookRenderer.js`
- `reports/RV-016_REPORT.md`

## Fichiers non modifies

Aucun changement n'a ete apporte a:

- `Navigation`
- `NarrativeMemory`
- `LivingEcho`
- `ZoneRenderer`
- `app.js`
- `data/zones-v3-final-beta.json`
- `data/library-layout.json`
- `data/library-extensions.json`

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
- aucun doublon d'ID;
- aucun diff sur les fichiers interdits;
- aucun diff sur `library-layout.json`;
- aucun diff sur `library-extensions.json`.

## Responsive

Le panneau immersif couvre le contenu principal sur:

- Android portrait;
- Android paysage;
- iPhone;
- iPad;
- Desktop.

Les marges et safe areas restent conservees pour le bouton de retour.
