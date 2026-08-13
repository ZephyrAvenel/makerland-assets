# Guide Vivant de Makerland

Le Guide Vivant est une presence discrete du territoire.

Il n'est pas un chatbot. Il ne repond pas a des questions. Il ne produit aucun texte par intelligence artificielle.

Il lit simplement les relations deja presentes dans le Graphe Vivant et les transforme en invitations narratives.

## Philosophie

Makerland ne cherche pas a imposer un parcours.

Le Guide Vivant accompagne le visiteur en rendant visibles les continuites deja presentes entre :

- archives ;
- concepts ;
- œuvres ;
- images ;
- figures ;
- salles ;
- articles candidats.

Son role est de suggerer, jamais de choisir.

## Fonctionnement

Module :

`js/livingGuide.js`

Sources :

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

Le module ecoute les selections produites par la Constellation Vivante :

`living-graph:selected`

Puis il calcule une suggestion a partir des relations disponibles.

## Familles de suggestions

Le Guide Vivant peut produire plusieurs formes d'invitation :

- Resonance : une idee dialogue avec d'autres elements.
- Prolongement : un lieu peut mener vers un autre.
- Origine : une œuvre laisse voir ce qui l'a nourrie.
- Transformation : une intuition evolue vers d'autres formes.
- Correspondance : une image reapparait dans d'autres contextes.
- Retour : une idee deja rencontree revient autrement.

## Interface

Le Guide apparait comme une petite carte integree a la scene.

Il ne s'agit pas :

- d'une fenetre ;
- d'un assistant conversationnel ;
- d'une notification ;
- d'un systeme de recommandation opaque.

La carte contient :

- un titre discret ;
- une phrase narrative ;
- un bouton `Explorer` lorsque la relation peut devenir le nouveau centre du graphe.

## Memoire locale

Le Guide utilise une memoire locale minimale :

`makerland.livingGuide.memory`

Elle contient :

- les nœuds deja rencontres ;
- le dernier nœud consulte ;
- la date locale de mise a jour.

Cette memoire ne quitte jamais le navigateur. Elle ne sert pas a profiler le visiteur.

## Regles

Toujours :

- utiliser les relations existantes ;
- afficher une seule suggestion ;
- laisser le visiteur libre ;
- rester discret ;
- accepter l'absence de donnees.

Ne jamais :

- inventer des archives ;
- inventer des packs narratifs ;
- imposer un itineraire ;
- transformer le Guide en chatbot ;
- envoyer une donnee a un serveur.

## Evolutions possibles

Les prochaines versions pourront relier le Guide a :

- toutes les pages d'archives ;
- les futures archives D011+ ;
- les pages d'œuvres ;
- les objets vivants ;
- le Carnet de Voyage ;
- les packs narratifs lorsqu'ils auront un catalogue structure.

Le principe doit rester stable :

le Guide n'ajoute pas de sens de l'exterieur ; il revele les relations internes du territoire.
