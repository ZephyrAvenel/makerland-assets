# RV-017 - Espacement responsive des sous-bibliotheques

## Resume

RV-017 corrige uniquement le placement vertical du bouton de retour dans les sous-bibliotheques immersives en mode paysage mobile.

Le panneau immersif RV-016 est conserve. Les cartes, les donnees et les moteurs ne sont pas modifies.

## Probleme identifie

En paysage Android, le bouton `< Retour a la Bibliotheque principale` etait place en haut du viewport tandis que le panneau immersif commencait trop pres du meme bord.

Le titre de la salle pouvait donc passer sous le bouton.

## Correction appliquee

Dans `css/bookRenderer.css`, la media query paysage compact reserve maintenant une zone verticale pour le bouton retour:

- le bouton reste au-dessus du panneau;
- sa hauteur reste responsive;
- le panneau commence apres le bouton avec un espacement dynamique;
- le titre reste dans le flux du panneau;
- la safe area superieure et inferieure reste prise en compte.

La correction evite les coordonnees fixes en pixels pour le decalage principal et utilise `clamp()`, `calc()` et `env(safe-area-inset-*)`.

## Fichiers modifies

- `css/bookRenderer.css`
- `reports/RV-017_REPORT.md`

## Fichiers non modifies

- `js/bookRenderer.js`
- `data/library-extensions.json`
- `data/library-layout.json`
- `data/livres-v2.json`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/zoneRenderer.js`
- `js/app.js`

## Validations effectuees

- JavaScript: aucune modification.
- JSON: aucun fichier JSON modifie.
- Controle de diff sur les fichiers interdits: aucun changement.
- Verification responsive ciblee par les regles CSS:
  - Android portrait: regle portrait conservee.
  - Android paysage: bouton retour au-dessus du panneau.
  - iPhone portrait: regle portrait conservee.
  - iPhone paysage: espacement adapte aux safe areas.
  - tablette: pas de modification hors paysage compact.
  - desktop: pas de modification.

La verification navigateur locale a ete tentee, mais le serveur statique lance dans l'environnement de travail ne restait pas disponible pour le navigateur integre. La correction reste limitee au CSS et controlee par diff.

## Resultat attendu

Les sous-bibliotheques donnent toujours l'impression d'une salle independante, sans superposition parasite, et le titre reste visible meme lorsque la hauteur disponible est reduite.
