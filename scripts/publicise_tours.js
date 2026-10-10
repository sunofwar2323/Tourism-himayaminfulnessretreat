#!/usr/bin/env node
/* Rewrites tours-data.js so the browser only receives publishable fields and copy.
   Research fields (source URLs, verification notes, original/proposed prices, supplements) stay in tours.json,
   which is never deployed. Copy is cleaned with the same rules packages.js applies on screen, so the
   rendered pages do not change. Edited copy from content/tours-editorial.json is then applied on top.
   Safe to run repeatedly.
   Usage: node scripts/publicise_tours.js [path/to/tours-data.js] */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_FIELDS = ['id', 'slug', 'name', 'category', 'duration', 'durationDays', 'destinations', 'travelStyle', 'difficulty', 'bestSeason', 'overview', 'highlights', 'itinerary', 'inclusions', 'exclusions', 'practicalInfo', 'imageKey', 'showPublicly', 'durationNeedsConfirmation', 'displayExclusionsOnRequest'];

function load(file, context) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

function textTools() {
  const noop = () => {};
  const element = { classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, style: {}, setAttribute: noop };
  const window = {
    matchMedia: () => ({ matches: false, addEventListener: noop }),
    addEventListener: noop,
    dispatchEvent: noop,
    CustomEvent: function () {},
    NB_TOURS: [],
    document: { documentElement: element, body: element, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, createElement: () => element, head: element },
  };
  window.window = window;
  Object.assign(window, { location: { search: '', pathname: '/' }, URLSearchParams, matchMedia: window.matchMedia });
  const context = vm.createContext(window);
  load(path.join(ROOT, 'packages.js'), context);
  if (!window.HMR_TOURTEXT) throw new Error('packages.js did not expose HMR_TOURTEXT');
  return window.HMR_TOURTEXT;
}

const EDITORIAL_FILE = path.join(ROOT, 'content', 'tours-editorial.json');
const EDITORIAL_FIELDS = ['overview', 'travelStyle', 'highlights', 'itinerary', 'inclusions', 'exclusions', 'practicalInfo'];

/* Replaces published copy with the edited text in content/tours-editorial.json. Every string must already be
   in the form packages.js renders, so nothing is rewritten or dropped on screen, and day numbers must match. */
function applyEditorial(tours, categories, tools) {
  if (!fs.existsSync(EDITORIAL_FILE)) return;
  const { shared = {}, tours: entries = {}, categories: categoryCopy = {} } = JSON.parse(fs.readFileSync(EDITORIAL_FILE, 'utf8'));
  for (const [slug, description] of Object.entries(categoryCopy)) {
    const category = categories.find(item => item.slug === slug);
    if (!category) throw new Error(`Editorial copy for unknown category ${slug}`);
    category.description = description;
  }
  const byId = new Map(tours.map(tour => [tour.id, tour]));
  const resolve = (value, where) => {
    if (typeof value !== 'string' || !value.startsWith('@')) return value;
    if (!Array.isArray(shared[value.slice(1)])) throw new Error(`${where}: unknown shared list ${value}`);
    return shared[value.slice(1)];
  };
  const checkText = (text, where, tour) => {
    if (typeof text !== 'string' || !text) throw new Error(`${where}: expected text`);
    if (tools.cleanText(text) !== text || !tools.cleanList([text], tour).length) throw new Error(`${where}: text would change on screen: "${text}"`);
    return text;
  };
  for (const [id, entry] of Object.entries(entries)) {
    const tour = byId.get(id);
    if (!tour) throw new Error(`Editorial copy for unknown tour ${id}`);
    for (const key of Object.keys(entry)) if (key !== 'reviewNotes' && !EDITORIAL_FIELDS.includes(key)) throw new Error(`${id}: unknown field ${key}`);
    for (const key of ['overview', 'practicalInfo', 'travelStyle']) if (key in entry) tour[key] = checkText(entry[key], `${id}.${key}`, tour);
    for (const key of ['highlights', 'inclusions', 'exclusions']) {
      if (!(key in entry)) continue;
      const list = resolve(entry[key], `${id}.${key}`);
      if (!Array.isArray(list)) throw new Error(`${id}.${key}: expected a list`);
      tour[key] = list.map((text, i) => checkText(text, `${id}.${key}[${i}]`, tour));
    }
    if ('itinerary' in entry) {
      const before = tour.itinerary.map(day => String(day.day)).join(',');
      const after = entry.itinerary.map(day => String(day.day)).join(',');
      if (before !== after) throw new Error(`${id}: itinerary days ${after} do not match ${before}`);
      tour.itinerary = entry.itinerary.map((day, i) => ({ day: tour.itinerary[i].day, title: day.title, details: day.details.map((text, j) => checkText(text, `${id}.itinerary[${i}].details[${j}]`, tour)) }));
    }
  }
}

function publicise(file = path.join(ROOT, 'tours-data.js')) {
  const context = vm.createContext({ window: {} });
  load(file, context);
  const { NB_TOURS: tours, NB_TOUR_CATEGORIES: categories } = context.window;
  const tools = textTools();
  /* Some rewrites only match after an earlier one has run, so clean twice to reach a stable result. */
  const T = { ...tools, cleanText: text => tools.cleanText(tools.cleanText(text)), cleanList: (lines, tour) => tools.cleanList(tools.cleanList(lines, tour), tour) };
  const value = text => {
    if (!text || /not specified|not available|not confirmed|to verify|not fully/i.test(text)) return null;
    return T.cleanText(String(text).replace(/\s*\((?:[^)]*\bsource\b[^)]*|related-trip listing)\)/gi, '')).replace(/\.$/, '') || null;
  };
  const publicTours = tours.filter(tour => tour.showPublicly).map(tour => {
    const out = Object.fromEntries(PUBLIC_FIELDS.map(key => [key, tour[key] ?? null]));
    out.overview = T.cleanText(T.displayOverview(tour));
    out.highlights = T.cleanList(tour.highlights, tour);
    out.inclusions = T.cleanList(tour.inclusions, tour);
    out.exclusions = T.cleanList(tour.exclusions, tour);
    out.practicalInfo = T.cleanText(tour.practicalInfo) || null;
    out.itinerary = (tour.itinerary || []).map(day => ({ day: day.day, title: T.cleanText(day.title).replace(/\.$/, '') || 'Journey details', details: T.cleanList(day.details, tour) }));
    out.destinations = T.publicPlaces(tour);
    for (const key of ['duration', 'difficulty', 'bestSeason', 'travelStyle']) out[key] = value(tour[key]);
    return out;
  });
  applyEditorial(publicTours, categories, tools);
  const leak = JSON.stringify(publicTours).match(/https?:\/\/|\bsource\b|verification|originalPrice|proposed/i);
  if (leak) throw new Error(`Public tour data still contains "${leak[0]}"`);
  fs.writeFileSync(file, `// Public tour data generated by scripts/publicise_tours.js. Do not edit by hand.\nwindow.NB_TOURS = ${JSON.stringify(publicTours)};\nwindow.NB_TOUR_CATEGORIES = ${JSON.stringify(categories)};\n`);
  return publicTours.length;
}

if (require.main === module) console.log(`Wrote ${publicise(process.argv[2] && path.resolve(process.argv[2]))} public tours.`);
module.exports = { publicise };
