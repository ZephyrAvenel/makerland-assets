# RV-020 - Respiration de la Bibliotheque Vivante

## Resume

RV-020 approfondit le rite d'entree RV-019 pour donner l'impression que la Bibliotheque Vivante s'eveille progressivement.

L'architecture reste intacte: le bouton `Entrer` est toujours genere par ZoneRenderer, les zones restent pilotees par JSON, et la navigation existante n'est pas modifiee.

## Animations ajoutees

- Derive tres lente du paysage d'accueil.
- Halo lumineux central sur le seuil.
- Vignettage discret pour concentrer le regard.
- Apparition plus lente et plus organique du titre.
- Apparition ligne par ligne du texte narratif.
- Emergence differee du bouton `Entrer`.
- Respiration organique du bouton avec mouvement et lumiere tres legers.
- Cascade des cinq etats de la meteo interieure.

## Durees

- Derive du paysage: `28 s`, en alternance continue.
- Halo lumineux: `24 s`, respiration presque imperceptible.
- Titre et textes d'accueil: `1.45 s` par element, avec decalages progressifs.
- Lignes narratives:
  - ligne 1: `1.82 s`;
  - ligne 2: `2.32 s`;
  - ligne 3: `2.82 s`.
- Bouton `Entrer`:
  - emergence: `3.28 s`;
  - respiration: cycle de `7.2 s`.
- Meteo:
  - titre;
  - sous-titre;
  - puis cinq etats espaces de `120 ms`.

## Ordre des apparitions

1. Embleme des Recits Vivants.
2. `BIBLIOTHEQUE VIVANTE`.
3. `Les Recits Vivants`.
4. Signature.
5. Ligne narrative 1.
6. Ligne narrative 2.
7. Ligne narrative 3.
8. Bouton `Entrer`.
9. Au clic: leger zoom, voile, phrase d'accueil.
10. Arrivee progressive de la meteo.

## Compatibilite mobile

Les positions continuent d'utiliser les variables responsives existantes:

- `--screen-content-width`;
- `--screen-content-height`;
- `--screen-content-left`;
- `--screen-content-top`.

Le mode portrait conserve les ajustements RV-019 afin de garder le texte separe du bouton.

## Performance

Les animations utilisent uniquement:

- `transform`;
- `opacity`;
- `filter`.

Aucune dependance n'est ajoutee. Aucun recalcul JavaScript permanent n'est introduit.

## Respect de prefers-reduced-motion

Lorsque `prefers-reduced-motion: reduce` est actif:

- le rite anime n'est pas declenche par Navigation;
- les animations d'accueil sont supprimees;
- le bouton et les textes sont visibles immediatement.

## Fichiers modifies

- `index.html`
- `css/style.css`
- `reports/RV-020_REPORT.md`

## Fichiers non modifies

- `js/navigation.js`
- `js/zoneRenderer.js`
- `js/bookRenderer.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/app.js`
- tous les fichiers JSON.

## Validation

- Syntaxe JavaScript: aucune modification JS.
- JSON: aucun fichier JSON modifie.
- Controle de diff sur les fichiers proteges: aucun changement.
- Le bouton `Entrer` reste une zone ZoneRenderer.
- La cascade meteo conserve les cinq zones existantes.
- Desktop simule `1280 x 720`: bouton `Entrer` unique, trois lignes narratives visibles, clic vers meteo, cinq zones meteo creees.
- Android portrait simule `390 x 844`: bouton `Entrer` unique, seuil lisible, clic vers meteo, cinq zones meteo creees.
- Android paysage simule `740 x 360`: bouton `Entrer` unique, seuil lisible, clic vers meteo, cinq zones meteo creees.
