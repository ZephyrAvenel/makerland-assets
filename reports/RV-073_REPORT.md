# RV-073 - Transformer les chambres de l'Atelier IA en espaces vivants

## Resume

La mission transforme les salles internes de l'Atelier IA en lieux de decouverte structures autour de la naissance des Recits Vivants. Les pages ne sont plus de simples placeholders descriptifs: elles presentent des fragments, cartes, galeries, reformulations et chronologies exploitables comme base extensible.

## Espaces crees ou enrichis

- Atelier principal: les cinq chambres deviennent des portes internes cliquables.
- Dialoguer: conservation et enrichissement de la salle RV-072 avec citation d'ouverture et chemin narratif complet.
- Cartographier: grille responsive de cartes conceptuelles autour des atlas, polarites, constellations et territoires.
- Imaginer: galerie de seuils visuels avec images existantes et section avant/apres.
- Clarifier: salle editoriale sur notes, questions, reformulations et affinage.
- Evoluer: chronologie verticale responsive de l'evolution de l'oeuvre.

## Retour contextuel

Un script isole, `atelier/atelier-return.js`, gere les liens marques avec `data-atelier-return`.

Il lit si disponible:

- `sessionStorage["makerland:atelier:return"]`
- `sessionStorage["makerlandReturnContext"]`
- le `document.referrer`

Fallback: retour vers la Bibliotheque / accueil du voyage. Le libelle visuel reste volontairement neutre: `Revenir au voyage`.

## Architecture retenue

Les contenus sont organises en composants HTML repetables:

- `placeholder-card`
- `living-grid`
- `room-tile`
- `image-gallery`
- `image-study`
- `timeline`
- `timeline-item`

Cette structure permet d'ajouter progressivement des dialogues, cartes, images, versions et fragments sans changer l'architecture principale.

## Contraintes respectees

- Aucune modification de Navigation.
- Aucune modification de ZoneRenderer.
- Aucune modification de BookRenderer.
- Aucune modification de NarrativeMemory, LivingJourney ou LivingEcho.
- Aucune modification de la meteo, de la bibliotheque, des cartes, de la boussole ou des oeuvres immersives.
- Les images existantes sont conservees.

## Validation

- Verification des fichiers limites au perimetre Atelier, `css/placeholder.css` et ce rapport.
- Verification des chemins d'images utilises dans la salle Imaginer.
- `node --check atelier/atelier-return.js`: OK.
- `git diff --check`: OK.

## Extension future

Les prochaines versions peuvent enrichir les salles sans refonte:

- ajout de conversations longues dans Dialoguer;
- ajout de cartes conceptuelles dans Cartographier;
- ajout de centaines d'illustrations dans Imaginer;
- ajout de variantes editoriales dans Clarifier;
- ajout de jalons versionnes dans Evoluer.
