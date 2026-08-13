# RV-094 - Le Conservateur Vivant

## Objectif

Creer un module documentaire autonome capable de proposer des rattachements patrimoniaux pour une nouvelle ressource, sans jamais modifier les donnees existantes.

## Sources utilisees

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

## Fichiers crees

- `js/livingCurator.js`
- `docs/patrimoine/LIVING_CURATOR.md`
- `reports/RV-094_REPORT.md`

## Architecture

`livingCurator.js` expose une API locale :

- `load()`
- `suggest(data, resource)`
- `conservationReport(data, resource)`
- `audit(data)`
- `health(data)`

Le module ne s'execute pas automatiquement dans les pages existantes.

Il est pret a etre appele par de futurs outils documentaires.

## Fonctions implementees

### Detection

Analyse d'une ressource candidate depuis ses metadonnees :

- `id`
- `type`
- `title`
- `summary`
- `concepts`
- `tags`
- `origin`
- `date`

### Suggestions

Production de rattachements candidats :

- concepts proches ;
- archives concernees ;
- oeuvres liees ;
- images associees ;
- salle Makerland principale ;
- position chronologique probable.

### Rapport

Generation d'un rapport de conservation contenant :

- ressource analysee ;
- suggestions ;
- justification ;
- regles de conservation.

### Verification

Detection de :

- ressources orphelines ;
- concepts sans illustration ;
- archives sans oeuvre ;
- oeuvres sans concepts ;
- images non reliees.

### Sante du territoire

Calcul de :

- nombre d'archives ;
- nombre de concepts ;
- nombre d'oeuvres ;
- nombre d'images ;
- nombre de nœuds ;
- nombre de relations ;
- densite relationnelle ;
- ressources orphelines.

## Statistiques actuelles

| Mesure | Valeur |
| --- | --- |
| Nœuds | 318 |
| Relations | 713 |
| Archives | 10 |
| Concepts | 26 |
| Œuvres / couvertures | 10 |
| Images | 101 |
| Densite relationnelle | 2.24 |
| Nœuds orphelins | 49 |
| Concepts sans illustration | 5 |
| Archives sans œuvre | 4 |
| Œuvres sans concepts | 3 |
| Images non reliees | 3 |

## Suggestion test generee

Ressource candidate :

`Nouvelle archive de cosmologie narrative`

Resultat :

- Archives suggerees : `D003`, `D001`
- Concepts suggerees : `Atlas`, `Cosmologie`, `Recits Vivants`
- Salles suggerees : `ROOM-OEUVRE`, `ROOM-BOUSSOLE`

Justification :

`La ressource "Nouvelle archive de cosmologie narrative" pourrait etre reliee aux archives D003, D001 ; concepts Atlas, Cosmologie, Recits Vivants ; salles ROOM-OEUVRE, ROOM-BOUSSOLE.`

## Contraintes respectees

- Aucun HTML modifie.
- Aucune navigation modifiee.
- Aucun moteur modifie.
- Aucun JSON metier modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun NarrativeMemory modifie.
- Aucun LivingEcho modifie.
- Aucun appel API.
- Aucune IA.

## Validations

- `node --check js/livingCurator.js` : OK.
- `git diff --cached --check` : OK.
