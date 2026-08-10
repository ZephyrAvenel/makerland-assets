# Library Layout

## Objectif

`data/library-layout.json` decrit les emplacements relatifs de la Bibliotheque Vivante.

Le rendu ne depend plus de regles par appareil.
Chaque salle indique:

- la zone utile;
- les slots de couvertures;
- les slots de QR;
- les positions de navigation.

Toutes les valeurs sont exprimees en pourcentage.
Aucune coordonnee de slot n'est exprimee en pixels.

## Structure

```json
{
  "rooms": {
    "fiction": {
      "contentZone": {
        "left": 17,
        "top": 24,
        "width": 66,
        "height": 64
      },
      "navigation": {
        "previous": null,
        "next": {
          "x": 86,
          "y": 82,
          "w": 22,
          "h": 10
        }
      },
      "slots": [
        {
          "cover": { "x": 4, "y": 18, "w": 14, "h": 34 },
          "qr": { "x": 8.5, "y": 56, "w": 5.2, "h": 5.2 }
        }
      ]
    }
  }
}
```

## Repere de calcul

`contentZone` est exprimee en pourcentage de l'image visible, c'est-a-dire la zone calculee par `object-fit: contain`.

Les slots sont exprimes en pourcentage de `contentZone`.

Formule:

```text
cover.left = zone.left + slot.cover.x / 100 * zone.width
cover.top = zone.top + slot.cover.y / 100 * zone.height
cover.width = slot.cover.w / 100 * zone.width
cover.height = slot.cover.h / 100 * zone.height
```

La meme logique est appliquee aux QR.

Dans l'implementation CSS, `contentZone` est placee relativement a l'image visible.
Les enfants sont ensuite positionnes en pourcentage dans cette zone.

## Couvertures

Les couvertures remplissent exactement leur cadre:

```css
object-fit: cover;
object-position: center;
```

Le cadre garde sa taille relative.
L'image peut etre legerement recadree, mais elle n'est pas deformee.

## QR

Les QR restent entierement visibles:

```css
object-fit: contain;
object-position: center;
```

## Navigation

Les boutons de navigation sont eux aussi decrits dans `library-layout.json`.
Ils sont positionnes dans le meme repere que les slots, relativement a `contentZone`.

Une valeur `x` negative ou superieure a `100` permet de placer un bouton juste a l'exterieur de la zone utile tout en restant attache a elle.

## Ajouter une salle

Pour ajouter une salle:

1. ajouter la salle dans `Books.rooms`;
2. ajouter une entree du meme nom de categorie dans `data/library-layout.json`;
3. renseigner `contentZone`;
4. renseigner les slots `cover` et `qr`;
5. renseigner `navigation`.

Le moteur de rendu n'a pas besoin d'etre modifie pour changer les positions.

## Regles

- Pas de positions de couvertures en pixels.
- Pas de `if mobile`.
- Pas de `if tablette`.
- Pas de `if paysage`.
- Pas de media query responsive specifique a la Bibliotheque.
- Les corrections se font dans `library-layout.json`.

