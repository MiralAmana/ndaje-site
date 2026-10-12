/* NDAJE — site vitrine : prix, liens WhatsApp, filtre des modèles, atelier « Créer », contact.
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

  // --- Réglages facultatifs : <el data-cfg="telephone|horaires|ville"> ------
  // Masqué tant que la valeur n'est pas renseignée dans config.js.
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var cle = el.getAttribute("data-cfg");
    var v = C[cle];
    if (!v) { el.hidden = true; return; }
    var t = el.hasAttribute("data-cfg-texte") ? el : el.querySelector("[data-cfg-texte]");
    if (t) t.textContent = v;
    if (cle === "telephone" && el.tagName === "A") el.href = "tel:" + String(v).replace(/[^\d+]/g, "");
  });

  // --- Outils pour les formulaires -----------------------------------------
  function dateFr(v) {
    if (!v) return "";
    var d = new Date(v + "T12:00:00");
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function sansAccent(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function envoyerWhatsApp(lignes) {
    var url = lienWhatsApp(lignes.join("\n"));
    if (url) window.open(url, "_blank", "noopener");
    else montrerAvis("Le numéro WhatsApp sera bientôt disponible.");
  }
  function valeur(form, nom) {
    var el = form.elements[nom];
    return el && el.value ? String(el.value).trim() : "";
  }

  // --- Atelier « Créer » : aperçu en direct, total estimé, message WhatsApp --
  var creer = document.getElementById("form-creer");
  if (creer) {
    var cleFormule = { Essentiel: "essentiel", Premium: "premium", Prestige: "prestige" };
    var params = new URLSearchParams(window.location.search);

    var typeUrl = params.get("type");
    if (typeUrl) {
      creer.querySelectorAll("input[name=type]").forEach(function (r) {
        if (sansAccent(r.value) === sansAccent(typeUrl)) r.checked = true;
      });
    }
    var formuleUrl = params.get("formule");
    if (formuleUrl && cleFormule[formuleUrl]) creer.elements.formule.value = formuleUrl;

    var caseCagnotte = document.getElementById("cagnotte");
    var champsCagnotte = document.getElementById("champs-cagnotte");
    var erreurCreer = document.getElementById("erreur-form");

    var initiales = function (noms) {
      var parties = noms.split(/\s*(?:&|\+|,|\bet\b)\s*/i).filter(function (p) { return p.trim(); });
      if (!parties.length) return "N";
      return parties.slice(0, 2).map(function (p) { return p.trim().charAt(0).toUpperCase(); }).join("&");
    };
    var choisi = function (nom) {
      var r = creer.querySelector("input[name=" + nom + "]:checked");
      return r ? r.value : "";
    };

    function totalCommande() {
      var cle = cleFormule[creer.elements.formule.value] || "premium";
      var base = prix[cle] || 0;
      var supplements = 0;
      var noms = [];
      if (choisi("langue") === "Français et wolof") { supplements += prix.optionWolof || 0; noms.push("Version wolof"); }
      creer.querySelectorAll("input[data-opt]:checked").forEach(function (c) {
        supplements += prix[c.getAttribute("data-opt")] || 0;
        noms.push(c.value);
      });
      return { cle: cle, base: base, supplements: supplements, total: base + supplements, options: noms };
    }

    function maj() {
      var noms = valeur(creer, "noms");
      document.getElementById("ap-noms").textContent = noms || "Vos noms";
      document.getElementById("ap-sceau").textContent = initiales(noms);
      document.getElementById("ap-type").textContent = choisi("type");
      var d = dateFr(valeur(creer, "date"));
      var h = valeur(creer, "heure");
      document.getElementById("ap-date").textContent = d ? d.charAt(0).toUpperCase() + d.slice(1) + (h ? " · " + h : "") : "Date de la célébration";
      document.getElementById("ap-lieu").textContent = valeur(creer, "lieu") || "Lieu de la réception";

      champsCagnotte.hidden = !caseCagnotte.checked;

      var t = totalCommande();
      document.getElementById("recap-formule").textContent = creer.elements.formule.value;
      document.getElementById("recap-prix").textContent = fcfa(t.base);
      document.getElementById("recap-options").hidden = t.supplements === 0;
      document.getElementById("recap-opt-prix").textContent = "+" + fcfa(t.supplements);
      document.getElementById("recap-total").textContent = fcfa(t.total);
      var delai = delais[t.cle] || "";
      if (creer.querySelector("input[data-opt=optionExpress]:checked") && delais.express) delai = delais.express;
      document.getElementById("recap-delai").textContent = delai;
    }
    creer.addEventListener("input", maj);
    creer.addEventListener("change", maj);
    maj();

    creer.addEventListener("submit", function (e) {
      e.preventDefault();
      var noms = valeur(creer, "noms");
      var tel = valeur(creer, "tel");
      if (!noms || !tel) {
        erreurCreer.textContent = "Merci d'indiquer les noms et votre numéro WhatsApp.";
        return;
      }
      erreurCreer.textContent = "";
      var t = totalCommande();
      var date = dateFr(valeur(creer, "date"));
      var l = [
        "Bonjour Ndajé, je souhaite créer une invitation.",
        "Modèle : " + choisi("modele"),
        "Type : " + choisi("type"),
        "Noms / hôtes : " + noms,
        "Date : " + (date || "à préciser") + (valeur(creer, "heure") ? " à " + valeur(creer, "heure") : ""),
        "Lieu : " + (valeur(creer, "lieu") || "à préciser")
      ];
      if (valeur(creer, "programme")) l.push("Programme : " + valeur(creer, "programme"));
      l.push("Langue : " + choisi("langue"));
      if (caseCagnotte.checked) {
        l.push("Cagnotte : oui (titulaire " + (valeur(creer, "titulaire") || "à préciser") +
          ", Wave " + (valeur(creer, "wave") || "-") + ", Orange Money " + (valeur(creer, "om") || "-") + ")");
      } else {
        l.push("Cagnotte : non");
      }
      l.push("Réponses : max " + valeur(creer, "maxp") + " personnes" +
        (valeur(creer, "limite") ? ", avant le " + dateFr(valeur(creer, "limite")) : ""));
      l.push("Musique : " + choisi("musique"));
      l.push("Formule : " + creer.elements.formule.value + " (" + fcfa(t.base) + " FCFA)");
      if (t.options.length) l.push("Options : " + t.options.join(", ") + " (+" + fcfa(t.supplements) + " FCFA)");
      l.push("Total estimé : " + fcfa(t.total) + " FCFA");
      l.push("Mon numéro WhatsApp : " + tel);
      if (valeur(creer, "souhaits")) l.push("Souhaits : " + valeur(creer, "souhaits"));
      envoyerWhatsApp(l);
    });
  }

  // --- Page Contact : demande personnalisée ----------------------------------
  var contactForm = document.getElementById("form-contact");
  if (contactForm) {
    var erreurContact = document.getElementById("erreur-contact");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nom = valeur(contactForm, "noms");
      var tel = valeur(contactForm, "tel");
      if (!nom || !tel) {
        erreurContact.textContent = "Merci d'indiquer votre nom et votre numéro WhatsApp.";
        return;
      }
      erreurContact.textContent = "";
      var type = contactForm.querySelector("input[name=type]:checked");
      var l = [
        "Bonjour Ndajé, je vous contacte depuis le site.",
        "Célébration : " + (type ? type.value : "non précisée"),
        "Nom : " + nom,
        "Mon numéro WhatsApp : " + valeur(contactForm, "indicatif") + " " + tel,
        "Date : " + (dateFr(valeur(contactForm, "date")) || "à préciser"),
        "Invités estimés : " + (valeur(contactForm, "invites") || "à préciser")
      ];
      if (valeur(contactForm, "souhaits")) l.push("Souhaits : " + valeur(contactForm, "souhaits"));
      envoyerWhatsApp(l);
    });
  }

  // --- Année du pied de page ---------------------------------------------
  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
