# UX-040 — Remplacement du médaillon d'accueil par le Sceau officiel

## Objectif

Remplacer uniquement le symbole situé sur l'écran d'accueil, au-dessus du titre `Les Récits Vivants`.

Le composant partagé `RVSeal` n'a pas été modifié.

## Fichier générant la page d'accueil

L'écran d'accueil est généré par :

- `index.html`

Élément remplacé :

- ancien emplacement : `index.html`, lignes 70 à 73 avant modification ;
- nouvel élément : `index.html`, lignes 71 à 74 après modification.

## Modification appliquée

Avant :

```html
<span
    class="entry-intro-emblem"
    data-rv-seal="home"></span>
```

Après :

```html
<img
    class="entry-intro-emblem"
    src="assets/logo_rv.png"
    alt="Sceau officiel de l'Institut Culturel Imaginaire">
```

## Style ajusté

Fichier modifié :

- `css/style.css`

Sélecteur :

- `.entry-intro-emblem`

L'emblème d'accueil utilise maintenant :

- largeur desktop : `clamp(104px, calc(var(--screen-content-width) * .105), 120px)` ;
- largeur mobile : `clamp(90px, calc(var(--screen-content-width) * .18), 104px)` ;
- rendu circulaire pour éviter l'affichage du fond carré de l'asset ;
- `object-fit: contain` pour conserver le logo complet.

## Vérification de l'ancien médaillon

La référence suivante n'existe plus dans `index.html` :

```html
data-rv-seal="home"
```

Le composant `RVSeal` n'est donc plus responsable du symbole d'accueil.

## Asset utilisé

- `assets/logo_rv.png`

Contrôle local :

- dimensions : `1280 x 1280`
- format : `Format24bppRgb`

Note : l'asset disponible ne contient pas de canal alpha. Le masque circulaire CSS évite donc l'apparition du carré sombre sans modifier l'image source.

## Capture

Capture après modification :

- `reports/UX-040_HOME_AFTER.png`

La capture montre le Sceau officiel placé au-dessus du titre principal.

## Périmètre respecté

Non modifiés :

- `js/rvSeal.js`
- Carnet Vivant
- Boussole Vivante
- Forêt de l'Arche
- autres salles

## Validations

- ancien `data-rv-seal="home"` absent de `index.html` : OK
- `assets/logo_rv.png` référencé directement au-dessus du titre : OK
- capture d'accueil générée : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK
