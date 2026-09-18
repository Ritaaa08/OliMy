import { esc, externalAttrs } from "../lib/html.js";
import { layout } from "../layout.js";

export function renderMentions({ site, preview }) {
  const { legal, credits } = site;
  const contact = legal.email
    ? `<a href="mailto:${esc(legal.email)}">${esc(legal.email)}</a>`
    : `<a href="tel:${site.phoneIntl}">${esc(site.phone)}</a>`;
  const madeBy = credits.name
    ? `<p>Site réalisé par ${credits.url ? `<a href="${esc(credits.url)}" ${externalAttrs}>${esc(credits.name)}</a>` : esc(credits.name)}.</p>`
    : "";

  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>Mentions légales</h1>
    <p class="lead">Qui est derrière ce site, ce qu'il fait de vos données (presque rien) et d'où viennent les images.</p>
  </div>
</section>

<section class="section is-tight">
  <div class="wrap prose">
    <h2>Exploitant du site</h2>
    <p>
      <strong>${esc(legal.company)}</strong><br>
      ${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}, Suisse<br>
      Contact : ${contact}<br>
      Numéro d'identification des entreprises (IDE) : ${esc(legal.uid)}<br>
      Société inscrite au ${esc(legal.register)}.
    </p>
    <p>Hébergement : ${esc(legal.host)}.</p>

    <h2>Protection des données</h2>
    <p>Ce site est un site d'information. Il ne contient ni formulaire, ni compte client, ni commande en ligne, ni outil de mesure d'audience, et il ne dépose aucun cookie.</p>
    <p>Comme pour tout site internet, l'hébergeur enregistre automatiquement des données techniques lors de la consultation (adresse IP, date et heure, page consultée, type de navigateur). Ces journaux servent uniquement à assurer la sécurité et le bon fonctionnement du service et sont supprimés selon les règles de l'hébergeur.</p>
    <p>Le plan d'accès de la page « Infos & contact » ne se charge que si vous cliquez sur « Afficher le plan ». À ce moment-là, votre navigateur se connecte à Google Maps, qui peut traiter vos données selon sa propre politique de confidentialité. Les liens vers Google Maps, Apple Plans et les sites de presse mènent vers des services tiers, indépendants de ce site.</p>
    <p>Conformément à la loi fédérale sur la protection des données (LPD), vous pouvez nous demander quelles données vous concernant nous traitons et en demander la rectification ou la suppression, à l'adresse de contact ci-dessus.</p>

    <h2>Prix et informations</h2>
    <p>Les prix sont indiqués en francs suisses, tels qu'affichés en boutique. Ils peuvent évoluer ; en cas de différence, la carte affichée au comptoir fait foi. Les informations sur les allergènes et la provenance des viandes sont données au comptoir, sur simple demande.</p>

    <h2>Images et droits d'auteur</h2>
    <p>Le nom, le logo et les textes de ce site appartiennent à ${esc(legal.company)}. Toute reproduction sans autorisation est interdite.</p>
    <p>${esc(site.aiImagesNote)}</p>
    <p>Police de caractères : <a href="https://github.com/ateliertriay/bricolage" ${externalAttrs}>Bricolage Grotesque</a> (licence SIL Open Font). Icônes : <a href="https://tabler.io/icons" ${externalAttrs}>Tabler Icons</a> (licence MIT).</p>
    ${madeBy}
  </div>
</section>`;

  return layout({
    site,
    preview,
    page: "mentions",
    title: "Mentions légales, OliMy Lausanne",
    description: "Exploitant du site OliMy, protection des données, prix et crédits des images.",
    body,
  });
}
