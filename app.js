/* Construit la page à partir de contenu.js. Pas besoin de modifier ce fichier pour changer le contenu. */
(function () {
  "use strict";
  var P = window.PORTFOLIO;
  if (!P) { document.body.insertAdjacentHTML("afterbegin", "<p style='padding:16px;color:#c00'>Erreur dans contenu.js : vérifie les virgules et les guillemets autour de la dernière modification.</p>"); return; }
  var ID = P.identite || {};
  var EDITION = location.hash === "#edition";

  /* ---------- Petit utilitaire pour créer des éléments ---------- */
  function el(tag, attrs, enfants) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (enfants || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function $(id) { return document.getElementById(id); }
  function slug(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""); }
  function badge(statut) { return statut ? el("span", { class: "badge " + slug(statut), text: statut }) : null; }
  function tags(liste) { return (liste && liste.length) ? el("ul", { class: "tags" }, liste.map(function (t) { return el("li", { text: t }); })) : null; }
  function puces(liste) { return (liste && liste.length) ? el("ul", { class: "puces" }, liste.map(function (t) { return el("li", { text: t }); })) : null; }
  function liens(liste) {
    if (!liste || !liste.length) return null;
    return el("div", { class: "liens" }, liste.map(function (l) { return el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.texte + " ↗" }); }));
  }

  /* ---------- Médias : image, vidéo, YouTube, modèle 3D ---------- */
  var modelViewerCharge = false;
  function chargerModelViewer() {
    if (modelViewerCharge) return; modelViewerCharge = true;
    var s = document.createElement("script");
    s.type = "module";
    s.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }
  function media(m) {
    var cadre = el("div", { class: "cadre" });
    var etiquette = { image: null, video: "Vidéo", youtube: "Vidéo", modele3d: "3D · fais tourner" }[m.type];
    if (m.type === "image") {
      var btn = el("button", { class: "zoom", type: "button", "aria-label": "Agrandir : " + (m.legende || "image") }, [
        el("img", { src: m.src, alt: m.legende || "", loading: "lazy" })
      ]);
      btn.addEventListener("click", function () { ouvrir(m.src, m.legende); });
      cadre.appendChild(btn);
    } else if (m.type === "video") {
      cadre.appendChild(el("video", { src: m.src, poster: m.poster, controls: "", preload: "metadata", playsinline: "" }));
      etiquette = null;
    } else if (m.type === "youtube") {
      cadre.appendChild(el("iframe", {
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(m.id),
        title: m.legende || "Vidéo YouTube", loading: "lazy",
        allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen", allowfullscreen: ""
      }));
      etiquette = null;
    } else if (m.type === "modele3d") {
      chargerModelViewer();
      cadre.appendChild(el("model-viewer", {
        src: m.src, poster: m.poster, alt: m.legende || "Modèle 3D",
        "camera-controls": "", "auto-rotate": "", "shadow-intensity": "1", "interaction-prompt": "none", loading: "lazy"
      }));
    } else return null;
    if (etiquette) cadre.appendChild(el("span", { class: "type", text: etiquette }));
    return el("figure", { class: "media" }, [cadre, m.legende ? el("figcaption", { text: m.legende }) : null]);
  }
  function galerie(liste, chemin) {
    var ok = (liste || []).map(media).filter(Boolean);
    if (!ok.length) {
      return EDITION ? el("div", { class: "emplacement", text: "Emplacement médias → contenu.js, " + chemin + ".medias : ajoute une image, une vidéo ou un modèle 3D (exemples en haut du fichier)." }) : null;
    }
    return el("div", { class: "medias" + (ok.length > 1 ? " multi" : "") }, ok);
  }

  /* ---------- Visionneuse ---------- */
  var dlg = $("visionneuse");
  function ouvrir(src, leg) {
    $("visionneuse-img").src = src; $("visionneuse-img").alt = leg || "";
    $("visionneuse-leg").textContent = leg || "";
    if (dlg.showModal) dlg.showModal(); else window.open(src, "_blank");
  }
  $("fermer").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  /* ---------- Hero ---------- */
  var nomComplet = [ID.prenom, ID.nom].filter(Boolean).join(" ");
  document.title = nomComplet + " — Robotique";
  $("nav-nom").textContent = nomComplet;
  $("h-ecole").textContent = ID.ecole || "";
  var h1 = $("h-nom"); h1.textContent = ID.prenom || "";
  if (ID.nom) h1.appendChild(el("span", { class: "nom-fam", text: ID.nom }));
  $("h-titre").textContent = ID.titre || "";
  $("h-accroche").textContent = ID.accroche || "";
  $("h-dispo").textContent = ID.disponibilite || "";
  var act = $("h-actions");
  act.appendChild(el("a", { class: "btn plein", href: "#phare", text: "Voir S.T.A.R." }));
  if (ID.cv) act.appendChild(el("a", { class: "btn", href: ID.cv, target: "_blank", rel: "noopener", text: "Télécharger mon CV" }));
  if (ID.github) act.appendChild(el("a", { class: "btn", href: ID.github, target: "_blank", rel: "noopener", text: "GitHub ↗" }));
  if (ID.linkedin) act.appendChild(el("a", { class: "btn", href: ID.linkedin, target: "_blank", rel: "noopener", text: "LinkedIn ↗" }));

  /* ---------- Projet phare ---------- */
  var projets = P.projets || [];
  var iPhare = projets.findIndex(function (p) { return p.phare; });
  var phare = projets[iPhare];
  var secPhare = $("phare");
  if (!phare) { secPhare.remove(); document.querySelector('.nav a[href="#phare"]').remove(); }
  else {
    var chemin = "projets[" + iPhare + "]";
    var w = el("div", { class: "wrap" });
    w.appendChild(el("p", { class: "eyebrow", text: "Projet phare · " + (phare.periode || "") }));
    w.appendChild(el("div", { class: "phare-tete" }, [
      el("div", null, [el("h2", { id: "phare-titre", text: phare.titre }), phare.sousTitre ? el("p", { class: "sous", text: phare.sousTitre }) : null]),
      badge(phare.statut)
    ]));
    w.appendChild(el("p", { class: "phare-resume", text: phare.resume || "" }));

    var g = galerie(phare.medias, chemin);
    if (g) { w.appendChild(el("p", { class: "cote", text: "Images et vidéos" })); w.appendChild(g); }

    if (phare.chaine && phare.chaine.length) {
      w.appendChild(el("p", { class: "cote", text: "Chaîne de traitement" }));
      w.appendChild(el("ol", { class: "chaine" }, phare.chaine.map(function (c) {
        return el("li", null, [el("b", { text: c.etape }), el("span", { text: c.detail })]);
      })));
    }
    if (phare.versions && phare.versions.length) {
      w.appendChild(el("p", { class: "cote", text: "Versions" }));
      w.appendChild(el("div", { class: "versions" }, phare.versions.map(function (v) {
        return el("article", { class: "version" }, [
          el("div", { class: "version-tete" }, [el("h3", { text: v.nom }), badge(v.statut)]),
          puces(v.points)
        ]);
      })));
    }
    if (phare.objectifs && phare.objectifs.length) {
      w.appendChild(el("p", { class: "cote", text: "Objectifs" }));
      w.appendChild(el("div", { class: "objectifs-wrap" }, [
        el("ol", { class: "objectifs" }, phare.objectifs.map(function (o) { return el("li", { text: o }); }))
      ]));
    }
    w.appendChild(el("div", { class: "pied-phare" }, [tags(phare.tags), liens(phare.liens)]));
    secPhare.appendChild(w);
  }

  /* ---------- Autres projets ---------- */
  var liste = $("liste-projets");
  projets.forEach(function (p, i) {
    if (p.phare) return;
    liste.appendChild(el("article", { class: "projet", id: p.id || null }, [
      galerie(p.medias, "projets[" + i + "]"),
      el("div", { class: "projet-meta" }, [el("span", { text: p.periode || "" }), badge(p.statut)]),
      el("h3", { text: p.titre }),
      p.resume ? el("p", { text: p.resume }) : null,
      puces(p.points),
      liens(p.liens),
      tags(p.tags)
    ]));
  });
  if (!liste.children.length) $("projets").remove();

  /* ---------- Compétences ---------- */
  var comp = $("liste-comp");
  (P.competences || []).forEach(function (c) {
    comp.appendChild(el("div", { class: "comp" }, [el("h3", { text: c.domaine }), el("ul", null, c.items.map(function (t) { return el("li", { text: t }); }))]));
  });
  if (P.divers && P.divers.length) {
    comp.parentNode.appendChild(el("p", { class: "divers mono", text: "Divers · " + P.divers.join(" · ") }));
  }

  /* ---------- Parcours ---------- */
  var parc = $("liste-parcours");
  (P.parcours || []).forEach(function (e) {
    parc.appendChild(el("li", null, [
      el("span", { class: "periode", text: e.periode }),
      el("div", null, [
        el("h3", { text: e.titre }),
        e.lieu ? el("span", { class: "lieu", text: e.lieu }) : null,
        e.detail ? el("p", { class: "detail", text: e.detail }) : null
      ])
    ]));
  });

  /* ---------- Contact ---------- */
  var ci = $("contact-in");
  if (ID.email) {
    var b = el("button", { class: "copier", type: "button", text: "Copier l'adresse" });
    b.addEventListener("click", function () {
      var fini = function () { b.textContent = "Adresse copiée"; setTimeout(function () { b.textContent = "Copier l'adresse"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(ID.email).then(fini, function () { selectionner(); });
      else selectionner();
    });
    var val = el("a", { class: "val", href: "mailto:" + ID.email, text: ID.email });
    function selectionner() { var r = document.createRange(); r.selectNodeContents(val); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    ci.appendChild(el("div", { class: "carte-contact" }, [el("span", { class: "lbl", text: "E-mail" }), val, b]));
  }
  [["GitHub", ID.github], ["LinkedIn", ID.linkedin]].forEach(function (x) {
    if (!x[1]) return;
    ci.appendChild(el("div", { class: "carte-contact" }, [
      el("span", { class: "lbl", text: x[0] }),
      el("a", { class: "val", href: x[1], target: "_blank", rel: "noopener", text: x[1].replace(/^https?:\/\/(www\.)?/, "") })
    ]));
  });
  if (phare && phare.liens && phare.liens[0]) {
    ci.appendChild(el("div", { class: "carte-contact" }, [
      el("span", { class: "lbl", text: phare.titre }),
      el("a", { class: "val", href: phare.liens[0].url, target: "_blank", rel: "noopener", text: phare.liens[0].url.replace(/^https?:\/\/(www\.)?/, "") })
    ]));
  }

  /* ---------- Cartouche ---------- */
  function cell(k, v, cls) { return el("td", { class: cls || null }, [el("span", { class: "k", text: k }), typeof v === "string" ? document.createTextNode(v) : v]); }
  $("cartouche").appendChild(el("tbody", null, [
    el("tr", null, [
      cell("Titre", el("span", { class: "titre-c", text: "Portfolio" }), "large"),
      cell("Auteur", nomComplet),
      cell("Établissement", ID.ecole || ""),
      cell("Révision", P.miseAJour || ""),
      cell("Feuille", "1 / 1")
    ])
  ]));

  /* ---------- Viseur : simulation de suivi ---------- */
  var cv = $("viseur"), ctx = cv.getContext("2d");
  var W = cv.width, H = cv.height;
  var css = {};
  function lireCouleurs() {
    var s = getComputedStyle(document.documentElement);
    ["--encre", "--gris", "--trait", "--accent", "--surface", "--ambre"].forEach(function (k) { css[k] = s.getPropertyValue(k).trim(); });
  }
  lireCouleurs();
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { lireCouleurs(); if (!anime) dessiner(0); });

  var cible = { x: W / 2, y: H / 2 }, vis = { x: W / 2, y: H / 2, vx: 0, vy: 0 }, mesure = { x: W / 2, y: H / 2 };
  var t0 = performance.now(), dernier = t0, anime = !matchMedia("(prefers-reduced-motion: reduce)").matches;

  function trajectoire(t) {
    return {
      x: W / 2 + Math.sin(t * 0.37) * W * 0.34 + Math.sin(t * 1.3) * 18,
      y: H * 0.46 + Math.sin(t * 0.61 + 1) * H * 0.26 + Math.cos(t * 1.7) * 10
    };
  }
  function drone(x, y, couleur) {
    ctx.strokeStyle = couleur; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 9, y - 9); ctx.lineTo(x + 9, y + 9); ctx.moveTo(x + 9, y - 9); ctx.lineTo(x - 9, y + 9); ctx.stroke();
    [[-9, -9], [9, -9], [-9, 9], [9, 9]].forEach(function (d) { ctx.beginPath(); ctx.arc(x + d[0], y + d[1], 5, 0, 7); ctx.stroke(); });
  }
  function dessiner(t) {
    ctx.clearRect(0, 0, W, H);
    // grille et graduations d'azimut
    ctx.strokeStyle = css["--trait"]; ctx.lineWidth = 1;
    for (var gx = 0; gx <= W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, H); ctx.stroke(); }
    for (var gy = 0; gy <= H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy + .5); ctx.lineTo(W, gy + .5); ctx.stroke(); }
    ctx.fillStyle = css["--gris"]; ctx.font = "500 11px 'IBM Plex Mono', monospace";
    for (var a = -60; a <= 60; a += 20) { var px = W / 2 + a / 60 * (W / 2 - 20); ctx.fillText((a > 0 ? "+" : "") + a + "°", px - 12, H - 10); }
    // cible + boîte de détection
    drone(cible.x, cible.y, css["--encre"]);
    var bw = 52, bh = 40;
    ctx.strokeStyle = css["--ambre"]; ctx.lineWidth = 1.5;
    ctx.strokeRect(mesure.x - bw / 2, mesure.y - bh / 2, bw, bh);
    ctx.fillStyle = css["--ambre"]; ctx.fillText("drone", mesure.x - bw / 2, mesure.y - bh / 2 - 6);
    // trace de la consigne
    ctx.strokeStyle = css["--accent"]; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(vis.x, vis.y, 30, 0, 7); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vis.x - 46, vis.y); ctx.lineTo(vis.x - 14, vis.y); ctx.moveTo(vis.x + 14, vis.y); ctx.lineTo(vis.x + 46, vis.y);
    ctx.moveTo(vis.x, vis.y - 46); ctx.lineTo(vis.x, vis.y - 14); ctx.moveTo(vis.x, vis.y + 14); ctx.lineTo(vis.x, vis.y + 46);
    ctx.stroke();
    ctx.fillStyle = css["--accent"]; ctx.beginPath(); ctx.arc(vis.x, vis.y, 2.5, 0, 7); ctx.fill();
    // ligne d'erreur
    ctx.setLineDash([3, 4]); ctx.strokeStyle = css["--gris"]; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(vis.x, vis.y); ctx.lineTo(mesure.x, mesure.y); ctx.stroke(); ctx.setLineDash([]);
  }
  var cAz = $("v-az"), cEl = $("v-el"), cErr = $("v-err"), cFps = $("v-fps"), compte = 0, fpsT = t0;
  function majTexte() {
    var az = (vis.x - W / 2) / (W / 2 - 20) * 60;
    var site = (1 - vis.y / H) * 45;
    var err = Math.hypot(mesure.x - vis.x, mesure.y - vis.y);
    cAz.textContent = (az >= 0 ? "+" : "") + az.toFixed(1) + "°";
    cEl.textContent = site.toFixed(1) + "°";
    cErr.textContent = Math.round(err) + " px";
  }
  function pas(now) {
    var dt = Math.min(0.05, (now - dernier) / 1000); dernier = now;
    var t = (now - t0) / 1000;
    var p = trajectoire(t); cible.x = p.x; cible.y = p.y;
    // mesure bruitée puis filtrée (comme une détection image par image)
    mesure.x += (cible.x + (Math.random() - .5) * 6 - mesure.x) * 0.5;
    mesure.y += (cible.y + (Math.random() - .5) * 6 - mesure.y) * 0.5;
    // asservissement type PD sur la consigne
    var kp = 38, kd = 10;
    vis.vx += (kp * (mesure.x - vis.x) - kd * vis.vx) * dt;
    vis.vy += (kp * (mesure.y - vis.y) - kd * vis.vy) * dt;
    vis.x += vis.vx * dt; vis.y += vis.vy * dt;
    dessiner(t); majTexte();
    compte++; if (now - fpsT > 1000) { cFps.textContent = "CAM 0 · " + compte + " IPS"; compte = 0; fpsT = now; }
    if (anime && visible) requestAnimationFrame(pas);
  }
  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      var v = e[0].isIntersecting;
      if (v && !visible && anime) { visible = true; dernier = performance.now(); requestAnimationFrame(pas); }
      visible = v;
    }).observe(cv);
  }
  if (anime) requestAnimationFrame(pas);
  else {
    // mouvement réduit : une image fixe, légèrement en retard sur la cible
    var p = trajectoire(2.2); cible.x = mesure.x = p.x; cible.y = mesure.y = p.y;
    vis.x = p.x - 22; vis.y = p.y + 14; dessiner(0); majTexte();
  }
})();
