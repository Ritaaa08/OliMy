import { esc, img, price, preloadLink } from "../lib/html.js";
import { layout } from "../layout.js";

function renderItem(item) {
  const classes = ["item", item.n ? "" : "no-n", item.veg ? "is-veg" : ""].filter(Boolean).join(" ");
  const badges = [
    item.veg ? '<span class="chip chip-veg">Végétarien</span>' : "",
    item.star ? '<span class="chip">Best-seller</span>' : "",
  ].join("");
  const flavors = item.flavors
    ? `<ul class="flavors" role="list">${item.flavors.map((f) => `<li class="chip">${esc(f)}</li>`).join("")}</ul>`
    : "";
  return `
    <li class="${classes}">
      <span class="n" aria-hidden="true">${item.n ?? ""}</span>
      <div>
        <h3 class="name">${esc(item.name)}${badges}</h3>
        ${item.desc ? `<p class="desc">${esc(item.desc)}</p>` : ""}
        ${flavors}
      </div>
      <span class="price">${price(item.price)}</span>
    </li>`;
}

function renderCategory(cat, images) {
  const twoCol = cat.items && cat.items.length >= 8 ? " is-two-col" : "";
  const list = (items) => `<ol class="items${twoCol}" role="list">${items.map(renderItem).join("")}</ol>`;
  const content = cat.groups
    ? cat.groups.map((g) => `<h3 class="group-title">${esc(g.title)}</h3>${list(g.items)}`).join("")
    : list(cat.items);
  return `
<section class="cat" id="${cat.id}" aria-labelledby="${cat.id}-title">
  <div class="wrap">
    <div class="cat-head">
      <div>
        <h2 id="${cat.id}-title">${esc(cat.title)}</h2>
        <p>${esc(cat.subtitle)}</p>
      </div>
      ${img(images, cat.image, { alt: "", sizes: "(min-width: 900px) 170px, 26vw" })}
    </div>
    ${cat.note ? `<p class="cat-note">${esc(cat.note)}</p>` : ""}
    ${content}
    <p class="cat-empty">Aucun plat signalé végétarien ici. Demandez-nous au comptoir, on trouve toujours quelque chose.</p>
  </div>
</section>`;
}

function menuJsonLd(site, menu) {
  const allItems = (cat) => (cat.groups ? cat.groups.flatMap((g) => g.items) : cat.items);
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.baseUrl}/menu.html#menu`,
    name: "Menu OliMy",
    inLanguage: "fr",
    hasMenuSection: menu.categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.title,
      description: cat.subtitle,
      hasMenuItem: allItems(cat).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.desc ? { description: item.desc } : {}),
        offers: { "@type": "Offer", price: item.price.toFixed(2), priceCurrency: menu.currency },
        ...(item.veg ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
      })),
    })),
  };
}

export function renderMenu({ site, menu, images, preview }) {
  const tabs = menu.categories.map((c) => `<a href="#${c.id}">${esc(c.title)}</a>`).join("");
  const cats = menu.categories.map((c) => renderCategory(c, images)).join("");
  const meat = site.meat.map((m) => `<div><span>${esc(m.label)}</span><span>${esc(m.value)}</span></div>`).join("");

  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>Le menu</h1>
    <p class="lead">Prix en francs suisses, à l'emporter ou au bar. Le reste de la carte est affiché en boutique.</p>
  </div>
</section>
<div class="wrap">
  <figure class="page-band is-cutout">
    ${img(images, "hero-plats", { alt: "Bubble tea, bánh mì au porc laqué, bol de bún et chips de crevettes OliMy", sizes: "(min-width: 900px) 680px, 100vw", priority: true })}
  </figure>
</div>

<div class="menu-tabs">
  <div class="wrap">
    <nav class="tabs" aria-label="Catégories du menu">${tabs}</nav>
    <button class="veg-toggle" type="button" aria-pressed="false"><span class="knob" aria-hidden="true"></span>Végétarien</button>
  </div>
</div>

${cats}

<section class="section">
  <div class="wrap">
    <div class="card is-tinted">
      <h2>Allergies et provenance</h2>
      <p>${esc(site.allergyNote)}</p>
      <div class="meat">${meat}</div>
      <p class="small muted">${esc(site.meatNote)}</p>
    </div>
  </div>
</section>`;

  return layout({
    site,
    preview,
    page: "menu",
    title: "Menu et prix, OliMy Lausanne : bánh mì dès 10.–, bún, soupes, bubble tea",
    description: "La carte complète d'OliMy avec les prix : 12 bánh mì à 10 ou 11 francs, bún dès 16.–, soupes, bánh bao, dim sum et bubble tea 11 parfums à 6.–.",
    body,
    jsonLd: [menuJsonLd(site, menu)],
    preload: [preloadLink(images, "hero-plats", "(min-width: 900px) 680px, 100vw")],
  });
}
