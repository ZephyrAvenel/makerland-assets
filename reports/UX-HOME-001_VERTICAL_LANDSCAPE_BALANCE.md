# UX-HOME-001 — Rééquilibrage vertical strict en paysage

## Objectif

Rééquilibrer uniquement l'écran d'accueil en orientation paysage afin de mieux répartir la hauteur entre l'emblème, l'identité des Récits Vivants et les chemins d'entrée.

Le mode portrait est conservé dans sa géométrie existante. Seule l'image du sceau change aussi en portrait, avec une version recadrée dédiée à l'accueil.

## Fichiers modifiés

- `index.html`
- `css/style.css`
- `css/livingHome.css`
- `assets/logo_rv_home.png`

## Logo

Le fichier `assets/logo_rv.png` n'a pas été modifié afin de préserver les usages partagés du sceau dans le Carnet, la Boussole et la Forêt de l'Arche.

Une variante dédiée à l'accueil a été créée :

- `assets/logo_rv_home.png`

Cette version recadre le médaillon sur le coeur du sceau et retire le large pourtour noir extérieur qui alourdissait visuellement l'accueil.

La page d'accueil référence désormais cette variante dans `index.html`.

## Règles CSS modifiées ou ajoutées

### `css/style.css`

Ajout de règles paysage ciblées :

- `@media (orientation:landscape)`
  - remonte `.entry-intro` à `5.5 %` de la hauteur utile ;
  - réduit `.entry-intro-emblem` avec `clamp(64px, 11dvh, 92px)`.

- `@media (max-height:520px) and (orientation:landscape)`
  - remonte davantage `.entry-intro` à `2.5 %` de la hauteur utile ;
  - réduit l'emblème avec `clamp(46px, 12dvh, 60px)`.

Les règles portrait existantes n'ont pas été modifiées.

### `css/livingHome.css`

Adaptation des chemins uniquement en paysage :

- paysage général :
  - la zone `.living-home__paths` descend de `4.5 %` à `2.4 %` de la hauteur utile ;
  - le maximum vertical passe de `24vh / 180px` à `30dvh / 240px` ;
  - le panneau ouvert peut atteindre `clamp(82px, 16dvh, 132px)`.

- paysage compact :
  - le bas passe à `10px + safe-area` ;
  - les textes de panneaux ouverts ne sont plus forcés sur une seule ligne ;
  - le panneau ouvert peut atteindre `clamp(36px, 14dvh, 66px)`.

- smartphone paysage :
  - le bas passe de `clamp(28px, 7dvh, 38px)` à `clamp(10px, 3dvh, 18px)` ;
  - le panneau ouvert peut atteindre `clamp(64px, 22dvh, 92px)`.

## Breakpoints concernés

- `orientation:landscape`
- `max-height:520px` + `orientation:landscape`
- `max-width:1024px` + `max-height:520px` + `orientation:landscape`
- `max-width:960px` + `max-height:480px` + `orientation:landscape`

## Vérifications réalisées

- Inspection des règles responsables du sceau d'accueil : `.entry-intro-emblem` dans `css/style.css`.
- Inspection du conteneur titre / auteur / promesse : `.entry-intro` dans `css/style.css`.
- Inspection du conteneur des chemins : `.living-home__paths` dans `css/livingHome.css`.
- Vérification que les règles portrait existantes ne sont pas modifiées.
- Vérification du diff pour confirmer que la correction reste locale à l'accueil.
- `git diff --check` exécuté.
- `git diff --cached --check` exécuté.

## État du portrait

La géométrie portrait n'a pas été modifiée : positions, espacements, typographie, chemins et accordéons restent régis par les règles portrait préexistantes.

La seule différence visible autorisée est l'utilisation du sceau recadré `assets/logo_rv_home.png`.

## Limite restante

La validation finale sur appareils physiques reste recommandée pour confirmer le ressenti exact sur smartphone paysage, tablette paysage et desktop. Les changements sont toutefois confinés aux media queries paysage et ne modifient aucune logique fonctionnelle.
