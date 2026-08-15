# ASSET-001 - Remplacement de l'illustration Constellation

## Objectif

Remplacer l'illustration principale de l'ecran `Constellation des Recits Vivants` par la nouvelle version fournie, sans modifier le comportement de la page.

## Ancien fichier

- `ecrans/ecran-8-constellation.png`
- Dimensions : `1536 x 1024`
- Format : `PNG`
- Statut : conserve dans le depot, mais plus reference par l'ecran Constellation.

## Nouveau fichier

- `ecrans/ecran-8-constellation-v2.png`
- Source locale fournie : `C:\Users\LeoBe\Downloads\ecran-8-constellation-v2.png`
- Dimensions : `1536 x 1024`
- Format : `PNG`
- Taille : `2802809` octets

## References mises a jour

- `data/zones-v3-final-beta.json`
  - `background` de `ecran-8-constellation.png` vers `ecran-8-constellation-v2.png`
- `index.html`
  - `src` de l'image de l'ecran Constellation vers `ecrans/ecran-8-constellation-v2.png`

## References verifiees

Recherche effectuee sur :

- `index.html`
- `data/zones-v3-final-beta.json`
- `data/*.json`
- `css/*.css`
- `js/*.js`

Resultat :

- l'ecran Constellation pointe uniquement vers `ecran-8-constellation-v2.png` ;
- aucune reference restante a `ecran-8-constellation.png` n'est utilisee pour cet ecran.

## Comportement conserve

Aucun changement n'a ete apporte aux fichiers JavaScript, aux overlays ou aux styles de mise en page.

Sont donc conserves :

- les dimensions d'affichage existantes ;
- le responsive desktop, tablette, Android portrait et Android paysage ;
- les animations existantes ;
- le fonctionnement natif restaure du `textarea` Android ;
- le bouton `Partager mon recit` ;
- `LivingOverlayManager` ;
- `constellationScene` ;
- les overlays ;
- la navigation.

## Validation

- Verification des dimensions : ancien et nouveau fichiers en `1536 x 1024`.
- Verification des references : OK.
- `git diff --check` : OK.

## Fichiers modifies

- `data/zones-v3-final-beta.json`
- `index.html`
- `ecrans/ecran-8-constellation-v2.png`
- `reports/ASSET-001_CONSTELLATION_IMAGE_REPLACEMENT.md`
