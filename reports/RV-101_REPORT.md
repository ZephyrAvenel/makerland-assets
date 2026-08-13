# RV-101 - Les Chemins Vivants

## Objectif

Creer un systeme autonome de parcours narratifs construits a partir des ressources deja presentes dans Makerland.

## Fichiers crees

- `js/livingPaths.js`
- `css/livingPaths.css`
- `data/living-paths.json`
- `docs/patrimoine/LIVING_PATHS.md`

## Fichier modifie

- `index.html`

La modification se limite au chargement du CSS et du module autonome.

## Chemins crees

1. Je decouvre
2. J'approfondis
3. Je cree
4. Je contemple
5. Je transmets

## Couverture

| Indicateur | Valeur |
| --- | ---: |
| Chemins | 5 |
| Nombre total d'etapes | 27 |
| Nombre moyen d'etapes | 5.4 |
| Ressources patrimoniales referencees | 21 |

## Memoire locale

Le module utilise :

`makerland.living.paths`

Il conserve les chemins commences, chemins termines, etapes parcourues, archives decouvertes, oeuvres rencontrees, concepts croises et constellations visitees.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation principale modifiee.
- Aucun `BookRenderer`, `ZoneRenderer`, `NarrativeMemory` ou `LivingEcho` modifie.
- Aucun JSON metier existant modifie.
- Aucune API.
- Aucun serveur.
- Aucune IA.

## Validation

- `node --check js/livingPaths.js` : OK.
- Validation JSON de `data/living-paths.json` : OK.
- `git diff --check` : OK sur les fichiers de travail.
- `git diff --cached --check` : OK.
