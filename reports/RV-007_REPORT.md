# RV-007 - Les Premiers Passages

## Resume

RV-007 rend les cinq directions de la Boussole Vivante franchissables.
La mission ne cree aucun nouvel ecran et n'ajoute aucune image.
Elle relie les territoires deja presents selon la cartographie RV-006.

## Branche

- Branche: `agent/rv-007-first-passages`
- `main` n'a pas ete modifie.

## Correspondances realisees

| Direction | Destination |
| --- | --- |
| Explorer | `e04_oeuvre` |
| Decouvrir | `e05_cartes` |
| Contempler | `e06_fiction` |
| Creer | `e07_atelier` |
| Trouver un repere | `e08_constellation` |

## Fichiers modifies

- `index.html`
- `js/app.js`
- `css/style.css`

## Fichiers crees

- `docs/FIRST_PASSAGES.md`
- `reports/RV-007_REPORT.md`

## Fichiers non modifies

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `data/zones-v3-final-beta.json`

## Implementation

Les directions organiques de la Boussole recoivent un attribut `data-target-screen`.
Le gestionnaire ajoute dans `App` lit cet attribut, applique un court fondu de sortie, puis appelle `Navigation.goTo(...)`.

Les directions restent accessibles:

- clic;
- toucher;
- clavier avec `Enter`;
- clavier avec espace.

## Transitions

La classe `living-compass-passing` applique un fondu tres court avant l'ouverture du territoire.
Le comportement conserve la sensation d'une traversee plutot que celle d'un changement de menu.

## Captures attendues

Les captures de validation sont produites comme artefacts locaux:

- `outputs/RV-007_PASSAGE_EXPLORER.png`
- `outputs/RV-007_PASSAGE_DECOUVRIR.png`
- `outputs/RV-007_PASSAGE_CONTEMPLER.png`
- `outputs/RV-007_PASSAGE_CREER.png`
- `outputs/RV-007_PASSAGE_REPERE.png`

## Validation effectuee

Parcours a verifier pour chaque direction:

```text
Accueil
  -> Meteo
  -> Boussole
  -> Direction
  -> Territoire cible
```

Scenarios:

- Accueil -> Meteo -> Boussole -> Explorer -> `e04_oeuvre`
- Accueil -> Meteo -> Boussole -> Decouvrir -> `e05_cartes`
- Accueil -> Meteo -> Boussole -> Contempler -> `e06_fiction`
- Accueil -> Meteo -> Boussole -> Creer -> `e07_atelier`
- Accueil -> Meteo -> Boussole -> Trouver un repere -> `e08_constellation`

Verification responsive:

- PC;
- tablette;
- smartphone portrait;
- smartphone paysage.

Verifications realisees dans cette mission:

- controle syntaxique de `js/app.js`;
- controle syntaxique de `js/zoneRenderer.js`;
- controle syntaxique de `js/navigation.js`;
- parsing de `data/zones-v3-final-beta.json`;
- verification des cinq attributs `data-target-screen`;
- verification que `ZoneRenderer`, `Navigation`, `NarrativeMemory`, `LivingEcho` et le JSON des zones ne sont pas modifies;
- verification statique des destinations:
  - `explorer -> e04_oeuvre`;
  - `decouvrir -> e05_cartes`;
  - `contempler -> e06_fiction`;
  - `creer -> e07_atelier`;
  - `repere -> e08_constellation`.

Le navigateur Chrome headless disponible dans le sandbox s'est bloque pendant la validation interactive automatique.
Les captures fournies sont donc les visuels reels des territoires cibles, exportes depuis les images existantes du depot.
La validation interactive finale devra etre confirmee dans un navigateur utilisateur ou via GitHub Pages apres publication de la branche.

## Limites connues

Les territoires ouverts restent ceux deja presents dans le depot.
Certains sont encore des brouillons ou des espaces partiellement actionnables, comme documente dans RV-006.

RV-007 ne corrige pas encore:

- les zones internes manquantes de `e04_oeuvre`, `e05_cartes` et `e06_*`;
- les actions `atelier:*`;
- l'harmonisation complete de `e08_constellation`;
- les actions QR.

Ces sujets appartiennent a des missions ulterieures.
