# RV-058 - Suppression du rectangle de suggestion narrative

Date: 2026-08-12

Branche: `agent/rv-058-remove-compass-suggestion-rectangle`

## Objectif

Supprimer completement l'impression de rectangle semi-transparent autour de la direction suggeree sur la Boussole Vivante, tout en conservant une suggestion lumineuse, perceptible et contemplative.

## Origine exacte du rectangle

Le rectangle provenait de la combinaison de plusieurs proprietes CSS:

1. Style de base de `.living-compass-direction`
   - `background` radial sombre;
   - `backdrop-filter: blur(2px)`.

2. Style ajoute par `.living-compass-direction.is-suggested`
   - `background` radial colore;
   - `border: 1px solid var(--compass-suggestion-border)`;
   - `box-shadow` applique directement sur la boite de texte.

3. Animation `living-compass-marker-breathe`
   - animait `border-color`;
   - animait `box-shadow` sur l'element lui-meme.

Ces proprietes donnaient a la suggestion une lecture de bouton actif ou de case selectionnee.

## Pourquoi RV-057 ne suffisait pas

RV-057 avait reduit l'opacite du fond interne et rendu le halo plus organique, mais le style de base de `.living-compass-direction` restait herite par l'element suggere.

De plus, `.is-suggested` continuait a appliquer:

- un `background`;
- un `border`;
- un `box-shadow` rectangulaire;
- le `backdrop-filter` herite du style de base.

Le rectangle etait donc moins visible, mais encore present sur Android.

## Correction appliquee

Fichier modifie:

- `css/style.css`

Proprietes neutralisees sur `.living-compass-direction.is-suggested`:

- `background: transparent`;
- `box-shadow: none`;
- `backdrop-filter: none`;
- `border` rendu transparent.

Animation ajustee:

- `living-compass-marker-breathe` n'anime plus de `box-shadow` rectangulaire;
- la respiration passe par `filter: brightness(...)` et `text-shadow`;
- le halo organique reste porte par `::before`.

## Validation visuelle

Une capture locale Chrome headless a ete generee hors depot avec:

- viewport smartphone portrait `412 x 915`;
- etat Boussole;
- meteo `transition`;
- direction suggeree `Explorer`.

Resultat observe:

- aucune surface sombre CSS n'apparait derriere `Explorer`;
- la suggestion reste visible par halo et luminosite;
- le rectangle lumineux visible au centre correspond a la porte de l'image de fond, pas a un fond CSS ajoute;
- l'effet conserve l'aspect contemplatif de la Boussole.

Les fichiers temporaires de validation ont ete supprimes et ne sont pas ajoutes au depot.

## Perimetre respecte

- Aucun HTML modifie.
- Aucun JavaScript modifie.
- Aucun JSON modifie.
- Aucune navigation modifiee.
- Aucune logique metier modifiee.
- Aucune correspondance meteo -> direction modifiee.

## Validation technique

- `git diff --check` OK.
- Aucun script lint local detecte (`package.json` absent).
- Diff de production limite a `css/style.css`.
