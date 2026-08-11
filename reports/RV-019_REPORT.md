# RV-019 - Rite d'entree dans la Bibliotheque Vivante

## Resume

RV-019 transforme l'ouverture de Makerland en un seuil narratif progressif.

Le visiteur arrive maintenant sur une introduction composee de l'embleme des Recits Vivants, du titre `BIBLIOTHEQUE VIVANTE`, d'une signature discrete et d'une phrase de seuil. Le bouton `Entrer` reste genere par ZoneRenderer et conserve son role d'unique point d'interaction.

## Animations creees

- Apparition progressive de l'embleme, du titre, du sous-titre, de la signature et du texte de seuil.
- Respiration lumineuse lente du bouton `Entrer`.
- Leger zoom et assombrissement du paysage d'accueil au clic.
- Phrase d'accueil intermediaire entre l'accueil et la meteo.
- Apparition progressive de la meteo: image, titre, texte, puis cinq cartes interactives.

## Durees et declenchement

- Texte d'accueil: entre `240 ms` et `1780 ms` apres l'affichage de l'accueil.
- Clic sur `Entrer`: lancement du rite d'entree.
- Voix d'accueil: apparition apres `220 ms`.
- Passage vers la meteo: `900 ms`.
- Fin de la sequence: `2100 ms`.

Le rite ne se declenche que pour le passage:

`e01_accueil -> e02_meteo`

Toutes les autres navigations restent inchangees.

## Compatibilite mobile

Les positions utilisent les variables responsives deja presentes:

- `--screen-content-width`
- `--screen-content-height`
- `--screen-content-left`
- `--screen-content-top`

Un ajustement portrait reduit la largeur et la taille du titre afin de conserver une lecture confortable sur smartphone.

## Respect de prefers-reduced-motion

Si `prefers-reduced-motion: reduce` est actif:

- le rite anime n'est pas declenche;
- les animations CSS d'entree sont supprimees;
- les elements restent lisibles immediatement.

## Performance

Les effets reposent sur:

- `opacity`
- `transform`
- `filter`
- animations CSS

Aucune dependance n'a ete ajoutee. Aucun calcul permanent n'est introduit.

## Fichiers modifies

- `index.html`
- `css/style.css`
- `js/navigation.js`
- `reports/RV-019_REPORT.md`

## Fichiers non modifies

- `data/zones-v3-final-beta.json`
- `data/library-layout.json`
- `data/library-extensions.json`
- `data/livres-v2.json`
- `js/zoneRenderer.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/bookRenderer.js`
- `js/app.js`

## Validation

- Syntaxe JavaScript verifiee sur `js/navigation.js`.
- JSON inchanges.
- Controle de diff sur les fichiers proteges: aucun changement.
- Le bouton `Entrer` reste une zone ZoneRenderer.
- La navigation `Accueil -> Meteo` reste fonctionnelle avec une transition douce.
- Desktop: accueil affiche, zone `Entrer` unique, clic vers meteo, cinq zones meteo creees.
- Android portrait simule `390 x 844`: texte d'accueil visible, bouton separe du texte, clic vers meteo, cinq zones meteo creees.
- Android paysage simule `740 x 360`: texte d'accueil visible, bouton accessible, clic vers meteo, cinq zones meteo creees.
