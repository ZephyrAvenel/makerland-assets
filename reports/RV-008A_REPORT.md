# RV-008A - Bibliotheque Vivante immersive

## Resume

RV-008A finalise la Bibliotheque Vivante comme lieu de visite.
Les quatre salles existantes sont conservees.
Aucune nouvelle image n'est ajoutee.
Aucun moteur n'est modifie.

Le visiteur avance de salle en salle.
Chaque couverture devient une porte.
Chaque QR est place directement sous la couverture, dans l'esprit des emplacements prevus par les illustrations.

## Branche

- Branche: `agent/rv-008a-immersive-living-library`
- `main` n'a pas ete modifie.

## Salles conservees

| Salle | Ecran | Donnees |
| --- | --- | --- |
| Fictions symboliques | `e06_fiction` | `fiction` |
| Essais | `e06_essais` | `essais` |
| Atlas des Recits Vivants | `e06_atlas` | `atlas` |
| Ressources | `e06_portes` | `portes_ouvertes` |

## Fichiers modifies

- `js/bookRenderer.js`
- `css/bookRenderer.css`
- `docs/LIVING_LIBRARY.md`

## Fichiers crees

- `reports/RV-008A_REPORT.md`

## Fichiers non modifies

- `js/zoneRenderer.js`
- `js/navigation.js`
- `js/narrativeMemory.js`
- `js/livingEcho.js`
- `data/zones-v3-final-beta.json`
- `data/livres-v2.json`
- `index.html`
- `css/style.css`

## Changements d'experience

- Suppression des boutons `Ouvrir`.
- Suppression des boutons `QR`.
- La couverture est entierement interactive.
- Le clic ou toucher sur une couverture applique une lumiere doree breve avant d'ouvrir le livre.
- Le QR reel issu de `livres-v2.json` est affiche sous la couverture.
- Le QR reste cliquable et ouvre le modal QR existant.
- La derniere salle propose `Terminer la visite`.
- Les titres visibles restent ceux deja dessines dans les illustrations.
  Les titres HTML sont conserves seulement pour l'accessibilite.

## Fin de visite

La salle Ressources affiche une transition douce avec le texte:

```text
Vous avez parcouru cette partie de la Bibliotheque Vivante.
Chaque livre demeure une porte.
Vous pourrez toujours revenir explorer d'autres chemins.
```

Puis trois retours sont proposes:

- Retour vers l'Oeuvre;
- Retour vers la Boussole Vivante;
- Retour a l'Accueil.

## Validation effectuee

Verifications realisees:

- syntaxe de `js/bookRenderer.js`;
- absence de diff sur les moteurs interdits;
- absence de diff sur les JSON existants;
- verification que les liens de livres proviennent de `data/livres-v2.json`;
- verification que les QR proviennent de `data/livres-v2.json`;
- verification de la sequence des salles;
- verification que les anciens boutons `book-open` et `book-qr` ne sont plus rendus.

## Captures

Les captures RV-008A sont produites comme artefacts locaux:

### PC

- `outputs/RV-008A_PC_FICTIONS.png`
- `outputs/RV-008A_PC_ESSAIS.png`
- `outputs/RV-008A_PC_ATLAS.png`
- `outputs/RV-008A_PC_RESSOURCES.png`

### Tablette

- `outputs/RV-008A_TABLET_FICTIONS.png`
- `outputs/RV-008A_TABLET_ESSAIS.png`
- `outputs/RV-008A_TABLET_ATLAS.png`
- `outputs/RV-008A_TABLET_RESSOURCES.png`

### Smartphone portrait

- `outputs/RV-008A_PHONE_PORTRAIT_FICTIONS.png`
- `outputs/RV-008A_PHONE_PORTRAIT_ESSAIS.png`
- `outputs/RV-008A_PHONE_PORTRAIT_ATLAS.png`
- `outputs/RV-008A_PHONE_PORTRAIT_RESSOURCES.png`

### Smartphone paysage

- `outputs/RV-008A_PHONE_LANDSCAPE_FICTIONS.png`
- `outputs/RV-008A_PHONE_LANDSCAPE_ESSAIS.png`
- `outputs/RV-008A_PHONE_LANDSCAPE_ATLAS.png`
- `outputs/RV-008A_PHONE_LANDSCAPE_RESSOURCES.png`

Points visuels a verifier:

- couvertures centrees;
- QR integres sous les couvertures;
- aucun bouton livre texte visible;
- navigation de salle accessible;
- panneau de fin visible uniquement apres `Terminer la visite`.

## Limites

Les QR utilises sont ceux deja presents dans `data/livres-v2.json`.
Si chaque ouvrage doit posseder un QR Amazon individualise, il faudra d'abord mettre a jour la configuration de donnees.

La mission ne modifie pas les illustrations existantes.
Les positions restent donc une integration CSS sur les niches disponibles, sans retouche image.
