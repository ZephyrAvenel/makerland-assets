# Bibliotheque Vivante

## Philosophie

La Bibliotheque Vivante n'est plus une liste.
Elle devient une suite de salles.

Le visiteur avance d'un espace a l'autre comme dans une bibliotheque reelle:

```text
Romans
  -> Essais
      -> Atlas
          -> Ressources
```

Chaque salle conserve son illustration existante.
Les livres sont poses dans l'image sous forme de volumes integres, avec ombres, eclairage et proportions adaptees.
La couverture devient la porte principale.
Le QR devient une autre maniere d'emporter cette porte avec soi.

## Organisation des salles

| Salle | Ecran | Categorie de donnees |
| --- | --- | --- |
| Fictions symboliques | `e06_fiction` | `fiction` |
| Essais | `e06_essais` | `essais` |
| Atlas des Recits Vivants | `e06_atlas` | `atlas` |
| Ressources | `e06_portes` | `portes_ouvertes` |

La mission utilise les ecrans deja presents.
Aucune nouvelle image n'est ajoutee.
Aucun nouveau territoire n'est cree.

## Donnees

Les ouvrages restent fournis par:

```text
data/livres-v2.json
```

Chaque ouvrage utilise les champs existants:

- `title`;
- `category`;
- `cover`;
- `url`;
- `qr`;
- `id`.

Aucun lien de livre n'est code en dur dans `BookRenderer`.
La couverture ouvre `url`.
Le QR affiche `qr`.

Il n'y a plus de boutons `Ouvrir` ou `QR` sous forme de controles separes.

## Navigation

Chaque salle possede une navigation douce en bas de l'ecran:

- `Salle precedente`;
- `Salle suivante`.

La premiere salle ne montre pas de precedent.
La derniere salle affiche `Terminer la visite`.

Le passage entre deux salles applique un fondu court avant d'appeler `Navigation.goTo(...)`.
Le moteur `Navigation` n'est pas modifie.

## Fin de visite

Dans la salle Ressources, `Terminer la visite` revele un message doux:

```text
Vous avez parcouru cette partie de la Bibliotheque Vivante.
Chaque livre demeure une porte.
Vous pourrez toujours revenir explorer d'autres chemins.
```

Le visiteur peut ensuite revenir vers:

- l'Oeuvre;
- la Boussole Vivante;
- l'Accueil.

## Responsive

La Bibliotheque utilise les variables deja presentes sur les ecrans:

- `--screen-content-width`;
- `--screen-content-height`;
- `--screen-content-left`;
- `--screen-content-top`.

Ainsi, les volumes restent synchronises avec l'image affichee en `object-fit: contain`.

Les regles responsive adaptent:

- le nombre de colonnes;
- la taille des couvertures;
- la taille des titres;
- la taille des boutons;
- la position de la navigation.

## Ajouter une salle plus tard

Pour ajouter une salle future sans changer l'architecture:

1. ajouter l'ecran et son illustration;
2. ajouter une categorie ou une selection de ressources dans la configuration;
3. ajouter une entree dans `Books.rooms`;
4. preciser `previous` et `next`;
5. garder les liens et QR dans les donnees, pas dans le JavaScript.

## Limites

Cette mission ne cree pas encore de nouvelles ressources.
Elle ne corrige pas les contenus manquants signales par RV-006.

Certaines salles affichent donc uniquement les ouvrages deja presents dans `livres-v2.json`.
