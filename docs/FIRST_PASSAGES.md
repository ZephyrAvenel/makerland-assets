# Les Premiers Passages

## Philosophie

La Boussole Vivante n'est pas un menu.
Elle est un lieu d'orientation.

RV-007 relie ses cinq directions aux territoires deja presents dans Makerland.
Le visiteur ne choisit pas une fonction: il franchit une porte.

Aucun nouveau territoire n'est cree.
Aucune nouvelle image n'est ajoutee.
Aucune nouvelle architecture n'est introduite.

## Correspondances

| Direction | Territoire ouvert | Raison |
| --- | --- | --- |
| Explorer | `e04_oeuvre` | Le visuel de foret et d'arche lumineuse propose deja un chemin. |
| Decouvrir | `e05_cartes` | Les cartes narratives sont deja presentes comme portes d'exploration. |
| Contempler | `e06_fiction` | La Bibliotheque Vivante offre une premiere halte de lecture. |
| Creer | `e07_atelier` | L'Atelier IA porte deja la creation, la clarification et la cartographie. |
| Trouver un repere | `e08_constellation` | La Constellation accueille les traces et les recits de passage. |

## Fonctionnement

Les directions organiques de la Boussole restent les elements visuels existants.
Chaque direction porte simplement un attribut `data-target-screen`.

Quand le visiteur active une direction:

1. l'echo vivant est nettoye;
2. la Boussole effectue un court fondu de sortie;
3. `Navigation.goTo(...)` ouvre le territoire cible.

Le passage utilise donc le moteur de navigation existant.
Il ne modifie pas:

- `ZoneRenderer`;
- `Navigation`;
- `NarrativeMemory`;
- `LivingEcho`;
- la logique de meteo;
- le JSON des zones.

## Transitions

La transition reste douce et breve.
La Boussole s'efface legerement avant l'ouverture du territoire.

L'intention est de produire une sensation de continuite:

```text
J'avance.
```

plutot qu'une sensation de changement de menu.

## Accessibilite

Les directions peuvent etre activees:

- au clic;
- au toucher;
- avec `Enter`;
- avec la barre d'espace.

Un style `focus-visible` discret rend le parcours clavier lisible sans alourdir l'esthetique.

## Bonnes pratiques

- Relier d'abord les territoires existants avant d'ajouter de nouveaux lieux.
- Garder les directions accessibles meme lorsqu'une seule est suggeree par la meteo.
- Eviter les panneaux explicatifs dans la Boussole.
- Conserver les passages comme des portes, pas comme des commandes.

