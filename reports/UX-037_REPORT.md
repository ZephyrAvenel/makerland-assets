# UX-037 — Le Livre des Rencontres

## Objectif

Enrichir le Carnet de Voyage existant avec une section dédiée aux paroles des Gardiens rencontrés pendant la traversée.

La mission ne crée pas un nouveau carnet. Elle prolonge le Carnet actuel.

## Fichiers modifiés

- `js/livingGuardianWhisper.js`
- `carnet/index.html`
- `carnet/carnet.js`
- `css/placeholder.css`

## Fichiers créés

- `docs/ux/LIVING_BOOK_OF_ENCOUNTERS.md`
- `reports/UX-037_REPORT.md`

## Structure de données

Nouvelle clé locale :

- `makerland.guardianEncounters.v1`

Format :

- `version`
- `encounters`

Chaque rencontre contient :

- identifiant du Gardien ;
- nom du Gardien ;
- illustration symbolique ;
- variante graphique ;
- territoire ;
- libellé du territoire ;
- lien de retour ;
- murmure affiché ;
- date de première rencontre.

## Compatibilité des sauvegardes

Les sauvegardes existantes ne sont pas modifiées.

Si la clé `makerland.guardianEncounters.v1` est absente ou invalide, le Carnet affiche une carte d'attente.

Le système n'écrit une rencontre que lorsqu'un Gardien est réellement affiché.

## Absence de doublons

La déduplication repose sur :

`guardianId + parole`

Une même parole d'un même Gardien n'est donc jamais enregistrée deux fois.

Un même Gardien peut conserver plusieurs paroles différentes.

## Affichage dans le Carnet

Une nouvelle section apparaît dans `carnet/index.html` :

`✦ Les Paroles des Gardiens`

Elle est placée avant les mémoires principales du Carnet.

Cas vide :

- texte d'attente sans bouton ;
- aucune logique de récompense.

Cas avec rencontres :

- carte patrimoniale ;
- figure du Gardien ;
- parole ;
- territoire et date ;
- lien `Revenir dans ce territoire`.

## Navigation

Les liens de retour utilisent les destinations sauvegardées au moment de la rencontre :

- Bibliothèque / Boussole / Cartes / Forêt : retour vers `../index.html`
- Atelier : retour vers `../atelier/`
- Archives : retour vers `../atelier/archives/`
- Constellation : retour vers `../constellation/`

## Contraintes respectées

- Aucun nouveau carnet créé.
- Aucun moteur global modifié.
- Aucune navigation globale modifiée.
- Aucun BookRenderer modifié.
- Aucun ZoneRenderer modifié.
- Aucun JSON métier modifié.
- Aucune donnée envoyée à un serveur.
- Stockage local uniquement.

## Validations

- `node --check js/livingGuardianWhisper.js` : OK
- `node --check carnet/carnet.js` : OK
- `git diff --check` : OK
- `git diff --cached --check` : OK

## Notes de validation visuelle

La section utilise les styles patrimoniaux du Carnet existant.

Le sceau des Récits Vivants est rendu en filigrane discret par CSS, avec une opacité d'environ 8 %, sans introduire de nouvelle image ni de nouveau composant visuel.

La validation tactile desktop / mobile devra être confirmée dans le navigateur cible.
