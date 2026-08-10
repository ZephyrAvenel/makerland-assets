# RV-001A - Diagnostic et correction de la page d'accueil

## Diagnostic precis

La regression ne venait pas du chargement JSON ni de l'absence de zones DOM. Le fichier `data/zones-v3-final-beta.json` etait bien charge, et l'ecran `e01_accueil` contenait bien une zone:

- `entrer`

La chaine applicative etait active:

1. `Navigation.goTo("e01_accueil")`
2. emission de `screenChanged`
3. appel de `ZoneRenderer.render("e01_accueil")`
4. creation de `.makerland-zone[data-id="entrer"]`
5. attachement du listener `click`
6. navigation attendue vers `e02_meteo`

La rupture etait geometrique: `ZoneRenderer` calculait les hitboxes sur toute la surface de l'ecran, alors que les images d'ecran utilisent `object-fit: contain`. En particulier sur smartphone portrait, l'image visible est centree verticalement avec des marges. La hitbox existait, mais elle etait positionnee trop bas par rapport au bouton visible.

## Fichier responsable

- `js/zoneRenderer.js`

## Correction appliquee

`ZoneRenderer` calcule maintenant les zones dans le rectangle reel de contenu de l'image `contain`, avec un facteur d'echelle uniforme:

- calcul du scale `min(width / BASE_WIDTH, height / BASE_HEIGHT)`;
- calcul des marges horizontales ou verticales;
- positionnement des zones dans ce rectangle utile;
- conservation de `DEBUG_ZONES = false` avant commit.

Aucun bouton HTML meteo n'a ete reintroduit. `UIRenderer` n'a pas ete restaure comme moteur d'interaction.

## Comptages verifies

Sur `e01_accueil`:

- zones JSON: 1;
- div `.makerland-zone`: 1;
- listeners attendus: 1, via `attachAction()` appele une fois par zone creee.

Apres interaction vers `e02_meteo`:

- div `.makerland-zone`: 5;
- zones trouvees: `eclaircie`, `transition`, `je_ne_sais_pas`, `brouillard`, `tempete`.

## Validations

- JavaScript: `node --check js/zoneRenderer.js`.
- JSON: parsing de `data/zones-v3-final-beta.json`.
- CSS: aucun retour de `.ui-button` ou `.meteo-panel`.
- Debug: `DEBUG_ZONES = true` teste temporairement, zone orange visible; remis a `false`.
- PC: accueil, clic sur Entrer, meteo OK.
- Smartphone portrait: tap au centre visible de Entrer, meteo OK.
- Smartphone paysage: tap au centre visible de Entrer, meteo OK.

## Limitation

Le projet ne fournit pas de suite de tests automatisee. Les validations ont ete realisees par inspection DOM et interaction navigateur locale.
