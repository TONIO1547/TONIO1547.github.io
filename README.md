# Portfolio — Antoine

Site en ligne : **https://tonio1547.github.io**

## Modifier le site

Tout le contenu (textes, projets, compétences, parcours, liens, médias) est dans **`contenu.js`**.
Tu n'as pas besoin de toucher aux autres fichiers.

Depuis github.com :
1. Ouvre `contenu.js` → icône crayon (Edit).
2. Modifie, puis **Commit changes**.
3. Le site se met à jour en une minute environ (onglet **Actions** pour suivre).

Si la page affiche « Erreur dans contenu.js », il manque en général une virgule ou un guillemet dans ta dernière modification.

## Français / anglais

Le bouton **FR / EN** en haut du site change la langue. Dans `contenu.js`, chaque texte s'écrit dans les deux langues :

```js
titre: { fr: "Carte encodeur", en: "Encoder board" },
```

Un texte simple `"…"` s'affiche tel quel dans les deux langues. Si `en` est vide, le français s'affiche.
Pour envoyer directement la version anglaise à quelqu'un : https://tonio1547.github.io/?lang=en

## Page détaillée d'un projet

Chaque projet a sa propre page (clic sur son titre en page d'accueil), à l'adresse `projet.html?id=…`.
Son texte se trouve dans le champ `details` du projet, dans `contenu.js` : une liste de sections avec un titre, un texte et éventuellement des médias. Une section dont le texte est vide n'apparaît pas.

Pour un long texte, mets-le entre accents graves (`AltGr + 7`) au lieu des guillemets : tu peux aller à la ligne et écrire des "guillemets" librement. Une ligne vide = nouveau paragraphe.

Si `contenu.js` contient une faute de frappe, une barre rouge en haut du site indique la ligne en cause.

## Ajouter une photo, une vidéo ou un modèle 3D

1. Ouvre le dossier `media/` → **Add file → Upload files** → dépose ton fichier → **Commit changes**.
2. Dans `contenu.js`, ajoute une ligne dans la liste `medias: [ ]` du projet concerné :

```js
medias: [
  { type: "image",    src: "media/star-v2.jpg",  legende: "Tourelle V2 au banc" },
  { type: "video",    src: "media/suivi.mp4",    legende: "Suivi d'un drone", poster: "media/suivi.jpg" },
  { type: "youtube",  id: "ID_DE_LA_VIDEO",      legende: "Démo complète" },
  { type: "modele3d", src: "media/tourelle.glb", legende: "Modèle CAO", poster: "media/tourelle.jpg" }
]
```

Le premier média de la liste est l'image principale du projet.

**Astuce :** ajoute `#edition` à la fin de l'adresse (https://tonio1547.github.io/#edition) puis recharge la page : chaque projet sans média affiche un cadre pointillé qui indique où ajouter ses médias.

### Tailles conseillées
- Images : `.jpg` ou `.webp`, environ 1600 px de large, moins de 1 Mo.
- Vidéos : `.mp4` (H.264), moins de 50 Mo. Plus lourd → YouTube (`type: "youtube"`, l'id est la partie après `v=` dans le lien).
- Modèles 3D : `.glb`, idéalement moins de 10 Mo.

### Exporter un modèle SolidWorks en .glb
SolidWorks n'exporte pas directement en `.glb`. Le plus simple :
1. Dans SolidWorks : **Fichier → Enregistrer sous → STL** (ou `.step`), en résolution « fine ».
2. Ouvre le fichier dans **Blender** (gratuit) : *File → Import → STL*.
3. Applique éventuellement des couleurs/matériaux, puis *File → Export → glTF 2.0*, format **glTF Binary (.glb)**.

## Fichiers
| Fichier | Rôle |
|---|---|
| `contenu.js` | Tout le contenu — **le fichier à modifier** |
| `media/` | Photos, vidéos, modèles 3D, CV |
| `index.html` | Structure de la page d'accueil |
| `projet.html` | Structure des pages projet |
| `style.css` | Mise en forme (couleurs en haut du fichier) |
| `app.js` | Construit la page à partir de `contenu.js` + animation du viseur |
