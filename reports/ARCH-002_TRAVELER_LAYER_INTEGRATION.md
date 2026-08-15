# ARCH-002 - Integration de Traveler Constellation dans LivingOverlayManager

## Objectif

Corriger la coexistence entre le panneau `traveler-constellation__paths`, l'etat `NOTICE` et le panneau narratif inferieur de la Constellation.

Le rapport UX-FORENSICS-002 avait identifie que `Chemins ouverts` restait rendu comme panneau autonome apres `PARTAGER MON RECIT`, ce qui produisait le texte fantome visible en tablette paysage.

## Correction appliquee

### 1. Suppression du rendu automatique de `Chemins ouverts`

Fichier : `js/travelerConstellation.js`

Le bloc `traveler-constellation__paths` n'est plus cree dans le HTML initial de la couche `TravelerConstellation`.

Avant :

```html
<article class="traveler-constellation__paths" data-traveler-paths></article>
```

Apres :

Le noeud n'existe plus au chargement et n'est plus reconstruit par `render()` apres chaque partage.

### 2. Creation d'une couche volontaire

De nouvelles fonctions locales encadrent cette couche :

- `ensurePathsLayer()`
- `registerPathsOverlay()`
- `openPaths()`
- `closePaths()`

`Chemins ouverts` devient donc une couche ouvrable explicitement, et non plus un panneau permanent.

### 3. Fermeture avant partage

Lors du clic sur `#shareStoryButton`, `closePaths()` est appele avant l'enregistrement du fragment.

Effet attendu :

- la reponse de partage devient la seule couche visible ;
- `Chemins ouverts` reste ferme ;
- il ne reapparait pas automatiquement lorsque `NOTICE` se termine.

### 4. Integration a LivingOverlayManager

Fichier : `css/livingOverlayManager.css`

Un nouvel etat est prepare :

```text
TRAVELER_PATHS
```

Lorsque cette couche est ouverte volontairement, elle peut etre placee au meme niveau de pile que les autres couches gerees par l'OverlayManager.

Le selecteur existant qui neutralise les couches secondaires pendant les etats non-SKY a ete ajuste pour ne pas masquer sa propre couche lorsque l'etat actif est `TRAVELER_PATHS`.

## Pourquoi cela corrige le texte fantome

Le texte fantome venait du fait que `renderPaths()` etait appele automatiquement par `render()` apres chaque partage.

La correction retire cette causalite :

```text
PARTAGER MON RECIT
-> saveFragment()
-> render()
-> renderSky()
-> renderCard()
-> renderMemory()
```

`renderPaths()` n'est plus appele dans ce flux.

Le panneau `Chemins ouverts` ne peut donc plus reapparaitre sous le panneau `Vous pouvez maintenant` pendant ou apres l'overlay de succes.

## Contraintes respectees

- Aucun changement de navigation.
- Aucun changement du systeme Android de saisie.
- Aucun changement du textarea.
- Aucun changement de focus.
- Aucun masquage permanent ajoute par `display:none`, `opacity:0` ou `visibility:hidden`.
- Le rendu existant de `Chemins ouverts` reste disponible pour une ouverture volontaire future.

## Fichiers modifies

- `js/travelerConstellation.js`
- `css/livingOverlayManager.css`
- `reports/ARCH-002_TRAVELER_LAYER_INTEGRATION.md`

## Validations

Commandes executees :

```text
node --check js/travelerConstellation.js
git diff --check
git diff --cached --check
```

Validation responsive :

- Desktop : logique de couche conservee, aucun rendu automatique de `Chemins ouverts`.
- Tablette portrait : le comportement mobile existant reste intact.
- Tablette paysage : `Chemins ouverts` n'est plus regenere apres partage.
- Android : aucune modification du textarea, du focus natif ou du clavier.

Les validations navigateur sur appareil reel restent a confirmer manuellement apres deploiement, comme pour les missions Android precedentes.
