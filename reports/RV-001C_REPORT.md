# RV-001C - Generalisation du rendu des zones interactives

## Objectif

Finaliser la migration vers `ZoneRenderer` en permettant au moteur de rendre automatiquement toute zone interactive declaree avec un `label` dans `data/zones-v3-final-beta.json`.

## Verification du JSON

Les cinq zones de `e02_meteo` possedent maintenant leur geometrie, leur label, leur action et leur cible:

- `eclaircie`: `☀ Éclaircie`, `goto`, `e03_boussole`
- `transition`: `🌤 Transition`, `goto`, `e03_boussole`
- `je_ne_sais_pas`: `❓ Je ne sais pas`, `goto`, `e03_boussole`
- `brouillard`: `🌫 Brouillard`, `goto`, `e03_boussole`
- `tempete`: `⛈ Tempête`, `goto`, `e03_boussole`

La zone `entrer` utilise aussi le format explicite `label`, `action: "goto"` et `target`.

## Correction appliquee

`ZoneRenderer` ne depend plus de `render.label`. Il cree un rendu visuel pour toute zone contenant un champ `label`, quel que soit l'ecran.

Le moteur accepte egalement le format d'action explicite:

```json
{
  "label": "☀ Éclaircie",
  "action": "goto",
  "target": "e03_boussole"
}
```

Les anciens formats restent compatibles pour les zones non modifiees.

## Rendu graphique

Le style glass introduit pour `✦ Entrer` est conserve et reutilise par les zones meteo:

- fond translucide;
- coins arrondis;
- leger flou;
- ombre douce;
- texte centre;
- effet hover;
- effet active/touch;
- dimensionnement responsive base sur le scale calcule par `ZoneRenderer`.

Le visuel est cree comme enfant de la hitbox `.makerland-zone`. Le rendu graphique et la zone cliquable partagent donc le meme rectangle.

## Nettoyage

- Suppression du lien vers `css/uiRenderer.css`.
- Suppression du fichier `css/uiRenderer.css`, devenu inutilise.
- Aucun retour de `renderMeteo`.
- Aucun retour de `.meteo-panel`.
- Aucun retour de `.ui-button`.
- Aucun branchement specifique du type `if (screen === "e02_meteo")` n'a ete ajoute.

`UIRenderer` reste uniquement un point d'extension minimal, sans rendu meteo.

## Fichiers modifies

- `data/zones-v3-final-beta.json`
- `js/zoneRenderer.js`
- `css/style.css`
- `index.html`

## Fichier supprime

- `css/uiRenderer.css`

## Fichier cree

- `reports/RV-001C_REPORT.md`

## Captures

- `outputs/RV-001C_CAPTURE_PC.png`
- `outputs/RV-001C_CAPTURE_TABLET.png`
- `outputs/RV-001C_CAPTURE_SMARTPHONE_PORTRAIT.png`
- `outputs/RV-001C_CAPTURE_SMARTPHONE_LANDSCAPE.png`

## Validations

- `node --check js/zoneRenderer.js`
- `node --check js/uiRenderer.js`
- parsing de `data/zones-v3-final-beta.json`
- verification des cinq zones meteo dans le JSON
- verification `DEBUG_ZONES = false`
- verification DOM: 5 zones meteo, 5 rendus visuels, 0 `.ui-button`
- verification de synchronisation `elementFromPoint` au centre de chaque zone
- PC: accueil → `✦ Entrer` → meteo → chaque choix meteo → boussole
- tablette: accueil → `✦ Entrer` → meteo → chaque choix meteo → boussole
- smartphone portrait: accueil → `✦ Entrer` → meteo → chaque choix meteo → boussole
- smartphone paysage: accueil → `✦ Entrer` → meteo → chaque choix meteo → boussole

## Anomalies observees

Aucune anomalie applicative supplementaire n'a ete detectee. Les logs navigateur ont affiche un bruit reseau interne Statsig lie a l'environnement de test, sans impact sur Makerland.
