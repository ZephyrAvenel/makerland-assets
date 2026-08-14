# LIVING-WRITE-001 - Restaurer l'ecriture dans la Constellation

## Objectif

Verifier que la contribution locale dans la Constellation reste disponible apres les cycles SCENE, LIVING, PRESENCE et ARCH.

Le visiteur doit pouvoir :

- ecrire quelques mots ;
- les enregistrer ;
- voir sa contribution rejoindre la Constellation.

## Diagnostic

### Champ de saisie

Le champ etait toujours present dans le DOM :

- `textarea#storyInput`
- `button#shareStoryButton`
- `div#storiesContainer`

Fichier concerne :

- `index.html`

### Moteurs d'enregistrement

Les gestionnaires etaient toujours presents :

- `js/constellation.js` enregistre dans `makerland_stories` ;
- `js/travelerConstellation.js` enregistre dans `makerland:traveler-constellation` ;
- `js/livingConstellationExperience.js` affiche une reponse narrative apres partage.

La fonctionnalite n'avait donc pas ete supprimee.

### Cause du probleme

Le probleme provenait d'un masquage et d'une ambiguite UX :

- le placeholder etait rendu transparent par CSS ;
- le texte du bouton etait transparent ;
- le panneau d'ecriture n'etait pas declare comme couche active dans `LivingOverlayManager` ;
- les autres couches pouvaient prendre le dessus visuellement ;
- apres partage, plusieurs reponses pouvaient encore se concurrencer.

Le probleme etait donc une regression d'accessibilite visuelle et d'architecture de couches, pas une disparition des donnees ou du moteur de sauvegarde.

## Corrections appliquees

### Libelles visibles

Fichier :

- `index.html`

Changements :

- placeholder remplace par `Quel recit souhaitez-vous partager aujourd'hui ?` ;
- bouton remplace par `Partager mon recit`.

### Etat WRITE

Fichier :

- `js/livingOverlayManager.js`

Changements :

- ajout du raccordement du panneau `.constellation-panel` ;
- focus, saisie ou toucher activent l'etat `WRITE` ;
- clic exterieur ou Escape libere l'etat via le manager ;
- apres clic sur `Partager mon recit`, l'etat `WRITE` est libere pour laisser apparaitre la reponse narrative.

### Panneau d'ecriture visible

Fichier :

- `css/livingOverlayManager.css`

Changements :

- le panneau d'ecriture devient une carte translucide lisible ;
- le textarea et le bouton ne sont plus transparents ;
- le panneau est masque lorsqu'une autre couche active n'est ni `SKY` ni `WRITE` ;
- en portrait, le panneau devient un bottom sheet large ;
- hauteur limitee et contenu scrollable pour mieux supporter l'ouverture du clavier mobile.

### Suppression des empilements apres partage

Fichier :

- `css/livingOverlayManager.css`

Changements :

- les cartes secondaires de `travelerConstellation` sont masquees lorsqu'une couche autre que `SKY` est active ;
- le ciel et les etoiles restent visibles ;
- une seule reponse narrative reste prioritaire.

## Parcours verifie par analyse

1. Le visiteur arrive dans la Constellation.
2. Le champ `Quel recit souhaitez-vous partager aujourd'hui ?` est visible.
3. Le focus dans le champ active `WRITE`.
4. Les autres couches se ferment.
5. Le bouton `Partager mon recit` reste visible.
6. Les scripts existants enregistrent le recit.
7. La reponse narrative peut apparaitre sans superposition principale.

## Responsive

### Portrait

Le panneau d'ecriture est positionne en bas :

- largeur : environ 86 % ;
- hauteur maximale : `42dvh` ;
- textarea limite a `24dvh` ;
- bouton toujours sous le champ ;
- overflow interne disponible.

### Paysage

La position flottante existante est conservee, mais le champ et le bouton sont maintenant visibles.

## Validations

Effectuees dans l'environnement local :

- `node --check js/livingOverlayManager.js`

A executer avant merge :

- `git diff --check`
- `git diff --cached --check`
- test mobile portrait avec clavier ouvert ;
- test mobile paysage ;
- test du parcours `Comprendre -> Ecrire -> Partager` ;
- controle de `localStorage` pour `makerland:traveler-constellation`.

## Conclusion

La contribution n'avait pas ete supprimee.
Elle etait encore enregistree par les moteurs existants, mais l'interface etait devenue trop invisible et non declaree dans la nouvelle architecture a couche unique.

L'ecriture est maintenant restauree comme une couche explicite de la Constellation, compatible avec `LivingOverlayManager` et lisible sur mobile.
