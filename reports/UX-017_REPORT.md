# UX-017 - Le Premier Voyage

## Synthese

UX-017 ajoute une couche autonome d'initiation pour les primo-visiteurs de Makerland.

Le parcours explique progressivement :

- ce qu'est Makerland ;
- pourquoi il existe ;
- ce que l'on peut y faire.

## Ecrans et etapes

Le Premier Voyage comporte cinq etapes :

1. Accueil - Pourquoi Makerland existe.
2. Bibliotheque - Rencontrer une oeuvre.
3. Atelier IA - Comprendre les coulisses de la creation.
4. Archive D001 - Decouvrir les Archives Vivantes.
5. Constellation - Comprendre les liens entre les oeuvres.

Temps moyen vise : environ cinq minutes, a raison d'une minute libre par etape.

## Fichiers modifies

- `index.html`
- `css/firstJourney.css`
- `js/firstJourney.js`
- `docs/ux/FIRST_JOURNEY.md`
- `reports/UX-017_REPORT.md`

## Fonctionnement

Le module detecte la premiere visite au chargement, avant que les autres modules n'ecrivent leur memoire locale.

Si aucune memoire precedente n'existe, il affiche une grande carte d'accueil avec deux choix :

- Faire mon premier voyage ;
- Explorer librement.

Le choix est memorise dans `localStorage` avec la cle `makerland.firstJourney`.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation existante modifiee.
- Aucun JSON metier modifie.
- Aucun changement dans BookRenderer.
- Aucun changement dans ZoneRenderer.
- Couche autonome uniquement.

## Validation

- Premiere visite : invitation affichee sur l'accueil avec les deux choix attendus.
- Refus / sortie libre : carte fermee, choix memorise, bouton `Refaire le Premier Voyage` disponible depuis l'accueil.
- Reprise ulterieure : etape courante conservee apres rechargement et ecran correspondant restaure.
- Deuxieme visite : l'invitation initiale n'est pas reaffichee automatiquement.
- Tactile et clavier : boutons natifs, focus visible, fermeture par `Escape` en parcours actif.
- Responsive : controle local desktop, smartphone portrait `412 x 915` et smartphone paysage `915 x 412`.

## Validations techniques

- `node --check js/firstJourney.js` : OK.
- `git diff --check` : OK.

## Pistes UX-018

- Ajouter un court extrait rendu de D001 dans la carte du Premier Voyage.
- Relier la fin du parcours au Carnet de Voyage.
- Adapter subtilement les formulations selon la meteo interieure.
