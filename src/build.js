// Génère le site statique dans `site/` à partir des données JSON et des gabarits.
// Usage : node src/build.js
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderHome } from "./pages/home.js";
import { renderMenu } from "./pages/menu.js";
import { renderInfos } from "./pages/infos.js";
import { renderMentions } from "./pages/mentions.js";
import { renderNotFound } from "./pages/notfound.js";

const SRC = new URL("./", import.meta.url).pathname;
const OUT = join(SRC, "..", "site");

const readJson = (name) => JSON.parse(readFileSync(join(SRC, "data", name), "utf8"));
const preview = process.env.PREVIEW === "1";
const data = { site: readJson("site.json"), menu: readJson("menu.json"), images: readJson("images.json"), preview };

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const pages = {
  "index.html": renderHome(data),
  "menu.html": renderMenu(data),
  "infos.html": renderInfos(data),
  "mentions.html": renderMentions(data),
  "404.html": renderNotFound(data),
};
for (const [file, html] of Object.entries(pages)) {
  writeFileSync(join(OUT, file), html);
}

cpSync(join(SRC, "css"), join(OUT, "css"), { recursive: true });
cpSync(join(SRC, "js"), join(OUT, "js"), { recursive: true });
cpSync(join(SRC, "assets", "fonts"), join(OUT, "fonts"), { recursive: true });
cpSync(join(SRC, "assets", "img"), join(OUT, "img"), { recursive: true });
cpSync(join(SRC, "hosting"), OUT, { recursive: true });

const { baseUrl } = data.site;
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(pages)
  .filter((file) => file !== "404.html")
  .map((file) => `${baseUrl}/${file === "index.html" ? "" : file}`);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(
  join(OUT, "robots.txt"),
  preview ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`,
);

console.log(`Site généré${preview ? " (mode aperçu, non indexable)" : ""} : ${Object.keys(pages).join(", ")} -> ${OUT}`);
