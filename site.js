/* Shared shell for every page: header, footer, contact page, enquiry sending and navigation.
   Page scripts (home.js, about.js, discover.js, packages.js, travel-info.js) render their own <main>;
   pages whose <main> carries data-static keep their HTML as written. */

const EMAIL = 'himalayamindfulnessretreat@gmail.com';
const PHONE = '+975 17890334';
const PHONE_HREF = 'tel:+97517890334';

/* Enquiries are relayed by FormSubmit (https://formsubmit.co) to this inbox. The first submission
   triggers a one-time activation email to the inbox; until it is confirmed, visitors get the email fallback. */
const ENQUIRY_INBOX = 'sunofwar23@gmail.com';
const ENQUIRY_ENDPOINT = `https://formsubmit.co/ajax/${ENQUIRY_INBOX}`;

const local = (key, w = 1000) => `Image/home/${key}-${w}.webp`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nav = [['Home', 'index.html'], ['About Us', 'about.html'], ['Destinations', 'destinations.html'], ['Categories', 'categories.html'], ['Packages', 'packages.html'], ['Travel Information', 'travel-info.html'], ['Contact Us', 'contact.html']];
const contactPlaces = ['Paro', 'Thimphu', 'Punakha', 'Phobjikha', 'Bumthang', 'Haa', 'Trongsa', 'Trashigang'];

const icon = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

const logo = '<img class="brand-logo" src="Image/Logo/logo-light-164.webp" srcset="Image/Logo/logo-light-164.webp 2x, Image/Logo/logo-light-246.webp 3x" width="82" height="58" alt="">';
const brand = (extra = '') => `<a class="brand${extra}" href="index.html">${logo}<span class="brand-copy"><b>HIMALAYA</b><small>MINDFULNESS RETREAT</small></span></a>`;

const header = `<header class="header">${brand()}<div class="header-main"><div class="header-topline"><span class="header-place">${icon.pin}11011 Thimphu, Bhutan</span><div class="header-contact"><a href="${PHONE_HREF}">${icon.phone}<span>${PHONE}</span></a><a href="mailto:${EMAIL}">${icon.mail}<span>${EMAIL}</span></a></div></div><div class="header-bottom"><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">☰</button><nav class="nav" id="site-nav" aria-label="Main navigation">${nav.map(([n, h]) => `<a href="${h}">${n}</a>`).join('')}</nav><a class="button button-small header-cta" href="contact.html">Plan your retreat <span aria-hidden="true">↗</span></a></div></div></header>`;

const footer = `<footer class="footer"><div class="footer-top"><div class="footer-brand">${brand(' brand-light')}<p>A mindful pause in the heart of the Himalayas.</p></div><div><h3>Explore</h3><a href="destinations.html">Destinations</a><a href="categories.html">Travel styles</a><a href="packages.html">Our journeys</a><a href="travel-info.html">Travel guide</a><a href="about.html">About us</a></div><div><h3>Contact</h3><p>11011 Thimphu, Bhutan</p><a href="${PHONE_HREF}">${PHONE}</a><a href="mailto:${EMAIL}">${EMAIL.replace('@', '@<wbr>')}</a></div><div class="footer-plan"><h3>Start planning</h3><p>Tell us your dates, interests and pace, and we’ll reply with ideas for your Bhutan journey.</p><a class="footer-plan-link" href="contact.html">Send an enquiry <span aria-hidden="true">↗</span></a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Himalaya Mindfulness Retreat Tours &amp; Travels. Thimphu, Bhutan.</span><span class="footer-legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a><a href="policy.html">Booking Policy</a></span></div></footer>`;

const contactHero = `<section class="page-hero" style="--hero-image:url('${local('heritage-tashichho', 1600)}')"><div class="page-hero-shade"></div><div class="page-hero-content"><div class="breadcrumbs"><a href="index.html">Home</a><span> / </span>Get in touch</div><span class="eyebrow">Get in touch</span><h1>Tell us what you’re dreaming of.</h1><p>A few details are enough to start. A real person from our Bhutan team will help shape what comes next.</p></div><p class="page-hero-credit">Tashichho Dzong, Thimphu · Photo: Bernard Gagnon, <a href="https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_05.jpg" target="_blank" rel="noopener">CC BY-SA 4.0<span class="sr-only"> (opens in a new tab)</span></a></p></section>`;

const contact = () => `${contactHero}<section class="section contact-layout"><div class="contact-details"><span class="eyebrow">Let’s start somewhere</span><h2>Big ideas welcome.<br><i>So are small questions.</i></h2><p>Tell us what brings you to Bhutan, and we’ll get back to you with thoughtful next steps.</p><div class="contact-item"><span aria-hidden="true">✉</span><div><small>EMAIL</small><a href="mailto:${EMAIL}">${EMAIL}</a></div></div><div class="contact-item"><span aria-hidden="true">☏</span><div><small>PHONE</small><a href="${PHONE_HREF}">${PHONE}</a></div></div><div class="contact-item"><span aria-hidden="true">⌖</span><div><small>COME SAY KUZUZANGPO</small><b>11011 Thimphu, Bhutan</b></div></div></div><form class="contact-form" id="contact-form"><h3>Let’s make a plan</h3><p>We usually reply within two working days.</p><input type="text" name="_honey" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-row"><label>Your name<input name="name" autocomplete="name" placeholder="What should we call you?" required maxlength="120"></label><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="160"></label></div><div class="form-row"><label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel" placeholder="With country code" maxlength="40"></label><label>Where would you like to go?<select name="destination"><option value="">Choose a place</option>${contactPlaces.map(p => `<option>${p}</option>`).join('')}<option>Not sure yet</option></select></label></div><div class="form-row"><label>Arrival date<input type="date" name="date"></label><label>Travellers<select name="travellers"><option>2 travellers</option><option>1 traveller</option><option>3 travellers</option><option>4+ travellers</option></select></label></div><label>What are you imagining?<textarea name="message" rows="5" maxlength="4000" placeholder="A little about your plans, interests, and questions..."></textarea></label><button class="button" type="submit">Send enquiry <span aria-hidden="true">↗</span></button><p class="form-note" id="contact-status" role="status" aria-live="polite">We use your details only to reply to your enquiry. See our <a href="privacy.html">Privacy Policy</a>.</p></form></section><section class="section contact-faq"><span class="eyebrow">A few quick answers</span><h2>Wondering <i>about something?</i></h2><div class="faq-row"><article><h3>How soon should I reach out?</h3><p>Earlier is better for peak seasons and festival dates. If your dates are close, send us a note anyway.</p></article><article><h3>Can you customise a package?</h3><p>Yes. Our journeys are a starting point; we can adapt pace, places and experiences around you.</p></article><article><h3>Do I need to know my dates?</h3><p>Not yet. A rough season or month helps, but an early conversation can help you decide when to go.</p></article></div></section>`;

/* Sends any enquiry form through the relay; falls back to a pre-filled email so no enquiry is lost. */
const HMR_ENQUIRY = (() => {
  const fieldLabel = el => (el.labels?.[0]?.childNodes[0]?.textContent || el.name).trim();
  const fieldValue = el => el.tagName === 'SELECT' ? (el.value ? el.selectedOptions[0].text : '') : el.value.trim();
  const collect = form => {
    const data = {};
    [...form.elements].forEach(el => {
      if (!el.name || el.name.startsWith('_') || el.type === 'submit' || el.classList.contains('honeypot')) return;
      const value = fieldValue(el);
      if (value) data[fieldLabel(el)] = value.slice(0, 4000);
    });
    return data;
  };
  const mailtoFallback = (data, subject) => {
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    return `mailto:${ENQUIRY_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  function attach(form, { status, subject = 'New Bhutan journey enquiry', onSent } = {}) {
    if (!form || form.dataset.enquiry) return;
    form.dataset.enquiry = 'on';
    const opened = Date.now();
    const button = form.querySelector('[type="submit"], button:not([type])');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const say = html => { if (status) status.innerHTML = html; };
      const honey = form.querySelector('.honeypot');
      if ((honey && honey.value) || Date.now() - opened < 1500) { say('Thank you. Your enquiry has been sent.'); form.reset(); return; }
      const data = collect(form);
      const email = form.elements.email?.value.trim() || '';
      const payload = { ...data, _subject: subject, _template: 'table', _captcha: 'false', _replyto: email, Page: location.pathname.split('/').pop() || 'index.html' };
      button?.setAttribute('disabled', '');
      form.setAttribute('aria-busy', 'true');
      say('Sending your enquiry…');
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
        clearTimeout(timer);
        const result = await res.json().catch(() => ({}));
        if (!res.ok || String(result.success) !== 'true') throw new Error(result.message || 'Not sent');
        form.reset();
        say('Thank you. Your enquiry has been sent, and we’ll reply by email.');
        onSent?.();
      } catch {
        say(`We couldn’t send this automatically. <a href="${esc(mailtoFallback(data, subject))}">Email your enquiry instead</a>, or call <a href="${PHONE_HREF}">${PHONE}</a>.`);
      } finally {
        button?.removeAttribute('disabled');
        form.removeAttribute('aria-busy');
      }
    });
  }
  return { attach };
})();
window.HMR_ENQUIRY = HMR_ENQUIRY;

const file = location.pathname.split('/').pop() || 'index.html';
const path = file.includes('.') ? file : `${file}.html`;
const pages = { 'index.html': () => window.HMR_HOME?.(), 'about.html': () => window.HMR_ABOUT?.(), 'contact.html': contact, ...(window.HMR_DISCOVER || {}) };

document.getElementById('site-header').innerHTML = header;
document.getElementById('site-footer').innerHTML = footer;
{
  const main = document.getElementById('main');
  const html = main && !main.hasAttribute('data-static') && pages[path]?.();
  if (html) main.innerHTML = html;
}

const current = nav.find(([, url]) => url === path);
if (current) document.querySelectorAll('.nav a').forEach(a => { if (a.textContent === current[0]) a.setAttribute('aria-current', 'page'); });

{
  const menu = document.querySelector('.menu-toggle');
  const navEl = document.querySelector('.nav');
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.textContent = open ? '×' : '☰';
    navEl.classList.toggle('nav-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navEl.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
}

{
  const form = document.getElementById('contact-form');
  if (form) {
    const q = new URLSearchParams(location.search), place = (q.get('destination') || '').slice(0, 40), style = (q.get('category') || '').slice(0, 60);
    if (place || style) {
      const option = [...form.elements.destination.options].find(o => o.text.toLowerCase() === place.toLowerCase());
      if (option) form.elements.destination.value = option.text;
      form.elements.message.value = place ? `I’d like to plan a journey that includes ${place}.` : `I’m interested in a ${style} journey.`;
    }
    HMR_ENQUIRY.attach(form, { status: document.getElementById('contact-status'), subject: 'New enquiry from the Contact page' });
  }
}

/* Query-string routes are distinct pages; keep their canonical URL in step with the selected item. */
{
  const canonical = document.querySelector('link[rel="canonical"]');
  const keep = { 'destination-detail.html': 'place', 'categories.html': 'category', 'package-detail.html': 'trip' }[path];
  const value = keep && new URLSearchParams(location.search).get(keep);
  if (canonical && value) {
    const url = new URL(canonical.href);
    url.search = `?${keep}=${encodeURIComponent(value)}`;
    canonical.href = url.href;
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url.href);
  }
}

{
  const siteHeader = document.querySelector('.header');
  const markScrolled = () => siteHeader?.classList.toggle('is-scrolled', scrollY > 8);
  markScrolled();
  addEventListener('scroll', markScrolled, { passive: true });
}
