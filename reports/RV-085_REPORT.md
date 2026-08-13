# RV-085 - Resonance des Lieux

## Objectif

RV-085 introduit une couche autonome de resonance locale entre les lieux de Makerland. Les pages ne sont plus seulement des espaces juxtaposes : elles suggerent maintenant des liens, gardent des fragments voyageurs et composent une petite constellation personnelle a partir du parcours reel du visiteur.

## Fichiers modifies

- `atelier/living-resonance.js`
- `atelier/atelier-objects.js`
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
- `css/placeholder.css`

## Nouveau composant

### `atelier/living-resonance.js`

Ce composant est autonome. Il lit uniquement la memoire locale `makerland:living-cycle` et injecte, lorsque la page le permet :

- des cartes de resonance ;
- une constellation personnelle ;
- un fragment voyageur rare ;
- des fils dores tres discrets entre les cartes.

Il ne modifie aucune navigation globale et ne depend d'aucun serveur.

## Resonances creees

### Atelier

- Dialogue -> Cartographie, Transmission, Carnet.
- Cartographie -> Chemin, Fonctionnement, Dialogue.
- Images -> Clarification, Carnet, Constellation.
- Clarification -> Dialogue, Evolution, Transmission.
- Evolution -> Transmission, Constellation, Carnet.

### Constellation

- Constellation -> Atelier, Transmission, Carnet.
- Chemin -> Cartographie, Carnet, Fonctionnement.
- Fonctionnement -> Transmission, Atelier, Carnet.
- Transmission -> Evolution, Dialogue, Carnet.
- Temoignages -> Carnet, Chemin, Atelier.

### Carnet

- Carnet -> Atelier, Constellation, Transmission.

## Constellation personnelle

Le composant lit `visitedPlaces` dans `makerland:living-cycle` et affiche les cinq derniers lieux traverses sous forme de constellation lineaire. La carte evolue automatiquement au fil des visites.

## Fragments voyageurs

Certaines phrases liees aux salles peuvent reapparaitre tres rarement dans un autre contexte. Le dernier fragment affiche est memorise dans :

`makerland:traveling-fragment:last`

Cette cle evite la repetition immediate. Les fragments decouverts peuvent aussi etre ajoutes a `travelingFragments` dans `makerland:living-cycle`.

## Objets relationnels

`atelier/atelier-objects.js` ajoute une resonance discrete dans les fiches d'objets vivants, par exemple :

- Carnet de dialogue -> Transmission.
- Premiere question -> Cartographie.
- Carte narrative -> Chemin.
- Journal des versions -> Transmission.

Ces liens sont locaux, explicites et n'utilisent aucun JSON metier.

## Fils invisibles

Les fils dores sont purement CSS :

- lignes tres fines ;
- animation lente ;
- `pointer-events: none` ;
- respect de `prefers-reduced-motion`.

Ils servent de signe visuel faible entre les cartes de resonance.

## Contraintes respectees

- Aucun serveur.
- Aucune IA.
- Aucune donnee externe.
- Aucun changement de Navigation.
- Aucun changement de BookRenderer.
- Aucun changement de ZoneRenderer.
- Aucun changement de NarrativeMemory.
- Aucun changement de LivingEcho.
- Aucun pack narratif modifie.
- Aucun JSON metier modifie.

## Validation

- `node --check atelier/living-resonance.js` : OK.
- `node --check atelier/atelier-objects.js` : OK.
- `git diff --check` : OK.

## Pistes RV-086

- Declarer les resonances dans un petit fichier de configuration non metier.
- Etendre les fragments voyageurs aux pages recit de la Constellation.
- Ajouter des resonances entre livres de la Bibliotheque et chambres de l'Atelier.
- Permettre au Carnet d'afficher les fragments voyageurs deja rencontres.
- Ajouter une option locale pour effacer les resonances memorisees.
