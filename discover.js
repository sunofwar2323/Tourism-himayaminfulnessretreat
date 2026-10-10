/* Destinations, destination guides and travel-style categories.
   site.js renders these pages through window.HMR_DISCOVER; tour data comes from tours-data.js,
   place guides and photographs from hmr-data.js, and tour cards from journeys.js. */
(() => {
  'use strict';

  const D = window.HMR_DATA, T = window.HMR_TOURTEXT;
  if (!D || !T || !window.HMR_CARDS || !window.NB_TOURS) return;

  const tours = window.NB_TOURS.filter(tour => tour.showPublicly);
  const categories = window.NB_TOUR_CATEGORIES || [];
  const esc = T.escapeHtml;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const placeHref = id => `destination-detail.html?place=${encodeURIComponent(id)}`;
  const categoryHref = slug => `categories.html?category=${encodeURIComponent(slug)}`;
  const contactHref = (key, value) => `contact.html?${key}=${encodeURIComponent(value)}`;
  const inCategory = category => tours.filter(tour => tour.category === category.name);
  const regions = ['Western Bhutan', 'Central Bhutan', 'Eastern Bhutan'];
  const PRICED = tours.some(tour => tour.proposedPrice != null);
  const PRICE_NOTE = !PRICED ? '' : '<p class="jr-note"><sup>*</sup> Proposed prices are planning figures. The currency and pricing basis are not stated in the package information, so please confirm the amount, inclusions and current fees with us before booking. Journeys without a figure are priced on request.</p>';

  let C = null;
  const main = () => document.getElementById('main');

  const setMeta = (title, description, image) => D.setSeo({ title, description, image });
  const crumbs = items => `<nav class="dc-crumbs" aria-label="Breadcrumb"><ol>${items.map(([label, href]) => href ? `<li><a href="${href}">${esc(label)}</a></li>` : `<li aria-current="page">${esc(label)}</li>`).join('')}</ol></nav>`;
  const title = (first, second, id = 'dc-title') => `<h1 id="${id}" class="jr-title" tabindex="-1"><span class="jr-line"><span style="--d:80ms">${first}</span></span> <span class="jr-line"><em style="--d:200ms">${second}</em></span></h1>`;

  const closing = ({ eyebrow, heading, text, href, label, image, caption }) => `
    <section class="jr-closing dc-closing" aria-labelledby="dc-closing-title">
      <div class="jr-closing-copy" data-reveal>
        <p class="jr-eyebrow">${eyebrow}</p>
        <h2 id="dc-closing-title">${heading}</h2>
        <p>${text}</p>
        <div class="jr-closing-actions"><a class="button" href="${href}">${label} <span aria-hidden="true">→</span></a><a class="jr-textlink" href="packages.html">Browse all journeys</a></div>
        <ul class="jr-contact" role="list">
          <li><span>Call</span><a href="tel:+97517890334">+975 17890334</a></li>
          <li><span>Email</span><a href="mailto:himalayamindfulnessretreat@gmail.com">himalayamindfulnessretreat@gmail.com</a></li>
        </ul>
      </div>
      <figure class="jr-closing-media">
        <div class="jr-closing-frame" data-reveal="mask"><div class="jr-drift" data-drift="0.05">${C.img(image, '(min-width: 1101px) 55vw, 100vw')}</div></div>
        <figcaption>${esc(caption)}</figcaption>
      </figure>
    </section>`;

  /* ---------- Destinations overview ---------- */

  function destinationCard(place, index) {
    const count = D.toursIn(place.id, tours).length;
    return `<li class="dc-card" data-region="${esc(place.region)}" data-reveal style="--d:${(index % 2) * 120}ms">
      <article>
        <a class="dc-card-media" href="${placeHref(place.id)}" tabindex="-1" aria-hidden="true">${C.img(place.cardImage, '(min-width: 1101px) 44vw, (min-width: 761px) 46vw, 92vw')}<span class="dc-card-no">${String(index + 1).padStart(2, '0')}</span></a>
        <div class="dc-card-body">
          <p class="dc-meta"><span>${esc(place.region)}</span><span>${count ? plural(count, 'journey') : 'Tailor-made on request'}</span></p>
          <h2 class="dc-card-title"><a href="${placeHref(place.id)}">${esc(place.name)}</a></h2>
          <p class="dc-card-text">${esc(place.summary)}</p>
          <ul class="dc-card-highlights" aria-label="Highlights in ${esc(place.name)}">${place.highlights.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          <a class="jr-textlink dc-card-cta" href="${placeHref(place.id)}">Explore Destination<span class="sr-only">: ${esc(place.name)}</span> <span aria-hidden="true">→</span></a>
        </div>
      </article>
    </li>`;
  }

  function destinationsPage() {
    setMeta('Bhutan destinations', 'Explore Paro, Thimphu, Punakha, Phobjikha, Bumthang, Haa, Trongsa and Trashigang: history, places to visit and the journeys that go there.');
    const linked = tours.filter(tour => D.destinationsOf(tour).length).length;
    const regionCount = region => D.destinations.filter(place => place.region === region).length;
    return `
      <section class="dc-hero" aria-labelledby="dc-title">
        <div class="dc-hero-copy">
          ${crumbs([['Home', 'index.html'], ['Destinations']])}
          <p class="jr-eyebrow jr-rise" style="--d:0ms">Destinations</p>
          ${title('Valleys that', 'tell stories.')}
          <p class="jr-lede jr-rise" style="--d:360ms">From the airport valley of Paro to the far east, each guide covers a place’s history, the sites worth knowing and the journeys that actually go there.</p>
          <p class="dc-hero-note jr-rise" style="--d:480ms">${plural(D.destinations.length, 'destination')} · ${plural(linked, 'journey')} with a named route</p>
        </div>
        <figure class="dc-hero-media">
          <div class="dc-hero-frame">${C.img('paro-valley', '(min-width: 1101px) 46vw, 100vw', { eager: true })}</div>
          <figcaption>The Paro valley from above</figcaption>
        </figure>
      </section>
      <section class="dc-list" aria-labelledby="dc-list-title">
        <header class="dc-list-head">
          <h2 id="dc-list-title" data-reveal>Where would you <em>like to begin?</em></h2>
          <div class="jr-tabs" role="group" aria-label="Filter destinations by region">
            <button type="button" class="jr-tab" data-region="all" aria-pressed="true">All regions <small>${D.destinations.length}</small></button>
            ${regions.map(region => `<button type="button" class="jr-tab" data-region="${esc(region)}" aria-pressed="false">${esc(region.replace(' Bhutan', ''))} <small>${regionCount(region)}</small></button>`).join('')}
          </div>
          <p class="dc-count" id="dc-count" aria-live="polite">Showing all ${plural(D.destinations.length, 'destination')}</p>
        </header>
        <ul class="dc-grid" role="list">${D.destinations.map(destinationCard).join('')}</ul>
        <p class="dc-list-note">Journey counts include only tours whose own route or itinerary names the destination. Some journeys do not publish a route yet, so ask us if you would like a place that is not listed.</p>
      </section>
      ${closing({ eyebrow: 'Plan your journey', heading: 'Combine places <em>your way.</em>', text: 'Most journeys link several valleys. Tell us which places draw you, and we will suggest a route that fits your time and pace.', href: 'contact.html', label: 'Plan My Bhutan Journey', image: 'gal-terraces', caption: 'Rice terraces · Sopsokha, Punakha' })}`;
  }

  function setupDestinations() {
    const tabs = [...document.querySelectorAll('.dc-list .jr-tab')];
    const cards = [...document.querySelectorAll('.dc-card')];
    const count = document.getElementById('dc-count');
    const apply = (region, write = true) => {
      if (region !== 'all' && !regions.includes(region)) region = 'all';
      tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.region === region)));
      let shown = 0;
      cards.forEach(card => { const on = region === 'all' || card.dataset.region === region; card.hidden = !on; if (on) { shown++; card.classList.add('is-in'); } });
      count.textContent = region === 'all' ? `Showing all ${plural(shown, 'destination')}` : `Showing ${plural(shown, 'destination')} in ${region}`;
      if (write) {
        const url = new URL(location.href);
        region === 'all' ? url.searchParams.delete('region') : url.searchParams.set('region', region.split(' ')[0].toLowerCase());
        history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      }
    };
    tabs.forEach(tab => tab.addEventListener('click', () => apply(tab.dataset.region)));
    const key = (new URLSearchParams(location.search).get('region') || '').toLowerCase();
    apply((key && regions.find(region => region.toLowerCase().startsWith(key))) || 'all', false);
  }

  /* ---------- Destination guide ---------- */

  function destinationMissing() {
    setMeta('Destination not found', 'Browse Bhutan destinations.');
    return `<section class="dc-missing" aria-labelledby="dc-title">
      ${crumbs([['Home', 'index.html'], ['Destinations', 'destinations.html'], ['Not found']])}
      <p class="jr-eyebrow">Destination not found</p>
      <h1 id="dc-title" class="jr-title" tabindex="-1">We don’t have a guide <em>for that place yet.</em></h1>
      <p class="jr-lede">Choose one of our destination guides below, or ask us about somewhere else in Bhutan.</p>
      <ul class="dc-more-list" role="list">${D.destinations.map(place => `<li><a href="${placeHref(place.id)}"><span>${esc(place.name)}</span><small>${esc(place.region)}</small></a></li>`).join('')}</ul>
      <a class="jr-textlink" href="contact.html">Ask about another place <span aria-hidden="true">→</span></a>
    </section>`;
  }

  function attraction(place, item, index) {
    const named = D.toursNaming(item, place.id, tours);
    return `<li class="dc-attraction" data-reveal style="--d:${(index % 3) * 90}ms">
      <div class="dc-attraction-media">${C.img(item.image, '(min-width: 1101px) 30vw, (min-width: 761px) 46vw, 92vw')}</div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.text)}</p>
      ${item.info ? `<p class="dc-attraction-info"><span>Visitor note</span>${esc(item.info)}</p>` : ''}
      ${named.length ? `<p class="dc-attraction-tours"><span>Named in the itinerary of</span>${named.map(tour => `<a href="${T.tourHref(tour)}">${esc(tour.name)}</a>`).join(', ')}</p>` : ''}
    </li>`;
  }

  function destinationPage() {
    const id = (new URLSearchParams(location.search).get('place') || '').toLowerCase();
    const place = D.destination(id);
    if (!place) return destinationMissing();
    setMeta(`${place.name}, Bhutan: places to visit & journeys`, place.summary);
    const list = D.toursIn(place.id, tours);
    const storyImage = place.places.find(item => item.image !== place.image)?.image || place.cardImage;
    const seasonal = list.map(tour => [tour, T.displayValue(tour.bestSeason, '')]).filter(([, season]) => season);
    const sections = [['history', 'History'], ['about', 'About'], ['places', 'Places to visit'], ['experiences', 'Experiences'], ['when', 'When to go'], ['journeys', 'Journeys'], ['plan', 'Plan']];
    const others = D.destinations.filter(item => item.id !== place.id);

    return `
      <section class="dc-dhero" aria-labelledby="dc-title">
        <div class="dc-dhero-media">${C.img(place.image, '100vw', { eager: true })}</div>
        <div class="dc-dhero-shade" aria-hidden="true"></div>
        <div class="dc-dhero-inner">
          ${crumbs([['Home', 'index.html'], ['Destinations', 'destinations.html'], [place.name]])}
          <p class="jr-eyebrow jr-eyebrow-light jr-rise" style="--d:0ms">${esc(place.region)}</p>
          <h1 id="dc-title" class="dc-dhero-title" tabindex="-1"><span class="jr-line"><span style="--d:100ms">${esc(place.name)}</span></span></h1>
          <p class="dc-dhero-lede jr-rise" style="--d:300ms">${esc(place.summary)}</p>
          <dl class="dc-dhero-facts jr-rise" style="--d:420ms">
            <div><dt>Region</dt><dd>${esc(place.region)}</dd></div>
            <div><dt>Places in this guide</dt><dd>${place.places.length}</dd></div>
            <div><dt>Journeys</dt><dd>${list.length || 'On request'}</dd></div>
          </dl>
        </div>
      </section>
      <nav class="dc-subnav" aria-label="On this page"><ul>${sections.map(([key, label]) => `<li><a href="#${key}">${label}</a></li>`).join('')}</ul></nav>

      <section class="dc-story" id="history" aria-labelledby="history-title">
        <div class="dc-story-copy" data-reveal>
          <p class="jr-eyebrow">History &amp; cultural significance</p>
          <h2 id="history-title">The story <em>of ${esc(place.name)}.</em></h2>
          ${place.history.map(text => `<p>${esc(text)}</p>`).join('')}
        </div>
        <figure class="dc-story-media">
          <div class="dc-story-frame" data-reveal="mask">${C.img(storyImage, '(min-width: 1101px) 42vw, 100vw')}</div>
          <figcaption>${esc(place.places.find(item => item.image === storyImage)?.name || place.name)}</figcaption>
        </figure>
      </section>

      <section class="dc-about" id="about" aria-labelledby="about-title">
        <div class="dc-about-head" data-reveal>
          <p class="jr-eyebrow">About the destination</p>
          <h2 id="about-title">${esc(place.name)} <em>today.</em></h2>
        </div>
        <div class="dc-about-copy" data-reveal style="--d:120ms">${place.about.map(text => `<p>${esc(text)}</p>`).join('')}</div>
        <ul class="dc-about-highlights" role="list" data-reveal style="--d:220ms">${place.highlights.map((item, i) => `<li><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(item)}</li>`).join('')}</ul>
      </section>

      <section class="dc-places" id="places" aria-labelledby="places-title">
        <header class="dc-section-head" data-reveal>
          <p class="jr-eyebrow">Places to visit</p>
          <h2 id="places-title">Worth <em>knowing.</em></h2>
          <p>Landmarks in and around ${esc(place.name)}. A place is linked to a journey only where that journey’s itinerary names it.</p>
        </header>
        <ul class="dc-attractions" role="list">${place.places.map((item, i) => attraction(place, item, i)).join('')}</ul>
      </section>

      <section class="dc-experiences" id="experiences" aria-labelledby="experiences-title">
        <header class="dc-section-head" data-reveal>
          <p class="jr-eyebrow jr-eyebrow-light">Things to experience</p>
          <h2 id="experiences-title">Moments <em>to look for.</em></h2>
          <p>What ${esc(place.name)} is known for. These are not automatically part of every journey; ask us to include what matters to you.</p>
        </header>
        <ol class="dc-experience-list">${place.experiences.map(([name, text], i) => `<li data-reveal style="--d:${i * 90}ms"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></li>`).join('')}</ol>
      </section>

      <section class="dc-seasons" id="when" aria-labelledby="when-title">
        <header class="dc-section-head" data-reveal>
          <p class="jr-eyebrow">Best time to visit</p>
          <h2 id="when-title">Through <em>the year.</em></h2>
          <p>General conditions across Bhutan’s seasons. Weather varies with altitude, so ask us about your exact dates.</p>
        </header>
        <ul class="dc-season-grid" role="list">${D.seasons.map(([name, months, text], i) => `<li data-reveal style="--d:${i * 80}ms"><h3>${name}</h3><small>${months}</small><p>${text}</p></li>`).join('')}</ul>
        ${place.seasonNote ? `<p class="dc-season-note" data-reveal><span>In ${esc(place.name)}</span>${esc(place.seasonNote)}</p>` : ''}
        ${seasonal.length ? `<div class="dc-season-tours" data-reveal><h3>Seasons listed for journeys here</h3><ul role="list">${seasonal.map(([tour, season]) => `<li><a href="${T.tourHref(tour)}">${esc(tour.name)}</a><span>${esc(season)}</span></li>`).join('')}</ul></div>` : ''}
      </section>

      <section class="jr-collection dc-journeys" id="journeys" aria-labelledby="journeys-title">
        <header class="jr-collection-head">
          <div data-reveal><p class="jr-eyebrow">Journeys in ${esc(place.name)}</p><h2 id="journeys-title">${list.length ? `${plural(list.length, 'journey')} <em>pass through.</em>` : 'Tailor-made <em>on request.</em>'}</h2></div>
          <p data-reveal style="--d:120ms">${list.length ? `Each of these journeys names ${esc(place.name)} in its route or itinerary. Open a journey for its day-by-day details, inclusions and pricing.` : `None of our published journeys currently lists ${esc(place.name)}. We can shape a route that includes it.`}</p>
        </header>
        ${list.length ? `<div class="jr-results">${C.grid(list, 'View tour details')}</div>${PRICE_NOTE}` : `<div class="jr-empty"><h3>No published journey includes ${esc(place.name)} yet.</h3><p>Tell us when you would like to travel and we will suggest a route.</p><div class="jr-empty-actions"><a class="button" href="${contactHref('destination', place.name)}">Enquire about ${esc(place.name)}</a><a class="jr-textlink" href="packages.html">Browse all journeys <span aria-hidden="true">→</span></a></div></div>`}
      </section>

      <div id="plan">${closing({ eyebrow: 'Travel enquiry', heading: `Plan a journey <em>to ${esc(place.name)}.</em>`, text: `Share your dates and interests and we will suggest how ${esc(place.name)} fits into your route. Your enquiry will open with ${esc(place.name)} already noted.`, href: contactHref('destination', place.name), label: `Enquire about ${esc(place.name)}`, image: place.cardImage, caption: `${place.name} · ${place.region}` })}</div>

      <nav class="dc-more" aria-labelledby="dc-more-title">
        <h2 id="dc-more-title">More destinations</h2>
        <ul class="dc-more-list" role="list">${others.map(item => `<li><a href="${placeHref(item.id)}"><span>${esc(item.name)}</span><small>${esc(item.region)}</small></a></li>`).join('')}</ul>
      </nav>`;
  }

  /* ---------- Categories ---------- */

  function categoryCard(category, index) {
    const extra = D.categories[category.slug] || {};
    const count = inCategory(category).length;
    return `<li class="dc-cat" data-reveal style="--d:${(index % 2) * 120}ms">
      <article>
        <div class="dc-cat-media">${C.img(extra.image || 'exp-culture', '(min-width: 1101px) 44vw, (min-width: 761px) 46vw, 92vw')}</div>
        <div class="dc-cat-body">
          <p class="dc-meta"><span>${esc(extra.tagline || 'Travel style')}</span><span>${count ? plural(count, 'journey') : 'On request'}</span></p>
          <h2><a class="dc-cat-link" href="${categoryHref(category.slug)}" data-category="${esc(category.slug)}">${esc(category.name)}</a></h2>
          <p>${esc(category.description)}</p>
          <span class="jr-card-cta" aria-hidden="true">Explore Category <i></i></span>
        </div>
      </article>
    </li>`;
  }

  function categoriesOverview(notice = '') {
    setMeta('Bhutan tour categories', 'Browse Bhutan journeys by travel style: cultural immersion, festivals and tshechus, trekking, and adventure and nature.');
    return `
      <section class="dc-hero dc-hero-compact" aria-labelledby="dc-title">
        <div class="dc-hero-copy">
          ${crumbs([['Home', 'index.html'], ['Categories']])}
          <p class="jr-eyebrow jr-rise" style="--d:0ms">Travel styles</p>
          ${title('Choose how', 'you travel.')}
          <p class="jr-lede jr-rise" style="--d:360ms">Every journey belongs to one travel style. Pick the one that sounds most like you to see only those journeys, then search within it.</p>
          ${notice ? `<p class="dc-notice" role="status">${esc(notice)}</p>` : ''}
        </div>
      </section>
      <section class="dc-cats" aria-label="Travel styles">
        <ul class="dc-cat-grid" role="list">${categories.map(categoryCard).join('')}</ul>
      </section>
      ${closing({ eyebrow: 'Not sure which style?', heading: 'Mix and match <em>with us.</em>', text: 'Many travellers combine a festival with valley sightseeing, or add a short trek to a cultural journey. Tell us what you enjoy and we will suggest a route.', href: 'contact.html', label: 'Plan My Bhutan Journey', image: 'gal-flags', caption: 'Prayer flags · Sopsokha' })}`;
  }

  function categoryView(category) {
    const extra = D.categories[category.slug] || {};
    const all = inCategory(category);
    setMeta(`${category.name} journeys in Bhutan`, category.description);
    return `
      <section class="dc-cathero" aria-labelledby="dc-title">
        <div class="dc-cathero-copy">
          ${crumbs([['Home', 'index.html'], ['Categories', 'categories.html'], [category.name]])}
          <p class="jr-eyebrow jr-rise" style="--d:0ms">Travel style · ${all.length ? plural(all.length, 'journey') : 'On request'}</p>
          <h1 id="dc-title" class="jr-title dc-cathero-title" tabindex="-1"><span class="jr-line"><span style="--d:80ms">${esc(category.name)}</span></span></h1>
          <p class="jr-lede jr-rise" style="--d:300ms">${esc(category.description)}</p>
        </div>
        <figure class="dc-cathero-media"><div class="dc-cathero-frame">${C.img(extra.hero || extra.image || 'exp-culture', '(min-width: 1101px) 40vw, 100vw', { eager: true })}</div></figure>
      </section>
      <section class="jr-collection dc-catlist" id="category-results" aria-labelledby="dc-catlist-title">
        <h2 id="dc-catlist-title" class="sr-only">${esc(category.name)} journeys</h2>
        <div class="jr-finder" role="search" aria-label="Search ${esc(category.name)} journeys">
          <nav class="jr-tabs" aria-label="Travel styles">
            <a class="jr-tab" href="categories.html" data-category="">All styles</a>
            ${categories.map(item => `<a class="jr-tab" href="${categoryHref(item.slug)}" data-category="${esc(item.slug)}"${item.slug === category.slug ? ' aria-current="page"' : ''}>${esc(item.name)} <small>${inCategory(item).length}</small></a>`).join('')}
          </nav>
          <div class="jr-tools">
            <label class="jr-search"><span class="sr-only">Search ${esc(category.name)} journeys</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input id="category-search" type="search" placeholder="Search a place, festival or trail" autocomplete="off"></label>
            <label class="jr-sort"><span>Sort</span><select id="category-sort"><option value="featured">Curated</option><option value="duration">Duration</option>${PRICED ? '<option value="price">Price: low to high</option>' : ''}<option value="name">A–Z</option></select></label>
          </div>
        </div>
        <div class="jr-status">
          <p id="jr-count" aria-live="polite" aria-atomic="true"></p>
          <button type="button" class="jr-textlink jr-clear" hidden>Clear search</button>
        </div>
        <div class="jr-results" id="dc-results"></div>
        <div class="jr-empty" id="dc-empty" hidden>
          <h3 id="dc-empty-title"></h3>
          <p id="dc-empty-text"></p>
          <div class="jr-empty-actions"><button type="button" class="button jr-clear" id="dc-empty-clear">Clear search</button><a class="jr-textlink" href="${contactHref('category', category.name)}">Enquire about ${esc(category.name)} <span aria-hidden="true">→</span></a></div>
        </div>
        ${PRICE_NOTE}
      </section>
      ${closing({ eyebrow: 'Shape it around you', heading: 'Not quite <em>the right fit?</em>', text: `Tell us what you are hoping for and we can adapt a ${esc(category.name.toLowerCase())} journey, or combine it with another style.`, href: contactHref('category', category.name), label: `Enquire about ${esc(category.name)}`, image: 'gal-autumn', caption: 'Rice terraces · Thimphu district' })}`;
  }

  function categoriesPage() {
    const slug = new URLSearchParams(location.search).get('category');
    if (!slug) return categoriesOverview();
    const category = categories.find(item => item.slug === slug || T.categorySlug(item.name) === slug);
    return category ? categoryView(category) : categoriesOverview('We couldn’t find that travel style, so here are all of them.');
  }

  function setupCategory() {
    const slug = new URLSearchParams(location.search).get('category');
    const category = categories.find(item => item.slug === slug || T.categorySlug(item.name) === slug);
    if (!category) return;
    const all = inCategory(category);
    const search = document.getElementById('category-search'), sort = document.getElementById('category-sort');
    const results = document.getElementById('dc-results'), empty = document.getElementById('dc-empty');
    const url = new URLSearchParams(location.search);
    search.value = url.get('q') || '';
    sort.value = ['duration', ...(PRICED ? ['price'] : []), 'name'].includes(url.get('sort')) ? url.get('sort') : 'featured';
    let timer = 0;

    const apply = (write = true) => {
      const term = search.value.trim().toLowerCase();
      const list = all.filter(tour => !term || `${tour.name} ${tour.destinations.join(' ')} ${tour.travelStyle || ''} ${tour.overview} ${tour.highlights.join(' ')}`.toLowerCase().includes(term));
      const compare = { duration: (a, b) => (a.durationDays ?? Infinity) - (b.durationDays ?? Infinity), price: (a, b) => (a.proposedPrice ?? Infinity) - (b.proposedPrice ?? Infinity), name: (a, b) => a.name.localeCompare(b.name) }[sort.value];
      if (compare) list.sort(compare);
      document.getElementById('jr-count').textContent = term ? `Showing ${list.length} of ${plural(all.length, 'journey')}` : `Showing all ${plural(all.length, 'journey')} in ${category.name}`;
      document.querySelector('.jr-status .jr-clear').hidden = !term;
      results.innerHTML = list.length ? C.grid(list, 'View tour details') : '';
      empty.hidden = list.length > 0;
      if (!list.length) {
        document.getElementById('dc-empty-title').textContent = all.length ? 'No journeys match that search.' : `No ${category.name} journeys are published yet.`;
        document.getElementById('dc-empty-text').textContent = all.length ? 'Try another place or keyword, or tell us what you have in mind.' : 'Tell us what you are hoping for and we will suggest a route.';
        document.getElementById('dc-empty-clear').hidden = !all.length;
      }
      M.observe(results);
      if (write) {
        const next = new URL(location.href);
        term ? next.searchParams.set('q', search.value.trim()) : next.searchParams.delete('q');
        sort.value === 'featured' ? next.searchParams.delete('sort') : next.searchParams.set('sort', sort.value);
        history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
        dispatchEvent(new Event('hmr:category-view'));
      }
      T.analytics('filter_used', { category: category.name, count: list.length, search: Boolean(term) });
    };
    search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(apply, 180); });
    sort.addEventListener('change', () => apply());
    document.querySelectorAll('.jr-clear').forEach(button => button.addEventListener('click', () => { search.value = ''; apply(); search.focus({ preventScroll: true }); }));
    apply(false);
  }

  /* ---------- Shared start-up ---------- */

  let M = null;
  const page = location.pathname.split('/').pop();
  const views = {
    'destinations.html': [destinationsPage, setupDestinations],
    'destination-detail.html': [destinationPage, null],
    'categories.html': [categoriesPage, setupCategory],
  };

  function credits() {
    main().querySelector('.jr-credits')?.remove();
    main().insertAdjacentHTML('beforeend', C.credits());
  }

  function start() {
    const el = main();
    el.classList.add('jr-main', 'dc-main');
    M = window.HMR_MOTION();
    const header = document.querySelector('.header');
    const measure = () => document.documentElement.style.setProperty('--dc-head', `${header && /sticky|fixed/.test(getComputedStyle(header).position) ? header.offsetHeight : 0}px`);
    measure();
    addEventListener('resize', measure, { passive: true });
    views[page]?.[1]?.();
    credits();
    M.observe(el);
    M.drift(el);
  }

  // Category links swap the view in place so the URL stays shareable without a full reload.
  function navigateCategories(href, push = true) {
    if (push) history.pushState({}, '', href);
    dispatchEvent(new Event('hmr:category-view'));
    C = window.HMR_CARDS(T);
    const el = main();
    el.innerHTML = categoriesPage();
    setupCategory();
    credits();
    M.observe(el);
    M.drift(el);
    scrollTo({ top: 0, behavior: 'auto' });
    el.querySelector('#dc-title')?.focus({ preventScroll: true });
  }

  window.HMR_DISCOVER = Object.fromEntries(Object.entries(views).map(([file, [render]]) => [file, () => { C = window.HMR_CARDS(T); return render(); }]));

  if (views[page]) {
    document.addEventListener('DOMContentLoaded', start);
    if (page === 'categories.html') {
      document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="categories.html"]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !main().contains(link)) return;
        event.preventDefault();
        navigateCategories(link.getAttribute('href'));
      });
      let shown = location.search;
      addEventListener('popstate', () => { if (location.search !== shown) navigateCategories(location.href, false); });
      addEventListener('hmr:category-view', () => { shown = location.search; });
    }
  }
})();
