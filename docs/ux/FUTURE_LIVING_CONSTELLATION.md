# UX-053 - Future Constellation Vivante

## Statut du document

Ce document constitue la proposition de conception de reference pour la future Constellation Vivante.

Il ne decrit pas une implementation technique immediate. Il fixe une direction d'experience afin que les prochaines missions puissent transformer progressivement la page sans perdre son intention principale.

Principe directeur issu de UX-052 :

> Le ciel d'abord. Les relations ensuite. Le parcours seulement si le visiteur le demande.

## 1. Philosophie de la page

La Constellation Vivante represente le lieu ou les Recits Vivants cessent d'etre percus comme des oeuvres separees.

Elle montre que chaque livre, chaque archive, chaque image, chaque fragment et chaque parole deposee appartient a un meme territoire relationnel. La Constellation n'est donc pas un sommaire visuel, ni un tableau de bord, ni un reseau documentaire expose comme une interface. Elle est le ciel commun des Recits Vivants.

Le visiteur y vient pour comprendre que les oeuvres ne vivent jamais seules. Une idee nee dans l'Atelier peut devenir une Archive Vivante, rejoindre une oeuvre, produire une image, rencontrer un lecteur, puis reapparaitre ailleurs sous forme de trace, de resonance ou de chemin.

L'emotion recherchee est celle d'une reconnaissance progressive :

> Tout cela etait deja relie.

La page doit d'abord produire un silence. Le visiteur doit pouvoir contempler le paysage sans etre immediatement sollicite. Ensuite seulement, l'interaction doit reveler que les etoiles ne sont pas decoratives : elles portent des fragments, des liens et des passages.

La Constellation doit donner l'impression d'entrer dans un monde vivant, pas dans une page de consultation. Elle n'explique pas tout. Elle rend visibles les liens qui, jusque-la, restaient invisibles.

## 2. Niveaux de decouverte

### Niveau 0 - Contemplation

Objectif : laisser le paysage exister.

Etat initial :

- le fond de constellation occupe le role principal ;
- aucun panneau central permanent ;
- quelques etoiles ou points lumineux respirent discretement ;
- une phrase courte peut apparaitre, puis s'effacer ;
- les actions restent peripheriques et minimales.

Le visiteur peut rester sans agir. Cette pause n'est pas une attente vide : elle fait partie de l'experience.

Elements autorises a ce niveau :

- titre discret du lieu ;
- murmure bref ;
- action `Deposer une trace` ;
- action `Explorer les liens` ;
- action secondaire `Chemin Vivant`.

Elements interdits a ce niveau :

- grands panneaux ouverts automatiquement ;
- grilles de cartes visibles d'emblee ;
- statistiques personnelles ;
- modale ou overlay masquant le ciel.

### Niveau 1 - Decouverte d'une etoile

Objectif : transformer une lumiere en presence narrative.

Declencheur :

- toucher ou clic sur une etoile ;
- selection d'une trace locale ;
- ouverture d'un fragment visible dans le ciel.

Affichage :

- petite fiche contextuelle ;
- texte court ;
- famille ou categorie ;
- date si elle existe ;
- deux ou trois resonances maximum ;
- boutons `Approfondir` et `Fermer`.

La fiche ne doit jamais occuper plus d'un tiers de l'ecran sur desktop ou tablette paysage. Sur mobile, elle peut devenir un panneau bas, mais le ciel doit rester perceptible derriere elle.

### Niveau 2 - Decouverte d'une relation

Objectif : montrer que l'etoile appartient a un reseau.

Declencheur :

- clic sur une resonance ;
- bouton `Voir ce que cette etoile rejoint` ;
- action `Explorer les liens`.

Affichage :

- relation principale ;
- concept associe ;
- archive associee ;
- oeuvre associee ;
- image ou figure si disponible ;
- salle Makerland liee si elle eclaire le fragment.

La relation doit etre presentee comme un fil, pas comme une liste exhaustive. Le visiteur doit comprendre un lien avant d'en voir dix.

### Niveau 3 - Decouverte d'une oeuvre

Objectif : permettre le passage de la constellation vers une oeuvre concrete.

Declencheur :

- selection d'une oeuvre dans une relation ;
- bouton `Ouvrir cette oeuvre` ;
- fiche d'approfondissement.

Affichage :

- titre de l'oeuvre ;
- une phrase de contexte ;
- les archives qui lui sont liees ;
- les concepts majeurs ;
- une image patrimoniale si disponible ;
- actions `Ouvrir`, `Voir les archives liees`, `Retour au ciel`.

La fiche d'oeuvre peut etre plus grande que la fiche d'etoile, mais elle doit rester temporaire. Le ciel demeure l'espace de reference.

### Niveau 4 - Entree dans un Chemin Vivant

Objectif : proposer un parcours sans imposer de parcours.

Declencheur :

- bouton volontaire `Suivre un Chemin Vivant` ;
- suggestion du Guide Vivant apres plusieurs interactions ;
- reprise d'un chemin commence.

Affichage :

- panneau clair, refermable ;
- intention du chemin ;
- duree indicative ;
- premieres etapes ;
- bouton `Commencer` ou `Reprendre` ;
- bouton `Continuer librement`.

Le Chemin Vivant n'est jamais ouvert automatiquement. Il apparait comme une proposition pour le visiteur qui souhaite etre accompagne.

## 3. Parcours ideal minute par minute

### 0:00 - Arrivee

Le visiteur entre dans la Constellation.

Le paysage occupe presque tout l'ecran. Aucun grand panneau ne s'impose. Le titre apparait discretement, puis laisse le regard se poser sur l'image.

Ce que le visiteur comprend :

> Je suis dans un ciel, pas dans un menu.

### 0:20 - Premier regard

Quelques etoiles respirent tres lentement. Une phrase breve peut apparaitre :

> Ici, les oeuvres se repondent.

Elle disparait sans exiger d'action.

Ce que le visiteur ressent :

> Il y a quelque chose a explorer, mais rien ne me presse.

### 0:45 - Premier clic

Le visiteur touche une etoile.

Une petite fiche apparait. Elle contient un fragment, une categorie et une ou deux resonances.

Ce que le visiteur comprend :

> Chaque lumiere porte une trace.

### 1:30 - Premier emerveillement

La fiche montre qu'une phrase ou une etoile est reliee a une archive, une oeuvre ou un concept.

Une ligne lumineuse tres discrete peut relier temporairement l'etoile a un autre point du ciel.

Ce que le visiteur comprend :

> Ce fragment n'est pas seul.

### 2:15 - Premiere comprehension

Le visiteur ouvre une relation.

Il decouvre qu'un concept relie plusieurs elements : une archive, une oeuvre, une image, une salle.

La page ne cherche pas a tout montrer. Elle donne une premiere preuve sensible du Graphe Vivant.

Ce que le visiteur comprend :

> La Constellation montre les liens entre les Recits Vivants.

### 3:30 - Premier depart vers une oeuvre

Le visiteur choisit `Ouvrir cette oeuvre` ou `Voir l'archive liee`.

Avant le depart, une transition breve rappelle que le ciel reste accessible.

Ce que le visiteur emporte :

> Je peux partir vers une oeuvre, puis revenir au ciel pour comprendre ce qu'elle rejoint.

### 5:00 - Retour possible

Si le visiteur revient, la Constellation retrouve son etat contemplatif. Une trace de la relation exploree peut rester subtilement visible.

Ce que le visiteur ressent :

> Le lieu se souvient legerement de mon passage, sans me retenir.

## 4. Elements de l'interface

| Element | Statut cible | Decision |
|---|---|---|
| Image de constellation | Indispensable | Doit redevenir le centre de l'experience. |
| Titre du lieu | Indispensable | Visible mais discret, jamais en panneau massif. |
| Murmure d'accueil | Secondaire | Apparition courte, non bloquante. |
| Etoiles interactives | Indispensable | Principal moyen d'exploration. |
| Action `Deposer une trace` | Indispensable | Visible, mais pas sous forme de grand formulaire permanent. |
| Formulaire de partage | A fusionner | Devient un panneau revele par `Deposer une trace`. |
| Resonance du jour | Secondaire | Devient une presence peripherique ou un tiroir. |
| Quatre cartes patrimoniales | A fusionner | Regrouper dans `Resonances du jour` ou `Explorer les liens`. |
| Ciel / Territoires / Croissance | Secondaire | Garder comme modes avances, pas au premier regard. |
| Chemin Vivant | Secondaire | Proposition volontaire, jamais panneau automatique. |
| Grande Constellation | Secondaire | Apparaissent apres selection d'un territoire ou d'un concept. |
| Statistiques personnelles | A masquer au depart | Afficher seulement dans une lecture personnelle ou Carnet. |
| Graphe complet | Secondaire | Acces avance : `Voir le Graphe Vivant`. |
| Boutons de retour | Indispensable | Toujours presents dans les panneaux, jamais decoratifs. |
| Modales plein ecran | A supprimer | Elles rompent l'impression de paysage. |
| Overlays transparents permanents | A supprimer | Ils bloquent la lecture et les clics. |

## 5. Principes UX

1. Le paysage reste toujours visible.

   Aucune interaction ne doit masquer entierement la constellation.

2. Le premier etat est contemplatif.

   La page doit pouvoir etre vecue sans action immediate.

3. Les panneaux sont temporaires.

   Toute fiche ouverte doit pouvoir etre fermee facilement par bouton, clic exterieur, Escape sur desktop et retour systeme lorsque possible.

4. Une interaction revele une couche, pas un tableau de bord.

   Le visiteur decouvre une etoile, puis une relation, puis une oeuvre. Il ne recoit pas tout le Graphe Vivant d'un seul coup.

5. Le Chemin Vivant reste facultatif.

   Il accompagne le visiteur qui le demande. Il ne definit pas l'usage principal de la Constellation.

6. Une fiche ne doit jamais devenir une page dans la page.

   Les contenus longs doivent etre ouverts dans leur lieu naturel : archive, oeuvre, Graphe Vivant ou Chemin Vivant.

7. Chaque retour au ciel doit etre simple.

   La Constellation est le point de respiration. Le visiteur doit toujours pouvoir revenir a l'etat contemplatif.

8. Mobile d'abord pour les panneaux.

   Sur smartphone, les fiches deviennent des panneaux bas courts et scrollables. Les boutons restent visibles.

9. Desktop et tablette paysage exploitent les marges.

   Les fiches doivent se placer sur les cotes, afin de laisser le centre du ciel visible.

10. La relation doit etre sensible avant d'etre exhaustive.

   Une ligne, un lien, une phrase et deux destinations valent mieux qu'une liste complete affichee trop tot.

## 6. Wireframes

### Ecran d'arrivee - Niveau 0

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  ciel / image de constellation              │
│                                                             │
│                         ✦        ✧                         │
│                                                             │
│            "Ici, les oeuvres se repondent."                 │
│                                                             │
│      ✦                                      ✧               │
│                                                             │
│                                                             │
│  [Deposer une trace]        [Explorer les liens]            │
│                                      [Chemin Vivant]         │
└─────────────────────────────────────────────────────────────┘
```

Regle : aucun panneau central permanent.

### Apres selection d'une etoile - Niveau 1

```text
┌─────────────────────────────────────────────────────────────┐
│                 ciel toujours visible                       │
│                                                             │
│                         ✦ etoile active                    │
│                         │                                   │
│                         │                                   │
│  ┌──────────────────────────────┐                           │
│  │ Fragment                     │                           │
│  │ "Je continue malgre..."      │                           │
│  │                              │                           │
│  │ Constellation : Dialogue     │                           │
│  │ Rejoint : D005, Marges       │                           │
│  │                              │                           │
│  │ [Approfondir] [Fermer]       │                           │
│  └──────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

Regle : petite fiche, ciel non remplace.

### Apres ouverture d'une oeuvre - Niveau 3

```text
┌─────────────────────────────────────────────────────────────┐
│ ciel visible en arriere-plan                                │
│                                                             │
│                 ┌───────────────────────────────┐           │
│                 │ Oeuvre en resonance           │           │
│                 │ Les Marges Vivantes           │           │
│                 │                               │           │
│                 │ Une oeuvre sur les seuils,    │           │
│                 │ les passages et les formes    │           │
│                 │ habitables.                   │           │
│                 │                               │           │
│                 │ Archives : D001, D003, D005   │           │
│                 │ Concepts : Transformation     │           │
│                 │                               │           │
│                 │ [Ouvrir] [Archives liees]     │           │
│                 │ [Retour au ciel]              │           │
│                 └───────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

Regle : l'oeuvre est un passage, pas une destination forcee.

### Chemin Vivant - Niveau 4

```text
┌─────────────────────────────────────────────────────────────┐
│ ciel visible                                                │
│                                                             │
│        ┌──────────────────────────────────────────┐         │
│        │ Chemin Vivant                            │         │
│        │ Je contemple                             │         │
│        │                                          │         │
│        │ 5 etapes pour suivre les liens entre     │         │
│        │ une image, une archive et une oeuvre.    │         │
│        │                                          │         │
│        │ ●────○────○────○────○                    │         │
│        │                                          │         │
│        │ [Commencer] [Continuer librement] [X]    │         │
│        └──────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Regle : le chemin est une invitation refermable.

## 7. Plan de mise en oeuvre

### UX-054 - Refonte de l'arrivee

Objectif :

- reduire l'etat initial ;
- masquer les panneaux non essentiels ;
- replacer le paysage au centre ;
- conserver seulement les actions peripheriques.

Complexite : moyenne.

Reversibilite : forte, car il s'agit surtout de conditions d'affichage et de CSS.

### UX-055 - Refonte des panneaux

Objectif :

- creer une fiche contextuelle unique ;
- harmoniser etoile, concept, archive, oeuvre et image ;
- garantir fermeture, clic exterieur, Escape et retour au ciel.

Complexite : moyenne.

Reversibilite : moyenne, car plusieurs modules devront probablement utiliser le meme composant.

### UX-056 - Navigation par les etoiles

Objectif :

- faire des etoiles le point d'entree principal ;
- clarifier les donnees affichees au premier toucher ;
- limiter les resonances initiales a deux ou trois liens.

Complexite : moyenne.

Reversibilite : forte si le modele de donnees reste intact.

### UX-057 - Chemins Vivants facultatifs

Objectif :

- supprimer toute ouverture automatique du Chemin Vivant ;
- le presenter comme proposition volontaire ;
- afficher une reprise seulement si un chemin existe deja.

Complexite : faible.

Reversibilite : forte.

### UX-058 - Animations et transitions

Objectif :

- instaurer des apparitions par niveaux ;
- utiliser opacity et transform uniquement ;
- respecter `prefers-reduced-motion` ;
- eviter toute animation permanente inutile.

Complexite : faible a moyenne.

Reversibilite : forte.

### UX-059 - Optimisation mobile

Objectif :

- transformer les fiches en panneaux bas courts ;
- verifier smartphone portrait et paysage ;
- limiter la hauteur des panneaux ;
- garantir que le ciel reste visible.

Complexite : moyenne.

Reversibilite : forte.

### UX-060 - Mode Graphe Vivant avance

Objectif :

- clarifier le role de `constellation/vivante/` ;
- le presenter comme mode avance de consultation ;
- relier proprement le ciel immersif au graphe documentaire.

Complexite : faible si la page existante est conservee.

Reversibilite : forte.

## Synthese

La future Constellation Vivante doit etre concue comme un paysage narratif interactif.

Sa force ne viendra pas du nombre d'elements affiches, mais de la qualite de leur apparition. Le visiteur doit d'abord voir le ciel, puis decouvrir qu'une etoile porte une parole, qu'une parole rejoint un concept, qu'un concept ouvre une oeuvre, et qu'une oeuvre peut conduire vers un chemin.

Cette progression transforme la Constellation en experience lisible :

```text
Contempler
  ↓
Toucher une etoile
  ↓
Decouvrir une relation
  ↓
Entrer dans une oeuvre
  ↓
Choisir, peut-etre, un Chemin Vivant
```

La Constellation ne doit pas expliquer le Graphe Vivant. Elle doit en donner l'experience sensible.
