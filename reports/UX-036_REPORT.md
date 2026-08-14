# UX-036 — Les Murmures des Gardiens

## Objectif

Remplacer les messages d'accueil perçus comme des notifications par une présence narrative discrète : les Gardiens des Récits Vivants.

Le composant créé agit comme une couche autonome. Il n'est ni un bouton, ni une modale, ni un tutoriel. Il accueille brièvement le visiteur dans les grands territoires, puis s'efface.

## Architecture créée

### Données

Fichier ajouté :

- `data/living-guardians.json`

Ce fichier contient :

- les paramètres communs d'apparition ;
- les Gardiens ;
- leurs noms ;
- leurs signes graphiques ;
- leurs variantes visuelles ;
- leurs messages ;
- l'association entre territoires et Gardiens compatibles.

Les messages restent courts et non pédagogiques. Ils ouvrent un état d'esprit sans expliquer la page.

### Composant JavaScript

Fichier ajouté :

- `js/livingGuardianWhisper.js`

Rôle :

- charger les données JSON ;
- déterminer le territoire courant ;
- choisir le Gardien principal ou un Gardien compatible ;
- éviter la répétition immédiate du même Gardien et du même message ;
- afficher une bulle de dialogue accessible ;
- masquer la bulle au bout d'environ 8 secondes ;
- fermer immédiatement à la première interaction utilisateur ;
- fonctionner sur l'application principale et sur les pages autonomes de l'Atelier et des Archives.

Le module expose :

- `window.LivingGuardianWhisper.showForScreen()`
- `window.LivingGuardianWhisper.dismiss()`
- `window.LivingGuardianWhisper.resolveTerritory()`
- `window.LivingGuardianWhisper.canShowForScreen()`

### Styles

Fichier ajouté :

- `css/livingGuardianWhisper.css`

Le style applique :

- fond ivoire chaud ;
- opacité douce ;
- contour or patiné ;
- texte brun profond ;
- titre doré ;
- coins arrondis ;
- ombre discrète ;
- figure circulaire 88 px desktop / 72 px mobile ;
- apparition en deux temps : Gardien puis bulle ;
- disparition courte avec poussières dorées ;
- adaptation mobile et paysage ;
- respect de `prefers-reduced-motion`.

## Remplacement des anciens murmures

Fichier modifié :

- `js/livingJourney.js`

Le bandeau `journey-notice` est désormais neutralisé lorsque le nouveau composant Gardien peut prendre le relais sur le territoire d'arrivée.

Cela évite d'afficher simultanément :

- l'ancien message de type système ;
- la nouvelle bulle incarnée du Gardien.

Le système ancien reste disponible pour les écrans non couverts.

## Pages raccordées

Application principale :

- `index.html`

Atelier :

- `atelier/index.html`
- `atelier/dialogue/index.html`
- `atelier/cartographie/index.html`
- `atelier/images/index.html`
- `atelier/clarification/index.html`
- `atelier/evolution/index.html`

Archives :

- `atelier/archives/index.html`
- `atelier/archives/d001.html`
- `atelier/archives/d002.html`
- `atelier/archives/d003.html`
- `atelier/archives/d004.html`
- `atelier/archives/d005.html`
- `atelier/archives/d006.html`
- `atelier/archives/d007.html`
- `atelier/archives/d008.html`
- `atelier/archives/d009.html`
- `atelier/archives/d010.html`

Constellation :

- `constellation/index.html`

## Territoires couverts

Le composant couvre les territoires suivants :

- Seuil des Climats ;
- Boussole Vivante ;
- Cartes Narratives ;
- Bibliothèque Vivante ;
- Atelier des Récits ;
- Archives Vivantes ;
- Constellation ;
- Forêt de l'Arche.

L'accueil principal n'affiche pas de Gardien afin de préserver le silence du seuil.

## Comportement UX

- Apparition non bloquante.
- Fermeture immédiate au scroll, clic, tap, roue souris ou touche clavier.
- Pas de pointeur capturé par la bulle.
- Aucun bouton ni CTA masqué volontairement.
- Position desktop selon le territoire : gauche ou droite.
- Position mobile : au-dessus de la zone de navigation.
- Durée visible : environ 8 secondes.

## Contraintes respectées

- Aucun moteur global modifié, hors neutralisation ciblée de l'ancien message `journey-notice`.
- Aucune navigation modifiée.
- Aucun JSON métier modifié.
- Aucun BookRenderer modifié.
- Aucun ZoneRenderer modifié.
- Aucun changement de destination.

## Validations

- `node --check js/livingGuardianWhisper.js` : OK
- `node --check js/livingJourney.js` : OK
- validation JSON `data/living-guardians.json` : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK

## Note de validation visuelle

La validation visuelle complète desktop / tablette / mobile devra être réalisée dans le navigateur cible. Le composant est conçu pour ne pas intercepter les clics hors de sa propre lecture, pour respecter les zones tactiles et pour se retirer à la première interaction.
