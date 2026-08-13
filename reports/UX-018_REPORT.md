# UX-018 - L'Accueil Vivant

## Synthese

UX-018 transforme l'accueil en seuil narratif.

Le visiteur dispose maintenant de trois portes claires :

- Je decouvre ;
- Je poursuis mon voyage ;
- J'explore librement.

## Ecran modifie

- `e01_accueil`

La composition, l'image de fond, le logo, l'ambiance nocturne et les animations existantes sont conservees.

## Parcours ajoutes

### Je decouvre

Declenche le Premier Voyage via l'evenement local :

`makerland:firstJourney:start`

### Je poursuis mon voyage

Reprend le dernier ecran utile connu depuis la memoire locale `makerland_living_journey`.

Si la derniere trace est seulement l'accueil, ou si aucune destination precise n'existe, la porte renvoie vers `carnet/`.

### J'explore librement

Ouvre `e02_meteo`, comme l'entree originale.

## Elements visuels ajoutes

- texte court sous le logo ;
- promesse editoriale ;
- phrase quotidienne locale ;
- indication saison / moment ;
- phrase de premier regard ;
- petites cartes explicatives des lieux pour les primo-visiteurs ;
- carte `Bienvenue de retour` pour les visiteurs connus.

## Fichiers modifies

- `index.html`
- `js/firstJourney.js`
- `js/livingHome.js`
- `css/livingHome.css`
- `docs/ux/LIVING_HOME.md`
- `reports/UX-018_REPORT.md`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucune architecture de navigation modifiee.
- Couche autonome dediee a l'accueil.

## Validation

- Premiere visite : l'accueil vivant devient la porte d'entree, et la carte automatique UX-017 est neutralisee lorsque `livingHome` est actif.
- Premier Voyage : porte `Je decouvre` lance UX-017.
- Exploration libre : porte `J'explore librement` ouvre la Meteo interieure.
- Visiteur connu : carte `Bienvenue de retour` affichee lorsque la memoire locale existe sur desktop.
- Reprise : `Je poursuis mon voyage` reprend un dernier ecran utile ou bascule vers `carnet/`.
- Responsive : controle local desktop `1280 x 720`, smartphone portrait `412 x 915`, smartphone paysage `915 x 412`.
- Mobile : la carte `Bienvenue de retour` est masquee pour eviter tout chevauchement ; la reprise reste disponible via la porte `Je poursuis mon voyage`.

## Validations techniques

- `node --check js/livingHome.js` : OK.
- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK.

## Remarques

Le bouton `Entrer` historique reste present dans les donnees et dans la navigation, mais il est masque visuellement lorsque l'accueil vivant est actif. Sa destination n'est pas modifiee.
