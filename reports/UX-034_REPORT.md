# UX-034 — Emblème officiel des Récits Vivants

## Objectif

Remplacer le monogramme textuel `RV` de la page d'accueil par l'emblème officiel fourni, sans redessiner l'image et sans modifier la navigation ni les parcours existants.

## Modifications réalisées

- Ajout de l'image fournie dans `assets/logo_rv.png`.
- Remplacement du paragraphe textuel `.entry-intro-emblem` par une balise image dans `index.html`.
- Ajout de l'alternative accessible : `alt="Emblème des Récits Vivants"`.
- Suppression du dessin CSS de l'ancien cercle RV :
  - bordure ;
  - fond sombre ;
  - typographie RV ;
  - ombres internes de l'ancien médaillon.
- Ajustement des dimensions :
  - desktop : `clamp(72px, calc(var(--screen-content-width) * .058), 88px)` ;
  - mobile portrait : `72px`.
- Conservation d'une lueur dorée très diffuse via `drop-shadow(0 0 12px rgba(220,190,120,.20))`.
- Ajout du survol desktop discret : `scale(1.03)` avec transition `0.35s`.

## Fichiers modifiés

- `index.html`
- `css/style.css`
- `assets/logo_rv.png`
- `reports/UX-034_REPORT.md`

## Contraintes respectées

- Aucun moteur modifié.
- Aucun JSON métier modifié.
- Aucune navigation modifiée.
- Aucun texte d'accueil modifié.
- Ancien cercle RV et anciennes lettres RV supprimés de l'accueil.

## Validations

- Image intégrée : `assets/logo_rv.png`.
- Dimensions source vérifiées : `1280 x 1280`.
- Ratio carré vérifié pour conserver un rendu circulaire.
- Recherche de l'ancien texte `RV` dans le bloc d'accueil : supprimé.
- `git diff --check` : OK.
- `node --check` : non applicable, aucun JavaScript modifié.
- `git diff --cached --check` : OK.

Validation visuelle prévue :

- desktop ;
- tablette ;
- mobile portrait ;
- mobile paysage.

Note : la session ne fournit aucun navigateur intégré contrôlable (`agent.browsers.list()` retourne une liste vide). La validation responsive a donc été limitée aux contrôles statiques de structure, dimensions CSS et absence de débordement évident dans les règles modifiées.
