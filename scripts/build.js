#!/usr/bin/env node
/* Builds the deployable site into dist/.
   Only public files are copied: tours.json, scripts/, "website info/" and source images stay out.
   SITE_URL (e.g. https://www.example.com) sets canonical, Open Graph, JSON-LD, robots.txt and sitemap URLs.
   On Vercel it falls back to the production domain Vercel assigns to the project. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { publicise } = require('./publicise_tours');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ROOT_FILES = /\.(html|css|js)$/;
const ROOT_EXTRAS = ['site.webmanifest', 'favicon.ico'];
const DIRS = ['Image', 'fonts', 'vendor'];
const PRIVATE = new Set(['tours.d.ts']);
const EXCLUDED_ASSETS = new Set(['Image/Logo/about-us-founder.jpeg', 'Image/about/Founders-Image.png', 'Image/Logo/logo.png']);
const EXCLUDED_NAMES = new Set(['.DS_Store', 'credits.json']);
const LISTED_PAGES = ['index.html', 'about.html', 'destinations.html', 'categories.html', 'packages.html', 'travel-info.html', 'contact.html', 'privacy.html', 'terms.html'];

function siteUrl() {
  const raw = process.env.SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
  if (!raw) {
    console.warn('SITE_URL is not set; using http://localhost:8765 for absolute URLs.');
    return 'http://localhost:8765';
  }
  const url = new URL(raw);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') throw new Error(`SITE_URL must use https: ${raw}`);
  return url.origin;
}

function copyDir(rel) {
  for (const entry of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    const child = path.posix.join(rel, entry.name);
    if (EXCLUDED_NAMES.has(entry.name) || EXCLUDED_ASSETS.has(child)) continue;
    if (entry.isDirectory()) copyDir(child);
    else copyFile(child);
  }
}

function copyFile(rel) {
  const to = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(ROOT, rel), to);
}

function absolutise(html, site) {
  return html.replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, block =>
    block.replace(/"\//g, `"${site}/`).replace(/<!-- seo:start[^>]*-->/, '<!-- seo:start -->'));
}

function routes() {
  const window = {};
  const document = { addEventListener() {}, querySelector() { return null; }, documentElement: {} };
  const context = vm.createContext({ window, document, console, URL, URLSearchParams });
  for (const file of ['tours-data.js', 'hmr-data.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  const D = window.HMR_DATA;
  const tours = (window.NB_TOURS || []).filter(t => t.showPublicly !== false);
  if (!D || !tours.length) throw new Error('Could not load tour or destination data for the sitemap.');
  return [
    ...D.destinations.map(p => `destination-detail.html?place=${encodeURIComponent(p.id)}`),
    ...(window.NB_TOUR_CATEGORIES || []).map(c => `categories.html?category=${encodeURIComponent(c.slug)}`),
    ...tours.map(t => `package-detail.html?trip=${encodeURIComponent(t.slug)}`),
  ];
}

const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function build() {
  const site = siteUrl();

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  for (const name of fs.readdirSync(ROOT)) {
    if ((ROOT_FILES.test(name) && !PRIVATE.has(name)) || ROOT_EXTRAS.includes(name)) copyFile(name);
  }
  DIRS.forEach(copyDir);
  publicise(path.join(DIST, 'tours-data.js'));

  for (const name of fs.readdirSync(DIST).filter(n => n.endsWith('.html'))) {
    const file = path.join(DIST, name);
    fs.writeFileSync(file, absolutise(fs.readFileSync(file, 'utf8'), site));
  }

  const today = new Date().toISOString().slice(0, 10);
  const urls = [...LISTED_PAGES.map(p => (p === 'index.html' ? '' : p)), ...routes()];
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${xml(`${site}/${u}`)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

  const leaks = [];
  const scan = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return scan(p);
    if (!/\.(html|js|css|json|webmanifest|txt|xml)$/.test(e.name)) return;
    const text = fs.readFileSync(p, 'utf8');
    const patterns = e.name === 'tours-data.js' ? [/https?:\/\//, /verificationNotes/, /sourceUrls?/, /originalPrice|proposedPrice/] : [/images\.unsplash\.com/];
    for (const pattern of patterns) {
      if (pattern.test(text)) leaks.push(`${path.relative(DIST, p)}: ${pattern}`);
    }
  });
  scan(DIST);
  if (leaks.length) throw new Error(`Private or third-party data found in dist:\n${leaks.join('\n')}`);

  console.log(`Built dist/ for ${site}: ${urls.length} sitemap URLs.`);
}

build();
