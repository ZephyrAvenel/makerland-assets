# RV-025 - La Traversee de l'Arche

## Resume

La mission RV-025 transforme l'ecran `e04_oeuvre` en rite de passage vers l'Oeuvre immersive des Recits Vivants.

L'Arche n'est plus seulement un decor. Elle devient un seuil:

```text
Boussole Vivante
-> Foret avec l'Arche
-> Murmure du Veilleur
-> Franchir le seuil
-> Oeuvre immersive
```

## Fichiers modifies

- `index.html`: ajout du script `js/archwayPassage.js`;
- `js/navigation.js`: exposition publique du calcul adaptatif `getWhisperReadingDuration`;
- `js/archwayPassage.js`: nouveau composant reutilisable de passage par l'Arche;
- `css/style.css`: styles et animations du rite de passage;
- `docs/ARCHWAY_PASSAGE.md`: documentation d'architecture;
- `reports/RV-025_REPORT.md`: rapport de mission.

## Animations creees

Arrivee dans la foret:

- fondu du paysage: environ 1,3 s;
- respiration lumineuse de l'Arche: cycle de 7,5 s;
- brume discrete: cycle de 11 s;
- particules fines: cycle de 14 s.

Murmure du Veilleur:

- apparition: environ 1 s;
- lecture adaptative RV-024;
- disparition: environ 0,8 s.

Invitation:

- apparition apres le Murmure;
- interaction par luminosite tres discrete au survol, au focus et au toucher.

Traversee:

- respiration de l'Arche;
- leger travelling du paysage;
- voile lumineux: environ 0,98 s;
- ouverture de l'Oeuvre immersive via `Navigation.openExternal`.

## Temps de lecture adaptatif

Le module reutilise:

```text
Navigation.getWhisperReadingDuration(text)
```

La formule reste:

```text
readingDuration = clamp(wordCount * 90 ms, 4000 ms, 8000 ms)
```

Le Murmure generique contient 16 mots. La duree minimale s'applique donc:

```text
readingDuration = 4000 ms
```

## Points d'extension

Murmures selon la meteo:

- les textes pour `eclaircie`, `transition`, `je_ne_sais_pas`, `brouillard` et `tempete` sont prepares;
- ils restent desactives par `useWeatherWhispers: false`;
- l'activation future ne demandera pas de modifier l'architecture.

Reutilisation de l'Arche:

- la destination est centralisee dans la configuration du module;
- l'invitation est configurable;
- le composant peut etre adapte a de futurs seuils narratifs.

Hooks futurs:

- un evenement `archwayPassageCue` est emis pour `forest`, `whisper` et `passage`;
- il permettra plus tard d'ajouter son, lumiere ou autres presences sans melanger la logique.

## Contraintes respectees

Non modifies:

- `ZoneRenderer`;
- `BookRenderer`;
- `NarrativeMemory`;
- `LivingEcho`;
- JSON metier existants;
- contenus des oeuvres;
- packs narratifs.

La navigation actuelle est preservee. L'ouverture externe passe par `Navigation.openExternal`.

## Performance

Les animations utilisent principalement:

- `opacity`;
- `transform`;
- `filter`.

Aucune dependance n'a ete ajoutee. Aucun calcul continu n'est execute.

Les temporisations sont nettoyees lorsque le visiteur quitte l'ecran.

## Accessibilite

Validation prevue:

- interaction par clic;
- interaction clavier avec Entree et Espace;
- `aria-label`;
- `aria-disabled`;
- focus visible;
- respect de `prefers-reduced-motion`.

En mouvement reduit, le module affiche directement la foret, le Murmure et l'invitation, puis ouvre la destination sans animation longue.

## Tests realises

- `node --check js/navigation.js`: OK;
- `node --check js/archwayPassage.js`: OK;
- verification JSON: OK;
- desktop: parcours jusqu'a `e04_oeuvre` et presence de l'Arche;
- Android portrait: parcours jusqu'a `e04_oeuvre` et invitation visible;
- Android paysage: parcours jusqu'a `e04_oeuvre` et invitation visible;
- `prefers-reduced-motion`: chemin reduit valide dans le navigateur local.

## Respect de la Charte

Le passage renforce le principe du seuil: la foret n'est pas une page, mais une arrivee.

Il renforce le principe des transitions comme passages: le visiteur avance sous l'Arche avant l'ouverture externe.

Il renforce le rythme comme langage: pause, Murmure, silence et invitation structurent le moment.

La technologie reste invisible: les effets servent la presence de l'Arche sans attirer l'attention sur eux-memes.
