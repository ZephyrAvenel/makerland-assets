# RV-021 - Le Gardien silencieux

## Resume

RV-021 transforme le seuil d'accueil en une rencontre silencieuse.

Le lieu ne parle pas. Il ne presente aucun personnage, aucun avatar et aucun son. Il accueille par le paysage, la lumiere, le rythme, les particules et l'apparition progressive des signes.

## Duree totale de l'accueil

L'accueil complet se deploye sur environ `6.8 s` avant que le bouton `Entrer` commence sa respiration lente.

Le visiteur peut toujours cliquer lorsque la zone ZoneRenderer existe, mais visuellement le seuil l'invite d'abord a regarder.

## Ordre exact des apparitions

1. `0 s` a `1 s`: paysage seul.
2. `0.85 s`: vignettage discret.
3. `1.05 s`: halo central.
4. `1.15 s`: particules lumineuses et constellations discretes.
5. `1.18 s`: embleme `RV`.
6. `1.55 s`: lueur precedant le titre.
7. `1.92 s`: titre `BIBLIOTHEQUE VIVANTE`.
8. `2.52 s`: sous-titre `Les Recits Vivants`.
9. `3.05 s`: signature.
10. `3.6 s`: premiere phrase.
11. `4.2 s`: deuxieme phrase.
12. `4.8 s`: troisieme phrase.
13. `5.55 s`: emergence du bouton `Entrer`.
14. `6.8 s`: respiration lente du bouton.

## Transition vers la meteo

Au clic:

1. Le paysage continue pendant quelques centaines de millisecondes.
2. Un voile lumineux apparait.
3. La meteo est affichee apres `1150 ms`.
4. La sequence se nettoie apres `2450 ms`.

L'objectif est de donner la sensation d'avancer dans le lieu plutot que de changer brutalement d'ecran.

## Arrivee de la meteo

La meteo conserve la cascade RV-020:

1. image;
2. titre;
3. sous-titre;
4. cinq etats espaces de `120 ms`;
5. halo interactif final par augmentation douce de luminosite.

## Animations utilisees

Les animations reposent sur:

- `opacity`;
- `transform`;
- `filter`.

Les effets sont:

- derive lente du paysage;
- vignettage progressif;
- respiration lumineuse centrale;
- particules tres discretes;
- lueur de titre;
- apparition verticale douce;
- respiration lente du bouton;
- cascade meteo.

## Micro-interactions

Sur l'accueil et la meteo, le hover/touch ne provoque plus de rebond.

Il augmente seulement tres legerement la luminosite afin de conserver une sensation calme et contemplative.

## Hooks audio prepares

Aucun son n'est integre.

`Navigation` prepare seulement un evenement local:

`entryRiteCue`

Il expose des hooks inertes pour de futures ambiances:

- `entry-rite:wind`;
- `entry-rite:birds`;
- `entry-rite:pages`;
- `entry-rite:distant-bell`.

Ces hooks ne chargent aucun fichier, ne jouent aucun son et n'ajoutent aucune dependance.

## Performance

Aucun calcul permanent n'est ajoute.

Les effets visuels restent pilotes par CSS. Le JavaScript se limite a declencher les classes de transition et les hooks futurs.

## Respect de prefers-reduced-motion

Lorsque `prefers-reduced-motion: reduce` est actif:

- le rite anime n'est pas declenche;
- les animations CSS du seuil sont supprimees;
- les textes et le bouton restent immediatement lisibles.

## Fichiers modifies

- `index.html`
- `css/style.css`
- `js/navigation.js`
- `reports/RV-021_REPORT.md`

## Fichiers non modifies

- tous les fichiers JSON;
- `js/zoneRenderer.js`;
- `js/bookRenderer.js`;
- `js/narrativeMemory.js`;
- `js/livingEcho.js`;
- `js/app.js`.

## Validation

- Le bouton `Entrer` reste une zone ZoneRenderer.
- Aucun JSON modifie.
- Aucune logique ZoneRenderer modifiee.
- Aucune logique BookRenderer modifiee.
- Aucun son integre.
- Syntaxe JavaScript verifiee sur `js/navigation.js`.
- JSON verifies: `zones-v3-final-beta`, `library-layout`, `library-extensions`, `livres-v2`.
- Navigateur integre: `prefers-reduced-motion: reduce` actif, donc affichage immediat sans animation longue.
- Test navigateur en mode reduit:
  - desktop `1280 x 720`: bouton `Entrer` unique, clic vers meteo, cinq zones meteo creees;
  - Android portrait simule `390 x 844`: bouton `Entrer` unique, clic vers meteo, cinq zones meteo creees;
  - Android paysage simule `740 x 360`: bouton `Entrer` unique, clic vers meteo, cinq zones meteo creees.
