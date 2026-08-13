# UX-024 - Finalisation du Premier Voyage

## Synthese

UX-024 polit le Premier Voyage afin qu'il ressemble moins a une interface applicative et davantage a une traversee narrative.

La mission ne change aucune destination ni aucune route. Elle ajuste uniquement l'affichage du parcours, ses transitions et sa conclusion.

## Modifications realisees

### Toast de voyage

Le toast `Vous venez de quitter : ...` est masque pendant le Premier Voyage.

Le systeme de toast reste disponible ailleurs dans l'application. Le masquage repose sur la classe de contexte `first-journey-active`, ajoutee uniquement lorsque le Premier Voyage est en cours.

### Transition entre etapes

Le bouton `Continuer` declenche maintenant une sortie douce de la carte avant l'arrivee a l'etape suivante.

Timing retenu :

- 300 ms ;
- opacite 1 -> 0 ;
- leger mouvement vertical vers le haut ;
- aucun rebond, aucun effet spectaculaire.

### Harmonisation des cartes

Les cartes du Premier Voyage recoivent une hauteur minimale afin de limiter les differences de taille entre les etapes.

Les textes ne sont pas modifies.

### Conclusion

Le texte final devient :

`Le seuil est desormais derriere vous.`

`Vous connaissez maintenant les cinq portes des Recits Vivants.`

`Vous avez decouvert comment une intuition devient une oeuvre, puis rejoint d'autres recits.`

`A partir d'ici, il n'existe plus de chemin unique.`

`Chaque lecteur compose desormais sa propre traversee.`

### Hierarchie des boutons

`Explorer les oeuvres` reste le bouton principal de la conclusion.

`Explorer librement` et `Refaire le premier voyage` restent disponibles avec un traitement secondaire.

## Fichiers modifies

- `js/firstJourney.js`
- `js/livingJourney.js`
- `css/firstJourney.css`
- `reports/UX-024_REPORT.md`

## Validations

- `node --check js/firstJourney.js` : OK.
- `node --check js/livingJourney.js` : OK.
- `git diff --check` : OK, avec avertissements CRLF attendus.
- Parcours local verifie : seuil -> page intermediaire -> etape 1 -> etape 2 -> etape 3 -> etape 4 -> etape 5 -> conclusion.
- Aucun toast `Vous venez de quitter...` visible pendant le Premier Voyage.
- Conclusion verifiee : `Explorer les oeuvres` est le seul bouton principal.
- Smartphone portrait : carte de parcours visible dans le viewport.
- Smartphone paysage : carte de parcours visible dans le viewport.
