# Library Visual Polish

## Objectif

RV-012 apporte une finition artistique a la Bibliotheque Vivante.
La mission ne modifie pas la structure du moteur, le systeme de slots relatifs, la calibration responsive ou la navigation.

Les changements concernent uniquement:

- les miniatures Atlas utilisees dans la bibliotheque;
- les micro-interactions visuelles des couvertures;
- la reaction discrete du QR associe.

## Miniatures Atlas

Les fichiers originaux restent inchanges:

- `covers/atlas1.jpg`
- `covers/atlas2.jpg`

Deux variantes optimisees pour l'affichage en petite taille ont ete creees:

- `covers/atlas1-library.jpg`
- `covers/atlas2-library.jpg`

Traitement applique:

- luminosite legerement augmentee;
- contraste modere;
- saturation legerement renforcee;
- nettete legerement augmentee.

Ces variantes conservent l'identite graphique originale, mais rendent les textes et lignes plus lisibles dans les cadres de la Bibliotheque Vivante.

## Interaction des couvertures

Les couvertures repondent maintenant au survol, au focus clavier et au toucher par:

- une montee de quelques pixels;
- un agrandissement limite a 2,5 %;
- un halo dore doux;
- une transition fluide de 260 ms.

Les animations utilisent uniquement:

- `transform`;
- `filter`;
- `opacity`.

Elles ne changent ni la position calculee ni les dimensions des slots.

## QR associe

Lorsqu'une couverture devient active, son QR associe recoit:

- une luminosite tres legerement augmentee;
- un halo tres discret.

Le QR reste secondaire et ne devient jamais un element dominant.

## Classes concernees

Les styles s'appuient sur les classes existantes:

- `.living-library-cover-button`
- `.living-library-volume-opening`
- `.living-library-qr-button`
- `.living-library-volume`

Aucune nouvelle architecture CSS n'est introduite.

## Respect de la calibration

`data/library-layout.json` n'est pas modifie par RV-012.
Les emplacements de couvertures, QR et boutons restent entierement pilotes par les calibrations RV-009, RV-010 et RV-011.

## Bonne pratique future

Pour ameliorer une miniature sans alterer un original:

1. creer une variante dediee dans `covers/`;
2. conserver le fichier original;
3. pointer la ressource concernee vers la variante;
4. ne pas modifier `library-layout.json` pour une simple finition visuelle.
