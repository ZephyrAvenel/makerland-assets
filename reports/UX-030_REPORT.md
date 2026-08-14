# UX-030 - Passeport du Premier Voyage

## Objectif

Transformer la fin du Premier Voyage en rite de passage.

Le visiteur ne quitte plus simplement la septieme etape. Il recoit un Passeport du Voyageur avant d'entrer dans la Foret de l'Arche.

## Carte de conclusion

La conclusion affiche maintenant :

- `Vous avez franchi les Sept Portes` ;
- `Votre premier voyage est accompli.` ;
- la liste des sept lieux traverses ;
- la citation `Un territoire ne s'apprend pas. Il s'habite.` ;
- une carte patrimoniale `Passeport du Voyageur`.

## Passeport du Voyageur

Le Passeport affiche :

- `Premier Voyage : accompli` ;
- `Sept portes franchies.` ;
- `Premier seuil traverse.` ;
- la date du jour, quand elle est disponible via le navigateur.

## Sauvegarde locale

Au moment ou le Passeport est remis, `makerland.firstJourney` est mis a jour avec :

- `completed: true` ;
- `completedAt: <timestamp ISO>` ;
- `version: 1` ;
- `active: false`.

Ce choix garantit que le Premier Voyage ne peut pas se relancer automatiquement au demarrage.

## Accueil

Quand `makerland.firstJourney.completed` est vrai, la porte `Je decouvre` devient :

`Premier Voyage accompli ✓`

Elle affiche le sous-texte :

`Vous pouvez recommencer ce voyage ou poursuivre librement votre exploration.`

L'action reste volontaire : le visiteur peut revoir le Premier Voyage, mais aucun redemarrage automatique n'est declenche.

## Boutons

Le Passeport propose :

- `Entrer dans la Foret de l'Arche` ;
- `Explorer librement` ;
- `Retour au Seuil`.

## Fichiers modifies

- `js/firstJourney.js`
- `js/livingHome.js`
- `css/firstJourney.css`
- `css/livingHome.css`
- `reports/UX-030_REPORT.md`

## Contraintes respectees

- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucun JSON metier modifie.
- Aucune navigation globale modifiee.
- Aucun moteur global modifie.

## Validations

- `node --check js/firstJourney.js` : OK.
- `node --check js/livingHome.js` : OK.
- `git diff --check` : OK.
- `git diff --cached --check` : OK.
- Premier Voyage complet : controle statique OK.
- Retour sur l'accueil : controle statique OK.
- Statut memorise : `completed`, `completedAt` et `version` sont ecrits lors de la remise du Passeport.
- Revoir le Premier Voyage : la porte d'accueil declenche a nouveau la page intermediaire, puis repart de l'etape 1.
- Aucune reprise automatique : le Passeport marque `active: false`, et l'accueil ne relance jamais le parcours sans action explicite.

## Note de validation visuelle

La validation navigateur reelle reste a effectuer hors de cet environnement. Les controles effectues ici couvrent la syntaxe JavaScript, le diff Git, la coherence du flux et l'absence de modification des moteurs globaux.
