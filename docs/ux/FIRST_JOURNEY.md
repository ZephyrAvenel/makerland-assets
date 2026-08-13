# UX-017 - Le Premier Voyage

## Objectif

Le Premier Voyage accueille les visiteurs qui decouvrent Makerland pour la premiere fois.

Il ne se presente pas comme un tutoriel. Il propose une traversee courte, volontaire et tactile, destinee a donner les premieres clefs :

- ce qu'est Makerland ;
- pourquoi ce territoire existe ;
- ce que l'on peut y faire.

## Psychologie du primo-visiteur

Un visiteur arrive d'abord par l'image, l'atmosphere et le rythme. Il peut ressentir la beaute du lieu sans encore comprendre son organisation.

Le Premier Voyage repond a ce moment fragile. Il ne cherche pas a tout expliquer. Il montre seulement quelques portes essentielles, avec des phrases simples, afin que le visiteur comprenne par l'experience.

## Detection

La proposition apparait uniquement si aucune memoire locale de voyage n'est detectee au chargement.

La decision du visiteur est conservee dans `localStorage`, sous la cle :

`makerland.firstJourney`

Valeurs principales :

- `choice` : `guided` ou `free` ;
- `active` : parcours en cours ;
- `completed` : parcours termine ;
- `step` : etape actuelle ;
- `startedAt`, `updatedAt`, `completedAt`.

Aucune donnee n'est envoyee sur Internet.

## Deroulement

Le parcours dure environ cinq minutes. Il comporte cinq etapes :

1. Pourquoi Makerland existe.
2. Rencontrer une oeuvre.
3. Entrer dans l'Atelier IA.
4. Ouvrir une Archive Vivante.
5. Comprendre la Constellation.

Chaque etape donne :

- un titre ;
- un sous-titre explicatif ;
- une phrase simple ;
- une courte citation ;
- une action possible ;
- un bouton Continuer.

Le visiteur peut quitter le parcours a tout moment.

## Traduction des noms

Pendant le parcours, les noms de lieux sont accompagnes d'une explication courte :

- Bibliotheque Vivante : les oeuvres publiees.
- Atelier IA : la ou les idees prennent forme.
- Archives Vivantes : les coulisses de la creation.
- Constellation : les liens entre les oeuvres.

## Choix UX

Le module est autonome.

Il ne modifie ni les moteurs globaux, ni les routes, ni les donnees metier. Il utilise simplement les evenements `screenChanged` deja emis par Makerland et appelle `Navigation.goTo` lorsque le visiteur choisit d'ouvrir une etape.

La carte reste volontairement discrete :

- verre depoli ;
- halo leger ;
- typographie existante ;
- animations lentes ;
- compatibilite `prefers-reduced-motion`.

## Reprise

Si le visiteur quitte le parcours avant la fin, son etape est conservee.

Depuis l'accueil, un bouton discret permet de reprendre ou de refaire le Premier Voyage.

## Evolutions possibles

Les prochaines versions pourront :

- enrichir les exemples d'oeuvres ;
- faire apparaitre un extrait reel de D001 directement dans la carte ;
- adapter le parcours selon la meteo interieure choisie ;
- relier le Premier Voyage au Carnet de Voyage ;
- proposer une version audio contemplative.
