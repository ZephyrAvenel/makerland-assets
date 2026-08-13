# RV-098 - Living Constellation Experience

## Objectif

Transformer la page Constellation en une experience narrative vivante qui varie localement selon la date, la saison, le moment de la journee et les traces deja deposees.

## Fichiers crees

- `js/livingConstellationExperience.js`
- `css/living-constellation-experience.css`
- `data/daily-resonances.json`
- `docs/patrimoine/LIVING_CONSTELLATION_EXPERIENCE.md`

## Fichier modifie

- `index.html`

La modification se limite au chargement du nouveau CSS et du nouveau module autonome.

## Composants ajoutes

### Resonance du jour

Une citation narrative est choisie de maniere deterministe selon la date. Elle peut etre nuancee par la saison locale issue de RV-086.

### Quatre cartes vivantes

La page affiche quatre cartes :

- Archive Vivante ;
- Concept Vivant ;
- Image patrimoniale ;
- Oeuvre en resonance.

Elles sont selectionnees depuis les donnees patrimoniales RV-091.

Les miniatures ne sont affichees que si le chemin patrimonial est local. Les chemins distants restent cites par leur titre, sans appel reseau.

### Reponse apres partage

Apres le depot d'une phrase, le module lit le fragment enrichi par RV-097 et affiche une carte narrative indiquant les premieres resonances.

### Memoire locale

Une nouvelle memoire locale est creee :

`makerland.traveler.constellation`

Elle conserve les visites, recits, concepts, archives, oeuvres et images rencontres localement.

## Sources utilisees

- `data/daily-resonances.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`
- `makerland:traveler-constellation`
- `makerland:living-cycle`
- `makerland:living-seasons`

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation globale modifiee.
- Aucun JSON metier existant modifie.
- Aucun appel serveur.
- Aucune IA distante.
- Fonctionnement entierement local.
- Respect de `prefers-reduced-motion`.

## Validation

- `node --check js/livingConstellationExperience.js` : OK.
- Validation JSON de `data/daily-resonances.json` : OK.
- `git diff --check` : OK sur les fichiers de travail.
- `git diff --cached --check` : OK.
