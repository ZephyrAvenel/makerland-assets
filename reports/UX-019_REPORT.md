# UX-019 - Le Fil Rouge de Makerland

## Synthese

UX-019 ajoute une couche narrative autonome qui accompagne les grands ecrans de Makerland.

Le visiteur comprend progressivement qu'il traverse un meme territoire de creation :

Intuition -> Atelier -> Oeuvre -> Memoire -> Liens -> Transmission.

## Ecrans enrichis

- `e03_boussole`
- `e04_oeuvre`
- `e05_cartes`
- `e06_fiction`
- `e06_essais`
- `e07_atelier`
- `e08_constellation`
- `e09_voyage`

L'accueil `e01_accueil` reste pilote par UX-018 afin d'eviter une surcharge sur le seuil. La Meteo interieure `e02_meteo` conserve egalement sa mise en scene dediee afin de ne pas concurrencer le titre et les choix meteo sur mobile paysage.

## Elements ajoutes

- phrase de role du lieu ;
- encadre `Pourquoi cette salle ?` ;
- carte simple du territoire ;
- proposition de suite non obligatoire ;
- phrases de transition entre grands lieux.

## Transitions ajoutees

- Bibliotheque -> Atelier : `Derriere chaque oeuvre existe un atelier.`
- Atelier -> Archives : `Chaque creation laisse une memoire.`
- Atelier -> Constellation : `Les coulisses commencent a reveler leurs liens.`
- Archives -> Constellation : `Les memoires revelent des liens invisibles.`
- Constellation -> Carnet : `Chaque rencontre devient une trace de votre voyage.`
- Boussole -> Cartes : `Une direction devient une premiere carte.`
- Cartes -> Bibliotheque : `Les cartes ouvrent vers les oeuvres.`
- Boussole -> Atelier : `Une intention peut rejoindre les coulisses de la creation.`
- Boussole -> Constellation : `Chercher un repere, c'est deja suivre un lien.`

## Fichiers modifies

- `index.html`
- `css/narrativeThread.css`
- `js/narrativeThread.js`
- `docs/ux/NARRATIVE_THREAD.md`
- `reports/UX-019_REPORT.md`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucun JSON metier modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucune logique des Chemins Vivants modifiee.
- Couche autonome uniquement.

## Validation

- Les encadres sont non bloquants (`pointer-events:none`) sauf boutons de suite.
- Les transitions ne bloquent pas la navigation.
- La carte du territoire met en evidence le lieu actuel.
- Mobile portrait : le fil se reduit au role du lieu.
- Mobile paysage : le fil reste compact et masque la carte si necessaire.
- Desktop : role, pourquoi, carte et suite sont visibles sans couvrir le centre de la scene.
- Accueil et Meteo : aucun encadre UX-019 visible, afin de preserver les seuils existants.
- Boussole -> Cartes : bouton de suite teste, navigation correcte et transition visible.

## Validations techniques

- `node --check js/narrativeThread.js` : OK.
- `git diff --check` : OK, avec avertissement CRLF attendu sur `index.html`.
- Verification locale : desktop, smartphone portrait et smartphone paysage via serveur local `127.0.0.1:8765`.

## Limite volontaire

UX-019 concerne le shell principal Makerland. Les pages internes Atelier, Archives et Carnet possedent deja leurs breadcrumbs et textes de contexte ; leur enrichissement detaille pourra faire l'objet d'une mission dediee.
