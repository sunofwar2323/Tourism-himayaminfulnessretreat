# Himalaya Mindfulness Retreat · Bhutan journeys

Website for Himalaya Mindfulness Retreat Tours & Travels, Thimphu. Plain HTML, CSS and JavaScript with no runtime dependencies; a small Node build script prepares the deployable copy.

## Pages

- `index.html`: home
- `about.html`: about us, founder and business licence
- `destinations.html` and `destination-detail.html?place=<id>`: destination guides
- `categories.html` and `categories.html?category=<slug>`: travel styles
- `packages.html` and `package-detail.html?trip=<slug>`: journeys
- `travel-info.html`: Bhutan visa, immigration and entry guide
- `contact.html`: enquiry form
- `privacy.html`, `terms.html`, `404.html`: static pages

`site.js` renders the shared header and footer, the contact page and the enquiry sender. Page scripts (`home.js`, `about.js`, `discover.js`, `journeys.js`, `packages.js`, `travel-info.js`) render their own content. Fonts (`fonts/`) and GSAP 3.12.5 (`vendor/gsap/`) are self-hosted; nothing loads from third-party servers except the enquiry form submission.

## Preview

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Enquiry forms

The contact form and the journey enquiry form post to [FormSubmit](https://formsubmit.co) (`ENQUIRY_INBOX` in `site.js`). If the request fails, visitors are offered a prefilled email link instead.

The first submission from the live site triggers a FormSubmit activation email to the inbox. Click the link in that email or no enquiries will be delivered. After activation FormSubmit also offers a random alias for the address; replacing the email in `ENQUIRY_INBOX` with that alias keeps the address out of the page source.

## Tour data

Tour research lives in `website info /bhutan-tours-packages-new-blenders.md` (kept out of git). To regenerate the data after editing it:

```sh
python3 scripts/build_tours_data.py
```

This writes the full research record to `tours.json` (private, kept out of git) and then runs `scripts/publicise_tours.js`, which writes `tours-data.js` with public fields only: no source URLs, verification notes or unconfirmed prices. Only `tours-data.js` is deployed.

The travel guide data is regenerated with `python3 scripts/build_travel_info_data.py`.

## Deploying on Vercel

`vercel.json` runs `node scripts/build.js` and serves `dist/`. The build:

- copies only public files into `dist/`;
- makes canonical, Open Graph and JSON-LD URLs absolute;
- writes `robots.txt` and `sitemap.xml` (pages, destination guides, travel styles and journeys);
- re-checks `tours-data.js` and fails if private research data or Unsplash URLs appear in the output.

Set the `SITE_URL` environment variable in Vercel to the final domain, for example `https://www.example.com`. Without it the build uses the project's Vercel production domain.

`vercel.json` also sets the Content Security Policy and other security headers. If you add a third-party service (analytics, maps, chat), add its domain to the policy or the browser will block it.

## Images

Photos are stored locally in `Image/` as WebP sizes. Their licences and credits are listed in `Image/*/credits.json` and shown on the pages. Add new photos only when their licence allows reuse, and credit them the same way.
