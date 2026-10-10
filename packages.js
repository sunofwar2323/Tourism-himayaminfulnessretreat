(() => {
  'use strict';

  const root = document.documentElement;
  const main = document.getElementById('main');
  const params = new URLSearchParams(location.search);
  const tours = (window.NB_TOURS || []).filter(tour => tour.showPublicly);
  const categoryDefinitions = window.NB_TOUR_CATEGORIES || [];
  const categories = categoryDefinitions.map(category => category.name);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const images = {
    hero: 'Image/home/hero-1600.webp',
    culture: 'Image/home/exp-culture-1000.webp',
    festival: 'Image/home/exp-festivals-1000.webp',
    trekking: 'Image/home/exp-trekking-1000.webp',
    nature: 'Image/home/exp-nature-1000.webp',
    river: 'Image/home/exp-river-1000.webp',
    monastery: 'Image/home/heritage-taktsang-1000.webp',
    village: 'Image/home/local-farmhouse-1000.webp',
    valley: 'Image/home/paro-valley-1600.webp',
  };
  const categoryIcon = Object.fromEntries(categoryDefinitions.map(category => [category.name, category.icon]));
  const categorySlug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const analytics = (event, detail = {}) => window.dispatchEvent(new CustomEvent('nb:analytics', { detail: { event, ...detail } }));
  const formatDuration = tour => tour.durationNeedsConfirmation ? 'Duration to confirm' : (tour.durationDays ? `${tour.durationDays} days` : 'Details on request');
  const publicCopy = text => escapeHtml(text)
    .replace(/https?:\/\/[^\s)]+/g, '')
    .replace(/^(?:The )?source (?:page )?(?:lists|identifies|describes|states|notes)\s+/i, '')
    .replace(/\baccording to the source\b/ig, '')
    .replace(/\bsource-listed\b/ig, 'listed')
    .replace(/\s{2,}/g, ' ');
  const displayValue = (value, fallback = 'Details on request') => !value || /not specified|not available|not confirmed|to verify|not fully/i.test(value) ? fallback : String(value).replace(/\s*\((?:source listing|as listed by the source)\)/ig, '').trim();
  const displayOverview = tour => {
    const sentences = (tour.overview || '').match(/[^.!?]+[.!?]?/g) || [];
    const usable = sentences.filter(sentence => !/(?:the source|accessible (?:summary|extract|overview)|indexed overview|not available|not specified|confirm against|verification required)/i.test(sentence));
    return usable.join(' ').trim() || 'More journey details are available on request.';
  };
  const displayHighlights = tour => (tour.highlights || []).filter(item => !/(?:source|verification|confirmation required|require confirmation|not available|verify )/i.test(item) && !(tour.id === 'NB-ADV-002' && /\braft/i.test(item)));
  const publicDetails = (lines, tour) => (lines || []).filter(line => !/(?:source (?:page )?(?:says|lists|confirms|describes)|confirm against|verify |verification required|not available|not fully available|do not infer|requires confirmation)/i.test(line) && !(tour?.id === 'NB-ADV-002' && /\braft/i.test(line)));
  const priceView = tour => tour.proposedPrice == null
    ? `<button type="button" class="tour-price-quote open-enquiry" data-tour="${escapeHtml(tour.slug)}">Request a Quote</button>`
    : `<span class="tour-price-value">${escapeHtml(tour.proposedPriceDisplay)}</span><span class="price-note" tabindex="0" title="Currency and pricing basis to be confirmed">Currency &amp; basis to be confirmed</span>`;
  const tourHref = tour => `package-detail.html?trip=${encodeURIComponent(tour.slug)}`;
  const categoryBadge = tour => `<span class="tour-category-tag">${escapeHtml(tour.category)}</span>`;

  function tourCard(tour, index) {
    const destinationText = tour.destinations.length ? tour.destinations.slice(0, 4).join(' · ') : 'Route details on request';
    const preview = displayHighlights(tour).slice(0, 2).map(text => `<li>${publicCopy(text)}</li>`).join('');
    const photo = tour.photo || images[tour.imageKey] || images.culture;
    return `<article class="tour-card reveal-card" data-id="${escapeHtml(tour.id)}" data-duration="${tour.durationDays || ''}" data-price="${tour.proposedPrice ?? ''}" data-category="${escapeHtml(tour.category)}" style="--card-image:url('${photo}')">
      <a class="tour-card-image" href="${tourHref(tour)}" aria-label="View ${escapeHtml(tour.name)}" style="view-transition-name: tour-${escapeHtml(tour.slug)}">
        <img src="${photo}" alt="" aria-hidden="true" width="1000" height="667" loading="lazy" decoding="async">
        <span class="tour-card-image-shade"></span><span class="tour-card-index">${String(index + 1).padStart(2, '0')}</span>
        <span class="tour-card-duration">${escapeHtml(formatDuration(tour))}</span>
        <span class="tour-card-view" aria-hidden="true">View <b>↗</b></span>
        <span class="cursor-glow" aria-hidden="true"></span>
      </a>
      <div class="tour-card-body">
        <div class="tour-card-meta">${categoryBadge(tour)}<span>${escapeHtml(tour.travelStyle || 'Journey style on request')}</span></div>
        <h3><a href="${tourHref(tour)}">${escapeHtml(tour.name)}</a></h3>
        <p class="tour-card-summary">${escapeHtml(displayOverview(tour))}</p>
        <div class="tour-destination-list" aria-label="Destinations">${tour.destinations.length ? tour.destinations.slice(0, 4).map(place => `<span>${escapeHtml(place)}</span>`).join('') : '<span>Bhutan · route to confirm</span>'}</div>
        <ul class="tour-highlights-preview">${preview || '<li>Ask us for current route and activity details.</li>'}</ul>
        <div class="tour-card-bottom"><div class="tour-card-price">${priceView(tour)}</div><a href="${tourHref(tour)}" class="journey-link">View Journey <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>`;
  }

  function renderShell() {
    document.querySelectorAll('.brand b').forEach(brand => { brand.textContent = 'HIMALAYA'; });
    document.querySelectorAll('.footer-bottom span:first-child').forEach(copyright => { copyright.textContent = '© 2026 Himalaya Mindfulness Retreat. All rights reserved.'; });
    document.title = 'Bhutan tour packages | Himalaya Mindfulness Retreat';
    const isDetail = location.pathname.split('/').pop() === 'package-detail.html';
    if (isDetail) document.querySelector('.nav a[href="packages.html"]')?.setAttribute('aria-current', 'page');
    if (isDetail) renderDetail(); else renderListing();
    main.removeAttribute('aria-busy');
    initSharedMotion();
  }

  function renderListing() {
    if (window.HMR_JOURNEYS) {
      window.HMR_JOURNEYS({ main, tours, categories: categoryDefinitions, modalMarkup, setupModal, h: { escapeHtml, cleanText, cleanList, displayOverview, displayValue, durationText, internalNote, tourHref, categorySlug, analytics } });
      return;
    }
    const pricedCount = tours.filter(tour => tour.proposedPrice != null).length;
    main.innerHTML = `
      <div class="reading-progress" aria-hidden="true"><span></span></div>
      <section class="journey-hero" aria-labelledby="journey-title" style="--hero-image:url('${images.hero}')">
        <div class="hero-backdrop" data-depth="0.06"></div><div class="hero-mist hero-mist-a" data-depth="0.13"></div><div class="hero-mist hero-mist-b" data-depth="0.2"></div>
        <div class="hero-grain" aria-hidden="true"></div>
        <div class="journey-hero-content">
          <span class="eyebrow eyebrow-light hero-eyebrow">A HIMALAYA MINDFULNESS RETREAT JOURNAL · BHUTAN</span>
          <h1 id="journey-title" class="hero-title" aria-label="Walk Into the Last Himalayan Kingdom">Walk Into the<br><em>Last Himalayan</em><br>Kingdom</h1>
          <p>Twenty-five ways to meet a kingdom of living traditions, quiet valleys and high mountain trails.</p>
          <div class="hero-actions"><a class="button button-cream magnetic" href="#journey-finder">Explore Journeys <span aria-hidden="true">↓</span></a><a class="hero-text-link" href="contact.html">Plan a private journey <span aria-hidden="true">↗</span></a></div>
        </div>
        <div class="hero-side-note"><span>27° 29′ N</span><i></i><span>BHUTAN · THE HIMALAYAS</span></div>
        <a href="#story" class="hero-scroll-cue"><span class="scroll-cue-line"></span><span>Scroll to begin</span></a>
        <div class="prayer-flags" aria-hidden="true"><svg viewBox="0 0 1440 88" preserveAspectRatio="none"><path d="M0 18 C200 18 230 60 430 42 S700 16 890 47 S1220 70 1440 28" fill="none" stroke="currentColor" stroke-width="1.2"/><g class="flag-set">${Array.from({length: 25}, (_, i) => `<path d="M${i * 58 + 3} ${28 + Math.sin(i * .72) * 14} l17 2 -8 29z" fill="${['var(--color-saffron)','var(--color-danger)','var(--color-success)','var(--color-sky-wash)','var(--color-glacier)'][i % 5]}" opacity=".78"/>`).join('')}</g></svg></div>
      </section>
      <section class="story-track" id="story" aria-label="A feeling for Bhutan">
        <div class="story-sticky"><div class="story-backgrounds"><div class="story-bg active" style="--story-image:url('${images.monastery}')"></div><div class="story-bg" style="--story-image:url('${images.trekking}')"></div><div class="story-bg" style="--story-image:url('${images.valley}')"></div></div><div class="story-shade"></div>
          <div class="story-copy"><span class="eyebrow eyebrow-light">THREE WAYS INTO THE JOURNEY</span><div class="story-steps"><article class="story-step is-active" data-story="0"><span>01 / CULTURE</span><h2>Where every<br><em>stone remembers.</em></h2><p>Dzongs, monasteries and the intimate rituals of everyday life.</p></article><article class="story-step" data-story="1"><span>02 / MOUNTAINS</span><h2>Take the long<br><em>way into wonder.</em></h2><p>Walk through forest, high passes and the great quiet of the Himalayas.</p></article><article class="story-step" data-story="2"><span>03 / HAPPINESS</span><h2>Leave room for<br><em>the unexpected.</em></h2><p>Travel at a human pace, with space for the moments between places.</p></article></div>
          </div><div class="story-stats"><div><strong data-count="${tours.length}">0</strong><span>JOURNEYS</span></div><div><strong data-count="${categories.length}">0</strong><span>TRAVEL STYLES</span></div><div><strong data-count="${pricedCount}">0</strong><span>PROPOSED PRICES</span></div></div><span class="story-caption">A country that asks you to look closer</span>
        </div>
      </section>
      <section class="finder-section" id="journey-finder">
        <div class="section finder-intro"><span class="eyebrow">THE JOURNEY FINDER</span><div class="finder-heading"><h2>Find the journey<br><em>that feels like yours.</em></h2><p>Start with a feeling, a season or a few extra days. Every route below begins with the details we can confirm—and leaves the rest open to a conversation.</p></div></div>
        <div class="finder-sticky-wrap"><div class="finder-bar" role="region" aria-label="Filter tour packages">
          <div class="finder-categories" role="group" aria-label="Filter by travel style"><button class="category-chip active" type="button" data-category="all" aria-pressed="true">All journeys <span>${tours.length}</span></button>${categories.map(category => `<button class="category-chip" type="button" data-category="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)} <span>${tours.filter(tour => tour.category === category).length}</span></button>`).join('')}</div>
          <div class="finder-controls">
            <label class="finder-search"><span class="sr-only">Search journeys</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.5 4.5"/></svg><input id="tour-search" type="search" placeholder="Search a place, feeling or trail" autocomplete="off"></label>
            <label class="duration-control" for="duration-range"><span>UP TO <b id="duration-value">28 days</b></span><input id="duration-range" type="range" min="1" max="28" value="28"><span class="range-ends"><small>1 day</small><small>28+ days</small></span></label>
            <label class="select-control">DIFFICULTY<select id="difficulty-filter"><option value="all">Any level</option>${[...new Set(tours.map(tour => tour.difficulty).filter(value => value && !/not specified|not available/i.test(value)))].sort().map(value => `<option value="${escapeHtml(value)}">${escapeHtml(displayValue(value))}</option>`).join('')}</select></label>
            <label class="select-control">SEASON<select id="season-filter"><option value="all">Any season</option>${['Spring', 'Summer', 'Autumn', 'Winter'].map(value => `<option value="${value}">${value}</option>`).join('')}</select></label>
            <label class="select-control sort-control">SORT BY<select id="sort-filter"><option value="featured">Curated order</option><option value="duration">Duration</option><option value="name">A–Z</option></select></label>
          </div>
        </div></div>
        <div class="section tour-results-section"><div class="results-heading"><div><span class="eyebrow">A COLLECTION OF POSSIBILITIES</span><h2><span id="result-count">${tours.length}</span> <i>journeys</i></h2></div><span class="results-hint">Select a journey to see what’s known so far</span></div><div class="tour-grid" id="tour-grid" aria-live="polite">${tours.map(tourCard).join('')}</div><div class="empty-results" id="empty-results" hidden><span aria-hidden="true">⌁</span><h3>No journeys found</h3><p>Try a wider search or clear one of the filters.</p><button class="clear-filters" type="button">Clear filters</button></div>
          <p class="collection-note">Journeys are priced on request. Ask us to confirm inclusions, current fees and availability before booking.</p>
        </div>
      </section>
      <section class="festival-strip-section"><div class="festival-strip-heading"><div><span class="eyebrow eyebrow-light">A CALENDAR OF LIVING TRADITIONS</span><h2>Meet Bhutan<br><em>in celebration.</em></h2></div><p>Festival journeys connect place, practice and community. Event dates and access are always subject to confirmation.</p></div><div class="festival-rail" aria-label="Festival journeys">${tours.filter(tour => tour.category === 'Festival & Tshechu').map((tour, index) => `<a class="festival-stop" href="${tourHref(tour)}"><span class="festival-stop-no">${String(index + 1).padStart(2, '0')}</span><span class="festival-mark" aria-hidden="true">${categoryIcon['Festival & Tshechu']}</span><span class="festival-name">${escapeHtml(tour.name)}</span><span class="festival-duration">${escapeHtml(formatDuration(tour))}</span><span class="festival-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><div class="festival-strip-foot"><span>FESTIVAL DATES SUBJECT TO CONFIRMATION</span><a href="#journey-finder">Explore festival journeys ↗</a></div></section>
      <section class="trust-section section"><div class="trust-header"><span class="eyebrow">A MORE THOUGHTFUL WAY TO GO</span><h2>Made for the<br><em>way you want to feel.</em></h2><p>Use this collection to compare what is available, spot what still needs a conversation, and begin shaping a Bhutan journey around your own pace.</p></div><div class="trust-grid"><article><span>01</span><h3>Clear from the start</h3><p>Prices, durations and details are shown as listed, with gaps called out instead of filled in.</p></article><article><span>02</span><h3>Room to make it yours</h3><p>Choose a travel style, then ask about the route, dates and practical details that matter to you.</p></article><article><span>03</span><h3>Bhutan, at your pace</h3><p>From a short cultural circuit to a high-altitude expedition, find a starting point that fits your appetite for the journey.</p></article></div></section>
      <section class="faq-section"><div class="section faq-inner"><div><span class="eyebrow">A FEW THINGS TO KNOW</span><h2>Before you<br><em>set out.</em></h2><a class="text-link" href="travel-info.html">Read the Bhutan travel guide ↗</a></div><div class="faq-list">
        ${[['Why do some journeys say “Request a Quote”?', 'No public proposed price was available for those listings. Ask the Himalaya Mindfulness Retreat team to confirm availability and current pricing.'], ['Are all day-by-day itineraries complete?', 'No. Some available listings include only part of a route. Missing days are marked as details on request rather than filled with assumptions.'], ['Where can I check visa and entry information?', 'Use the Travel Information page for a starting point, then verify current requirements with Bhutan’s official immigration sources before departure.'], ['How do I choose a season or difficulty level?', 'Season and difficulty appear only where they were available in the package information. For route-specific advice, request current conditions and a detailed itinerary.']].map(([question, answer], index) => `<details class="journey-faq"><summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(question)}<b aria-hidden="true">+</b></summary><div><p>${escapeHtml(answer)}</p></div></details>`).join('')}
      </div></div></section>
      <section class="marquee-band" aria-label="Explore Bhutan travel styles"><div class="marquee-track">${[...categories, ...categories].map(category => `<span>${escapeHtml(category.replace(' / ', ' · '))}<i aria-hidden="true">✳</i></span>`).join('')}</div></section>
      <section class="journey-cta" style="--cta-image:url('${images.valley}')"><div class="cta-glow"></div><div class="journey-cta-copy"><span class="eyebrow eyebrow-light">THE FIRST STEP IS A CONVERSATION</span><h2>Bring us your<br><em>Bhutan daydream.</em></h2><p>Tell us what draws you to the kingdom. We’ll start with the details you care about most.</p><button type="button" class="button button-cream magnetic open-enquiry">Plan My Bhutan Journey <span aria-hidden="true">↗</span></button></div><span class="cta-side-caption">HIMALAYA MINDFULNESS RETREAT · BHUTAN</span></section>
      ${modalMarkup()}`;
    setupFilters(); setupFinderUrl(); setupStory(); setupCards(); setupModal(); setupProgress();
  }

  function modalMarkup() {
    return `<dialog class="enquiry-dialog" id="enquiry-dialog" aria-labelledby="enquiry-title"><div class="dialog-image" style="--dialog-image:url('${images.monastery}')"><button type="button" class="dialog-close" aria-label="Close enquiry form">×</button><span class="eyebrow eyebrow-light">A JOURNEY STARTS HERE</span><h2 id="enquiry-title">Let’s talk<br><em>about Bhutan.</em></h2><p>Share a few details and we’ll help you find your next step.</p></div><form class="journey-form" id="journey-form"><input type="text" name="_honey" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"><label>Your name<input name="name" autocomplete="name" required placeholder="Your name"></label><div class="form-pair"><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="Country code + number"></label></div><div class="form-pair"><label>Journey of interest<select name="tour" id="enquiry-tour"><option value="">I’m still exploring</option>${tours.map(tour => `<option value="${escapeHtml(tour.slug)}">${escapeHtml(tour.name)}</option>`).join('')}</select></label><label>Travel month<input name="month" type="month"></label></div><label>Group size<input name="groupSize" type="number" min="1" max="30" inputmode="numeric" placeholder="Number of travellers"></label><label>Your note<textarea name="message" rows="3" placeholder="What are you hoping to experience?"></textarea></label><button class="button" type="submit">Send an enquiry <span aria-hidden="true">↗</span></button><p class="form-note" id="journey-form-status" role="status" aria-live="polite">We use your details only to reply to your enquiry. See our <a href="privacy.html">Privacy Policy</a>.</p></form></dialog>`;
  }

  function setupFilters() {
    const grid = document.getElementById('tour-grid');
    const search = document.getElementById('tour-search');
    const duration = document.getElementById('duration-range');
    const difficulty = document.getElementById('difficulty-filter');
    const season = document.getElementById('season-filter');
    const sort = document.getElementById('sort-filter');
    let activeCategory = 'all';
    let timer;
    function applyFilters(updateUrl = true) {
      const term = search.value.trim().toLowerCase();
      const maxDays = Number(duration.value);
      document.getElementById('duration-value').textContent = maxDays === 28 ? '28+ days' : `${maxDays} days`;
      const before = [...grid.querySelectorAll('.tour-card')];
      const flipState = window.gsap && window.Flip && !reducedMotion ? window.Flip.getState(before) : null;
      const firstPositions = new Map(before.map(card => [card.dataset.id, card.getBoundingClientRect()]));
      const active = tours.filter(tour => {
        const card = grid.querySelector(`[data-id="${CSS.escape(tour.id)}"]`);
        const matchesCategory = activeCategory === 'all' || tour.category === activeCategory;
        const matchesDuration = !tour.durationDays || tour.durationDays <= maxDays || maxDays === 28;
        const matchesDifficulty = difficulty.value === 'all' || tour.difficulty === difficulty.value;
        const matchesSeason = season.value === 'all' || (tour.bestSeason && tour.bestSeason.toLowerCase().includes(season.value.toLowerCase()));
        const haystack = `${tour.name} ${tour.category} ${tour.destinations.join(' ')} ${tour.travelStyle || ''} ${tour.overview} ${tour.highlights.join(' ')}`.toLowerCase();
        const matchesSearch = !term || haystack.includes(term);
        card.hidden = !(matchesCategory && matchesDuration && matchesDifficulty && matchesSeason && matchesSearch);
        return matchesCategory && matchesDuration && matchesDifficulty && matchesSeason && matchesSearch;
      });
      const comparator = {
        duration: (a, b) => (a.durationDays ?? Infinity) - (b.durationDays ?? Infinity),
        price: (a, b) => (a.proposedPrice ?? Infinity) - (b.proposedPrice ?? Infinity),
        name: (a, b) => a.name.localeCompare(b.name),
      }[sort.value];
      if (comparator) active.sort(comparator);
      active.forEach(tour => grid.append(grid.querySelector(`[data-id="${CSS.escape(tour.id)}"]`)));
      const count = document.getElementById('result-count');
      if (window.gsap && !reducedMotion) window.gsap.to(count, { textContent: active.length, duration: .45, snap: { textContent: 1 }, ease: 'power2.out' });
      else count.textContent = String(active.length);
      document.getElementById('empty-results').hidden = active.length > 0;
      if (window.gsap && window.Flip && !reducedMotion) {
        window.Flip.from(flipState, { duration: 0.62, ease: 'power3.out', stagger: 0.018, absolute: false, onComplete: () => window.ScrollTrigger?.refresh() });
      } else if (!reducedMotion) {
        active.forEach(tour => {
          const card = grid.querySelector(`[data-id="${CSS.escape(tour.id)}"]`);
          const first = firstPositions.get(tour.id), last = card.getBoundingClientRect();
          if (!first || card.hidden) return;
          const dx = first.left - last.left, dy = first.top - last.top;
          if (dx || dy) card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: 500, easing: 'cubic-bezier(.22,.75,.25,1)' });
        });
      }
      if (updateUrl) syncUrl();
      analytics('filter_used', { category: activeCategory, count: active.length, search: Boolean(term) });
    }
    function syncUrl() {
      const next = new URL(location.href);
      activeCategory === 'all' ? next.searchParams.delete('category') : next.searchParams.set('category', categorySlug(activeCategory));
      duration.value === '28' ? next.searchParams.delete('duration') : next.searchParams.set('duration', duration.value);
      difficulty.value === 'all' ? next.searchParams.delete('difficulty') : next.searchParams.set('difficulty', difficulty.value);
      season.value === 'all' ? next.searchParams.delete('season') : next.searchParams.set('season', season.value.toLowerCase());
      search.value.trim() ? next.searchParams.set('q', search.value.trim()) : next.searchParams.delete('q');
      sort.value === 'featured' ? next.searchParams.delete('sort') : next.searchParams.set('sort', sort.value);
      history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
    }
    function fromUrl() {
      const url = new URLSearchParams(location.search);
      const match = categoryDefinitions.find(category => category.slug === url.get('category'))?.name || categories.find(category => categorySlug(category) === url.get('category'));
      if (match) activeCategory = match;
      document.querySelectorAll('.category-chip').forEach(button => {
        const selected = button.dataset.category === activeCategory;
        button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected));
      });
      if (url.has('duration')) duration.value = String(Math.min(28, Math.max(1, Number(url.get('duration')) || 28)));
      if (url.has('difficulty')) difficulty.value = url.get('difficulty');
      if (url.has('season')) season.value = url.get('season')[0].toUpperCase() + url.get('season').slice(1);
      if (url.has('q')) search.value = url.get('q');
      else if (url.has('destination')) search.value = url.get('destination');
      if (url.has('sort') && ['duration', 'price', 'name'].includes(url.get('sort'))) sort.value = url.get('sort');
    }
    document.querySelectorAll('.category-chip').forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      document.querySelectorAll('.category-chip').forEach(chip => { const selected = chip === button; chip.classList.toggle('active', selected); chip.setAttribute('aria-pressed', String(selected)); });
      applyFilters();
    }));
    [duration, difficulty, season, sort].forEach(input => input.addEventListener('input', () => applyFilters()));
    [difficulty, season, sort].forEach(input => input.addEventListener('change', () => applyFilters()));
    search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => applyFilters(), 120); });
    document.querySelector('.clear-filters').addEventListener('click', () => {
      activeCategory = 'all'; search.value = ''; duration.value = '28'; difficulty.value = 'all'; season.value = 'all'; sort.value = 'featured'; fromUrl(); applyFilters();
    });
    fromUrl(); applyFilters(false);
  }

  function setupFinderUrl() { if (location.search) document.getElementById('journey-finder').scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' }); }

  function setupStory() {
    const steps = [...document.querySelectorAll('.story-step')], backgrounds = [...document.querySelectorAll('.story-bg')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.story);
        steps.forEach((step, at) => step.classList.toggle('is-active', at === index));
        backgrounds.forEach((image, at) => image.classList.toggle('active', at === index));
      }), { rootMargin: '-30% 0px -48% 0px', threshold: 0 });
      steps.forEach(step => observer.observe(step));
    }
    document.querySelectorAll('[data-count]').forEach(element => {
      const end = Number(element.dataset.count);
      const run = () => {
        if (window.gsap && window.ScrollTrigger && !reducedMotion) window.gsap.fromTo(element, { textContent: 0 }, { textContent: end, duration: 1.1, ease: 'power2.out', snap: { textContent: 1 }, scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
        else if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { element.textContent = end; io.disconnect(); } }, { threshold: .6 }); io.observe(element);
        } else element.textContent = end;
      };
      run();
    });
  }

  function setupCards() {
    const cards = [...document.querySelectorAll('.tour-card')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -8% 0px' });
      cards.forEach(card => observer.observe(card));
    } else cards.forEach(card => card.classList.add('is-visible'));
    cards.forEach(card => {
      const image = card.querySelector('.tour-card-image');
      const photo = image.querySelector('img');
      const markLoaded = () => photo.classList.add('is-loaded');
      if (photo.complete) markLoaded(); else photo.addEventListener('load', markLoaded, { once: true });
      image.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' || matchMedia('(hover: none)').matches || reducedMotion) return;
        const rect = image.getBoundingClientRect(), x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`); card.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
        card.style.setProperty('--glow-x', `${x * 100}%`); card.style.setProperty('--glow-y', `${y * 100}%`);
      });
      image.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); });
      card.addEventListener('click', event => { if (event.target.closest('a')) analytics('tour_card_click', { id: card.dataset.id }); });
    });
    const cursor = document.createElement('span'); cursor.className = 'custom-cursor'; cursor.textContent = 'VIEW'; document.body.append(cursor);
    document.querySelectorAll('.tour-card-image').forEach(image => {
      image.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !reducedMotion) cursor.classList.add('is-visible'); });
      image.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
      image.addEventListener('pointermove', event => { cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`; });
    });
  }

  function setupModal(prefill = '') {
    const dialog = document.getElementById('enquiry-dialog');
    if (!dialog) return;
    const opener = document.querySelector('.open-enquiry:not([data-tour])');
    const close = dialog.querySelector('.dialog-close');
    const form = dialog.querySelector('form');
    const tourSelect = dialog.querySelector('#enquiry-tour');
    if (prefill) tourSelect.value = prefill;
    opener?.addEventListener('click', () => open());
    document.querySelectorAll('.open-enquiry[data-tour]').forEach(button => button.addEventListener('click', () => { tourSelect.value = button.dataset.tour || ''; open(); }));
    function open() { if (dialog.open) return; if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', ''); dialog.querySelector('input[name="name"]').focus(); }
    close.addEventListener('click', () => dialog.close ? dialog.close() : dialog.removeAttribute('open'));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not(.honeypot),select,textarea')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.HMR_ENQUIRY?.attach(form, {
      status: document.getElementById('journey-form-status'),
      subject: 'New journey enquiry',
      onSent: () => analytics('quote_submitted', { tour: tourSelect.value || null }),
    });
  }

  function setupProgress() {
    const bar = document.querySelector('.reading-progress span');
    if (!bar) return;
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; };
    addEventListener('scroll', update, { passive: true }); update();
  }

  const internalNote = /(?:indexed|accessible) (?:extract|summary|overview)|before (?:publication|marketing)|must be verified|requires? verification|verification (?:needed|required)|should be (?:re)?confirmed|\breconfirm|confirm (?:it )?(?:from|against)|not (?:fully )?(?:exposed|available|confirmed)|did not expose|truncates|obtain the complete|extraction date|\bsource\b|\boperator\b/i;
  const publicRewrites = [
    [/https?:\/\/[^\s)]+/g, ''],
    [/\s*\((?:the )?source[^)]*\)/gi, ''],
    [/\s*\((?:as listed by the source|related-trip listing)\)/gi, ''],
    [/,?\s*\b(?:according to|as listed by|noted by) the source(?: as an? \w+)?/gi, ''],
    [/\s+(?:are|is) listed by the source(?: as (?:in|ex)clusions)?/gi, ''],
    [/\s+is specified in the source itinerary/gi, ''],
    [/\blinked by the source to\b/gi, 'linked to'],
    [/\bare mentioned in the source overview\b/gi, 'are included'],
    [/^source background discusses /i, 'Look out for '],
    [/^the source says the itinerary is customizable and mentions possible/i, 'The itinerary is customizable, with possible'],
    [/^the source (?:itinerary|page) describes /i, 'The day includes '],
    [/^the source describes (.+?) as key visits/i, 'Key visits include $1'],
    [/(^|;\s*)the source describes (an?) /i, '$1expect $2 '],
    [/\bsource estimate (?:is )?/gi, ''],
    [/^the source labels (this trek|the tour) (.+?) and lists /i, '$1 is listed as $2, with '],
    [/^the source labels (this trek|the tour) /i, '$1 is listed as '],
    [/^the (?:source )?page lists (.+?) as /i, '$1 are listed as '],
    [/\bsource-published\b/gi, 'published'],
    [/\bsource-listed\b/gi, 'listed'],
    [/^(?:the )?source (?:page )?lists /i, ''],
    [/\b(?:the )?source (?:page |itinerary )?(also )?(?:lists|names|identifies)\b/gi, 'the itinerary $1includes'],
    [/^(?:confirm|verify) /i, 'Ask us to confirm '],
  ];
  const capitalise = text => text.charAt(0).toUpperCase() + text.slice(1);
  const cleanText = text => String(text || '').trim().split(/(?<=[.!?])\s+(?=[A-Z“"(])/).map(sentence => {
    const rewritten = publicRewrites.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), sentence.trim());
    const kept = rewritten.split(/;\s+/).map(clause => clause.trim()).filter(clause => clause && !internalNote.test(clause)).join('; ');
    if (!kept) return '';
    return capitalise(kept.replace(/\s{2,}/g, ' ').replace(/\s+([,.;])/g, '$1').replace(/[;,]\s*$/, '')).replace(/([^.!?])$/, '$1.');
  }).filter(Boolean).join(' ');
  const cleanList = (lines, tour) => (lines || []).map(cleanText).filter(line => line && !(tour.id === 'NB-ADV-002' && /\braft/i.test(line)));
  const durationText = tour => {
    if (tour.durationNeedsConfirmation) return 'Duration to confirm';
    const match = (tour.duration || '').match(/^\d+\s+days?(?:\s*\/\s*\d+\s+nights?)?/i);
    return match ? match[0] : formatDuration(tour);
  };
  const publicPlaces = tour => tour.destinations.map(place => place.split(';')[0].trim()).filter(place => place && !internalNote.test(place) && !/\b(?:listed|other|route|stops?|including|toward|sections?|content|region)\b|^(?:eastern|western|central|northern|southern)(?: bhutan)?$/i.test(place));
  const dayTitle = day => String(day.title || 'Journey details').replace(/^days?\s*[\d–-]+\s*:\s*/i, '');

  function renderDetail() {
    const slug = params.get('trip');
    const tour = tours.find(item => item.slug === slug);
    if (!tour) {
      document.title = 'Journey not found | Himalaya Mindfulness Retreat';
      main.innerHTML = `<section class="detail-missing" aria-labelledby="missing-title"><span class="eyebrow">Journey not found</span><h1 id="missing-title">We couldn’t find <em>that journey.</em></h1><p>The link may be out of date, or the journey may no longer be offered. Browse our current journeys or tell us what you are looking for.</p><div class="detail-missing-actions"><a class="button" href="packages.html">Browse all journeys <span aria-hidden="true">→</span></a><a class="text-link" href="contact.html">Contact us <span aria-hidden="true">↗</span></a></div></section>`;
      return;
    }
    const D = window.HMR_DATA;
    const heroKey = D.tourImage(tour);
    const stops = D.destinationsOf(tour);
    const stopFor = place => stops.find(stop => place.toLowerCase().startsWith(stop.name.toLowerCase()));
    const placeLink = place => { const stop = stopFor(place); return stop ? `<a href="destination-detail.html?place=${stop.id}">${escapeHtml(place)}</a>` : escapeHtml(place); };
    const galleryKeys = [...new Set(stops.flatMap(stop => [stop.cardImage, ...stop.places.map(item => item.image)]))].filter(key => key !== heroKey).slice(0, 3);
    const categorySlugValue = categoryDefinitions.find(item => item.name === tour.category)?.slug || categorySlug(tour.category);
    const dayNumbers = tour.itinerary.flatMap(day => String(day.day).split(/[–-]/).map(Number)).filter(Number.isFinite);
    const lastDay = dayNumbers.length ? Math.max(...dayNumbers) : 0;
    const totalDays = tour.durationNeedsConfirmation ? 0 : tour.durationDays || 0;
    const missingDays = totalDays > lastDay && lastDay ? (totalDays - lastDay === 1 ? `Day ${totalDays}` : `Days ${lastDay + 1}–${totalDays}`) : '';
    const summarised = tour.itinerary.some(day => /[–-]/.test(String(day.day)) || !cleanList(day.details, tour).length);
    const summary = cleanText(displayOverview(tour)) || 'More journey details are available on request.';
    const quote = tour.proposedPrice == null;
    const duration = durationText(tour);
    const season = displayValue(tour.bestSeason, 'On request');
    const difficulty = displayValue(tour.difficulty, 'On request');
    const style = displayValue(tour.travelStyle, 'On request');
    const listed = publicPlaces(tour);
    const places = listed.length ? listed : stops.map(stop => stop.name);
    const highlights = cleanList(tour.highlights, tour).filter(item => !/^exact |requires? (?:confirmation|verification)|to be confirmed\.?$/i.test(item));
    const inclusions = cleanList(tour.inclusions, tour);
    const exclusions = tour.displayExclusionsOnRequest ? [] : cleanList(tour.exclusions, tour);
    const practicalNote = cleanText(tour.practicalInfo);
    const supplement = tour.singleSupplement ? (tour.singleSupplement.match(/proposed\s+([\d.,]+)/i)?.[1] || cleanText(tour.singleSupplement)) : '';
    const priceLabel = quote ? 'On request' : tour.proposedPriceDisplay;
    const enquireLabel = quote ? 'Request a Quote' : 'Enquire About This Journey';
    const enquireButton = (extraClass, label = enquireLabel) => `<button type="button" class="button open-enquiry ${extraClass}" data-tour="${escapeHtml(tour.slug)}">${label} <span aria-hidden="true">↗</span></button>`;
    const placeLine = places.length ? `Bhutan · ${places.slice(0, 3).map(escapeHtml).join(' · ')}${places.length > 3 ? ` <span>+${places.length - 3} more</span>` : ''}` : 'Bhutan';
    const sections = [['overview', 'Overview'], ['highlights', 'Highlights'], ['itinerary', 'Itinerary'], places.length ? ['route', 'Route'] : null, ['inclusions', 'What’s included'], ['practical', 'Practical notes']].filter(Boolean);
    const days = tour.itinerary.map((day, index) => {
      const details = cleanList(day.details, tour);
      const range = /[–-]/.test(String(day.day));
      return `<details class="itinerary-day" ${index === 0 ? 'open' : ''}><summary><span class="day-number${range ? ' is-range' : ''}" aria-hidden="true">${range ? escapeHtml(day.day) : String(day.day).padStart(2, '0')}</span><span class="day-text"><span class="day-label">${range ? 'Days' : 'Day'} ${escapeHtml(day.day)}</span><strong>${escapeHtml(dayTitle(day))}</strong></span><span class="day-chevron" aria-hidden="true"></span></summary><div class="itinerary-day-body">${details.length ? `<ul>${details.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p>Further details on this day are available on request.</p>'}</div></details>`;
    }).join('');
    const list = items => items.length ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="detail-muted">Details on request.</p>';

    D.setSeo({ title: tour.name, description: summary });

    main.innerHTML = `
      <div class="reading-progress" aria-hidden="true"><span></span></div>
      <section class="detail-hero" aria-labelledby="tour-title">
        ${D.img(heroKey, '100vw', { eager: true, className: 'detail-hero-image' })}
        <div class="detail-hero-shade" aria-hidden="true"></div>
        <div class="detail-hero-inner">
          <div class="detail-hero-copy">
            <nav class="detail-crumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="packages.html">Journeys</a></li><li><a href="categories.html?category=${escapeHtml(categorySlugValue)}">${escapeHtml(tour.category)}</a></li><li aria-current="page">${escapeHtml(tour.name)}</li></ol></nav>
            <div class="detail-hero-kicker">${categoryBadge(tour)}<span class="detail-hero-place">${placeLine}</span></div>
            <h1 id="tour-title">${escapeHtml(tour.name)}</h1>
            <p class="detail-hero-summary">${escapeHtml(summary)}</p>
            <div class="detail-hero-actions">${enquireButton('detail-hero-button')}<a class="detail-hero-link" href="#${tour.itinerary.length ? 'itinerary' : 'overview'}">${tour.itinerary.length ? 'View the itinerary' : 'Explore the journey'} <span aria-hidden="true">↓</span></a></div>
          </div>
          ${highlights.length ? `<aside class="detail-hero-brief" aria-label="Journey highlights"><span class="eyebrow">In brief</span><ol>${highlights.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol></aside>` : ''}
        </div>
        <dl class="detail-hero-facts">
          <div><dt>Duration</dt><dd>${escapeHtml(duration)}</dd></div>
          <div><dt>Route</dt><dd>${places.length ? `${places.length} destination${places.length > 1 ? 's' : ''}` : 'On request'}</dd></div>
          <div><dt>Difficulty</dt><dd>${escapeHtml(difficulty)}</dd></div>
          <div><dt>Best season</dt><dd>${escapeHtml(season)}</dd></div>
          <div class="detail-hero-price"><dt>${quote ? 'Pricing' : 'Planning price'}</dt><dd>${escapeHtml(priceLabel)}</dd></div>
        </dl>
      </section>
      <div class="detail-body">
      <nav class="detail-subnav" aria-label="Journey sections"><ul>${sections.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul></nav>
      <div class="tour-detail-layout" id="tour-details">
        <article class="detail-content">
          <section class="detail-block detail-overview" id="overview" aria-labelledby="overview-title">
            <span class="eyebrow">The journey</span><h2 id="overview-title">Make room for <em>Bhutan.</em></h2>
            <p class="detail-lead">${escapeHtml(summary)}</p>
            <dl class="detail-facts">
              <div><dt>Travel style</dt><dd>${escapeHtml(style)}</dd></div>
              <div><dt>Duration</dt><dd>${escapeHtml(duration)}</dd></div>
              <div><dt>Destinations</dt><dd>${places.length ? places.map(placeLink).join(' · ') : 'Route details on request'}</dd></div>
              <div><dt>Best season</dt><dd>${escapeHtml(season)}</dd></div>
            </dl>
          </section>
          ${galleryKeys.length === 3 ? `<figure class="detail-gallery">
            ${galleryKeys.map((key, i) => D.img(key, i ? '(max-width: 700px) 50vw, 25vw' : '(max-width: 1100px) 100vw, 50vw')).join('')}
            <figcaption>Places on this route: ${stops.map(stop => `<a href="destination-detail.html?place=${stop.id}">${escapeHtml(stop.name)}</a>`).join(' · ')}. Photographs show these destinations, not a specific departure.</figcaption>
          </figure>` : ''}
          <section class="detail-block" id="highlights" aria-labelledby="highlights-title">
            <span class="eyebrow">The moments that stay</span><h2 id="highlights-title">Along the <em>way.</em></h2>
            ${highlights.length ? `<ol class="highlight-list">${highlights.map((item, i) => `<li><span class="highlight-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p>${escapeHtml(item)}</p></li>`).join('')}</ol>` : '<p class="details-request">Highlights are available on request.</p>'}
          </section>
          <section class="detail-block itinerary-block" id="itinerary" aria-labelledby="itinerary-title">
            <div class="block-heading"><div><span class="eyebrow">Day by day</span><h2 id="itinerary-title">A route through <em>the details.</em></h2></div>${days ? '<button class="expand-itinerary" type="button">Expand all</button>' : ''}</div>
            <div class="itinerary-timeline">${days ? `<span class="timeline-progress-line" aria-hidden="true"></span>${days}${missingDays ? `<div class="itinerary-gap"><div><span class="day-label">${missingDays}</span><p>Not yet published. Ask us for the plan for these days.</p></div></div>` : ''}` : '<p class="details-request">A day-by-day itinerary has not been published for this journey yet. Tell us your dates and we’ll share the current route.</p>'}</div>
            ${days && (missingDays || summarised) ? '<p class="itinerary-note">Some days are summarised together or not yet described in full. The confirmed daily plan, including meals, overnight stops and transport, is shared when you enquire.</p>' : days ? '<p class="itinerary-note">Meals, overnight stops and transport are confirmed when you enquire.</p>' : ''}
          </section>
          ${places.length ? `<section class="detail-block route-block" id="route" aria-labelledby="route-title-h">
            <span class="eyebrow">Place to place</span><h2 id="route-title-h">Across <em>the kingdom.</em></h2>
            <div class="route-layout">
              <div class="route-map"><svg viewBox="30 40 640 230" role="img" aria-labelledby="route-title route-desc"><title id="route-title">Illustrative Bhutan route diagram</title><desc id="route-desc">A decorative outline with the destinations listed for this tour. Location and route sequence are not to scale.</desc><path class="bhutan-outline" d="M47 168 85 141 108 149 143 111 179 121 207 89 251 99 281 65 315 81 349 53 374 78 418 71 451 99 486 91 518 120 557 106 581 133 624 128 648 158 624 189 590 191 572 217 533 210 500 237 457 224 427 252 391 235 358 251 322 228 289 248 252 224 222 235 196 210 165 219 140 194 107 202 84 180Z"/><path class="map-ridge" d="M85 170 150 159 217 177 289 142 351 166 415 139 479 166 550 153 616 167"/>${places.slice(0, 8).map((place, i) => { const point = [[118, 164], [181, 154], [247, 178], [316, 142], [381, 171], [452, 139], [520, 170], [589, 154]][i]; return `<g class="map-point" transform="translate(${point[0]} ${point[1]})"><title>${i + 1}. ${escapeHtml(place)}</title><circle r="14"></circle><text x="0" y="4.5" text-anchor="middle">${i + 1}</text></g>`; }).join('')}</svg></div>
              <ol class="route-stops">${places.map(place => `<li>${placeLink(place)}</li>`).join('')}</ol>
            </div>
            <p class="route-note">Schematic illustration, not to scale. The exact route and sequence are confirmed when you plan with us.</p>
          </section>` : ''}
          <section class="detail-block" id="inclusions" aria-labelledby="inclusions-title">
            <span class="eyebrow">What to expect</span><h2 id="inclusions-title">Included, and <em>to confirm.</em></h2>
            <div class="inclusion-columns">
              <div class="inclusion-list is-included"><h3>Included</h3>${list(inclusions)}</div>
              <div class="inclusion-list is-excluded"><h3>Not included</h3>${list(exclusions)}</div>
            </div>
            <p class="detail-muted">Please confirm inclusions and exclusions with our team before booking.</p>
          </section>
          <section class="detail-block practical-block" id="practical" aria-labelledby="practical-title">
            <span class="eyebrow">Before you go</span><h2 id="practical-title">Practical <em>notes.</em></h2>
            <div class="practical-grid">
              <article><span>Best season</span><strong>${escapeHtml(season)}</strong>${monthStripMarkup(tour.bestSeason)}</article>
              <article><span>Difficulty</span><strong>${escapeHtml(difficulty)}</strong><small>Ask us for a current route and altitude profile.</small></article>
              <article><span>Group size</span><strong>On request</strong><small>Confirm availability and minimum group requirements.</small></article>
            </div>
            ${practicalNote ? `<div class="practical-copy"><h3>Additional notes</h3><p>${escapeHtml(practicalNote)}</p></div>` : ''}
          </section>
        </article>
        <aside class="booking-panel" aria-labelledby="booking-title">
          <span class="eyebrow">Your next step</span>
          <h2 id="booking-title">Take this journey <em>further.</em></h2>
          <div class="booking-price-display"><span>${quote ? 'Pricing' : 'Planning price'}</span><strong>${escapeHtml(priceLabel)}</strong><small>${quote ? 'We’ll confirm current availability and pricing.' : 'Currency and pricing basis to be confirmed.'}</small></div>
          <dl class="booking-summary"><div><dt>Duration</dt><dd>${escapeHtml(duration)}</dd></div><div><dt>Style</dt><dd>${escapeHtml(style)}</dd></div><div><dt>Season</dt><dd>${escapeHtml(season)}</dd></div></dl>
          ${supplement ? `<details class="single-supplement"><summary>Single supplement <span aria-hidden="true"></span></summary><p>${escapeHtml(supplement)}. Currency and basis to be confirmed.</p></details>` : ''}
          ${enquireButton('booking-button')}
          <a class="booking-contact" href="contact.html">Prefer a conversation? Contact us <span aria-hidden="true">↗</span></a>
          <p class="booking-panel-foot">Confirm the full itinerary, current fees and inclusions before booking.</p>
        </aside>
      </div>
      </div>
      <section class="detail-related" aria-labelledby="related-title">
        <div class="detail-related-head"><div><span class="eyebrow">Another way to wander</span><h2 id="related-title">You may also <em>like.</em></h2></div><a class="text-link" href="packages.html">View all journeys <span aria-hidden="true">↗</span></a></div>
        <div class="related-grid">${relatedTours(tour).map((item, i) => tourCard({ ...item, destinations: publicPlaces(item), photo: D.src(D.tourImage(item), 1000) }, i)).join('')}</div>
      </section>
      <section class="detail-final-cta" style="--cta-image:url('${D.src('paro-valley', 1600)}')"><span class="eyebrow eyebrow-light">The way is open</span><h2>Make this your<br><em>Bhutan story.</em></h2>${enquireButton('button-cream', 'Start planning')}</section>
      <div class="mobile-booking-bar" role="region" aria-label="Book this journey"><div><small>${quote ? 'Pricing' : 'Planning price'}</small><span class="mobile-booking-price">${escapeHtml(priceLabel)}</span></div>${enquireButton('', quote ? 'Request a Quote' : 'Enquire')}</div>
      ${modalMarkup()}`;
    const related = relatedTours(tour);
    const credited = D.creditsList([heroKey, ...galleryKeys, 'paro-valley', ...related.map(D.tourImage)]);
    main.insertAdjacentHTML('beforeend', `<details class="detail-credits"><summary>Photography credits</summary><ul>${credited.map(c => `<li><a href="${escapeHtml(c.page)}" target="_blank" rel="noopener">${escapeHtml(c.title.replace(/\.(jpe?g|png)$/i, ''))}</a> · ${escapeHtml(c.artist)} · <a href="${escapeHtml(c.licenseUrl)}" target="_blank" rel="noopener">${escapeHtml(c.license)}</a></li>`).join('')}</ul></details>`);
    addTourSchema(tour);
    setupDetailInteractions(tour);
    setupModal(tour.slug);
    setupProgress();
  }

  function monthStripMarkup(season) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const found = season ? months.filter(month => new RegExp(month, 'i').test(season)) : [];
    return `<div class="month-strip" aria-label="Months explicitly listed as a best season">${months.map(month => `<span class="${found.includes(month) ? 'is-listed' : ''}">${month}</span>`).join('')}</div><small class="month-strip-note">${found.length ? 'Only months listed in this package information are highlighted.' : 'Month-by-month timing is available on request.'}</small>`;
  }

  // Prefers journeys that share destinations, then the same category.
  function relatedTours(tour) {
    const mine = new Set(window.HMR_DATA?.tourDestinations[tour.slug] || []);
    const score = item => (window.HMR_DATA?.tourDestinations[item.slug] || []).filter(id => mine.has(id)).length * 2 + (item.category === tour.category ? 1 : 0);
    return tours.filter(item => item.id !== tour.id)
      .map((item, index) => ({ item, index, score: score(item) }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 3)
      .map(entry => entry.item);
  }

  function setupDetailInteractions(tour) {
    const expand = document.querySelector('.expand-itinerary');
    expand?.addEventListener('click', () => {
      const items = [...document.querySelectorAll('.itinerary-day')];
      const open = items.some(item => !item.open);
      items.forEach(item => { item.open = open; });
      expand.textContent = open ? 'Collapse all' : 'Expand all';
    });
    const timeline = document.querySelector('.itinerary-timeline'), drawLine = timeline?.querySelector('.timeline-progress-line');
    if (timeline && drawLine && window.gsap && window.ScrollTrigger && !reducedMotion) window.gsap.to(drawLine, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: timeline, start: 'top 78%', end: 'bottom 48%', scrub: .6 } });
    else if (drawLine) drawLine.classList.add('is-drawn');

    const header = document.querySelector('.header'), subnav = document.querySelector('.detail-subnav');
    let frame = 0;
    const measure = () => {
      frame = 0;
      const stuck = Math.max(0, Math.round(header?.getBoundingClientRect().bottom || 0));
      root.style.setProperty('--detail-head', `${header?.offsetHeight || 0}px`);
      root.style.setProperty('--detail-stick', `${stuck}px`);
      root.style.scrollPaddingTop = `${(header && getComputedStyle(header).position === 'fixed' ? header.offsetHeight : 0) + (subnav?.offsetHeight || 0) + 16}px`;
    };
    const queueMeasure = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    addEventListener('resize', queueMeasure, { passive: true });
    addEventListener('scroll', queueMeasure, { passive: true });

    const links = [...document.querySelectorAll('.detail-subnav a')];
    const targets = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && targets.length) {
      const visible = new Map();
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
        const current = targets.find(target => visible.get(target.id));
        links.forEach(link => {
          const active = current && link.getAttribute('href') === `#${current.id}`;
          link.classList.toggle('is-active', Boolean(active));
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
          if (active && subnav.scrollWidth > subnav.clientWidth) link.parentElement.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      targets.forEach(target => sectionObserver.observe(target));
    }

    const bar = document.querySelector('.mobile-booking-bar');
    const hero = document.querySelector('.detail-hero'), panel = document.querySelector('.booking-panel'), finalCta = document.querySelector('.detail-final-cta'), footer = document.getElementById('site-footer');
    if (bar && 'IntersectionObserver' in window) {
      const covering = new Set();
      const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? covering.add(entry.target) : covering.delete(entry.target));
        const show = !covering.size;
        bar.classList.toggle('is-visible', show);
        bar.inert = !show;
        document.body.classList.toggle('has-booking-bar', show);
      });
      [hero, panel, finalCta, footer].filter(Boolean).forEach(element => barObserver.observe(element));
    } else bar?.classList.add('is-visible');

    document.querySelectorAll('.related-grid .tour-card').forEach(card => {
      card.classList.add('is-visible');
      const photo = card.querySelector('img');
      const markLoaded = () => photo?.classList.add('is-loaded');
      if (photo?.complete) markLoaded(); else photo?.addEventListener('load', markLoaded, { once: true });
      card.addEventListener('click', event => { if (event.target.closest('a')) analytics('tour_card_click', { id: card.dataset.id, source: 'related' }); });
    });
    document.querySelectorAll('.open-enquiry[data-tour]').forEach(button => button.addEventListener('click', () => analytics('tour_card_click', { id: tour.id, action: 'enquiry' })));
  }

  function addTourSchema(tour) {
    const schema = { '@context': 'https://schema.org', '@type': 'TouristTrip', name: tour.name, description: displayOverview(tour).slice(0, 500), touristType: tour.travelStyle || 'Bhutan travel', provider: { '@type': 'TravelAgency', name: 'Himalaya Mindfulness Retreat' }, spatialCoverage: tour.destinations.map(name => ({ '@type': 'Place', name })) };
    if (tour.price != null && tour.currency) schema.offers = { '@type': 'Offer', price: tour.price, priceCurrency: tour.currency };
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify(schema); document.head.append(script);
  }

  function initSharedMotion() {
    document.querySelectorAll('.trust-grid article,.faq-inner,.festival-strip-heading,.finder-heading,.results-heading,.journey-cta-copy,.detail-block,.booking-panel').forEach(element => element.classList.add('reveal-up'));
    if (window.gsap) {
      window.gsap.registerPlugin(...[window.ScrollTrigger, window.Flip].filter(Boolean));
      if (!reducedMotion) {
        if (document.querySelector('.hero-title .hero-char')) window.gsap.fromTo('.hero-title .hero-char', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .025, ease: 'power3.out', delay: .15 });
        window.gsap.utils.toArray('.reveal-up').forEach(element => window.gsap.fromTo(element, { y: 30, opacity: 0, filter: 'blur(4px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }));
        if (window.ScrollTrigger && document.querySelector('.journey-hero')) {
          window.gsap.utils.toArray('.hero-backdrop,[data-depth]').forEach(element => window.gsap.to(element, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.journey-hero', start: 'top top', end: 'bottom top', scrub: true } }));
          if (innerWidth > 860) {
            const rail = document.querySelector('.festival-rail'), section = document.querySelector('.festival-strip-section');
            if (rail && section && rail.scrollWidth > innerWidth) window.gsap.to(rail, { x: () => -(rail.scrollWidth - innerWidth + 70), ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${rail.scrollWidth - innerWidth + 120}`, pin: true, scrub: .8, invalidateOnRefresh: true } });
          }
        }
      }
      window.ScrollTrigger?.refresh();
    } else {
      document.querySelectorAll('.reveal-up').forEach(element => element.classList.add('is-visible'));
    }
    splitHeadline(); setupMagnetic(); setupParallax();
    if (location.hash && document.querySelector(location.hash)) setTimeout(() => document.querySelector(location.hash).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }), 120);
  }

  function splitHeadline() {
    const title = document.querySelector('.hero-title');
    if (!title || reducedMotion) return;
    const lines = [['Walk', 'Into', 'the'], ['Last', 'Himalayan'], ['Kingdom']];
    title.innerHTML = lines.map((words, line) => `<span class="hero-title-line">${line === 1 ? '<em>' : ''}${words.map(word => `<span class="hero-word">${[...word].map(char => `<span class="hero-char" aria-hidden="true">${escapeHtml(char)}</span>`).join('')}</span>`).join('<span class="hero-space"> </span>')}${line === 1 ? '</em>' : ''}</span>`).join('');
  }

  function setupMagnetic() {
    document.querySelectorAll('.magnetic').forEach(button => button.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || reducedMotion) return;
      const rect = button.getBoundingClientRect(); button.style.setProperty('--mag-x', `${(event.clientX - rect.left - rect.width / 2) * .12}px`); button.style.setProperty('--mag-y', `${(event.clientY - rect.top - rect.height / 2) * .12}px`);
    }));
    document.querySelectorAll('.magnetic').forEach(button => button.addEventListener('pointerleave', () => { button.style.setProperty('--mag-x', '0px'); button.style.setProperty('--mag-y', '0px'); }));
  }

  function setupParallax() {
    const hero = document.querySelector('.journey-hero');
    if (!hero || reducedMotion || matchMedia('(hover: none)').matches) return;
    let frame = 0, point = { x: 0, y: 0 };
    hero.addEventListener('pointermove', event => {
      point.x = (event.clientX / innerWidth - .5) * 2; point.y = (event.clientY / innerHeight - .5) * 2;
      if (frame) return;
      frame = requestAnimationFrame(() => { hero.querySelectorAll('[data-depth]').forEach(layer => { const depth = Number(layer.dataset.depth); layer.style.transform = `translate3d(${point.x * depth * 26}px, ${point.y * depth * 22}px, 0)`; }); frame = 0; });
    });
  }

  // The destinations and categories pages load this file only for its text helpers and enquiry dialog.
  window.HMR_TOURTEXT = { escapeHtml, cleanText, cleanList, displayOverview, displayValue, durationText, internalNote, publicPlaces, tourHref, categorySlug, analytics, modalMarkup, setupModal };

  // Entry point also handles tour-to-tour links and the legacy site router's initial markup.
  if (main && window.NB_TOURS && document.body.classList.contains('tours-page')) renderShell();
})();
