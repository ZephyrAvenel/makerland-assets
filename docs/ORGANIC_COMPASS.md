# La Boussole Organique

## Philosophie

La Boussole Organique prolonge la Boussole Vivante.
Elle ne cherche pas a ajouter une fonction, mais a faire sentir un lieu.

Le visiteur ne doit pas avoir l'impression d'utiliser une interface.
Il doit sentir qu'il arrive dans un espace qui l'accueille, puis lui laisse retrouver une orientation.

La Boussole n'est donc pas un menu.
C'est un seuil d'orientation.

## Le centre lumineux

La porte lumineuse au centre de l'image devient le coeur du dispositif.
Les directions sont disposees autour d'elle pour donner une impression de rayonnement.

Il ne s'agit pas de dessiner une roue graphique.
Il s'agit de laisser le regard comprendre naturellement que les chemins partent du centre.

La lumiere reste douce:

- halo discret;
- respiration lente;
- variations legeres selon la meteo interieure;
- aucune animation spectaculaire.

## Directions plutot que boutons

Les directions ne doivent pas ressembler a une barre de navigation.
Elles deviennent des reperes poses dans le lieu.

Le style conserve:

- un contraste suffisant;
- une zone lisible;
- un fond translucide;
- une presence tactile claire.

Mais il evite l'effet de bouton classique:

- composition non lineaire;
- formes discretes;
- halo faible;
- mise en evidence sobre d'une seule direction.

La direction suggeree n'est jamais une decision prise pour le visiteur.
Elle est une invitation plus lumineuse que les autres, rien de plus.

## Choix de composition

Sur ecran large, la composition suit une logique organique:

- `Explorer` se place au-dessus du centre;
- `Creer` et `Contempler` ouvrent les cotes;
- `Decouvrir` reste proche de la porte;
- `Trouver un repere` descend vers le bas, comme un premier appui.

Cette disposition guide le regard:

1. titre;
2. texte d'accueil;
3. lumiere centrale;
4. directions.

Sur tablette et smartphone, la composition se resserre pour rester lisible dans le rectangle utile de l'image.
Les positions changent, mais l'intention reste la meme: les directions rayonnent depuis la porte.

## Responsive

Le rendu utilise les variables deja presentes dans les ecrans:

- `--screen-content-left`
- `--screen-content-top`
- `--screen-content-width`
- `--screen-content-height`

Ces variables conservent l'alignement avec l'image en `object-fit: contain`.

Les tailles de texte et de reperes sont ajustees par media queries plutot que par une nouvelle logique JavaScript.

## Accessibilite

La Boussole Organique conserve:

- le contraste du texte;
- une largeur de lecture confortable;
- des reperes lisibles;
- `prefers-reduced-motion`;
- l'information `aria-live` deja presente sur le calque narratif.

## Bonnes pratiques

- Ne pas transformer les directions en tableau de bord.
- Ne pas mettre plusieurs directions en evidence.
- Ne pas ajouter d'effets voyants.
- Ne pas deplacer la logique dans `ZoneRenderer`.
- Conserver la Boussole comme un lieu d'accueil avant de devenir un choix.
