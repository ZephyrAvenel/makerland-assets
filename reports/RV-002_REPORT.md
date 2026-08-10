# RV-002 - Ecran Meteo interieure

## Objectif

Transformer l'ecran `e02_meteo` en seuil narratif sans modifier le moteur `ZoneRenderer`, le moteur de navigation ou la structure generale du JSON.

Le visiteur ne repond plus a un questionnaire: il choisit le paysage interieur depuis lequel il commence son voyage.

## Base de branche

Anomalie constatee avant correction: `origin/main` ne contenait pas encore RV-001C au moment de creer cette mission. La branche RV-002 a donc ete basee sur `origin/agent/rv-001c-generalize-zone-visuals`, afin de conserver les cartes meteo rendues par `ZoneRenderer`.

`main` n'a pas ete modifie.

## Changements realises

- Ajout du titre sur `e02_meteo`: `Quel temps fait-il en vous aujourd'hui ?`
- Ajout du texte discret:
  `Il n'existe pas de bonne réponse. Choisissez simplement le paysage intérieur qui ressemble le plus au moment que vous traversez.`
- Enrichissement narratif des cinq cartes meteo avec un court texte:
  - `☀ Éclaircie`: `Je distingue un chemin.`
  - `🌤 Transition`: `Quelque chose change.`
  - `❓ Je ne sais pas`: `Je ne parviens pas encore à nommer.`
  - `🌫 Brouillard`: `Je cherche un repère.`
  - `⛈ Tempête`: `Beaucoup traverse mon paysage intérieur.`
- Agrandissement modere des geometries meteo dans le JSON pour ameliorer le confort tactile tout en conservant l'alignement avec l'image `object-fit: contain`.
- Ajout de `selectedWeather` dans l'etat applicatif.
- Memorisation du choix meteo avant la navigation vers `e03_boussole`, sans changer le comportement actuel de la boussole.

## Fichiers modifies

- `index.html`
- `css/style.css`
- `data/zones-v3-final-beta.json`
- `js/app.js`

## Fichier cree

- `reports/RV-002_REPORT.md`

## Architecture conservee

- `ZoneRenderer` n'a pas ete modifie.
- `Navigation` n'a pas ete modifie.
- Les zones restent pilotees par `data/zones-v3-final-beta.json`.
- Les cartes meteo restent rendues par les capacites existantes de `ZoneRenderer`.
- Aucun ancien bouton HTML meteo n'a ete reintroduit.
- Aucun ancien rendu `UIRenderer` specifique a la meteo n'a ete reintroduit.

## Responsive et accessibilite

- Le titre utilise le rectangle utile de l'image pour rester positionne sur le visuel.
- Le texte descriptif est affiche sur PC, tablette et paysage.
- En smartphone portrait, le paragraphe introductif est masque pour preserver l'image et eviter la surcharge.
- Les cartes conservent le style glass: fond translucide, flou leger, ombre douce, texte centre.
- Les animations restent discretes: hover sur PC, effet active/touch sur mobile.
- Les zones tactiles meteo ont ete agrandies par rapport a RV-001C.

## Validations

- `node --check js/app.js`
- `node --check js/zoneRenderer.js`
- parsing de `data/zones-v3-final-beta.json`
- verification `DEBUG_ZONES = false`
- verification: 0 `.ui-button`
- verification: 5 cartes meteo rendues
- verification: les cinq choix meteo restent synchronises avec leurs zones
- PC: Accueil → `✦ Entrer` → Meteo interieure → chacun des 5 choix → Boussole
- Tablette: Accueil → `✦ Entrer` → Meteo interieure → chacun des 5 choix → Boussole
- Smartphone portrait: Accueil → `✦ Entrer` → Meteo interieure → chacun des 5 choix → Boussole
- Smartphone paysage: Accueil → `✦ Entrer` → Meteo interieure → chacun des 5 choix → Boussole

## Captures

- `outputs/RV-002_CAPTURE_PC.png`
- `outputs/RV-002_CAPTURE_TABLET.png`
- `outputs/RV-002_CAPTURE_SMARTPHONE_PORTRAIT.png`
- `outputs/RV-002_CAPTURE_SMARTPHONE_LANDSCAPE.png`

## Notes

Le bruit reseau Statsig observe dans le navigateur de test provient de l'environnement Codex et n'affecte pas Makerland.
