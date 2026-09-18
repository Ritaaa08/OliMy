#!/usr/bin/env python3
"""Génère les images optimisées du site (WebP, plusieurs largeurs) à partir des sources.

Usage : python3 tools/optimize-images.py
Sortie : src/assets/img/<nom>-<largeur>.webp  (+ favicon, apple-touch-icon, og-image)
Dépendance : Pillow (déjà installé sur la machine).
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

PRETES = ROOT / "photos-pretes"
CUTOUT = PRETES / "menu"
REAL = ROOT / "Photos"

QUALITY = 82
BAND = [480, 800, 1200, 1600]
CUT = [400, 640, 900]
PHOTO = [400, 640, 900]

# name -> (source, crop box or None, widths)
IMAGES = {
    # Détourages (fond transparent)
    "hero-plats": (CUTOUT / "premire image.png", None, [480, 720, 1000, 1400]),
    "hero-photo": (PRETES / "1.png", None, BAND),
    "cut-banh-mi": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_04_24.png", None, CUT),
    "cut-bao-dim-sum": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_21_10.png", None, CUT),
    "cut-bun-crevettes": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_21_26.png", None, CUT),
    "cut-buns": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_28_26.png", None, CUT),
    "cut-soupes": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_28_37.png", None, CUT),
    "cut-dim-sum": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_28_53.png", None, CUT),
    "cut-bubble-tea": (CUTOUT / "ChatGPT Image 17 sept. 2026 à 22_29_03.png", None, CUT),
    # Visuels d'ambiance (recadrés pour sortir le panneau mural du champ)
    "band-flatlay": (PRETES / "ChatGPT Image 17 sept. 2026 à 22_38_23.png", None, BAND),
    "band-drinks": (PRETES / "ChatGPT Image 17 sept. 2026 à 22_38_50.png", None, BAND),
    "band-dim-sum": (PRETES / "ChatGPT Image 17 sept. 2026 à 22_39_01.png", (0, 0, 1520, 941), BAND),
    "band-emporter": (PRETES / "9b7d0218-62d9-4b0b-854d-ac53bd2b7976.png", (0, 40, 1448, 1086), BAND),
    "band-comptoir": (PRETES / "d498a3b3-cbb2-4f6d-a85f-fb152ef156c3.png", (0, 330, 1448, 1086), BAND),
    # Vraies photos
    "real-bun-boeuf": (REAL / "avis client3.png", None, PHOTO),
    "real-banh-mi": (REAL / "avis client5.png", None, PHOTO),
    "real-bun-bubble": (REAL / "avis clients 2.png", None, PHOTO),
    "real-bowl-bench": (REAL / "avis de clients.png", None, PHOTO),
    "real-cups-window": (REAL / "bubble tea.png", None, PHOTO),
}


def load(path: Path) -> Image.Image:
    im = ImageOps.exif_transpose(Image.open(path))
    return im.convert("RGBA") if "A" in im.getbands() else im.convert("RGB")


def has_alpha(im: Image.Image) -> bool:
    return im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 255


def trim_alpha(im: Image.Image, pad: int = 8) -> Image.Image:
    """Recadre un détourage sur son contenu (avec une petite marge)."""
    box = im.getchannel("A").getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def save_webp(im: Image.Image, dest: Path, width: int) -> None:
    if im.width > width:
        ratio = width / im.width
        im = im.resize((width, round(im.height * ratio)), Image.LANCZOS)
    im.save(dest, "WEBP", quality=QUALITY, method=6)


def build_images() -> dict:
    manifest = {}
    for name, (src, crop, widths) in IMAGES.items():
        im = load(src)
        if crop:
            im = im.crop(crop)
        if has_alpha(im):
            im = trim_alpha(im)
        sizes = []
        for w in widths:
            if w > im.width:
                continue
            dest = OUT / f"{name}-{w}.webp"
            save_webp(im, dest, w)
            sizes.append(w)
        manifest[name] = {"ratio": round(im.width / im.height, 4), "widths": sizes}
        print(f"{name:18s} {im.width}x{im.height}  ->  {sizes}")
    return manifest


def build_logo() -> None:
    logo = trim_alpha(load(ROOT / "logo olimy.png"), pad=4)
    for w in (360, 720):
        r = w / logo.width
        logo.resize((w, round(logo.height * r)), Image.LANCZOS).save(OUT / f"logo-{w}.webp", "WEBP", lossless=True)
    # Version blanche pour les fonds violets : on garde l'alpha, on remplace l'encre.
    white = Image.new("RGBA", logo.size, (255, 255, 255, 0))
    white.putalpha(logo.getchannel("A"))
    for w in (360, 720):
        r = w / white.width
        white.resize((w, round(white.height * r)), Image.LANCZOS).save(OUT / f"logo-white-{w}.webp", "WEBP", lossless=True)
    print(f"logo {logo.width}x{logo.height} -> 360, 720 (violet + blanc)")


def build_icons() -> None:
    """Favicon : le « O » du logo en blanc sur un carré violet arrondi."""
    logo = load(ROOT / "logo olimy.png")
    alpha = logo.getchannel("A")
    # Le O est le premier glyphe : on isole la zone gauche et on recadre sur l'encre.
    left = alpha.crop((0, 0, int(logo.width * 0.27), int(logo.height * 0.72)))
    box = left.getbbox()
    glyph = left.crop(box)
    size = 512
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    from PIL import ImageDraw
    ImageDraw.Draw(icon).rounded_rectangle((0, 0, size - 1, size - 1), radius=112, fill="#4C0142")
    target = int(size * 0.62)
    r = target / max(glyph.size)
    g = glyph.resize((max(1, round(glyph.width * r)), max(1, round(glyph.height * r))), Image.LANCZOS)
    mark = Image.new("RGBA", g.size, (255, 255, 255, 0))
    mark.putalpha(g)
    icon.alpha_composite(mark, ((size - g.width) // 2, (size - g.height) // 2))
    icon.save(OUT / "icon-512.png", "PNG", optimize=True)
    icon.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", "PNG", optimize=True)
    icon.resize((32, 32), Image.LANCZOS).save(OUT / "favicon-32.png", "PNG", optimize=True)
    print("icons -> icon-512, apple-touch-icon, favicon-32")


def build_og() -> None:
    """Image de partage 1200x630 : logo blanc + bánh mì sur fond violet."""
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), "#4C0142")
    logo = trim_alpha(load(ROOT / "logo olimy.png"), pad=4)
    white = Image.new("RGBA", logo.size, (255, 255, 255, 0))
    white.putalpha(logo.getchannel("A"))
    lw = 380
    white = white.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    og.paste(white, (60, (H - white.height) // 2), white)
    plats = trim_alpha(load(CUTOUT / "premire image.png"))
    ph = 520
    plats = plats.resize((round(plats.width * ph / plats.height), ph), Image.LANCZOS)
    og.paste(plats, (W - plats.width - 30, (H - ph) // 2), plats)
    og.save(OUT / "og-image.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print("og-image.jpg 1200x630")


if __name__ == "__main__":
    import json

    manifest = build_images()
    build_logo()
    build_icons()
    build_og()
    (ROOT / "src" / "data" / "images.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    total = sum(p.stat().st_size for p in OUT.glob("*"))
    print(f"\n{len(list(OUT.glob('*')))} fichiers, {total / 1024:.0f} Ko au total -> {OUT}")
