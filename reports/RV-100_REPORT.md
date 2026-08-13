# RV-100 - Les Grandes Constellations Vivantes

## Objectif

Transformer les regroupements du Ciel Vivant en huit expositions editoriales permanentes, sans creer de nouvelles relations et sans modifier les moteurs existants.

## Fichiers crees

- `js/livingExhibitions.js`
- `css/livingExhibitions.css`
- `docs/patrimoine/LIVING_EXHIBITIONS.md`

## Fichier modifie

- `index.html`

La modification se limite au chargement du CSS et du module autonome.

## Grandes Constellations

Huit expositions sont disponibles :

1. Dialogue
2. Liberte
3. Monde commun
4. Transformation
5. Transmission
6. Esperance
7. Seuil
8. Vivant

## Ressources reliees

Chaque exposition calcule automatiquement :

- concepts associes ;
- Archives Vivantes ;
- oeuvres et livres ;
- images patrimoniales ;
- figures ;
- articles ;
- salles Makerland ;
- packs narratifs lorsqu'ils existent ;
- objets NFC lorsqu'ils seront disponibles dans les catalogues.

## Couverture patrimoniale

La couverture calculee a partir des catalogues locaux est :

| Ressource | Nombre |
| --- | ---: |
| Grandes Constellations | 8 |
| Archives Vivantes reliees | 8 |
| Oeuvres et livres relies | 8 |
| Concepts relies | 19 |
| Images patrimoniales reliees | 21 |
| Figures reliees | 14 |
| Salles Makerland reliees | 5 |
| Articles / blocs relies | 93 |

Ces chiffres sont egalement recalculables au runtime par `LivingExhibitions.statistics()`.

Les expositions s'appuient sur :

- `data/constellation-themes.json`
- `data/living-graph.json`
- `data/concept-network.json`
- `data/work-network.json`
- `data/archive-assets.json`
- `data/archive-mapping.json`

## Integration

Le module lit les etoiles locales de `makerland:traveler-constellation` et inscrit l'exposition mise a l'honneur dans `makerland:living-cycle`.

## Contraintes respectees

- Aucun moteur global modifie.
- Aucune navigation globale modifiee.
- Aucun `BookRenderer`, `ZoneRenderer`, `NarrativeMemory` ou `LivingEcho` modifie.
- Aucun JSON metier existant modifie.
- Aucune API.
- Aucun serveur.
- Aucune IA.

## Validation

- `node --check js/livingExhibitions.js` : OK.
- `git diff --check` : OK sur les fichiers de travail.
- `git diff --cached --check` : OK.

## Note historique

Le numero RV-100 avait deja ete utilise pour la Charte des rythmes vivants, livree dans `docs/LIVING_RHYTHM_CHARTER.md`.

Cette trace reste conservee dans le depot. La presente mission reutilise le meme numero pour les Grandes Constellations Vivantes et ne modifie pas la charte existante.
