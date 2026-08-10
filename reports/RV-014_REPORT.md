# RV-014 - Transformation des Portes Ouvertes en Bibliotheques immersives

## Resume

RV-014 transforme la salle `Portes ouvertes` en entree vers trois nouvelles salles immersives:

- Carnets gratuits;
- Manifestes & Textes ouverts;
- Oeuvres libres.

Les trois cartes de `Portes ouvertes` n'ouvrent plus directement Blogger.
Elles ouvrent des salles internes de la Bibliotheque Vivante.

## Fichiers crees

- `data/library-extensions.json`
- `docs/IMMERSIVE_LIBRARY_NETWORK.md`
- `reports/RV-014_REPORT.md`

## Fichiers modifies

- `index.html`
- `js/bookRenderer.js`
- `css/bookRenderer.css`
- `data/livres-v2.json`

## Architecture

Le renderer de bibliotheque charge maintenant:

- `data/livres-v2.json`;
- `data/library-layout.json`;
- `data/library-extensions.json`.

Les sous-salles sont rendues generiquement depuis `library-extensions.json`.
Elles ne sont pas codees une par une dans le comportement.

Chaque ressource peut etre:

- publiee avec `url` et `qr`;
- a venir avec `status: "coming_soon"`.

## Navigation

Les cartes de `Portes ouvertes` utilisent maintenant `targetScreen`:

- Carnets gratuits -> `e06_carnets`
- Manifestes & Textes ouverts -> `e06_manifestes`
- Oeuvres libres -> `e06_ressources_libres`

Les nouvelles salles proposent:

- Salle precedente;
- Salle suivante lorsque disponible;
- Retour Bibliotheque.

La navigation utilise toujours `Navigation.goTo(...)` via le renderer existant.
`Navigation` n'a pas ete modifie.

## Ressources connues

Les URLs deja presentes dans le depot sont conservees dans les nouvelles salles:

- Manifeste pour une litterature des possibles;
- Le Grand Bestiaire Anti-Agressivite.

Les ressources sans URL reelle disponible dans le depot sont declarees `coming_soon`.
Aucun lien n'a ete invente.

## Compatibilite

Aucun changement n'a ete apporte a:

- `js/navigation.js`
- `js/zoneRenderer.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/app.js`
- `data/zones-v3-final-beta.json`
- renderer des oeuvres
- Boussole
- meteo

## Validation

Verifications effectuees:

- `node --check js/bookRenderer.js`: OK
- JSON parse:
  - `data/livres-v2.json`: OK
  - `data/library-layout.json`: OK
  - `data/library-extensions.json`: OK
  - `data/zones-v3-final-beta.json`: OK
- chaque `targetScreen` de `Portes ouvertes` existe dans le DOM;
- chaque salle declaree dans `library-extensions.json` possede son `screenId` et son `containerId`;
- les ressources publiees possedent une URL;
- les ressources `coming_soon` ne sont pas ouvrables;
- aucun diff sur les moteurs interdits.

## Responsive

Les nouvelles salles reprennent le responsive de la Bibliotheque Vivante.
Des ajustements CSS locaux aux sous-salles garantissent une lecture correcte sur:

- Android portrait;
- Android paysage;
- iPhone;
- iPad;
- Desktop.

## Limites

Plusieurs ressources annoncees dans la vision ne disposent pas encore d'URL reelle dans le depot.
Elles sont volontairement affichees comme `coming_soon`.

La mission pose donc le reseau immersif extensible, sans inventer de contenu ni de destination.
