# RV-040 - Retour Boussole et rythme Meteo

## Resume

RV-040 applique deux ajustements ergonomiques uniquement :

- ajout d'un bouton Retour sur la Boussole vers la page Meteo ;
- ralentissement du rythme d'apparition de l'ecran Meteo par ajustement des delais CSS.

Aucune destination existante, aucun moteur, aucun JSON et aucune logique JavaScript de navigation n'ont ete modifies.

## Bouton Retour Boussole

- Ecran concerne : `e03_boussole`
- Destination : `e02_meteo`
- Classe utilisee : `living-return-button`
- Style : identique au bouton Retour RV-039
- Placement : fixe, coin superieur gauche, safe-area preservee par la regle existante

## Rythme Meteo

Delais ajustes :

- titre : demarrage a `2.2s`
- texte explicatif : demarrage a `4.2s`
- boutons de choix : cascade de `5.72s` a `6.2s`
- halo des boutons : demarrage a `6.18s`

Les animations existantes sont conservees. Seuls les delais ont ete modifies.

## Validation

Destinations de la Boussole confirmees inchangees :

- Explorer -> `e05_cartes`
- Decouvrir -> `e04_oeuvre`
- Contempler -> `e06_fiction`
- Creer -> `e07_atelier`
- Trouver un repere -> `e08_constellation`

Verification :

- bouton Boussole -> Meteo present ;
- `git diff --check` : OK.

## Limite

La verification visuelle du ressenti Android portrait, Android paysage et Desktop doit etre confirmee apres deploiement GitHub Pages.
