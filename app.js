/* NDAJE — site vitrine : prix, liens WhatsApp, filtre des modèles, formulaire de commande.
   Aucune donnée n'est envoyée à un serveur : la demande s'ouvre dans WhatsApp. */
(function () {
  var C = window.NDAJE_SITE || {};
  var prix = C.prix || {};
  var delais = C.delais || {};

  function fcfa(n) {
    return Number(n).toLocaleString("fr-FR").replace(/ | /g, " ");
  }

  // --- Prix et délais : <span data-prix="essentiel"></span> ---------------
  document.querySelectorAll("[data-prix]").forEach(function (el) {
    var v = prix[el.getAttribute("data-prix")];
    if (v !== undefined) el.textContent = fcfa(v);
  });
  document.querySelectorAll("[data-delai]").forEach(function (el) {
    var v = delais[el.getAttribute("data-delai")];
    if (v) el.textContent = v;
  });

  // --- Démo : <a data-demo> ouvre la démo, <iframe data-demo-src> l'affiche ---
  document.querySelectorAll("[data-demo]").forEach(function (a) {
    if (C.demoUrl) {
      a.href = C.demoUrl;
    } else {
      a.hidden = true;
    }
  });
  document.querySelectorAll("[data-demo-src]").forEach(function (f) {
    if (C.demoUrl) f.src = C.demoUrl + "?direct=1";
  });

  // --- E-mail (affiché seulement s'il est renseigné) ----------------------
  document.querySelectorAll("[data-email]").forEach(function (el) {
    if (C.email) {
      el.href = "mailto:" + C.email;
      var t = el.querySelector("[data-email-texte]");
      (t || el).textContent = C.email;
    } else {
      el.hidden = true;
    }
  });

  // --- WhatsApp -----------------------------------------------------------
  var avis = document.getElementById("avis");
  var minuterie;
  function montrerAvis(texte) {
    if (!avis) return;
    avis.textContent = texte;
    avis.hidden = false;
    clearTimeout(minuterie);
    minuterie = setTimeout(function () { avis.hidden = true; }, 4000);
  }
  function lienWhatsApp(message) {
    if (!C.whatsapp) return null;
    var num = String(C.whatsapp).replace(/\D/g, "");
    return "https://wa.me/" + num + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var url = lienWhatsApp(a.getAttribute("data-wa"));
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = "#";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        montrerAvis("Le numéro WhatsApp sera bientôt disponible.");
      });
    }
  });

  // --- Filtre des modèles -------------------------------------------------
  var chips = document.querySelectorAll(".chip[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var cat = chip.getAttribute("data-cat");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      document.querySelectorAll(".modele, .col-carte").forEach(function (m) {
        var ok = cat === "tous" || m.getAttribute("data-cat") === cat;
        m.hidden = !ok;
      });
    });
  });

  // --- Formulaire de commande : prépare un message WhatsApp ----------------
  var form = document.getElementById("form-commande");
  if (form) {
    var erreur = document.getElementById("erreur-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var nom = String(d.get("noms") || "").trim();
      var tel = String(d.get("tel") || "").trim();
      if (!nom || !tel) {
        erreur.textContent = "Merci d'indiquer les noms et votre numéro WhatsApp.";
        return;
      }
      erreur.textContent = "";
      var options = d.getAll("option").join(", ") || "aucune";
      var lignes = [
        "Bonjour Ndaje, je souhaite une invitation.",
        "Type de cérémonie : " + (d.get("type") || "non précisé"),
        "Noms / hôtes : " + nom,
        "Date : " + (d.get("date") || "à préciser"),
        "Invités estimés : " + (d.get("invites") || "à préciser"),
        "Formule : " + (d.get("formule") || "à conseiller"),
        "Options : " + options,
        "Mon numéro WhatsApp : " + tel
      ];
      var souhaits = String(d.get("souhaits") || "").trim();
      if (souhaits) lignes.push("Souhaits : " + souhaits);
      var url = lienWhatsApp(lignes.join("\n"));
      if (url) {
        window.open(url, "_blank", "noopener");
      } else {
        montrerAvis("Le numéro WhatsApp sera bientôt disponible.");
      }
    });
  }

  // --- Année du pied de page ---------------------------------------------
  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
