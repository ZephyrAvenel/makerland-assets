# RV-053 - Renommage de l'application PWA

Date: 2026-08-11

Branche: `agent/rv-053-pwa-rename`

## Objectif

Remplacer uniquement le nom public de l'application PWA affichee sous Android.

## Champs modifies

Fichier modifie: `manifest.json`

- `name`: `Makerland - Recits Vivants` -> `Bibliothèque Vivante`
- `short_name`: `Makerland` -> `Bibliothèque`

## Nom final

Nom complet retenu:

`Bibliothèque Vivante`

Nom court retenu:

`Bibliothèque`

## Justification du `short_name`

Le libelle complet `Bibliothèque Vivante` represente correctement le projet, mais il est plus long que le nom actuellement affiche sous l'icone Android. Pour limiter le risque de troncature sur les ecrans d'accueil Android, le champ `short_name` utilise `Bibliothèque`.

## Verification du perimetre

- Icône existante inchangee.
- `start_url` inchange.
- `scope` inchange.
- `display` inchange.
- `theme_color` inchange.
- Aucune modification HTML.
- Aucune modification CSS.
- Aucune modification JavaScript.
- Aucune modification JSON metier.

## Validation

- `manifest.json` reste un JSON valide.
- `git diff --check` OK.
