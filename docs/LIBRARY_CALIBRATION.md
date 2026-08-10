# Library Calibration

## Objectif

RV-010 finalise la calibration visuelle de la Bibliotheque Vivante.
Le moteur relatif introduit par RV-009 reste inchangé.
La mission consiste a renseigner les coordonnees qui font correspondre les elements dynamiques aux cadres dessines dans les illustrations.

## Repere

`data/library-layout.json` utilise l'image visible comme repere principal.
Chaque salle declare une `contentZone` couvrant l'image visible:

```json
{
  "left": 0,
  "top": 0,
  "width": 100,
  "height": 100
}
```

Les slots `cover`, `qr` et `navigation` sont donc exprimes directement en pourcentage de l'illustration affichee.
Le renderer transforme ensuite ces pourcentages en positions responsives grace aux variables globales de l'image en `object-fit: contain`.

## Couvertures

Les couvertures sont placees sur les grands cadres de livres dessines.
Elles utilisent:

- `object-fit: cover`;
- `object-position: center`;
- aucune bordure dynamique additionnelle.

L'objectif est que le cadre dore reste celui de l'illustration, sans double encadrement visuel.

## QR

Les QR sont places dans les emplacements pointilles prevus sous les livres ou dans les cadres visuels des ressources.
Ils utilisent:

- `object-fit: contain`;
- `object-position: center`;
- un fond blanc simple;
- aucune bordure dynamique additionnelle.

## Portes ouvertes

La salle `portes_ouvertes` ne contient pas de couvertures de livres au sens classique.
Ses cartes possedent deja des pictogrammes et des boutons `ENTRER` dans l'image.

Pour respecter l'illustration:

- les zones de couverture servent de zones interactives sur les boutons `ENTRER`;
- les titres de remplacement des ressources sans image sont rendus invisibles par le CSS;
- les QR sont places dans les cadres illustres au-dessus des boutons.

## Limite issue du contenu reel

Les images actuelles affichent trois grands emplacements dessines dans les salles `fiction`, `essais` et `atlas`.
Le fichier `data/livres-v2.json` contient quatre ressources pour `fiction` et quatre pour `essais`.

RV-010 ne modifie ni le contenu ni `bookRenderer.js`.
La calibration privilegie donc les emplacements visibles dans l'illustration.
Ajouter plus de ressources visibles demandera soit une nouvelle illustration avec plus de cadres, soit une evolution fonctionnelle ulterieure.

## Ajuster une coordonnee

Chaque slot suit ce format:

```json
{
  "cover": { "x": 22.45, "y": 19.2, "w": 11.9, "h": 23.8 },
  "qr": { "x": 24.75, "y": 58.25, "w": 7.1, "h": 8.9 }
}
```

- `x`: position horizontale du coin superieur gauche.
- `y`: position verticale du coin superieur gauche.
- `w`: largeur.
- `h`: hauteur.

Toutes les valeurs sont en pourcentage de l'image visible.

## Bonnes pratiques

- Ajuster uniquement `data/library-layout.json` pour une nouvelle calibration.
- Ne pas ajouter de regles par appareil.
- Ne pas modifier le renderer pour corriger un decalage visuel.
- Comparer les slots aux illustrations originales avant validation.
- Conserver les QR entierement visibles.
