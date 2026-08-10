# La Boussole Vivante

## Pourquoi la Boussole existe

La Boussole Vivante est le premier lieu d'orientation des Recits Vivants.
Elle apparait apres l'accueil et la Meteo interieure, au moment ou le visiteur a deja indique le paysage depuis lequel il commence son voyage.

Elle ne sert pas a classer, predire ou diriger.
Elle sert a rendre le chemin plus habitable.

## Hospitalite narrative

L'hospitalite narrative consiste a accueillir un point de depart sans l'interpreter.
Une personne peut arriver sous une eclaircie, dans un passage, sans reponse, dans le brouillard ou au milieu d'une tempete.

La Boussole ne transforme jamais cette information en diagnostic.
Elle la reconnait avec douceur, puis laisse plusieurs directions disponibles.

Le principe a respecter est simple: proposer sans enfermer.

## Role de la Meteo interieure

La Meteo interieure memorise le choix du visiteur dans `selectedWeather`.
La Boussole utilise cette valeur pour afficher un court message d'accueil et choisir une direction legerement mise en evidence.

La valeur est aussi transmise a `NarrativeMemory.rememberWeather(selectedWeather)`.
Cette fonction est volontairement vide pour l'instant. Elle prepare une future memoire narrative sans modifier le comportement actuel du parcours.

## Orientation douce

Chaque meteo peut suggerer une seule direction.
Les autres directions restent visibles et accessibles.

Correspondances actuelles:

- `eclaircie` suggere `creer`
- `transition` suggere `explorer`
- `je_ne_sais_pas` suggere `decouvrir`
- `brouillard` suggere `repere`
- `tempete` suggere `contempler`

Cette suggestion doit rester presque imperceptible: lumiere plus chaude ou plus douce, halo discret, contraste legerement renforce.
La plateforme propose une possibilite. Elle ne choisit jamais a la place du visiteur.

## Cycle d'apparition

Quand l'ecran `e03_boussole` devient actif:

1. `App` lit `selectedWeather`.
2. Le message correspondant est place dans `#livingCompassMessage`.
3. La direction suggeree recoit la classe `is-suggested`.
4. La Boussole attend environ 420 ms.
5. La classe `living-compass-ready` declenche l'apparition progressive du halo, du texte et des directions.

Ce temps court evite l'impression d'une page qui se charge brutalement.
Le lieu semble prendre un instant pour accueillir.

## Ajouter une nouvelle meteo

1. Ajouter l'identifiant de la meteo dans `WEATHER_ZONE_IDS` si elle vient de l'ecran Meteo.
2. Ajouter une entree dans `LIVING_COMPASS_TEXTS` avec:
   - `message`: texte court, sobre, non psychologique.
   - `direction`: identifiant de la direction suggeree.
3. Ajouter si necessaire une variation CSS:

```css
.living-compass[data-weather="nouvelle_meteo"] .living-compass-light{
    background:radial-gradient(
        circle,
        rgba(255,255,255,.18) 0%,
        rgba(255,255,255,.08) 36%,
        rgba(255,255,255,0) 72%
    );
}
```

## Ajouter une nouvelle direction

1. Ajouter un element dans `.living-compass-directions` avec un `data-direction`.
2. Utiliser ce meme identifiant dans `LIVING_COMPASS_TEXTS`.
3. Garder un libelle court pour eviter la surcharge sur mobile.
4. Ne pas transformer la Boussole en tableau de bord: une direction doit ressembler a une invitation, pas a une commande.

## Bonnes pratiques

- Ne pas analyser le choix meteo du visiteur.
- Ne pas afficher plusieurs directions suggerees a la fois.
- Ne pas ajouter d'animation spectaculaire.
- Respecter `prefers-reduced-motion`.
- Garder les textes courts.
- Verifier PC, tablette, smartphone portrait et smartphone paysage.
- Ne pas modifier `ZoneRenderer`, `Navigation` ou le moteur JSON pour des ajustements purement narratifs.
