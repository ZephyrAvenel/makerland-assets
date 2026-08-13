# RV-070 - Relier les lieux en une seule oeuvre immersive

## Resume

RV-070 ajoute une couche de continuite narrative entre les lieux deja presents:

- Bibliotheque Vivante;
- Boussole Vivante;
- Cartes Narratives;
- Atelier IA;
- Constellation;
- Foret de l'Arche;
- Voyage.

La navigation existante n'a pas ete modifiee. Le nouveau module ecoute uniquement les evenements `screenChanged`.

## Architecture

Un nouveau module autonome a ete ajoute:

- `js/livingJourney.js`

Il gere:

- l'identification du lieu courant;
- la signature sensible du lieu;
- l'animation d'arrivee;
- une memoire locale minimale des lieux visites;
- un message discret indiquant le lieu quitte;
- quelques micro-indices narratifs affiches rarement.

## Transitions

Chaque arrivee dans un lieu applique temporairement:

- un fondu lumineux;
- un deplacement vertical tres faible;
- une ouverture progressive;
- une duree comprise entre environ 480 ms et 640 ms.

Lorsqu'un lieu a deja ete visite, la duree est legerement raccourcie.

## Memoire du voyage

La memoire est stockee localement dans:

```text
makerland_living_journey
```

Elle contient uniquement:

- les lieux visites;
- le dernier ecran;
- le dernier lieu.

Aucune identite, aucun compte et aucune donnee externe ne sont utilises.

## Messages discrets

Lorsqu'un visiteur quitte un lieu pour un autre, un message peut apparaitre:

```text
Vous venez de quitter : Bibliotheque Vivante
```

Des micro-indices peuvent apparaitre rarement:

- Vous pouvez revenir ici plus tard.
- Tous les chemins restent ouverts.
- Certains lieux demandent plusieurs passages.
- Rien ne vous oblige a tout explorer aujourd'hui.
- Les recits savent attendre.

Une seule phrase est affichee a la fois.

## Signatures sensibles

Les signatures sont appliquees via des attributs `data-*` sur le `body`.

| Lieu | Signature |
| --- | --- |
| Bibliotheque | silence chaleureux |
| Boussole | respiration |
| Cartes | invitation |
| Atelier | creation |
| Constellation | rencontre |

Ces signatures ajustent uniquement l'intensite du halo, le rythme et le leger mouvement d'arrivee.

## Contraintes respectees

- Aucune illustration modifiee.
- Aucun texte principal modifie.
- Aucune destination modifiee.
- `Navigation` non modifie.
- `ZoneRenderer`, `BookRenderer`, `NarrativeMemory`, `LivingEcho` non modifies.
- Les animations utilisent `transform`, `opacity` et `filter`.
- `prefers-reduced-motion` est respecte.

## Validations realisees

- `node --check js/livingJourney.js`
- `git diff --check`
- Controle du perimetre Git

## Limite

La validation tactile et fluide sur Android, tablette et mobile paysage doit etre confirmee apres deploiement. Les changements ont toutefois ete limites a une couche legere et reversible, sans modification des moteurs existants.
