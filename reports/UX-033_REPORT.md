# UX-033 — Harmoniser les murmures d'accueil des Lieux Vivants

## Objectif

Améliorer la durée de lecture des murmures déjà présents dans les grands lieux des Récits Vivants, sans ajouter de nouveau texte et sans modifier la navigation, les moteurs narratifs, BookRenderer, ZoneRenderer ou les JSON métier.

## Murmures identifiés

Les murmures existants sont pilotés par trois couches autonomes :

- `js/livingJourney.js` : notices discrètes de passage et phrases vivantes pour les lieux principaux, dont Bibliothèque Vivante, Boussole Vivante, Cartes Narratives, Atelier des Récits, Constellation et Forêt de l'Arche.
- `js/narrativeThread.js` : transitions narratives entre les grands lieux du territoire.
- `js/archwayPassage.js` : murmures de passage propres à la Forêt de l'Arche et aux Cartes Narratives / Atlas.

Aucun texte de murmure n'a été réécrit.
Aucun nouveau murmure n'a été créé.

## Corrections appliquées

### Durée de lecture

- Les notices de lieu passent de `3600 ms` à `7200 ms`.
- Les transitions narratives passent de `1900 ms` à `7200 ms` de présence lisible.
- Les murmures Forêt / Atlas disposent désormais d'une durée minimale de lecture de `7200 ms`, y compris lorsque le calcul dynamique existant retournerait une durée plus courte.

### Fondus

- Les fondus des notices globales sont harmonisés à `650 ms`.
- Les fondus des murmures Forêt / Atlas sont harmonisés à `650 ms`.
- Les transitions narratives utilisent maintenant une apparition, une présence stable, puis un retrait doux, au lieu d'une animation complète trop courte.

### Interaction intelligente

Les murmures se retirent immédiatement avec un léger fondu lorsque le visiteur :

- touche l'écran ;
- clique ;
- utilise la molette ;
- fait défiler ;
- appuie sur une touche.

Pour la Forêt de l'Arche et l'Atlas, cette interaction rend aussi l'invitation disponible après le fondu court afin d'éviter toute attente imposée.

## Fichiers modifiés

- `js/livingJourney.js`
- `js/narrativeThread.js`
- `js/archwayPassage.js`
- `css/style.css`
- `css/narrativeThread.css`
- `reports/UX-033_REPORT.md`

## Contraintes respectées

- Aucun moteur global modifié.
- Aucun JSON métier modifié.
- Aucun BookRenderer modifié.
- Aucun ZoneRenderer modifié.
- Aucune navigation générale modifiée.
- Aucun texte de murmure réécrit.
- Aucun nouveau murmure ajouté.

## Validations

- `node --check js/livingJourney.js` : OK
- `node --check js/narrativeThread.js` : OK
- `node --check js/archwayPassage.js` : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK

Validation responsive prévue :

- desktop ;
- mobile portrait ;
- mobile paysage.

Les changements sont limités aux minuteries, aux fondus et à la fermeture anticipée sur interaction. Ils ne changent pas les destinations, les routes ni les contenus.
