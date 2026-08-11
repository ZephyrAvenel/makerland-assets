# RV-023 - Affinage du rythme des seuils d'accueil

## Reference

La mission a ete relue a partir de:

`docs/LIVING_EXPERIENCE_CHARTER.md`

Les ajustements visent a renforcer l'hospitalite, la continuite narrative, la lenteur juste et l'habitabilite du seuil.

## Modifications realisees

### Lisibilite de l'accueil

Le titre `BIBLIOTHEQUE VIVANTE` et son bloc central gagnent en lisibilite sans panneau opaque.

Les ajustements sont:

- voile radial sombre tres leger derriere le bloc central;
- halo dore doux autour du titre;
- ombre diffuse renforcee mais discrete;
- contraste local ameliore autour des lettres.

Le paysage reste visible et conserve son role de seuil.

### Premier Murmure du Veilleur

Le Murmure de transition vers la meteo est ralenti afin de devenir un vrai temps de respiration.

Le rythme est maintenant:

- apparition progressive: `1 s`;
- lecture: environ `2.8 s`;
- disparition progressive: `0.9 s`;
- apparition de la meteo apres disparition du Murmure.

La meteo n'est plus affichee au meme instant que le retrait du Murmure.

## Nouvelles durees

- Debut du Murmure: `360 ms` apres le clic.
- Debut de disparition du Murmure: `4200 ms`.
- Apparition de la meteo: `5100 ms`.
- Nettoyage de la sequence: `6250 ms`.

## Respect de la Charte

### Principe du seuil

L'accueil prepare mieux le passage suivant: le titre reste lisible, le paysage demeure present, et le clic ouvre un passage au lieu d'une coupure.

### Principe de la respiration

Le Murmure dispose maintenant d'un temps de lecture reel. Le visiteur n'a pas besoin de se presser.

### Principe de la presence

Les corrections privilegient la lumiere, le voile et le rythme plutot qu'un panneau ou une interface visible.

### Principe des Murmures du Veilleur

Le Murmure reste court, hospitalier et non explicatif. Son rythme lui permet d'accompagner sans interrompre.

## Impact performance

Les ajustements restent limites a:

- `opacity`;
- `filter`;
- `transform`;
- transitions CSS.

Aucune dependance n'est ajoutee. Aucun calcul permanent n'est introduit.

## Fichiers modifies

- `css/style.css`
- `js/navigation.js`
- `reports/RV-023_REPORT.md`

## Fichiers non modifies

- aucun JSON;
- `js/zoneRenderer.js`;
- `js/bookRenderer.js`;
- `js/narrativeMemory.js`;
- `js/livingEcho.js`;
- `js/app.js`;
- `index.html`.

## Tests effectues

- Syntaxe JavaScript verifiee sur `js/navigation.js`.
- JSON verifies sans modification.
- Controle de diff sur les fichiers proteges: aucun changement.
- Validation navigateur en `prefers-reduced-motion: reduce`:
  - desktop `1280 x 720`: titre visible, bouton `Entrer` unique, navigation vers meteo, cinq zones meteo;
  - Android portrait `390 x 844`: titre visible, bouton `Entrer` unique, espace conserve entre texte et bouton, navigation vers meteo;
  - Android paysage `740 x 360`: titre visible, bouton `Entrer` unique, navigation vers meteo.
- Le navigateur integre force le mode reduit; les durees animees ont donc ete verifiees par les constantes `Navigation` et les delais CSS.
