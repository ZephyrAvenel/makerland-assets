# CONSTELLATION-ARCH-001 - Une seule couche active a la fois

## Objectif

Refondre le fonctionnement local de la Constellation afin qu'une seule couche d'interaction soit active a la fois.
La correction ne se limite pas au CSS : elle introduit un arbitre d'etat autonome pour eviter l'empilement des panneaux.

## Cause initiale

La Constellation etait composee de plusieurs modules autonomes :

- `constellationScene.js`
- `livingConstellationExperience.js`
- `livingSky.js`
- `livingPaths.js`
- `livingExhibitions.js`

Chaque module ouvrait ou masquait ses propres panneaux sans connaitre l'etat des autres.
Resultat : une etoile, une resonance, un Chemin Vivant, une Grande Constellation et une notification pouvaient rester visibles simultanement.

## Architecture ajoutee

### LivingOverlayManager

Nouveaux fichiers :

- `js/livingOverlayManager.js`
- `css/livingOverlayManager.css`

Le gestionnaire maintient un etat unique :

- `SKY`
- `STAR`
- `CARD`
- `RELATION`
- `PATH`
- `EXHIBITION`
- `NOTICE`

Lorsqu'une couche devient active :

1. les autres couches enregistrees sont fermees ;
2. l'etat est inscrit sur `#e08_constellation` via `data-living-overlay-state` ;
3. un backdrop commun est applique ;
4. le focus est dirige vers la couche active ;
5. Escape ou un clic exterieur referme la couche lorsque cela est pertinent.

## Modules raccordes

### Scene contemplative

Fichier :

- `js/constellationScene.js`

Changements :

- la premiere etoile active l'etat `STAR` ;
- la carte suspendue active l'etat `CARD` ;
- l'eveil de la Constellation rend la main a `SKY` ;
- la fermeture d'une autre couche retire les classes de rencontre encore actives.

### Resonances du jour

Fichier :

- `js/livingConstellationExperience.js`

Changements :

- les fiches detaillees activent `RELATION` ;
- la reponse apres partage active `NOTICE` ;
- les notifications ferment les fiches existantes ;
- les blocs `Aujourd'hui` et `Resonances proposees` sont places dans la file d'attente des invitations.

### Ciel Vivant

Fichier :

- `js/livingSky.js`

Changements :

- une etoile ou un territoire ouvre une seule fiche active ;
- Escape, clic exterieur et bouton fermer referment la fiche ;
- les modes `Territoires` et `Croissance` ferment les panneaux concurrents.

### Chemins Vivants

Fichier :

- `js/livingPaths.js`

Changements :

- le Chemin Vivant active l'etat `PATH` ;
- quitter le chemin libere l'etat ;
- l'invitation `Chemin Vivant` passe dans la file d'attente.

### Grandes Constellations

Fichier :

- `js/livingExhibitions.js`

Changements :

- l'exposition active l'etat `EXHIBITION` ;
- sa fermeture libere l'etat ;
- l'invitation `Grande Constellation` passe dans la file d'attente.

## File d'attente des notifications

Le manager fournit une file unique pour les invitations de surface.

Avant :

- `Aujourd'hui`
- `Resonances proposees`
- `Chemin Vivant`
- `Grande Constellation`

pouvaient apparaitre ensemble.

Apres :

- une seule invitation est visible ;
- les autres attendent leur tour ;
- toute couche active suspend la file ;
- la file reprend uniquement lorsque l'etat revient a `SKY`.

## Responsive

### Portrait

Le CSS du manager impose une strategie commune aux couches actives :

- bottom sheet ;
- largeur proche de 90 % ;
- hauteur limitee a environ 78 % ;
- `overflow:auto` ;
- backdrop unique ;
- decor encore visible.

Largeurs visees :

- 360 px ;
- 390 px ;
- 412 px ;
- tablette portrait.

### Paysage

Les cartes flottantes existantes sont conservees.
Le manager n'impose pas de bottom sheet en paysage.

## Captures

Captures automatiques non produites dans cet environnement.

Plan de verification visuelle a executer manuellement :

- 360 px portrait : une seule couche visible, bottom sheet scrollable ;
- 390 px portrait : aucune superposition texte/panneau ;
- 412 px portrait : fond visible derriere la couche active ;
- tablette portrait : couche centree en bas, hauteur limitee ;
- paysage : cartes flottantes conservees.

## Fichiers modifies

- `index.html`
- `js/livingOverlayManager.js`
- `css/livingOverlayManager.css`
- `js/constellationScene.js`
- `js/livingConstellationExperience.js`
- `js/livingSky.js`
- `js/livingPaths.js`
- `js/livingExhibitions.js`

## Validations

- `node --check js/livingOverlayManager.js`
- `node --check js/livingConstellationExperience.js`
- `node --check js/livingSky.js`
- `node --check js/livingPaths.js`
- `node --check js/livingExhibitions.js`
- `node --check js/constellationScene.js`
- `git diff --check`
- `git diff --cached --check`

## Resultat

La Constellation dispose maintenant d'un systeme d'etat centralise.
Les modules restent autonomes, mais leurs couches visibles ne peuvent plus s'empiler sans coordination.
Le paysage conserve la priorite : les interactions apparaissent, se ferment, puis rendent le ciel au visiteur.
