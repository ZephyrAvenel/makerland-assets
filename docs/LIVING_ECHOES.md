# Les Echos Vivants

## Philosophie

Les Echos Vivants ajoutent une resonance discrete a la Boussole.
Ils ne sont pas une voix d'assistant.
Ils ne commentent pas le visiteur.
Ils apparaissent comme de petits signes du lieu.

Makerland ne cherche pas a repondre.
Il laisse parfois une phrase flotter, puis disparaitre.

## Fonctionnement

Le module `js/livingEcho.js` est independant.
Il ne lit pas le DOM, ne lit pas `localStorage`, ne declenche aucun appel reseau et ne depend d'aucun serveur.

Il recoit uniquement:

```js
{
    selectedWeather,
    visitCount,
    weatherHistory
}
```

Il retourne:

```js
{
    message,
    intensity,
    glow,
    delay
}
```

`App` utilise cet objet pour afficher le murmure dans la Boussole apres un delai de 2 a 4 secondes.
Le texte apparait en fondu, reste quelques instants, puis disparait doucement.

## Architecture

- `LivingEcho.create(...)` choisit un murmure compatible avec la meteo.
- Le nombre de visites augmente legerement la richesse possible.
- Apres 10 visites, un echo peut contenir deux phrases.
- Apres 30 visites, un echo plus profond peut apparaitre tres rarement.
- La variation repose sur `Math.random()` afin que le meme murmure ne revienne pas systematiquement.

## Meteos

Chaque meteo possede plusieurs murmures:

- `brouillard`
- `tempete`
- `transition`
- `eclaircie`
- `je_ne_sais_pas`

Les textes restent courts, non psychologiques et non prescriptifs.

## Design

Les echos sont affiches sans boite et sans panneau:

- texte blanc casse;
- halo tres leger;
- fondu lent;
- disparition progressive;
- respect de `prefers-reduced-motion`.

Sur smartphone portrait, le texte devient tres discret.
Sur smartphone paysage, il reste compact pour ne pas toucher aux directions organiques.

## Limites

Les Echos Vivants ne memorisent rien.
Ils utilisent seulement le contexte deja disponible.

Ils ne changent pas:

- `ZoneRenderer`;
- `Navigation`;
- le JSON des zones;
- `NarrativeMemory`;
- `selectedWeather`;
- les actions existantes.

## Principes

- Aucun compte utilisateur.
- Aucune IA.
- Aucun appel reseau.
- Aucune telemetrie.
- Aucun bouton HTML ajoute.
- Tout reste local, simple et reversible.
