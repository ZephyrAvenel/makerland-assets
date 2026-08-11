# RV-046 - Correction du conteneur des bulles meteo en portrait

Date : 2026-08-11

Branche : `agent/rv-046-meteo-container-portrait`

## Diagnostic

Le DOM genere par `ZoneRenderer` ne cree pas de wrapper dedie du type `.meteo-choices` ou `.meteo-buttons`.
Les cinq choix de `e02_meteo` sont injectes directement dans l'ecran sous forme de conteneurs `.makerland-zone`.

Structure effective :

- `#e02_meteo`
- `.makerland-zone[data-id="eclaircie"]`
- `.makerland-zone[data-id="transition"]`
- `.makerland-zone[data-id="je_ne_sais_pas"]`
- `.makerland-zone[data-id="brouillard"]`
- `.makerland-zone[data-id="tempete"]`
- `.makerland-zone-visual-button` dans chaque zone

RV-045 avait deja agrandi les bulles et stabilise leur contenu. Le probleme restant en portrait venait de l'espace vertical disponible pour les conteneurs `.makerland-zone` : les bulles etaient positionnees trop bas apres agrandissement, ce qui pouvait donner une coupure visuelle par le bas.

La propriete responsable cote CSS etait donc la position verticale effective du conteneur `.makerland-zone` en portrait, combinee a la hauteur plus grande introduite pour les bulles.

## Correction appliquee

Uniquement en mode portrait, les conteneurs meteo sont legerement remontes :

`margin-top: clamp(-46px, -5.5vh, -26px);`

Cette correction :

- conserve exactement les dimensions RV-045 des bulles ;
- conserve la typographie ;
- conserve les textes ;
- conserve les animations et delais RV-043 ;
- conserve les hitboxes et destinations JSON ;
- ne modifie aucun HTML ni JavaScript.

## Validation

- `git diff --check` : OK.
- Verification code : les bulles restent pilotees par `.makerland-zone` et `.makerland-zone-visual-button`.
- Portrait Samsung S26 Ultra : correction calculee pour remonter l'ensemble des conteneurs et eviter la troncature basse.
- Paysage Samsung S26 Ultra : aucune regle paysage modifiee, donc pas de regression attendue.

## Limite de validation locale

Une tentative de validation Playwright locale a ete effectuee avec les viewports Samsung S26 Ultra portrait et paysage. Le lancement a ete bloque par une restriction filesystem du runtime local (`EPERM` sur le dossier Codex). Aucune capture automatique n'a donc pu etre generee depuis cet environnement.
