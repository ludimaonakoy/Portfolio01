# Portfolio de Junior Ludima

Site statique (HTML, CSS, JavaScript) sans dépendance ni étape de build. Il fonctionne tel quel sur GitHub Pages.

## Contenu du dossier

```
ludima-portfolio/
├── index.html                      Page unique : toutes les sections du site
├── favicon.svg                     Icône de l'onglet (monogramme LO)
├── .nojekyll                       Indique à GitHub Pages de servir les fichiers tels quels
├── README.md                       Ce guide
└── assets/
    ├── css/style.css               Styles, couleurs et thème clair/sombre
    ├── js/main.js                  Animations et interactions
    ├── img/
    │   ├── ludima-portrait.webp/.jpg     Photo en costume (en-tête du site)
    │   └── og-image.jpg                  Aperçu affiché quand le lien est partagé
```

## Déployer sur GitHub Pages

### Option 1 : remplacer l'ancien site (même adresse)

Adresse finale : https://ludimaonakoy.github.io/JLudima-PortFolio/

1. (Conseillé) Garder une copie de l'ancien site :
   ```bash
   git clone https://github.com/ludimaonakoy/JLudima-PortFolio.git
   cd JLudima-PortFolio
   git checkout -b ancien-site
   git push -u origin ancien-site
   git checkout main            # ou master, selon le nom de la branche principale
   ```
2. Supprimer les anciens fichiers et copier le nouveau site :
   ```bash
   git rm -r -q .
   cp -r /chemin/vers/ludima-portfolio/. .
   git add .
   git commit -m "Nouveau portfolio"
   git push
   ```
3. Sur GitHub : **Settings > Pages > Build and deployment**, choisir **Deploy from a branch**, branche `main` (ou `master`), dossier `/ (root)`.
4. Attendre 1 à 2 minutes, puis ouvrir l'adresse. Si l'ancien site s'affiche encore, recharger avec Ctrl+F5.

Sans ligne de commande : sur la page du dépôt, **Add file > Upload files**, glisser **le contenu** du dossier `ludima-portfolio` (pas le dossier lui-même), puis **Commit changes**. Les anciens fichiers restent mais ne gênent pas, car `index.html` est remplacé.

### Option 2 : adresse courte (https://ludimaonakoy.github.io/)

1. Créer un nouveau dépôt public nommé exactement `ludimaonakoy.github.io`.
2. Y envoyer le contenu du dossier comme ci-dessus.
3. Dans `index.html`, remplacer `https://ludimaonakoy.github.io/JLudima-PortFolio/` par `https://ludimaonakoy.github.io/` dans les deux balises `og:url` et `og:image` (lignes 13 et 14).

## Tester sur son ordinateur

Double-cliquer sur `index.html` suffit. Pour un test plus fidèle :

```bash
cd ludima-portfolio
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Modifier le site

| Ce que vous voulez changer | Où |
|---|---|
| Textes, expériences, formations, compétences | `index.html` (chaque section est commentée : HERO, ABOUT, EXPERIENCE, SKILLS, EDUCATION, CONTACT) |
| Métiers qui défilent sous le nom | `assets/js/main.js`, tableau `roles` |
| Couleurs | `assets/css/style.css`, bloc `:root` en haut du fichier (thème sombre), puis le bloc `[data-theme="light"]` (thème clair) |
| Photos | Remplacer les fichiers dans `assets/img/` en gardant les mêmes noms |
| Lien LinkedIn ou autre réseau | Dupliquer la ligne GitHub dans la section CONTACT de `index.html` |

Pour une nouvelle compétence, copier un bloc `<li class="skill" ...>` et mettre à jour le compteur du filtre correspondant.

## Formulaire de contact

Le formulaire ouvre l'application e-mail du visiteur avec le message déjà rédigé pour ludimajunior@gmail.com. Aucun serveur n'est nécessaire.

Pour recevoir les messages directement sans passer par l'application e-mail du visiteur, on peut brancher un service gratuit comme Formspree : créer un formulaire sur formspree.io, puis remplacer le comportement d'envoi dans `assets/js/main.js` (section « Contact form »).

## Polices

Le site utilise Archivo et JetBrains Mono, chargées depuis Google Fonts. Sans connexion, le navigateur affiche une police système de remplacement.
