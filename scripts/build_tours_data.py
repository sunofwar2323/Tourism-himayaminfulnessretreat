#!/usr/bin/env python3
"""Parse the New Blenders package catalogue into JSON and a file://-safe JS mirror."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "website info " / "bhutan-tours-packages-new-blenders.md"
JSON_OUT = ROOT / "tours.json"
JS_OUT = ROOT / "tours-data.js"

# TODO: Confirm whether the Jambay listing is an 11-day or 8-day product before publishing.
# TODO: Confirm whether rafting is included in NB-ADV-002; source activity and exclusion conflict.

SOURCE_CATEGORIES = {
    "CLS": "Culture / Classic",
    "FES": "Festival",
    "TRE": "Trekking",
    "NAT": "Nature / Birding",
    "ADV": "Cycling / River",
}

# Customer-facing categories are based on each package's actual central itinerary.
# Adventure and nature packages are grouped together, following the supplied reference.
CATEGORIES = {
    "CLS": "Cultural Immersion",
    "FES": "Festival & Tshechu",
    "TRE": "Trekking",
    "NAT": "Adventure & Nature",
    "ADV": "Adventure & Nature",
}

CATEGORY_DEFINITIONS = [
    {"name": "Cultural Immersion", "slug": "cultural-immersion", "icon": "◉", "imageKey": "dzong", "description": "Explore Bhutan’s dzongs, monasteries, valleys and living heritage through journeys shaped around culture."},
    {"name": "Festival & Tshechu", "slug": "festival-tshechu", "icon": "✺", "imageKey": "people", "description": "Plan around Bhutan’s sacred festivals and seasonal gatherings, with dates confirmed for your journey."},
    {"name": "Trekking", "slug": "trekking", "icon": "⌁", "imageKey": "trek", "description": "Follow mountain trails from forested paths to remote high-altitude expeditions."},
    {"name": "Adventure & Nature", "slug": "adventure-nature", "icon": "❋", "imageKey": "forest", "description": "Discover Bhutan’s wild landscapes through birding, botanical journeys, cycling and river travel."},
]


def plain(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\*\*(.*?)\*\*|__(.*?)__", lambda m: m.group(1) or m.group(2), text)
    text = re.sub(r"(?<!\*)\*(?!\*)(.*?)\*(?!\*)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def split_sections(block: str) -> dict[str, str]:
    matches = list(re.finditer(r"^####\s+(.+?)\s*$", block, re.M))
    result: dict[str, str] = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(block)
        result[plain(match.group(1)).lower()] = block[match.end():end].strip()
    return result


def front_fields(block: str) -> dict[str, str]:
    head = re.split(r"^####\s+", block, maxsplit=1, flags=re.M)[0]
    fields = {}
    for line in head.splitlines():
        match = re.match(r"\s*\*\*([^*]+):\*\*\s*(.*?)\s*$", line)
        if match:
            fields[plain(match.group(1)).lower()] = plain(match.group(2))
    return fields


def field(fields: dict[str, str], *needles: str) -> str:
    for key, value in fields.items():
        if any(needle in key for needle in needles):
            return value
    return ""


def section(sections: dict[str, str], *needles: str) -> str:
    for key, value in sections.items():
        if any(needle in key for needle in needles):
            return value
    return ""


def bullet_items(raw: str) -> list[str]:
    return [plain(match.group(1)) for match in re.finditer(r"^\s*[-*+]\s+(.+?)\s*$", raw, re.M) if plain(match.group(1))]


def destinations(raw: str) -> list[str]:
    if not raw or re.search(r"not specified|not fully|to verify|not confirmed", raw, re.I):
        # Keep useful known places even when the rest of the route is explicitly incomplete.
        known = re.findall(r"\b(?:Paro|Thimphu|Punakha|Phobjikha(?: Valley)?|Haa(?: Valley)?|Bumthang|Trashigang|Trashi Yangtse|Mongar|Lhuentse|Wangdue Phodrang|Trongsa|Gasa|Laya|Samdrup Jongkhar)\b", raw, re.I)
        return list(dict.fromkeys(known))
    raw = re.sub(r"\s*\([^)]*\)", "", raw)
    return [plain(x).strip(" ,.;") for x in re.split(r",|\band\b", raw) if plain(x).strip(" ,.;")]


def number_after(text: str) -> float | None:
    match = re.search(r"(?<![\w/])([0-9][0-9,]*(?:\.[0-9]+)?)", text)
    if not match:
        return None
    return float(match.group(1).replace(",", ""))


def proposed_price(fields: dict[str, str]) -> float | None:
    value = field(fields, "proposed price")
    if not value:
        combined = field(fields, "original / proposed price", "original/proposed price", "original / proposed")
        if combined:
            value = combined.split("/", 1)[-1]
    if not value or re.search(r"quotation|required|not specified", value, re.I):
        return None
    rounded = re.search(r"rounded to\s*([0-9,]+(?:\.[0-9]+)?)", value, re.I)
    if rounded:
        return float(rounded.group(1).replace(",", ""))
    return number_after(value)


def pricing_label(fields: dict[str, str], value: float | None) -> str:
    if value is None:
        return "Quotation required"
    return f"{value:,.2f}".rstrip("0").rstrip(".")


def itinerary_items(raw: str) -> list[dict]:
    if not raw:
        return []
    matches = list(re.finditer(r"^\s*\*\*((?:Days?|Day\s+\d+)[^*]*)\*\*\s*$", raw, re.M | re.I))
    if not matches:
        return []
    days = []
    for i, match in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
        chunk = raw[match.end():end]
        title = plain(match.group(1)).strip(" :—–-")
        range_match = re.search(r"\b(\d+)\s*[–-]\s*(\d+)\b", title)
        day_match = re.search(r"\b(\d+)\b", title)
        day_value = f"{range_match.group(1)}–{range_match.group(2)}" if range_match else int(day_match.group(1)) if day_match else len(days) + 1
        days.append({
            "day": day_value,
            "title": re.sub(r"^Day\s+\d+\s*[:—–-]?\s*", "", title, flags=re.I) or title,
            "details": bullet_items(chunk),
        })
    return [day for day in days if day["details"]]


def list_section(sections: dict[str, str], pattern: str) -> list[str]:
    raw = section(sections, pattern)
    if not raw:
        return []
    # A combined section may label both lists inline.
    label = re.search(rf"(?is)(?:\*\*)?{pattern}(?:\*\*)?\s*:?(.*?)(?=(?:\*\*)?(?:exclusions|inclusions)(?:\*\*)?\s*:|$)", raw)
    if label:
        raw = label.group(1)
    items = bullet_items(raw)
    if items:
        return items
    if re.search(r"not specified|not available|not fully available", plain(raw), re.I):
        return []
    paragraph = plain(raw)
    return [paragraph] if paragraph else []


def parse_package(match: re.Match, end: int, source: str) -> dict:
    package_id, name = match.group(1), match.group(2).strip()
    block = source[match.start():end].strip()
    fields, sections = front_fields(block), split_sections(block)
    code = package_id.split("-")[1]

    duration = field(fields, "duration")
    if not duration:
        duration = "Details on request"
    conflict = bool(re.search(r"conflict|11 days.*8 days|8 days.*11 days", duration, re.I))
    days_match = re.search(r"\b(\d+)\s*days?\b", duration, re.I)
    duration_days = int(days_match.group(1)) if days_match and not conflict else None

    overview_raw = section(sections, "overview")
    overview_lines = [line for line in overview_raw.splitlines() if line.strip() and not line.lstrip().startswith("#")]
    overview = plain(" ".join(overview_lines))
    overview = re.sub(r"\s*\*\*[^*]*\*\*\s*", " ", overview).strip()

    highlights_raw = section(sections, "highlight")
    highlights = bullet_items(highlights_raw)
    if not highlights and highlights_raw:
        first = plain(highlights_raw)
        if first and not re.search(r"not available|not specified|confirm|verification required", first, re.I):
            highlights = [first]

    itinerary = itinerary_items(section(sections, "day-by-day itinerary", "itinerary and practical details", "itinerary"))
    source_urls = re.findall(r"https?://[^\s)]+", block)
    source_urls = [url.rstrip(".;,") for url in source_urls]
    notes = []
    verification = section(sections, "source and verification notes", "source and verification note")
    if verification:
        notes.append(plain(verification))
    for key in ("destinations", "duration", "difficulty", "best season", "original / proposed price"):
        if key in fields and re.search(r"not specified|to verify|conflict|not confirmed", fields[key], re.I):
            notes.append(f"{key}: {fields[key]}")
    if package_id == "NB-CLS-007":
        notes.append("Source catalogue identifies this as the same underlying itinerary as NB-CLS-002; do not market separately without operator confirmation.")
    if package_id == "NB-FES-005":
        notes.append("Duration conflict: one listing says 11 days and a related listing says 8 days / 7 nights.")
    if package_id == "NB-ADV-002":
        notes.append("Source lists rafting as an exclusion even though rafting appears in the tour activities.")

    source_category = SOURCE_CATEGORIES[code]
    category = CATEGORIES[code]
    proposed = proposed_price(fields)
    original_text = field(fields, "original price")
    if not original_text:
        original_text = field(fields, "original / proposed price", "original/proposed price")
        if "/" in original_text:
            original_text = original_text.split("/", 1)[0]
    proposed_text = field(fields, "proposed price") or field(fields, "original / proposed price", "original/proposed price")
    basis = field(fields, "pricing basis") or "Not specified"

    incl = list_section(sections, "inclusions")
    excl = list_section(sections, "exclusions")
    if package_id == "NB-ADV-002":
        # Preserve the source text in the hidden verification notes; suppress its contradictory public list.
        excl = [item for item in excl if not re.search(r"rafting", item, re.I)]

    title = name
    practical_raw = section(sections, "practical travel information")
    practical_items = bullet_items(practical_raw)
    practical_info = " ".join(practical_items) if practical_items else plain(practical_raw)
    if re.search(r"not specified|not available|not fully available", practical_info, re.I):
        practical_info = ""

    return {
        "id": package_id,
        "slug": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"),
        "name": title,
        "category": category,
        "sourceCategory": source_category,
        "duration": duration,
        "durationDays": duration_days,
        "destinations": destinations(field(fields, "destinations")),
        "travelStyle": field(fields, "travel style") or None,
        "difficulty": field(fields, "difficulty") or None,
        "bestSeason": field(fields, "best season") or None,
        "originalPrice": number_after(original_text) if original_text and not re.search(r"not specified", original_text, re.I) else None,
        "proposedPrice": proposed,
        "proposedPriceDisplay": pricing_label(fields, proposed),
        "currency": None,
        "pricingBasis": basis,
        "singleSupplement": field(fields, "single supplement") or None,
        "overview": overview,
        "highlights": highlights,
        "itinerary": itinerary,
        "inclusions": incl,
        "exclusions": excl,
        "practicalInfo": practical_info or None,
        "verificationNotes": notes,
        "sourceUrls": source_urls,
        "imageKey": {"Culture / Classic": "culture", "Festival": "festival", "Trekking": "trekking", "Nature / Birding": "nature", "Cycling / River": "river"}[source_category],
        "isAlias": package_id == "NB-CLS-007",
        "showPublicly": package_id != "NB-CLS-007",
        "durationNeedsConfirmation": conflict,
        "currencyNeedsConfirmation": proposed is not None,
        "displayExclusionsOnRequest": package_id == "NB-ADV-002",
    }


def main() -> None:
    text = SOURCE.read_text(encoding="utf-8")
    starts = list(re.finditer(r"^### (NB-[A-Z]+-\d+) — (.+?)\s*$", text, re.M))
    tours = []
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else text.find("\n## 9. Coverage Report", match.start())
        if end < 0:
            end = len(text)
        tours.append(parse_package(match, end, text))
    JSON_OUT.write_text(json.dumps(tours, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    JS_OUT.write_text("// Generated from website info /bhutan-tours-packages-new-blenders.md. Do not edit by hand.\nwindow.NB_TOURS = " + json.dumps(tours, ensure_ascii=False, separators=(",", ":")) + ";\nwindow.NB_TOUR_CATEGORIES = " + json.dumps(CATEGORY_DEFINITIONS, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    visible = sum(1 for tour in tours if tour["showPublicly"])
    print(f"Generated {len(tours)} tour records ({visible} public; {len(tours)-visible} alias/verification record).")
    # tours-data.js is served to browsers: strip research fields and internal wording (needs Node).
    subprocess.run(["node", str(ROOT / "scripts" / "publicise_tours.js")], check=True)


if __name__ == "__main__":
    main()
