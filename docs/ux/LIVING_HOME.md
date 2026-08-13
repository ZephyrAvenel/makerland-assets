# UX-018 - L'Accueil Vivant

## Intention

L'accueil devient le seuil de Makerland.

Il ne cherche pas a expliquer tout le projet. Il donne au visiteur assez de repere pour comprendre ou il se trouve, pourquoi ce territoire existe et comment commencer sans se sentir perdu.

## Psychologie de l'accueil

Un primo-visiteur arrive d'abord par l'atmosphere.

Il ne sait pas encore ce qu'est Makerland. Il peut etre touche par l'image, mais ne pas comprendre quoi faire. L'accueil vivant repond a cette hesitation par trois portes simples :

- Je decouvre ;
- Je poursuis mon voyage ;
- J'explore librement.

Le visiteur fidele, lui, doit sentir que le lieu reconnait son retour. L'accueil affiche alors une phrase de reprise et le dernier chemin connu lorsque la memoire locale le permet.

## Primo-visiteur

Lorsqu'aucune memoire locale significative n'est detectee, l'accueil affiche :

- un court texte de seuil ;
- une phrase quotidienne ;
- une phrase de premier regard ;
- de petites cartes expliquant les lieux ;
- les trois portes d'entree.

Les cartes explicatives sont temporaires. Elles apparaissent comme une breve orientation, puis s'effacent.

## Visiteur fidele

Lorsqu'une memoire locale existe, l'accueil indique :

> Bienvenue de retour.

Puis il affiche le dernier chemin connu lorsque celui-ci est disponible.

Le bouton `Continuer` reprend le dernier ecran memorise par Makerland. Si aucune trace precise n'existe, la porte `Je poursuis mon voyage` oriente vers le Carnet.

## Parcours

### Je decouvre

Lance le Premier Voyage cree par UX-017.

Cette porte est destinee aux visiteurs qui veulent comprendre Makerland en environ cinq minutes.

### Je poursuis mon voyage

Utilise la memoire locale existante :

- derniere salle visitee ;
- chemin vivant actif ;
- carnet si aucune reprise precise n'est disponible.

### J'explore librement

Reprend l'entree naturelle vers la Meteo interieure, sans guidage supplementaire.

## Choix UX

L'accueil conserve :

- l'image actuelle ;
- le style nocturne ;
- les halos ;
- le verre depoli ;
- les animations lentes.

Le module est autonome :

- `js/livingHome.js` ;
- `css/livingHome.css`.

Il ne modifie ni les moteurs, ni les routes, ni les donnees metier.

## Temps et saisons

L'accueil reutilise les traces de RV-086 lorsque disponibles.

Il affiche une indication discrete :

> Aujourd'hui : saison - moment

Si la memoire saisonniere n'est pas encore disponible, le module calcule localement la saison et le moment de la journee.

## Evolutions possibles

Les prochaines versions pourront :

- relier plus finement `Je poursuis mon voyage` au Carnet ;
- adapter la phrase quotidienne aux saisons editoriales ;
- afficher une courte trace du dernier fragment lu ;
- proposer une version audio tres discrete du seuil.
