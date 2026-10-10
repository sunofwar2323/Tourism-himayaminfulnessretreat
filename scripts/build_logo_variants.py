"""Build transparent logo variants from Image/Logo/logo.png.

- logo-color.png: original navy lotus + glacier peaks on a transparent background.
- logo-light.png: navy linework inverted to white, peaks kept Glacier Blue (#6CA0D2),
  for use on Midnight / dark gradient backgrounds.

Usage: python3 scripts/build_logo_variants.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Image" / "Logo" / "logo.png"
NAVY = (5, 26, 56)
GLACIER = (108, 160, 210)
WHITE = (255, 255, 255)
PEAK_RATIO = 0.45  # (b - r) / (255 - r): ~0.2 for navy ink, ~0.7 for the blue peaks


def classify(r, g, b):
    dark = 255 - r
    if dark < 6:
        return None, 0
    ratio = (b - r) / dark
    if ratio > PEAK_RATIO:
        return "peak", min(1.0, dark / (255 - GLACIER[0]))
    return "ink", min(1.0, (255 - (r + g + b) / 3) / (255 - sum(NAVY) / 3))


def build():
    src = Image.open(SRC).convert("RGB")
    w, h = src.size
    color = Image.new("RGBA", (w, h))
    light = Image.new("RGBA", (w, h))
    px, cpx, lpx = src.load(), color.load(), light.load()
    for y in range(h):
        for x in range(w):
            kind, alpha = classify(*px[x, y])
            a = int(round(alpha * 255))
            if kind is None:
                cpx[x, y] = lpx[x, y] = (0, 0, 0, 0)
            elif kind == "peak":
                cpx[x, y] = lpx[x, y] = (*GLACIER, a)
            else:
                cpx[x, y] = (*NAVY, a)
                lpx[x, y] = (*WHITE, a)
    bbox = color.getbbox()
    pad = 12
    box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
    for img, name in ((color, "logo-color.png"), (light, "logo-light.png")):
        out = img.crop(box)
        out.thumbnail((640, 640), Image.LANCZOS)
        out.save(SRC.parent / name, optimize=True)
        print(name, out.size)


if __name__ == "__main__":
    build()
