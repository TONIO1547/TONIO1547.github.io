/* =====================================================================
   CONTENU DU PORTFOLIO — c'est le SEUL fichier à modifier au quotidien.
   =====================================================================

   FRANÇAIS / ANGLAIS
   Chaque texte est écrit dans les deux langues, comme ceci :
       titre: { fr: "Carte encodeur", en: "Encoder board" },
   Le bouton FR / EN en haut du site choisit la langue affichée.
   Si tu écris un texte simple ("…") au lieu de { fr, en }, il s'affiche
   tel quel dans les deux langues (pratique pour les noms propres).
   Si la traduction anglaise est vide, c'est le texte français qui s'affiche.

   Règles simples :
   - Le texte est entre guillemets "…". Pour un guillemet dans un texte,
     utilise « … ». Les apostrophes ' ne posent aucun problème.
   - Pour un LONG texte, utilise des accents graves `…` (AltGr + 7) au lieu
     des guillemets : tu peux aller à la ligne et mettre des "guillemets".
     Laisse une ligne vide pour commencer un nouveau paragraphe.
   - Chaque élément d'une liste se termine par une virgule (sauf le dernier).
   - Ne supprime jamais le  };  de la dernière ligne du fichier.
   - Si tu fais une faute de frappe, une barre rouge en haut du site
     indique la ligne en cause.
   - Après "Commit changes" sur github.com, le site se met à jour en ~1 min
     (recharge avec Ctrl + F5 si tu ne vois pas le changement).

   AJOUTER UN MÉDIA (dans une liste  medias: [ ... ] ) :
   1. Dépose le fichier dans le dossier  media/  du dépôt
      (sur github.com : ouvre le dossier media → "Add file" → "Upload files").
   2. Ajoute une ligne, selon le type :

      { type: "image",    src: "media/photo.jpg",    legende: { fr: "…", en: "…" } },
      { type: "video",    src: "media/suivi.mp4",    legende: { fr: "…", en: "…" }, poster: "media/suivi.jpg" },
      { type: "youtube",  id: "ID_DE_LA_VIDEO",      legende: { fr: "…", en: "…" } },
      { type: "modele3d", src: "media/tourelle.glb", legende: { fr: "…", en: "…" } },

   Dans  medias  d'un projet, le PREMIER média est l'image principale :
   c'est aussi lui qui s'affiche sur la carte du projet en page d'accueil.

   PAGE DÉTAILLÉE D'UN PROJET (clic sur son titre en page d'accueil) :
   son texte est dans  details: [ ... ] , découpé en sections. Une section
   peut avoir un titre, un texte, des points et ses propres médias :

      { titre: { fr: "Routage", en: "Layout" },
        texte: { fr: `Mon texte…`, en: `My text…` },
        medias: [ { type: "image", src: "media/routage.png", legende: { fr: "…", en: "…" } } ] },

   Une section dont le texte est vide n'apparaît pas.
   ===================================================================== */

window.PORTFOLIO = {

  /* ---------- Toi ---------- */
  identite: {
    prenom: "Antoine",
    nom: "Pelissier",
    titre: { fr: "Étudiant ingénieur en robotique autonome", en: "Autonomous robotics engineering student" },
    ecole: "Polytech Nice Sophia",
    accroche: {
      fr: "Je conçois des robots qui voient, décident et bougent : vision par ordinateur, électronique embarquée, cartes électroniques et CAO mécanique.",
      en: "I design robots that see, decide and move: computer vision, embedded electronics, custom PCBs and mechanical CAD."
    },
    disponibilite: { fr: "Ouvert aux stages en robotique et systèmes embarqués", en: "Open to internships in robotics and embedded systems" },
    email: "tonio.74370@gmail.com",
    github: "https://github.com/TONIO1547",
    linkedin: "https://www.linkedin.com/in/antoine-pelissier1",
    cv: "media/CV-1.pdf",          // ← tu peux mettre un CV différent par langue : { fr: "media/CV-1.pdf", en: "media/CV-en.pdf" }
    photo: "media/photo.jpg"       // ← photo affichée en haut de la page d'accueil
  },

  miseAJour: "10/2026",

  /* ---------- Projets ----------
     phare: true  → le projet est mis en avant en grand en haut de la page (un seul).
     statut      → "Terminé", "En cours" ou "Prototype" (traduit automatiquement,
                   et change la couleur du badge). */
  projets: [
    {
      id: "star",
      phare: true,
      titre: "S.T.A.R.",
      sousTitre: "Sentinel Track Alert Report",
      logo: "media/pitch STAR.png",   // ← logo affiché à la place du titre (laisse "" pour afficher le texte)
      periode: { fr: "Projet personnel", en: "Personal project" },
      statut: "En cours",
      resume: {
        fr: "Tourelle autonome qui détecte un drone à la caméra, le suit en temps réel et alerte le propriétaire. Projet personnel mené de bout en bout : mécanique, électronique, vision, asservissement et logiciel. Porté en parallèle comme projet d'entreprise avec le statut étudiant-entrepreneur.",
        en: "Autonomous turret that detects a drone with its cameras, tracks it in real time and alerts the owner. A personal project built end to end: mechanics, electronics, vision, control and software. Also developed as a start-up project under the French student-entrepreneur status."
      },

      // Chaîne de traitement, dans l'ordre réel des étapes
      chaine: [
        { etape: { fr: "Capter",   en: "Sense" },  detail: { fr: "Caméra visible obturateur global + caméra thermique", en: "Global-shutter visible camera + thermal camera" } },
        { etape: { fr: "Détecter", en: "Detect" }, detail: { fr: "Modèle YOLO entraîné sur des drones, accéléré TensorRT", en: "YOLO model trained on drones, TensorRT-accelerated" } },
        { etape: { fr: "Suivre",   en: "Track" },  detail: { fr: "Filtrage de la position et prédiction de la cible", en: "Position filtering and target prediction" } },
        { etape: { fr: "Asservir", en: "Control" }, detail: { fr: "Boucles PID pan / tilt", en: "Pan / tilt PID loops" } },
        { etape: { fr: "Orienter", en: "Aim" },    detail: { fr: "Moteurs gimbal brushless sur deux axes", en: "Brushless gimbal motors on two axes" } }
      ],

      versions: [
        {
          nom: "V1",
          statut: "Prototype",
          points: [
            { fr: "Jetson Nano, deux caméras, tourelle à servomoteurs et pointeur laser", en: "Jetson Nano, two cameras, servo-driven turret and laser pointer" },
            { fr: "YOLOv5 avec un modèle de détection de drones converti en TensorRT", en: "YOLOv5 with a drone detection model converted to TensorRT" },
            { fr: "Post-traitement NMS réécrit à la main et correction des sorties du modèle", en: "Hand-written NMS post-processing and fixed model outputs" },
            { fr: "Réglage des PID pan / tilt avec filtre passe-bas", en: "Pan / tilt PID tuning with a low-pass filter" },
            { fr: "ESP32 piloté en UDP, interface web Flask (flux caméra + commande moteurs) lancée en service systemd", en: "ESP32 driven over UDP, Flask web interface (camera stream + motor control) running as a systemd service" }
          ],
          // Démonstrations de la V1 : chaque bloc = ton texte, puis la vidéo en dessous.
          demos: [
            {
              texte: {
                fr: "Premier essai de détection de drone par IA, avec un modèle YOLOv5n que j'ai fine-tuné.",
                en: "First AI drone detection test, using a YOLOv5n model I fine-tuned."
              },
              media: { type: "video", src: "media/demo detection deux cam.mp4", poster: "media/demo detection deux cam.jpg",
                       legende: { fr: "Détection du drone en direct sur les deux caméras", en: "Live drone detection on both cameras" } }
            },
            {
              texte: {
                fr: "Test de suivi pour régler le PID de manière itérative, dans le but d'obtenir le tracking le plus fluide possible.",
                en: "Tracking test used to tune the PID iteratively, aiming for the smoothest possible tracking."
              },
              media: { type: "video", src: "media/demo_tracking.mp4", poster: "media/demo_tracking.jpg",
                       legende: { fr: "La tourelle suit le drone (PID) et le pointe au laser", en: "The turret tracks the drone (PID) and points the laser at it" } }
            }
          ]
        },
        {
          nom: "V2",
          statut: "En cours",
          points: [
            { fr: "Tourelle fixe pensée pour une installation sur toit, fonctionnement 24 h/24", en: "Fixed turret designed for rooftop installation, running 24/7" },
            { fr: "Jetson Orin NX 16 Go", en: "Jetson Orin NX 16 GB" },
            { fr: "Caméra ELP AR0234 à obturateur global (USB 3.0) + objectif 8 mm, caméra thermique", en: "ELP AR0234 global-shutter camera (USB 3.0) + 8 mm lens, thermal camera" },
            { fr: "Moteurs gimbal CubeMars GL60-II (azimut) et GL40-II (site), pilotés par cartes FOC MKS", en: "CubeMars GL60-II (azimuth) and GL40-II (elevation) gimbal motors, driven by MKS FOC boards" },
            { fr: "Application d'alerte : flux des caméras et rapport d'incident en direct", en: "Alert app: camera streams and live incident report" },
            { fr: "Fusion de capteurs caméra + radar de vitesse pour une détection dans toutes les conditions", en: "Camera + speed radar sensor fusion for detection in all conditions" }
          ]
        }
      ],

      objectifs: [
        { fr: "Suivi stable d'un drone à 100 m, jusqu'à 100 km/h", en: "Stable tracking of a drone at 100 m, up to 100 km/h" },
        { fr: "Application d'alerte avec flux vidéo et rapport d'incident généré", en: "Alert app with video stream and generated incident report" },
        { fr: "Mise en service chez de premiers particuliers", en: "First installations at private homes" }
      ],

      tags: ["Jetson", "YOLO", "TensorRT", "Python", "PID", "BLDC / FOC", "ESP32", "SolidWorks"],
      liens: [
        { texte: { fr: "Site du projet", en: "Project website" }, url: "https://www.star-ai.fr" }
        // { texte: { fr: "Code sur GitHub", en: "Code on GitHub" }, url: "https://github.com/TONIO1547/STAR" },  ← à activer si tu rends le dépôt public
      ],
      // Texte de la page détaillée (une section vide n'apparaît pas)
      details: [
        { titre: { fr: "Le problème", en: "The problem" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Conception mécanique", en: "Mechanical design" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Électronique et motorisation", en: "Electronics and motors" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Vision et IA", en: "Vision and AI" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Logiciel et application", en: "Software and app" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Résultats et prochaines étapes", en: "Results and next steps" }, texte: { fr: "", en: "" } }
      ],
      medias: [
        // Médias généraux du projet (affichés après le résumé) : photos, modèle 3D de la tourelle…
      ]
    },

    {
      id: "encodeur",
      titre: { fr: "Carte encodeur magnétique AS5047P", en: "AS5047P magnetic encoder board" },
      periode: "",
      statut: "Terminé",
      resume: {
        fr: "Carte capteur qui mesure à tout instant la position angulaire d'un aimant, pour la commande FOC de moteurs brushless et le suivi de l'axe tilt de S.T.A.R. Conçue sous KiCad.",
        en: "Sensor board that measures the angular position of a magnet at all times, for FOC control of brushless motors and for monitoring the tilt axis of S.T.A.R. Designed in KiCad."
      },
      points: [
        { fr: "Liaison SPI avec résistances série sur les lignes", en: "SPI link with series resistors on the lines" },
        { fr: "Régulation par LDO MCP1700", en: "MCP1700 LDO regulation" },
        { fr: "Protection TVS et filtrage CEM par ferrite", en: "TVS protection and ferrite EMC filtering" }
      ],
      tags: ["KiCad", "SPI", "PCB", "FOC"],
      liens: [],
      // Texte de la page détaillée (une section vide n'apparaît pas)
      details: [
        {
          titre: { fr: "À quoi sert cette carte", en: "What this board does" },
          texte: {
            fr: `Cette carte permet de connaître à tout instant la position angulaire d'un aimant placé devant le capteur AS5047P.

C'est une information indispensable pour piloter un moteur brushless en commande vectorielle (FOC) : le contrôleur doit savoir précisément où se trouve le rotor pour envoyer le bon courant dans chaque phase.`,
            en: `This board measures, at any moment, the angular position of a magnet placed in front of the AS5047P sensor.

This is essential to drive a brushless motor with field-oriented control (FOC): the controller needs to know exactly where the rotor is to send the right current into each phase.`
          }
        },
        {
          titre: { fr: "Son rôle dans S.T.A.R.", en: "Its role in S.T.A.R." },
          texte: {
            fr: `Sur la tourelle, la carte mesure la position de l'axe tilt. Cette position est ainsi connue de deux manières indépendantes : par le moteur gimbal GL40 et par cet encodeur.

Croiser les deux mesures apporte une meilleure précision, et permet de détecter puis de corriger les données si l'un des capteurs se met à dériver ou à renvoyer des valeurs aberrantes.`,
            en: `On the turret, the board measures the position of the tilt axis. That position is therefore known in two independent ways: through the GL40 gimbal motor and through this encoder.

Cross-checking both measurements improves accuracy, and makes it possible to detect and correct the data if one sensor starts drifting or returning outliers.`
          }
        },
        {
          titre: { fr: "Routage", en: "PCB layout" },
          texte: {
            fr: "Bus SPI (CSN, CLK, MISO, MOSI) protégé par des résistances série, alimentation 5 V régulée en 3,3 V, LED d'alimentation et de données.",
            en: "SPI bus (CSN, CLK, MISO, MOSI) protected by series resistors, 5 V supply regulated down to 3.3 V, power and data LEDs."
          },
          medias: [
            { type: "image", src: "media/encodeur_schem.png", legende: { fr: "Routage de la carte sous KiCad", en: "Board layout in KiCad" } }
          ]
        },
        { titre: { fr: "Fabrication et tests", en: "Manufacturing and testing" }, texte: { fr: "", en: "" } }
      ],
      medias: [
        { type: "image", src: "media/encodeur.png", legende: { fr: "Rendu 3D de la carte (KiCad)", en: "3D render of the board (KiCad)" } }
      ]
    },

    {
      id: "esp32s3",
      titre: { fr: "Carte de développement ESP32-S3", en: "ESP32-S3 development board" },
      periode: "",
      statut: "Terminé",
      resume: {
        fr: "Carte microcontrôleur sur mesure, alimentée en USB-C, conçue de la schématique au routage.",
        en: "Custom microcontroller board powered over USB-C, designed from schematic to layout."
      },
      points: [
        { fr: "Convertisseur buck TPS54302 et LDO AZ1117", en: "TPS54302 buck converter and AZ1117 LDO" },
        { fr: "USB-C avec résistances CC pour demander 3 A", en: "USB-C with CC resistors to request 3 A" },
        { fr: "Pilotage de LED adressables WS2812B", en: "WS2812B addressable LED driving" }
      ],
      tags: ["KiCad", "ESP32-S3", { fr: "Alimentation", en: "Power supply" }, "USB-C"],
      liens: [],
      // Texte de la page détaillée (une section vide n'apparaît pas)
      details: [
        { titre: { fr: "Pourquoi cette carte", en: "Why this board" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Schéma et choix des composants", en: "Schematic and component choices" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Routage", en: "PCB layout" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Fabrication et tests", en: "Manufacturing and testing" }, texte: { fr: "", en: "" } }
      ],
      medias: []
    },

    {
      id: "sumo",
      titre: { fr: "Robot sumo et suiveur de ligne", en: "Sumo and line-follower robot" },
      periode: { fr: "Terminale SI", en: "High school, engineering science" },
      statut: "Terminé",
      resume: {
        fr: "Robot sur Arduino Uno conçu en équipe de trois en Sciences de l'ingénieur, capable de suivre une ligne et de combattre en sumo.",
        en: "Arduino Uno robot built by a team of three in high-school engineering science, able to follow a line and compete in sumo."
      },
      points: [
        { fr: "Rôle de chef de projet : répartition et suivi des tâches", en: "Project lead: task allocation and follow-up" },
        { fr: "Capteurs de ligne et logique de combat sur Arduino", en: "Line sensors and fight logic on Arduino" }
      ],
      tags: ["Arduino", { fr: "Travail en équipe", en: "Teamwork" }],
      liens: [],
      // Texte de la page détaillée (une section vide n'apparaît pas)
      details: [
        { titre: { fr: "Le défi", en: "The challenge" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Conception du robot", en: "Robot design" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Mon rôle dans l'équipe", en: "My role in the team" }, texte: { fr: "", en: "" } },
        { titre: { fr: "Résultat", en: "Outcome" }, texte: { fr: "", en: "" } }
      ],
      medias: []
    }
  ],

  /* ---------- Compétences ---------- */
  competences: [
    { domaine: { fr: "Vision & IA", en: "Vision & AI" },
      items: [{ fr: "YOLO (entraînement, fine-tuning)", en: "YOLO (training, fine-tuning)" }, "TensorRT", { fr: "NMS et post-traitement", en: "NMS and post-processing" }, { fr: "Métriques mAP / IoU", en: "mAP / IoU metrics" }] },
    { domaine: { fr: "Systèmes embarqués", en: "Embedded systems" },
      items: ["ESP32", "Arduino", "NVIDIA Jetson", "SPI, UDP", "Linux"] },
    { domaine: { fr: "Électronique & PCB", en: "Electronics & PCB" },
      items: ["KiCad", { fr: "Alimentations buck / LDO", en: "Buck / LDO power supplies" }, "USB-C Power Delivery", { fr: "Placement des composants", en: "Component placement" }, { fr: "Cartes de puissance", en: "Power boards" }] },
    { domaine: { fr: "Asservissement", en: "Control" },
      items: ["PID / PD", { fr: "Moteurs brushless, commande FOC", en: "Brushless motors, FOC control" }, { fr: "Filtrage", en: "Filtering" }, { fr: "Servomoteurs", en: "Servo motors" }] },
    { domaine: { fr: "Mécanique & CAO", en: "Mechanics & CAD" },
      items: ["SolidWorks", "Fusion 360", { fr: "Prototypage", en: "Prototyping" }] },
    { domaine: { fr: "Logiciel", en: "Software" },
      items: ["Python", "C / C++ (Arduino, ESP32)", "Flask", "HTML / JavaScript", "Git"] }
  ],

  /* ---------- Parcours (du plus récent au plus ancien) ---------- */
  parcours: [
    { periode: "2025 → 2028",
      titre: { fr: "Cycle ingénieur Robotique, parcours robotique autonome", en: "Engineering degree in Robotics, autonomous robotics track" },
      lieu: "Polytech Nice Sophia",
      detail: { fr: "Actuellement en 4e année (Rob4).", en: "Currently in 4th year (Rob4)." } },
    { periode: { fr: "Depuis juin 2026", en: "Since June 2026" },
      titre: { fr: "Statut national étudiant-entrepreneur", en: "French national student-entrepreneur status" },
      lieu: "Pépite Méditerranée",
      detail: { fr: "Accompagnement pour le projet d'entreprise S.T.A.R.", en: "Support programme for the S.T.A.R. start-up project." } },
    { periode: "2023 → 2025",
      titre: { fr: "Parcours des écoles d'ingénieurs Polytech (PEIP)", en: "Polytech integrated preparatory programme (PEIP)" },
      lieu: "Polytech Annecy-Chambéry",
      detail: "" },
    { periode: { fr: "Lycée", en: "High school" },
      titre: { fr: "Baccalauréat, spécialité Sciences de l'ingénieur", en: "French baccalauréat, engineering science major" },
      lieu: "",
      detail: { fr: "Projets en équipe de trois, souvent en tant que chef de projet.", en: "Team projects in groups of three, often as project lead." } }
  ],

  divers: [{ fr: "Permis B", en: "Driving licence (B)" }, { fr: "SNEE", en: "Student-entrepreneur status (SNEE)" }]
};
