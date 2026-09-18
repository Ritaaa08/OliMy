# CLAUDE.md — <NOM_DU_PROJET>

> Fichier lu automatiquement par Claude Code au début de chaque session.
> Il est volontairement dense mais chaque ligne compte (il consomme du contexte à chaque fois).
> • Les sections marquées 🔧 sont **à remplir par projet**.
> • Les sections **Standards** (qualité, sécurité, performance, workflow) peuvent être copiées
>   dans `~/.claude/CLAUDE.md` pour s'appliquer à **tous** tes projets — laisse ici seulement le spécifique.
> • Supprime les sections qui ne concernent pas un projet donné (ex. la partie 3D si pas de 3D).

---

## 🔧 Projet
- **Nom** : <...>
- **Objectif** : <ce que fait le site, en 1–2 phrases>
- **Public cible** : <qui, et son niveau de maturité vis-à-vis du produit>
- **Ton / marque** : <voix de marque — ex. premium & sobre, technique, chaleureux>
- **URL de prod** : <...>

## 🔧 Stack (ne pas en dévier sans me demander)
- **Framework** : <Next.js 15, App Router>  ·  **Langage** : TypeScript (mode strict)
- **Styles** : Tailwind CSS + design tokens
- **Animation** : GSAP / Framer Motion (selon le besoin)  ·  **3D** : React Three Fiber / Three.js (si nécessaire)
- **Backend / données** : <Postgres + Prisma, ou autre>  ·  **Auth** : <NextAuth / Clerk / ...>
- **Déploiement** : <Vercel>  ·  **Gestionnaire de paquets** : <pnpm>
- → **N'ajoute aucune dépendance** sans me la proposer et la justifier (poids, maintenance, alternative native possible ?).

---

## Façon de travailler (workflow)
- Pour toute tâche non triviale : **propose un plan court d'abord**, attends mon feu vert avant de coder.
- Avance par petits incréments vérifiables, **un sujet à la fois**.
- **Ne sur-conçois pas** : la solution la plus simple qui fonctionne. Pas d'abstraction prématurée.
- Ne touche à **aucun code hors du périmètre** de la tâche sans me prévenir.
- Actions destructives (suppression de fichiers, migration/reset DB, `git reset`, force push) : **demande confirmation**.
- Si tu n'es pas sûr d'un choix, **dis-le et présente les options** plutôt que de deviner.
- Avant d'annoncer « c'est fait » : lance le build + les tests, et vérifie l'absence d'erreurs console.

## Standards — Qualité de code
- TypeScript strict, **jamais `any`** (préfère `unknown` + narrowing).
- Noms explicites ; fonctions courtes à responsabilité unique ; composant > ~200 lignes = à découper.
- Logique séparée du rendu ; pas de logique métier dans les composants d'UI.
- Gestion d'erreur explicite aux frontières (pas d'erreurs avalées silencieusement).
- Pas de code mort, pas de `console.log` en production, pas de `TODO` orphelin.
- Le code doit passer **ESLint + Prettier sans warning**.
- Commits atomiques, messages clairs (Conventional Commits).

## Standards — Sécurité (non négociable)
- **Jamais** de secret / clé / token en dur : variables d'environnement uniquement, **jamais exposées côté client**.
- **Valide et assainis toute entrée utilisateur** (schéma type Zod, côté serveur).
- Requêtes DB **paramétrées / via l'ORM** — jamais de concaténation de SQL.
- Vérifications d'autorisation **côté serveur**, jamais uniquement côté client.
- Aucune donnée sensible dans le bundle client, les logs, ou les paramètres d'URL.
- Dépendances : pas de paquet non vérifié ; contrôle `npm audit` / vulnérabilités connues **avant** d'ajouter.
- Headers de sécurité (CSP, HSTS, X-Frame-Options), HTTPS partout, cookies `HttpOnly`/`Secure`/`SameSite`.
- Principe du **moindre privilège** pour les clés d'API et les accès.
- **Avant tout déploiement : passe de revue sécurité** (secrets, entrées, authz, dépendances).

## Standards — Performance
- Cibles Core Web Vitals : **LCP < 2,5 s · INP < 200 ms · CLS < 0,1**.
- Images : format moderne (AVIF/WebP), `next/image`, lazy-load hors viewport, **dimensions fixées** (évite le CLS).
- Minimise le JS client : **Server Components par défaut**, `use client` seulement quand c'est nécessaire.
- Code-splitting / import dynamique pour le lourd (3D, éditeurs, grosses libs).
- Animation : anime `transform` / `opacity` (GPU) ; évite les propriétés qui déclenchent le layout ; `will-change` avec parcimonie.
- **Three.js / R3F** : `dispose()` géométries/matériaux/textures au démontage ; limite les re-renders (memo, `useFrame` maîtrisé) ; suspends le rendu hors écran.
- Respecte **`prefers-reduced-motion`** (désactive ou atténue les animations).
- Fonts : `next/font`, `font-display: swap`, subsets.
- Objectif **Lighthouse ≥ 90** sur les 4 axes avant livraison.

## Standards — UX / UI & Accessibilité
- Utilise mes skills design (**design-taste-frontend, ui-ux-pro-max, web-design-guidelines**) — **pas de rendu générique « AI slop »**.
- **Mobile-first** ; responsive vérifié mobile / tablette / desktop.
- Accessibilité **WCAG AA** : HTML sémantique, navigation clavier, focus visible, contrastes suffisants, `alt` pertinents, ARIA seulement si nécessaire.
- Design tokens cohérents (couleurs, espacements, typo) — **pas de valeurs magiques**.
- États d'interaction complets pour chaque composant : default / hover / focus / active / disabled / loading / empty / error.

## Standards — SEO & Marketing
- HTML sémantique ; **un seul `<h1>` par page** ; hiérarchie de titres logique.
- Métadonnées complètes (title, description, Open Graph, Twitter cards) via l'API `metadata`.
- Données structurées **JSON-LD** adaptées au type de page.
- `sitemap.xml`, `robots.txt`, URLs propres et **canoniques**.
- Copy orientée conversion : **bénéfices avant fonctionnalités**, CTA clairs, **aucun claim inventé** (cf. mes skills marketing une fois installés).
- Analytics prêt à brancher : tracking d'événements sur les actions clés (CTA, formulaires, conversions).

## Tests
- Écris des tests pour la logique métier et les cas limites.
- Utilise **`webapp-testing`** (navigateur réel) pour valider les parcours critiques.
- Ne considère **jamais** une tâche terminée sans avoir vérifié qu'elle fonctionne réellement.

## Definition of Done (checklist avant « terminé »)
- [ ] Build OK · lint sans warning · types OK
- [ ] Tests écrits et passants · parcours critiques vérifiés au navigateur
- [ ] Aucune erreur / warning console
- [ ] Responsive vérifié (mobile → desktop)
- [ ] Accessibilité (clavier, focus, contrastes, sémantique)
- [ ] Budget perf respecté (Core Web Vitals / Lighthouse)
- [ ] Passe sécurité (secrets, entrées, authz, dépendances)
- [ ] SEO de base (titres, meta, données structurées)

## Mes skills — quand les charger (sans que j'aie à le demander)
- **design-taste-frontend / ui-ux-pro-max / web-design-guidelines** → décisions de design, systèmes, éviter le générique.
- **gsap-scrolltrigger** → animations au scroll, timelines complexes.
- **motion-framer** → transitions de composants, gestes, `AnimatePresence`.
- **react-three-fiber / threejs-webgl / babylonjs-engine** → 3D, WebGL, effets immersifs.
- **product-marketing** → contexte partagé (produit / audience / positionnement) que les autres skills marketing lisent ; à consulter en premier.
- **copywriting / cro** → copy orienté conversion, optimisation des taux.
- **seo-audit / ai-seo / schema / site-architecture** → SEO technique, visibilité dans les moteurs IA, JSON-LD, structure & arborescence.
- **analytics** → tracking des actions clés et mesure.
_(Garde seulement les skills que tu as réellement installés ; supprime les autres lignes.)_

## Communication
- Concis et direct. **Signale les compromis et les risques.**
- Dis-moi quand quelque chose est une mauvaise idée — **même si je l'ai demandé**.
