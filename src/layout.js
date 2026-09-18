// Gabarit commun : en-tête, pied de page, barre d'action mobile, métadonnées et JSON-LD.
import { esc, icon, externalAttrs } from "./lib/html.js";

const NAV = [
  { href: "index.html", label: "Accueil", cls: "nav-home" },
  { href: "menu.html", label: "Menu" },
  { href: "infos.html", label: 'Infos<span class="nav-long">&nbsp;&amp; contact</span>' },
];

function hoursTable(site) {
  const rows = site.hours
    .map((rule) => {
      const time = rule.closed
        ? '<span class="closed">Fermé</span>'
        : `${rule.open.replace(":", "h").replace("h00", "h")} à ${rule.close.replace(":", "h").replace("h00", "h")}`;
      return `<tr data-days="${rule.days.join(",")}"><th scope="row">${esc(rule.label)}</th><td>${time}</td></tr>`;
    })
    .join("");
  return `<table class="hours"><tbody>${rows}</tbody></table>`;
}

function restaurantJsonLd(site) {
  const spec = site.hours
    .filter((rule) => !rule.closed)
    .map((rule) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: rule.days.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]),
      opens: rule.open,
      closes: rule.close,
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.baseUrl}/#restaurant`,
    name: site.legalName,
    alternateName: site.name,
    url: `${site.baseUrl}/`,
    image: `${site.baseUrl}/img/og-image.jpg`,
    logo: `${site.baseUrl}/img/logo-720.webp`,
    telephone: site.phoneIntl,
    servesCuisine: "Vietnamienne",
    priceRange: "CHF 3.50 - 18",
    paymentAccepted: "Cash, Credit Card, Twint",
    acceptsReservations: "False",
    hasMenu: `${site.baseUrl}/menu.html`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: spec,
  };
}

export function layout({ site, page, title, description, body, jsonLd = [], preload = [], noindex = false, preview = false }) {
  const canonical = `${site.baseUrl}/${page === "index" ? "" : `${page}.html`}`;
  const robots = noindex || preview ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`;
  const previewBar = preview
    ? '<p class="preview-bar">Aperçu de validation : le site n\'est pas encore en ligne. Les prix et horaires sont à vérifier.</p>'
    : "";
  const nav = NAV.map((item) => {
    const current = item.href === `${page}.html` ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${current}${item.cls ? ` class="${item.cls}"` : ""}>${item.label}</a>`;
  }).join("");

  const actionThird =
    page === "menu"
      ? `<a href="infos.html">${icon("info-circle")}Infos</a>`
      : `<a href="menu.html" class="is-primary">${icon("tools-kitchen-2")}Menu</a>`;

  const schemas = [restaurantJsonLd(site), ...jsonLd]
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");

  const preloads = preload.join("\n");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${robots}
<meta name="theme-color" content="#4c0142">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OliMy">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.baseUrl}/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="fr_CH">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="img/favicon-32.png" sizes="32x32">
<link rel="icon" href="img/icon-512.png" sizes="512x512">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preload" href="fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
${preloads}
<link rel="stylesheet" href="css/main.css">
${schemas}
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
${previewBar}
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="OliMy, accueil"><img src="img/logo-360.webp" srcset="img/logo-360.webp 360w, img/logo-720.webp 720w" sizes="80px" width="360" height="173" alt="OliMy"></a>
    <nav class="nav" aria-label="Navigation principale">
      ${nav}
      <a class="btn btn-primary nav-call" href="tel:${site.phoneIntl}">${icon("phone")}${esc(site.phone)}</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap">
    <div>
      <img src="img/logo-white-360.webp" srcset="img/logo-white-360.webp 360w, img/logo-white-720.webp 720w" sizes="190px" width="360" height="173" alt="OliMy, bubble tea, bánh mì, bún" loading="lazy">
      <p class="mt-1">Sandwicherie vietnamienne à Lausanne. Bánh mì, bún, soupes, dim sum et bubble tea, à l'emporter ou au bar.</p>
    </div>
    <div>
      <h3>Adresse</h3>
      <address>${esc(site.address.street)}<br>${esc(site.address.postalCode)} ${esc(site.address.city)}</address>
      <p class="mt-1"><a href="${site.links.googleMaps}" ${externalAttrs}>Itinéraire</a></p>
      <p><a href="tel:${site.phoneIntl}">${esc(site.phone)}</a></p>
    </div>
    <div>
      <h3>Horaires</h3>
      ${hoursTable(site)}
      <p class="small mt-1">${esc(site.hoursNote)}</p>
    </div>
    <p class="legal">© ${new Date().getFullYear()} ${esc(site.legal.company)}. Prix en francs suisses, sous réserve de modification. <a href="mentions.html">Mentions légales</a></p>
  </div>
</footer>
<nav class="actionbar" aria-label="Actions rapides">
  <a href="tel:${site.phoneIntl}">${icon("phone")}Appeler</a>
  <a href="${site.links.googleMaps}" ${externalAttrs}>${icon("navigation")}Itinéraire</a>
  ${actionThird}
</nav>
<script id="hours-data" type="application/json">${JSON.stringify(site.hours)}</script>
<script src="js/main.js" defer></script>
</body>
</html>
`;
}

export { hoursTable };
