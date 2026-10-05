/* Construit la page à partir de contenu.js. Pas besoin de modifier ce fichier pour changer le contenu. */
(function () {
  "use strict";
  var P = window.PORTFOLIO;
  if (!P) return; // l'erreur de contenu.js est déjà affichée en haut de la page (voir index.html)
  /* ---------- Langue (FR / EN) ---------- */
  var LANG = (function () {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "fr" || q === "en") { try { localStorage.setItem("lang", q); } catch (e) {} return q; }
    try { var m = localStorage.getItem("lang"); if (m === "fr" || m === "en") return m; } catch (e) {}
    return /^fr/i.test(navigator.language || "fr") ? "fr" : "en";
  })();
  document.documentElement.lang = LANG;
  // Remplace partout { fr: "…", en: "…" } par le texte de la langue choisie
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
  P = resoudre(P);
  // Textes de l'interface (titres, boutons) : français → anglais
  var EN = {
    "Aller au contenu": "Skip to content", "Projets": "Projects", "Compétences": "Skills", "Parcours": "Background", "Contact": "Contact",
    "Autres projets": "Other projects", "Électronique, cartes sur mesure et premiers robots.": "Electronics, custom boards and early robots.",
    "Ce que j'ai mis en pratique sur mes projets.": "What I have put into practice in my projects.",
    "Stage, projet, question sur S.T.A.R. : écrivez-moi.": "Internship, project, question about S.T.A.R.: get in touch.",
    "Robotique": "Robotics", "Voir S.T.A.R.": "See S.T.A.R.", "Télécharger mon CV": "Download my CV",
    "Projet phare": "Flagship project", "Projet": "Project", "Images et vidéos": "Images and videos",
    "Chaîne de traitement": "Processing pipeline", "Versions": "Versions", "Objectifs": "Goals",
    "Page détaillée du projet →": "Full project page →", "Voir le projet →": "View project →",
    "Divers": "Other", "E-mail": "Email", "Copier l'adresse": "Copy address", "Adresse copiée": "Address copied",
    "Titre": "Title", "Auteur": "Author", "Établissement": "School", "Révision": "Revision", "Feuille": "Sheet", "Portfolio": "Portfolio",
    "← Retour aux projets": "← Back to projects", "Points clés": "Key points", "← Précédent": "← Previous", "Suivant →": "Next →",
    "Projet introuvable": "Project not found", "Ce projet n'existe pas ou son id a changé.": "This project does not exist or its id has changed.",
    "← Tous les projets": "← All projects", "Autres projets du portfolio": "Other projects",
    "Terminé": "Completed", "En cours": "In progress", "Prototype": "Prototype",
    "Vidéo": "Video", "3D · fais tourner": "3D · drag to rotate", "Agrandir : ": "Enlarge: ", "Fermer": "Close"
  };
  function t(fr) { return LANG === "en" ? (EN[fr] || fr) : fr; }
  [].forEach.call(document.querySelectorAll("[data-t]"), function (n) { n.textContent = t(n.textContent.trim()); });
  // Interrupteur FR / EN dans la barre du haut
  (function () {
    var bt = document.getElementById("langue");
    if (!bt) return;
    bt.setAttribute("aria-label", LANG === "en" ? "Passer le site en français" : "Switch site to English");
    [].forEach.call(bt.querySelectorAll("[data-l]"), function (s) { if (s.getAttribute("data-l") === LANG) s.className = "actif"; });
    bt.addEventListener("click", function () {
      var autre = LANG === "en" ? "fr" : "en";
      try { localStorage.setItem("lang", autre); } catch (e) {}
      var u = new URL(location.href); u.searchParams.set("lang", autre);
      location.replace(u.toString());
    });
  })();

  var ID = P.identite || {};
  var EDITION = location.hash === "#edition";
  var PAGE = document.body.getAttribute("data-page") || "accueil";
  var projets = P.projets || [];
  function lienProjet(p) { return "projet.html?id=" + encodeURIComponent(p.id || ""); }
  function paragraphes(texte, cls) {
    if (!texte) return [];
    return String(texte).trim().split(/\n\s*\n/).map(function (t) { return el("p", { class: cls || null, text: t.trim() }); });
  }

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
  function badge(statut) { return statut ? el("span", { class: "badge " + slug(statut), text: t(statut) }) : null; }
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
    var cadre = el("div", { class: "cadre cadre-" + m.type });
    var etiquette = { image: null, video: t("Vidéo"), youtube: t("Vidéo"), modele3d: t("3D · fais tourner") }[m.type];
    if (m.type === "image") {
      var btn = el("button", { class: "zoom", type: "button", "aria-label": t("Agrandir : ") + (m.legende || "image") }, [
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

  function demos(liste) {
    if (!liste || !liste.length) return null;
    return el("div", { class: "demos" }, liste.map(function (d) {
      var m = d.media ? media(d.media) : null;
      if (!d.texte && !m) return null;
      return el("div", { class: "demo" + (d.texte && m ? " cote-a-cote" : "") }, [
        d.texte ? el("div", { class: "demo-texte" }, paragraphes(d.texte)) :
          (EDITION ? el("div", { class: "emplacement", text: "Texte à écrire → contenu.js, champ texte de cette démo." }) : null),
        m
      ]);
    }));
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

  var nomComplet = [ID.prenom, ID.nom].filter(Boolean).join(" ");
  $("nav-nom").textContent = nomComplet;
  var feuille = "1 / " + (projets.length + 1);

  /* ================= ACCUEIL ================= */
  function pageAccueil() {
  document.title = nomComplet + " — " + t("Robotique");
  /* ---------- Hero ---------- */
  $("h-ecole").textContent = ID.ecole || "";
  var h1 = $("h-nom"); h1.textContent = ID.prenom || "";
  if (ID.nom) h1.appendChild(el("span", { class: "nom-fam", text: ID.nom }));
  $("h-titre").textContent = ID.titre || "";
  if (ID.photo) $("haut").appendChild(el("img", { class: "photo", src: url(ID.photo), alt: nomComplet }));
  $("h-accroche").textContent = ID.accroche || "";
  $("h-dispo").textContent = ID.disponibilite || "";
  var act = $("h-actions");
  act.appendChild(el("a", { class: "btn plein", href: "#phare", text: t("Voir S.T.A.R.") }));
  if (ID.cv) act.appendChild(el("a", { class: "btn", href: url(ID.cv), target: "_blank", rel: "noopener", text: t("Télécharger mon CV") }));
  if (ID.github) act.appendChild(el("a", { class: "btn", href: ID.github, target: "_blank", rel: "noopener", text: "GitHub ↗" }));
  if (ID.linkedin) act.appendChild(el("a", { class: "btn", href: ID.linkedin, target: "_blank", rel: "noopener", text: "LinkedIn ↗" }));

  /* ---------- Projet phare ---------- */
  var iPhare = projets.findIndex(function (p) { return p.phare; });
  var phare = projets[iPhare];
  var secPhare = $("phare");
  if (!phare) { secPhare.remove(); document.querySelector('.nav a[href="#phare"]').remove(); }
  else {
    var chemin = "projets[" + iPhare + "]";
    var w = el("div", { class: "wrap" });
    w.className = "wrap phare-centre";
    w.appendChild(el("p", { class: "eyebrow", text: t("Projet phare") + (phare.periode ? " · " + phare.periode : "") }));
    w.appendChild(el("div", { class: "phare-tete" }, [
      el("div", null, [
        phare.logo
          ? el("h2", { id: "phare-titre", class: "logo-titre" }, [el("img", { src: url(phare.logo), alt: phare.titre })])
          : el("h2", { id: "phare-titre", text: phare.titre }),
        phare.sousTitre ? el("p", { class: "sous", text: phare.sousTitre }) : null
      ]),
    ]));
    w.appendChild(el("p", { class: "phare-resume", text: phare.resume || "" }));

    if (phare.objectifs && phare.objectifs.length) {
      w.appendChild(el("p", { class: "cote", text: t("Objectifs") }));
      w.appendChild(el("div", { class: "objectifs-wrap" }, [
        el("ol", { class: "objectifs" }, phare.objectifs.map(function (o) { return el("li", { text: o }); }))
      ]));
    }
    var g = galerie(phare.medias, chemin);
    if (g) { w.appendChild(el("p", { class: "cote", text: t("Images et vidéos") })); w.appendChild(g); }

    if (phare.chaine && phare.chaine.length) {
      w.appendChild(el("p", { class: "cote", text: t("Chaîne de traitement") }));
      w.appendChild(el("ol", { class: "chaine" }, phare.chaine.map(function (c) {
        return el("li", null, [el("b", { text: c.etape }), el("span", { text: c.detail })]);
      })));
    }
    if (phare.versions && phare.versions.length) {
      w.appendChild(el("p", { class: "cote", text: t("Versions") }));
      w.appendChild(el("div", { class: "versions" }, phare.versions.map(function (v) {
        return el("article", { class: "version" }, [
          el("div", { class: "version-tete" }, [el("h3", { text: v.nom }), badge(v.statut)]),
          puces(v.points),
          demos(v.demos)
        ]);
      })));
    }
    w.appendChild(el("div", { class: "pied-phare" }, [tags(phare.tags), el("div", { class: "liens" }, [
      el("a", { class: "btn plein", href: lienProjet(phare), text: t("Page détaillée du projet →") }),
      liens(phare.liens)
    ])]));
    secPhare.appendChild(w);
  }

  /* ---------- Autres projets ---------- */
  var liste = $("liste-projets");
  projets.forEach(function (p, i) {
    if (p.phare) return;
    liste.appendChild(el("article", { class: "projet", id: p.id || null }, [
      (p.medias && p.medias.length) ? galerie([p.medias[0]]) : null,
      el("div", { class: "projet-meta" }, [el("span", { text: p.periode || "" }), badge(p.statut)]),
      el("h3", null, [el("a", { class: "titre-lien", href: lienProjet(p), text: p.titre })]),
      p.resume ? el("p", { text: p.resume }) : null,
      puces(p.points),
      tags(p.tags),
      el("a", { class: "voir", href: lienProjet(p), text: t("Voir le projet →") })
    ]));
  });
  if (!liste.children.length) $("projets").remove();
  var nb = liste.children.length;
  if (nb === 3 || nb === 5 || nb === 6 || nb > 7) liste.classList.add("trois");

  /* ---------- Compétences ---------- */
  var comp = $("liste-comp");
  (P.competences || []).forEach(function (c) {
    comp.appendChild(el("div", { class: "comp" }, [el("h3", { text: c.domaine }), el("ul", null, c.items.map(function (t) { return el("li", { text: t }); }))]));
  });
  if (P.divers && P.divers.length) {
    comp.parentNode.appendChild(el("p", { class: "divers mono", text: t("Divers") + " · " + P.divers.join(" · ") }));
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
    var b = el("button", { class: "copier", type: "button", text: t("Copier l'adresse") });
    b.addEventListener("click", function () {
      var fini = function () { b.textContent = t("Adresse copiée"); setTimeout(function () { b.textContent = t("Copier l'adresse"); }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(ID.email).then(fini, function () { selectionner(); });
      else selectionner();
    });
    var val = el("a", { class: "val", href: "mailto:" + ID.email, text: ID.email });
    function selectionner() { var r = document.createRange(); r.selectNodeContents(val); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    ci.appendChild(el("div", { class: "carte-contact" }, [el("span", { class: "lbl", text: t("E-mail") }), val, b]));
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

  }

  /* ================= PAGE D'UN PROJET (projet.html?id=...) ================= */
  function pageProjet() {
    var id = new URLSearchParams(location.search).get("id");
    var idx = projets.findIndex(function (p) { return p.id === id; });
    var main = $("contenu");
    if (idx < 0) {
      document.title = t("Projet introuvable") + " — " + nomComplet;
      main.appendChild(el("section", { class: "wrap bloc" }, [
        el("h1", { class: "detail-titre", text: t("Projet introuvable") }),
        el("p", { class: "bloc-sous", text: t("Ce projet n'existe pas ou son id a changé.") }),
        el("p", null, [el("a", { class: "btn", href: "index.html#projets", text: t("← Tous les projets") })])
      ]));
      return;
    }
    var p = projets[idx], chemin = "projets[" + idx + "]";
    feuille = (idx + 2) + " / " + (projets.length + 1);
    document.title = p.titre + " — " + nomComplet;

    var tete = el("header", { class: "detail-tete wrap" + (p.phare ? " phare-centre" : "") }, [
      el("a", { class: "retour mono", href: p.phare ? "index.html#phare" : "index.html#projets", text: t("← Retour aux projets") }),
      el("p", { class: "eyebrow", text: [p.phare ? t("Projet phare") : t("Projet"), p.periode].filter(Boolean).join(" · ") }),
      el("div", { class: "phare-tete" }, [
        el("div", null, [
          p.logo ? el("h1", { class: "logo-titre" }, [el("img", { src: url(p.logo), alt: p.titre })])
                 : el("h1", { class: "detail-titre", text: p.titre }),
          p.sousTitre ? el("p", { class: "sous mono", text: p.sousTitre }) : null
        ]),
        p.phare ? null : badge(p.statut)
      ]),
      p.resume ? el("p", { class: "phare-resume", text: p.resume }) : null,
      el("div", { class: "pied-phare" }, [tags(p.tags), liens(p.liens)])
    ]);
    main.appendChild(tete);

    var corps = el("div", { class: "wrap detail-corps" });
    if (p.objectifs && p.objectifs.length) {
      corps.appendChild(el("p", { class: "cote", text: t("Objectifs") }));
      corps.appendChild(el("ol", { class: "objectifs" }, p.objectifs.map(function (o) { return el("li", { text: o }); })));
    }

    // Les médias principaux déjà montrés dans une section ne sont pas répétés en haut de la page
    var dejaVus = {};
    (p.details || []).forEach(function (d) { (d.medias || []).forEach(function (m) { if (m.src) dejaVus[m.src] = 1; }); });
    var g = galerie((p.medias || []).filter(function (m) { return !dejaVus[m.src]; }), chemin);
    if (g) corps.appendChild(g);

    // Sections libres écrites par toi (champ details)
    (p.details || []).forEach(function (sec, k) {
      var gm = galerie(sec.medias, chemin + ".details[" + k + "]");
      // Une section peut regrouper plusieurs blocs de texte (champ blocs) face à la même image
      var blocs = (sec.blocs && sec.blocs.length) ? sec.blocs : [sec];
      var gauche = [];
      blocs.forEach(function (b, n) {
        if (!b.texte && !(b.points && b.points.length)) return;
        if (sec.blocs && b.titre) gauche.push(el("h2", { text: b.titre }));
        gauche.push(el("div", { class: "detail-texte" }, paragraphes(b.texte)));
        if (b.points && b.points.length) gauche.push(puces(b.points));
      });
      if (!gauche.length && !gm) return;
      var plusieurs = !!(sec.blocs && sec.blocs.length);
      corps.appendChild(el("section", { class: "detail-section" + (gm ? " avec-media" : "") + (plusieurs ? " groupe" : "") }, [
        (!plusieurs && sec.titre) ? el("h2", { text: sec.titre }) : null,
        el("div", { class: "sec-texte" }, gauche),
        gm ? el("div", { class: "sec-media" }, [gm]) : null
      ].filter(Boolean)));
    });
    if (EDITION && !(p.details || []).some(function (d) { return d.texte; })) {
      corps.appendChild(el("div", { class: "emplacement", text: "Texte détaillé → contenu.js, " + chemin + ".details : écris tes sections (exemple en haut du fichier)." }));
    }

    var aDuTexte = (p.details || []).some(function (d) { return d.texte || (d.blocs && d.blocs.length); });
    if (p.points && p.points.length && !aDuTexte) {
      corps.appendChild(el("section", { class: "detail-section" }, [el("h2", { text: t("Points clés") }), puces(p.points)]));
    }
    if (p.chaine && p.chaine.length) {
      corps.appendChild(el("p", { class: "cote", text: t("Chaîne de traitement") }));
      corps.appendChild(el("ol", { class: "chaine" }, p.chaine.map(function (c) {
        return el("li", null, [el("b", { text: c.etape }), el("span", { text: c.detail })]);
      })));
    }
    if (p.versions && p.versions.length) {
      corps.appendChild(el("p", { class: "cote", text: t("Versions") }));
      corps.appendChild(el("div", { class: "versions" }, p.versions.map(function (v) {
        return el("article", { class: "version" }, [
          el("div", { class: "version-tete" }, [el("h3", { text: v.nom }), badge(v.statut)]),
          puces(v.points), demos(v.demos)
        ]);
      })));
    }
    // Projet précédent / suivant
    var prec = projets[(idx - 1 + projets.length) % projets.length], suiv = projets[(idx + 1) % projets.length];
    if (projets.length > 1) corps.appendChild(el("nav", { class: "suite", "aria-label": "Autres projets" }, [
      el("a", { href: lienProjet(prec) }, [el("span", { class: "k mono", text: t("← Précédent") }), el("b", { text: prec.titre })]),
      el("a", { href: lienProjet(suiv), class: "droite" }, [el("span", { class: "k mono", text: t("Suivant →") }), el("b", { text: suiv.titre })])
    ]));
    main.appendChild(corps);
  }

  if (PAGE === "projet") pageProjet(); else pageAccueil();

  /* ---------- Cartouche ---------- */
  function cell(k, v, cls) { return el("td", { class: cls || null }, [el("span", { class: "k", text: k }), typeof v === "string" ? document.createTextNode(v) : v]); }
  $("cartouche").appendChild(el("tbody", null, [
    el("tr", null, [
      cell(t("Titre"), el("span", { class: "titre-c", text: t("Portfolio") }), "large"),
      cell(t("Auteur"), nomComplet),
      cell(t("Établissement"), ID.ecole || ""),
      cell(t("Révision"), P.miseAJour || P.Update || ""),
      cell(t("Feuille"), feuille)
    ])
  ]));

})();
