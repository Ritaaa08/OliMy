import { esc, img, icon, externalAttrs, preloadLink } from "../lib/html.js";
import { layout, hoursTable } from "../layout.js";

export function renderInfos({ site, images, preview }) {
  const meat = site.meat.map((m) => `<div><span>${esc(m.label)}</span><span>${esc(m.value)}</span></div>`).join("");
  const tags = (list) => list.map((t) => `<li class="chip">${esc(t)}</li>`).join("");

  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>Infos & contact</h1>
    <p class="lead">On est à l'avenue de Cour, à Lausanne. Pas de réservation ni de commande en ligne : on passe, on commande, on repart avec.</p>
  </div>
</section>
<div class="wrap">
  <figure class="page-band is-natural">
    ${img(images, "band-emporter", { alt: "Sac OliMy, bánh mì emballé et bubble tea sur le comptoir", sizes: "(min-width: 900px) 820px, 100vw", priority: true })}
  </figure>
</div>

<section class="section is-tight">
  <div class="wrap cards">
    <div class="card reveal">
      <h2>Adresse</h2>
      <address>${esc(site.address.street)}<br>${esc(site.address.postalCode)} ${esc(site.address.city)}</address>
      <p class="muted mt-1">À deux pas du parc de Milan, dans le quartier de Cour.</p>
      <div class="actions">
        <a class="btn btn-primary" href="${site.links.googleMaps}" ${externalAttrs}>${icon("navigation")}Google Maps</a>
        <a class="btn btn-secondary" href="${site.links.appleMaps}" ${externalAttrs}>${icon("map-pin")}Apple Plans</a>
      </div>
    </div>

    <div class="card reveal">
      <h2>Téléphone</h2>
      <a class="phone" href="tel:${site.phoneIntl}">${esc(site.phone)}</a>
      <p class="muted">Une question sur un plat, une allergie, une grosse commande à venir chercher ? Appelez-nous ou passez au comptoir.</p>
    </div>

    <div class="card reveal">
      <h2>Horaires</h2>
      <p class="status" data-status hidden></p>
      ${hoursTable(site)}
      <p class="small muted mt-1">${esc(site.hoursNote)}</p>
    </div>

    <div class="card reveal">
      <h2>Sur place et paiement</h2>
      <p class="muted">Tout est à l'emporter, avec quelques places au bar si vous voulez manger sur place.</p>
      <ul class="tags" role="list">${tags(site.service)}</ul>
      <h3 class="mt-1">Moyens de paiement</h3>
      <ul class="tags" role="list">${tags(site.payment)}</ul>
    </div>

    <div class="card is-tinted is-wide reveal">
      <h2>Allergies et provenance</h2>
      <p>${esc(site.allergyNote)}</p>
      <div class="meat">${meat}</div>
      <p class="small muted">${esc(site.meatNote)}</p>
    </div>

    <div class="map is-wide reveal" data-src="${site.links.mapEmbed}">
      <div class="map-cover">
        <h3>Plan d'accès</h3>
        <p>Le plan Google Maps se charge quand vous le demandez.</p>
        <button class="btn btn-primary" type="button">${icon("map-2")}Afficher le plan</button>
      </div>
    </div>
  </div>
</section>`;

  return layout({
    site,
    preview,
    page: "infos",
    title: "Infos et contact, OliMy Lausanne : adresse, horaires, téléphone",
    description: "OliMy, avenue de Cour 67, 1007 Lausanne. Ouvert du lundi au samedi. Téléphone 076 771 74 74. À l'emporter ou au bar, paiement cash, cartes et Twint.",
    body,
    preload: [preloadLink(images, "band-emporter", "(min-width: 900px) 820px, 100vw")],
  });
}
