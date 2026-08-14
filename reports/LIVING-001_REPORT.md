# LIVING-001 - La memoire des etoiles

## Objectif

Créer une première mémoire locale de la Constellation Vivante.

La Constellation ne récompense pas le visiteur. Elle se souvient discrètement de ses passages.

## Fichiers modifiés

- `css/constellationScene.css`
- `js/constellationScene.js`
- `reports/LIVING-001_REPORT.md`

## Stockage local utilisé

Clé `localStorage` :

```text
recitsVivants.constellation.memory
```

Structure :

```json
{
  "visits": 0,
  "stars": [],
  "cards": [],
  "relations": [],
  "lastVisitedAt": "",
  "lastWhisperIndex": -1
}
```

## Éléments mémorisés

### Visites

`visits` augmente lorsque l'écran Constellation devient visible.

Cette valeur n'est jamais affichée au visiteur.

Elle sert uniquement à :

- identifier un retour ;
- varier subtilement le ciel ;
- choisir un murmure différent ;
- rendre une présence de Gardien possible très rarement.

### Étoiles rencontrées

`stars` mémorise :

- `first-star`
- `answer-star`

Effet visuel :

- la première étoile conserve une lueur très légère au retour ;
- aucune mention textuelle n'indique qu'elle a été découverte.

### Carte suspendue

`cards` mémorise :

- `suspended-card`

Effet visuel :

- la zone de carte respire avec une lumière plus familière ;
- le halo reste doux et non intrusif.

### Relations aperçues

`relations` mémorise :

- `first-relation`

Effet visuel :

- une étoile de réponse et une ligne lumineuse peuvent réapparaître brièvement au retour ;
- la relation n'est jamais affichée comme un graphe permanent.

### Murmures

`lastWhisperIndex` permet de faire varier la phrase d'accueil.

Les murmures restent rares, courts et non explicatifs.

## Présence des Gardiens

Aucun Gardien explicite n'est affiché automatiquement.

Le système ajoute seulement une présence lumineuse très rare sur la lanterne lorsque :

- le visiteur est déjà revenu plusieurs fois ;
- au moins une relation a été rencontrée ;
- la visite correspond à un rythme espacé.

Cela évite une logique mécanique ou intrusive.

## Anti-gamification

La mission n'affiche jamais :

- nombre d'étoiles découvertes ;
- pourcentage ;
- niveau ;
- score ;
- progression numérique ;
- badge.

La mémoire reste perceptible uniquement dans l'ambiance du lieu.

## Comportement attendu

Première visite :

- arrivée silencieuse ;
- murmure ;
- première étoile ;
- aucune trace préalable.

Après première rencontre :

- l'étoile et la relation sont mémorisées ;
- la carte suspendue peut être mémorisée si elle est approchée.

Visite suivante :

- l'étoile possède une lueur plus familière ;
- le murmure peut changer ;
- la carte peut respirer différemment ;
- une relation peut réapparaître brièvement.

Retour après fermeture :

- la mémoire persiste via `localStorage`.

## Alignement avec la vision

Cette mission applique le principe :

> La Constellation ne récompense pas le visiteur. Elle se souvient de lui.

Le lieu ne recommence plus exactement de la même manière. Il garde une trace silencieuse sans transformer l'expérience en tableau de bord.

## Validations effectuées

- `node --check js/constellationScene.js`
- `git diff --check`
- `git diff --cached --check`

## Captures

Les captures avant/après n'ont pas été produites depuis l'environnement Codex.

Les validations visuelles restent à effectuer manuellement sur :

- desktop ;
- tablette ;
- mobile portrait ;
- mobile paysage.
