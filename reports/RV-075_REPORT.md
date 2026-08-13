# RV-075 - Le Cycle Vivant des Recits

## Resume

La mission relie l'Atelier IA et la Constellation des Recits Vivants par une grammaire commune: une intuition devient creation, puis oeuvre, rencontre, recit partage et nouvelle intuition.

## Cycle Vivant

Une frise discrete a ete ajoutee dans l'Atelier principal:

- Dialoguer
- Cartographier
- Imaginer
- Clarifier
- Faire evoluer
- Partager dans la Constellation

La derniere etape ouvre la Constellation sans modifier la navigation globale.

## Constellation

La page principale de la Constellation contient maintenant:

- une section `Comment nait un recit ?`;
- un lien vers l'Atelier;
- une section finale `Et maintenant ?`;
- un lien `Retourner a l'Atelier`.

Les pages internes de la Constellation recoivent egalement le fil narratif et un echo discret.

## Echos entre lieux

Un script local `atelier/living-cycle.js` ajoute:

- un fil d'Ariane narratif;
- un echo discret entre Atelier et Constellation;
- une trace symbolique du voyage.

Le script ne modifie ni Navigation, ni ZoneRenderer, ni les moteurs existants.

## Memoire symbolique

La memoire locale utilise `localStorage` sous la cle `makerland:living-cycle`.

Elle conserve:

- les chambres de l'Atelier explorees;
- les fragments de la Constellation visites;
- les objets vivants consultes.

Il ne s'agit pas d'un score. La presentation parle de trace du voyage.

## Fichiers modifies

- `atelier/index.html`
- `atelier/dialogue/index.html`
- `atelier/cartographie/index.html`
- `atelier/images/index.html`
- `atelier/clarification/index.html`
- `atelier/evolution/index.html`
- `atelier/atelier-objects.js`
- `atelier/living-cycle.js`
- `constellation/index.html`
- `constellation/carnet/index.html`
- `constellation/comment/index.html`
- `constellation/collectif/index.html`
- `constellation/recit-001/index.html` a `constellation/recit-012/index.html`
- `css/placeholder.css`

## Contraintes respectees

- Aucune illustration modifiee.
- Navigation globale conservee.
- Aucun moteur modifie.
- Identite graphique conservee.
- Ajouts limites aux pages Atelier / Constellation et au CSS partage de ces pages.

## Validation

- `node --check atelier/living-cycle.js`: OK.
- `node --check atelier/atelier-objects.js`: OK.
- `git diff --check`: OK.
- Verification ASCII des fichiers modifies: OK.

## Extension future

La structure pourra relier progressivement livres, articles, cartes narratives, oeuvres immersives, fragments de Constellation et dialogues d'Atelier sans refonte: chaque contenu pourra declarer ses relations dans une future couche de donnees.
