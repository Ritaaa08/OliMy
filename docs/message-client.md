# Message à envoyer au client (à adapter)

> Remplacer `LIEN-APERCU` par l'adresse GitHub Pages, et ajouter votre nom.

---

Bonjour,

Le nouveau site d'OliMy est prêt à être relu. Vous pouvez l'ouvrir sur votre téléphone ou votre ordinateur :

**LIEN-APERCU**

C'est une version de validation (le bandeau jaune en haut le rappelle) : elle n'est pas encore en ligne et n'apparaît pas dans Google. Le site comprend quatre pages : l'accueil, le menu complet avec les prix, les infos pratiques (adresse, horaires, téléphone, plan) et les mentions légales.

**Ce que je vous propose pour la mise en ligne**

Vous gardez votre adresse actuelle, restaurant-olimy.ch, et votre hébergement Infomaniak : on remplace simplement l'ancien site par le nouveau. Rien ne change pour vos clients ni pour votre fiche Google, et il n'y a aucun frais supplémentaire. Le nouveau site est très léger et n'a pas besoin de mises à jour techniques, contrairement à un WordPress.

Pour cela, j'ai besoin d'un accès à votre espace Infomaniak : le plus simple est de m'inviter comme utilisatrice depuis votre Manager Infomaniak (Organisation → Utilisateurs → Inviter), avec l'accès à l'hébergement web. Sinon, on peut faire la mise en ligne ensemble, sur place, en une vingtaine de minutes.

**Merci de vérifier et de me confirmer**

1. Tous les prix et les descriptions du menu (page « Menu »).
2. Les horaires : lundi à vendredi 10h30 à 14h30, samedi 11h à 18h, fermé dimanche et jours fériés.
3. Le téléphone affiché : 076 771 74 74.
4. Une adresse e-mail de contact à indiquer dans les mentions légales.
5. La provenance des viandes affichée (bœuf et porc Suisse, poulet Brésil et Suisse, crevettes Vietnam) correspond bien à votre affichage actuel.
6. Les citations de presse (24 heures, Quand est-ce qu'on mange ?, La Chouquette) et la note Google 4,5 : d'accord pour les afficher ?
7. Les photos de la section « Dans l'assiette » viennent d'avis Google publiés par des clients. Pour être en règle, il faudrait les remplacer par vos propres photos : 4 ou 5 photos prises avec votre téléphone suffisent (un bánh mì, un bún, un bubble tea, le comptoir, la vitrine). Envoyez-les-moi et je les intègre.
8. Certaines images d'illustration ont été créées par intelligence artificielle à partir de vos produits ; c'est indiqué dans les mentions légales. Si vous préférez uniquement de vraies photos, dites-le-moi.

Et bien sûr, toute remarque sur les textes, les couleurs ou l'ordre des sections est la bienvenue.

Bonne journée,
VOTRE NOM

---

## Aide-mémoire pour vous (ne pas envoyer)

- Le client garde son domaine et son hébergement : coût supplémentaire 0.–. Option ultérieure pour économiser : résilier l'hébergement WordPress (~CHF 11/mois) et passer sur Cloudflare Pages (gratuit) en gardant seulement le domaine (~CHF 9/an) et l'e-mail inclus.
- Les réponses aux points 1 à 5 se reportent dans `src/data/menu.json` et `src/data/site.json`, puis `npm run build`.
- Nouvelles photos : les déposer dans `Photos/`, les ajouter dans `tools/optimize-images.py`, puis `npm run images` et `npm run build`.
- Mise en ligne Infomaniak : Manager → Hébergement web → Gestionnaire de fichiers → vider `web/` → déposer le contenu de `site/` (y compris `.htaccess`). Vérifier ensuite https://restaurant-olimy.ch sur un téléphone.
