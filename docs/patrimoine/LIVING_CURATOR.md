# Conservateur Vivant

Le Conservateur Vivant est un gardien documentaire du patrimoine relationnel de Makerland.

Il n'est pas une IA conversationnelle. Il ne produit pas de recommandations opaques. Il ne modifie aucune donnee.

Il observe les relations deja presentes dans le Graphe Vivant et aide a maintenir la coherence du territoire lorsque de nouvelles ressources apparaissent.

## Role

Le Conservateur Vivant sert a preparer l'integration de nouvelles ressources :

- archive ;
- oeuvre ;
- image ;
- figure ;
- concept ;
- bloc documentaire ;
- salle future.

Pour chaque ressource, il peut proposer :

- concepts proches ;
- archives concernees ;
- oeuvres liees ;
- images associees ;
- salle Makerland principale ;
- position chronologique probable.

## Sources

Le module utilise uniquement :

- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

Aucune API.

Aucune donnee externe.

Aucune modification des fichiers source.

## Module

Fichier :

`js/livingCurator.js`

API exposee :

- `LivingCurator.load()`
- `LivingCurator.suggest(data, resource)`
- `LivingCurator.conservationReport(data, resource)`
- `LivingCurator.audit(data)`
- `LivingCurator.health(data)`

## Fonctionnement

Une ressource candidate est analysee a partir de ses metadonnees :

- titre ;
- description ;
- tags ;
- concepts ;
- origine ;
- date ;
- type.

Le Conservateur transforme ces champs en tokens, puis compare ces tokens aux libelles et relations deja presents dans les donnees RV-091.

Le resultat n'est jamais une decision.

C'est une proposition de rattachement.

## Rapport de conservation

Un rapport de conservation indique :

- la ressource analysee ;
- les concepts proches ;
- les archives possibles ;
- les oeuvres liees ;
- les images associees ;
- les salles probables ;
- une justification concise.

Exemple de sortie :

> Cette ressource pourrait etre reliee aux archives D003, D005 ; concepts Cosmologie, Passage ; salles ROOM-OEUVRE, ROOM-ATELIER.

## Verification du territoire

Le Conservateur peut detecter :

- ressources orphelines ;
- concepts sans illustration ;
- archives sans oeuvre ;
- oeuvres sans concepts ;
- images non reliees.

Ces signaux ne sont pas des erreurs.

Ils indiquent les lieux ou une future mission documentaire pourra renforcer le graphe.

## Tableau de sante

Le tableau de sante expose :

- nombre d'archives ;
- nombre de concepts ;
- nombre d'oeuvres ;
- nombre d'images ;
- nombre de relations ;
- densite relationnelle ;
- ressources orphelines.

## Regles de conservation

Toujours :

- suggerer sans modifier ;
- documenter l'incertitude ;
- preferer une relation verifiable ;
- respecter les catalogues existants ;
- laisser la validation finale a un humain.

Ne jamais :

- inventer une archive ;
- inventer un concept source ;
- modifier les JSON patrimoniaux ;
- ecrire dans les moteurs ;
- transformer Makerland en systeme de scoring.

## Evolution future

Le Conservateur pourra plus tard aider a integrer :

- D011, D012, D013 ;
- nouvelles couvertures ;
- nouveaux objets NFC ;
- nouveaux packs narratifs ;
- nouveaux articles ;
- nouvelles salles.

Il devra rester un outil discret de coherence, pas un systeme de pilotage du territoire.
