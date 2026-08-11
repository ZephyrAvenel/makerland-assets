# RV-033 - Restaurer la navigation vivante et les retours de parcours

## Resume

RV-033 restaure les deux portes distinctes de la Boussole Vivante et ajoute un retour discret vers la Boussole sur les pages secondaires.

Aucun moteur n'a ete modifie : ZoneRenderer, Navigation, NarrativeMemory, LivingEcho et BookRenderer restent inchanges.

## Diagnostic de la regression

La redirection fautive provenait de `data/zones-v3-final-beta.json`.

L'ecran `e03_boussole` contenait encore une ancienne hitbox JSON :

- identifiant : `porte_principale`
- cible : `e05_cartes`
- coordonnees : `x:655`, `y:190`, `w:235`, `h:575`

Cette zone etait creee par ZoneRenderer au-dessus de la Boussole et interceptait des clics qui devaient revenir aux directions organiques HTML.

Resultat observe : `Decouvrir` pouvait ouvrir `e05_cartes`, comme `Explorer`.

La cause reelle n'etait donc pas Navigation ni le registre d'actions, mais une hitbox historique devenue redondante avec la Boussole organique.

## Correction appliquee

### Boussole

- `Explorer` conserve sa destination directe : `e05_cartes`.
- `Decouvrir` pointe de nouveau vers `e04_oeuvre`.
- La hitbox JSON `porte_principale` de `e03_boussole` a ete supprimee afin de ne plus intercepter les directions organiques.

### Retours de parcours

Un bouton discret `Retour a la Boussole Vivante` a ete ajoute sur les pages secondaires :

- `e05_cartes`
- `e06_fiction`
- `e06_essais`
- `e06_atlas`
- `e06_portes`
- `e06_carnets`
- `e06_manifestes`
- `e06_ressources_libres`
- `e07_atelier`
- `e08_constellation`
- `e09_voyage`

Le passage de l'Arche (`e04_oeuvre`) n'a pas ete modifie afin de conserver son fonctionnement propre.

## Cartographie finale verifiee

```text
Explorer
  -> e05_cartes
  -> Passage Vivant Atlas
  -> https://zephyravenel.github.io/atlas-recits-vivants/

Decouvrir
  -> e04_oeuvre
  -> Passage de l'Arche
  -> Oeuvre immersive

Creer
  -> e07_atelier

Contempler
  -> e04_oeuvre
  -> Passage de l'Arche
  -> Oeuvre immersive

Trouver un repere
  -> e08_constellation
```

## Fichiers modifies

- `index.html`
- `data/zones-v3-final-beta.json`
- `js/app.js`
- `css/style.css`
- `docs/LIVING_COMPASS_MAP.md`
- `reports/RV-033_REPORT.md`

## Validation

- Verification des destinations `data-target-screen` des cinq directions.
- Verification que `e03_boussole` ne contient plus de hitbox JSON obsolete.
- Verification JSON.
- Verification syntaxique de `js/app.js`.
- Verification `git diff --check`.

## Limites

Les tests visuels Android portrait, Android paysage et Desktop doivent etre confirmes dans un navigateur reel ou via GitHub Pages apres deploiement.
