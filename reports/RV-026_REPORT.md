# RV-026 - Le Seuil Vivant

## Resume

La mission RV-026 affine l'experience narrative de l'Arche sans modifier sa logique fonctionnelle.

Objectif atteint:

- le Murmure est plus lisible;
- son temps de lecture est plus humain;
- l'invitation reste visible et disponible;
- l'Arche continue a vivre doucement pendant l'attente;
- la traversee vers l'oeuvre immersive reste inchangee.

## Fichiers modifies

- `js/archwayPassage.js`;
- `css/style.css`.

Aucun changement n'a ete applique a:

- `ZoneRenderer`;
- `BookRenderer`;
- `NarrativeMemory`;
- `LivingEcho`;
- `Navigation` generale;
- JSON;
- oeuvre immersive.

## Lisibilite du Murmure

Le texte du Murmure n'a pas ete modifie.

Ameliorations appliquees:

- couleur legerement renforcee;
- ombre douce plus diffuse;
- halo sombre radial tres discret derriere le texte;
- lueur chaude faible pour conserver la presence poetique.

Le rendu reste volontairement non cartouche: aucun panneau opaque, aucune banniere, aucun encadrement.

## Rythme de lecture

Nouveaux parametres:

```text
apparition: 820 ms
lecture minimale: 6500 ms
lecture maximale: 9000 ms
disparition: 1500 ms
buffer avant invitation: 360 ms
```

Pour le Murmure actuel:

```text
13 mots
base RV-024: 4000 ms
duree RV-026: 6500 ms
Murmure visible vers: 1180 ms
Murmure masque vers: 8500 ms
invitation prete vers: 10360 ms
```

Le visiteur dispose donc d'un temps de lecture sensiblement plus calme avant l'apparition de l'invitation.

## Invitation permanente

Le libelle est maintenant:

```text
✦ Franchir le seuil
```

Une fois l'invitation apparue:

- elle reste visible;
- elle reste active;
- elle ne disparait pas automatiquement;
- le visiteur peut contempler la foret aussi longtemps qu'il le souhaite.

## Arche vivante

Effets ajoutes ou ajustes:

- halo de l'Arche ralenti a 10,5 s;
- respiration lumineuse plus douce;
- lumiere du chemin ajoutee via un halo radial discret;
- micro-respiration de l'invitation sur 8 s;
- survol/focus doux, sans rebond.

Les effets utilisent `opacity`, `transform` et `filter`.

## Accessibilite et mouvement reduit

`prefers-reduced-motion` est respecte.

En mouvement reduit:

- les animations du halo, de la brume, des particules, du chemin et de l'invitation sont neutralisees;
- les transitions longues sont supprimees;
- le Murmure, le halo et l'invitation restent visibles et utilisables.

## Tests realises

Commandes:

```text
node --check js/archwayPassage.js -> OK
node --check js/navigation.js -> OK
git diff --check -> OK
```

Verification des fichiers proteges:

```text
aucun diff sur ZoneRenderer
aucun diff sur BookRenderer
aucun diff sur NarrativeMemory
aucun diff sur LivingEcho
aucun diff sur Navigation generale
aucun diff sur les JSON
```

Navigateur local:

- Android portrait 390 x 844: Murmure visible, voile visible, invitation visible, Arche active;
- Android paysage 740 x 360: Murmure visible, voile visible, invitation visible, Arche active;
- `prefers-reduced-motion: reduce`: valide;
- tap sur `✦ Franchir le seuil`: ouvre bien `https://wood-demonstrate.unicornplatform.page/zephyr_avenel/`;
- console: aucune erreur.

## Conclusion UX

Le Seuil Vivant laisse davantage de temps au visiteur.

L'Arche n'appelle pas avec insistance. Elle demeure disponible.

Le lieu respire, attend, puis ouvre le passage lorsque le lecteur choisit de le franchir.
