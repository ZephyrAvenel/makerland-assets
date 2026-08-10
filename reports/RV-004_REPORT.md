# RV-004 - La Memoire Vivante

## Objectif

Creer une memoire narrative locale, douce et reversible.
Makerland ne memorise pas une identite: il memorise seulement le chemin deja traverse dans le navigateur.

## Architecture

La memoire est portee par `js/narrativeMemory.js`.

Elle utilise `localStorage` avec la cle:

```text
makerland.narrativeMemory.v1
```

Structure conservee:

- `visitCount`
- `firstVisit`
- `lastVisit`
- `lastWeather`
- `lastDirection`
- `weatherHistory`
- `directionHistory`
- `milestones`

Le module expose:

- `rememberWeather(selectedWeather)`
- `rememberDirection(direction)`
- `rememberVisit(details)`
- `getCompassWhispers(memory)`
- `getMemory()`
- `reset()`

## Integration

`App` continue de memoriser `selectedWeather` comme avant.
Quand la Boussole s'ouvre, `App` appelle `NarrativeMemory.rememberVisit(...)` avec la meteo courante et la direction suggeree.

La Boussole affiche ensuite un murmure discret issu de `getCompassWhispers(...)`.
Le message principal de la Boussole reste conserve.

En paysage mobile, seul le premier murmure reste visible afin de conserver l'equilibre responsive.
Le texte complet reste disponible dans le DOM et dans l'etiquette accessible.
En smartphone portrait etroit, les murmures sont masques visuellement pour eviter de croiser les directions organiques.

## Exemples de messages

Premiere visite:

- `Bienvenue.`

Deuxieme visite:

- `Heureux de vous revoir.`

Dixieme visite:

- `La Boussole vous reconnait.`

Historique meteo recurrent:

- `Vous revenez souvent lorsque le paysage est voile.`

Historique varie:

- `Les paysages changent.`

Historique de direction:

- `La creation semble vous appeler.`
- `Votre chemin s'elargit.`

## Vie privee

- Aucune donnee transmise.
- Aucun compte utilisateur.
- Aucun identifiant.
- Aucune telemetrie.
- Memoire locale uniquement.
- Suppression possible via `NarrativeMemory.reset()` ou les donnees locales du navigateur.

## Fichiers modifies

- `js/narrativeMemory.js`
- `js/app.js`
- `css/style.css`

## Fichiers crees

- `docs/LIVING_MEMORY.md`
- `reports/RV-004_REPORT.md`

## Captures

- `outputs/RV-004_CAPTURE_FIRST_VISIT.png`
- `outputs/RV-004_CAPTURE_SECOND_VISIT.png`
- `outputs/RV-004_CAPTURE_TENTH_VISIT.png`
- `outputs/RV-004_CAPTURE_PC.png`
- `outputs/RV-004_CAPTURE_TABLET.png`
- `outputs/RV-004_CAPTURE_SMARTPHONE_PORTRAIT.png`
- `outputs/RV-004_CAPTURE_SMARTPHONE_LANDSCAPE.png`

## Validations effectuees

- Verification syntaxe JavaScript.
- Verification parsing JSON.
- Verification `DEBUG_ZONES = false`.
- Verification absence de modification de `ZoneRenderer`.
- Verification absence de modification de `Navigation`.
- Verification absence de modification du JSON des zones.
- Parcours Accueil -> Meteo interieure -> Boussole.
- Verification premiere visite.
- Verification deuxieme visite.
- Verification dixieme visite.
- Verification recurrence meteo.
- Verification variation meteo.
- Verification responsive PC.
- Verification responsive tablette.
- Verification responsive smartphone portrait.
- Verification responsive smartphone paysage.
- Verification qu'en paysage mobile les murmures ne masquent pas les directions.
- Verification qu'en smartphone portrait etroit la Boussole reste lisible sans surcharge memoire.

## Limites

La derniere direction memorisee correspond a la direction suggeree par la Boussole au moment de l'arrivee.
Les directions organiques ne deviennent pas des chemins interactifs dans cette mission, afin de ne pas modifier le parcours narratif existant.
