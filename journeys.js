/* Tour listing (packages.html). packages.js calls window.HMR_JOURNEYS from renderListing().
   The card renderer and scroll reveals are also shared with the destinations and categories pages. */
(() => {
  'use strict';

  const D = window.HMR_DATA;
  const FEATURED_SLUG = 'the-western-valleys-circuit';
  const NOT_A_PLACE = /\b(?:listed|other|route|stops?|with|including|toward|sections?|content|region)\b|^(?:eastern|western|central|northern|southern)(?: bhutan)?$/i;
  const SIZES = { lg: '(min-width: 1101px) 56vw, (min-width: 761px) 46vw, 92vw', md: '(min-width: 1101px) 40vw, (min-width: 761px) 46vw, 92vw', sm: '(min-width: 1101px) 31vw, (min-width: 761px) 46vw, 92vw', solo: '(min-width: 761px) 56vw, 92vw' };
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const PRICED = (window.NB_TOURS || []).some(tour => tour.proposedPrice != null);

  /* ---------- Tour cards ---------- */

  function cards(h) {
    const esc = h.escapeHtml;
    const used = new Set();
    const imageKey = D.tourImage;
    const img = (key, sizes, options) => { used.add(key); return D.img(key, sizes, options); };
    const places = tour => [...new Set(tour.destinations
      .flatMap(place => place.split(';'))
      .map(place => place.trim())
      .filter(place => place && /^[A-Z]/.test(place) && place.length <= 28 && !NOT_A_PLACE.test(place) && !h.internalNote.test(place)))];
    const days = tour => tour.durationDays && !tour.durationNeedsConfirmation ? `${tour.durationDays} days` : '';
    const price = tour => tour.proposedPrice == null ? '' : tour.proposedPriceDisplay;
    const summary = tour => h.cleanText(h.displayOverview(tour)).replace(/More journey details are available on request\.?/, '');

    // Rows alternate between a wide/narrow pair and a trio, adjusted so no row is left with a single card.
    function layout(count) {
      if (count === 1) return ['solo'];
      const sizes = [];
      let left = count, row = 0, pairs = 0;
      while (left > 0) {
        let take = row % 2 === 0 ? 2 : 3;
        if (left - take === 1) take = take === 2 ? 3 : 2;
        take = Math.min(take, left);
        if (take === 2) sizes.push(...(pairs++ % 2 === 0 ? ['lg', 'md'] : ['md', 'lg']));
        else sizes.push('sm', 'sm', 'sm-last');
        left -= take; row++;
      }
      return sizes;
    }

    function card(tour, size, index, cta = 'View journey') {
      const p = places(tour);
      const d = days(tour);
      const amount = price(tour);
      const text = size === 'lg' || size === 'solo' ? summary(tour) : '';
      const sizeKey = size === 'sm-last' ? 'sm' : size;
      return `<li class="jr-card" data-size="${size}" data-reveal style="--d:${(index % 3) * 90}ms">
        <article>
          <div class="jr-card-media">${img(imageKey(tour), SIZES[sizeKey])}</div>
          <div class="jr-card-body">
            <p class="jr-card-meta"><span>${esc(tour.category)}</span>${d ? `<span>${d}</span>` : ''}</p>
            <h3><a class="jr-card-link" href="${h.tourHref(tour)}">${esc(tour.name)}</a></h3>
            ${p.length ? `<p class="jr-card-places">${p.slice(0, 3).map(esc).join(' · ')}${p.length > 3 ? ` <span>+${p.length - 3}</span>` : ''}</p>` : ''}
            ${text ? `<p class="jr-card-text">${esc(text)}</p>` : ''}
            <div class="jr-card-foot">
              ${amount ? `<p class="jr-price"><small>Proposed price</small><b>${esc(amount)}<sup>*</sup></b></p>` : '<p class="jr-price is-request"><small>Price</small><b>On request</b></p>'}
              <span class="jr-card-cta" aria-hidden="true">${cta} <i></i></span>
            </div>
          </div>
        </article>
      </li>`;
    }

    const grid = (list, cta) => { const sizes = layout(list.length); return `<ul class="jr-grid" role="list">${list.map((tour, i) => card(tour, sizes[i], i, cta)).join('')}</ul>`; };

    const credits = (extra = []) => {
      const list = D.creditsList([...used, ...extra]);
      return `<details class="jr-credits"><summary>Photography credits</summary><p>Photographs from Wikimedia Commons, used under the licences shown. Images illustrate Bhutan and are not a record of a specific departure.</p><ul>${list.map(c => `<li><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.title.replace(/\.(jpe?g|png)$/i, ''))}</a> · ${esc(c.artist)} · <a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a></li>`).join('')}</ul></details>`;
    };

    return { esc, used, imageKey, img, places, days, price, summary, layout, card, grid, credits };
  }

  /* ---------- Scroll reveals and drift ---------- */

  function motion() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const on = !reduced.matches && 'IntersectionObserver' in window;
    let io = null;
    if (on) {
      document.documentElement.classList.add('jr-motion');
      io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom >= 0) return;
        const target = entry.target;
        (target.dataset.reveal === 'mask-host' ? target.querySelectorAll('[data-reveal="mask"]') : [target]).forEach(el => el.classList.add('is-in'));
        target.classList.add('is-in');
        io.unobserve(target);
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

      // Jump links can scroll past elements without them ever intersecting.
      let pending = false;
      addEventListener('scroll', () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) { el.classList.add('is-in'); el.querySelectorAll('[data-reveal]').forEach(child => child.classList.add('is-in')); }
          });
        });
      }, { passive: true });
    }

    // Masked elements start fully clipped, which IntersectionObserver reports as invisible, so observe their parent.
    function observe(scope) {
      if (!io) return;
      scope.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => {
        if (el.dataset.reveal === 'mask') { el.parentElement.dataset.reveal ||= 'mask-host'; io.observe(el.parentElement); }
        else io.observe(el);
      });
    }

    function drift(scope) {
      const layers = [...scope.querySelectorAll('[data-drift]')];
      if (!layers.length) return;
      const wide = matchMedia('(min-width: 1101px)');
      let ticking = false;
      const update = () => {
        ticking = false;
        const active = on && wide.matches;
        layers.forEach(layer => {
          if (!active) { layer.style.transform = ''; return; }
          const r = layer.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const offset = (r.top + r.height / 2 - innerHeight / 2) * Number(layer.dataset.drift);
          layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
      };
      addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      wide.addEventListener?.('change', update);
      update();
    }

    return { on, reduced, observe, drift };
  }

  window.HMR_CARDS = cards;
  window.HMR_MOTION = motion;

  window.HMR_JOURNEYS = ({ main, tours, categories, h, modalMarkup, setupModal }) => {
    const C = cards(h);
    const { esc, imageKey, img, places, price, summary, grid } = C;
    const M = motion();
    const reduced = M.reduced;
    const countIn = name => tours.filter(tour => tour.category === name).length;

    const featured = tours.find(tour => tour.slug === FEATURED_SLUG)
      || tours.find(tour => tour.proposedPrice != null && places(tour).length)
      || tours[0];

    /* ---------- Markup ---------- */

    const intro = () => `
      <section class="jr-intro" aria-labelledby="jr-title">
        <div class="jr-intro-copy">
          <p class="jr-eyebrow jr-rise" style="--d:0ms">Explore our journeys</p>
          <h1 id="jr-title" class="jr-title"><span class="jr-line"><span style="--d:80ms">Find your way</span></span> <span class="jr-line"><em style="--d:200ms">to Bhutan.</em></span></h1>
          <p class="jr-lede jr-rise" style="--d:360ms">Monasteries above the clouds, festival courtyards, quiet valleys and high mountain trails. Choose a journey as a starting point, then shape it around the pace and moments that matter to you.</p>
          <nav class="jr-quick jr-rise" style="--d:480ms" aria-label="Browse by travel style">
            <p class="jr-quick-label">${plural(tours.length, 'journey')} · ${plural(categories.length, 'travel style')}</p>
            <ul role="list">${categories.map(c => `<li><a href="packages.html?category=${esc(c.slug)}" data-jump-category="${esc(c.name)}"><span>${esc(c.name)}</span><small>${countIn(c.name)}</small></a></li>`).join('')}</ul>
          </nav>
        </div>
        <figure class="jr-intro-media">
          <div class="jr-intro-frame">${img('hero', '(min-width: 1101px) 42vw, (min-width: 761px) 46vw, 100vw', { eager: true })}</div>
          <div class="jr-intro-inset" aria-hidden="true">${img('gal-flags', '220px', { alt: '' })}</div>
          <figcaption><span>Taktsang Lhakhang · Paro</span></figcaption>
        </figure>
      </section>`;

    const featuredBlock = tour => {
      if (!tour) return '';
      const p = places(tour);
      const text = summary(tour);
      const highlights = h.cleanList ? h.cleanList(tour.highlights, tour).slice(0, 3) : [];
      const season = h.displayValue(tour.bestSeason, '');
      const facts = [
        h.durationText(tour) && !tour.durationNeedsConfirmation && tour.durationDays ? ['Duration', h.durationText(tour)] : null,
        season ? ['Best season', season] : null,
        price(tour) ? ['Proposed price', `${price(tour)}<sup>*</sup>`] : null,
      ].filter(Boolean);
      return `
      <section class="jr-featured" aria-labelledby="jr-featured-title">
        <div class="jr-featured-media" data-reveal="mask">
          <div class="jr-drift" data-drift="0.06">${img(D.featuredImages[tour.slug] || imageKey(tour), '(min-width: 1101px) 60vw, 100vw')}</div>
        </div>
        <div class="jr-featured-copy" data-reveal>
          <p class="jr-eyebrow jr-eyebrow-light">Featured journey · ${esc(tour.category)}</p>
          <h2 id="jr-featured-title">${esc(tour.name)}</h2>
          ${p.length ? `<p class="jr-featured-route" aria-label="Route">${p.map(esc).join('<i aria-hidden="true"></i>')}</p>` : ''}
          ${text ? `<p class="jr-featured-text">${esc(text)}</p>` : ''}
          ${highlights.length ? `<ul class="jr-featured-list">${highlights.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
          ${facts.length ? `<dl class="jr-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
          <div class="jr-featured-actions">
            <a class="button button-cream" href="${h.tourHref(tour)}">Explore This Journey <span aria-hidden="true">→</span></a>
            <button type="button" class="jr-textlink jr-textlink-light open-enquiry" data-tour="${esc(tour.slug)}">Ask about this journey</button>
          </div>
        </div>
      </section>`;
    };

    const difficulties = [...new Set(tours.map(t => t.difficulty).filter(v => v && !/not specified|not available|accessible extract/i.test(v)))].sort();
    const collection = () => `
      <section class="jr-collection" id="journey-finder" aria-labelledby="jr-collection-title">
        <header class="jr-collection-head">
          <div data-reveal>
            <p class="jr-eyebrow">The collection</p>
            <h2 id="jr-collection-title">Every journey, <em>chapter by chapter.</em></h2>
          </div>
          <p data-reveal style="--d:120ms">Grouped by the heart of each itinerary. Filter by travel style, search for a place, or refine by length, level and season.</p>
        </header>

        <div class="jr-finder" role="search" aria-label="Filter journeys">
          <div class="jr-tabs" role="group" aria-label="Travel style">
            <button type="button" class="jr-tab" data-category="all" aria-pressed="true">All Journeys <small>${tours.length}</small></button>
            ${categories.map(c => `<button type="button" class="jr-tab" data-category="${esc(c.name)}" aria-pressed="false">${esc(c.name)} <small>${countIn(c.name)}</small></button>`).join('')}
          </div>
          <div class="jr-tools">
            <label class="jr-search"><span class="sr-only">Search journeys</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input id="tour-search" type="search" placeholder="Search a place, festival or trail" autocomplete="off"></label>
            <button type="button" class="jr-refine-toggle" aria-expanded="false" aria-controls="jr-refine">Refine <span class="jr-refine-count" hidden></span><i aria-hidden="true"></i></button>
            <label class="jr-sort"><span>Sort</span><select id="sort-filter"><option value="featured">Curated</option><option value="duration">Duration</option>${PRICED ? '<option value="price">Price: low to high</option>' : ''}<option value="name">A–Z</option></select></label>
          </div>
          <div class="jr-refine" id="jr-refine" hidden>
            <label class="jr-range" for="duration-range"><span>Length · up to <b id="duration-value">28+ days</b></span><input id="duration-range" type="range" min="1" max="28" value="28"><span class="jr-range-ends" aria-hidden="true"><small>1 day</small><small>28+ days</small></span></label>
            <label class="jr-select"><span>Difficulty</span><select id="difficulty-filter"><option value="all">Any level</option>${difficulties.map(v => `<option value="${esc(v)}">${esc(h.displayValue(v))}</option>`).join('')}</select></label>
            <label class="jr-select"><span>Season</span><select id="season-filter"><option value="all">Any season</option>${['Spring', 'Summer', 'Autumn', 'Winter'].map(v => `<option value="${v}">${v}</option>`).join('')}</select></label>
            <p class="jr-refine-note">Difficulty and season only appear where the journey information lists them.</p>
          </div>
        </div>

        <div class="jr-status">
          <p id="jr-count" aria-live="polite" aria-atomic="true"></p>
          <button type="button" class="jr-textlink jr-clear" hidden>Clear filters</button>
        </div>
        <div class="jr-results" id="jr-results"></div>
        <div class="jr-empty" id="jr-empty" hidden>
          <h3>No journeys match those filters.</h3>
          <p>Try a broader search, or tell us what you have in mind and we will suggest a route.</p>
          <div class="jr-empty-actions"><button type="button" class="button jr-clear">Clear filters</button><a class="jr-textlink" href="contact.html">Talk to us <span aria-hidden="true">→</span></a></div>
        </div>
        ${PRICED ? `<p class="jr-note"><sup>*</sup> Proposed prices are planning figures. The currency and pricing basis are not stated in the package information, so please confirm the amount, inclusions and current fees with us before booking. Journeys without a figure are priced on request.</p>` : ''}
      </section>`;

    const closing = () => `
      <section class="jr-closing" aria-labelledby="jr-closing-title">
        <div class="jr-closing-copy" data-reveal>
          <p class="jr-eyebrow">Plan your journey</p>
          <h2 id="jr-closing-title">Not sure where <em>to begin?</em></h2>
          <p>Tell us how you like to travel, when you hope to go and what draws you to Bhutan. We will help you choose a route, or shape one around you.</p>
          <div class="jr-closing-actions">
            <a class="button" href="contact.html">Plan My Bhutan Journey <span aria-hidden="true">→</span></a>
            <button type="button" class="jr-textlink open-enquiry">Send a quick enquiry</button>
          </div>
          <ul class="jr-contact" role="list">
            <li><span>Call</span><a href="tel:+97517890334">+975 17890334</a></li>
            <li><span>Email</span><a href="mailto:himalayamindfulnessretreat@gmail.com">himalayamindfulnessretreat@gmail.com</a></li>
          </ul>
        </div>
        <figure class="jr-closing-media">
          <div class="jr-closing-frame" data-reveal="mask"><div class="jr-drift" data-drift="0.05">${img('gal-autumn', '(min-width: 1101px) 55vw, 100vw')}</div></div>
          <figcaption>Rice terraces · Thimphu district</figcaption>
        </figure>
      </section>`;

    function resultsMarkup(list, grouped) {
      if (!grouped) return grid(list);
      return categories.map((c, i) => {
        const inGroup = list.filter(tour => tour.category === c.name);
        if (!inGroup.length) return '';
        return `<section class="jr-chapter" aria-labelledby="jr-ch-${esc(c.slug)}">
          <header class="jr-chapter-head" data-reveal>
            <span class="jr-chapter-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <h3 id="jr-ch-${esc(c.slug)}">${esc(c.name)}</h3>
            <p>${esc(c.description)}</p>
            <small>${plural(inGroup.length, 'journey')}</small>
          </header>
          ${grid(inGroup)}
        </section>`;
      }).join('');
    }

    /* ---------- Render ---------- */

    main.classList.add('jr-main');
    main.innerHTML = `${intro()}${featuredBlock(featured)}${collection()}${closing()}${modalMarkup()}`;
    tours.forEach(tour => C.used.add(imageKey(tour)));
    main.insertAdjacentHTML('beforeend', C.credits());

    /* ---------- Filters (URL keys match the previous listing) ---------- */

    const $ = id => document.getElementById(id);
    const results = $('jr-results');
    const search = $('tour-search'), duration = $('duration-range'), difficulty = $('difficulty-filter'), season = $('season-filter'), sort = $('sort-filter');
    const tabs = [...document.querySelectorAll('.jr-tab')];
    const refineToggle = document.querySelector('.jr-refine-toggle'), refine = $('jr-refine');
    let activeCategory = 'all', timer = 0, swapTimer = 0;

    const setTab = name => tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.category === name)));

    function readUrl() {
      const url = new URLSearchParams(location.search);
      const slug = url.get('category');
      activeCategory = categories.find(c => c.slug === slug)?.name || categories.find(c => h.categorySlug(c.name) === slug)?.name || 'all';
      duration.value = url.has('duration') ? String(Math.min(28, Math.max(1, Number(url.get('duration')) || 28))) : '28';
      difficulty.value = url.has('difficulty') && difficulties.includes(url.get('difficulty')) ? url.get('difficulty') : 'all';
      const s = (url.get('season') || '').toLowerCase();
      season.value = ['spring', 'summer', 'autumn', 'winter'].includes(s) ? s[0].toUpperCase() + s.slice(1) : 'all';
      search.value = url.get('q') || url.get('destination') || '';
      sort.value = ['duration', ...(PRICED ? ['price'] : []), 'name'].includes(url.get('sort')) ? url.get('sort') : 'featured';
      setTab(activeCategory);
    }

    function writeUrl() {
      const next = new URL(location.href);
      const set = (key, value, empty) => value === empty ? next.searchParams.delete(key) : next.searchParams.set(key, value);
      set('category', activeCategory === 'all' ? 'all' : (categories.find(c => c.name === activeCategory)?.slug || h.categorySlug(activeCategory)), 'all');
      set('duration', duration.value, '28');
      set('difficulty', difficulty.value, 'all');
      set('season', season.value.toLowerCase(), 'all');
      set('q', search.value.trim(), '');
      next.searchParams.delete('destination');
      set('sort', sort.value, 'featured');
      history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
    }

    function filtered() {
      const term = search.value.trim().toLowerCase();
      const maxDays = Number(duration.value);
      const list = tours.filter(tour => {
        const haystack = `${tour.name} ${tour.category} ${tour.destinations.join(' ')} ${tour.travelStyle || ''} ${tour.overview} ${tour.highlights.join(' ')}`.toLowerCase();
        return (activeCategory === 'all' || tour.category === activeCategory)
          && (maxDays === 28 || !tour.durationDays || tour.durationDays <= maxDays)
          && (difficulty.value === 'all' || tour.difficulty === difficulty.value)
          && (season.value === 'all' || (tour.bestSeason || '').toLowerCase().includes(season.value.toLowerCase()))
          && (!term || haystack.includes(term));
      });
      const compare = {
        duration: (a, b) => (a.durationDays ?? Infinity) - (b.durationDays ?? Infinity),
        price: (a, b) => (a.proposedPrice ?? Infinity) - (b.proposedPrice ?? Infinity),
        name: (a, b) => a.name.localeCompare(b.name),
      }[sort.value];
      return compare ? list.sort(compare) : list;
    }

    function apply({ updateUrl = true, animate = true } = {}) {
      const maxDays = Number(duration.value);
      $('duration-value').textContent = maxDays === 28 ? '28+ days' : plural(maxDays, 'day');
      const refinements = [maxDays !== 28, difficulty.value !== 'all', season.value !== 'all'].filter(Boolean).length;
      const countBadge = refineToggle.querySelector('.jr-refine-count');
      countBadge.hidden = !refinements; countBadge.textContent = refinements;
      const any = refinements || activeCategory !== 'all' || search.value.trim() || sort.value !== 'featured';
      document.querySelectorAll('.jr-status .jr-clear').forEach(btn => { btn.hidden = !any; });

      const list = filtered();
      const grouped = sort.value === 'featured' && activeCategory === 'all';
      const total = tours.length;
      $('jr-count').textContent = list.length === total ? `Showing all ${plural(total, 'journey')}` : `Showing ${list.length} of ${plural(total, 'journey')}`;
      $('jr-empty').hidden = list.length > 0;

      const render = () => {
        results.innerHTML = resultsMarkup(list, grouped);
        observe(results);
        results.classList.remove('is-swapping');
      };
      clearTimeout(swapTimer);
      if (animate && motionOn) { results.classList.add('is-swapping'); swapTimer = setTimeout(render, 180); }
      else render();
      if (updateUrl) writeUrl();
      h.analytics('filter_used', { category: activeCategory, count: list.length, search: Boolean(search.value.trim()) });
    }

    const scrollToCollection = () => document.querySelector('.jr-finder').scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });

    tabs.forEach(tab => tab.addEventListener('click', () => { activeCategory = tab.dataset.category; setTab(activeCategory); apply(); }));
    document.querySelectorAll('[data-jump-category]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      activeCategory = link.dataset.jumpCategory; setTab(activeCategory); apply({ animate: false }); scrollToCollection();
    }));
    search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => apply(), 180); });
    [difficulty, season, sort].forEach(control => control.addEventListener('change', () => apply()));
    duration.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => apply(), 120); });
    refineToggle.addEventListener('click', () => {
      const open = refineToggle.getAttribute('aria-expanded') !== 'true';
      refineToggle.setAttribute('aria-expanded', String(open));
      refine.hidden = !open;
    });
    document.querySelectorAll('.jr-clear').forEach(btn => btn.addEventListener('click', () => {
      activeCategory = 'all'; setTab('all');
      search.value = ''; duration.value = '28'; difficulty.value = 'all'; season.value = 'all'; sort.value = 'featured';
      apply();
      search.focus({ preventScroll: true });
    }));
    results.addEventListener('click', event => { const link = event.target.closest('.jr-card-link'); if (link) h.analytics('tour_card_click', { href: link.getAttribute('href') }); });

    const motionOn = M.on;
    const observe = scope => M.observe(scope);
    M.drift(main);

    /* ---------- Start ---------- */

    readUrl();
    apply({ updateUrl: false, animate: false });
    observe(main);
    setupModal();
    if (location.search && /[?&](category|duration|difficulty|season|q|destination|sort)=/.test(location.search)) {
      requestAnimationFrame(() => document.querySelector('.jr-finder').scrollIntoView({ block: 'start', behavior: 'auto' }));
    }
  };
})();
