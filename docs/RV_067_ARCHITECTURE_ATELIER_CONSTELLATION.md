# RV-067 - Architecture de l'Atelier IA et de la Constellation des Recits Vivants

## Intention generale

Cette mission concoit l'Atelier IA et la Constellation des Recits Vivants comme deux lieux a part entiere.

Elle ne propose aucun developpement immediat. Elle decrit une architecture fonctionnelle, narrative et evolutive fondee sur les illustrations deja presentes dans Makerland:

- `ecrans/ecran-7-atelier.png` pour l'Atelier IA;
- `ecrans/ecran-8-constellation.png` pour la Constellation.

Ces images ne doivent pas etre refaites. Elles deviennent les portes d'entree et les centres visuels des futurs espaces interactifs.

L'objectif n'est pas que le visiteur utilise un logiciel. L'objectif est qu'il entre dans deux lieux:

- l'Atelier IA, les coulisses de la creation;
- la Constellation, le lieu ou les recits continuent de vivre chez les lecteurs.

## Principes de conception

Les deux lieux respectent les documents fondateurs deja presents dans le depot:

- la Charte de l'Experience Vivante: accueillir avant d'agir;
- le Living Passages Manifesto: chaque passage est deja un recit;
- le Living Places Guide: un lieu doit pouvoir etre habite avant d'etre utilise;
- l'inventaire de la Boussole: relier l'existant avant de creer de nouveaux territoires.

Les futures couches HTML, CSS ou JSON devront donc rester discretes. Elles ne doivent jamais couvrir le decor, expliquer trop vite, ni transformer les lieux en panneaux de commande.

Chaque interaction doit sembler naitre naturellement de l'image.

## Partie I - L'Atelier IA

### Role du lieu

L'Atelier IA est le territoire de la creation accompagnee.

Il ne doit pas etre presente comme un outil d'intelligence artificielle. Il doit ressembler aux coulisses calmes d'une oeuvre en train de naitre: une table de travail, des carnets ouverts, des images en gestation, des fragments, des cartes, des prototypes, des hesitations fecondes.

Le visiteur n'y vient pas pour produire vite. Il y vient pour laisser une intuition prendre forme.

### Point d'entree

Direction depuis la Boussole:

```text
Creer
  |
  v
e07_atelier
```

L'image actuelle reste la scene principale. Les six zones deja declarees dans `data/zones-v3-final-beta.json` forment une base d'architecture:

| Zone existante | Action declaree | Interpretation narrative |
| --- | --- | --- |
| `dialogue_ia` | `atelier:dialogue_ia` | Dialoguer avec une presence de travail |
| `cartographie` | `atelier:cartographie` | Cartographier une idee ou un recit |
| `images` | `atelier:images` | Explorer les images et symboles |
| `clarification` | `atelier:clarification` | Demeler une intuition |
| `evolution` | `atelier:evolution` | Observer la transformation d'un projet |
| `entrer_atelier` | `atelier:start` | Franchir le seuil de l'atelier |

### Espaces proposes

#### 1. Le Seuil de l'Atelier

Nom: Le Seuil de l'Atelier.

Role: accueillir le visiteur avant toute creation.

Intention narrative: rappeler que creer ne commence pas par produire, mais par rendre une intuition habitable.

Ce que decouvre le visiteur: l'illustration actuelle dans sa pleine presence, un court Murmure eventuel, puis une invitation discrete a entrer.

Interactions possibles:

- entrer dans l'atelier;
- revenir a la Boussole;
- attendre sans etre sollicite.

Liens:

- arrivee depuis `Creer`;
- retour vers la Boussole Vivante;
- ouverture vers les cinq espaces internes.

#### 2. La Naissance d'une intuition

Nom: La Naissance d'une intuition.

Role: deposer le premier fragment d'une idee.

Intention narrative: proteger le moment fragile ou une idee n'est pas encore claire.

Ce que decouvre le visiteur:

- une zone de depot tres simple;
- quelques amorces poetiques;
- la possibilite de noter une phrase, une image mentale ou une question.

Interactions possibles:

- ecrire une phrase de depart;
- choisir une tonalite douce: brume, seuil, appel, tension, lumiere;
- conserver localement le fragment sans transmission externe;
- transformer ce fragment en carte, image ou dialogue.

Liens:

- vers Dialogues auteur / IA;
- vers Carnets;
- vers Cartes Narratives.

#### 3. Dialogues auteur / IA

Nom: La Table du Dialogue.

Role: permettre une conversation de creation sans donner l'impression de parler a une machine.

Intention narrative: l'IA n'est pas un oracle. Elle devient un compagnon de formulation, un miroir de travail, jamais une autorite.

Ce que decouvre le visiteur:

- un espace calme de questions;
- des reponses qui reformulent, ouvrent, proposent;
- des options pour approfondir sans accelerer.

Interactions possibles:

- clarifier une intention;
- demander plusieurs formulations;
- transformer une idee en scene, carnet, carte ou prototype;
- sauvegarder localement les fragments retenus.

Liens:

- vers Clarification;
- vers Evolution d'une idee;
- vers Carnets;
- vers Prototypes.

#### 4. Clarification

Nom: Le Cabinet de Clarification.

Role: aider le visiteur a mieux nommer ce qu'il cherche.

Intention narrative: clarifier sans juger, sans diagnostiquer, sans enfermer.

Ce que decouvre le visiteur:

- quelques questions lentes;
- des formulations alternatives;
- des mots-pivots qui apparaissent comme des reperes.

Interactions possibles:

- choisir un mot qui resonne;
- ecarter un mot sans consequence;
- transformer la clarification en carte de projet;
- revenir au fragment initial.

Liens:

- vers Cartographie;
- vers Evolution;
- vers Constellation si le fragment devient partageable.

#### 5. Cartographie d'une idee

Nom: La Table des Cartes.

Role: transformer une intuition en territoire lisible.

Intention narrative: une idee devient un paysage que l'on peut parcourir.

Ce que decouvre le visiteur:

- une carte simple de relations;
- des noeuds: personnages, lieux, tensions, images, questions;
- des chemins possibles.

Interactions possibles:

- creer un noeud;
- relier deux fragments;
- nommer une direction;
- exporter ou sauvegarder une carte locale;
- envoyer une carte vers les Cartes Narratives.

Liens:

- vers l'Atlas;
- vers Cartes Narratives;
- vers Bibliotheque si une ressource eclaire le projet.

#### 6. Images et symboles

Nom: La Chambre des Images.

Role: explorer la dimension visuelle des recits.

Intention narrative: les images ne decorent pas l'idee. Elles revelent son climat.

Ce que decouvre le visiteur:

- fragments visuels;
- symboles recurrents;
- ambiances;
- prototypes d'illustrations.

Interactions possibles:

- associer une image a une intuition;
- choisir une ambiance;
- comparer plusieurs directions visuelles;
- preparer un prototype.

Liens:

- vers Prototypes;
- vers Bibliotheque;
- vers Constellation si une image devient une trace partageable.

#### 7. Carnets

Nom: Les Carnets de Travail.

Role: conserver les etapes d'une creation.

Intention narrative: un carnet n'est pas un dossier. C'est la memoire douce d'un chemin.

Ce que decouvre le visiteur:

- fragments sauvegardes;
- essais de titres;
- images retenues;
- questions non resolues;
- versions successives.

Interactions possibles:

- relire;
- continuer;
- transformer un fragment en prototype;
- exporter un carnet;
- lier un carnet a une ressource de la Bibliotheque.

Liens:

- vers les sous-bibliotheques de Carnets;
- vers Evolution d'une idee;
- vers Constellation.

#### 8. Evolution d'une idee

Nom: La Galerie des Metamorphoses.

Role: montrer comment une idee change sans perdre son origine.

Intention narrative: l'evolution n'est pas une optimisation. C'est une maturation.

Ce que decouvre le visiteur:

- une chronologie sobre;
- le fragment initial;
- les bifurcations;
- les versions abandonnees;
- les formes plus abouties.

Interactions possibles:

- comparer deux etapes;
- restaurer une ancienne version;
- nommer un passage;
- marquer un jalon narratif.

Liens:

- vers Memoire Vivante;
- vers Projets futurs;
- vers Constellation.

#### 9. Prototypes

Nom: Le Laboratoire Vivant.

Role: tester des formes sans les figer.

Intention narrative: un prototype est une porte entrouverte, pas une promesse definitive.

Ce que decouvre le visiteur:

- essais de cartes;
- brouillons de pages;
- fragments audio futurs;
- structures de packs narratifs;
- micro-experiences.

Interactions possibles:

- ouvrir un prototype;
- lire son intention;
- l'envoyer vers un carnet;
- le marquer comme piste future.

Liens:

- vers Projets futurs;
- vers Bibliotheque;
- vers Oeuvres immersives.

#### 10. Projets futurs

Nom: Les Portes en Preparation.

Role: rendre visible ce qui n'est pas encore termine sans creer de frustration.

Intention narrative: un lieu vivant peut montrer ses travaux en cours comme une respiration, pas comme une liste de promesses.

Ce que decouvre le visiteur:

- portes fermees mais lumineuses;
- mentions "en gestation";
- axes a venir: packs narratifs, NFC, ateliers, carnets, atlas, objets.

Interactions possibles:

- lire une note d'intention;
- demander a etre redirige vers une ressource deja disponible;
- revenir au coeur de l'Atelier.

Liens:

- vers Cartes Narratives;
- vers Bibliotheque;
- vers Constellation.

### Parcours ideal du visiteur dans l'Atelier

```text
Boussole Vivante
  |
  v
Creer
  |
  v
Seuil de l'Atelier
  |
  v
Naissance d'une intuition
  |
  v
Dialogue auteur / IA
  |
  v
Clarification
  |
  v
Cartographie d'une idee
  |
  v
Images et symboles
  |
  v
Carnet de travail
  |
  v
Prototype ou retour a la Boussole
```

Ce parcours ne doit jamais etre obligatoire. L'Atelier propose des chambres de travail. Le visiteur peut entrer par une intuition, une image, une carte ou une question.

## Partie II - La Constellation des Recits Vivants

### Role du lieu

La Constellation est le territoire des resonances.

Elle n'est pas un reseau social. Elle n'est pas un mur de commentaires. Elle n'est pas une messagerie.

Elle est le lieu ou les oeuvres continuent de vivre chez les lecteurs.

Le visiteur y decouvre que son passage peut devenir une etoile discrete dans un ciel commun. Il peut lire des traces, en deposer une, suivre un chemin entre les recits, ou simplement contempler.

### Point d'entree

Direction depuis la Boussole:

```text
Trouver un repere
  |
  v
e08_constellation
```

L'image actuelle reste le decor principal. Les trois zones deja declarees forment le socle:

| Zone existante | Action declaree | Interpretation narrative |
| --- | --- | --- |
| `story_input` | `story_input` | Deposer une trace de passage |
| `share_story` | `share_story` | Confier la trace au ciel commun |
| `how_it_works` | `show_help` | Comprendre sans sortir du lieu |

### Espaces proposes

#### 1. Le Ciel des passages

Nom: Le Ciel des passages.

Role: afficher les traces partagees comme des etoiles.

Intention narrative: chaque trace est petite, mais elle participe a une constellation plus grande.

Ce que decouvre le visiteur:

- des points lumineux;
- quelques fragments tres courts;
- des etoiles reliees par affinite narrative.

Interactions possibles:

- toucher une etoile;
- lire une trace courte;
- suivre une ligne vers une oeuvre;
- revenir au ciel sans perdre son orientation.

Liens:

- vers Bibliotheque;
- vers Oeuvres immersives;
- vers Atelier si une trace donne envie de creer.

#### 2. Les Etoiles

Nom: Les Etoiles.

Role: representer les contributions ou resonances.

Intention narrative: une etoile ne met pas son auteur en avant. Elle laisse visible le chemin parcouru.

Ce que decouvre le visiteur:

- un titre bref;
- une phrase;
- une origine possible: livre, carte, atelier, arche, meteo;
- un lien de retour vers l'oeuvre concernee.

Interactions possibles:

- ouvrir une etoile;
- filtrer tres doucement par territoire;
- marquer une etoile comme repere local;
- ne jamais liker, classer ou noter.

Liens:

- vers livre source;
- vers carte associee;
- vers direction de Boussole correspondante.

#### 3. Les Temoignages

Nom: Les Voix de passage.

Role: accueillir des textes un peu plus longs.

Intention narrative: temoigner n'est pas se justifier. C'est laisser une trace habitable.

Ce que decouvre le visiteur:

- temoignages anonymes ou signes par un prenom choisi;
- extraits lies a une oeuvre;
- recits de transformation sans interpretation psychologique.

Interactions possibles:

- lire;
- ouvrir le contexte de l'oeuvre;
- deposer une trace;
- masquer les temoignages pour revenir au ciel.

Liens:

- vers Bibliotheque;
- vers Carnets;
- vers Oeuvre immersive.

#### 4. Les Resonances

Nom: Les Resonances.

Role: montrer les echos entre plusieurs fragments.

Intention narrative: les recits ne s'alignent pas en categories. Ils se repondent.

Ce que decouvre le visiteur:

- liens faibles entre etoiles;
- mots communs;
- paysages interieurs recurrents;
- directions souvent empruntees.

Interactions possibles:

- suivre une resonance;
- revenir a l'etoile initiale;
- ouvrir une ressource associee;
- deposer une trace depuis une resonance.

Liens:

- vers Memoire Vivante locale;
- vers Cartes Narratives;
- vers Atelier pour transformer une resonance en intuition.

#### 5. Les Chemins entre les recits

Nom: Les Chemins de constellation.

Role: permettre une exploration lente d'oeuvre en oeuvre.

Intention narrative: une oeuvre n'est jamais isolee. Elle appelle d'autres chemins.

Ce que decouvre le visiteur:

- parcours courts entre trois ou quatre etoiles;
- associations: brume, seuil, arche, vol, lumiere, marge;
- chemins proposes sans obligation.

Interactions possibles:

- commencer un chemin;
- l'interrompre;
- revenir a la Boussole;
- ouvrir un livre ou une carte liee.

Liens:

- vers Bibliotheque;
- vers Atlas;
- vers Oeuvre immersive.

#### 6. Contribuer

Nom: Deposer une etoile.

Role: offrir une contribution simple, locale ou partageable selon les futures decisions.

Intention narrative: contribuer ne doit jamais ressembler a remplir un formulaire. Le visiteur confie une trace.

Ce que decouvre le visiteur:

- une zone d'ecriture sobre;
- une phrase d'accueil;
- une information claire sur la confidentialite;
- une option de contribution reversible.

Interactions possibles:

- ecrire une trace courte;
- choisir un territoire d'origine;
- previsualiser l'etoile;
- confirmer ou effacer;
- conserver localement si le partage public n'est pas pret.

Liens:

- vers Constellation;
- vers Memoire Vivante;
- vers Atelier pour retravailler la trace.

### Croissance sur plusieurs annees

La Constellation doit pouvoir grandir lentement.

Phase initiale:

- traces locales;
- quelques etoiles exemples issues des oeuvres;
- liens vers les livres existants.

Phase intermediaire:

- contributions moderees;
- regroupements par territoires;
- chemins de lecture;
- resonances liees aux cartes et a l'Atelier.

Phase longue:

- constellations par oeuvre;
- constellations par saison narrative;
- archives vivantes;
- passages entre contributions, atlas, carnets et oeuvres immersives.

Dans tous les cas, la Constellation ne doit jamais devenir un flux social. Elle doit rester un ciel lisible, rare, respirant.

## Partie III - Organisation des couches interactives

### Principe commun

Les illustrations sont les lieux. Les couches interactives ne doivent pas prendre leur place.

Les zones peuvent rester invisibles par defaut et se reveler seulement par:

- un halo au toucher;
- une legere lueur au survol;
- un titre bref;
- une respiration lumineuse;
- une apparition tres progressive d'un court texte.

Les interactions doivent respecter le decor:

- ne pas masquer les centres visuels;
- ne pas couvrir les textes integres aux images;
- ne pas ajouter de panneaux opaques;
- ne pas transformer les zones en boutons standards.

### Atelier IA - Placement conceptuel

L'Atelier peut etre lu comme une table de travail composee de stations.

Zones interactives recommandees:

| Zone | Placement naturel | Apparition au toucher | Rendu permanent |
| --- | --- | --- | --- |
| Dialogue auteur / IA | Partie associee au dialogue ou au poste de travail | Halo chaud, titre court | Invisible ou tres leger filet |
| Cartographie | Zone des cartes, schemas ou plans | Lueur ambree, quelques lignes fines | Invisible |
| Images | Zone des images, cadres, supports visuels | Reflet doux, titre | Invisible |
| Clarification | Zone de notes, carnet ou lumiere de table | Halo blanc casse | Invisible |
| Evolution | Zone de fragments, timeline ou panneaux | Ligne lumineuse lente | Invisible |
| Entrer dans l'atelier | Zone centrale basse deja declaree | Invitation persistante mais discrete | Texte tres sobre |

Elements invisibles par defaut:

- contours de hitboxes;
- explications;
- panneaux de mode d'emploi;
- menus de navigation internes.

Elements pouvant apparaitre au toucher:

- nom de l'espace;
- phrase d'intention d'une ligne;
- invitation a entrer;
- lien de retour.

### Constellation - Placement conceptuel

La Constellation peut etre lue comme un ciel et un lieu de depot.

Zones interactives recommandees:

| Zone | Placement naturel | Apparition au toucher | Rendu permanent |
| --- | --- | --- | --- |
| Etoiles | Points lumineux existants ou zones celestes | Fragment court, halo | Etoiles discretes |
| Deposer une trace | Zone actuelle `story_input` | Champ d'ecriture apaise | Visible seulement si le visiteur choisit de contribuer |
| Confier au ciel | Zone `share_story` | Invitation lumineuse | Bouton organique, jamais formulaire brut |
| Comment cela fonctionne | Zone `how_it_works` | Aide tres courte | Point d'information discret |
| Chemins entre recits | Lignes faibles entre etoiles | Ligne revelee lentement | Presque invisible |
| Liens vers les oeuvres | Etoiles liees aux livres | Titre de l'oeuvre et porte de retour | Invisible tant que non sollicite |

Elements invisibles par defaut:

- formulaires complets;
- listes de temoignages;
- filtres;
- outils de tri;
- administration.

Elements pouvant apparaitre au toucher:

- une trace;
- une origine;
- un lien vers une oeuvre;
- une invitation a contribuer;
- un rappel de confidentialite.

### Sobriete graphique

Les deux lieux doivent privilegier:

- texte court;
- halos diffus;
- transitions lentes;
- zones tactiles confortables;
- absence de chrome applicatif;
- retours discrets vers la Boussole.

Un bon etat interactif doit etre perceptible sans que le visiteur pense "bouton".

## Partie IV - Parcours complet

### Cycle global

```text
Bibliotheque Vivante
  |
  v
Boussole Vivante
  |
  v
Cartes Narratives
  |
  v
Oeuvres immersives
  |
  v
Atelier IA
  |
  v
Constellation
  |
  v
Retour vers les oeuvres
```

### Role de chaque etape

Bibliotheque Vivante:

Lieu de rencontre avec les oeuvres. Le visiteur y decouvre les livres, ressources, portes ouvertes et salles immersives. Elle donne de la matiere.

Boussole Vivante:

Lieu d'orientation. Le visiteur n'est pas dirige. Il choisit une direction depuis son paysage interieur.

Cartes Narratives:

Lieu de lecture du territoire. Les cartes aident a comprendre les relations entre chemins, marges, atlas et mondes habitables.

Oeuvres immersives:

Lieu de plongee. Le visiteur franchit l'Arche ou un autre Passage Vivant pour entrer dans une oeuvre.

Atelier IA:

Lieu de transformation. Ce qui a ete lu, vu ou ressenti peut devenir intuition, carnet, carte, image, dialogue ou prototype.

Constellation:

Lieu de resonance. Le chemin personnel devient une trace possible dans un ciel commun. Les oeuvres continuent de vivre dans les lecteurs.

Retour vers les oeuvres:

Le cycle ne se ferme pas. Il s'elargit. Une resonance peut conduire a relire, creer, explorer une autre carte, ou revenir a la Boussole.

### Relation entre Atelier et Constellation

L'Atelier est le lieu ou une idee prend forme.

La Constellation est le lieu ou une forme trouve une resonance.

Le premier accompagne la creation intime. La seconde accueille le partage delicat.

Ils ne doivent pas se confondre:

- l'Atelier protege le brouillon;
- la Constellation accueille la trace;
- la Bibliotheque donne les oeuvres;
- la Boussole rend le chemin libre.

## Partie V - Feuille de route progressive

### Version 1 - Nommer les lieux

Objectif: rendre l'Atelier et la Constellation lisibles comme lieux sans changer leur architecture.

Travaux possibles:

- ajouter des textes d'accueil sobres;
- clarifier les retours vers la Boussole;
- rendre les zones existantes perceptibles au toucher;
- documenter les actions actuelles.

Livrable independant: deux ecrans habitables, sans nouvelle logique complexe.

### Version 2 - Activer les zones de l'Atelier

Objectif: faire des six zones existantes de `e07_atelier` de vrais espaces internes.

Travaux possibles:

- relier `atelier:dialogue_ia`;
- relier `atelier:cartographie`;
- relier `atelier:images`;
- relier `atelier:clarification`;
- relier `atelier:evolution`;
- rendre `atelier:start` narrativement clair.

Livrable independant: un Atelier navigable par stations, toujours fonde sur l'image actuelle.

### Version 3 - Structurer les traces de la Constellation

Objectif: transformer le formulaire actuel en geste narratif.

Travaux possibles:

- deposer une trace courte;
- afficher les traces comme etoiles locales;
- relier une trace a un territoire d'origine;
- expliquer la memoire locale et reversible;
- garder une sobriete absolue.

Livrable independant: une Constellation locale, habitable et comprehensible.

### Version 4 - Relier Atelier, Bibliotheque et Cartes

Objectif: permettre aux intuitions de circuler entre les lieux existants.

Travaux possibles:

- envoyer une intuition vers une carte;
- associer une ressource de Bibliotheque a un carnet;
- ouvrir un chemin de creation depuis une oeuvre;
- revenir a la Boussole apres un prototype.

Livrable independant: un premier reseau creatif interne.

### Version 5 - Ouvrir la Constellation dans la duree

Objectif: permettre a la Constellation de grandir pendant plusieurs annees.

Travaux possibles:

- definir une moderation douce;
- organiser les etoiles par oeuvre;
- creer des chemins de resonance;
- relier contributions, atlas, carnets et oeuvres immersives;
- preparer une architecture publique sans suivi intrusif.

Livrable independant: une Constellation extensible, toujours non sociale, non evaluative et hospitaliere.

## Recommandations finales

1. Conserver les illustrations comme centres.

Les images actuelles ne sont pas des fonds. Elles sont les lieux. Toute couche future doit se comporter comme une revelation de l'image.

2. Eviter les interfaces de productivite.

L'Atelier IA ne doit pas devenir un tableau de bord de prompts. Il doit rester un lieu de creation lente.

3. Eviter le modele social.

La Constellation ne doit pas devenir un fil, un mur, un classement ou une competition de visibilite. Elle doit rester une nuit commune ou les traces brillent doucement.

4. Proteger la liberte du visiteur.

Aucun parcours ne doit etre obligatoire. Chaque lieu propose, attend, laisse repartir.

5. Developper par couches minces.

Chaque version doit pouvoir etre ajoutee sans refonte. Les zones existantes, le JSON, ZoneRenderer et les images doivent rester les fondations naturelles.

## Conclusion

L'Atelier IA et la Constellation sont les deux poles futurs de la participation vivante.

L'Atelier accueille ce qui nait.

La Constellation accueille ce qui resonne.

Entre les deux, Makerland peut devenir plus qu'un ensemble de pages: un monde ou lire, s'orienter, creer et partager demeurent quatre gestes d'un meme recit vivant.
