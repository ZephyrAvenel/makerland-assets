# RV-086 - Les Saisons Vivantes de Makerland

## Objectif

RV-086 ajoute une couche temporelle autonome a Makerland. Le territoire varie discretement selon la saison locale et le moment de la journee, sans serveur, sans API meteo et sans donnee externe.

## Fichiers modifies

- `js/livingSeasons.js`
- `index.html`
- `atelier/index.html`
- `atelier/dialogue/index.html`
- `atelier/cartographie/index.html`
- `atelier/images/index.html`
- `atelier/clarification/index.html`
- `atelier/evolution/index.html`
- `constellation/index.html`
- `constellation/chemin/index.html`
- `constellation/fonctionnement/index.html`
- `constellation/transmission/index.html`
- `constellation/temoignages/index.html`
- `carnet/index.html`
- `carnet/rencontres/index.html`
- `carnet/carnet.js`
- `css/style.css`
- `css/placeholder.css`

## Nouveau composant

### `js/livingSeasons.js`

Le module calcule localement :

- la saison : `printemps`, `ete`, `automne`, `hiver` ;
- le moment de la journee : `aube`, `matin`, `midi`, `crepuscule`, `nuit` ;
- une saison editoriale symbolique ;
- un fragment saisonnier ;
- une phrase rare liee au moment.

Il ajoute uniquement des classes sur `body` :

- `living-season-ready`
- `season-spring`, `season-summer`, `season-autumn`, `season-winter`
- `moment-dawn`, `moment-morning`, `moment-noon`, `moment-dusk`, `moment-night`

## Saisons creees

### Printemps

- Lieu symbolique : Dialogue.
- Intention : naissance, questions, premieres formes.
- Fragment : `Les premieres questions ouvrent parfois plus que les reponses.`

### Ete

- Lieu symbolique : Cartographie.
- Intention : creation, exploration, expansion.
- Fragment : `Les cartes s'elargissent lorsque la lumiere devient plus franche.`

### Automne

- Lieu symbolique : Transmission.
- Intention : clarification, reecriture, passage.
- Fragment : `Ce qui tombe nourrit parfois la prochaine forme.`

### Hiver

- Lieu symbolique : Carnet.
- Intention : silence, memoire, resonance.
- Fragment : `Le silence garde certaines traces mieux que la vitesse.`

## Effets temporels

Selon l'heure locale, le module peut afficher rarement une phrase douce :

- `Le territoire s'eveille.`
- `La lumiere change les chemins.`
- `Certaines idees preferent le soir.`
- `La nuit laisse les recits respirer.`

Une phrase maximum est affichee, et pas a chaque visite.

## Anniversaires du voyage

Le module conserve localement la premiere date de passage dans :

`makerland:living-seasons`

Lorsqu'un retour intervient plusieurs jours apres, il peut afficher :

`Il y a quelque temps, vous avez commence ce chemin.`

Aucune date precise et aucun compteur ne sont exposes.

## Variations visuelles

Les variations sont limitees a :

- variables CSS saisonnieres ;
- halos legerement ajustes ;
- bordures secondaires plus chaudes ou plus froides ;
- objets de l'Atelier dont l'etincelle varie subtilement selon la saison ;
- fragments saisonniers conserves dans le Carnet.

Les styles respectent `prefers-reduced-motion`. Aucune animation spectaculaire n'a ete ajoutee.

## Memoire locale

Deux cles locales sont utilisees :

- `makerland:living-seasons` : premiere visite, derniere visite, dernier murmure saisonnier affiche.
- `makerland:living-cycle` : saison courante, moment courant, lieu saisonnier symbolique, fragments saisonniers.

## Contraintes respectees

- Aucun serveur.
- Aucune API meteo.
- Aucune IA.
- Aucun changement de Navigation.
- Aucun changement de BookRenderer.
- Aucun changement de ZoneRenderer.
- Aucun changement de NarrativeMemory.
- Aucun changement de LivingEcho.
- Aucun pack narratif modifie.
- Aucun JSON metier modifie.

## Validation

- `node --check js/livingSeasons.js` : OK.
- `node --check carnet/carnet.js` : OK.
- `git diff --check` : OK.

## Pistes RV-087

- Ajouter une option locale pour masquer les variations saisonnieres.
- Exposer la saison actuelle dans le Carnet sous forme de note poetique.
- Relier certaines resonances RV-085 aux saisons symboliques.
- Ajouter des variations tres legeres aux pages recit de la Constellation.
- Prevoir un corpus plus riche de fragments saisonniers.
