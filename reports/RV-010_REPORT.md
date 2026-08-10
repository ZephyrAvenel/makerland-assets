# RV-010 - Calibration visuelle de la Bibliotheque Vivante

## Resume

RV-010 calibre les emplacements relatifs de la Bibliotheque Vivante afin que les couvertures, QR et zones de navigation correspondent aux cadres dessines dans les quatre illustrations existantes.

Le moteur RV-009 reste en place.
La mission a ete traitee comme une calibration de donnees, avec un ajustement CSS mineur pour eviter les doubles bordures dynamiques.

## Fichiers modifies

- `data/library-layout.json`
- `css/bookRenderer.css`

## Fichiers crees

- `docs/LIBRARY_CALIBRATION.md`
- `reports/RV-010_REPORT.md`

## Fichiers non modifies

Conformement aux contraintes, aucun changement n'a ete apporte a:

- `js/bookRenderer.js`
- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/app.js`
- `data/zones-v3-final-beta.json`

## Calibration par salle

### Fictions symboliques

- Trois emplacements de couvertures cales sur les cadres de livres dessines.
- Trois QR cales sur les cadres pointilles sous les textes.
- Navigation suivante placee sur la zone basse droite existante.

### Essais

- Trois emplacements de couvertures cales sur les cadres de livres dessines.
- Trois QR cales sur les cadres pointilles.
- Navigation precedente et suivante visibles dans les zones basses laterales.

### Atlas

- Deux couvertures dynamiques calees sur les deux ressources existantes dans `data/livres-v2.json`.
- Deux QR cales sur les cadres pointilles des deux premieres cartes.
- La troisieme carte illustree reste disponible pour un futur atlas, sans modification de contenu dans cette mission.

### Portes ouvertes

- Les zones interactives de couverture sont alignees sur les boutons `ENTRER` dessines.
- Les QR sont cales dans les cadres illustres au-dessus de chaque bouton.
- Les titres de remplacement des ressources sans couverture image sont masques par un ajustement CSS mineur afin de ne pas polluer l'illustration.

## Ajustements CSS mineurs

- Suppression des bordures et effets decoratifs dynamiques autour des couvertures.
- Suppression de la bordure dynamique des QR.
- Masquage visuel des couvertures de remplacement lorsqu'une ressource ne possede pas d'image.

Ces ajustements permettent de laisser les cadres de l'illustration porter l'identite visuelle.

## Validation responsive

Validation par calcul des boites d'affichage sur:

- Desktop: 1440 x 900
- iPad: 1024 x 768
- Android portrait: 393 x 852
- Android paysage: 852 x 393

Resultat:

- aucune couverture ne sort du viewport;
- aucun QR ne sort du viewport;
- les boutons `Salle precedente`, `Salle suivante` et `Terminer la visite` restent visibles;
- aucune regle responsive specifique par appareil n'a ete ajoutee.

## Verifications techniques

- `node --check js/bookRenderer.js`: OK
- JSON parse:
  - `data/library-layout.json`: OK
  - `data/livres-v2.json`: OK
  - `data/zones-v3-final-beta.json`: OK
- Diff verifie:
  - aucun changement sur les moteurs interdits;
  - calibration limitee a `library-layout.json`;
  - CSS limite aux ajustements visuels de la bibliotheque.

## Note sur le contenu reel

Les illustrations actuelles montrent trois grands emplacements dessines pour `fiction` et `essais`, alors que `data/livres-v2.json` contient quatre ressources pour chacune de ces categories.

RV-010 ne modifie ni le contenu ni le renderer.
La calibration respecte donc les cadres visibles dans les images.
Une future extension pourra ajouter un quatrieme emplacement via une nouvelle illustration ou une evolution fonctionnelle dediee.

## Apercus de controle

Des overlays de calibration ont ete generes hors depot dans:

`outputs/rv-010-calibration-overlays`

Ils montrent:

- couvertures en vert;
- QR en bleu;
- navigation en rouge.

Ces fichiers ne sont pas ajoutes au depot.
