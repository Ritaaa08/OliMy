import { icon } from "../lib/html.js";
import { layout } from "../layout.js";

export function renderNotFound({ site, preview }) {
  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>Page introuvable</h1>
    <p class="lead">Cette page n'existe pas ou plus. Le menu et les infos pratiques, eux, sont bien là.</p>
    <div class="hero-actions mt-1">
      <a class="btn btn-primary" href="menu.html">${icon("tools-kitchen-2")}Voir le menu</a>
      <a class="btn btn-secondary" href="index.html">Accueil</a>
    </div>
  </div>
</section>`;

  return layout({
    site,
    preview,
    page: "404",
    title: "Page introuvable, OliMy",
    description: "Cette page n'existe pas.",
    body,
    noindex: true,
  });
}
