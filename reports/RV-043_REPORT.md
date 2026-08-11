# RV-043 - Diagnostic et correction effective de la page Meteo

Date : 2026-08-11

Branche : `agent/rv-043-effective-meteo-fix`

## Diagnostic

La page `e02_meteo` est pilotee par `css/style.css`.

Les elements effectifs sont :

- titre : `.meteo-intro h1`
- texte descriptif : `.meteo-intro p`
- zones et cinq choix meteo : `.makerland-zone`
- rendu visuel des choix : `.makerland-zone-visual-button`
- sous-textes des choix : `.makerland-zone-visual-button::after`

Les missions precedentes ciblaient bien les bons elements, mais leurs animations etaient liees uniquement a `#e02_meteo.entry-rite-arriving`.
Or `Navigation` affiche l'ecran par `screen.style.display = "block"` puis retire la classe `entry-rite-arriving` lors du nettoyage du rite d'entree.
Les animations longues, notamment celles des choix meteo entre 8,5 s et 10 s, pouvaient donc etre interrompues ou ne plus piloter l'etat réellement visible de l'ecran.

Il n'y avait pas de modification JavaScript directe des classes des boutons meteo, ni de second fichier CSS responsable de ces elements.

## Correction appliquee

Les animations de `e02_meteo` ciblent maintenant aussi l'etat réellement affiche par `Navigation` :

`#e02_meteo[style*="display: block"]`

Le rythme visible devient :

- paysage seul jusqu'a environ 2,5 s ;
- apparition du titre a 2,5 s ;
- apparition du texte descriptif a 5 s ;
- apparition progressive des cinq choix de 8,5 s a 9,78 s ;
- halo final apres l'apparition des choix, a 10,75 s.

Les textes des cartes meteo ont aussi ete agrandis :

- libelle principal : taille minimale portee a 11 px ;
- sous-texte : taille minimale portee a 9 px ;
- interlignage ameliore ;
- largeur utile augmentee pour reduire les coupures.

## Accessibilite

Le bloc `prefers-reduced-motion` a ete etendu aux nouveaux selecteurs afin que les textes et les cartes restent visibles lorsque les animations sont desactivees.

## Validation

- Aucun HTML modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucun moteur modifie.
- Correction limitee a `css/style.css`.
- `git diff --check` : OK.
