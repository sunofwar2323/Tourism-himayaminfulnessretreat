# Himalaya Mindfulness Retreat · Bhutan journeys

A responsive, multi-page tourism website concept built with plain HTML, CSS, and JavaScript. The destination and brand direction are placeholders based on the tourism project context; replace them with the client's approved details before launch.

## Pages

- `index.html` — Home
- `about.html` — About us
- `destinations.html` — Filterable destination directory
- `destination-detail.html?place=paro` — Destination detail template
- `categories.html` — Travel styles
- `packages.html` — Filterable tour packages
- `package-detail.html?trip=bhutan-essentials` — Package detail template
- `travel-info.html` — Editorial Bhutan visa, immigration, and entry guide
- `contact.html` — Contact and enquiry form

The Travel Information page uses `travel-info.js` for its layout and interactions, `travel-info.css` for its editorial styling, and `travel-info-data.js` as a structured copy of the publishable sections from `website info /bhutan-travel-visa-and-immigration-guide.md`. Sections 12 and 15 and the document scope are excluded from the page. After editing the source Markdown, run `python3 scripts/build_travel_info_data.py` to regenerate the page data.

## Himalaya Mindfulness Retreat tour collection

The `packages.html` and `package-detail.html?trip=<slug>` routes use `packages.js` and `packages.css`, while reusing the shared site header, footer, fonts, and palette. Tour copy is parsed from `website info /bhutan-tours-packages-new-blenders.md` into `tours.json`; `tours-data.js` is a generated mirror so the page also works when opened directly with `file://`. The schema is documented in `tours.d.ts`. The catalogue uses four itinerary-led browse categories: Cultural Immersion, Festival & Tshechu, Trekking, and Adventure & Nature. `categories.html` reads the same generated tour data so its counts and links stay in sync with the package listing. Each tour also retains its source category label.

After editing the tour Markdown, regenerate the structured data with:

```sh
python3 scripts/build_tours_data.py
```

The source catalogue contains 26 IDs, including one explicitly identified alias. The listing omits that alias and shows 25 public journeys. Currency, pricing basis, missing itinerary days and unconfirmed details remain marked for follow-up. Package pages use GSAP 3.12.5 from cdnjs when available; CSS/IntersectionObserver fallbacks keep the page usable if the animation scripts cannot load. Images are configured as swappable Unsplash URLs in `packages.js`.

## Preview

From this folder, run `python3 -m http.server 8000` and open `http://localhost:8000`.

## Before launch

Replace `Himalaya Mindfulness Retreat`, `[CLIENT]`, sample contact details, office location, social links, team profiles, partner marks, statistics, testimonial copy, itinerary details, and starting prices with client-approved information. The contact, package enquiry, and newsletter forms currently show demo responses and need to be connected to an inbox or service. Review all travel and entry information against official sources. Photos currently load from Unsplash; use licensed, client-approved images and provide final destination-specific alt text.
# Tourism-himayaminfulnessretreat
