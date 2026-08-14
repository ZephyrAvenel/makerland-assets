# UX-050 — Chemin Vivant cohérent et non bloquant

## Objectif

Clarifier le panneau Chemin Vivant dans la Constellation afin qu'il soit perçu comme une invitation, jamais comme une obligation ou une fenêtre bloquante.

## Diagnostic

Le bouton `Commencer le Chemin Vivant` n'était pas cassé : il appelait bien `startPath(path.id)`, ouvrait le panneau et initialisait la mémoire locale du chemin.

Le problème venait de l'expérience :

- aucun bouton de fermeture global n'était visible dans le panneau ;
- le panneau ne se fermait pas au clic extérieur ;
- Escape ne fermait rien ;
- le focus n'était pas géré à l'ouverture ni à la fermeture ;
- la carte d'invitation occupait beaucoup de place et pouvait donner l'impression d'un passage imposé ;
- après fermeture, aucun accès compact ne permettait de revenir au Chemin Vivant.

## Fichiers modifiés

- `js/livingPaths.js`
- `css/livingPaths.css`

## Corrections JS

- Ajout d'une croix de fermeture dans le panneau.
- Ajout d'un bouton `Continuer librement` dans l'invitation initiale.
- Ajout d'un bouton compact `Chemin Vivant` pour rouvrir l'invitation après fermeture.
- Fermeture du panneau par clic extérieur.
- Fermeture du panneau par touche Escape.
- Focus déplacé vers le premier élément interactif du panneau à l'ouverture.
- Focus restauré vers le bouton compact après fermeture.
- Le lancement du chemin reste fonctionnel et utilise toujours la mémoire locale existante.

## Corrections CSS

- Réduction de la largeur et de la hauteur du panneau principal.
- Réduction de la carte d'invitation.
- Ajout d'un bouton de réouverture discret.
- Ajout d'une croix de fermeture en haut à droite.
- Maintien de l'identité visuelle existante : verre, halo, transparence, dorures discrètes.
- Le calque ne capte les clics extérieurs que lorsque le panneau est ouvert.

## Comportement obtenu

- `Commencer le Chemin Vivant` ouvre réellement le parcours et donne un retour visible.
- Le visiteur peut fermer avec la croix.
- Le visiteur peut fermer avec `Quitter le chemin`.
- Le visiteur peut fermer avec Escape.
- Le visiteur peut fermer en cliquant hors du panneau.
- Une fois fermé, le panneau ne bloque plus la Constellation.
- Le visiteur peut revenir plus tard via le bouton compact `Chemin Vivant`.

## Captures

Captures non produites dans cette passe locale. Les vérifications visuelles sur appareils réels sont à effectuer après merge, conformément au processus utilisé pour les derniers correctifs responsive.

## Validations

- `node --check js/livingPaths.js`
- `git diff --check`
- `git diff --cached --check`
