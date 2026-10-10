/* Homepage for Himalaya Mindfulness Retreat.
   Loaded only by index.html, before site.js: site.js calls window.HMR_HOME() to fill #main,
   and the interactions below run on DOMContentLoaded once that markup exists. */
(() => {
  'use strict';

  const PHOTOS = {"hero":["Taktsang Monastery, Bhutan 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Taktsang_Monastery,_Bhutan_01.jpg",0.6667],"paro-valley":["The view of PARO Valley, Bhutan from above (34225469743)","Abhijit Kar Gupta from Kolkata, India","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:The_view_of_PARO_Valley,_Bhutan_from_above_(34225469743).jpg",0.6676],"paro":["Rinpung Dzong, Bhutan 03","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_03.jpg",0.6667],"thimphu":["Tashichho Dzong, Bhutan 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_01.jpg",0.6666],"punakha":["Punakha Dzong, Bhutan 03","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Punakha_Dzong,_Bhutan_03.jpg",0.5396],"phobjikha":["Phobjika Valley in western Bhutan (2) - 43537440604","Prof. Mortel","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Phobjika_Valley_in_western_Bhutan_(2)_-_43537440604.jpg",0.6667],"bumthang":["Jakar Dzong, Bumthang","Christopher J. Fynn","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0","https://commons.wikimedia.org/wiki/File:Jakar_Dzong,_Bumthang.jpg",0.6624],"haa":["Haa valley, Ha - during LGFC - Bhutan 2019 (31)","Vinayaraj","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Haa_valley,_Ha_-_during_LGFC_-_Bhutan_2019_(31).jpg",0.75],"trashigang":["Trashigang Dzong-rear-2008-01-02","Christopher J. Fynn","CC BY 3.0","https://creativecommons.org/licenses/by/3.0","https://commons.wikimedia.org/wiki/File:Trashigang_Dzong-rear-2008-01-02.jpg",0.75],"exp-culture":["Tashichho Dzong, Bhutan 13","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_13.jpg",0.6666],"exp-spiritual":["Kyichu Lhakhang-060701","Christopher J. Fynn","CC BY 2.5","https://creativecommons.org/licenses/by/2.5","https://commons.wikimedia.org/wiki/File:Kyichu_Lhakhang-060701.JPG",1.3333],"exp-festivals":["Bhutan festivals 15","Kheng Singye Dorji (KSD)","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Bhutan_festivals_15.jpg",0.6667],"exp-trekking":["Himalayan peak from Bumthang","Christopher J. Fynn","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Himalayan_peak_from_Bumthang.jpg",0.6623],"exp-nature":["20200223142133 IMG 5597-70","Phuentsho","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:20200223142133_IMG_5597-70.jpg",0.6144],"exp-botanical":["Rhododendron kesangiae at Pelela","Phuentsho","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rhododendron_kesangiae_at_Pelela.jpg",0.6667],"exp-cycling":["Druk Wangyal Chortens, Bhutan 04","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Druk_Wangyal_Chortens,_Bhutan_04.jpg",0.6667],"exp-river":["Mo Chhu River seen from Punakha Dzong, July 2016 06","Afifa Afrin","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Mo_Chhu_River_seen_from_Punakha_Dzong,_July_2016_06.jpg",0.75],"exp-family":["Changlimithang Archery Ground, Thimphu 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Changlimithang_Archery_Ground,_Thimphu_01.jpg",0.6666],"exp-slow":["Bumthang-Jakar-10-Valley Resort-Nachbarschaft-2015-gje","Gerd Eichmann","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Bumthang-Jakar-10-Valley_Resort-Nachbarschaft-2015-gje.jpg",0.6667],"heritage-taktsang":["Bhutan-Paro-136-Taktshang-Tigernest-gje","Gerd Eichmann","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Bhutan-Paro-136-Taktshang-Tigernest-gje.jpg",0.6667],"heritage-punakha":["Punakha Dzong, Bhutan 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Punakha_Dzong,_Bhutan_01.jpg",0.6667],"heritage-tashichho":["Tashichho Dzong, Bhutan 05","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_05.jpg",0.6668],"heritage-rinpung":["Rinpung Dzong, Bhutan 08","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_08.jpg",0.6667],"festival-chumey":["Bumthang Chumey Valley Festival 32 (23192193533)","Chuck Moravec","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Bumthang_Chumey_Valley_Festival_32_(23192193533).jpg",0.75],"festival-trashigang":["Trashigang Tshechu","Arian Zwegers","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Trashigang_Tshechu.jpg",0.6667],"nature-forest":["Taktsang Heritage Forest, Bhutan","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Taktsang_Heritage_Forest,_Bhutan.jpg",0.6667],"nature-phobjikha":["Phobjikha valley","Kheng Singye Dorji (KSD)","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Phobjikha_valley.jpg",0.5625],"trek-jomolhari":["Mount Jomolhari 2016","Martyn Smith","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Mount_Jomolhari_2016.jpg",0.6606],"trek-gangkhar":["082 - Gangkar Puensum - 7,570m (Dochula pass) (4677022812)","dhaag23","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:082_-_Gangkar_Puensum_-_7,570m_(Dochula_pass)_(4677022812).jpg",0.75],"local-farmhouse":["Bhutanese Farmhouse Soe Yaksa","Christopher J. Fynn","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0","https://commons.wikimedia.org/wiki/File:Bhutanese_Farmhouse_Soe_Yaksa.jpg",0.75],"local-market":["Centenary Farmers Market, Thimphu 02","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Centenary_Farmers_Market,_Thimphu_02.jpg",0.6667],"local-weaving":["Thimphu Kira Weaving (23676158861)","Chuck Moravec","CC BY 2.0","https://creativecommons.org/licenses/by/2.0","https://commons.wikimedia.org/wiki/File:Thimphu_Kira_Weaving_(23676158861).jpg",0.75],"local-food":["Buff Ema datshi","Satdeep Gill","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Buff_Ema_datshi.jpg",0.75],"gal-flags":["Prayer flags, Sopsokha, Bhutan","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Prayer_flags,_Sopsokha,_Bhutan.jpg",0.7142],"gal-phobjikha":["Phobjikha valley1","Kheng Singye Dorji (KSD)","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Phobjikha_valley1.jpg",0.5625],"gal-terraces":["Rice terraces, Sopsokha, Bhutan 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Rice_terraces,_Sopsokha,_Bhutan_01.jpg",0.6667],"gal-chorten":["National Memorial Chorten, Thimphu 01","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:National_Memorial_Chorten,_Thimphu_01.jpg",0.6667],"gal-trongsa":["Trongsa Dzong 2021-10-24a","Christopher J. Fynn","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Trongsa_Dzong_2021-10-24a.jpg",0.6667],"gal-festival":["Bhutan festivals 18","Kheng Singye Dorji (KSD)","CC0","http://creativecommons.org/publicdomain/zero/1.0/deed.en","https://commons.wikimedia.org/wiki/File:Bhutan_festivals_18.jpg",0.6667],"gal-taktsang":["Taktsang Monastery, Bhutan 03","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Taktsang_Monastery,_Bhutan_03.jpg",0.6666],"gal-autumn":["Thimphu District-06-Reisterrassen-2015-gje","Gerd Eichmann","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Thimphu_District-06-Reisterrassen-2015-gje.jpg",0.6667],"gal-fog":["Druk Wangyal Chortens, Bhutan 02","Bernard Gagnon","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0","https://commons.wikimedia.org/wiki/File:Druk_Wangyal_Chortens,_Bhutan_02.jpg",0.6491]};
  const CHECKED = 'October 2026';
  const OFFICIAL = {
    faqs: 'https://bhutan.travel/faqs',
    visit: 'https://bhutan.travel/visit',
    home: 'https://bhutan.travel/',
    services: 'https://services.bhutan.travel/',
    immigration: 'https://immi.gov.bt/',
  };
  const EMAIL = 'himalayamindfulnessretreat@gmail.com';

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ext = (href, label, cls = '') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;

  /* ---------- Images ---------- */
  const ALT = {
    hero: 'Taktsang Monastery on a forested cliff above a valley filled with mist, Paro',
    'paro-valley': 'The Paro valley seen from above, with farmhouses, fields and forested ridges',
    paro: 'The tiered roofs and whitewashed walls of Rinpung Dzong, Paro',
    thimphu: 'Tashichho Dzong and its lawns on the valley floor in Thimphu',
    punakha: 'Punakha Dzong beside the river, framed by jacaranda in bloom',
    phobjikha: 'Open meadows and pine forest across the wide Phobjikha valley',
    bumthang: 'Jakar Dzong on its ridge above the valley in Bumthang',
    haa: 'Green slopes and a rounded peak above the Haa valley',
    trashigang: 'Trashigang Dzong rising above forested slopes in eastern Bhutan',
    'exp-culture': 'Monks crossing a painted courtyard at Tashichho Dzong, Thimphu',
    'exp-spiritual': 'The golden roof of Kyichu Lhakhang beside a white chorten, Paro',
    'exp-festivals': 'Masked dancers performing before a crowd in a festival courtyard',
    'exp-trekking': 'A snow-covered Himalayan peak beyond pine forest, seen from Bumthang',
    'exp-nature': 'A black-necked crane walking across a winter field',
    'exp-botanical': 'Pink Rhododendron kesangiae in flower at Pele La',
    'exp-cycling': 'Rows of whitewashed memorial chortens on Dochula pass',
    'exp-river': 'Boats on the broad Mo Chhu below Punakha Dzong',
    'exp-family': 'The archery ground and pavilion at Changlimithang, Thimphu',
    'exp-slow': 'Farmhouses and fields spread across the valley floor in Bumthang',
    'heritage-taktsang': 'Taktsang Monastery built into a sheer rock face above the Paro valley',
    'heritage-punakha': 'Punakha Dzong on the riverbank where the Pho Chhu and Mo Chhu meet',
    'heritage-tashichho': 'Whitewashed walls and gilded roofs of Tashichho Dzong, Thimphu',
    'heritage-rinpung': 'Carved and painted wooden windows on the walls of Rinpung Dzong',
    'festival-chumey': 'Masked dancers in bright costume at a village festival in Chumey, Bumthang',
    'festival-trashigang': 'Dancers in the courtyard of Trashigang Dzong during the Tshechu',
    'nature-forest': 'Moss-hung trees in the heritage forest below Taktsang',
    'nature-phobjikha': 'Golden grassland on the floor of the Phobjikha valley beneath forested ridges',
    'trek-jomolhari': 'The snow-covered summit of Jomolhari above a rocky ridge',
    'trek-gangkhar': 'The snowy massif of Gangkhar Puensum on the horizon, seen from Dochula',
    'local-farmhouse': 'A traditional farmhouse with a timber upper storey and shingled roof',
    'local-market': 'Sacks of grains and dried goods at the Centenary Farmers’ Market, Thimphu',
    'local-weaving': 'A weaver at her loom working a patterned textile, Thimphu',
    'local-food': 'A bowl of ema datshi, chillies cooked in melted cheese',
    'gal-flags': 'Tall white prayer flags on a hillside above Sopsokha',
    'gal-phobjikha': 'Late light across the broad Phobjikha valley',
    'gal-terraces': 'Flooded rice terraces at Sopsokha reflecting the sky',
    'gal-chorten': 'The National Memorial Chorten in Thimphu under a clear sky',
    'gal-trongsa': 'Trongsa Dzong among densely forested hills',
    'gal-festival': 'Rows of masked dancers in a dzong courtyard during a festival',
    'gal-taktsang': 'Taktsang Monastery seen across the gorge through pine branches',
    'gal-autumn': 'Golden rice terraces at harvest time in Thimphu district',
    'gal-fog': 'Memorial chortens on Dochula pass emerging from fog',
  };
  const PLACE = {
    hero: 'Taktsang, Paro', 'paro-valley': 'Paro valley', paro: 'Rinpung Dzong, Paro', thimphu: 'Tashichho Dzong, Thimphu',
    punakha: 'Punakha Dzong', phobjikha: 'Phobjikha valley', bumthang: 'Jakar Dzong, Bumthang', haa: 'Haa valley',
    trashigang: 'Trashigang Dzong', 'heritage-taktsang': 'Taktsang, Paro', 'heritage-punakha': 'Punakha Dzong',
    'heritage-tashichho': 'Tashichho Dzong, Thimphu', 'heritage-rinpung': 'Rinpung Dzong, Paro', 'festival-chumey': 'Chumey, Bumthang',
    'nature-phobjikha': 'Phobjikha valley', 'gal-trongsa': 'Trongsa', 'trek-gangkhar': 'Gangkhar Puensum from Dochula',
    'local-farmhouse': 'Farmhouse at Soe Yaksa', 'local-market': 'Centenary Farmers’ Market, Thimphu', 'local-weaving': 'Kira weaving, Thimphu',
    'local-food': 'Ema datshi', 'gal-fog': 'Dochula pass',
  };
  const bigWidth = key => key === 'hero' ? 1600 : 1280;
  const pic = (key, sizes = '100vw', { eager = false, cls = '', alt } = {}) => {
    const ratio = PHOTOS[key]?.[5] || 0.66;
    return `<img${cls ? ` class="${cls}"` : ''} src="Image/home/${key}-1000.webp" srcset="Image/home/${key}-600.webp 600w, Image/home/${key}-1000.webp 1000w, Image/home/${key}-1600.webp ${bigWidth(key)}w" sizes="${sizes}" width="1000" height="${Math.round(1000 * ratio)}" alt="${esc(alt ?? ALT[key] ?? '')}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
  const credit = key => {
    const p = PHOTOS[key];
    if (!p) return '';
    return `<span class="hm-credit">${PLACE[key] ? `${esc(PLACE[key])} · ` : ''}Photo: ${esc(p[1])}, ${esc(p[2])}</span>`;
  };

  /* ---------- Tour data (read-only) ---------- */
  const tours = (window.NB_TOURS || []).filter(t => t.showPublicly);
  const categoryDefs = window.NB_TOUR_CATEGORIES || [];
  const bySlug = slug => tours.find(t => t.slug === slug);
  const tourHref = t => `package-detail.html?trip=${encodeURIComponent(t.slug)}`;
  const clean = value => {
    if (!value || /not specified|not available|not confirmed|to verify|not fully|accessible extract|must be verified/i.test(value)) return '';
    return String(value).replace(/\s*\((?:source listing|as listed by the source)\)/ig, '').trim();
  };
  const summary = t => {
    const text = (t.overview || '').replace(/\s*described by the source as\s+/i, ' ').replace(/\baccording to the source\b/ig, '');
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
    return sentences.filter(s => !/(source|accessible|indexed|not available|not specified|confirm against|verification)/i.test(s)).join(' ').replace(/\s{2,}/g, ' ').trim();
  };
  const places = t => (t.destinations || [])
    .map(p => p.split(';')[0].trim())
    .filter(p => p && /^[A-Z]/.test(p) && !/^(eastern|central|western)\b|listed|source|other stops|including/i.test(p));
  const duration = t => t.durationNeedsConfirmation ? 'Length to confirm' : (t.durationDays ? `${t.durationDays} days` : 'Length on request');
  const isComplete = t => t.itinerary.length > 0 && summary(t).length > 0;
  const priceBlock = t => t.proposedPrice == null
    ? `<span class="hm-price"><b>Price on request</b><small>Quoted for your dates and group</small></span>`
    : `<span class="hm-price"><b>${esc(t.proposedPriceDisplay)}</b><small>Planning figure · currency &amp; basis to confirm</small></span>`;
  const haystack = t => `${t.name} ${t.category} ${t.destinations.join(' ')} ${t.travelStyle || ''} ${t.overview} ${t.highlights.join(' ')}`.toLowerCase();
  const countWhere = fn => tours.filter(fn).length;
  const categorySlug = name => categoryDefs.find(c => c.name === name)?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const seasonOf = monthIndex => ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'][monthIndex];

  /* ---------- Content ---------- */
  const REGIONS = [
    { key: 'paro', name: 'Paro', area: 'Western Bhutan', href: 'destination-detail.html?place=paro',
      fact: 'Home to the country’s international airport, Rinpung Dzong, Kyichu Lhakhang and the cliffside Taktsang Monastery.',
      tip: 'Save the Taktsang hike for the end of your stay, after a few days of walking at altitude.' },
    { key: 'thimphu', name: 'Thimphu', area: 'The capital', href: 'destination-detail.html?place=thimphu',
      fact: 'Bhutan’s capital, with Tashichho Dzong, the National Memorial Chorten and the Centenary Farmers’ Market.',
      tip: 'Pair the farmers’ market with the Textile Museum shop and the craft galleries nearby.' },
    { key: 'punakha', name: 'Punakha', area: 'River valley', href: 'destination-detail.html?place=punakha',
      fact: 'Punakha Dzong stands where the Pho Chhu and Mo Chhu meet, reached from Thimphu over Dochula pass.',
      tip: 'Stop at Dochula on a clear morning, then give the valley a slower afternoon.' },
    { key: 'phobjikha', name: 'Phobjikha & Gangtey', area: 'Central Bhutan', href: 'destination-detail.html?place=phobjikha',
      fact: 'A broad glacial valley known as a winter habitat for black-necked cranes.',
      tip: 'Stay two nights and walk part of the valley. Crane sightings are seasonal and never guaranteed.' },
    { key: 'bumthang', name: 'Bumthang', area: 'Central Bhutan', href: 'destination-detail.html?place=bumthang',
      fact: 'A group of high valleys known for temples and monasteries, with Jakar Dzong and a domestic airport.',
      tip: 'On longer journeys, a domestic flight one way can save a long day on the road.' },
    { key: 'haa', name: 'Haa', area: 'Western Bhutan', href: 'destination-detail.html?place=haa',
      fact: 'A quieter western valley reached from Paro over the Chele La pass.',
      tip: 'Add a night here for walks away from the main western circuit.' },
    { key: 'trashigang', name: 'Trashigang & the east', area: 'Eastern Bhutan', href: 'packages.html?destination=Trashigang', linkLabel: 'See eastern journeys',
      fact: 'Trashigang Dzong and its Tshechu anchor the east, which is reached by domestic flights to Yonphula or by road from Samdrup Jongkhar.',
      tip: 'Best on a longer journey. Our east–west routes are listed at 12 and 14 days.' },
  ];

  const KINDS = [
    { key: 'exp-culture', name: 'Culture & heritage', line: 'Dzongs, craft and the rhythm of valley life.', href: 'packages.html?category=cultural-immersion', count: () => countWhere(t => t.category === 'Cultural Immersion') },
    { key: 'exp-spiritual', name: 'Spiritual journeys', line: 'Temples, pilgrim trails and quiet mornings.', href: 'packages.html?q=monastery', count: () => countWhere(t => haystack(t).includes('monastery')) },
    { key: 'exp-festivals', name: 'Festivals', line: 'Tshechu courtyards and sacred mask dances.', href: 'packages.html?category=festival-tshechu', count: () => countWhere(t => t.category === 'Festival & Tshechu') },
    { key: 'exp-trekking', name: 'Trekking', line: 'High passes, yak pastures and long valleys.', href: 'packages.html?category=trekking', count: () => countWhere(t => t.category === 'Trekking') },
    { key: 'exp-nature', name: 'Nature & birding', line: 'Forests, wetlands and winter cranes.', href: 'packages.html?q=bird', count: () => countWhere(t => haystack(t).includes('bird')) },
    { key: 'exp-botanical', name: 'Botanical', line: 'Rhododendrons, orchids and altitude zones.', href: 'package-detail.html?trip=bhutan-botanical-discovery', single: true },
    { key: 'exp-cycling', name: 'Cycling', line: 'Valley roads and mountain passes by bike.', href: 'package-detail.html?trip=bhutan-on-two-wheels', single: true },
    { key: 'exp-river', name: 'River journeys', line: 'Kayaking and rafting on glacial rivers.', href: 'package-detail.html?trip=rivers-of-the-dragon-kingdom', single: true },
    { key: 'exp-family', name: 'Family travel', line: 'Gentle days shaped around every age.', href: 'contact.html', tailored: true },
    { key: 'exp-slow', name: 'Slow travel', line: 'Fewer places, longer stays, more time.', href: 'contact.html', tailored: true },
  ];

  const SIGNATURE = [
    ['the-western-valleys-circuit', 'paro-valley'],
    ['the-happiness-route', 'gal-flags'],
    ['jomolhari-mountain-trail', 'trek-jomolhari'],
    ['trashigang-mask-dance-journey', 'festival-trashigang'],
    ['bhutan-on-two-wheels', 'gal-autumn'],
  ].map(([slug, image]) => ({ tour: bySlug(slug), image })).filter(item => item.tour);

  const PRINCIPLES = [
    ['01', 'Local, always', 'Your journey is planned from Thimphu, by people who live here. We suggest places, guides and stays we know first-hand, and we’ll tell you plainly when something isn’t a good fit.'],
    ['02', 'Made around you', 'Every itinerary on this site is a starting point. Dates, pace, rooms, walking distances and the balance of culture and landscape are shaped around the people travelling.'],
    ['03', 'Room to breathe', 'We plan fewer stops and longer stays, with unhurried mornings and time left open for a festival, a farmhouse lunch or simply a view worth staying for.'],
    ['04', 'Here when it counts', 'Before you arrive and while you’re here, you can reach our team by phone or email. When plans change with the weather or the roads, we help you adjust.'],
  ];

  const SAMPLES = [
    { slug: 'the-happiness-route', label: 'A first look', span: '6 days', days: [
      ['Days 1–2', 'Paro and Thimphu', 'Arrive in Paro, then settle into the capital’s dzong, markets and craft galleries.'],
      ['Days 3–4', 'Over Dochula to Punakha', 'Cross the pass, then spend time around Punakha Dzong and the river valley.'],
      ['Days 5–6', 'Back to Paro', 'Return west for the Taktsang hike and a slow final evening.'] ] },
    { slug: 'the-western-valleys-circuit', label: 'The western valleys', span: '8 days', days: [
      ['Days 1–2', 'Paro and Thimphu', 'Temples, the capital and time to acclimatise.'],
      ['Days 3–5', 'Punakha and Phobjikha', 'River-valley heritage, then the open glacial valley of Phobjikha.'],
      ['Days 6–8', 'Haa and Paro', 'Cross Chele La to Haa, and finish with Taktsang.'] ] },
    { slug: 'trashigang-mask-dance-journey', label: 'East to west', span: '12 days', days: [
      ['Days 1–4', 'The east', 'Trashigang, Trashi Yangtse and the Tshechu courtyards.'],
      ['Days 5–8', 'Central valleys', 'Mongar, Lhuentse and the temples of Bumthang.'],
      ['Days 9–12', 'The west', 'Punakha, Thimphu and Paro’s best-known landmarks.'] ] },
  ];

  const GUIDE = [
    { title: 'Entry & visas', points: [
      'Indian nationals apply for an entry permit with an Indian passport or voter ID card.',
      'Visitors from Bangladesh and the Maldives need a visa, which can be approved in advance or on arrival.',
      'All other nationalities need a visa approved before travel. Apply online, or your tour operator can apply for you.',
      `The official FAQ lists processing of up to five days and a one-off US$40 visa fee (checked ${CHECKED}).` ],
      links: [[OFFICIAL.immigration, 'Bhutan Immigration Services Portal'], [OFFICIAL.faqs, 'Visa questions on bhutan.travel']] },
    { title: 'Sustainable Development Fee', points: [
      'The SDF is a daily levy that funds healthcare, education, conservation and infrastructure in Bhutan.',
      'Rates differ for Indian nationals, visitors from other countries and children. Some border-town visits are exempt for up to 24 hours.',
      'It is paid with your visa application and is separate from your journey price.' ],
      links: [[OFFICIAL.faqs, 'Current SDF rates on bhutan.travel']] },
    { title: 'Flights & land entry', points: [
      'Drukair and Bhutan Airlines fly into Paro from cities across the region.',
      'There are four official road entry points from India: Phuentsholing, Samtse, Gelephu and Samdrup Jongkhar.',
      'Mountain weather can delay flights, so build a buffer day into onward connections.' ],
      links: [[OFFICIAL.visit, 'Getting here, on bhutan.travel']] },
    { title: 'Getting around', points: [
      'Self-drive hire isn’t available. Most travellers use a vehicle with a driver.',
      'A Department of Tourism–certified guide accompanies visitors throughout, and route permits are no longer needed.',
      'Domestic flights serve Bumthang, Yonphula and Gelephu.' ],
      links: [[OFFICIAL.services, 'Certified operators, guides and hotels']] },
    { title: 'Altitude & health', points: [
      'Many routes cross high passes, and some treks camp above 4,000 m.',
      'Ask your doctor about altitude before you travel, and request the altitude profile of your route.',
      'In an emergency, call 112 for an ambulance, 113 for the police or 110 for the fire service.' ],
      links: [[OFFICIAL.faqs, 'Safety and emergencies, on bhutan.travel']] },
    { title: 'Money & connectivity', points: [
      'The currency is the ngultrum, pegged 1:1 to the Indian rupee. ATMs accept Visa and Mastercard.',
      'Cards work best in towns, so carry some cash for rural areas.',
      'Most hotels have Wi-Fi. Visitor SIM cards are sold at Paro airport and in town.' ],
      links: [[OFFICIAL.faqs, 'Money and SIM cards, on bhutan.travel']] },
    { title: 'Packing', points: [
      'Pack layers: the climate shifts sharply with altitude and season.',
      'Bring clothing that covers shoulders to knees for dzongs and temples, and shoes that slip off easily.',
      'Plug types G, C and D are all in use, so bring adaptors for each.' ],
      links: [] },
    { title: 'Insurance', points: [
      'Travel insurance has not been mandatory since 23 April 2024, but it is strongly recommended.',
      'For treks or river trips, check that your policy covers those activities and evacuation.' ],
      links: [[OFFICIAL.faqs, 'Insurance on bhutan.travel']] },
    { title: 'Etiquette & responsible travel', points: [
      'Keep quiet at sacred sites, remove hats, and don’t photograph inside temples.',
      'Ask before photographing people, and never stand between worshippers and an altar.',
      'Drones generally aren’t permitted. National parks require a permit, which can be applied for online.' ],
      links: [[OFFICIAL.visit, 'Local customs, on bhutan.travel']] },
  ];

  const SEASONS = [
    { name: 'Spring', months: 'March – May', season: 'spring', text: 'A generally dry spring, then occasional showers from mid-April. Forests and rhododendrons come into flower, and it’s an excellent time for botanists.' },
    { name: 'Summer', months: 'June – August', season: 'summer', text: 'The monsoon brings green valleys and farming season, but heavy rain can disrupt roads, mostly in the south. Summer is also when several river sections run.' },
    { name: 'Autumn', months: 'September – November', season: 'autumn', text: 'Bright, clear days after the rains, with harvests and many festivals. It’s a classic window for high treks.' },
    { name: 'Winter', months: 'December – February', season: 'winter', text: 'Crisp, sunny days with frost, and snow is common above 3,000 m. Black-necked cranes winter in Phobjikha.' },
  ];

  const JOURNAL = [
    ['Culture', 'Reading a dzong', 'How Bhutan’s fortress-monasteries are laid out, and what you’re looking at when you step into a courtyard.'],
    ['Seasons', 'Choosing your month', 'Flowers, festivals, clear skies or quiet roads: how each season changes a journey.'],
    ['Practical', 'Your first days at altitude', 'How we pace the early days of a trip, and the questions to ask before a high trek.'],
    ['Local life', 'A morning at the market', 'What’s in season at Thimphu’s farmers’ market, and how to shop respectfully.'],
  ];

  const FAQ = [
    ['Do I have to book through a tour operator?', 'No. Since Bhutan reopened on 23 September 2022, visitors can book their journey independently. A certified guide is still required throughout your stay, and all treks must be done with an accredited operator or guide.', OFFICIAL.faqs],
    ['How long does a visa take?', 'The official FAQ says a correctly completed application can take up to five days. Apply well ahead, and allow longer around peak festival dates.', OFFICIAL.faqs],
    ['What is the SDF, and is it included in your prices?', 'The Sustainable Development Fee is a government levy charged per night. It is paid with your visa application and is separate from our journey prices. We’ll set out the current rate clearly in any quote.', OFFICIAL.faqs],
    ['Can the SDF be refunded if my plans change?', 'The official FAQ says the SDF is refunded for cancelled or shortened trips, less bank charges, through the visa portal.', OFFICIAL.faqs],
    ['When is the best time to visit?', 'Bhutan is a year-round destination. Spring and autumn are the most popular seasons; summer brings the monsoon and greener valleys; winter is crisp and clear. The right month depends on what you want to see.', OFFICIAL.faqs],
    ['Is travel insurance required?', 'It has not been mandatory since 23 April 2024, but it is strongly recommended, particularly for treks and river trips.', OFFICIAL.faqs],
    ['Can I fly a drone?', 'Tourists generally aren’t permitted to bring drones. Any exceptions require a permit obtained in advance.', OFFICIAL.faqs],
    ['Are festival dates fixed?', 'No. Tshechu dates follow the lunar calendar and change each year. We confirm dates against the current official calendar before you book.', null],
  ];

  /* ---------- Markup ---------- */
  const sectionHead = (eyebrow, title, intro = '', id = '') => `<header class="hm-head">${eyebrow ? `<p class="hm-eyebrow">${eyebrow}</p>` : ''}<h2${id ? ` id="${id}"` : ''}>${title}</h2>${intro ? `<p class="hm-intro">${intro}</p>` : ''}</header>`;

  const hero = () => `
    <section class="hm-hero" aria-labelledby="hm-hero-title">
      <div class="hm-hero-media">${pic('hero', '100vw', { eager: true })}</div>
      <div class="hm-hero-shade" aria-hidden="true"></div>
      <div class="hm-hero-inner">
        <p class="hm-hero-brand">Himalaya Mindfulness Retreat</p>
        <p class="hm-hero-kicker">Bhutan · The Himalayan Kingdom</p>
        <h1 id="hm-hero-title">A little closer<br>to <em>what matters.</em></h1>
        <p class="hm-hero-lede">Small, unhurried journeys through Bhutan’s valleys, festivals and high trails. Each is planned in Thimphu around how you like to travel.</p>
        <div class="hm-hero-actions"><a class="button button-cream" href="#hm-signature">Explore journeys <span aria-hidden="true">↓</span></a><a class="button button-outline" href="contact.html">Plan your retreat <span aria-hidden="true">↗</span></a></div>
      </div>
      <p class="hm-hero-credit">${credit('hero')}</p>
    </section>
    <form class="hm-planner" id="hm-planner" action="packages.html" method="get" aria-label="Find a journey">
      <div class="hm-field"><label for="hm-dest">Where</label><select id="hm-dest" name="destination"><option value="">Anywhere in Bhutan</option>${['Paro', 'Thimphu', 'Punakha', 'Phobjikha', 'Bumthang', 'Haa', 'Trashigang'].map(p => `<option value="${p}">${p === 'Phobjikha' ? 'Phobjikha & Gangtey' : p}</option>`).join('')}</select></div>
      <div class="hm-field"><label for="hm-month">When</label><select id="hm-month"><option value="">Any month</option>${MONTHS.map((m, i) => `<option value="${i}">${m}</option>`).join('')}</select><input type="hidden" name="season" id="hm-season" disabled></div>
      <div class="hm-field"><label for="hm-guests">Travellers</label><select id="hm-guests" name="travellers"><option value="1">1 traveller</option><option value="2" selected>2 travellers</option><option value="3">3 travellers</option><option value="4">4 travellers</option><option value="5+">5 or more</option></select></div>
      <button class="button hm-planner-submit" type="submit">Search journeys <span aria-hidden="true">↗</span></button>
      <p class="hm-planner-status" id="hm-planner-status" aria-live="polite"></p>
    </form>`;

  const glance = () => `
    <section class="hm-section hm-glance" aria-labelledby="hm-glance-title">
      <div class="hm-glance-lead">
        ${sectionHead('Bhutan at a glance', 'A small kingdom<br>with a <em>long memory.</em>', '', 'hm-glance-title')}
        <p>Between the high Himalaya and subtropical foothills, Bhutan holds glaciers, pine and broadleaf forest, rice terraces and fortress-monasteries within one small mountain kingdom. The government describes it as the last Vajrayana Buddhist country in the world.</p>
      </div>
      <dl class="hm-facts">
        <div><dt>Language</dt><dd>Dzongkha is the national language; English is widely understood.</dd></div>
        <div><dt>Currency</dt><dd>Ngultrum (Nu.), pegged 1:1 to the Indian rupee.</dd></div>
        <div><dt>Arriving</dt><dd>Most international flights land at Paro. Four road crossings link Bhutan with India.</dd></div>
        <div><dt>Seasons</dt><dd>Spring Mar–May, summer Jun–Aug, autumn Sep–Nov, winter Dec–Feb.</dd></div>
        <div><dt>Guides</dt><dd>A certified guide accompanies visitors throughout their stay.</dd></div>
        <div><dt>Calling</dt><dd>The country code is +975.</dd></div>
      </dl>
      <p class="hm-source">Facts from Bhutan’s official tourism site, ${ext(OFFICIAL.faqs, 'bhutan.travel')}, checked ${CHECKED}.</p>
    </section>`;

  const regions = () => `
    <section class="hm-section hm-regions" aria-labelledby="hm-regions-title">
      ${sectionHead('Regions', 'Seven valleys<br>to <em>begin with.</em>', 'Each valley has its own altitude, character and pace. “Known for” lists documented facts. “Our suggestion” is our team’s planning advice.', 'hm-regions-title')}
      <ul class="hm-region-list" role="list">
        ${REGIONS.map((r, i) => `<li class="hm-region${i === 0 ? ' is-feature' : ''}" data-reveal>
          <a class="hm-region-media" href="${r.href}" tabindex="-1" aria-hidden="true">${pic(r.key, i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw')}</a>
          <div class="hm-region-body">
            <p class="hm-region-area">${r.area}</p>
            <h3><a href="${r.href}">${r.name}</a></h3>
            <p class="hm-region-fact"><span>Known for</span>${r.fact}</p>
            <p class="hm-region-tip"><span>Our suggestion</span>${r.tip}</p>
            <a class="hm-link" href="${r.href}">${r.linkLabel || `Explore ${r.name}`} <span aria-hidden="true">→</span></a>
          </div>
        </li>`).join('')}
      </ul>
    </section>`;

  const kinds = () => `
    <section class="hm-section hm-kinds" aria-labelledby="hm-kinds-title">
      ${sectionHead('Discover your kind of Bhutan', 'Start with what<br><em>moves you.</em>', 'Ten ways into the kingdom. Where we list a journey, the link takes you to it. Where we don’t yet, we’ll design one with you.', 'hm-kinds-title')}
      <ul class="hm-kind-rail" role="list">
        ${KINDS.map(k => {
          const n = k.count ? k.count() : 0;
          const meta = k.tailored ? 'Tailored on request' : k.single ? '1 listed journey' : `${n} listed ${n === 1 ? 'journey' : 'journeys'}`;
          return `<li class="hm-kind" data-reveal><a href="${k.href}">${pic(k.key, '(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 70vw')}<span class="hm-kind-shade" aria-hidden="true"></span><span class="hm-kind-copy"><b>${k.name}</b><span>${k.line}</span><small>${meta} <span aria-hidden="true">→</span></small></span></a></li>`;
        }).join('')}
      </ul>
    </section>`;

  const signatureCard = ({ tour: t, image }, i) => {
    const facts = [['Length', duration(t)], ['Pace', clean(t.difficulty)], ['Best season', clean(t.bestSeason)], ['Route', places(t).slice(0, 4).join(' · ')]].filter(([, v]) => v);
    return `<article class="hm-sig${i === 0 ? ' is-lead' : ''}" data-reveal>
      <a class="hm-sig-media" href="${tourHref(t)}" tabindex="-1" aria-hidden="true">${pic(image, i === 0 ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw')}</a>
      <div class="hm-sig-body">
        <p class="hm-tag">${esc(t.category)}</p>
        <h3><a href="${tourHref(t)}">${esc(t.name)}</a></h3>
        <p>${esc(summary(t))}</p>
        <dl class="hm-sig-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="hm-sig-foot">${priceBlock(t)}<a class="hm-link" href="${tourHref(t)}">View journey <span aria-hidden="true">→</span></a></div>
      </div>
    </article>`;
  };

  const signature = () => `
    <section class="hm-section hm-signature" id="hm-signature" aria-labelledby="hm-sig-title">
      ${sectionHead('Signature journeys', 'Five journeys<br><em>to begin with.</em>', 'Our best-documented listings, with highlights, routes and practical details. Every one can be tailored.', 'hm-sig-title')}
      <div class="hm-sig-grid">${SIGNATURE.map(signatureCard).join('')}</div>
      <p class="hm-fine">Journeys are priced on request: ask us for a confirmed quote. Government fees such as the SDF are separate.</p>
    </section>`;

  const explorerCard = (t, i) => {
    const complete = isComplete(t);
    const route = places(t).slice(0, 3).join(' · ');
    return `<li class="hm-ex-card" data-category="${esc(t.category)}" data-days="${t.durationDays ?? ''}">
      <p class="hm-ex-top"><span class="hm-ex-no">${String(i + 1).padStart(2, '0')}</span><span class="hm-tag">${esc(t.category)}</span></p>
      <h3><a href="${tourHref(t)}">${esc(t.name)}</a></h3>
      <p class="hm-ex-meta">${esc(duration(t))}${route ? ` · ${esc(route)}` : ''}</p>
      ${complete ? '' : `<p class="hm-ex-note">Outline only. <a href="contact.html">Request a tailored itinerary</a></p>`}
      <div class="hm-ex-foot">${priceBlock(t)}<a class="hm-link" href="${tourHref(t)}">View journey <span aria-hidden="true">→</span></a></div>
    </li>`;
  };

  const explorer = () => `
    <section class="hm-section hm-explorer" id="hm-explorer" aria-labelledby="hm-ex-title">
      ${sectionHead('Journey explorer', `All ${tours.length} journeys,<br><em>side by side.</em>`, 'Filter by travel style or length. Some listings are still outlines; open any journey to see what’s confirmed.', 'hm-ex-title')}
      <div class="hm-ex-controls">
        <div class="hm-chips" role="group" aria-label="Filter by travel style">
          <button type="button" class="hm-chip" data-ex-cat="all" aria-pressed="true">All <span>${tours.length}</span></button>
          ${categoryDefs.map(c => `<button type="button" class="hm-chip" data-ex-cat="${esc(c.name)}" aria-pressed="false">${esc(c.name)} <span>${countWhere(t => t.category === c.name)}</span></button>`).join('')}
        </div>
        <label class="hm-ex-length">Length <select id="hm-ex-days"><option value="all">Any length</option><option value="short">Up to 7 days</option><option value="mid">8–12 days</option><option value="long">13 days or more</option></select></label>
      </div>
      <p class="sr-only" id="hm-ex-count" aria-live="polite"></p>
      <div class="hm-ex-viewport">
        <ul class="hm-ex-grid" id="hm-ex-grid" role="list">${tours.map(explorerCard).join('')}</ul>
        <div class="hm-ex-nav"><button type="button" class="hm-round" data-ex-step="-1" aria-label="Previous journeys">←</button><button type="button" class="hm-round" data-ex-step="1" aria-label="Next journeys">→</button></div>
      </div>
      <p class="hm-ex-empty" id="hm-ex-empty" hidden>No listed journey matches both filters. <button type="button" class="hm-text-btn" id="hm-ex-reset">Clear filters</button> or <a href="contact.html">ask us to design one</a>.</p>
      <div class="hm-ex-more"><button type="button" class="button button-secondary" id="hm-ex-more" aria-controls="hm-ex-grid" aria-expanded="false">Show all journeys</button><a class="hm-link" href="packages.html">Open the full journey finder <span aria-hidden="true">→</span></a></div>
    </section>`;

  const heritage = () => `
    <section class="hm-section hm-heritage hm-dark" aria-labelledby="hm-heritage-title">
      <div class="hm-heritage-copy">
        ${sectionHead('Cultural heritage', 'Living places,<br><em>not museums.</em>', '', 'hm-heritage-title')}
        <p>Bhutan’s dzongs are fortress-monasteries. Their courtyards hold both monastic communities and district offices, so you may see monks at prayer and civil servants at work under the same painted eaves. Lhakhangs, the temples, range from village shrines to some of the oldest sacred sites in the Himalaya.</p>
        <ul class="hm-sites" role="list">
          <li><b>Punakha Dzong</b> At the meeting of the Pho Chhu and Mo Chhu rivers.</li>
          <li><b>Rinpung Dzong</b> Above the Paro valley, known for its carved woodwork.</li>
          <li><b>Tashichho Dzong</b> On the riverbank in Thimphu.</li>
          <li><b>Kyichu Lhakhang</b> One of Paro’s most revered temples, traditionally dated to the 7th century.</li>
          <li><b>Taktsang</b> The Tiger’s Nest monastery, reached on foot up a forested cliffside trail.</li>
        </ul>
        <p class="hm-respect">These are places of worship first. Cover shoulders and knees, remove your hat, keep your voice low and don’t take photos inside. Your guide will show you the way. ${ext(OFFICIAL.visit, 'Official etiquette guidance', 'hm-link hm-link-light')}</p>
      </div>
      <div class="hm-heritage-mosaic">
        ${['heritage-taktsang', 'heritage-punakha', 'heritage-tashichho', 'heritage-rinpung'].map((k, i) => `<figure class="hm-mosaic-${i + 1}" data-reveal>${pic(k, '(min-width: 1024px) 25vw, 50vw')}<figcaption>${credit(k)}</figcaption></figure>`).join('')}
      </div>
    </section>`;

  const festivalTours = tours.filter(t => t.category === 'Festival & Tshechu');
  const festivals = () => `
    <section class="hm-section hm-festivals" aria-labelledby="hm-fest-title">
      <figure class="hm-fest-media" data-reveal>${pic('festival-chumey', '(min-width: 1024px) 50vw, 100vw')}<figcaption>${credit('festival-chumey')}</figcaption></figure>
      <div class="hm-fest-copy">
        ${sectionHead('Festivals', 'Courtyards full of<br><em>colour and devotion.</em>', '', 'hm-fest-title')}
        <p>A tshechu is a religious festival held in a dzong or temple courtyard. Masked dances re-enact Buddhist teachings, and families arrive in their finest gho and kira. You come as a guest, and local people are there to practise their faith.</p>
        <p><strong>About dates:</strong> festival dates follow the lunar calendar and change every year. We only confirm dates once they appear in the current official calendar, so none are listed here.</p>
        <ul class="hm-fest-list" role="list">${festivalTours.map(t => `<li><a href="${tourHref(t)}"><span>${esc(t.name)}</span><small>${esc(duration(t))}</small></a></li>`).join('')}</ul>
        <div class="hm-actions"><a class="button" href="packages.html?category=festival-tshechu">See festival journeys <span aria-hidden="true">↗</span></a><a class="button button-secondary" href="contact.html">Ask about festival dates</a></div>
      </div>
    </section>`;

  const nature = () => `
    <section class="hm-section hm-nature" aria-labelledby="hm-nature-title">
      ${sectionHead('Nature', 'Forest kingdom,<br><em>wild at heart.</em>', 'Forests and protected areas are central to Bhutan’s conservation commitments. Here’s what you can look for, though nothing in nature is guaranteed.', 'hm-nature-title')}
      <div class="hm-nature-grid">
        <figure class="hm-nature-wide" data-reveal>${pic('nature-phobjikha', '(min-width: 1024px) 60vw, 100vw')}<figcaption>${credit('nature-phobjikha')}</figcaption></figure>
        <div class="hm-nature-notes">
          <article><h3>Black-necked cranes</h3><p>Phobjikha is known as a winter habitat for these cranes. Sightings depend on the season and the birds themselves.</p></article>
          <article><h3>Rhododendrons &amp; orchids</h3><p>Spring is when much of the country flowers. Our botanical journey visits the botanical park at Lamperi and the Biodiversity Centre in Thimphu.</p></article>
          <article><h3>Protected areas</h3><p>Routes can pass through Jigme Dorji, Jigme Singye Wangchuck and Thrumshingla national parks. Entry needs a permit, which can be applied for online.</p></article>
          <article><h3>Leave it as it is</h3><p>Hunting and fishing are illegal in most of Bhutan. Always walk in the wild with an accredited guide.</p></article>
        </div>
        <figure class="hm-nature-side" data-reveal>${pic('gal-trongsa', '(min-width: 1024px) 30vw, 100vw')}<figcaption>${credit('gal-trongsa')}</figcaption></figure>
      </div>
      <div class="hm-actions"><a class="hm-link" href="package-detail.html?trip=bhutan-botanical-discovery">Bhutan Botanical Discovery <span aria-hidden="true">→</span></a><a class="hm-link" href="packages.html?q=bird">Birding journeys <span aria-hidden="true">→</span></a><a class="hm-link" href="package-detail.html?trip=black-necked-crane-festival-escape">Black-Necked Crane Festival Escape <span aria-hidden="true">→</span></a></div>
    </section>`;

  const TREKS = [
    ['jomolhari-mountain-trail', 'Approx. 80–85 km; high camp around 4,040 m'],
    ['druk-path-and-tsaluna-trek', ''],
    ['punakha-to-trongsa-heritage-trail', 'Sections of the Trans Bhutan Trail'],
    ['gangkhar-puensum-wilderness-trek', 'Maximum altitude to confirm'],
    ['snowman-wilderness-expedition', 'Maximum altitude approx. 5,470 m'],
    ['bhutan-on-two-wheels', 'Paro–Thimphu ride listed at 65 km'],
    ['rivers-of-the-dragon-kingdom', 'Class I–V sections, by river and season'],
  ].map(([slug, note]) => ({ t: bySlug(slug), note })).filter(x => x.t);

  const trekking = () => `
    <section class="hm-section hm-trek hm-dark" aria-labelledby="hm-trek-title">
      <figure class="hm-trek-media">${pic('trek-gangkhar', '100vw')}<figcaption>${credit('trek-gangkhar')}</figcaption></figure>
      <div class="hm-trek-inner">
        ${sectionHead('Trekking & adventure', 'High trails,<br><em>honest details.</em>', 'Figures below are as listed in each journey. Ask us for a current altitude profile, route conditions and what your insurance covers before you commit.', 'hm-trek-title')}
        <div class="hm-table-wrap" role="region" aria-labelledby="hm-trek-title" tabindex="0">
          <table class="hm-trek-table">
            <thead><tr><th scope="col">Journey</th><th scope="col">Length</th><th scope="col">Listed level</th><th scope="col">Season</th><th scope="col">Notes</th></tr></thead>
            <tbody>${TREKS.map(({ t, note }) => `<tr><th scope="row"><a href="${tourHref(t)}">${esc(t.name)}</a></th><td>${esc(duration(t))}</td><td>${esc(clean(t.difficulty) || 'On request')}</td><td>${esc(clean(t.bestSeason) && clean(t.bestSeason).length < 48 ? clean(t.bestSeason) : (clean(t.bestSeason) ? 'Varies by section' : 'On request'))}</td><td>${esc(note || 'Details on request')}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <p class="hm-source hm-source-light">The Department of Tourism requires every trek to be done with an accredited operator or guide. ${ext(OFFICIAL.faqs, 'Read the official guidance', 'hm-link hm-link-light')}</p>
      </div>
    </section>`;

  const LOCAL = [
    ['local-farmhouse', 'Farmhouse hospitality', 'Many families still live in ancestral homes. Visits and stays are arranged only through Department of Tourism–approved accommodation.'],
    ['local-market', 'Market mornings', 'The Centenary Farmers’ Market in Thimphu is a good place to see what’s in season, from chillies to red rice.'],
    ['local-weaving', 'Weaving & craft', 'Textiles are among Bhutan’s great arts. The Textile Museum shop and nearby galleries sell artisan-made pieces.'],
    ['local-food', 'At the table', 'Ema datshi, chillies in melted cheese, is the dish everyone talks about. Tell us about spice levels and dietary needs.'],
  ];
  const localLife = () => `
    <section class="hm-section hm-local" aria-labelledby="hm-local-title">
      ${sectionHead('Local life', 'The everyday,<br><em>up close.</em>', 'Every encounter is arranged respectfully, with people’s privacy in mind. Always ask before taking a photograph.', 'hm-local-title')}
      <ul class="hm-local-grid" role="list">${LOCAL.map(([k, h, p]) => `<li data-reveal><figure>${pic(k, '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw')}<figcaption>${credit(k)}</figcaption></figure><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
    </section>`;

  const why = () => `
    <section class="hm-section hm-why" aria-labelledby="hm-why-title">
      ${sectionHead('Why travel with us', 'Four things<br><em>we hold to.</em>', '', 'hm-why-title')}
      <ol class="hm-principles" role="list">${PRINCIPLES.map(([n, h, p]) => `<li data-reveal><span class="hm-num" aria-hidden="true">${n}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
      <a class="hm-link" href="about.html">More about our team <span aria-hidden="true">→</span></a>
    </section>`;

  const samples = () => `
    <section class="hm-section hm-samples" aria-labelledby="hm-samples-title">
      ${sectionHead('Sample itineraries', 'Three shapes<br><em>a trip can take.</em>', 'These outlines are illustrative and simplified. The linked journey pages show the details as listed, and we tailor every plan to you.', 'hm-samples-title')}
      <div class="hm-sample-grid">${SAMPLES.map(s => { const t = bySlug(s.slug); return t ? `<article class="hm-sample" data-reveal><p class="hm-tag">Illustrative · ${s.span}</p><h3>${s.label}</h3><ol role="list">${s.days.map(([d, h, p]) => `<li><span>${d}</span><b>${h}</b><p>${p}</p></li>`).join('')}</ol><a class="hm-link" href="${tourHref(t)}">Based on ${esc(t.name)} <span aria-hidden="true">→</span></a></article>` : ''; }).join('')}</div>
    </section>`;

  const guide = () => `
    <section class="hm-section hm-guide" id="hm-guide" aria-labelledby="hm-guide-title">
      ${sectionHead('Plan your trip', 'Good to know<br><em>before you go.</em>', `A short guide drawn from Bhutan’s official tourism and immigration sources (checked ${CHECKED}). Rules and fees can change, so always confirm on the official sites before you book.`, 'hm-guide-title')}
      <div class="hm-guide-grid">${GUIDE.map(g => `<article class="hm-guide-card" data-reveal><h3>${g.title}</h3><ul role="list">${g.points.map(p => `<li>${p}</li>`).join('')}</ul>${g.links.length ? `<p class="hm-guide-links">${g.links.map(([href, label]) => ext(href, `${label} <span aria-hidden="true">↗</span>`, 'hm-link')).join('')}</p>` : ''}</article>`).join('')}</div>
      <p class="hm-fine">Have a question these don’t cover? Bhutan’s Department of Tourism runs a free host service at <a href="mailto:hosts@tourism.gov.bt">hosts@tourism.gov.bt</a>. You can also <a href="contact.html">ask our team</a>.</p>
    </section>`;

  const seasons = () => `
    <section class="hm-section hm-seasons" aria-labelledby="hm-seasons-title">
      ${sectionHead('Bhutan by season', 'A year-round<br><em>destination.</em>', 'Altitude and the monsoon shape the climate. The south is subtropical most of the year, while the mountains keep their snow.', 'hm-seasons-title')}
      <ol class="hm-season-row" role="list">${SEASONS.map(s => { const n = countWhere(t => (t.bestSeason || '').toLowerCase().includes(s.season)); return `<li class="hm-season is-${s.season}" data-reveal><p class="hm-season-months">${s.months}</p><h3>${s.name}</h3><p>${s.text}</p>${n ? `<a class="hm-link" href="packages.html?season=${s.season}">${n} ${n === 1 ? 'journey lists' : 'journeys list'} ${s.season} <span aria-hidden="true">→</span></a>` : `<a class="hm-link" href="contact.html">Plan a ${s.season} journey <span aria-hidden="true">→</span></a>`}</li>`; }).join('')}</ol>
      <p class="hm-source">Seasons as described on ${ext(OFFICIAL.faqs, 'bhutan.travel')}.</p>
    </section>`;

  const GALLERY = ['gal-taktsang', 'gal-terraces', 'gal-chorten', 'gal-festival', 'gal-phobjikha'];
  const gallery = () => `
    <section class="hm-section hm-gallery" aria-labelledby="hm-gallery-title">
      ${sectionHead('Gallery', 'Bhutan,<br><em>frame by frame.</em>', '', 'hm-gallery-title')}
      <ul class="hm-gallery-grid" role="list">${GALLERY.map((k, i) => `<li class="hm-g${i + 1}" data-reveal><figure>${pic(k, i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw')}<figcaption>${credit(k)}</figcaption></figure></li>`).join('')}</ul>
    </section>`;

  const journal = () => `
    <section class="hm-section hm-journal" aria-labelledby="hm-journal-title">
      ${sectionHead('Journal', 'Stories we’re<br><em>writing next.</em>', 'Our journal hasn’t launched yet. These are the first pieces we’re planning.', 'hm-journal-title')}
      <ul class="hm-journal-grid" role="list">${JOURNAL.map(([cat, h, p]) => `<li class="hm-journal-card"><p class="hm-tag">${cat} · In preparation</p><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
      <p class="hm-fine">Want to hear when it launches? Our newsletter isn’t live yet either, so please <a href="mailto:${EMAIL}?subject=Journal%20updates">email us</a> and we’ll let you know.</p>
    </section>`;

  const reviews = () => `
    <section class="hm-section hm-reviews" aria-labelledby="hm-reviews-title">
      <div class="hm-reviews-inner">
        <p class="hm-eyebrow">Guest stories</p>
        <h2 id="hm-reviews-title">Real words,<br><em>when they’re ready.</em></h2>
        <p>We’ll only publish reviews from real guests, with their permission and the month they travelled. We don’t have any to share yet, so you won’t find sample quotes here.</p>
        <a class="hm-link" href="contact.html">Ask us anything about travelling with us <span aria-hidden="true">→</span></a>
      </div>
    </section>`;

  const faq = () => `
    <section class="hm-section hm-faq" aria-labelledby="hm-faq-title">
      <div class="hm-faq-head">${sectionHead('Questions', 'Asked often,<br><em>answered plainly.</em>', 'Answers are based on official guidance where it exists.', 'hm-faq-title')}<a class="hm-link" href="travel-info.html">Read the full travel guide <span aria-hidden="true">→</span></a></div>
      <div class="hm-faq-list">${FAQ.map(([q, a, src], i) => `<details class="hm-faq-item"${i === 0 ? ' open' : ''}><summary><span>${q}</span><i aria-hidden="true"></i></summary><div><p>${a}</p>${src ? `<p class="hm-faq-src">Source: ${ext(src, 'bhutan.travel FAQs')}</p>` : ''}</div></details>`).join('')}</div>
    </section>`;

  const finalCta = () => `
    <section class="hm-final" aria-labelledby="hm-final-title">
      <div class="hm-final-media">${pic('gal-fog', '100vw')}</div>
      <div class="hm-final-shade" aria-hidden="true"></div>
      <div class="hm-final-inner" data-reveal>
        <p class="hm-eyebrow hm-eyebrow-light">The first step is a conversation</p>
        <h2 id="hm-final-title">Plan your<br><em>Bhutan journey.</em></h2>
        <p>Tell us when you’d like to travel, who’s coming and what draws you to Bhutan. We’ll reply with honest options and a clear quote.</p>
        <div class="hm-actions"><a class="button button-cream" href="contact.html">Plan your Bhutan journey <span aria-hidden="true">↗</span></a><a class="button button-outline" href="mailto:${EMAIL}?subject=Bhutan%20journey%20enquiry">Email a quick question</a></div>
      </div>
      <p class="hm-final-credit">${credit('gal-fog')}</p>
    </section>`;

  const credits = () => `
    <section class="hm-credits" id="hm-credits" aria-labelledby="hm-credits-title">
      <details><summary><h2 id="hm-credits-title">Photography credits</h2><span>All ${Object.keys(PHOTOS).length} homepage photographs are from Wikimedia Commons and used under the licences shown.</span></summary>
      <ul role="list">${Object.entries(PHOTOS).map(([, [title, artist, lic, licUrl, page]]) => `<li>${ext(page, esc(title))} — ${esc(artist)} · ${licUrl ? ext(licUrl, esc(lic)) : esc(lic)}</li>`).join('')}</ul></details>
    </section>`;

  window.HMR_HOME = () => [hero(), glance(), regions(), kinds(), signature(), explorer(), heritage(), festivals(), nature(), trekking(), localLife(), why(), samples(), guide(), seasons(), gallery(), journal(), reviews(), faq(), finalCta(), credits()].join('');

  /* ---------- Interactions ---------- */
  function setupPlanner() {
    const form = document.getElementById('hm-planner');
    if (!form) return;
    const dest = form.querySelector('#hm-dest'), month = form.querySelector('#hm-month'), season = form.querySelector('#hm-season'), status = form.querySelector('#hm-planner-status');
    const matches = () => {
      const d = dest.value.toLowerCase(), s = month.value === '' ? '' : seasonOf(+month.value);
      return tours.filter(t => (!d || haystack(t).includes(d)) && (!s || (t.bestSeason || '').toLowerCase().includes(s)));
    };
    const update = () => {
      const s = month.value === '' ? '' : seasonOf(+month.value);
      season.value = s; season.disabled = !s;
      const n = matches().length;
      if (!dest.value && !s) { status.textContent = `${tours.length} journeys listed. Choose a valley or a month to narrow them down.`; return; }
      status.innerHTML = n
        ? `${n} ${n === 1 ? 'journey matches' : 'journeys match'}${s ? ` (${MONTHS[+month.value]} falls in ${s})` : ''}.`
        : `No listed journey matches yet${s ? `. ${MONTHS[+month.value]} falls in ${s}, and many listings don’t state a season` : ''}. <a href="contact.html">We can plan one for you.</a>`;
    };
    [dest, month].forEach(el => el.addEventListener('change', update));
    update();
  }

  function setupExplorer() {
    const grid = document.getElementById('hm-ex-grid');
    if (!grid) return;
    const cards = [...grid.children];
    const days = document.getElementById('hm-ex-days');
    const more = document.getElementById('hm-ex-more');
    const empty = document.getElementById('hm-ex-empty');
    const count = document.getElementById('hm-ex-count');
    const chips = [...document.querySelectorAll('[data-ex-cat]')];
    const desktop = matchMedia('(min-width: 761px)');
    const LIMIT = 8;
    let cat = 'all', expanded = false;
    const inRange = (d, v) => v === 'all' || (d && (v === 'short' ? d <= 7 : v === 'mid' ? d >= 8 && d <= 12 : d >= 13));
    function apply() {
      const matched = cards.filter(c => (cat === 'all' || c.dataset.category === cat) && inRange(+c.dataset.days, days.value));
      cards.forEach(c => { c.hidden = true; c.classList.remove('is-match'); });
      matched.forEach((c, i) => { c.classList.add('is-match'); c.hidden = desktop.matches && !expanded && i >= LIMIT; });
      const overflow = desktop.matches && matched.length > LIMIT;
      more.hidden = !overflow;
      more.setAttribute('aria-expanded', String(expanded));
      more.textContent = expanded ? 'Show fewer journeys' : `Show all ${matched.length} journeys`;
      empty.hidden = matched.length > 0;
      count.textContent = `${matched.length} ${matched.length === 1 ? 'journey' : 'journeys'} shown`;
      grid.scrollLeft = 0;
    }
    chips.forEach(chip => chip.addEventListener('click', () => {
      cat = chip.dataset.exCat; expanded = false;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      apply();
    }));
    days.addEventListener('change', () => { expanded = false; apply(); });
    more.addEventListener('click', () => {
      const wasExpanded = expanded;
      expanded = !expanded; apply();
      if (wasExpanded) document.getElementById('hm-explorer').scrollIntoView({ block: 'start' });
    });
    document.getElementById('hm-ex-reset').addEventListener('click', () => {
      cat = 'all'; days.value = 'all'; expanded = false;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.exCat === 'all')));
      apply();
    });
    document.querySelectorAll('[data-ex-step]').forEach(btn => btn.addEventListener('click', () => {
      const card = grid.querySelector('.is-match');
      const step = card ? card.getBoundingClientRect().width + 16 : grid.clientWidth * 0.8;
      grid.scrollBy({ left: step * Number(btn.dataset.exStep), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
    desktop.addEventListener('change', apply);
    apply();
  }

  function setupReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('hm-motion');
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  function enhanceFooter() {
    const footer = document.querySelector('.footer-top');
    if (footer && !footer.querySelector('.hm-footer-plan')) {
      const col = document.createElement('div');
      col.className = 'hm-footer-plan';
      col.innerHTML = `<h3>Official resources</h3>${ext(OFFICIAL.home, 'Bhutan Travel')}${ext(OFFICIAL.faqs, 'Visa, SDF &amp; FAQs')}${ext(OFFICIAL.immigration, 'Immigration portal')}${ext(OFFICIAL.services, 'Certified services')}<a href="#hm-credits">Photo credits</a>`;
      footer.querySelector('.footer-plan')?.before(col);
    }
  }

  function openCreditsOnJump() {
    const open = () => { if (location.hash === '#hm-credits') document.querySelector('#hm-credits details')?.setAttribute('open', ''); };
    addEventListener('hashchange', open);
    document.addEventListener('click', e => { if (e.target.closest('a[href="#hm-credits"]')) setTimeout(open); });
    open();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.hm-hero')) return;
    setupPlanner();
    setupExplorer();
    setupReveal();
    enhanceFooter();
    openCreditsOnJump();
  });
})();
