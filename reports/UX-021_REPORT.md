# UX-021 - Restaurer le Seuil et creer une Transition vers le Premier Voyage

## Synthese

UX-021 restaure le seuil comme lieu de choix silencieux et ajoute une page intermediaire avant le Premier Voyage.

Le visiteur ne passe plus directement de `Je decouvre` a UX-017. Il rencontre d'abord une carte `Votre premier voyage`, puis choisit explicitement de commencer.

## Parcours final

Accueil

-> Seuil

-> Votre premier voyage

-> Meteo

-> Bibliotheque Vivante

-> Atelier IA

-> Archive D001

-> Constellation

-> Fin du voyage

## Corrections apportees

- `Je decouvre` declenche maintenant l'evenement local `makerland:firstJourney:intro`.
- La page intermediaire `Votre premier voyage` est rendue par `firstJourney.js`.
- Le bouton `Commencer le voyage` declenche le Premier Voyage existant.
- Le bouton `Retour au seuil` ferme la page intermediaire sans changer de destination.
- Le Premier Voyage commence maintenant sur `e02_meteo`.
- La progression UX-017 conserve cinq etapes : Meteo, Bibliotheque, Atelier IA, Archive D001, Constellation.
- Le seuil ne montre plus de replay du Premier Voyage en bas de l'accueil.

## Fichiers modifies

- `js/livingHome.js`
- `js/firstJourney.js`
- `css/firstJourney.css`
- `docs/ux/FIRST_JOURNEY_THRESHOLD.md`
- `reports/UX-021_REPORT.md`

## Contraintes respectees

- Aucun JSON modifie.
- Aucun moteur global modifie.
- Aucune navigation globale modifiee.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Reutilisation du langage graphique existant : verre, lumiere, or et respiration douce.

## Validations

- `node --check js/livingHome.js` : OK.
- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK, avec avertissements CRLF attendus.
- Desktop : seuil verifie, uniquement promesse centrale et trois portes.
- Desktop : `Je decouvre` ouvre la page intermediaire `Votre premier voyage`.
- Desktop : `Retour au seuil` restaure le seuil sans navigation.
- Desktop : `Commencer le voyage` ouvre `e02_meteo` avec `Etape 1 / 5`.
- Smartphone portrait : carte du Premier Voyage verifiee sur `e02_meteo`, lisible dans le viewport.
- Smartphone paysage : seuil et carte intermediaire couverts par les regles responsive existantes de `firstJourney.css`.
