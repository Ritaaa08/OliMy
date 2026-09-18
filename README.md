# Site OliMy

Site vitrine de la sandwicherie vietnamienne OliMy (avenue de Cour 67, Lausanne).
Quatre pages statiques, sans commande en ligne : Accueil, Menu, Infos & contact, Mentions légales (+ page 404).

## Dossiers

| Dossier | Rôle |
| --- | --- |
| `site/` | **Le site prêt à mettre en ligne** (généré, ne pas modifier à la main) |
| `src/data/menu.json` | La carte et les prix |
| `src/data/site.json` | Adresse, téléphone, horaires, paiement, presse, note Google, mentions légales |
| `src/pages/`, `src/layout.js` | Gabarits des pages |
| `src/css/main.css`, `src/js/main.js` | Style et comportements |
| `src/assets/` | Polices, icônes, images optimisées (avec leurs licences) |
| `src/hosting/` | `.htaccess` (Apache : Infomaniak, Hostpoint…) et `_headers` (Cloudflare Pages, Netlify) |
| `tools/optimize-images.py` | Génère les images WebP à partir des photos sources |
| `photos-pretes/`, `Photos/`, `menu/` | Photos sources (jamais servies telles quelles) |

## Modifier un prix ou un plat

1. Ouvrir `src/data/menu.json` et changer la ligne concernée
   (`"price": 10` devient `"price": 10.5`, etc.). `"veg": true` marque un plat végétarien.
2. Régénérer le site :

```bash
npm run build
```

3. Envoyer le contenu du dossier `site/` chez l'hébergeur.

Les horaires, le téléphone, l'adresse ou l'e-mail de contact des mentions légales se changent
de la même façon dans `src/data/site.json`. Le statut « Ouvert / Fermé » se calcule tout seul
à partir des horaires.

## Aperçu pour le client (GitHub Pages)

Le dépôt contient un workflow (`.github/workflows/pages.yml`) qui publie automatiquement
le site à chaque `git push` sur `main`, en **mode aperçu** : bandeau « Aperçu de validation »,
`noindex` et `robots.txt` bloqué, pour que cette copie ne soit jamais indexée par Google.

Une seule fois, dans le dépôt GitHub : **Settings → Pages → Source : « GitHub Actions »**.
L'adresse de l'aperçu est ensuite `https://<votre-compte>.github.io/<nom-du-depot>/`.

Les photos sources (`photos-pretes/`, `Photos/`, `menu/`) sont volontairement hors du dépôt
(`.gitignore`) : elles pèsent 60 Mo et ne servent qu'à régénérer les images optimisées,
déjà présentes dans `src/assets/img/`.

Le texte à envoyer au client est dans `docs/message-client.md`.

## Voir le site en local

```bash
npm run dev
```

puis ouvrir http://localhost:4173. Le serveur local envoie les mêmes en-têtes de sécurité
qu'en production (CSP), ce qui permet de détecter un blocage avant la mise en ligne.

## Ajouter ou changer des photos

Déposer la photo dans `photos-pretes/` (ou `Photos/`), l'ajouter à la liste `IMAGES`
de `tools/optimize-images.py`, puis :

```bash
npm run images
npm run build
```

## Mise en ligne

Le dossier `site/` est un site statique : il fonctionne sur n'importe quel hébergeur.

- **Infomaniak (hébergement web existant)** : Manager → Hébergement web → Gestionnaire de fichiers
  (ou FTP/SFTP), vider le dossier `web/` puis y déposer tout le contenu de `site/`, y compris
  le fichier caché `.htaccess`. Rien d'autre à configurer.
- **Cloudflare Pages (gratuit)** : créer un projet « Upload assets », déposer le contenu de `site/`
  (`_headers` est lu automatiquement), puis rattacher le domaine dans l'onglet « Custom domains ».

Avant la mise en ligne, vérifier `"baseUrl"` dans `src/data/site.json` (utilisé pour le sitemap,
les liens canoniques et l'image de partage), puis relancer `npm run build`.

## Licences des ressources

- Police **Bricolage Grotesque** : SIL Open Font License 1.1 (`src/assets/fonts/LICENSE.txt`).
- Icônes **Tabler Icons** : licence MIT (`src/assets/icons/LICENSE.txt`).
- Logo, textes et photos : propriété d'OliMy Sàrl. Une partie des visuels est générée par IA
  (mentionné sur la page Mentions légales).

## Pré-requis

- Node.js 20 ou plus (aucune dépendance npm à installer)
- Python 3 avec Pillow, uniquement pour régénérer les images
