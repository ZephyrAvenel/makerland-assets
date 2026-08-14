# UX-052 — Repenser l'expérience de la Constellation Vivante

## Périmètre

Cette mission est une analyse UX sans modification de code.

Deux espaces portent aujourd'hui le nom de Constellation Vivante :

- l'écran immersif `#e08_constellation`, dans `index.html`, avec l'image `ecrans/ecran-8-constellation.png` et plusieurs couches interactives ;
- la page documentaire `constellation/vivante/`, qui visualise le Graphe Vivant sous forme de concepts, oeuvres, archives et relations.

Le problème observé sur mobile concerne surtout l'écran immersif `#e08_constellation`, car c'est lui qui superpose le paysage, le formulaire, les étoiles locales, les résonances du jour, le Ciel Vivant, les Grandes Constellations et le Chemin Vivant.

## Diagnostic synthétique

La Constellation a une intention forte : devenir le lieu où les oeuvres, les archives, les concepts et les récits des voyageurs entrent en relation.

Aujourd'hui, cette intention existe dans le code, mais elle n'est pas lisible immédiatement. La page présente simultanément trop de portes d'entrée :

- déposer un récit ;
- lire une résonance du jour ;
- explorer quatre cartes patrimoniales ;
- voir sa constellation personnelle ;
- changer de mode du Ciel Vivant ;
- ouvrir une étoile ;
- ouvrir un territoire ;
- ouvrir une Grande Constellation ;
- commencer un Chemin Vivant.

Chaque couche est pertinente isolément. Leur simultanéité transforme cependant le paysage en arrière-plan partiellement masqué. Le visiteur voit une interface riche avant de ressentir un ciel.

## 1. Fonction principale actuelle

La fonction principale actuelle est ambiguë.

Techniquement, l'écran `#e08_constellation` sert à déposer une trace dans la Constellation via `#storyInput` et `#shareStoryButton`.

Narrativement, les modules récents ont déplacé la vocation vers un espace relationnel :

- `travelerConstellation.js` matérialise les récits locaux en étoiles ;
- `livingConstellationExperience.js` propose des résonances patrimoniales du jour ;
- `livingSky.js` crée le Ciel Vivant, les territoires et la croissance ;
- `livingExhibitions.js` ajoute les Grandes Constellations ;
- `livingPaths.js` ajoute le Chemin Vivant.

La page hésite donc entre trois rôles :

- livre de traces ;
- ciel contemplatif ;
- hub relationnel du patrimoine.

La fonction principale n'est pas suffisamment évidente parce que tous ces rôles apparaissent au même niveau visuel.

## 2. Ce qui devrait être visible à l'arrivée

### Visible immédiatement

À l'arrivée, le visiteur devrait voir principalement :

- l'image de constellation ;
- une phrase d'accueil très courte ;
- quelques étoiles ou points lumineux déjà présents ;
- une action discrète : `Déposer une trace` ;
- une invitation secondaire : `Explorer les liens`.

Le Chemin Vivant, les Grandes Constellations, les cartes de résonance et les panneaux détaillés ne devraient pas apparaître d'emblée.

### Caché jusqu'à interaction volontaire

Devraient rester cachés au premier regard :

- les quatre cartes de résonance ;
- le détail d'une étoile ;
- les territoires éditoriaux ;
- les statistiques de croissance ;
- les tableaux de bord ;
- le panneau Chemin Vivant ;
- les Grandes Constellations ;
- la navigation complète du graphe.

Ces éléments doivent naître d'une action claire : toucher une étoile, choisir `Explorer les liens`, ouvrir `Chemin Vivant`, ou déposer une trace.

## 3. Remettre l'image de fond au centre

L'image `ecrans/ecran-8-constellation.png` doit redevenir le premier plan émotionnel.

Recommandation : l'écran devrait avoir un état initial contemplatif de 2 à 4 secondes, sans panneau central. Les modules peuvent être disponibles, mais sous forme de petites présences périphériques.

Hiérarchie proposée :

1. Paysage visible.
2. Titre ou murmure bref.
3. Étoiles interactives.
4. Actions latérales discrètes.
5. Fiches au toucher.

Le visiteur doit pouvoir rester sans rien faire. Cette attente doit être considérée comme une expérience valide, pas comme une absence d'action.

## 4. Rôle du Chemin Vivant

Le Chemin Vivant est trop présent s'il apparaît automatiquement comme action principale.

Il devrait devenir une proposition facultative.

Argument :

- La Constellation est le lieu du lien, pas celui du parcours imposé.
- Le Chemin Vivant est utile pour les visiteurs qui veulent être accompagnés, mais il ne doit pas précéder la contemplation.
- Après UX-050, le panneau est refermable ; la prochaine étape logique est de ne plus le mettre au centre dès l'arrivée.

Position recommandée :

- bouton discret `Suivre un chemin` en bas ou en marge ;
- pas de panneau ouvert automatiquement ;
- ouverture seulement sur demande ;
- mémorisation locale possible si le visiteur a déjà commencé un chemin.

## 5. Hiérarchie de panneaux recommandée

### Niveau 1 — Paysage uniquement

État initial.

Contenu :

- ciel ;
- points lumineux ;
- phrase courte ;
- action `Déposer une trace` ;
- action secondaire `Explorer les liens`.

Objectif : comprendre que l'on entre dans un paysage vivant.

### Niveau 2 — Petite fiche contextuelle

Déclenchée par un toucher sur une étoile, un concept ou un point lumineux.

Contenu :

- titre ;
- phrase courte ;
- 2 ou 3 liens maximum ;
- bouton `Approfondir`.

Objectif : donner une réponse immédiate sans masquer le ciel.

### Niveau 3 — Fiche détaillée

Déclenchée par `Approfondir`.

Contenu :

- archive liée ;
- oeuvre liée ;
- concepts ;
- images patrimoniales ;
- bouton retour au ciel.

Objectif : explorer sans quitter le sentiment de constellation.

### Niveau 4 — Navigation complète

Déclenchée explicitement par `Explorer le graphe` ou `Voir toutes les relations`.

Contenu :

- filtres ;
- concepts ;
- oeuvres ;
- archives ;
- visualisation structurée.

Objectif : consultation avancée, pas état initial.

## 6. Éléments à simplifier

### Overlays permanents

`livingConstellationExperience` affiche la citation du jour et les cartes de résonance dès l'arrivée. Ces éléments devraient devenir secondaires ou apparaître après un délai.

### Cartes flottantes

Les quatre cartes `Archive Vivante`, `Concept Vivant`, `Image patrimoniale`, `Oeuvre en résonance` sont utiles, mais elles ressemblent à un tableau de bord. Elles devraient être regroupées sous une action `Résonances du jour`.

### Formulaire central

Le panneau natif `.constellation-panel` est techniquement important, mais il occupe une zone centrale de l'image. Il devrait devenir une action révélée : `Déposer une trace`, puis ouverture d'une fiche d'écriture.

### Modes du Ciel Vivant

Les modes `Ciel`, `Territoires`, `Croissance` sont pertinents pour une exploration avancée. En état initial, seul `Ciel` devrait être visible. Les autres modes peuvent être accessibles via `Explorer`.

### Panneaux redondants

Plusieurs modules expliquent la même idée : les oeuvres ne sont pas isolées. Cette phrase peut devenir le principe éditorial unique de l'écran, puis les modules le démontrent par interaction.

### Informations statistiques

`Votre constellation`, `visites`, `concepts`, `croissance` sont utiles mais ne doivent pas apparaître avant que le visiteur ait choisi une lecture personnelle ou patrimoniale.

## 7. Parcours idéal

Parcours recommandé :

1. Arrivée.
   Le visiteur voit le paysage presque seul.

2. Découverte du ciel.
   Quelques étoiles respirent. Un murmure bref indique que les récits se répondent ici.

3. Première interaction.
   Le visiteur touche une étoile ou choisit `Déposer une trace`.

4. Petite fiche.
   Une fiche légère s'ouvre, sans masquer plus de 25 à 30 % du paysage.

5. Découverte d'une relation.
   La fiche propose un concept, une archive ou une oeuvre liée.

6. Exploration approfondie.
   Le visiteur peut ouvrir une fiche détaillée ou entrer dans la page `constellation/vivante/`.

7. Chemin Vivant facultatif.
   Le Chemin Vivant apparaît comme proposition : `Suivre un chemin parmi ces liens`.

8. Retour libre.
   Chaque fiche peut se refermer. Le ciel redevient toujours disponible.

## Nouvelle architecture proposée

### État A — Contemplation

État par défaut.

- Fond pleinement visible.
- Aucun grand panneau.
- Boutons périphériques : `Déposer une trace`, `Explorer les liens`, `Chemin Vivant`.
- Résonance du jour réduite à une phrase courte.

Complexité : moyenne.

### État B — Trace

Ouverture volontaire du formulaire.

- Petit panneau d'écriture.
- Après partage, une étoile apparaît.
- Réponse narrative courte.
- Proposition : `Voir ce que cette trace rejoint`.

Complexité : moyenne.

### État C — Étoile

Toucher une étoile.

- Fiche contextuelle.
- Texte du fragment.
- Catégorie.
- 2 ou 3 résonances.
- Boutons : `Approfondir`, `Fermer`.

Complexité : faible à moyenne, car `livingSky.js` possède déjà une fiche.

### État D — Résonances

Ouverture volontaire des cartes du jour.

- Les quatre cartes deviennent une grille secondaire.
- Pas visible par défaut.
- Chaque carte ouvre soit une vraie destination, soit une fiche.

Complexité : faible.

### État E — Graphe complet

Accès vers `constellation/vivante/` ou panneau avancé.

- Recherche.
- Concepts.
- Archives.
- Oeuvres.
- Carte relationnelle.

Complexité : faible si redirection vers la page existante, élevée si intégrée dans l'écran immersif.

### État F — Chemin Vivant

Ouverture volontaire.

- Panneau issu de UX-050.
- Aucun affichage automatique.
- Bouton compact si un chemin est en cours.

Complexité : faible.

## Priorités recommandées

### Priorité 1 — Réduire l'état initial

Ne garder au premier affichage que le paysage, un murmure et 2 ou 3 actions discrètes.

Impact : très fort.

Complexité : moyenne.

### Priorité 2 — Ne plus ouvrir le Chemin Vivant automatiquement

Le transformer en proposition latérale.

Impact : fort.

Complexité : faible.

### Priorité 3 — Transformer les résonances du jour en tiroir

Les quatre cartes ne doivent plus apparaître comme tableau initial.

Impact : fort.

Complexité : faible à moyenne.

### Priorité 4 — Révéler le formulaire au toucher

Le formulaire d'écriture doit être accessible mais non central au premier regard.

Impact : fort.

Complexité : moyenne.

### Priorité 5 — Unifier les fiches

Créer une fiche unique pour étoile, concept, archive, oeuvre, image.

Impact : moyen à fort.

Complexité : moyenne.

### Priorité 6 — Clarifier le lien avec `constellation/vivante/`

Présenter cette page comme le mode avancé : `Voir le Graphe Vivant`.

Impact : moyen.

Complexité : faible.

## Estimation des améliorations

| Amélioration | Impact UX | Complexité |
|---|---:|---:|
| Masquer les panneaux non essentiels au chargement | Très fort | Moyenne |
| Chemin Vivant uniquement volontaire | Fort | Faible |
| Résonances du jour en tiroir | Fort | Faible / moyenne |
| Formulaire `Déposer une trace` révélé au toucher | Fort | Moyenne |
| Fiche contextuelle unique | Moyen / fort | Moyenne |
| Redirection claire vers le Graphe Vivant | Moyen | Faible |
| Mode contemplation prolongé | Fort | Faible |
| Audit z-index complet après refonte | Moyen | Faible |

## Conclusion

La Constellation possède déjà toutes les briques nécessaires pour devenir un lieu emblématique. Le problème n'est pas le manque de fonctionnalités, mais l'absence d'une hiérarchie de révélation.

La refonte future devrait partir d'un principe simple :

> Le ciel d'abord. Les relations ensuite. Le parcours seulement si le visiteur le demande.

Cette règle permettrait de transformer l'écran en paysage vivant plutôt qu'en accumulation de panneaux. La Constellation deviendrait alors le lieu où le visiteur contemple, touche, découvre, relie et choisit librement d'approfondir.
