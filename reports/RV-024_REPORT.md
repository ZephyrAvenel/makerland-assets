# RV-024 - Temps de lecture adaptatif des Murmures du Veilleur

## Resume

La mission RV-024 ajuste le premier Murmure du Veilleur afin qu'il reste lisible sans presse avant l'apparition de la Meteo interieure.

Le changement est limite a `js/navigation.js`. Aucun JSON, moteur d'interaction, moteur de bibliotheque, memoire narrative, echo vivant ou logique de navigation applicative n'a ete modifie.

## Formule de lecture

Le temps de lecture est maintenant calcule de maniere generique a partir du texte visible du murmure:

```text
readingDuration = clamp(wordCount * 90 ms, 4000 ms, 8000 ms)
```

Parametres:

- apparition progressive: 1000 ms;
- lecture minimale: 4000 ms;
- lecture par mot: 90 ms;
- lecture maximale: 8000 ms;
- disparition progressive: 800 ms;
- marge avant affichage de l'ecran suivant: 100 ms.

Pour le murmure actuel:

```text
Bienvenue. Ici, nul besoin de savoir ou aller. Il suffit de commencer la ou vous etes.
```

Le texte contient 16 mots. La duree calculee serait 1440 ms, donc la duree minimale s'applique:

```text
readingDuration = 4000 ms
hideWelcomeAt = 5360 ms
showNextScreenAt = 6260 ms
cleanupAt = 7410 ms
```

## Respect de prefers-reduced-motion

Le comportement existant est conserve. Lorsque `prefers-reduced-motion: reduce` est actif, le rite d'entree evite l'animation longue et charge directement l'ecran suivant.

Le calcul adaptatif concerne le chemin anime standard et reste sans effet secondaire sur le chemin reduit.

## Validation

Tests techniques:

- `node --check js/navigation.js`: OK;
- verification de la formule de calcul: OK;
- aucun changement CSS requis;
- aucun changement JSON;
- aucun changement sur ZoneRenderer, BookRenderer, NarrativeMemory, LivingEcho ou app.js.

Tests navigateur local:

- Desktop 1280 x 720: Accueil -> Entrer -> Meteo interieure OK;
- Android portrait 390 x 844: Accueil -> Entrer -> Meteo interieure OK;
- Android paysage 740 x 360: Accueil -> Entrer -> Meteo interieure OK.

La session de test expose `prefers-reduced-motion: reduce`; le chemin reduit a donc ete valide dans le navigateur, tandis que le timing anime a ete valide par le controle du code et le calcul de duree.

## Impact performance

Le calcul est effectue une seule fois au demarrage du rite d'entree. Il lit le texte du murmure, compte les mots et calcule les delais.

Aucun recalcul continu n'est ajoute. Aucune dependance supplementaire n'est introduite.

## Charte de l'Experience Vivante

L'ajustement renforce le principe du seuil: le visiteur ne change pas brutalement d'ecran, il traverse un passage.

Il renforce aussi le principe de respiration: le murmure dispose maintenant d'un temps de lecture minimal suffisant.

Le Murmure du Veilleur reste sobre, hospitalier et non explicatif. La technologie demeure invisible: elle sert uniquement le rythme de l'accueil.
