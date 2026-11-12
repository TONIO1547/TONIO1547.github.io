/* Construit la page à partir de contenu.js. Pas besoin de modifier ce fichier pour changer le contenu. */
(function () {
  "use strict";
  var SRC = window.PORTFOLIO;
  if (!SRC) return; // l'erreur de contenu.js est déjà affichée en haut de la page (voir index.html)
  var D = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  D.documentElement.classList.add("js");
  function $(id) { return D.getElementById(id); }

  /* ---------- Langue (FR / EN), mémorisée ---------- */
  var LANG = (function () {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "fr" || q === "en") { try { localStorage.setItem("lang", q); } catch (e) {} return q; }
    try { var m = localStorage.getItem("lang"); if (m === "fr" || m === "en") return m; } catch (e) {}
    return /^fr/i.test(navigator.language || "fr") ? "fr" : "en";
  })();
  var UI = {
    "skip": ["Aller au contenu", "Skip to content"],
    "nav.projets": ["Projets", "Projects"], "nav.parcours": ["Parcours", "Background"], "nav.outils": ["Outils", "Tools"],
    "nav.apropos": ["À propos", "About"], "nav.contact": ["Contact", "Contact"],
    "role": ["Étudiant ingénieur · Robotique autonome", "Engineering student · Autonomous robotics"],
    "base": ["Basé à", "Based in"], "explorer": ["Défiler pour explorer", "Scroll to explore"],
    "cv": ["Télécharger mon CV", "Download my résumé"], "specialite": ["Robotique autonome", "Autonomous robotics"],
    "phare": ["Projet phare", "Flagship project"], "chaine": ["Chaîne de traitement", "Processing chain"],
    "demo": ["Démo enregistrée", "Recorded demo"], "mesures": ["Résultats d'entraînement du détecteur", "Detector training results"],
    "objectifs": ["Objectifs visés (non encore mesurés)", "Targets (not measured yet)"],
    "modele": ["Modèle 3D de la V1", "V1 3D model"], "charger3d": ["Charger le modèle 3D (3,5 Mo)", "Load the 3D model (3.5 MB)"],
    "chargement3d": ["Chargement du modèle 3D…", "Loading 3D model…"], "erreur3d": ["Modèle 3D indisponible", "3D model unavailable"],
    "indispo3d": ["Affichage 3D indisponible sur cet appareil", "3D view unavailable on this device"],
    "autres": ["Autres projets", "Other projects"], "autres.t1": ["Cartes & ", "Boards & "], "autres.t2": ["robots", "robots"],
    "fiche": ["Voir la fiche du projet", "Open the project page"],
    "parcours.t1": ["Par", "Back"], "parcours.t2": ["cours", "ground"], "parcours.tag": ["Formation", "Education"],
    "outils.tag": ["Ce que j'ai mis en pratique sur mes projets", "What I have put into practice in my projects"],
    "outils.t1": ["Boîte à ", "Tool"], "outils.t2": ["outils", "box"],
    "apropos.tag": ["À propos", "About me"], "apropos.t1": ["Qui ", "Who "], "apropos.t2": ["suis-je ?", "am I?"],
    "contact.tag": ["Contact", "Contact"], "contact.t1": ["Un stage en", "A robotics"], "contact.t2": ["robotique ?", "internship?"],
    "contact.sous": ["Stage, projet, question sur S.T.A.R. : écrivez-moi.", "Internship, project, question about S.T.A.R.: get in touch."],
    "email": ["E-mail", "Email"], "copier": ["Copier", "Copy"], "copie": ["Copié", "Copied"],
    "retour": ["Retour aux projets", "Back to projects"], "retour.star": ["Retour à l'accueil", "Back to home"],
    "complet": ["Voir le projet complet", "See the full project"], "maj": ["Mise à jour", "Updated"],
    "agrandir": ["Agrandir l'image", "Enlarge image"], "fermer": ["Fermer", "Close"],
    "Terminé": ["Terminé", "Completed"], "En cours": ["En cours", "In progress"], "Prototype": ["Prototype", "Prototype"]
  };
  function t(k) { var v = UI[k]; return v ? v[LANG === "en" ? 1 : 0] : k; }
  function estBilingue(v) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return false;
    var k = Object.keys(v);
    return k.length > 0 && k.every(function (x) { return x === "fr" || x === "en"; });
  }
  function resoudre(v) {
    if (estBilingue(v)) return (LANG === "en" ? (v.en || v.fr) : (v.fr || v.en)) || "";
    if (Array.isArray(v)) return v.map(resoudre);
    if (v && typeof v === "object") { var o = {}; for (var k in v) o[k] = resoudre(v[k]); return o; }
    return v;
  }
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function paras(s) { return String(s || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return "<p>" + e(p.trim()) + "</p>"; }).join(""); }
  function ico(n, c) { return '<svg' + (c ? ' class="' + c + '"' : "") + ' aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function tag(txt) { return '<div class="sec-tag">' + ico("star") + "<span>" + e(txt) + "</span></div>"; }
  function titre(id, a, b) { return '<h2 id="' + id + '"><span class="ln"><span><span class="silver">' + e(a) + '</span><span class="blue">' + e(b || "") + "</span></span></span></h2>"; }
  var CORNERS = '<div class="corners"><i></i></div>';

  /* ---------- Médias ---------- */
  function media(m, cls) {
    if (!m) return "";
    var leg = m.legende ? '<figcaption><span class="mono">' + e(m.legende) + "</span></figcaption>" : "";
    if (m.type === "image") {
      return '<figure class="screen ' + (cls || "") + '">' + CORNERS + '<button class="zoom" type="button" data-zoom="' + e(m.src) + '" data-leg="' + e(m.legende || "") + '" aria-label="' + e(t("agrandir")) + '"><img src="' + e(m.src) + '" alt="' + e(m.legende || "") + '" loading="lazy"></button>' + leg + "</figure>";
    }
    if (m.type === "video") {
      return '<figure class="screen ' + (cls || "") + '">' + CORNERS + '<video src="' + e(m.src) + '"' + (m.poster ? ' poster="' + e(m.poster) + '"' : "") + ' controls muted loop playsinline preload="' + (m.poster ? "none" : "metadata") + '"></video>' + leg + "</figure>";
    }
    if (m.type === "modele3d") {
      return '<figure class="screen ' + (cls || "") + '">' + CORNERS + '<div class="stage-3d" data-src="' + e(m.src) + '" data-rot="' + e(m.rotation == null ? 90 : m.rotation) + '"><button class="btn" type="button" data-3d>' + e(t("charger3d")) + "</button></div>" + leg + "</figure>";
    }
    if (m.type === "youtube") {
      return '<p><a class="btn" href="https://www.youtube.com/watch?v=' + encodeURIComponent(m.id) + '" target="_blank" rel="noopener">' + e(m.legende || "YouTube") + ico("arr") + "</a></p>";
    }
    return "";
  }
  function points(l) { return l && l.length ? '<ul class="pts">' + l.map(function (p) { return "<li>" + e(p) + "</li>"; }).join("") + "</ul>" : ""; }
  function liens(l) { return l && l.length ? '<div class="liens">' + l.map(function (x) { return '<a class="btn" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(x.texte) + ico("arr") + "</a>"; }).join("") + "</div>" : ""; }
  function tags(l) { return l && l.length ? '<div class="tags">' + l.map(function (x) { return "<span>" + e(x) + "</span>"; }).join("") + "</div>" : ""; }

  /* ---------- Rendu ---------- */
  var P;
  function rendre() {
    P = resoudre(SRC);
    var I = P.identite, S = P.projets.filter(function (p) { return p.phare; })[0], autres = P.projets.filter(function (p) { return !p.phare; });
    D.documentElement.lang = LANG;
    D.querySelectorAll("[data-i]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i")); });
    D.querySelectorAll(".langue button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.l === LANG ? "true" : "false"); });
    $("nav-nom").textContent = I.prenom + " " + I.nom;
    $("nav-linkedin").href = I.linkedin;
    $("fermer").setAttribute("aria-label", t("fermer"));
    var cv = I.cv;

    $("hero").innerHTML =
      '<div class="hud-top"><span class="mono">' + e(t("role")) + "</span>" +
      (I.lieu ? '<span class="mono">' + e(t("base")) + " <b>" + e(I.lieu) + "</b></span>" : "") +
      '<span class="mono dispo"><span>' + e(I.disponibilite) + "<br><b>" + e(I.disponibiliteDate || "") + "</b></span>" + ico("star", "twinkle") + "</span></div>" +
      '<div class="hero-grid"><div><h1 aria-label="' + e(I.nom + " " + I.prenom) + '"><span class="ln"><span class="silver">' + e(I.nom) + '</span></span><span class="ln"><span class="blue">' + e(I.prenom) + "</span></span></h1>" +
      '<p class="accroche hero-titre">' + ico("star") + "<span>" + e(I.accroche) + "</span></p></div>" +
      '<div class="visual wipe" id="visual"><div class="shot"><img id="hero-photo" src="' + e(I.photo) + '" alt="' + e(I.prenom + " " + I.nom) + (S ? ", " + e(S.titre) + " V1" : "") + '" width="880" height="1105"></div>' + CORNERS +
      '<div class="scan" aria-hidden="true"></div>' + (S ? '<div class="lock" aria-hidden="true"><span class="mono"><b>' + e(S.titre) + " V1</b> · " + e(t("Prototype")) + "</span></div>" : "") + "</div></div>" +
      '<div class="who-row"><div class="hero-actions"><a class="btn plein" href="' + e(cv) + '" target="_blank" rel="noopener">' + e(t("cv")) + ico("down") + '</a><a class="btn" href="#star">' + e(t("explorer")) + ico("down", "bouge") + "</a></div>" +
      '<div class="who">' + ico("ret", "reticle") + '<span class="name">' + e(t("specialite")) + '</span><span class="mono">' + e(I.ecole) + "</span>" + (I.coordonnees ? '<span class="mono"><b>' + e(I.coordonnees) + "</b></span>" : "") + "</div></div>";

    $("star-in").innerHTML = S ? rendreStar(S) : "";

    $("projets-in").innerHTML = tag(t("autres")) + '<div class="tete">' + titre("proj-t", t("autres.t1"), t("autres.t2")) + "</div>" +
      '<div class="cards">' + autres.map(function (p, i) {
        var img = (p.medias || []).filter(function (m) { return m.type === "image"; })[0];
        return '<a class="card rv" style="--d:' + (i * .1) + 's" href="#p-' + e(p.id) + '" aria-label="' + e(p.titre) + " : " + e(t("fiche")) + '"><div><span class="num">' + ("0" + (i + 1)).slice(-2) + "</span><h3>" + e(p.titre) + "</h3><p>" + e(p.resume) + "</p>" + tags(p.tags) + "</div>" +
          (img ? '<div class="pic"><img src="' + e(img.src) + '" alt="' + e(img.legende || "") + '" loading="lazy"></div>' : "") +
          '<span class="go" aria-hidden="true">' + ico("arr") + "</span></a>";
      }).join("") + "</div>";

    $("parcours-in").innerHTML = tag(t("parcours.tag")) + '<div class="tete">' + titre("parc-t", t("parcours.t1"), t("parcours.t2")) + "</div>" +
      '<ol class="parcours">' + P.parcours.map(function (x, i) {
        return '<li class="rv" style="--d:' + (i * .07) + 's"><span class="mono"><b>' + e(x.periode) + "</b></span><div><h3>" + e(x.titre) + "</h3>" + (x.lieu ? '<span class="mono lieu">' + e(x.lieu) + "</span>" : "") + (x.detail ? '<p class="det">' + e(x.detail) + "</p>" : "") + "</div></li>";
      }).join("") + "</ol>";

    $("outils-in").innerHTML = tag(t("outils.tag")) + '<div class="tete">' + titre("outils-t", t("outils.t1"), t("outils.t2")) + "</div>" +
      '<div class="outils">' + P.competences.map(function (c, i) {
        return '<div class="outil rv" style="--d:' + (i * .05) + 's">' + CORNERS + '<span class="n">' + ("0" + (i + 1)).slice(-2) + "</span><h3>" + e(c.domaine) + "</h3>" + tags(c.items) + "</div>";
      }).join("") + "</div>";

    $("apropos-in").innerHTML = tag(t("apropos.tag")) + '<div class="tete">' + titre("apropos-t", t("apropos.t1"), t("apropos.t2")) + "</div>" +
      '<div class="apropos"><div class="portrait rv">' + CORNERS + '<img src="' + e(I.photo) + '" alt="' + e(I.prenom + " " + I.nom) + '" loading="lazy"></div>' +
      '<div class="txt rv"><p>' + e(I.apropos || I.accroche) + '</p><a class="btn plein" href="' + e(cv) + '" target="_blank" rel="noopener" id="cv-apropos">' + e(t("cv")) + ico("down") + "</a></div></div>";

    $("contact-in").innerHTML = tag(t("contact.tag")) + '<div class="contact"><div><h2 id="contact-t"><span class="ln"><span class="silver">' + e(t("contact.t1")) + '</span></span><span class="ln"><span class="blue">' + e(t("contact.t2")) + "</span></span></h2>" +
      '<p class="mono" style="margin-top:18px">' + e(I.disponibilite) + " · <b>" + e(I.disponibiliteDate || "") + "</b></p></div>" +
      '<div class="rv"><p style="margin-bottom:16px">' + e(t("contact.sous")) + "</p><ul>" +
      '<li><span class="mono">' + e(t("email")) + '</span><span><a href="mailto:' + e(I.email) + '">' + e(I.email) + '</a> <button class="btn" type="button" id="copier" style="padding:6px 12px;margin-left:8px">' + e(t("copier")) + "</button></span></li>" +
      '<li><span class="mono">LinkedIn</span><a href="' + e(I.linkedin) + '" target="_blank" rel="noopener">' + e(I.linkedin.replace(/^https?:\/\/(www\.)?/, "")) + "</a></li>" +
      '<li><span class="mono">GitHub</span><a href="' + e(I.github) + '" target="_blank" rel="noopener">' + e(I.github.replace(/^https?:\/\//, "")) + "</a></li>" +
      '<li><span class="mono">CV</span><a href="' + e(cv) + '" target="_blank" rel="noopener">' + e(t("cv")) + " (PDF)</a></li></ul></div></div>";

    $("pied").innerHTML = "<span>" + e(I.prenom + " " + I.nom) + " · " + e(I.ecole) + "</span><span>" + e(t("maj")) + " " + e(P.miseAJour || "") + "</span>";
    route();
    lier();
  }

  function rendreStar(S) {
    var h = tag(t("phare")) + '<div class="tete"><h2 id="star-t"><span class="ln"><span><span class="silver">' + e(S.titre) + "</span></span></span></h2>" +
      '<p class="sub">' + e(S.sousTitre || "") + (S.description ? " · " + e(S.description) : "") + '</p><p class="rv">' + e(S.resume) + "</p>" + tags(S.tags) + "</div>";
    h += '<div class="star-grid">';
    if (S.demoPrincipale) {
      var d = S.demoPrincipale;
      h += '<figure class="screen rv">' + CORNERS + '<video id="demo" src="' + e(d.src) + '" poster="' + e(d.poster || "") + '" muted loop playsinline controls preload="metadata"></video><figcaption><span class="mono">' + e(d.legende || "") + '</span><span class="mono"><span class="blink"></span>' + e(t("demo")) + "</span></figcaption></figure>";
    }
    h += '<div class="col"><ol class="chain" aria-label="' + e(t("chaine")) + '">' + (S.chaine || []).map(function (c, i) {
      return '<li class="rv" style="--d:' + (i * .07) + 's"><span class="n">' + ("0" + (i + 1)).slice(-2) + '</span><span class="t">' + e(c.etape) + '</span><span class="d">' + e(c.detail) + "</span></li>";
    }).join("") + "</ol></div></div>";

    if (S.mesures && S.mesures.valeurs && S.mesures.valeurs.length) {
      h += '<div class="metrics" aria-label="' + e(t("mesures")) + '">' + S.mesures.valeurs.map(function (m, i) {
        return '<div class="rv" style="--d:' + (i * .06) + 's"><span class="v" data-n="' + e(m.v) + '">' + nombre(m.v) + '</span><span class="mono l">' + e(m.nom) + "</span></div>";
      }).join("") + '</div><p class="mono src">' + e(S.mesures.source || "") + "</p>";
    }

    h += '<div class="liens" style="padding:34px 0 0"><a class="btn plein" href="#p-' + e(S.id) + '">' + e(t("complet")) + ico("arr") + "</a></div>";
    return h;
  }

  /* Page S.T.A.R. complète : un bloc par version, chaque média rangé sous sa version */
  function rendreFicheStar(S) {
    var h = '<a class="btn retour" href="#star">← ' + e(t("retour.star")) + "</a>" + tag(t("phare")) +
      '<div class="tete"><h2 id="fiche-t" class="in"><span class="ln"><span class="silver">' + e(S.titre) + "</span></span></h2>" +
      '<p class="sub">' + e(S.sousTitre || "") + (S.description ? " · " + e(S.description) : "") + "</p><p>" + e(S.resume) + "</p>" + tags(S.tags) + "</div>";
    (S.versions || []).forEach(function (v, n) {
      h += '<section class="version"><div class="version-tete"><h3 class="version-nom"><span class="silver">' + e(v.nom) + '</span></h3><span class="mono"><b>' + e(t(v.statut)) + "</b></span></div>";
      h += '<div class="panel rv">' + CORNERS + '<div class="cap"><span class="mono"><b>' + e(S.titre) + " " + e(v.nom) + '</b></span><span class="mono">' + e(t(v.statut)) + "</span></div>" + points(v.points) + liens(v.liens) + "</div>";
      var blocs = [];
      if (n === 0 && S.demoPrincipale) blocs.push('<div class="rv">' + media({ type: "video", src: S.demoPrincipale.src, poster: S.demoPrincipale.poster, legende: v.nom + " · " + S.demoPrincipale.legende }) + "</div>");
      (v.demos || []).forEach(function (x) { var m = Object.assign({}, x.media, { legende: v.nom + " · " + (x.media.legende || "") }); blocs.push('<div class="rv">' + media(m) + "<p>" + e(x.texte) + "</p></div>"); });
      (v.medias || []).forEach(function (m) { blocs.push('<div class="rv">' + media(Object.assign({}, m, { legende: v.nom + " · " + (m.legende || "") })) + "</div>"); });
      if (blocs.length) h += '<div class="demos">' + blocs.join("") + "</div>";
      if (n === (S.versions.length - 1) && S.objectifs && S.objectifs.length) {
        h += '<div class="objectifs"><span class="mono"><b>' + e(v.nom) + "</b> · " + e(t("objectifs")) + "</span><ol>" + S.objectifs.map(function (o, k) {
          return '<li class="rv"><span class="n">' + ("0" + (k + 1)).slice(-2) + "</span><span>" + e(o) + "</span></li>";
        }).join("") + "</ol></div>";
      }
      h += "</section>";
    });
    if (S.liens && S.liens.length) h += '<div class="liens" style="padding:28px 0 0">' + S.liens.map(function (x) { return '<a class="btn" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(x.texte) + ico("arr") + "</a>"; }).join("") + "</div>";
    return h;
  }
  function nombre(v) { return (LANG === "en" ? Number(v).toFixed(1) : Number(v).toFixed(1).replace(".", ",")) + (LANG === "en" ? "%" : " %"); }

  /* ---------- Fiche projet (adresse : #p-identifiant) ---------- */
  function rendreFiche(p) {
    var h = '<a class="btn retour" href="#projets">← ' + e(t("retour")) + "</a>" + tag((p.periode ? p.periode + " · " : "") + t(p.statut || "")) +
      '<div class="tete"><h2 id="fiche-t" class="in"><span class="ln"><span class="silver">' + e(p.titre) + "</span></span></h2><p>" + e(p.resume) + "</p>" + tags(p.tags) + "</div>";
    (p.details || []).forEach(function (s) {
      var blocs = s.blocs || [s], txt = blocs.map(function (b) {
        if (!b.texte && !(b.points && b.points.length)) return "";
        return (b.titre ? "<h3>" + e(b.titre) + "</h3>" : "") + paras(b.texte) + (b.points && b.points.length ? '<div class="panel">' + CORNERS + points(b.points) + "</div>" : "");
      }).join("");
      if (!txt) return;
      var med = (s.medias || []).map(function (m) { return media(m); }).join("");
      h += '<section class="fiche-sec' + (med ? " avec-media" : "") + '"><div class="txt">' + txt + "</div>" + (med ? '<div class="fiche-medias">' + med + "</div>" : "") + "</section>";
    });
    if (p.liens && p.liens.length) h += '<div class="liens" style="padding:10px 0 0">' + p.liens.map(function (x) { return '<a class="btn" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(x.texte) + ico("arr") + "</a>"; }).join("") + "</div>";
    return h;
  }
  var ficheOuverte = null;
  function route() {
    var m = /^#p-(.+)$/.exec(location.hash), p = m && P.projets.filter(function (x) { return x.id === decodeURIComponent(m[1]); })[0];
    if (p) {
      $("fiche-in").innerHTML = p.phare ? rendreFicheStar(p) : rendreFiche(p);
      $("accueil").hidden = true; $("fiche").hidden = false;
      if (ficheOuverte !== p.id) scrollTo(0, 0);
      ficheOuverte = p.id; D.title = p.titre + " — " + P.identite.prenom + " " + P.identite.nom;
    } else {
      var etait = ficheOuverte;
      $("fiche").hidden = true; $("accueil").hidden = false; ficheOuverte = null;
      D.title = P.identite.prenom + " " + P.identite.nom + " — " + t("specialite");
      if (etait && location.hash.length > 1) { var c = D.getElementById(location.hash.slice(1)); if (c) c.scrollIntoView(); }
    }
  }
  addEventListener("hashchange", function () { route(); lier(); });

  /* ---------- Interactions et mouvement ---------- */
  var io = null;
  function compter(n) {
    var v = parseFloat(n.dataset.n), t0 = performance.now();
    (function f(now) { var p = Math.min(1, (now - t0) / 1100), k = 1 - Math.pow(1 - p, 3); n.textContent = nombre(v * k); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  function lier() {
    var els = D.querySelectorAll(".rv,h2,.wipe");
    if (io) io.disconnect();
    if ("IntersectionObserver" in window && !reduce) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (!x.isIntersecting) return;
          x.target.classList.add("in"); io.unobserve(x.target);
          var n = x.target.querySelector && x.target.querySelector(".v[data-n]"); if (n) compter(n);
        });
      }, { threshold: .15 });
      els.forEach(function (x) { if (!x.classList.contains("in")) io.observe(x); });
    } else els.forEach(function (x) { x.classList.add("in"); });

    var vid = $("demo");
    if (vid && !reduce && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause(); }); }, { threshold: .4 }).observe(vid);
    }
    if (!reduce) D.querySelectorAll(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (ev) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (ev.clientX - r.left) + "px"); c.style.setProperty("--my", (ev.clientY - r.top) + "px"); });
    });
    var cp = $("copier");
    if (cp) cp.onclick = function () {
      var fin = function () { cp.textContent = t("copie"); setTimeout(function () { cp.textContent = t("copier"); }, 1600); };
      try { navigator.clipboard.writeText(P.identite.email).then(fin, function () {}); } catch (err) {}
    };
    defile();
  }
  D.addEventListener("click", function (ev) {
    var l = ev.target.closest && ev.target.closest(".langue button");
    if (l) { LANG = l.dataset.l; try { localStorage.setItem("lang", LANG); } catch (err) {} rendre(); return; }
    var z = ev.target.closest && ev.target.closest("[data-zoom]");
    if (z) { $("visionneuse-img").src = z.dataset.zoom; $("visionneuse-img").alt = z.dataset.leg; $("visionneuse-leg").textContent = z.dataset.leg; if ($("visionneuse").showModal) $("visionneuse").showModal(); return; }
    var b = ev.target.closest && ev.target.closest("[data-3d]");
    if (b) {
      var st = b.parentNode, lbl = D.createElement("span"); lbl.className = "mono"; lbl.textContent = t("chargement3d"); st.replaceChild(lbl, b);
      import("./vendor/viewer3d.js").then(function (mod) {
        mod.monterModele3D(st, lbl, st.dataset.src, { rotation: Number(st.dataset.rot), dracoPath: "vendor/draco/", textes: { chargement: t("chargement3d"), erreur: t("erreur3d"), indispo: t("indispo3d") } });
      }).catch(function () { lbl.textContent = t("erreur3d"); });
    }
  });
  $("fermer").addEventListener("click", function () { $("visionneuse").close(); });
  $("visionneuse").addEventListener("click", function (ev) { if (ev.target === this) this.close(); });

  /* Effets liés au scroll : photo du hero, ligne de balayage, grille de fond, section active du menu */
  var tick = false, sy = 0;
  function defile() {
    sy = window.scrollY || 0;
    if (!reduce) {
      var ph = $("hero-photo"), vis = $("visual");
      if (ph && vis) {
        var hh = vis.offsetHeight || 1, k = Math.min(1, sy / (hh * 1.4));
        ph.style.transform = "translateY(" + (-k * 10).toFixed(2) + "%) scale(" + (1 + k * .08).toFixed(3) + ")";
        vis.style.setProperty("--scan", (k * (hh - 30)).toFixed(0) + "px");
        vis.style.transform = "translateY(" + (sy * .06).toFixed(1) + "px)";
      }
      D.documentElement.style.setProperty("--gy", (sy * .25).toFixed(1) + "px");
    }
    var act = null;
    D.querySelectorAll("#accueil section[id]").forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * .4) act = s.id; });
    D.querySelectorAll(".nav-links a").forEach(function (a) { a.classList.toggle("actif", a.getAttribute("href") === "#" + act); });
  }
  addEventListener("scroll", function () { if (tick) return; tick = true; requestAnimationFrame(function () { defile(); tick = false; }); }, { passive: true });

  /* Particules : points reliés qui dérivent, et qui défilent avec la page à des vitesses différentes (profondeur) */
  (function () {
    var c = $("particles"), x = c.getContext("2d"), W = 0, H = 0, pts = [], actif = true;
    function taille() {
      var dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(24, Math.min(80, Math.round(W * H / 17000)));
      while (pts.length < n) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.4 + .5, z: .08 + Math.random() * .4 });
      pts.length = n;
      if (reduce) image();
    }
    function image() {
      x.clearRect(0, 0, W, H);
      var HH = H + 40, pos = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; }
        var y = (((p.y - sy * p.z) % HH) + HH) % HH - 20;
        pos.push(y);
        x.fillStyle = "rgba(120,140,255," + (.35 + p.z).toFixed(2) + ")"; x.beginPath(); x.arc(p.x, y, p.r, 0, 7); x.fill();
        for (var j = 0; j < i; j++) {
          var q = pts[j], dx = p.x - q.x, dy = y - pos[j], d = dx * dx + dy * dy;
          if (d < 15000) { x.strokeStyle = "rgba(63,88,255," + (.3 * (1 - d / 15000)).toFixed(3) + ")"; x.lineWidth = 1; x.beginPath(); x.moveTo(p.x, y); x.lineTo(q.x, pos[j]); x.stroke(); }
        }
      }
    }
    function boucle() { image(); if (actif && !reduce) requestAnimationFrame(boucle); }
    taille(); addEventListener("resize", taille);
    D.addEventListener("visibilitychange", function () { var etait = actif; actif = !D.hidden; if (actif && !etait && !reduce) requestAnimationFrame(boucle); });
    boucle();
  })();

  /* Sphère filaire du bloc contact */
  (function () {
    var cv = $("sphere"); if (!cv) return;
    var cx = cv.getContext("2d"), R = 250, a = 0;
    function dessin() {
      cx.clearRect(0, 0, 600, 600); cx.lineWidth = 1.4; cx.strokeStyle = "rgba(63,88,255,.85)";
      cx.beginPath(); cx.arc(300, 300, R, 0, 7); cx.stroke();
      for (var i = 0; i < 8; i++) { var w = Math.abs(Math.cos(a + i * Math.PI / 8)) * R; cx.beginPath(); cx.ellipse(300, 300, Math.max(w, .5), R, 0, 0, 7); cx.stroke(); }
      for (var j = 1; j < 6; j++) { var y = -R + j * (2 * R / 6), r = Math.sqrt(R * R - y * y); cx.beginPath(); cx.ellipse(300, 300 + y, r, r * .16, 0, 0, 7); cx.stroke(); }
    }
    dessin();
    if (!reduce) (function tour() { a += .004; dessin(); requestAnimationFrame(tour); })();
  })();

  rendre();
})();
