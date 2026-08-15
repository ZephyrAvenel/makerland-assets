# MOBILE-LANDSCAPE-001 - Boutons d'accueil en smartphone paysage

## Cause exacte

Le probleme venait du positionnement vertical du conteneur des chemins d'accueil :

```css
.living-home__paths
```

La media query compacte paysage utilisait :

```css
@media (max-width:1024px) and (max-height:520px) and (orientation:landscape){
    .living-home__paths{
        bottom:12px;
    }
}
```

Sur smartphone paysage, cette valeur place le panneau trop pres du bord inferieur reel de la fenetre. Avec la zone de navigation du navigateur mobile et les variations de hauteur utile, le dernier bouton pouvait etre partiellement coupe et sa zone tactile tronquee.

## Pourquoi le probleme n'apparaissait qu'en paysage smartphone

- Le portrait utilise une autre media query avec `bottom:72px`, donc le panneau reste assez haut.
- Les tablettes et le desktop disposent d'une hauteur plus confortable et ne passent pas par la meme contrainte compacte.
- Le smartphone paysage combine une largeur suffisante pour afficher la grille horizontale avec une hauteur tres faible, ce qui rend `bottom:12px` insuffisant.

## Correction appliquee

Fichier modifie :

```text
css/livingHome.css
```

Une media query plus specifique a ete ajoutee apres la regle compacte existante :

```css
@media (max-width:960px) and (max-height:480px) and (orientation:landscape){
    .living-home__paths{
        bottom:clamp(28px, 7dvh, 38px);
    }
}
```

Cette correction remonte uniquement le conteneur des chemins de quelques dizaines de pixels.

## Valeurs ajustees

- Avant : `bottom:12px`
- Apres, smartphone paysage : `bottom:clamp(28px, 7dvh, 38px)`

La valeur reste dynamique selon la hauteur disponible, sans modifier la taille des boutons.

## Contraintes respectees

- Aucun JavaScript modifie.
- Aucune navigation modifiee.
- Aucun evenement modifie.
- Aucun changement d'ordre des boutons.
- Aucune modification des animations.
- Aucune reduction des boutons ou des zones tactiles.
- Portrait smartphone, tablette et desktop restent hors de cette nouvelle regle.

## Validations

Commandes executees :

```text
git diff --check
git diff --cached --check
```

Validation attendue sur appareil :

1. ouvrir l'application ;
2. passer en smartphone paysage ;
3. derouler chaque panneau ;
4. verifier que le dernier bouton est entierement visible ;
5. verifier que toute sa surface reste cliquable.
