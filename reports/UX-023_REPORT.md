# UX-023 - Recentrer l'identite sur Les Recits Vivants

## Synthese

UX-023 recentre l'identite publique de l'experience sur `Les Recits Vivants`.

La mission ne modifie aucune architecture, aucune route et aucune destination. Elle remplace uniquement des textes visibles afin que l'accueil et le Premier Voyage ne presentent plus Makerland comme identite principale.

## Textes remplaces sur le seuil

- Titre principal : `BIBLIOTHEQUE VIVANTE` devient `Les Recits Vivants`.
- Sous-titre : `Les Recits Vivants` devient `Une oeuvre immersive de Zephyr Avenel`.
- Texte du seuil :
  - `Chaque recit ouvre une porte.`
  - `Chaque porte conduit vers un territoire.`
  - `Le voyage commence toujours par une premiere rencontre.`
- La couche dynamique d'accueil ne duplique plus le texte du seuil.
- La porte `J'explore librement` mentionne maintenant le rythme des Recits Vivants.

## Page intermediaire

Le texte `Votre premier voyage` devient :

`En cinq etapes, vous allez decouvrir comment naissent les Recits Vivants.`

`Vous ne visiterez pas seulement des lieux.`

`Vous suivrez le chemin qui conduit d'une intuition a une oeuvre.`

Les boutons restent :

- `Commencer le voyage`
- `Retour au seuil`

## Premier Voyage

Les cinq etapes conservent leurs destinations mais changent de vocabulaire public :

1. `Pourquoi ce territoire existe-t-il ?`
   - Sous-titre : `Le Seuil des Climats`

2. `A quoi ressemblent les oeuvres qui naissent ici ?`
   - Sous-titre : `Bibliotheque Vivante`

3. `Comment naissent-elles ?`
   - Sous-titre : `L'Atelier des Recits`
   - Citation : `L'intelligence artificielle devient ici un compagnon de recherche.`

4. `Peut-on voir leurs coulisses ?`
   - Sous-titre : `Archives Vivantes`

5. `Comment dialoguent-elles entre elles ?`
   - Sous-titre : `Constellation`

## Conclusion

Le texte final devient :

`Vous connaissez maintenant les cinq portes des Recits Vivants.`

Puis :

- `Le premier voyage est termine.`
- `Vous avez decouvert comment une intuition devient une oeuvre, puis rejoint d'autres recits.`
- `A partir d'ici, il n'existe plus de chemin unique.`
- `Vous pouvez desormais explorer librement ce territoire.`

Les boutons finaux sont :

- `Explorer les oeuvres`
- `Explorer librement`
- `Refaire le premier voyage`

## Fichiers modifies

- `index.html`
- `js/livingHome.js`
- `js/firstJourney.js`
- `css/firstJourney.css`
- `reports/UX-023_REPORT.md`

## Contraintes respectees

- Aucune navigation existante modifiee.
- Aucun JSON metier modifie.
- Aucun BookRenderer modifie.
- Aucun ZoneRenderer modifie.
- Aucune route modifiee.
- Aucun moteur global modifie.

## Validations

- `node --check js/livingHome.js` : OK.
- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK, avec avertissements CRLF attendus.
- Seuil desktop : titre, sous-titre, texte et trois portes verifies.
- Seuil smartphone portrait : texte visible sans superposition.
- Seuil smartphone paysage : texte et portes visibles dans le viewport.
- Page intermediaire : texte `Votre premier voyage` verifie.
- Premier Voyage : les cinq etapes renommee sont verifiees.
- Fin du Premier Voyage : les trois boutons finaux sont presents.
