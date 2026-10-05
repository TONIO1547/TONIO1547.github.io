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
  function url(u) { return u ? encodeURI(u) : u; }
  function media(m) {
    var cadre = el("div", { class: "cadre" });
    var etiquette = { image: null, video: "Vidéo", youtube: "Vidéo", modele3d: "3D · fais tourner" }[m.type];
    if (m.type === "image") {
      var btn = el("button", { class: "zoom", type: "button", "aria-label": "Agrandir : " + (m.legende || "image") }, [
        el("img", { src: url(m.src), alt: m.legende || "", loading: "lazy" })
      ]);
      btn.addEventListener("click", function () { ouvrir(url(m.src), m.legende); });
      cadre.appendChild(btn);
    } else if (m.type === "video") {
      cadre.appendChild(el("video", { src: url(m.src), poster: url(m.poster), controls: "", preload: "metadata", playsinline: "" }));
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
        src: url(m.src), poster: url(m.poster), alt: m.legende || "Modèle 3D",
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
    return el("div", { class: "medias" + (ok.length === 2 ? " deux" : ok.length > 2 ? " multi" : "") }, ok);
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
  if (ID.photo) $("haut").appendChild(el("img", { class: "photo", src: url(ID.photo), alt: nomComplet }));
  $("h-accroche").textContent = ID.accroche || "";
  $("h-dispo").textContent = ID.disponibilite || "";
  var act = $("h-actions");
  act.appendChild(el("a", { class: "btn plein", href: "#phare", text: "Voir S.T.A.R." }));
  if (ID.cv) act.appendChild(el("a", { class: "btn", href: url(ID.cv), target: "_blank", rel: "noopener", text: "Télécharger mon CV" }));
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
      el("div", null, [
        phare.logo
          ? el("h2", { id: "phare-titre", class: "logo-titre" }, [el("img", { src: url(phare.logo), alt: phare.titre })])
          : el("h2", { id: "phare-titre", text: phare.titre }),
        phare.sousTitre ? el("p", { class: "sous", text: phare.sousTitre }) : null
      ]),
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

})();
