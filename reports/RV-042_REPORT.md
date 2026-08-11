# RV-042 - Harmonisation complete de la page Meteo avec la page d'accueil

## Resume

RV-042 harmonise la page `e02_meteo` avec le langage visuel et rythmique de la page d'accueil.

La mission est strictement CSS :

- aucun HTML modifie ;
- aucun JavaScript modifie ;
- aucun JSON modifie ;
- aucune navigation modifiee ;
- aucune destination modifiee.

## Typographie et composition

La page Meteo reprend une structure plus proche de l'accueil :

- bloc texte elargi de `68%` a `76%` de la zone utile ;
- position verticale alignee sur la respiration de l'accueil ;
- titre agrandi et resserre avec un interlignage plus proche de l'accueil ;
- texte descriptif legerement agrandi ;
- marge verticale entre titre et texte augmentee ;
- largeur maximale du texte portee a `780px`.

## Rythme final

Sequence CSS finale :

- `0s -> 2.5s` : image seule ;
- `2.5s` : apparition douce du titre ;
- `5s` : apparition du texte descriptif ;
- `5s -> 8.5s` : temps de lecture sans nouvelle animation ;
- `8.5s -> 9.78s` : apparition progressive des cinq choix Meteo ;
- `10.15s` : halo des boutons apres leur apparition.

## Validation

Destinations de la Boussole confirmees inchangees :

- Explorer -> `e05_cartes`
- Decouvrir -> `e04_oeuvre`
- Contempler -> `e06_fiction`
- Creer -> `e07_atelier`
- Trouver un repere -> `e08_constellation`

Verification :

- `git diff --check` : OK.

## Fichier modifie

- `css/style.css`

## Limite

La validation visuelle finale sur Android portrait, Android paysage et Desktop doit etre confirmee apres deploiement GitHub Pages.
