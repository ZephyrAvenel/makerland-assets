# UX-014 — Finalisation de la Constellation et du Carnet de Voyage

## Objectif

Finaliser la navigation des modules Constellation et Carnet de Voyage afin d'eviter les impasses constatees sur tablette Android, sans modifier les moteurs globaux ni les parcours principaux de Makerland.

## Problemes detectes

### Fenetre Constellation impossible a quitter clairement

Le panneau du Ciel Vivant (`js/livingSky.js`) affichait les details d'une etoile ou d'une constellation dans `.living-sky__panel`, mais ne proposait aucun bouton de fermeture visible. La fermeture par clic exterieur, touche Escape ou retour Android n'etait pas geree explicitement.

### Boutons Ouvrir incomplets dans les Chemins Vivants

Dans `js/livingPaths.js`, certaines etapes issues de `data/living-paths.json` possedaient seulement un `kind` et des `resourceHints`, sans `target` ni `href`. Ces etapes affichaient donc parfois un parcours lisible mais sans destination ouvrable.

Etapes concernees :

- archives (`D001`, `D003`, `D004`, `D007`) ;
- concepts ;
- oeuvres ;
- images patrimoniales ;
- figures.

### Dialogues D001-D010 peu reaccessibles

Les pages `atelier/archives/d001.html` a `d010.html` existaient, mais le Carnet ne proposait pas de section claire permettant de retrouver les dialogues rencontres ou de reprendre une archive precise.

## Corrections apportees

### Fermeture du panneau Constellation

Fichiers modifies :

- `js/livingSky.js`
- `css/livingSky.css`

Ajouts :

- bouton `Fermer` visible sous forme de X ;
- fermeture par clic exterieur ;
- fermeture par touche `Escape` ;
- fermeture par bouton Retour Android via une entree `history.pushState` locale ;
- conservation de l'ecran precedent, sans rechargement et sans perte de l'etat du Ciel Vivant.

### Resolution des boutons Ouvrir

Fichier modifie :

- `js/livingPaths.js`

Les etapes sans destination explicite recoivent maintenant une destination derivee de leur type :

- `archive` -> `atelier/archives/dNNN.html`
- `concept` -> `constellation/vivante/`
- `work` -> ecran `e06_fiction`
- `image` -> `docs/patrimoine/IMAGE_CATALOG.md`
- `figure` -> `docs/patrimoine/FIGURE_CATALOG.md`

Les boutons qui ouvrent un ecran interne ferment aussi le panneau des Chemins Vivants avant la navigation afin de ne pas laisser d'overlay au-dessus du nouvel ecran.

### Carnet -> Dialogues rencontres

Fichiers modifies :

- `atelier/archives/archive-volume.js`
- `carnet/index.html`
- `carnet/carnet.js`
- `css/placeholder.css`

Ajouts :

- memorisation locale de chaque archive D001-D010 consultee dans `makerland:living-cycle.archiveDialogs` ;
- nouvelle section `Dialogues rencontres` dans le Carnet ;
- affichage de `D001` a `D010` avec titre, etat, derniere visite et bouton `Reprendre` ;
- style discret pour distinguer les dialogues deja rencontres sans logique de score.

## Routes verifiees

Un controle local des `href` dans `atelier/`, `constellation/` et `carnet/` confirme que les routes statiques existent.

Routes particulierement verifiees :

- `atelier/archives/d001.html` a `atelier/archives/d010.html`
- `atelier/dialogue/`
- `atelier/cartographie/`
- `atelier/images/`
- `atelier/clarification/`
- `atelier/evolution/`
- `carnet/`
- `carnet/rencontres/`
- `constellation/`
- `constellation/chemin/`
- `constellation/fonctionnement/`
- `constellation/transmission/`
- `constellation/temoignages/`
- `constellation/vivante/`

## Parcours verifie

Le parcours demande reste relie par les liens existants :

Bibliotheque -> Atelier -> Dialogue -> Cartographie -> Images -> Clarification -> Evolution -> Carnet -> Rencontres -> retour Bibliotheque.

Chaque page du parcours possede au minimum un retour ou une poursuite vers un autre lieu.

## Validations effectuees

- `node --check js/livingSky.js` : OK
- `node --check js/livingPaths.js` : OK
- `node --check carnet/carnet.js` : OK
- `node --check atelier/archives/archive-volume.js` : OK
- Audit local des liens `atelier/`, `constellation/`, `carnet/` : OK
- `git diff --check` : a executer avant commit final

## Anomalies restantes

Le test a ete effectue par verification statique et syntaxique locale. Aucun appareil Android physique n'est connecte dans cet environnement ; les comportements Android specifiques reposent donc sur l'implementation standard `history.pushState` / `popstate`, concue pour intercepter le bouton Retour systeme lorsqu'un panneau Constellation est ouvert.

## Impact fonctionnel

Aucun moteur global n'a ete modifie :

- Navigation globale : non modifiee
- BookRenderer : non modifie
- ZoneRenderer : non modifie
- NarrativeMemory : non modifie
- LivingEcho : non modifie
- JSON metier : non modifie

Les changements restent limites aux modules autonomes Constellation, Chemins Vivants, Archives Vivantes et Carnet.
