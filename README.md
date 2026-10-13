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
- `404.html` : page « introuvable ». Vercel l'affiche tout seul pour toute adresse inconnue ; ses liens partent de la racine (`/style.css`…) pour marcher à n'importe quelle profondeur.
- Écran de chargement (logo, nom, barre dorée) : seulement à la **première** page de la visite, au moins 0,9 s, au plus 3 s. Absent si le téléphone demande « réduire les animations ».
- Les formulaires ne stockent rien : ils ouvrent WhatsApp avec le message prêt à envoyer.

## Animations

Dans `style.css` (fin du fichier) et `app.js` (bloc « Animations »), sans bibliothèque :
entrée du hero en cascade, « sublimé » en or qui coule, carton qui flotte avec un reflet, éclat qui tourne autour du logo,
reflet sur les boutons dorés, apparition des sections au défilement, prix et chiffres qui comptent, barre du taux de réponse qui se remplit.
Tout est coupé si le téléphone demande « réduire les animations ». Sécurité : si le défilement n'est jamais détecté, tout s'affiche au bout de 4 s.

## Mise en ligne

Vercel (projet statique, aucun réglage de build, preset « Other »). `maquettes/` n'est pas publié (`.vercelignore`).

## Design

Maquettes Stitch dans `maquettes/` (accueil : `ndaje_mod_le_2_meraude…`). Thème émeraude et or, titres en Cormorant Garamond, texte en Plus Jakarta Sans. Pas d'emoji, touches sénégalaises discrètes.
