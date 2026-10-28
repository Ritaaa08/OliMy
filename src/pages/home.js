import { esc, img, icon, price, externalAttrs, preloadLink } from "../lib/html.js";
import { layout, hoursTable } from "../layout.js";

const BEST = [
  { name: "Bánh mì heo quay", desc: "Porc laqué, pâté maison, légumes croquants", price: 10, image: "cut-banh-mi", href: "menu.html#banh-mi", alt: "Bánh mì OliMy garni de porc, coriandre, carottes et concombre, avec sa sauce" },
  { name: "Bún", desc: "Poulet, porc, tofu, crevettes ou bœuf sur vermicelles de riz", from: 16, image: "cut-buns", href: "menu.html#bun", alt: "Bols de bún au poulet, porc, tofu, crevettes et bœuf" },
  { name: "Bánh bao et dim sum", desc: "Brioche au porc, raviolis aux crevettes, rouleaux", from: 3.5, image: "cut-dim-sum", href: "menu.html#a-cote", alt: "Brioche au porc, raviolis vapeur et rouleaux d'été sur un plateau en bambou" },
  { name: "Cà phê sữa đá", desc: "Café glacé au lait concentré, à la vietnamienne", price: 6, image: "cut-cafe", href: "menu.html#boissons", alt: "Café glacé OliMy au lait concentré, avec des grains de café" },
];

export function renderHome({ site, menu, images, preview }) {
  const drinks = menu.categories.find((c) => c.id === "boissons");
  const coffee = drinks.items.find((i) => i.name.startsWith("Cà phê"));

  const tiles = BEST.map(
    (t) => `
      <a class="tile reveal" href="${t.href}">
        <div class="tile-media">${img(images, t.image, { alt: t.alt, sizes: "(min-width: 900px) 260px, 78vw" })}</div>
        <h3>${esc(t.name)}</h3>
        <p>${esc(t.desc)}</p>
        <span class="price">${t.from ? `dès ${price(t.from)}` : price(t.price)}</span>
      </a>`,
  ).join("");

  const [lead, ...others] = site.press;
  const quotes = others
    .map(
      (p) => `
      <blockquote class="quote reveal">
        <p>« ${esc(p.quote)} »</p>
        <cite><a href="${p.url}" ${externalAttrs}>${esc(p.source)}</a></cite>
      </blockquote>`,
    )
    .join("");

  const body = `
<section class="hero">
  <div class="wrap">
    <div class="hero-copy">
      <h1>Bánh mì, bún et soupes</h1>
      <p class="lead">Bánh bao, dim sum et café glacé aussi. Cuisine vietnamienne à l'avenue de Cour, à Lausanne, à l'emporter ou au bar.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="menu.html">${icon("tools-kitchen-2")}Voir le menu</a>
        <a class="btn btn-secondary" href="${site.links.googleMaps}" ${externalAttrs}>${icon("navigation")}Itinéraire</a>
      </div>
      <p class="status" data-status hidden></p>
    </div>
    <figure class="hero-figure is-photo">
      ${img(images, "hero-photo", { alt: "Bánh mì au porc grillé et bol de bún OliMy sur une table en bois au soleil", sizes: "(min-width: 900px) 560px, 100vw", priority: true })}
    </figure>
  </div>
</section>

<section class="section" id="incontournables">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>Les incontournables</h2>
      <p>Ce que les habitués commandent les yeux fermés.</p>
    </div>
    <div class="rail">${tiles}</div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <figure class="reveal">
      ${img(images, "band-flatlay", { alt: "Deux bánh mì OliMy sur un plateau en bambou, entourés de coriandre, concombre, piments et sauces", sizes: "(min-width: 900px) 560px, 100vw" })}
    </figure>
    <div class="reveal">
      <h2>Douze bánh mì, tous à 10 ou 11 francs</h2>
      <ul class="list" role="list">
        <li>Baguette croustillante et garniture généreuse</li>
        <li>Pâté maison au foie de poulet et porc</li>
        <li>Concombre, carottes au vinaigre et coriandre dans chaque sandwich</li>
        <li>Une version végétarienne au tofu et champignons</li>
      </ul>
      <a class="btn btn-outline" href="menu.html#banh-mi">Voir les 12 bánh mì ${icon("arrow-right")}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="drinks reveal">
      <div>
        <div class="section-head">
          <h2>Le café glacé vietnamien</h2>
          <p>Cà phê sữa đá : café et lait concentré sucré, servi sur glace. ${price(coffee.price)} le gobelet.</p>
        </div>
      </div>
      <figure class="is-cutout">
        ${img(images, "cut-cafe-couvercle", { alt: "Café glacé OliMy au lait concentré, dans son gobelet", sizes: "(min-width: 900px) 340px, 70vw" })}
      </figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>Dans l'assiette</h2>
    </div>
    <div class="gallery reveal">
      <figure class="is-wide">${img(images, "real-banh-mi", { alt: "Bánh mì OliMy dans son papier, coriandre et carottes qui dépassent", sizes: "(min-width: 900px) 780px, 100vw" })}</figure>
      <figure>${img(images, "real-bun-boeuf", { alt: "Bol de bún au bœuf avec oignons frits, carottes et sauce nuoc mam", sizes: "(min-width: 900px) 390px, 50vw" })}</figure>
      <figure>${img(images, "real-bowl-bench", { alt: "Bún au poulet et café glacé posés sur un banc", sizes: "(min-width: 900px) 390px, 50vw" })}</figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>On en parle</h2>
    </div>
    <div class="press">
      <blockquote class="quote is-lead reveal">
        <p>« ${esc(lead.quote)} »</p>
        <cite><a href="${lead.url}" ${externalAttrs}>${esc(lead.source)}</a></cite>
      </blockquote>
      ${quotes}
      <a class="rating reveal" href="${site.links.googleReviews}" ${externalAttrs}>
        <span class="score">${esc(site.rating.value)}</span>
        <span><span class="stars" aria-hidden="true">★★★★★</span><br><span class="stars-label">${esc(site.rating.label)}</span><br><span class="small">Lire les avis</span></span>
      </a>
    </div>
  </div>
</section>

<section class="section" id="visite">
  <div class="wrap split is-flipped">
    <figure class="reveal">
      ${img(images, "band-comptoir", { alt: "Plateau avec un bánh mì et un bún devant le comptoir d'OliMy", sizes: "(min-width: 900px) 560px, 100vw" })}
    </figure>
    <div class="reveal">
      <h2>Passez nous voir</h2>
      <p class="lead">${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}. À deux pas du parc de Milan.</p>
      ${hoursTable(site)}
      <p class="small muted mt-1">${esc(site.hoursNote)} ${site.service.join(", ").toLowerCase().replace(/^./, (c) => c.toUpperCase())}. ${site.payment.join(", ")}.</p>
      <div class="hero-actions mt-1">
        <a class="btn btn-primary" href="${site.links.googleMaps}" ${externalAttrs}>${icon("navigation")}Itinéraire</a>
        <a class="btn btn-secondary" href="tel:${site.phoneIntl}">${icon("phone")}Appeler</a>
      </div>
    </div>
  </div>
</section>`;

  return layout({
    site,
    preview,
    page: "index",
    title: "OliMy, sandwicherie vietnamienne à Lausanne : bánh mì, bún, soupes",
    description: site.description,
    body,
    preload: [preloadLink(images, "hero-photo", "(min-width: 900px) 560px, 100vw")],
  });
}
