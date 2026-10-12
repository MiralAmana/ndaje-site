# Ndajé — Site vitrine

Le site public de Ndajé : accueil, modèles, formules, demande d'invitation, contact.
Les invitations des clients et la démo sont dans un **autre dépôt** : `ndaje-template`.

HTML, CSS et JavaScript purs, sans build. Test en local :

```bash
python3 -m http.server 8000      # puis http://localhost:8000/
```

## Ce qui se change

Tout est dans `config.js` :

- `whatsapp` : numéro de commande, format international sans `+` (ex. `221771234567`). Vide = les boutons affichent « bientôt disponible ».
- `email`, `telephone`, `horaires`, `ville` : affichés sur la page Contact seulement s'ils sont remplis (vides = masqués).
- `demoUrl` : adresse de la démo d'invitation (projet `ndaje-template`).
- `prix` et `delais` : affichés partout sur le site.

Le logo est dans `assets/logo.png` (en-tête et favicon). À faire plus tard : remplacer les cadres « Photo à venir » par les visuels d'Aicha, et ajouter `og:url` / `og:image` (adresse complète) une fois le domaine prêt. Le nom s'écrit **Ndajé** dans tous les textes visibles.

## Les pages

- `index.html` : accueil. `modeles.html` : catalogue (filtres par cérémonie). `formules.html` : tarifs et comparatif.
- `creer.html` : atelier en 4 étapes avec aperçu en direct et total estimé. Il accepte `?type=bapteme` et `?formule=Premium` pour préremplir.
- `contact.html` : WhatsApp, demande personnalisée, questions fréquentes.
- Les formulaires ne stockent rien : ils ouvrent WhatsApp avec le message prêt à envoyer.

## Mise en ligne

Vercel (projet statique, aucun réglage de build, preset « Other »). `maquettes/` n'est pas publié (`.vercelignore`).

## Design

Maquettes Stitch dans `maquettes/` (accueil : `ndaje_mod_le_2_meraude…`). Thème émeraude et or, titres en Cormorant Garamond, texte en Plus Jakarta Sans. Pas d'emoji, touches sénégalaises discrètes.
