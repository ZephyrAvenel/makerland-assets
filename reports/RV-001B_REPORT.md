# RV-001B - Restaurer le point d'entree visible

## Objectif

Restaurer un point d'entree visible sur `e01_accueil` sans quitter l'architecture RV-001:

- `ZoneRenderer` reste le moteur unique des interactions;
- les zones restent pilotees par `data/zones-v3-final-beta.json`;
- aucun bouton HTML independant n'est ajoute;
- `UIRenderer` n'est pas reutilise comme moteur d'interaction;
- `DEBUG_ZONES` reste a `false`.

## Diagnostic

RV-001A avait corrige l'alignement des hitboxes avec les images affichees en `object-fit: contain`. L'accueil redevenait techniquement cliquable, mais le visiteur ne voyait plus de point d'entree explicite parce que les zones etaient volontairement invisibles en production.

Aucune anomalie supplementaire bloquante n'a ete detectee avant correction.

## Correction appliquee

La zone JSON `e01_accueil.zones.entrer` declare maintenant son rendu visuel:

- `render.type`: `button`;
- `render.label`: `✦ Entrer`;
- `render.variant`: `glass`.

`ZoneRenderer` lit cette declaration et cree un rendu graphique enfant dans la hitbox existante. Le visuel et la zone interactive partagent donc le meme rectangle, le meme calcul responsive et le meme listener generique.

Le CSS ajoute un rendu glass leger:

- fond translucide;
- bordure claire;
- flou de fond;
- ombre douce;
- animation hover;
- effet active/touch.

## Fichiers modifies

- `data/zones-v3-final-beta.json`
- `js/zoneRenderer.js`
- `css/style.css`

## Fichiers crees

- `reports/RV-001B_REPORT.md`

## Captures

- `outputs/RV-001B_CAPTURE_PC.png`
- `outputs/RV-001B_CAPTURE_SMARTPHONE.png`

## Validations

- JavaScript: `node --check js/zoneRenderer.js`.
- JavaScript: `node --check js/uiRenderer.js`.
- JSON: parsing de `data/zones-v3-final-beta.json`.
- Verification que `DEBUG_ZONES = false`.
- Verification qu'aucun ancien `.ui-button`, `.meteo-panel` ou `renderMeteo` n'est reintroduit.
- PC: accueil, clic sur `✦ Entrer`, meteo, boussole.
- Tablette: accueil, clic sur `✦ Entrer`, meteo, boussole.
- Smartphone portrait: accueil, toucher sur `✦ Entrer`, meteo, boussole.
- Smartphone paysage: accueil, toucher sur `✦ Entrer`, meteo, boussole.

## Conclusion

Le point d'entree visible est restaure sans retour a l'ancien systeme. La zone `entrer` reste une zone JSON rendue et pilotee par `ZoneRenderer`.
