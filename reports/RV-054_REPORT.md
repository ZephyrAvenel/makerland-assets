# RV-054 - Renommage final de la PWA

Date: 2026-08-11

Branche: `agent/rv-054-final-pwa-rename`

## Objectif

Faire de l'application le lecteur immersif officiel des Recits Vivants en mettant a jour uniquement le nom public de la PWA.

## Champs modifies

Fichier modifie: `manifest.json`

- `name`: `Bibliothèque Vivante` -> `Récits Vivants`
- `short_name`: `Bibliothèque` -> `Récits`

## Nom final

- Nom complet: `Récits Vivants`
- Nom court: `Récits`

## Perimetre respecte

- `start_url` conserve.
- `scope` conserve.
- `display` conserve.
- `background_color` conserve.
- `theme_color` conserve.
- Icones conservees.
- Aucun HTML modifie.
- Aucun CSS modifie.
- Aucun JavaScript modifie.
- Aucun JSON metier modifie.

## Validation

- `manifest.json` valide en JSON.
- `git diff --check` OK.
