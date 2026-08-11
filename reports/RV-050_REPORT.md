# RV-050 - Mode immersif plein ecran

Date : 2026-08-11

Branche : `agent/rv-050-immersive-fullscreen`

## Verification PWA prealable

Le depot ne contient pas actuellement de configuration PWA :

- aucun `manifest.json` ou `.webmanifest` detecte ;
- aucun service worker detecte ;
- aucun lien `<link rel="manifest">` dans `index.html` ;
- aucun `meta theme-color` detecte ;
- seul le meta viewport existe deja.

Ces elements pourraient etre ajoutes dans une mission future pour renforcer l'immersion en mode installe (`display: fullscreen` ou `display: standalone`), mais ils sont hors perimetre RV-050.

## Implementation

Le mode immersif a ete ajoute dans `js/app.js` sous forme de fonctions dediees :

- `bindImmersiveMode()`
- `requestImmersiveFullscreen()`
- `isFullscreenActive()`

Le plein ecran est demande uniquement apres une interaction utilisateur :

- `pointerdown`
- `touchstart`
- `click`

La demande est capturee une seule fois. Un garde-fou `immersiveFullscreenRequested` evite les tentatives multiples sur le meme geste.

## Compatibilite

La fonction utilise :

- `requestFullscreen`
- `webkitRequestFullscreen`
- `fullscreenElement`
- `webkitFullscreenElement`

Si l'API n'existe pas, Makerland continue normalement.
Si le navigateur refuse la demande, l'erreur est silencieusement ignoree afin de conserver le parcours existant.

## Scenarios attendus

- Plein ecran accepte : l'application passe en mode immersif apres la premiere interaction.
- Plein ecran refuse : aucune erreur visible, navigation normale.
- Ouverture portrait : comportement identique, avec tentative plein ecran au premier geste.
- Ouverture paysage : comportement identique, avec tentative plein ecran au premier geste.
- Rotation portrait vers paysage : RV-048/RV-049 restent inchanges.
- Rotation paysage vers portrait : RV-048/RV-049 restent inchanges.

## Contraintes respectees

- Aucun HTML modifie.
- Aucun CSS modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune destination modifiee.
- Aucun timing RV-043 modifie.
- Aucune animation modifiee.

## Validation

- `node --check js/app.js` : OK.
- `git diff --check` : OK.
