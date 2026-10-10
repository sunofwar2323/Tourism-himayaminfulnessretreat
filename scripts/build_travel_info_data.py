#!/usr/bin/env python3
"""Generate the publishable Travel Information data from the source Markdown."""

from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "website info " / "bhutan-travel-visa-and-immigration-guide.md"
OUTPUT = ROOT / "travel-info-data.js"


def main() -> None:
    markdown = SOURCE.read_text(encoding="utf-8")
    important = re.search(r"^> \*\*Important:\*\* (.*(?:\n> .*)*)", markdown, re.M).group(1)
    important = important.replace("\n> ", " ")
    verified = re.search(r"^\*\*Last official verification:\*\* (.+)$", markdown, re.M).group(1)
    core = re.search(r"^\*\*Core distinction:\*\* (.+)$", markdown, re.M).group(1)
    glance = re.search(
        r"^## Key Entry Requirements at a Glance\n\n(.*?)(?=^\*\*Core distinction:\*\*)",
        markdown,
        re.M | re.S,
    ).group(1).strip()

    sections = []
    for match in re.finditer(r"^## (.+?)\n(.*?)(?=^## |\Z)", markdown, re.M | re.S):
        title, body = match.group(1), match.group(2).strip()
        number = re.match(r"(\d+)\.", title)
        if number and (int(number.group(1)) <= 11 or int(number.group(1)) in (13, 14)):
            sections.append({"number": int(number.group(1)), "title": title, "body": body})

    data = {
        "last_verified": verified,
        "important": important,
        "core_distinction": core,
        "glance_table": glance,
        "sections": sections,
    }
    OUTPUT.write_text(
        "window.TRAVEL_GUIDE_DATA = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(sections)} publishable sections to {OUTPUT.name}.")


if __name__ == "__main__":
    main()
