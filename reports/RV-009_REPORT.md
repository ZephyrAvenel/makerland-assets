# RV-009 - Bibliotheque Vivante a emplacements relatifs

## Resume

La Bibliotheque Vivante utilise maintenant un systeme de slots relatifs.
Les couvertures, les QR et les boutons de navigation ne sont plus places par des regles CSS specifiques aux appareils.

Le rendu est pilote par:

- `data/library-layout.json`;
- `js/bookRenderer.js`;
- `css/bookRenderer.css`.

Aucune modification n'a ete apportee a `ZoneRenderer`, `Navigation`, `NarrativeMemory`, `LivingEcho`, la Boussole, la meteo ou `data/zones-v3-final-beta.json`.

## Architecture realisee

Chaque salle declare une `contentZone` exprimee en pourcentage de l'image visible.
Cette image visible correspond au repere deja expose par les variables CSS globales:

- `--screen-content-left`;
- `--screen-content-top`;
- `--screen-content-width`;
- `--screen-content-height`.

Les slots de couvertures, QR et navigation sont ensuite exprimes en pourcentage de cette zone utile.

Le calcul suit le principe:

```text
zone.left = image.left + contentZone.left / 100 * image.width
slot.left = zone.left + slot.x / 100 * zone.width
```

La meme logique s'applique a `top`, `width` et `height`.

## Fichiers crees

- `data/library-layout.json`
- `docs/LIBRARY_LAYOUT.md`
- `reports/RV-009_REPORT.md`

## Fichiers modifies

- `js/bookRenderer.js`
- `css/bookRenderer.css`

## Ajustements principaux

- Chargement de `data/library-layout.json` en meme temps que `data/livres-v2.json`.
- Creation d'une `living-library-content-zone` calculee depuis l'image affichee en `object-fit: contain`.
- Rendu des couvertures et des QR depuis les slots relatifs.
- Suppression des grilles et des media queries specifiques a la bibliotheque.
- Navigation de salle positionnee relativement a la zone utile.
- Couvertures en `object-fit: cover` et `object-position: center`.
- QR en `object-fit: contain` et `object-position: center`.

## Validation responsive

Validation par calcul des boites d'affichage sur les formats suivants:

- Desktop: 1440 x 900
- iPad: 1024 x 768
- Android portrait: 393 x 852
- Android paysage: 852 x 393
- Petit paysage: 667 x 375
- Grand paysage: 1366 x 768

Resultat:

- toutes les couvertures restent dans le viewport;
- tous les QR restent dans le viewport;
- les boutons `Salle precedente`, `Salle suivante` et `Terminer la visite` restent visibles;
- aucun slot ne depend d'une condition mobile, tablette, portrait ou paysage.

## Verifications techniques

- `node --check js/bookRenderer.js`: OK
- JSON parse:
  - `data/library-layout.json`: OK
  - `data/livres-v2.json`: OK
  - `data/zones-v3-final-beta.json`: OK
- Correspondance livres / slots:
  - `fiction`: 4 livres / 4 slots
  - `essais`: 4 livres / 4 slots
  - `atlas`: 2 livres / 2 slots
  - `portes_ouvertes`: 3 livres / 3 slots
- Scan des fichiers bibliotheque:
  - pas de `if mobile`;
  - pas de `if tablette`;
  - pas de `if paysage`;
  - pas de `matchMedia`;
  - pas de logique responsive JavaScript.

## Limitations

Les coordonnees de `library-layout.json` restent une premiere calibration relative.
Elles sont maintenant centralisees et pourront etre ajustees sans modifier le moteur.

## Recommandations

- Ajuster uniquement `data/library-layout.json` si une future illustration de salle change.
- Ajouter une nouvelle salle en declarant ses slots dans le JSON, puis en l'ajoutant a la liste des salles du renderer.
- Conserver le principe: aucune correction responsive specifique par appareil dans le moteur.
