# RV-031A Report - Correction des destinations de la Boussole

## Resume

RV-031 avait corrige les destinations visibles des cinq directions organiques dans `index.html`. Le controle fonctionnel montrait toutefois que `Explorer` et parfois `Decouvrir` pouvaient encore ouvrir `e04_oeuvre`.

La cause etait une ancienne hitbox JSON de la Boussole, creee par ZoneRenderer, qui recouvrait la porte centrale et pointait encore vers `e04_oeuvre`.

## Diagnostic

Dans `data/zones-v3-final-beta.json`, l'ecran `e03_boussole` contenait :

```json
"porte_principale": {
  "type": "navigation",
  "action": "e04_oeuvre"
}
```

Dans `js/zoneRenderer.js`, une zone de type `navigation` est normalisee ainsi :

```text
type: goto
target: zone.action
```

Cette ancienne zone pouvait donc intercepter les clics des directions organiques et declencher `Navigation.goTo("e04_oeuvre")`, meme si les attributs `data-target-screen` de `index.html` etaient corrects.

## Correction appliquee

La zone JSON `porte_principale` a ete alignee sur la cartographie RV-031 :

```json
"action": "goto",
"target": "e05_cartes"
```

Ainsi, meme si la hitbox centrale de ZoneRenderer capte un clic sur la Boussole, elle conduit vers le Passage Atlas au lieu de l'Arche.

## Cartographie confirmee

| Direction | Destination |
| --- | --- |
| Explorer | `e05_cartes` |
| Decouvrir | `e06_essais` |
| Creer | `e07_atelier` |
| Contempler | `e04_oeuvre` |
| Trouver un repere | `e08_constellation` |

## Fichiers modifies

- `data/zones-v3-final-beta.json`

## Fichiers crees

- `reports/RV-031A_REPORT.md`

## Hors perimetre respecte

- Aucun changement sur `archwayPassage.js`.
- Aucun changement CSS.
- Aucun changement sur ZoneRenderer.
- Aucun changement sur BookRenderer.
- Aucun changement sur NarrativeMemory.
- Aucun changement sur LivingEcho.
- Aucun changement sur les livres.

La seule modification JSON est la petite correction indispensable de l'ancienne route responsable de la regression.

## Validation

- JSON parse : OK.
- Les cinq `data-target-screen` de la Boussole pointent vers des sections existantes : OK.
- La zone JSON `e03_boussole.porte_principale` pointe maintenant vers `e05_cartes` : OK.

Le navigateur integre de l'environnement Codex bloque toujours les tests locaux `localhost`/`127.0.0.1`. La validation Android portrait, Android paysage et Desktop reste donc a confirmer visuellement dans un navigateur local non bloque avant fusion.
