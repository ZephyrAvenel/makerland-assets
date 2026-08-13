# UX-027 - La Foret de l'Arche

## Objectif

Ajouter un epilogue narratif au Premier Voyage afin que la decouverte des cinq lieux fondateurs conduise naturellement vers la Foret de l'Arche, seuil de l'Oeuvre immersive.

## Nouvelle etape creee

Apres la cinquieme etape, le parcours affiche d'abord la conclusion existante.

Un bouton `Continuer vers la Foret de l'Arche` ouvre ensuite une carte epilogue sur la salle existante `e04_oeuvre`.

Cette carte contient :

- titre : `La Foret de l'Arche` ;
- sous-titre : `Le seuil de l'Oeuvre immersive` ;
- texte narratif complet demande dans la mission ;
- bouton principal : `Entrer dans l'Oeuvre immersive` ;
- bouton secondaire : `Retour au Territoire` ;
- bouton tertiaire : `Explorer librement`.

## Comportement

- `Entrer dans l'Oeuvre immersive` termine le Premier Voyage et laisse le visiteur dans la salle existante de la Foret de l'Arche.
- `Retour au Territoire` termine le Premier Voyage et revient au Seuil des Recits Vivants.
- `Explorer librement` conserve le comportement de sortie libre en refermant la couche du Premier Voyage.

## Fichiers modifies

- `js/firstJourney.js`
- `css/firstJourney.css`
- `docs/ux/FOREST_THRESHOLD.md`
- `reports/UX-027_REPORT.md`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucune navigation generale modifiee.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucune nouvelle image creee.

## Validation

- Parcours controle statiquement : Seuil -> page intermediaire -> etapes 1 a 5 -> conclusion -> Foret de l'Arche -> entree dans l'Oeuvre immersive.
- La nouvelle etape utilise la salle existante `e04_oeuvre`; aucune route ni destination globale n'a ete changee.
- Le bouton `Entrer dans l'Oeuvre immersive` referme la couche du Premier Voyage et laisse le visiteur dans la Foret de l'Arche existante.
- Le bouton `Retour au Territoire` revient vers `e01_accueil`.
- Le bouton `Explorer librement` conserve la sortie libre du parcours.
- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.

## Note de validation visuelle

Une tentative de verification via navigateur local integre a expire dans l'environnement Codex. La validation livree repose donc sur les controles statiques, la lecture du flux JavaScript et les verifications Git.
