/* About page for Himalaya Mindfulness Retreat.
   Loaded only by about.html, before site.js: site.js calls window.HMR_ABOUT() to fill #main,
   and the interactions below run on DOMContentLoaded once that markup exists. */
(() => {
  'use strict';

  /* 4:5 crops of Image/Logo/about-us-founder.jpeg. If photo is emptied, a labelled placeholder is shown instead. */
  const FOUNDER = {
    name: 'Bikash',
    title: 'Founder, Himalaya Mindfulness Retreat Tours & Travels',
    photo: 'Image/about/founder-bikash-819.webp',
    photoSmall: 'Image/about/founder-bikash-480.webp',
    photoAlt: 'Portrait of Bikash, founder of Himalaya Mindfulness Retreat Tours & Travels, wearing a traditional Bhutanese gho',
  };

  /* Transcribed from the business licence image; keep in step with Image/about/business-licence.png. */
  const LICENCE = {
    image: 'Image/about/business-licence.png',
    preview: 'Image/about/business-licence-520.webp',
    number: '06013165',
    business: 'Himalaya Mindfulness Retreat Tours & Travels',
    authority: 'Department of Industry, Ministry of Industry, Commerce and Employment, Royal Government of Bhutan',
    issued: '14 January 2026',
    validity: '14 January 2027',
    validityEnd: '2027-01-14T23:59:59+06:00',
    activity: 'Tour Operator Activities (Tourism Services) W3',
    bsic: '79120',
    classification: 'Services',
    scale: 'Small',
    dzongkhag: 'Thimphu',
    gewog: 'Maedwang',
    village: 'Bemegasa',
    owner: 'Jigme Moktan',
  };

  const PHOTOS = {"about-hero":["Mount Jomolhari 2016","Martyn Smith","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Mount_Jomolhari_2016.jpg",0.6606],"about-flags":["Prayer flags, Sopsokha, Bhutan","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Prayer_flags,_Sopsokha,_Bhutan.jpg",0.7142],"about-phobjikha":["Phobjika Valley in western Bhutan (2) - 43537440604","Prof. Mortel","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Phobjika_Valley_in_western_Bhutan_(2)_-_43537440604.jpg",0.6667],"about-final":["Himalayan peak from Bumthang","Christopher J. Fynn","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Himalayan_peak_from_Bumthang.jpg",0.6623],"heritage-rinpung":["Rinpung Dzong, Bhutan 08","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_08.jpg",0.6667],"paro":["Rinpung Dzong, Bhutan 03","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_03.jpg",0.6667],"thimphu":["Tashichho Dzong, Bhutan 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_01.jpg",0.6666],"punakha":["Punakha Dzong, Bhutan 03","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Punakha_Dzong,_Bhutan_03.jpg",0.5396],"phobjikha":["Phobjika Valley in western Bhutan (2) - 43537440604","Prof. Mortel","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Phobjika_Valley_in_western_Bhutan_(2)_-_43537440604.jpg",0.6667],"bumthang":["Jakar Dzong, Bumthang","Christopher J. Fynn","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0","https://commons.wikimedia.org/wiki/File:Jakar_Dzong,_Bumthang.jpg",0.6624],"haa":["Haa valley, Ha - during LGFC - Bhutan 2019 (31)","Vinayaraj","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Haa_valley,_Ha_-_during_LGFC_-_Bhutan_2019_(31).jpg",0.75],"trashigang":["Trashigang Dzong-rear-2008-01-02","Christopher J. Fynn","CC BY 3.0","https://creativecommons.org/licenses/by/3.0","https://commons.wikimedia.org/wiki/File:Trashigang_Dzong-rear-2008-01-02.jpg",0.75]};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ext = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;

  const aboutImg = (key, sizes, { eager = false, alt = '' } = {}) => {
    const ratio = PHOTOS[key]?.[5] || 0.66;
    return `<img src="Image/about/${key}-1200.webp" srcset="Image/about/${key}-700.webp 700w, Image/about/${key}-1200.webp 1200w, Image/about/${key}-1920.webp 1920w" sizes="${sizes}" width="1200" height="${Math.round(1200 * ratio)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
  const homeImg = (key, sizes, alt = '') => {
    const ratio = PHOTOS[key]?.[5] || 0.66;
    return `<img src="Image/home/${key}-600.webp" srcset="Image/home/${key}-600.webp 600w, Image/home/${key}-1000.webp 1000w" sizes="${sizes}" width="600" height="${Math.round(600 * ratio)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  };
  const credit = (key, place) => {
    const p = PHOTOS[key];
    return p ? `<span class="ab-credit">${place ? `${esc(place)} · ` : ''}Photo: ${esc(p[1])}, ${esc(p[2])}</span>` : '';
  };
  const words = text => text.split(' ').map((w, i) => `<span class="ab-word" style="--i:${i}">${w}</span>`).join(' ');

  const STORY = [
    'I have always believed that the best part of travelling is not simply reaching a destination. It is everything that happens along the way: the unexpected turn in a mountain road, a conversation with a local, the taste of a dish you have never tried before, the sound of prayer flags moving in the wind, or the feeling of standing somewhere so beautiful that words seem unnecessary.',
    'As a traveller at heart, I have always been drawn to the stories that places hold and the people who bring them to life. Every journey offers something new to learn, a different perspective to discover and a reason to see the world a little differently.',
    'Over time, that love of exploration grew into a bigger idea: what if I could help other travellers experience Bhutan not just as visitors, but with genuine curiosity, comfort and connection?',
  ];
  const STORY_AFTER = [
    'Our journey is built around a simple belief: travel should leave you with more than photographs. It should give you stories to tell, people to remember and moments that stay with you long after you return home.',
    'Whether you dream of exploring ancient monasteries, walking through peaceful valleys, experiencing colourful festivals, discovering mountain trails or simply slowing down and enjoying the rhythm of Bhutanese life, I want your journey to feel personal, thoughtful and memorable.',
    'For me, this is more than arranging a trip. It is an opportunity to share a place I care about and help you discover your own reasons to fall in love with Bhutan.',
  ];

  const PRINCIPLES = [
    ['01', 'Travel with Curiosity', 'Look beyond the familiar and discover the stories, traditions and everyday moments that make each place unique.'],
    ['02', 'Connect with Culture', 'Meet Bhutan through its living heritage, local communities, spiritual traditions and the people who give each destination its character.'],
    ['03', 'Make Every Journey Personal', 'Every traveller is different. We aim to create thoughtful experiences that reflect your interests, pace and idea of a meaningful holiday.'],
  ];

  const PLACES = [
    ['paro', 'Paro', 'Western Bhutan', 'destination-detail.html?place=paro', 'Rinpung Dzong above the Paro valley'],
    ['thimphu', 'Thimphu', 'The capital', 'destination-detail.html?place=thimphu', 'Tashichho Dzong in Thimphu'],
    ['punakha', 'Punakha', 'River valley', 'destination-detail.html?place=punakha', 'Punakha Dzong beside the river'],
    ['phobjikha', 'Phobjikha Valley', 'Central Bhutan', 'destination-detail.html?place=phobjikha', 'Meadows across the Phobjikha valley'],
    ['bumthang', 'Bumthang', 'Central Bhutan', 'destination-detail.html?place=bumthang', 'Jakar Dzong in Bumthang'],
    ['haa', 'Haa', 'Western Bhutan', 'destination-detail.html?place=haa', 'Green slopes above the Haa valley'],
    ['trashigang', 'Eastern Bhutan', 'Trashigang & beyond', 'packages.html?destination=Trashigang', 'Trashigang Dzong in eastern Bhutan'],
  ];

  const hero = () => `
    <section class="ab-hero" aria-labelledby="ab-hero-title">
      <div class="ab-hero-media" data-parallax="0.12">${aboutImg('about-hero', '100vw', { eager: true, alt: 'The snow-covered summit of Jomolhari rising above a rocky ridge in western Bhutan' })}</div>
      <div class="ab-hero-shade" aria-hidden="true"></div>
      <div class="ab-hero-inner">
        <p class="ab-eyebrow ab-hero-eyebrow">Our story · Rooted in Bhutan</p>
        <h1 id="ab-hero-title" class="ab-hero-title" aria-label="Every journey begins with a reason to explore."><span aria-hidden="true">${words('Every journey begins')} <br>${words('with a reason')} <em>${words('to explore.')}</em></span></h1>
        <p class="ab-hero-lede">Born from a love of travel and a deep appreciation for Bhutan, we create journeys that bring people closer to the landscapes, traditions and quiet moments that make this kingdom unforgettable.</p>
        <a class="ab-cta-line" href="#founder"><span>Meet the Founder</span><i aria-hidden="true"></i></a>
      </div>
      <div class="ab-hero-foot">
        <p class="ab-hero-place"><span class="ab-dot" aria-hidden="true"></span>Bhutan · The Land of the Thunder Dragon</p>
        <a class="ab-scroll" href="#founder" aria-label="Scroll to the founder’s story"><span>Scroll</span><i aria-hidden="true"></i></a>
        <p class="ab-hero-credit">${credit('about-hero', 'Jomolhari')}</p>
      </div>
    </section>`;

  const portrait = () => FOUNDER.photo
    ? `<img src="${esc(FOUNDER.photo)}" srcset="${esc(FOUNDER.photoSmall)} 480w, ${esc(FOUNDER.photo)} 819w" sizes="(min-width: 1101px) 42vw, (min-width: 761px) 560px, 92vw" alt="${esc(FOUNDER.photoAlt)}" width="819" height="1024" loading="lazy" decoding="async">`
    : `<div class="ab-portrait-placeholder" role="img" aria-label="Founder portrait placeholder"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="11"/><path d="M12 56c2-11 10-17 20-17s18 6 20 17"/></svg><b>Founder Portrait</b><span>Replace with your photograph</span></div>`;

  const founder = () => `
    <section class="ab-founder" id="founder" aria-labelledby="ab-founder-title">
      <p class="ab-vertical" aria-hidden="true">The person behind the journey</p>
      <figure class="ab-portrait" data-reveal="mask">
        <div class="ab-portrait-frame" aria-hidden="true"></div>
        <div class="ab-portrait-img">${portrait()}</div>
        <div class="ab-portrait-inset" data-reveal="rise">${homeImg('heritage-rinpung', '(min-width: 1024px) 16vw, 34vw', 'Carved and painted wooden windows at Rinpung Dzong, Paro')}</div>
        <figcaption><span>The traveller behind the journey.</span></figcaption>
      </figure>
      <div class="ab-founder-copy">
        <p class="ab-eyebrow" data-reveal>The founder</p>
        <h2 id="ab-founder-title" data-reveal>A Traveller at Heart.<br><em>A Host by Nature.</em></h2>
        <div class="ab-letter" data-reveal>
          <p class="ab-letter-open">Hello, and welcome to my little corner of Bhutan.</p>
          ${STORY.map(p => `<p>${p}</p>`).join('')}
          <p class="ab-letter-turn">That idea became <strong>Himalaya Mindfulness Retreat Tours &amp; Travels.</strong></p>
          ${STORY_AFTER.map(p => `<p>${p}</p>`).join('')}
          <p>I look forward to welcoming you.</p>
        </div>
        <div class="ab-signoff" data-reveal>
          <p class="ab-signature">Your journey, our warm welcome.</p>
          <p class="ab-signname"><b>${esc(FOUNDER.name)}</b><span>${esc(FOUNDER.title)}</span></p>
        </div>
      </div>
    </section>`;

  const philosophy = () => `
    <section class="ab-philosophy" aria-labelledby="ab-phil-title">
      <header class="ab-phil-head" data-reveal>
        <p class="ab-eyebrow">What we believe</p>
        <h2 id="ab-phil-title">Travel is more than<br><em>the places you visit.</em></h2>
      </header>
      <ol class="ab-principles" role="list">
        ${PRINCIPLES.map(([n, h, p], i) => `<li data-reveal style="--d:${i * 120}ms"><span class="ab-num" aria-hidden="true">${n}</span><span class="ab-rule" aria-hidden="true"></span><h3><span class="sr-only">${n}. </span>${h}</h3><p>${p}</p></li>`).join('')}
      </ol>
    </section>`;

  const interlude = () => `
    <section class="ab-interlude" aria-label="Photo interlude">
      <figure class="ab-interlude-media" data-reveal="mask">
        <div class="ab-parallax" data-parallax="0.1">${aboutImg('about-flags', '100vw', { alt: 'Tall white prayer flags on a hillside above Sopsokha' })}</div>
        <figcaption>${credit('about-flags', 'Sopsokha')}</figcaption>
      </figure>
      <p class="ab-interlude-line" data-reveal>Some places are best<br><em>discovered slowly.</em></p>
    </section>`;

  const bhutan = () => `
    <section class="ab-bhutan" aria-labelledby="ab-bhutan-title">
      <figure class="ab-bhutan-media" data-reveal="mask">
        <div class="ab-parallax" data-parallax="0.08">${aboutImg('about-phobjikha', '(min-width: 1024px) 62vw, 100vw', { alt: 'Open meadows and forested ridges across the Phobjikha valley' })}</div>
        <figcaption>${credit('about-phobjikha', 'Phobjikha Valley')}</figcaption>
      </figure>
      <div class="ab-bhutan-copy" data-reveal>
        <p class="ab-eyebrow">The place that inspires us</p>
        <h2 id="ab-bhutan-title">Bhutan is not just somewhere to go.<br><em>It is somewhere to feel.</em></h2>
        <p>From ancient monasteries and distinctive architecture to peaceful valleys, vibrant festivals, mountain trails and everyday village life, Bhutan offers countless ways to slow down, look closer and discover something meaningful.</p>
        <a class="ab-cta-line ab-cta-dark" href="packages.html"><span>Explore Bhutan</span><i aria-hidden="true"></i></a>
      </div>
      <ol class="ab-places" role="list" aria-label="Places we travel">
        ${PLACES.map(([key, name, area, href, alt], i) => `<li data-reveal style="--d:${i * 60}ms"><a href="${href}"><span class="ab-place-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="ab-place-name">${name}</span><span class="ab-place-area">${area}</span><span class="ab-place-thumb">${homeImg(key, '160px', alt)}</span><i aria-hidden="true">→</i></a></li>`).join('')}
      </ol>
    </section>`;

  const meta = [
    ['Initial issuance date', LICENCE.issued], ['Validity date shown on licence', LICENCE.validity],
    ['BSIC code', LICENCE.bsic], ['Business classification', LICENCE.classification], ['Scale', LICENCE.scale],
    ['Dzongkhag', LICENCE.dzongkhag], ['Gewog', LICENCE.gewog], ['Village', LICENCE.village],
    ['Owner name shown on licence', LICENCE.owner],
  ];

  const licence = () => `
    <section class="ab-licence" id="licence" aria-labelledby="ab-licence-title">
      <div class="ab-licence-copy" data-reveal>
        <p class="ab-eyebrow">Licensed in Bhutan</p>
        <h2 id="ab-licence-title">Officially Licensed.<br><em>Personally Welcoming.</em></h2>
        <p class="ab-licence-intro">Himalaya Mindfulness Retreat Tours &amp; Travels is registered as a tour operator in Bhutan under a business licence issued by the Department of Industry, Ministry of Industry, Commerce and Employment, Royal Government of Bhutan. Our licence identifies our authorised business activity as Tour Operator Activities (Tourism Services) W3. We believe that clear information and responsible business practices are important parts of building trust with every traveller.</p>
        <div class="ab-licence-key">
          <div><p class="ab-key-label">Licence number</p><p class="ab-key-number">${LICENCE.number}</p></div>
          <div><p class="ab-key-label">Licensed activity</p><p class="ab-key-activity">${esc(LICENCE.activity)}</p></div>
        </div>
        <dl class="ab-licence-meta">
          <div class="ab-meta-wide"><dt>Business name</dt><dd>${esc(LICENCE.business)}</dd></div>
          <div class="ab-meta-wide"><dt>Issuing authority</dt><dd>${esc(LICENCE.authority)}</dd></div>
          ${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <p class="ab-licence-note" id="ab-licence-note">Details are transcribed from the licence shown here. The validity date is the one printed on the document.</p>
      </div>
      <figure class="ab-licence-doc" data-reveal="rise">
        <a class="ab-doc-frame" href="${LICENCE.image}" target="_blank" rel="noopener" data-licence-open aria-label="View the official business licence, licence number ${LICENCE.number}">
          <img src="${LICENCE.preview}" width="520" height="736" alt="Business licence ${LICENCE.number} issued by the Department of Industry, Royal Government of Bhutan, to Himalaya Mindfulness Retreat Tours &amp; Travels" loading="lazy" decoding="async">
          <span class="ab-doc-hint" aria-hidden="true">View full size</span>
        </a>
        <figcaption>Shown unedited. The original carries a QR code for checking its authenticity.</figcaption>
        <a class="ab-button-light" href="${LICENCE.image}" target="_blank" rel="noopener" data-licence-open>View Official Licence <span aria-hidden="true">↗</span></a>
      </figure>
      <dialog class="ab-dialog" id="ab-licence-dialog" aria-labelledby="ab-dialog-title">
        <div class="ab-dialog-bar">
          <h2 id="ab-dialog-title">Business licence · ${LICENCE.number}</h2>
          <div class="ab-dialog-actions">${ext(LICENCE.image, 'Open in new tab')}<button type="button" class="ab-dialog-close" data-licence-close aria-label="Close licence preview">×</button></div>
        </div>
        <div class="ab-dialog-body"><img src="${LICENCE.image}" width="724" height="1024" alt="Full business licence ${LICENCE.number} for Himalaya Mindfulness Retreat Tours &amp; Travels, issued by the Department of Industry, Ministry of Industry, Commerce and Employment, Royal Government of Bhutan" loading="lazy" decoding="async"></div>
      </dialog>
    </section>`;

  const invitation = () => `
    <section class="ab-final" aria-labelledby="ab-final-title">
      <div class="ab-final-media" data-parallax="0.08">${aboutImg('about-final', '100vw', { alt: '' })}</div>
      <div class="ab-final-shade" aria-hidden="true"></div>
      <div class="ab-final-inner" data-reveal>
        <p class="ab-eyebrow">The invitation</p>
        <h2 id="ab-final-title">Your Bhutan story<br><em>starts here.</em></h2>
        <p>Tell us what inspires you: mountain adventures, cultural discoveries, peaceful valleys or a little of everything. Let’s start planning a journey that feels like yours.</p>
        <div class="ab-final-actions"><a class="button button-cream ab-primary" href="packages.html">Explore Our Journeys <span aria-hidden="true">↗</span></a><a class="ab-cta-line" href="contact.html"><span>Talk to Us</span><i aria-hidden="true"></i></a></div>
      </div>
      <p class="ab-final-credit">${credit('about-final', 'Himalayan peak from Bumthang')}</p>
    </section>`;

  const credits = () => `
    <section class="ab-credits" aria-labelledby="ab-credits-title">
      <details><summary><h2 id="ab-credits-title">Photography credits</h2><span>Landscape and heritage photographs from Wikimedia Commons, used under the licences shown.</span></summary>
      <ul role="list">${Object.values(PHOTOS).map(([title, artist, lic, licUrl, page]) => `<li>${ext(page, esc(title))} — ${esc(artist)} · ${licUrl ? ext(licUrl, esc(lic)) : esc(lic)}</li>`).join('')}</ul></details>
    </section>`;

  window.HMR_ABOUT = () => `<div class="ab-progress" aria-hidden="true"><span></span></div>${hero()}${founder()}${philosophy()}${interlude()}${bhutan()}${licence()}${invitation()}${credits()}`;

  /* ---------- Interactions ---------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function setupReveal() {
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('ab-motion');
    const targets = new Map();
    const show = watch => {
      (targets.get(watch) || []).forEach(el => el.classList.add('is-in'));
      targets.delete(watch);
      io.unobserve(watch);
    };
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) show(entry.target);
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    let pending = false;
    // Anchor jumps can skip past elements without them ever intersecting.
    addEventListener('scroll', () => {
      if (pending || !targets.size) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        [...targets.keys()].forEach(watch => { if (watch.getBoundingClientRect().bottom < 0) show(watch); });
      });
    }, { passive: true });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      // Clip-path masks start fully clipped, which IntersectionObserver treats as never visible.
      const watch = el.dataset.reveal === 'mask' ? el.parentElement : el;
      if (!targets.has(watch)) targets.set(watch, []);
      targets.get(watch).push(el);
      io.observe(watch);
    });
  }

  function setupScrollEffects() {
    const bar = document.querySelector('.ab-progress span');
    const layers = [...document.querySelectorAll('[data-parallax]')];
    const wide = matchMedia('(min-width: 1024px)');
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      if (reduced.matches || !wide.matches) { layers.forEach(l => { l.style.transform = ''; }); return; }
      layers.forEach(layer => {
        const box = layer.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) return;
        const offset = (box.top + box.height / 2 - innerHeight / 2) * -Number(layer.dataset.parallax);
        layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    update();
  }

  function setupLicence() {
    const dialog = document.getElementById('ab-licence-dialog');
    const note = document.getElementById('ab-licence-note');
    if (note && Date.now() > new Date(LICENCE.validityEnd).getTime()) {
      note.textContent = `The validity date printed on this licence (${LICENCE.validity}) has passed. Please contact us for our current licensing details.`;
    }
    if (!dialog || typeof dialog.showModal !== 'function') return;
    let opener = null;
    document.querySelectorAll('[data-licence-open]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      dialog.showModal();
      dialog.querySelector('[data-licence-close]').focus();
    }));
    dialog.querySelector('[data-licence-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => opener?.focus());
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.ab-hero')) return;
    setupReveal();
    setupScrollEffects();
    setupLicence();
  });
})();
