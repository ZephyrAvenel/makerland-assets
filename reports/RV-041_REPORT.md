# RV-041 - Harmonisation finale du retour Meteo et du rythme d'accueil

## Resume

RV-041 finalise deux points visuels :

- le libelle visuel du bouton Retour de la Boussole ;
- le rythme d'apparition de l'ecran Meteo.

Aucun HTML, aucun JavaScript, aucun JSON, aucune navigation et aucune destination n'ont ete modifies.

## Bouton Retour de la Boussole

Sur `e03_boussole`, le bouton existant conserve sa destination :

- `data-return-screen="e02_meteo"`

Le libelle visuel affiche via CSS devient :

- `← Meteo interieure`

La regle generale des autres boutons Retour reste inchangee.

## Rythme Meteo

Les animations existantes sont conservees. Seuls les delais CSS ont ete ajustes.

Sequence finale :

- `0s -> 2s` : image seule ;
- `2s` : apparition du titre ;
- `4.5s` : apparition du texte explicatif ;
- `7s -> 9s` : respiration, sans nouveau contenu ;
- `9s -> 9.56s` : apparition progressive des cinq choix Meteo ;
- `9.72s` : halo des boutons apres leur apparition.

## Validation

Destinations de la Boussole confirmees inchangees :

- Explorer -> `e05_cartes`
- Decouvrir -> `e04_oeuvre`
- Contempler -> `e06_fiction`
- Creer -> `e07_atelier`
- Trouver un repere -> `e08_constellation`

Verification :

- bouton Boussole -> Meteo toujours present ;
- `git diff --check` : OK.

## Fichier modifie

- `css/style.css`

## Limite

La validation visuelle finale sur Android portrait, Android paysage et Desktop doit etre confirmee apres deploiement GitHub Pages.
