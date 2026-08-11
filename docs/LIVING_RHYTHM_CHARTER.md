# Charte des rythmes vivants

RV-100

Ce document sert de reference pour toutes les futures evolutions de Makerland.

## 1. Le principe fondateur

Dans les Recits Vivants, rien n'apparait instantanement.

Chaque ecran :

- accueille ;
- respire ;
- revele ;
- invite.

L'interface ne donne jamais l'impression de charger. Elle donne l'impression d'emerger.

## 2. Le silence

Avant toute information importante, prevoir un temps de silence.

Duree indicative :

```text
600 a 1000 ms
```

Le visiteur decouvre simplement le paysage.

Le decor parle avant le texte.

## 3. Le titre

Le titre constitue toujours la premiere parole de l'ecran.

Animation recommandee :

- legere montee ;
- fade ;
- tres leger halo.

Duree indicative :

```text
1200 a 1400 ms
```

Courbe recommandee :

```css
cubic-bezier(.22, 1, .36, 1)
```

## 4. La respiration

Le titre reste seul.

Duree indicative :

```text
500 a 700 ms
```

Le visiteur lit.

Aucune autre animation ne vient concurrencer ce moment.

## 5. Le sous-titre

Le sous-titre complete le sens.

Il ne concurrence jamais le titre.

Son animation doit etre plus discrete.

Duree indicative :

```text
1200 a 1500 ms
```

## 6. Les choix

Les boutons ne sont jamais les premiers elements a attirer l'oeil.

Ils existent deja dans le lieu.

Le visiteur les decouvre apres avoir lu.

Le texte guide avant l'action.

## 7. Les passages

Lorsque l'on change d'univers, il existe toujours :

- une respiration ;
- un seuil ;
- un franchissement.

Cela concerne notamment :

- Bibliotheque ;
- Atlas ;
- Oeuvre immersive ;
- Atelier ;
- Constellation.

Jamais un simple changement de page.

## 8. Chaque ecran possede son propre rythme

### Accueil

Accueil lent.

Invitation.

Naissance.

### Meteo

Contemplation.

Le paysage parle.

La question apparait.

### Boussole

Orientation.

Les directions emergent.

On choisit une intention.

### Cartes narratives

Curiosite.

Les cartes deviennent des portes.

### Atlas

Approfondissement.

On quitte Makerland pour entrer dans un autre ouvrage.

### Bibliotheque

Exploration.

Les livres se revelent progressivement.

### Atelier

Creation.

On sent que quelque chose est en train de naitre.

### Constellation

Partage.

Le visiteur comprend qu'il rejoint d'autres voyageurs.

### Voyage

Cloture.

On ne termine pas.

On poursuit ailleurs.

## 9. Principe general

Une phrase peut guider toutes les evolutions :

> Chaque ecran est un souffle. Chaque souffle prepare le suivant. Le visiteur ne navigue pas dans une application ; il traverse un recit vivant.

## Checklist de rythme

Avant toute evolution d'un ecran, verifier :

- [ ] le paysage ou le lieu existe avant le texte ;
- [ ] le titre apparait avant le sous-titre ;
- [ ] un temps de respiration separe les informations principales ;
- [ ] les choix ne concurrencent pas le texte ;
- [ ] les transitions donnent une sensation de passage ;
- [ ] l'animation sert le lieu plutot que l'effet.
