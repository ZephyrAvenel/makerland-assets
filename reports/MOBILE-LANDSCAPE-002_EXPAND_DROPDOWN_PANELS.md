# MOBILE-LANDSCAPE-002 - Extension des panneaux deroulants en paysage mobile

## Cause exacte

La mission MOBILE-LANDSCAPE-001 avait remonte le conteneur :

```css
.living-home__paths
```

mais les panneaux ouverts restaient limites par les regles du mode paysage compact :

```css
.living-home__path-row.is-open .living-home__path-panel{
    max-height:22px;
}

.living-home__path-panel p{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
```

Cette combinaison conservait un panneau tres bas et forcait le texte en une seule ligne. Meme avec l'espace libere sous les blocs, le contenu deroule ne pouvait pas l'utiliser.

## Correction appliquee

Fichier modifie :

```text
css/livingHome.css
```

La correction reste limitee a la media query smartphone paysage deja creee :

```css
@media (max-width:960px) and (max-height:480px) and (orientation:landscape)
```

Les trois blocs principaux conservent leur position actuelle.

Le panneau ouvert peut maintenant s'etendre davantage :

```css
.living-home__path-row.is-open .living-home__path-panel{
    max-height:clamp(54px, 18dvh, 78px);
    overflow-y:auto;
    scrollbar-width:none;
}
```

Le conteneur global peut utiliser la hauteur utile restante :

```css
.living-home__paths{
    max-height:calc(100dvh - clamp(28px, 7dvh, 38px) - 8px);
}
```

Le texte n'est plus tronque artificiellement dans ce mode :

```css
.living-home__path-panel p{
    overflow:visible;
    text-overflow:clip;
    white-space:normal;
}
```

## Pourquoi cette approche

- La position des trois blocs principaux n'est pas modifiee.
- Les tailles des boutons ne changent pas.
- Les animations et transitions existantes restent en place.
- Le panneau deroule utilise l'espace vertical recupere par MOBILE-LANDSCAPE-001.
- Si la hauteur reste trop faible, seul le panneau ouvert devient scrollable.
- La page entiere ne defile pas.

## Responsive

- Smartphone portrait : inchange, hors media query.
- Smartphone paysage : panneau ouvert plus haut et lisible.
- Tablette portrait : inchange.
- Tablette paysage : inchange, car la regle cible les hauteurs compactes.
- Desktop : inchange.

## Validations

Commandes executees :

```text
git diff --check
git diff --cached --check
```

Validation appareil attendue :

1. ouvrir l'application ;
2. passer en smartphone paysage ;
3. ouvrir chacun des trois chemins ;
4. verifier que les textes et boutons restent visibles ;
5. verifier que les boutons sont entierement cliquables ;
6. verifier qu'en cas de hauteur tres faible, seul le panneau ouvert defile.
