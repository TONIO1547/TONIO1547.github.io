/* =====================================================================
   CONTENU DU PORTFOLIO — c'est le SEUL fichier à modifier au quotidien.
   =====================================================================

   Règles simples :
   - Le texte est entre guillemets "…". Pour mettre un guillemet dans un
     texte, écris \" (ou utilise des guillemets français « … »).
   - Chaque élément d'une liste se termine par une virgule.
   - Pour supprimer un bloc, efface-le entièrement (de { à },).
   - Après une modification sur github.com : "Commit changes", puis le site
     se met à jour tout seul en ~1 minute.

   AJOUTER UN MÉDIA à un projet (dans sa liste  medias: [ ... ] ) :
   1. Dépose le fichier dans le dossier  media/  du dépôt
      (sur github.com : ouvre le dossier media → "Add file" → "Upload files").
   2. Ajoute une ligne dans medias, selon le type :

      { type: "image",    src: "media/star-v2.jpg",  legende: "Tourelle V2 au banc" },
      { type: "video",    src: "media/suivi.mp4",    legende: "Suivi d'un drone", poster: "media/suivi.jpg" },
      { type: "youtube",  id: "dQw4w9WgXcQ",         legende: "Démo complète" },
      { type: "modele3d", src: "media/tourelle.glb", legende: "Modèle CAO (fais-le tourner)", poster: "media/tourelle.jpg" },

   Le PREMIER média de la liste sert d'image principale du projet.
   - Images : .jpg / .png / .webp — vise moins de 1 Mo (redimensionne à ~1600 px de large).
   - Vidéos : .mp4 (H.264), moins de 50 Mo. Au-delà, mets-la sur YouTube et utilise type "youtube"
     (l'id est la partie après  v=  dans le lien YouTube).
   - Modèles 3D : format .glb (voir le README pour l'export depuis SolidWorks).
   ===================================================================== */

window.PORTFOLIO = {

  /* ---------- Toi ---------- */
  identite: {
    prenom: "Antoine",
    nom: "",                       // ← ajoute ton nom de famille ici
    titre: "Étudiant ingénieur en robotique autonome",
    ecole: "Polytech Nice Sophia",
    accroche: "Je conçois des robots qui voient, décident et bougent : vision par ordinateur, électronique embarquée, cartes électroniques et CAO mécanique.",
    disponibilite: "Ouvert aux stages en robotique et systèmes embarqués",
    email: "tonio.74370@gmail.com",
    github: "https://github.com/TONIO1547",
    linkedin: "",                  // ← colle l'URL de ton profil LinkedIn si tu en as un
    cv: "",                        // ← ex. "media/CV_Antoine.pdf" après l'avoir déposé dans media/
    photo: ""                      // ← ex. "media/photo.jpg" (photo carrée de préférence)
  },

  miseAJour: "Octobre 2026",

  /* ---------- Projets ----------
     phare: true  → le projet est mis en avant en grand en haut de la page (un seul).
     statut      → "Terminé", "En cours" ou "Prototype" (change la couleur du badge). */
  projets: [
    {
      id: "star",
      phare: true,
      titre: "S.T.A.R.",
      sousTitre: "Système de Tourelle Anti-drone Robotisé",
      periode: "Projet personnel",
      statut: "En cours",
      resume: "Tourelle autonome qui détecte un drone à la caméra, le suit en temps réel et alerte le propriétaire. Projet personnel mené de bout en bout : mécanique, électronique, vision, asservissement et logiciel. Porté en parallèle comme projet d'entreprise avec le statut étudiant-entrepreneur.",

      // Chaîne de traitement, dans l'ordre réel des étapes
      chaine: [
        { etape: "Capter",   detail: "Caméra visible obturateur global + caméra thermique" },
        { etape: "Détecter", detail: "Modèle YOLO entraîné sur des drones, accéléré TensorRT" },
        { etape: "Suivre",   detail: "Filtrage de la position et prédiction de la cible" },
        { etape: "Asservir", detail: "Boucles PID pan / tilt" },
        { etape: "Orienter", detail: "Moteurs gimbal brushless sur deux axes" }
      ],

      versions: [
        {
          nom: "V1",
          statut: "Prototype",
          points: [
            "Jetson Nano, deux caméras, tourelle à servomoteurs et pointeur laser",
            "YOLOv5 avec un modèle de détection de drones converti en TensorRT",
            "Post-traitement NMS réécrit à la main et correction des sorties du modèle",
            "Réglage des PID pan / tilt avec filtre passe-bas",
            "ESP32 piloté en UDP, interface web Flask (flux caméra + commande moteurs) lancée en service systemd"
          ]
        },
        {
          nom: "V2",
          statut: "En cours",
          points: [
            "Tourelle fixe pensée pour une installation sur toit, fonctionnement 24 h/24",
            "Jetson Orin NX 16 Go",
            "Caméra ELP AR0234 à obturateur global (USB 3.0) + objectif 8 mm, caméra thermique",
            "Moteurs gimbal CubeMars GL60-II (azimut) et GL40-II (site), pilotés par cartes FOC MKS",
            "Application d'alerte : flux des caméras et rapport d'incident en direct"
          ]
        }
      ],

      objectifs: [
        "Suivi stable d'un drone à 100 m, jusqu'à 100 km/h",
        "Application d'alerte avec flux vidéo et rapport d'incident généré",
        "Mise en service chez de premiers particuliers"
      ],

      tags: ["Jetson", "YOLO", "TensorRT", "Python", "PID", "BLDC / FOC", "ESP32", "SolidWorks"],
      liens: [
        { texte: "Site du projet", url: "https://www.star-ai.fr" }
        // { texte: "Code sur GitHub", url: "https://github.com/TONIO1547/STAR" },  ← à activer si tu rends le dépôt public
      ],
      medias: [
        // Ajoute ici photos, vidéos de suivi, modèle 3D de la tourelle…
      ]
    },

    {
      id: "encodeur",
      titre: "Carte encodeur magnétique AS5047P",
      periode: "",
      statut: "Terminé",
      resume: "Carte de lecture de position angulaire pour moteur, dessinée sous KiCad, avec une attention particulière portée à la robustesse du signal.",
      points: [
        "Liaison SPI avec résistances série sur les lignes",
        "Régulation par LDO MCP1700",
        "Protection TVS et filtrage CEM par ferrite"
      ],
      tags: ["KiCad", "SPI", "PCB"],
      liens: [],
      medias: []
    },

    {
      id: "esp32s3",
      titre: "Carte de développement ESP32-S3",
      periode: "",
      statut: "Terminé",
      resume: "Carte microcontrôleur sur mesure, alimentée en USB-C, conçue de la schématique au routage.",
      points: [
        "Convertisseur buck TPS54302 et LDO AZ1117",
        "USB-C avec résistances CC pour demander 3 A",
        "Pilotage de LED adressables WS2812B"
      ],
      tags: ["KiCad", "ESP32-S3", "Alimentation", "USB-C"],
      liens: [],
      medias: []
    },

    {
      id: "pixy2",
      titre: "Tourelle pan-tilt avec Pixy2",
      periode: "Avant S.T.A.R.",
      statut: "Terminé",
      resume: "Premier système de suivi : une caméra Pixy2 repère un objet par sa couleur et un ESP32 oriente la tourelle pour le garder au centre. Le point de départ de S.T.A.R.",
      points: [
        "Détection par blobs de couleur",
        "Asservissement des servos en PD / PID sur ESP32"
      ],
      tags: ["ESP32", "Pixy2", "Servos", "PID"],
      liens: [],
      medias: []
    },

    {
      id: "sumo",
      titre: "Robot sumo et suiveur de ligne",
      periode: "Terminale SI",
      statut: "Terminé",
      resume: "Robot sur Arduino Uno conçu en équipe de trois en Sciences de l'ingénieur, capable de suivre une ligne et de combattre en sumo.",
      points: [
        "Rôle de chef de projet : répartition et suivi des tâches",
        "Capteurs de ligne et logique de combat sur Arduino"
      ],
      tags: ["Arduino", "Travail en équipe"],
      liens: [],
      medias: []
    }
  ],

  /* ---------- Compétences ---------- */
  competences: [
    { domaine: "Vision & IA",          items: ["YOLO (entraînement, fine-tuning)", "TensorRT", "NMS et post-traitement", "Métriques mAP / IoU"] },
    { domaine: "Systèmes embarqués",   items: ["ESP32 / ESP8266", "Arduino", "NVIDIA Jetson", "SPI, UDP", "Linux, systemd"] },
    { domaine: "Électronique & PCB",   items: ["KiCad", "Alimentations buck / LDO", "USB-C Power Delivery", "Protections TVS, CEM"] },
    { domaine: "Asservissement",       items: ["PID / PD", "Moteurs brushless, commande FOC", "Filtrage", "Servomoteurs"] },
    { domaine: "Mécanique & CAO",      items: ["SolidWorks", "Conception de tourelle 2 axes", "Prototypage"] },
    { domaine: "Logiciel",             items: ["Python", "C / C++ (Arduino, ESP32)", "Flask", "HTML / JavaScript", "Git"] }
  ],

  /* ---------- Parcours (du plus récent au plus ancien) ---------- */
  parcours: [
    { periode: "2025 → 2028", titre: "Cycle ingénieur Robotique, parcours robotique autonome", lieu: "Polytech Nice Sophia", detail: "Actuellement en 4e année (Rob4)." },
    { periode: "Depuis juin 2026", titre: "Statut national étudiant-entrepreneur", lieu: "Pépite Méditerranée", detail: "Accompagnement pour le projet d'entreprise S.T.A.R." },
    { periode: "2023 → 2025", titre: "Parcours des écoles d'ingénieurs Polytech (PEIP)", lieu: "Polytech Annecy-Chambéry", detail: "" },
    { periode: "Lycée", titre: "Baccalauréat, spécialité Sciences de l'ingénieur", lieu: "", detail: "Projets en équipe de trois, souvent en tant que chef de projet." }
  ],

  divers: ["Permis B"]
};
