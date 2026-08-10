# Territoires Makerland

## Intention

Ce document cartographie les territoires deja presents dans Makerland.
Il ne propose pas d'ajouter de nouveaux espaces.
Il cherche a rendre lisible ce qui existe deja afin de relier les lieux avant d'en creer d'autres.

La Boussole Vivante reste le coeur du parcours.
Les territoires ci-dessous sont analyses comme des lieux possibles de l'Architecture de l'Hospitalite Narrative.

## Sources analysees

- `index.html`
- `data/zones-v3-final-beta.json`
- `data/livres-v2.json`
- `ecrans/*.png`
- `covers/*.jpg`
- `qr/*.png`
- `js/zoneRenderer.js`
- `js/bookRenderer.js`
- `js/constellation.js`
- `js/uiRenderer.js`

## Inventaire des ecrans

| Ecran | Image | Etat JSON | Zones JSON | Fonction actuelle | Etat d'usage |
| --- | --- | --- | ---: | --- | --- |
| `e01_accueil` | `ecran-1-accueil.png` | `measured` | 1 | Accueil et entree dans l'experience | Utilise |
| `e02_meteo` | `ecran-2-question.png` | `measured` | 5 | Meteo interieure | Utilise |
| `e03_boussole` | `ecran-3-boussole.png` | `beta` | 1 | Boussole Vivante, accueil narratif, direction suggeree | Utilise |
| `e04_oeuvre` | `ecran-4-oeuvre.png` | `draft` | 0 | Image de foret avec seuil lumineux | Present, non relie par zones internes |
| `e05_cartes` | `ecran-5-cartes.png` | `draft` | 0 | Cartes narratives et portes d'exploration | Present, non interactif |
| `e06_fiction` | `ecran-6-fiction.png` | `draft` | 0 | Rayon Fiction de la Bibliotheque Vivante | Present, rendu livres actif si accessible |
| `e06_essais` | `ecran-6-essais.png` | `draft` | 0 | Rayon Essais de la Bibliotheque Vivante | Present, rendu livres actif si accessible |
| `e06_atlas` | `ecran-6-atlas.png` | `draft` | 0 | Rayon Atlas de la Bibliotheque Vivante | Present, rendu livres actif si accessible |
| `e06_portes` | `ecran-6-portes-ouvertes.png` | `draft` | 0 | Rayon Portes ouvertes de la Bibliotheque Vivante | Present, rendu livres actif si accessible |
| `e07_atelier` | `ecran-7-atelier.png` | `beta` | 6 | Atelier IA, creation, clarification, cartographie | Present, actions non raccordees |
| `e08_constellation` | `ecran-8-constellation.png` | `beta` | 3 | Constellation locale de recits partages | Present, module local existant |
| `e09_voyage` | `ecran-9-voyage.png` | `beta` | 4 | Sorties externes, blog, portail, QR central | Present, partiellement actionnable |

Toutes les images d'ecran mesurent `1536 x 1024`.
Les trois QR Codes locaux mesurent `450 x 450`.

## Tableau de correspondance narrative

| Ecran | Fonction actuelle | Peut devenir | Niveau de preparation |
| --- | --- | --- | --- |
| `e01_accueil` | Accueil | Le Seuil | A - Deja pret |
| `e02_meteo` | Choix de meteo interieure | Meteo interieure | A - Deja pret |
| `e03_boussole` | Boussole Vivante | Coeur d'orientation | A - Deja pret |
| `e04_oeuvre` | Foret, chemin, arche lumineuse | Explorer | B - A enrichir |
| `e05_cartes` | Choix visuel de cartes narratives | Decouvrir | B - A enrichir |
| `e06_fiction` | Bibliotheque, fictions symboliques | Contempler / Bibliotheque Vivante | B - A enrichir |
| `e06_essais` | Bibliotheque, essais | Contempler / Bibliotheque Vivante | B - A enrichir |
| `e06_atlas` | Bibliotheque, atlas | Trouver un repere / Bibliotheque Vivante | B - A enrichir |
| `e06_portes` | Bibliotheque, textes ouverts et carnets | Trouver un repere / Ressources ouvertes | B - A enrichir |
| `e07_atelier` | Atelier IA et creation | Creer | B - A enrichir |
| `e08_constellation` | Recits de passage, traces locales | Trouver un repere / Resonances | B - A enrichir |
| `e09_voyage` | Continuation, liens externes, QR | Sortie douce / Emporter l'oeuvre | B - A enrichir |

Ce tableau est fonde sur les noms, textes visibles, images, donnees JSON et modules presents dans le depot.
Il ne suppose pas l'existence de contenus absents.

## Analyse narrative par territoire

### `e01_accueil` - Le Seuil

Role actuel: premier ecran du parcours, avec une zone `entrer` pilotee par `ZoneRenderer`.

Ressenti: entree claire, calme, deja ritualisee.

Integration: tres forte. Le visiteur ne choisit pas encore une fonction; il franchit un seuil.

Etat: suffisamment abouti pour rester le point d'entree.

Ajustements souhaitables: maintenir le bouton visible comme rendu de zone JSON, sans reintegrer d'ancien systeme.

### `e02_meteo` - Meteo interieure

Role actuel: choix de cinq paysages interieurs: eclaircie, transition, je ne sais pas, brouillard, tempete.

Ressenti: choix non evaluatif, sensible, sans questionnaire.

Integration: tres forte. La meteo nourrit la Boussole, la Memoire Vivante et les Echos Vivants.

Etat: suffisamment abouti.

Ajustements souhaitables: conserver la sobriete et surveiller la lisibilite responsive.

### `e03_boussole` - Boussole Vivante

Role actuel: lieu central d'accueil, texte contextualise par la meteo, directions organiques, memoire et echos.

Ressenti: arrivee dans un lieu habitable.

Integration: coeur de l'architecture.

Etat: fonctionnel, mais les directions organiques ne sont pas encore reliees individuellement a des territoires.

Ajustements souhaitables: relier les cinq directions aux territoires existants via le JSON, sans modifier le moteur.

### `e04_oeuvre` - Explorer

Role actuel: image immersive de foret, chemin et arche lumineuse.

Ressenti: appel a entrer dans un territoire calme, vegetal et lumineux.

Integration: bon candidat pour `Explorer`, car l'image propose deja un chemin et une traversee.

Etat: present mais incomplet: aucune zone JSON interne.

Ajustements souhaitables: ajouter plus tard des zones JSON minimales pour poursuivre, revenir ou ouvrir un contenu d'oeuvre.

### `e05_cartes` - Decouvrir

Role actuel: image de cartes narratives avec quatre portes: Atlas, Marges vivantes, Boussole, Territoires habitables.

Ressenti: choix, tirage, exploration possible.

Integration: bon candidat pour `Decouvrir`, car l'ecran presente explicitement des portes.

Etat: present mais non interactif: aucune zone JSON.

Ajustements souhaitables: raccorder chaque carte par zone JSON, puis clarifier la destination reelle de chaque carte.

### `e06_*` - Bibliotheque Vivante

Role actuel: quatre ecrans de rayons: fictions, essais, atlas, portes ouvertes.

Ressenti: consultation, approfondissement, halte dans les ressources.

Integration: territoire transversal plutot qu'une seule direction. Il peut servir `Contempler`, `Trouver un repere` et prolonger `Decouvrir`.

Etat: les conteneurs HTML existent et `BookRenderer` rend les livres depuis `data/livres-v2.json`.
Les ecrans ne possedent toutefois aucune zone JSON et ne sont pas raccordes depuis la Boussole.

Ajustements souhaitables: creer plus tard une entree JSON vers le rayon pertinent, puis transformer les controles de navigation de la bibliotheque en zones coherentes avec l'architecture.

### `e07_atelier` - Creer

Role actuel: atelier IA avec cinq etapes visibles et six zones JSON.

Ressenti: lieu de creation structure, plus fonctionnel et plus explicite que les autres territoires.

Integration: candidat naturel pour `Creer`.

Etat: image et zones presentes, mais les actions `atelier:*` ne sont pas raccordees a un gestionnaire dans le code actuel.

Ajustements souhaitables: definir plus tard un registre d'actions d'atelier ou des destinations JSON, en restant compatible avec `ZoneRenderer`.

### `e08_constellation` - Trouver un repere / Resonances

Role actuel: constellation de recits, zone de saisie, bouton de partage, stockage local via `Constellation`.

Ressenti: depot de trace et reliance aux passages d'autres voyageurs.

Integration: tres bon candidat pour `Trouver un repere`, car le texte demande quel recit aide a continuer de marcher.

Etat: module local existant. Les zones JSON `story_input`, `share_story` et `how_it_works` emettent des actions non raccordees; le bouton HTML natif `shareStoryButton` est gere par `Constellation`.

Ajustements souhaitables: harmoniser plus tard l'interaction entre zones JSON et formulaire natif afin que l'overlay de `ZoneRenderer` ne devienne pas un obstacle.

### `e09_voyage` - Sortie douce

Role actuel: ecran de continuation avec liens externes, portail, blog et QR central.

Ressenti: ouverture hors du lieu, emporter l'experience.

Integration: bon territoire de fin ou de prolongement, moins adapte comme premiere direction de Boussole.

Etat: partiellement actionnable. Les liens externes fonctionnent via le type `external`. La zone QR `qr_central` n'a pas de gestionnaire `qr` dans `ZoneRenderer`.

Ajustements souhaitables: raccorder plus tard l'action QR au modal existant ou a une action generique.

## Carte de navigation actuelle

```text
e01_accueil
  -> entrer
  -> e02_meteo
       -> eclaircie / transition / je_ne_sais_pas / brouillard / tempete
       -> e03_boussole
            -> porte_principale
            -> e04_oeuvre
```

Navigation presente dans les donnees mais non reliee depuis le parcours principal:

```text
e07_atelier
  -> dialogue_ia / cartographie / images / clarification / evolution / entrer_atelier
  -> actions atelier:* emises comme actions personnalisees, sans gestionnaire actuel

e08_constellation
  -> story_input / share_story / how_it_works
  -> actions personnalisees, sans gestionnaire ZoneRenderer actuel
  -> Constellation gere aussi un formulaire local dans le DOM

e09_voyage
  -> liens externes vers oeuvre immersive, blog, portail
  -> qr_central declare, sans gestionnaire qr actuel
```

Ecrans presents mais sans zones JSON:

```text
e04_oeuvre
e05_cartes
e06_fiction
e06_essais
e06_atlas
e06_portes
```

## Carte globale proposee

```text
Le Seuil
  -> Meteo interieure
      -> Boussole Vivante
          -> Explorer
              -> e04_oeuvre
          -> Decouvrir
              -> e05_cartes
          -> Contempler
              -> e06_fiction / e06_essais
          -> Creer
              -> e07_atelier
          -> Trouver un repere
              -> e08_constellation
              -> e06_atlas / e06_portes
          -> Emporter / Continuer
              -> e09_voyage
```

Cette carte respecte les territoires deja presents.
Elle evite d'ajouter des lieux tant que les ecrans existants ne sont pas habites.

## Ressources reutilisables

### Illustrations et ambiances

- `ecrans/ecran-4-oeuvre.png`: foret, seuil, chemin lumineux.
- `ecrans/ecran-5-cartes.png`: cartes narratives.
- `ecrans/ecran-6-*.png`: bibliotheque par rayons.
- `ecrans/ecran-7-atelier.png`: atelier de creation.
- `ecrans/ecran-8-constellation.png`: traces et recits partages.
- `ecrans/ecran-9-voyage.png`: continuation et sorties.

### Donnees

- `data/livres-v2.json`: 13 ressources.
- Categories: `fiction` 4, `essais` 4, `atlas` 2, `portes_ouvertes` 3.
- `qr_master`: portail, oeuvre, bibliotheque.

### Modules

- `ZoneRenderer`: creation des hitboxes et actions generiques.
- `BookRenderer`: rendu des livres et QR dans la bibliotheque.
- `Constellation`: stockage local de recits.
- `NarrativeMemory`: memoire locale douce.
- `LivingEcho`: murmures locaux de la Boussole.
- `UIRenderer`: point d'extension vide, sans rendu meteo historique.

## Recommandations

### A - Deja pret

- `e01_accueil`: conserver comme Seuil.
- `e02_meteo`: conserver comme Meteo interieure.
- `e03_boussole`: conserver comme coeur du parcours.

### B - A enrichir

- `e04_oeuvre`: relier a `Explorer`.
- `e05_cartes`: relier a `Decouvrir` apres definition des destinations reelles des cartes.
- `e06_fiction`, `e06_essais`, `e06_atlas`, `e06_portes`: relier comme Bibliotheque Vivante.
- `e07_atelier`: relier a `Creer`, puis raccorder les actions `atelier:*`.
- `e08_constellation`: relier a `Trouver un repere`, puis harmoniser zones JSON et formulaire.
- `e09_voyage`: utiliser comme sortie douce, puis raccorder l'action QR.

### C - A creer

Aucun territoire majeur ne doit etre cree immediatement.
Les premiers travaux devraient d'abord relier et clarifier les territoires existants.

Espaces eventuellement absents a plus long terme:

- objets NFC;
- carnets telechargeables ou interactifs;
- packs narratifs autonomes;
- pages detaillees d'oeuvres immersives.

Ces espaces ne doivent etre crees qu'apres consolidation des territoires deja presents.

