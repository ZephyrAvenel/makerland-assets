# RV-011 - Finalisation responsive de la Bibliotheque Vivante

## Resume

RV-011 finalise l'utilisation de la Bibliotheque Vivante sur smartphone.
Le systeme relatif de placement des couvertures RV-009 et la calibration QR RV-010 sont conserves.

La correction porte sur:

- la navigation de salle, maintenant ancree au viewport visible;
- l'ajout d'`Atlas des Recits Vivants III` comme ressource `A venir`;
- le masquage du QR et la desactivation de l'ouverture pour cette ressource non publiee.

## Fichiers modifies

- `css/bookRenderer.css`
- `data/livres-v2.json`
- `data/library-layout.json`

## Fichiers non modifies

Aucun changement n'a ete apporte a:

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `js/app.js`
- `data/zones-v3-final-beta.json`

## Navigation responsive

Les boutons de navigation ne dependent plus du repere de l'image de fond.
Ils sont positionnes en `fixed` dans le viewport visible avec:

- une marge laterale minimale;
- une marge basse minimale;
- prise en compte de `env(safe-area-inset-left)`;
- prise en compte de `env(safe-area-inset-right)`;
- prise en compte de `env(safe-area-inset-bottom)`;
- dimensions tactiles stables via `clamp`.

Ainsi, `Salle precedente`, `Salle suivante` et `Terminer la visite` restent visibles et cliquables en portrait comme en paysage.

## Atlas III

`Atlas des Recits Vivants III` est ajoute a `data/livres-v2.json` avec:

```json
{
  "status": "coming_soon",
  "available": false
}
```

Le rendu CSS applique alors, sur le troisieme volume Atlas:

- une couverture textuelle `A venir`;
- une zone de couverture non cliquable;
- aucun QR affiche;
- aucune ouverture externe.

Le troisieme slot Atlas correspond au troisieme cadre deja present dans l'illustration.

## Validation

Verifications effectuees:

- `node --check js/bookRenderer.js`: OK
- JSON parse:
  - `data/library-layout.json`: OK
  - `data/livres-v2.json`: OK
  - `data/zones-v3-final-beta.json`: OK
- Controle des fichiers interdits: aucun diff.
- Controle responsive calcule:
  - Android Chrome portrait: 393 x 852
  - Android Chrome paysage: 852 x 393
  - Samsung Internet portrait: 412 x 915
  - Samsung Internet paysage: 915 x 412
  - iPhone Safari portrait: 390 x 844
  - iPhone Safari paysage: 844 x 390
  - Tablette portrait: 768 x 1024
  - Tablette paysage: 1024 x 768

Resultat:

- les boutons restent dans le viewport;
- les boutons gardent une marge de securite;
- les zones couvertures et QR conservent leur calibration RV-010;
- le QR Atlas III n'est pas rendu;
- Atlas III ne peut pas etre ouvert.

## Limite

La validation multi-navigateurs a ete reproduite par dimensions de viewport et contraintes CSS.
Aucun moteur navigateur mobile natif Android Chrome, Samsung Internet ou iPhone Safari n'est disponible dans cet environnement local.
