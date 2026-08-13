# Living Constellation Experience

RV-098 transforme la Constellation des Recits Vivants en un lieu vivant, sans serveur, sans API et sans intelligence artificielle distante.

L'experience repose sur une idee simple : la page n'est jamais exactement la meme, parce que les resonances du jour, la saison locale, le moment de la journee et les traces deja deposees composent une presence differente.

## Architecture

La couche est autonome :

- `js/livingConstellationExperience.js`
- `css/living-constellation-experience.css`
- `data/daily-resonances.json`

Elle est chargee par `index.html` sur l'ecran `e08_constellation`.

Elle ne modifie aucun moteur existant :

- `Navigation`
- `BookRenderer`
- `ZoneRenderer`
- `NarrativeMemory`
- `LivingEcho`
- packs narratifs
- JSON metier existants

## Sources patrimoniales

Le module reutilise exclusivement les donnees locales deja produites :

- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`
- la memoire locale RV-097 `makerland:traveler-constellation`
- la memoire locale RV-084/RV-086 `makerland:living-cycle`

## Resonance du jour

Le fichier `data/daily-resonances.json` contient un petit corpus de citations narratives.

La selection est deterministe : elle depend de la date du jour. Les visiteurs retrouvent donc une coherence quotidienne sans appel reseau.

La saison locale peut orienter la citation ou la phrase d'accompagnement.

## Quatre cartes vivantes

Sous le formulaire principal, la Constellation affiche quatre cartes :

- Archive Vivante ;
- Concept Vivant ;
- Image patrimoniale ;
- Oeuvre en resonance.

Ces cartes sont choisies a partir du Graphe Vivant et changent progressivement au fil des jours.

Lorsque l'image patrimoniale possede un chemin local, une miniature est affichee. Lorsque le catalogue pointe vers une ressource distante, le module conserve le titre et le sujet sans declencher de chargement externe, afin de respecter le fonctionnement local.

## Reponse apres partage

Lorsqu'un visiteur depose une phrase, RV-097 cree le fragment local enrichi. RV-098 lit cette trace et affiche une reponse narrative :

- etape symbolique de la constellation personnelle ;
- concepts associes ;
- archive candidate ;
- oeuvre en resonance ;
- salle possible.

Cette reponse disparait doucement. Elle n'interrompt pas le lieu.

## Memoire locale

La memoire propre a RV-098 est stockee dans :

`makerland.traveler.constellation`

Elle conserve :

- nombre de visites ;
- nombre de recits ;
- archives ouvertes ou suggerees ;
- concepts rencontres ;
- oeuvres decouvertes ;
- images rencontrees ;
- date de premiere rencontre.

Aucune donnee n'est envoyee hors du navigateur.

## Integration avec le Guide Vivant

Le module reste compatible avec le Guide Vivant RV-093 : les cartes et reponses emploient les memes familles de donnees patrimoniales, afin que les futures suggestions puissent pointer vers les archives, la Bibliotheque, l'Atelier, l'Oeuvre immersive ou la Constellation Vivante.

## Variations saisonnieres

RV-098 lit les traces de RV-086 :

- saison courante ;
- moment de la journee ;
- phrases saisonnieres.

Ces informations influencent la phrase d'accompagnement et l'ordre des suggestions sans modifier l'identite graphique.

## Evolutions possibles

- Ajouter des liens explorables sur les quatre cartes vivantes.
- Connecter la reponse apres partage a la Constellation Vivante RV-092.
- Faire remonter certaines resonances dans le Carnet de Voyage.
- Proposer une vue detaillee de la constellation personnelle.
- Ajouter une option locale d'effacement selective.

La regle demeure : la Constellation accompagne, elle ne collecte pas.
