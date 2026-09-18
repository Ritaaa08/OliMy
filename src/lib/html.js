// Petits utilitaires de rendu HTML partagés par les pages.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const ICONS = join(ROOT, "assets", "icons");
const iconCache = new Map();

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Prix à la suisse : 10 -> « 10.– », 3.5 -> « 3.50 ». */
export const price = (n) => (Number.isInteger(n) ? `${n}.–` : n.toFixed(2));

/** Balise <img> responsive avec dimensions fixées (pas de saut de mise en page). */
export function img(images, name, { alt, sizes = "100vw", cls = "", loading = "lazy", priority = false }) {
  const meta = images[name];
  if (!meta) throw new Error(`Image inconnue : ${name}`);
  const largest = meta.widths.at(-1);
  const height = Math.round(largest / meta.ratio);
  const srcset = meta.widths.map((w) => `img/${name}-${w}.webp ${w}w`).join(", ");
  const attrs = [
    `src="img/${name}-${largest}.webp"`,
    `srcset="${srcset}"`,
    `sizes="${sizes}"`,
    `width="${largest}"`,
    `height="${height}"`,
    `alt="${esc(alt)}"`,
    priority ? 'fetchpriority="high"' : `loading="${loading}"`,
    'decoding="async"',
    cls ? `class="${cls}"` : "",
  ].filter(Boolean);
  return `<img ${attrs.join(" ")}>`;
}

/** Icône Tabler (MIT) inline, décorative. */
export function icon(name) {
  if (!iconCache.has(name)) {
    const svg = readFileSync(join(ICONS, `${name}.svg`), "utf8")
      .replace(/<\?xml[^>]*>\s*/g, "")
      .replace(/\s(width|height|class)="[^"]*"/g, "")
      .replace("<svg", '<svg aria-hidden="true" focusable="false"');
    iconCache.set(name, svg.trim());
  }
  return iconCache.get(name);
}

/** Préchargement responsive d'une image (même srcset/sizes que la balise <img>). */
export function preloadLink(images, name, sizes) {
  const meta = images[name];
  const srcset = meta.widths.map((w) => `img/${name}-${w}.webp ${w}w`).join(", ");
  return `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${sizes}">`;
}

export const externalAttrs = 'target="_blank" rel="noopener"';
