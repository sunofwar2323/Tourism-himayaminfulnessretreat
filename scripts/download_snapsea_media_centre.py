#!/usr/bin/env python3
"""Download publicly displayed Bhutan Tourism media-centre images.

Uses a normal, unauthenticated Playwright browser session. It does not log in,
solve challenges, or access private media. Images are downloaded only when the
public page renders them in the page DOM.

Install: python3 -m pip install playwright Pillow
         python3 -m playwright install chromium
Run:     python3 scripts/download_snapsea_media_centre.py
"""
from __future__ import annotations

import csv
import hashlib
import re
import time
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

from PIL import Image
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

SOURCE = "https://app.snapsea.io/p/media-centre/bhutan-tourism/department-of-tourism-bhutan"
OUTPUT = Path.home() / "Desktop" / "Tourism-Image"
MANIFEST = OUTPUT / "image-manifest.csv"
REPORT = OUTPUT / "download-report.md"
HEADERS = ["filename", "destination", "orientation", "width", "height",
           "file_size_bytes", "image_format", "original_image_url",
           "source_page_url", "download_status", "duplicate_status", "notes"]
DESTINATIONS = {
    "paro": ["paro", "taktsang", "tiger's nest", "tigers nest"],
    "thimphu": ["thimphu", "thimphu"], "punakha": ["punakha", "khamsum"],
    "bumthang": ["bumthang", "jambay"], "phobjikha": ["phobjikha", "gangtey", "black-necked crane"],
    "trongsa": ["trongsa"], "trashigang": ["trashigang", "merak", "sakteng"],
    "haa": ["haa valley", "haa"], "gasa": ["gasa", "laya"],
    "wangdue": ["wangdue"], "mongar": ["mongar"], "lhuentse": ["lhuentse"],
    "samdrupjongkhar": ["samdrup jongkhar"], "zhemgang": ["zhemgang"],
    "tsirang": ["tsirang"], "sarpang": ["sarpang"], "dagana": ["dagana"],
}
EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp", "GIF": ".gif", "TIFF": ".tiff", "BMP": ".bmp"}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def classify(text: str) -> tuple[str, str]:
    text = text.lower()
    hits = [key for key, words in DESTINATIONS.items() if any(word in text for word in words)]
    return (hits[0], "location identified from page text/alt/caption") if len(hits) == 1 else ("other", "location not confidently identified")


def safe_page_url(url: str) -> str:
    return urldefrag(url)[0]


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name in ["Paro", "Thimphu", "Punakha", "Bumthang", "Phobjikha", "Trongsa", "Trashigang", "Haa", "Gasa", "Other"]:
        (OUTPUT / name).mkdir(exist_ok=True)

    rows: list[dict] = []
    visited: list[str] = []
    processed: list[str] = []
    failed_pages: list[tuple[str, str]] = []
    failed_downloads = 0
    duplicates = 0
    discovered: dict[str, dict] = {}
    saved_hashes: dict[str, int] = {}
    numbers: defaultdict[tuple[str, str], int] = defaultdict(int)

    # Resume safely: retain manifest records and never overwrite an existing file.
    if MANIFEST.exists():
        with MANIFEST.open(newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        for row in rows:
            path = OUTPUT / row.get("destination", "Other") / row.get("filename", "")
            if path.is_file():
                saved_hashes[digest(path.read_bytes())] = len(rows)
                key = (row.get("destination", "other").lower(), row.get("orientation", "L"))
                try: numbers[key] = max(numbers[key], int(re.search(r"\d+", row["filename"]).group()))
                except Exception: pass

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        queue = [SOURCE]
        seen: set[str] = set()
        while queue and len(seen) < 300:
            url = safe_page_url(queue.pop(0))
            if url in seen: continue
            seen.add(url); visited.append(url)
            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=45000)
                if response and response.status >= 400:
                    failed_pages.append((url, f"HTTP {response.status}")); continue
                try: page.wait_for_load_state("networkidle", timeout=12000)
                except PlaywrightTimeout: pass
                # Trigger lazy-loaded gallery items with ordinary scrolling.
                for _ in range(12):
                    page.evaluate("window.scrollBy(0, Math.max(500, window.innerHeight * .8))")
                    page.wait_for_timeout(300)
                page.evaluate("window.scrollTo(0, 0)")
                title = page.title()
                text = page.locator("body").inner_text(timeout=8000)
                if "cloudflare" in (title + text[:1000]).lower() or "verify you are human" in text[:2000].lower():
                    failed_pages.append((url, "Access challenge shown; stopped without attempting to bypass it")); continue

                # Follow only links within this publicly supplied media-centre path.
                hrefs = page.locator("a[href]").evaluate_all("els => els.map(a => a.href)")
                for href in hrefs:
                    href = safe_page_url(href)
                    parsed = urlparse(href)
                    if parsed.netloc == "app.snapsea.io" and parsed.path.startswith("/p/media-centre/bhutan-tourism/") and href not in seen:
                        queue.append(href)

                candidates = page.locator("img").evaluate_all("""els => els.map(img => {
                    let node=img, context='';
                    for(let i=0;i<4 && node;i++,node=node.parentElement){
                      context += ' ' + (node.innerText || '');
                      if(node.tagName==='FIGURE') break;
                    }
                    return {src:img.currentSrc||img.src, srcset:img.srcset, alt:img.alt||'', title:img.title||'', context};
                })""")
                usable = []
                for img in candidates:
                    src = img.get("src", "")
                    if not src or src.startswith("data:"): continue
                    combined = " ".join([img.get("alt", ""), img.get("title", ""), img.get("context", "")]).strip()
                    low = (src + " " + combined).lower()
                    if any(x in low for x in ["logo", "avatar", "icon", "sprite", "tracking", "pixel", "placeholder"]): continue
                    srcset = img.get("srcset", "")
                    if srcset:
                        choices = []
                        for item in srcset.split(","):
                            bits = item.strip().split()
                            if bits:
                                width = int(re.sub(r"\D", "", bits[1])) if len(bits) > 1 else 0
                                choices.append((width, urljoin(url, bits[0])))
                        if choices: src = max(choices)[1]
                    src = urljoin(url, src)
                    parsed = urlparse(src)
                    if parsed.scheme in ("http", "https"):
                        usable.append((src, combined or title or text[:600]))
                if not usable and not text.strip():
                    failed_pages.append((url, "Page shell loaded without visible text or image elements")); continue
                processed.append(url)

                for src, context_text in usable:
                    discovered.setdefault(src, {"page": url, "context": context_text})
                for src, meta in list(discovered.items()):
                    if meta.get("done"): continue
                    try:
                        response = context.request.get(src, timeout=30000)
                        if not response.ok: raise RuntimeError(f"HTTP {response.status}")
                        data = response.body()
                        image = Image.open(__import__('io').BytesIO(data)); image.load()
                        fmt = (image.format or "").upper()
                        if fmt not in EXTENSIONS: raise RuntimeError(f"Unsupported image format {fmt or 'unknown'}")
                        width, height = image.size
                        orientation = "P" if height > width else "L"  # square uses L
                        location, note = classify(meta["context"] + " " + url)
                        h = digest(data)
                        if h in saved_hashes:
                            duplicates += 1
                            rows.append(dict(filename="", destination=location, orientation=orientation,
                                width=width, height=height, file_size_bytes=len(data), image_format=fmt,
                                original_image_url=src, source_page_url=meta["page"], download_status="skipped",
                                duplicate_status="exact duplicate SHA-256", notes=note))
                        else:
                            numbers[(location, orientation)] += 1
                            folder = "Other" if location == "other" else location.title()
                            folder_path = OUTPUT / folder; folder_path.mkdir(exist_ok=True)
                            name = f"{location}{numbers[(location, orientation)]}{orientation}{EXTENSIONS[fmt]}"
                            dest = folder_path / name
                            while dest.exists():
                                numbers[(location, orientation)] += 1
                                name = f"{location}{numbers[(location, orientation)]}{orientation}{EXTENSIONS[fmt]}"
                                dest = folder_path / name
                            dest.write_bytes(data); saved_hashes[h] = len(rows)
                            rows.append(dict(filename=name, destination=folder, orientation=orientation,
                                width=width, height=height, file_size_bytes=len(data), image_format=fmt,
                                original_image_url=src, source_page_url=meta["page"], download_status="downloaded",
                                duplicate_status="unique", notes=note + ("; square treated as landscape" if width == height else "")))
                        meta["done"] = True
                        time.sleep(.2)
                    except Exception as e:
                        failed_downloads += 1
                        rows.append(dict(filename="", destination="Other", orientation="", width="", height="",
                            file_size_bytes="", image_format="", original_image_url=src, source_page_url=meta["page"],
                            download_status="failed", duplicate_status="", notes=str(e)))
                        meta["done"] = True
            except Exception as e:
                failed_pages.append((url, str(e)))
        browser.close()

    with MANIFEST.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=HEADERS); writer.writeheader(); writer.writerows(rows)
    downloaded = [r for r in rows if r.get("download_status") == "downloaded"]
    counts = defaultdict(int)
    for row in downloaded: counts[row["destination"]] += 1
    portrait = sum(r["orientation"] == "P" for r in downloaded)
    landscape = sum(r["orientation"] == "L" for r in downloaded)
    squares = sum(r["width"] == r["height"] for r in downloaded)
    lines = ["# Snapsea Bhutan Tourism image download report", "",
             f"Source: {SOURCE}", "", f"- Pages discovered/visited: {len(visited)}",
             f"- Pages successfully processed: {len(processed)}", f"- Images discovered: {len(discovered)}",
             f"- Images successfully downloaded: {len(downloaded)}", f"- Exact duplicates skipped: {duplicates}",
             f"- Failed image downloads: {failed_downloads}", f"- Portrait images: {portrait}",
             f"- Landscape images (including square): {landscape}", f"- Square images: {squares}",
             "- Square orientation convention: saved with L suffix.", "", "## Saved by destination", ""]
    lines += [f"- {name}: {n}" for name, n in sorted(counts.items())] or ["- None"]
    lines += ["", "## Visited pages", ""] + [f"- {u}" for u in visited]
    lines += ["", "## Pages not processed", ""] + ([f"- {u} — {reason}" for u, reason in failed_pages] or ["- None"])
    lines += ["", "## Notes", "", "The script uses an unauthenticated browser session and follows only publicly rendered media-centre pages under the supplied Bhutan Tourism path. It does not bypass access controls or challenges. Locations are based on page text, captions, and alt text; uncertain images go to Other.", ""]
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Visited {len(visited)} pages; downloaded {len(downloaded)} images; report: {REPORT}")


if __name__ == "__main__":
    main()
