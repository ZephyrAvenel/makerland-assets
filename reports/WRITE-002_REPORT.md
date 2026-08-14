# WRITE-002 - Zone d'ecriture perceptible dans la Constellation

## Objectif

Rendre la zone de contribution identifiable comme un espace d'ecriture des l'arrivee dans la Constellation, sans ajouter de texte explicatif, de panneau ou de nouvelle couche d'interface.

## Corrections realisees

### Curseur decoratif

Fichier :

- `css/livingOverlayManager.css`

Ajout d'un curseur visuel dore via `constellation-panel::before`.

Caracteristiques :

- pulsation lente de 2,8 secondes ;
- animation limitee a `opacity` et `transform` ;
- aucun impact sur les evenements tactiles (`pointer-events:none`) ;
- disparition automatique lorsque le champ recoit le focus ;
- disparition automatique lorsque le champ contient du texte.

### Suivi focus / valeur

Fichier :

- `js/livingOverlayManager.js`

Ajout de deux classes d'etat sur `.constellation-panel` :

- `has-writing-focus` ;
- `has-writing-value`.

Ces classes sont synchronisees au chargement, au focus, au blur, a la saisie et apres le partage.

### Focus visuel

Fichier :

- `css/livingOverlayManager.css`

Ajout d'une mise en lumiere tres discrete du textarea lorsqu'il recoit le focus :

- bordure legerement plus doree ;
- halo faible ;
- aucune animation agressive.

## Compatibilite avec LivingOverlayManager

La mission ne cree aucune nouvelle couche.
Elle reutilise l'etat `WRITE` cree lors de LIVING-WRITE-001.

Le curseur decoratif n'est pas une notification et ne participe pas a la file d'attente des panneaux.

## Accessibilite et mobile

- Le curseur natif du navigateur reprend immediatement au focus.
- Le curseur decoratif est masque au premier toucher.
- Le bouton et le textarea restent inchanges fonctionnellement.
- `prefers-reduced-motion` desactive la pulsation.

## Fichiers modifies

- `js/livingOverlayManager.js`
- `css/livingOverlayManager.css`

## Validations

A executer :

- `node --check js/livingOverlayManager.js`
- `git diff --check`
- `git diff --cached --check`

## Resultat

La zone d'ecriture est maintenant perceptible comme un espace ou deposer quelques mots, sans ajouter de texte ni transformer la Constellation en interface explicative.
