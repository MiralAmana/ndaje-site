/* =========================================================
   NDAJE — SITE VITRINE : réglages
   Prix, contacts : tout se change ici, pas dans les pages.
   ========================================================= */

window.NDAJE_SITE = {
  // Numéro WhatsApp de commande, au format international SANS + ni espaces.
  // Ex. "221771234567". Tant qu'il est vide, les boutons WhatsApp affichent
  // « Numéro bientôt disponible » au lieu d'envoyer vers un mauvais contact.
  whatsapp: "",

  // Adresse de la démo d'invitation (autre dépôt : ndaje-template, projet Vercel séparé).
  // À changer si le domaine change (ex. "https://demo.ndaje.sn/invitation/").
  demoUrl: "https://ndaje-template.vercel.app/invitation/",

  // Adresse e-mail de contact (laisser "" pour la masquer).
  email: "",

  // Prix en FCFA (affichés partout sur le site).
  prix: {
    essentiel: 20000,
    premium: 50000,
    prestige: 120000,
    optionWolof: 10000,
    optionExpress: 20000,
    optionQrPass: 25000
  },

  // Délais de livraison affichés (texte libre).
  delais: {
    essentiel: "48 heures",
    premium: "5 jours",
    prestige: "7 jours",
    express: "24 heures"
  }
};
