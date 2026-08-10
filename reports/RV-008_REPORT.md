# RV-008 - Bibliotheque Vivante paginee

## Resume

RV-008 transforme la Bibliotheque existante en une succession de salles.
Le visiteur ne parcourt plus une grille de cartes HTML classiques.
Il avance de salle en salle dans les quatre espaces deja presents:

```text
Romans -> Essais -> Atlas -> Ressources
```

## Branche

- Branche: `agent/rv-008-paginated-living-library`
- `main` n'a pas ete modifie.

## Fichiers modifies

- `js/bookRenderer.js`
- `css/bookRenderer.css`

## Fichiers crees

- `docs/LIVING_LIBRARY.md`
- `reports/RV-008_REPORT.md`

## Fichiers non modifies

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `data/zones-v3-final-beta.json`
- `data/livres-v2.json`
- `index.html`
- `css/style.css`

## Organisation des salles

| Salle | Ecran | Categorie |
| --- | --- | --- |
| Salle 1 - Romans | `e06_fiction` | `fiction` |
| Salle 2 - Essais | `e06_essais` | `essais` |
| Salle 3 - Atlas | `e06_atlas` | `atlas` |
| Salle 4 - Ressources | `e06_portes` | `portes_ouvertes` |

## Implementation

`BookRenderer` conserve le chargement depuis `data/livres-v2.json`.
Les ressources sont regroupees par categorie, puis rendues dans la salle correspondante.

Chaque volume affiche:

- couverture;
- titre;
- bouton `Ouvrir`;
- bouton `QR`.

Les boutons utilisent les champs `url` et `qr` de la configuration existante.
Aucun lien de livre n'est code en dur dans le JavaScript.

## Navigation

Chaque salle possede une navigation basse:

- Salle precedente;
- Salle suivante.

La premiere salle n'affiche pas de precedent.
La derniere salle n'affiche pas de suivant.

Les transitions utilisent un court fondu sur la salle avant `Navigation.goTo(...)`.
Le moteur `Navigation` n'est pas modifie.

## Captures attendues

Les captures de validation sont produites comme artefacts locaux:

### PC

- `outputs/RV-008_PC_ROMANS.png`
- `outputs/RV-008_PC_ESSAIS.png`
- `outputs/RV-008_PC_ATLAS.png`
- `outputs/RV-008_PC_RESSOURCES.png`

### Tablette

- `outputs/RV-008_TABLET_ROMANS.png`
- `outputs/RV-008_TABLET_ESSAIS.png`
- `outputs/RV-008_TABLET_ATLAS.png`
- `outputs/RV-008_TABLET_RESSOURCES.png`

### Smartphone portrait

- `outputs/RV-008_PHONE_PORTRAIT_ROMANS.png`
- `outputs/RV-008_PHONE_PORTRAIT_ESSAIS.png`
- `outputs/RV-008_PHONE_PORTRAIT_ATLAS.png`
- `outputs/RV-008_PHONE_PORTRAIT_RESSOURCES.png`

### Smartphone paysage

- `outputs/RV-008_PHONE_LANDSCAPE_ROMANS.png`
- `outputs/RV-008_PHONE_LANDSCAPE_ESSAIS.png`
- `outputs/RV-008_PHONE_LANDSCAPE_ATLAS.png`
- `outputs/RV-008_PHONE_LANDSCAPE_RESSOURCES.png`

## Validation effectuee

Verifications realisees:

- syntaxe de `js/bookRenderer.js`;
- syntaxe de `js/app.js`;
- absence de diff sur les moteurs interdits;
- absence de diff sur les JSON existants;
- conservation des liens `url` et `qr` issus de `livres-v2.json`;
- verification statique de la sequence:
  - `e06_fiction -> e06_essais`;
  - `e06_essais -> e06_atlas`;
  - `e06_atlas -> e06_portes`;
  - `e06_portes` sans salle suivante.

## Limites connues

Les ressources affichees sont strictement celles deja presentes dans `data/livres-v2.json`.
La salle Ressources affiche donc les ressources de categorie `portes_ouvertes`.

Les QR restent inchanges et proviennent de la configuration existante.

## Recommandations

- Ajouter plus tard une configuration de salle si les ressources doivent etre reparties autrement que par categorie.
- Ajouter des QR specifiques par ouvrage dans `livres-v2.json` si chaque QR doit pointer vers une destination differente.
- Relier ensuite les controles visuels internes des salles aux zones JSON, si une mission future veut rendre toute la Bibliotheque pilotable par `ZoneRenderer`.

