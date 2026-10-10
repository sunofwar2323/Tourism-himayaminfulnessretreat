/* Shared content for the journeys, destinations and categories pages.
   Tour records stay in tours-data.js; this file only adds photographs and place guides keyed to their slugs. */
(() => {
  'use strict';

  const ATTRACTIONS = new Set(['national-museum-paro', 'drukgyel-dzong', 'chele-la', 'buddha-dordenma', 'chimi-lhakhang', 'khamsum-yulley', 'gangtey-goenpa', 'jambay-lhakhang', 'kurjey-lhakhang', 'lhakhang-karpo', 'lhakhang-nagpo', 'trongsa-dzong', 'trongsa-ta-dzong', 'gom-kora', 'chorten-kora', 'trashigang-dzong', 'kyichu-lhakhang', 'punakha-bridge', 'simtokha-dzong', 'tamshing-lhakhang']);
  // Image/home "-1600" files are 1280px wide except the hero; Image/attractions files are true 1600px.
  const widest = key => ATTRACTIONS.has(key) || key === 'hero' ? 1600 : 1280;
  const src = (key, width) => `Image/${ATTRACTIONS.has(key) ? 'attractions' : 'home'}/${key}-${width}.webp`;

  // One photograph per journey. New tours fall back to their imageKey.
  const tourImages = {
    'bhutan-in-five-chapters': 'heritage-taktsang',
    'the-western-valleys-circuit': 'gal-phobjikha',
    'the-essential-valley-escape': 'thimphu',
    'the-happiness-route': 'punakha',
    'signature-bhutan-valleys-and-heritage': 'gal-trongsa',
    'seven-days-in-the-dragon-kingdom': 'gal-chorten',
    'thimphu-festival-and-capital-culture': 'exp-festivals',
    'trashigang-mask-dance-journey': 'festival-trashigang',
    'chorten-kora-and-eastern-bhutan-discovery': 'trashigang',
    'black-necked-crane-festival-escape': 'exp-nature',
    'jambay-sacred-traditions-trail': 'festival-chumey',
    'punakha-festival-and-valley-culture': 'heritage-punakha',
    'paro-tshechu-and-western-heritage': 'heritage-rinpung',
    'rhododendron-country-and-brokpa-culture': 'exp-botanical',
    'royal-highland-gathering': 'haa',
    'jomolhari-mountain-trail': 'trek-jomolhari',
    'snowman-wilderness-expedition': 'exp-trekking',
    'gangkhar-puensum-wilderness-trek': 'trek-gangkhar',
    'punakha-to-trongsa-heritage-trail': 'gal-terraces',
    'druk-path-and-tsaluna-trek': 'gal-fog',
    'bhutan-botanical-discovery': 'exp-slow',
    'birdsong-and-ancient-forest-trails': 'nature-forest',
    'bhutan-birding-adventure': 'nature-phobjikha',
    'bhutan-on-two-wheels': 'exp-cycling',
    'rivers-of-the-dragon-kingdom': 'exp-river',
  };
  const featuredImages = { 'the-western-valleys-circuit': 'paro-valley' };
  const fallbackImages = { culture: 'exp-culture', festival: 'exp-festivals', trekking: 'exp-trekking', nature: 'nature-forest', river: 'exp-river' };
  const focus = { 'exp-nature': '74% 50%', 'gal-phobjikha': '50% 70%', 'exp-botanical': '50% 40%' };

  /* Destinations each tour visits, taken only from the tour's own destination list or itinerary.
     Entries the package information marks as uncertain ("listed in related-trip content",
     "entry region") are left out, and tours without named places have no entry. */
  const tourDestinations = {
    'the-western-valleys-circuit': ['paro', 'thimphu', 'punakha', 'phobjikha', 'haa'],
    'the-essential-valley-escape': ['paro', 'thimphu'],
    'the-happiness-route': ['paro', 'thimphu', 'punakha'],
    'thimphu-festival-and-capital-culture': ['thimphu'],
    'trashigang-mask-dance-journey': ['trashigang', 'bumthang', 'punakha', 'thimphu', 'paro'],
    'chorten-kora-and-eastern-bhutan-discovery': ['trashigang', 'bumthang', 'phobjikha', 'punakha', 'thimphu', 'paro'],
    'black-necked-crane-festival-escape': ['paro', 'thimphu', 'phobjikha'],
    'jambay-sacred-traditions-trail': ['bumthang'],
    'punakha-festival-and-valley-culture': ['punakha'],
    'paro-tshechu-and-western-heritage': ['paro'],
    'jomolhari-mountain-trail': ['paro', 'thimphu'],
    'snowman-wilderness-expedition': ['paro', 'thimphu', 'punakha', 'trongsa'],
    'gangkhar-puensum-wilderness-trek': ['paro'],
    'punakha-to-trongsa-heritage-trail': ['punakha', 'trongsa'],
    'druk-path-and-tsaluna-trek': ['paro', 'thimphu'],
    'bhutan-botanical-discovery': ['bumthang'],
    'bhutan-on-two-wheels': ['paro', 'thimphu', 'punakha', 'phobjikha'],
    'rivers-of-the-dragon-kingdom': ['paro', 'thimphu', 'punakha'],
  };

  const categories = {
    // "hero" heads the filtered view and is chosen so it does not repeat a tour card photograph.
    'cultural-immersion': { image: 'exp-culture', hero: 'exp-culture', tagline: 'Dzongs, temples and daily life' },
    'festival-tshechu': { image: 'exp-festivals', hero: 'gal-festival', tagline: 'Masked dances and sacred courtyards' },
    trekking: { image: 'trek-jomolhari', hero: 'chele-la', tagline: 'High passes and mountain trails' },
    'adventure-nature': { image: 'exp-nature', hero: 'phobjikha', tagline: 'Wildlife, rivers, forests and wheels' },
  };

  const seasons = [
    ['Spring', 'March to May', 'Generally mild, with rhododendrons flowering on many hillsides. Several major tshechus are held in spring.'],
    ['Summer', 'June to August', 'The monsoon brings rain and lush green valleys. Some roads and high trails can be affected.'],
    ['Autumn', 'September to November', 'Usually clearer skies after the monsoon and a popular time for trekking and festivals.'],
    ['Winter', 'December to February', 'Cold, often dry days, with snow possible on the passes and at higher elevations.'],
  ];

  /* Place guides. "match" finds a place by name in a tour's itinerary, so a tour is only
     shown beside a place when its own day-by-day text names it. */
  const destinations = [
    {
      id: 'paro', name: 'Paro', region: 'Western Bhutan', image: 'paro-valley', cardImage: 'heritage-taktsang',
      summary: 'A broad river valley that is home to Bhutan’s only international airport, Rinpung Dzong and the cliffside Taktsang Monastery.',
      highlights: ['Taktsang Monastery', 'Rinpung Dzong', 'National Museum'],
      history: [
        'Paro is one of the kingdom’s oldest settled valleys, and many of its sacred places are tied to the arrival of Buddhism. Kyichu Lhakhang is traditionally attributed to the 7th-century Tibetan king Songtsen Gampo, and the cliff at Taktsang is revered as a place where Guru Rinpoche meditated in the 8th century.',
        'In the 17th century Zhabdrung Ngawang Namgyal, who unified much of Bhutan, built Rinpung Dzong above the river. Drukgyel Dzong, at the head of the valley, was raised to commemorate victory over Tibetan forces. Together they show how Paro served as both a spiritual centre and a guarded gateway to the west.',
      ],
      about: [
        'Today the valley is a patchwork of rice fields, traditional farmhouses and a small town along the Paro Chhu. Because most visitors arrive and depart through Paro International Airport, the valley often frames the first and last days of a journey.',
        'The road west climbs over Chele La to the Haa valley, while the road east follows the river towards Thimphu.',
      ],
      places: [
        { id: 'taktsang', name: 'Taktsang Monastery (Tiger’s Nest)', image: 'heritage-taktsang', match: /taktsang|tiger'?s nest/i, text: 'Bhutan’s best-known monastery clings to a sheer cliff high above the valley floor. It was built in 1692 around a cave associated with Guru Rinpoche, badly damaged by fire in 1998 and later restored.', info: 'Reached on foot by a steep forest trail.' },
        { id: 'rinpung-dzong', name: 'Rinpung Dzong', image: 'paro', match: /rinpung|paro dzong/i, text: 'Built in the 17th century under Zhabdrung Ngawang Namgyal, the “fortress on a heap of jewels” houses Paro’s district administration and monastic body. Its courtyard hosts the annual Paro Tshechu.' },
        { id: 'national-museum', name: 'National Museum (Ta Dzong)', image: 'national-museum-paro', match: /national museum|ta dzong/i, text: 'The round Ta Dzong watchtower above Rinpung Dzong became the National Museum of Bhutan in 1968. Its collections span Bhutanese art, ritual objects and natural history.' },
        { id: 'kyichu-lhakhang', name: 'Kyichu Lhakhang', image: 'kyichu-lhakhang', match: /kyichu/i, text: 'Among the oldest temples in Bhutan, and still an active place of worship visited by local families.' },
        { id: 'drukgyel-dzong', name: 'Drukgyel Dzong', image: 'drukgyel-dzong', match: /dru[kg]+ye?l/i, text: 'The fortress at the head of the valley commemorates victory over Tibetan forces. It was gutted by fire in 1951 and has since been undergoing reconstruction.' },
        { id: 'chele-la', name: 'Chele La', image: 'chele-la', match: /chele ?la/i, text: 'A high road pass between Paro and Haa, strung with prayer flags. On clear days the views reach across forested ridges towards the mountains.' },
      ],
      experiences: [
        ['Walk to Taktsang', 'A steady climb through blue pine forest to a viewpoint facing the monastery, then on to the temple itself. Allow most of a day.'],
        ['Paro Tshechu', 'The spring festival at Rinpung Dzong fills the courtyard with masked dances. Dates follow the lunar calendar and change each year.'],
        ['Valley life', 'Farmhouses, rice terraces and the small town along the river show everyday life in the west.'],
      ],
      seasonNote: 'The Paro Tshechu falls in spring. Its dates move each year, so we check them before you book flights.',
    },
    {
      id: 'thimphu', name: 'Thimphu', region: 'Western Bhutan', image: 'heritage-tashichho', cardImage: 'thimphu',
      summary: 'Bhutan’s capital since 1955, where Tashichho Dzong sits beside markets, monuments and the national archery ground.',
      highlights: ['Tashichho Dzong', 'National Memorial Chorten', 'Buddha Dordenma'],
      history: [
        'Thimphu became the capital of Bhutan in 1955, taking over the role from Punakha. Tashichho Dzong, on the west bank of the Wang Chhu, is the seat of the government and of the King’s office, and the summer residence of the Central Monk Body.',
        'South of the city, Simtokha Dzong was built in 1629 by Zhabdrung Ngawang Namgyal and is among the oldest dzongs in the country. The National Memorial Chorten was completed in 1974 in memory of the Third King, Jigme Dorji Wangchuck.',
      ],
      about: [
        'Thimphu is the country’s largest town, yet it keeps a human scale: traffic police still direct the main junction, and traditional architecture is required for new buildings.',
        'It is a natural place to meet Bhutanese culture up close, from the weekend market to archery matches and weaving.',
      ],
      places: [
        { id: 'tashichho-dzong', name: 'Tashichho Dzong', image: 'heritage-tashichho', match: /tashichh?o|trashi ?chh?oe?/i, text: 'The seat of Bhutan’s government and the summer home of the Central Monk Body, set among lawns beside the Wang Chhu.' },
        { id: 'memorial-chorten', name: 'National Memorial Chorten', image: 'gal-chorten', match: /memorial chorten/i, text: 'Completed in 1974 in memory of the Third King. Throughout the day, residents walk clockwise around the white chorten in prayer.' },
        { id: 'buddha-dordenma', name: 'Buddha Dordenma', image: 'buddha-dordenma', match: /buddha (?:dordenma|point)/i, text: 'A giant seated Buddha Shakyamuni statue on a ridge above the southern end of the valley, with wide views over the city.' },
        { id: 'simtokha-dzong', name: 'Simtokha Dzong', image: 'simtokha-dzong', match: /simtokha|semtokha/i, text: 'Built in 1629 by Zhabdrung Ngawang Namgyal, this compact fortress guarding the valley is one of the oldest dzongs in Bhutan.' },
        { id: 'farmers-market', name: 'Centenary Farmers Market', image: 'local-market', match: /farmers'? market|weekend market/i, text: 'The riverside market where farmers from across the region sell vegetables, chillies, cheese and dried goods.' },
        { id: 'changlimithang', name: 'Changlimithang Archery Ground', image: 'exp-family', match: /changlimithang|archery/i, text: 'Archery is Bhutan’s national sport, and matches here come with songs, dances and good-natured rivalry.' },
      ],
      experiences: [
        ['Archery', 'Watch teams compete over long distances, with cheering and celebration after every hit.'],
        ['Weaving and crafts', 'Bhutanese textiles such as the kira are woven by hand on traditional looms.'],
        ['Thimphu Tshechu', 'A major autumn festival of masked dances in the courtyard of Tashichho Dzong.'],
      ],
      seasonNote: 'Autumn brings the Thimphu Tshechu and some of the clearest weather of the year; festival dates change annually.',
    },
    {
      id: 'punakha', name: 'Punakha', region: 'Western Bhutan', image: 'heritage-punakha', cardImage: 'punakha',
      summary: 'A warm, low valley where Punakha Dzong stands at the meeting of the Pho Chhu and Mo Chhu rivers.',
      highlights: ['Punakha Dzong', 'Chimi Lhakhang', 'Dochula pass'],
      history: [
        'Punakha served as Bhutan’s capital until 1955. Punakha Dzong was built in 1637–38 by Zhabdrung Ngawang Namgyal and remains the winter residence of the Je Khenpo and the Central Monk Body.',
        'In 1907 the dzong hosted the coronation of Ugyen Wangchuck, the first King of Bhutan, a defining moment in the kingdom’s history.',
      ],
      about: [
        'Lower and warmer than Thimphu, the valley is known for rice fields and mild winters. The road from Thimphu crosses Dochula, where 108 chortens stand on the pass.',
        'Footpaths lead through the fields to village temples and across long suspension bridges over the rivers.',
      ],
      places: [
        { id: 'punakha-dzong', name: 'Punakha Dzong', image: 'heritage-punakha', match: /punakha dzong/i, text: 'Built in 1637–38 at the confluence of two rivers, the dzong is the winter seat of the Je Khenpo, known for its carved woodwork and riverside setting.' },
        { id: 'chimi-lhakhang', name: 'Chimi Lhakhang', image: 'chimi-lhakhang', match: /chimi/i, text: 'A temple on a low hill among rice fields, associated with the 15th-century saint Drukpa Kunley, known as the Divine Madman.' },
        { id: 'khamsum-yulley', name: 'Khamsum Yulley Namgyal Chorten', image: 'khamsum-yulley', match: /khamsum|yulley/i, text: 'A tiered hilltop temple above the Mo Chhu, reached by a walk up through fields and pine forest.' },
        { id: 'punakha-bridge', name: 'Punakha suspension bridge', image: 'punakha-bridge', match: /suspension bridge/i, text: 'A long footbridge draped in prayer flags that spans the Pho Chhu near the dzong.' },
        { id: 'dochula', name: 'Dochula pass', image: 'gal-fog', match: /dochu ?la/i, text: 'The pass on the road between Thimphu and Punakha, crowned by the 108 Druk Wangyal chortens.' },
      ],
      experiences: [
        ['Walks through the fields', 'Easy footpaths connect farm villages, temples and viewpoints across the valley floor.'],
        ['The rivers', 'The Pho Chhu and Mo Chhu shape the valley; ask us which river activities are possible in your season.'],
        ['Punakha festivals', 'The Punakha Drubchen and Tshechu are held in late winter or early spring, following the lunar calendar.'],
      ],
      seasonNote: 'Punakha’s lower altitude makes it noticeably milder than Thimphu or Paro in winter.',
    },
    {
      id: 'phobjikha', name: 'Phobjikha', region: 'Central Bhutan', image: 'nature-phobjikha', cardImage: 'phobjikha',
      summary: 'A wide glacial valley on the western slopes of the Black Mountains and the winter home of black-necked cranes.',
      highlights: ['Gangtey Goenpa', 'Black-necked cranes', 'Valley trails'],
      history: [
        'Gangtey Goenpa, on a ridge above the valley, was founded in the early 17th century by Pema Thinley, grandson of the treasure revealer Pema Lingpa. It is an important seat of the Nyingma tradition.',
        'Each autumn, endangered black-necked cranes arrive from the Tibetan plateau to spend the winter in the valley’s wetlands. Their return is celebrated with the Black-necked Crane Festival in the courtyard of Gangtey Goenpa.',
      ],
      about: [
        'Phobjikha is broad, open and quiet, with farmhouses on the edge of marshland and pine-covered hills around it.',
        'Much of the valley floor is protected for the cranes, and walking trails cross the fields and forest edges.',
      ],
      places: [
        { id: 'gangtey-goenpa', name: 'Gangtey Goenpa', image: 'gangtey-goenpa', match: /gangtey|gangteng/i, text: 'The 17th-century monastery overlooking the valley, and the setting of the annual Black-necked Crane Festival.' },
        { id: 'phobjikha-valley', name: 'The valley floor', image: 'gal-phobjikha', match: /phobji?kh?a/i, text: 'Wetlands and fields where farmhouses sit on the edge of open grassland, framed by forested hills.' },
        { id: 'cranes', name: 'Black-necked cranes', image: 'exp-nature', match: /crane/i, text: 'The cranes winter in the valley’s wetlands, arriving in late autumn and leaving towards the end of winter.' },
      ],
      experiences: [
        ['Crane watching', 'In winter the cranes can be seen feeding in the marshland from the valley edge.'],
        ['Black-necked Crane Festival', 'Held each year on 11 November at Gangtey Goenpa, with dances that celebrate the cranes’ return.'],
        ['Valley walks', 'Gentle trails cross the fields and forest edges around the valley.'],
      ],
      seasonNote: 'The cranes are usually present from late autumn to late winter; the festival falls on 11 November.',
    },
    {
      id: 'bumthang', name: 'Bumthang', region: 'Central Bhutan', image: 'jambay-lhakhang', cardImage: 'bumthang',
      summary: 'Four high valleys in central Bhutan — Chumey, Choekhor, Tang and Ura — with some of the kingdom’s oldest temples.',
      highlights: ['Jambay Lhakhang', 'Kurjey Lhakhang', 'Jakar Dzong'],
      history: [
        'Bumthang is often described as Bhutan’s spiritual heartland. Jambay Lhakhang is traditionally attributed to Songtsen Gampo in the 7th century, and Kurjey Lhakhang is built around a rock that is said to carry the body imprint of Guru Rinpoche.',
        'The treasure revealer Pema Lingpa was born in Bumthang, and in 1501 he founded Tamshing Lhakhang, whose old wall paintings survive today.',
      ],
      about: [
        'The district’s valleys are higher and cooler than those of the west, with buckwheat fields, pine forests and wooden farmhouses.',
        'The Chumey valley is known for yathra, a woven woollen textile, and Jakar is the main town.',
      ],
      places: [
        { id: 'jambay-lhakhang', name: 'Jambay Lhakhang', image: 'jambay-lhakhang', match: /jambay/i, text: 'An ancient temple in the Choekhor valley and the setting of the autumn Jambay Lhakhang Drup.' },
        { id: 'kurjey-lhakhang', name: 'Kurjey Lhakhang', image: 'kurjey-lhakhang', match: /kurje/i, text: 'A temple complex built around the rock where Guru Rinpoche is said to have meditated and left the imprint of his body.' },
        { id: 'tamshing-lhakhang', name: 'Tamshing Lhakhang', image: 'tamshing-lhakhang', match: /tamshing/i, text: 'Founded in 1501 by Pema Lingpa, the temple is known for its old wall paintings.' },
        { id: 'jakar-dzong', name: 'Jakar Dzong', image: 'bumthang', match: /jakar dzong/i, text: 'The district’s fortress on a ridge above the Choekhor valley and the town of Jakar.' },
      ],
      experiences: [
        ['Temple visits', 'Several of Bhutan’s oldest temples stand within a short distance of each other in the Choekhor valley.'],
        ['Jambay Lhakhang Drup', 'An autumn festival at Jambay Lhakhang, with masked dances and a night-time fire ritual. Dates follow the lunar calendar.'],
        ['Weaving in Chumey', 'The Chumey valley is known for yathra, a brightly patterned woollen cloth.'],
      ],
      seasonNote: 'Bumthang is higher and colder than the western valleys, so winter days are crisp and nights can be very cold.',
    },
    {
      id: 'haa', name: 'Haa', region: 'Western Bhutan', image: 'haa', cardImage: 'lhakhang-karpo',
      summary: 'A quiet valley reached from Paro over Chele La, opened to visitors in 2002 and known for its White and Black temples.',
      highlights: ['Lhakhang Karpo', 'Lhakhang Nagpo', 'Chele La'],
      history: [
        'Haa’s two best-known temples, Lhakhang Karpo (the White Temple) and Lhakhang Nagpo (the Black Temple), are traditionally linked to the 7th-century Tibetan king Songtsen Gampo.',
        'The valley was opened to tourism in 2002, so it remains one of the least visited parts of western Bhutan.',
      ],
      about: [
        'Haa is a narrow, high valley of farmhouses, forest and pasture close to the western border.',
        'The drive from Paro crosses Chele La, one of the highest road passes in the country.',
      ],
      places: [
        { id: 'lhakhang-karpo', name: 'Lhakhang Karpo', image: 'lhakhang-karpo', match: /lhakhang karpo|white temple/i, text: 'The White Temple, traditionally linked to Songtsen Gampo, at the heart of the valley.' },
        { id: 'lhakhang-nagpo', name: 'Lhakhang Nagpo', image: 'lhakhang-nagpo', match: /lhakhang nagpo|black temple/i, text: 'The Black Temple, a short distance from Lhakhang Karpo and part of the same tradition.' },
        { id: 'chele-la-haa', name: 'Chele La', image: 'chele-la', match: /chele ?la/i, text: 'The high pass between Paro and Haa, with prayer flags and views over forested ridges.' },
      ],
      experiences: [
        ['Crossing Chele La', 'The road over the pass is a journey in itself, rising through forest to open ridges.'],
        ['Village life', 'Haa’s farmhouses and pastures give a quiet view of rural life in the west.'],
      ],
      seasonNote: 'Chele La can see snow in winter; ask us about road conditions for your dates.',
    },
    {
      id: 'trongsa', name: 'Trongsa', region: 'Central Bhutan', image: 'trongsa-dzong', cardImage: 'gal-trongsa',
      summary: 'The geographic heart of Bhutan, where Trongsa Dzong commands the historic route between east and west.',
      highlights: ['Trongsa Dzong', 'Ta Dzong watchtower'],
      history: [
        'Trongsa Dzong was founded in the 17th century and grew into the largest dzong in Bhutan. From here the Trongsa Penlop controlled the road between the eastern and western parts of the country.',
        'The dzong is the ancestral seat of the Wangchuck dynasty: the first two Kings ruled from Trongsa, and the heir to the throne traditionally holds the title of Trongsa Penlop before becoming King.',
      ],
      about: [
        'The town sits high on a ridge above the Mangde Chhu gorge, with the dzong spread along the slope below.',
        'Above the dzong, the Ta Dzong watchtower now houses a museum.',
      ],
      places: [
        { id: 'trongsa-dzong', name: 'Trongsa Dzong', image: 'trongsa-dzong', match: /trongsa dzong/i, text: 'A long, layered fortress above the gorge, and the ancestral seat of Bhutan’s royal family.' },
        { id: 'trongsa-ta-dzong', name: 'Ta Dzong, Trongsa', image: 'trongsa-ta-dzong', match: /ta dzong/i, text: 'The watchtower above the dzong, which once guarded it and now houses a museum.' },
      ],
      experiences: [
        ['Royal history', 'The dzong and watchtower tell the story of how the Wangchuck dynasty rose to unify the country.'],
        ['The road east and west', 'Trongsa is the meeting point of journeys between western, central and eastern Bhutan.'],
      ],
      seasonNote: '',
    },
    {
      id: 'trashigang', name: 'Trashigang', region: 'Eastern Bhutan', image: 'trashigang-dzong', cardImage: 'trashigang',
      summary: 'Eastern Bhutan’s largest district, with a 17th-century dzong above the river and routes to the highland communities of Merak and Sakteng.',
      highlights: ['Trashigang Dzong', 'Gom Kora', 'Chorten Kora'],
      history: [
        'Trashigang Dzong was built in the mid-17th century on a spur high above the Drangme Chhu, guarding the east against invasion from Tibet.',
        'Nearby, Gom Kora is associated with Guru Rinpoche, who is said to have meditated there. Further north in Trashi Yangtse, the great stupa of Chorten Kora was built in the 18th century and modelled on Boudhanath in Kathmandu.',
      ],
      about: [
        'The east is warmer, greener and far less visited than the western valleys, with roads winding through deep river gorges.',
        'Trashigang is the gateway to Merak and Sakteng, home of the semi-nomadic Brokpa people.',
      ],
      places: [
        { id: 'trashigang-dzong', name: 'Trashigang Dzong', image: 'trashigang-dzong', match: /trashigang dzong|tashigang dzong/i, text: 'The 17th-century fortress on a spur above the Drangme Chhu, and the setting of the winter Trashigang Tshechu.' },
        { id: 'gom-kora', name: 'Gom Kora', image: 'gom-kora', match: /gom ?kora/i, text: 'A temple on the banks of the Drangme Chhu, associated with Guru Rinpoche.' },
        { id: 'chorten-kora', name: 'Chorten Kora (Trashi Yangtse)', image: 'chorten-kora', match: /chorten kora|choeten kora/i, text: 'A large white stupa in neighbouring Trashi Yangtse, built in the 18th century and modelled on Boudhanath in Kathmandu.' },
      ],
      experiences: [
        ['Trashigang Tshechu', 'The winter festival fills the dzong courtyard with masked dances. Dates follow the lunar calendar.'],
        ['The far east', 'Long drives through gorges and terraced hills reveal a side of Bhutan few visitors see.'],
      ],
      seasonNote: 'The Trashigang Tshechu takes place in winter. Ask us for this year’s dates, as they shift with the Bhutanese calendar.',
    },
  ];

  const alt = {
    hero: 'Taktsang Monastery on a cliff face above the Paro valley',
    'paro-valley': 'The Paro valley from above, with the river, town and forested ridges',
    paro: 'Rinpung Dzong above the river in Paro',
    'heritage-taktsang': 'Taktsang Monastery on its cliff above a forested gorge',
    'gal-taktsang': 'Taktsang Monastery on the cliff face',
    thimphu: 'Tashichho Dzong in Thimphu beside its lawns',
    'heritage-tashichho': 'Tashichho Dzong with the Thimphu valley behind it',
    punakha: 'Punakha Dzong where two rivers meet',
    phobjikha: 'The open Phobjikha valley with farmhouses and forested hills',
    bumthang: 'Jakar Dzong on a ridge above the Bumthang valley',
    'gal-trongsa': 'Trongsa Dzong stretched along a ridge above the valley',
    'gal-chorten': 'The National Memorial Chorten in Thimphu',
    'exp-festivals': 'Masked dancers performing at a Bhutanese festival',
    'festival-trashigang': 'Dancers in the courtyard of Trashigang Dzong during the tshechu',
    trashigang: 'Trashigang Dzong on a ridge in eastern Bhutan',
    'exp-nature': 'A black-necked crane walking through winter grassland',
    'festival-chumey': 'Masked dancers in a temple courtyard in the Chumey valley, Bumthang',
    'heritage-punakha': 'The whitewashed walls of Punakha Dzong beside the river',
    'heritage-rinpung': 'Rinpung Dzong in Paro',
    'exp-botanical': 'Rhododendron blossoms at Pele La',
    haa: 'Farmhouses beneath forested hills in the Haa valley',
    'trek-jomolhari': 'The snow-covered summit of Mount Jomolhari',
    'exp-trekking': 'A snow-capped Himalayan peak seen from Bumthang',
    'trek-gangkhar': 'Gangkhar Puensum seen from Dochula pass',
    'gal-terraces': 'Rice terraces near Sopsokha',
    'gal-fog': 'The Druk Wangyal chortens at Dochula pass in fog',
    'exp-slow': 'Wooden farm buildings and grazing cattle in the Bumthang valley',
    'nature-forest': 'Tall conifers in the Taktsang heritage forest',
    'nature-phobjikha': 'The broad Phobjikha valley',
    'exp-cycling': 'The Druk Wangyal chortens on the hillside at Dochula',
    'exp-river': 'The Mo Chhu river flowing past Punakha',
    'exp-culture': 'The courtyard of Tashichho Dzong in Thimphu',
    'exp-family': 'Archers at the Changlimithang archery ground in Thimphu',
    'local-market': 'Stalls of produce at the Centenary Farmers Market in Thimphu',
    'gal-flags': 'Prayer flags on a hillside at Sopsokha',
    'gal-festival': 'Dancers in traditional dress performing before a crowd at a festival ground',
    'gal-phobjikha': 'Farmhouses on the edge of the wide Phobjikha valley',
    'gal-autumn': 'Golden rice terraces in Thimphu district',
    'national-museum-paro': 'The round Ta Dzong watchtower, home of the National Museum, above Paro',
    'drukgyel-dzong': 'Drukgyel Dzong on its spur at the head of the Paro valley',
    'chele-la': 'Forested ridges and valleys seen from Chele La pass',
    'buddha-dordenma': 'The Buddha Dordenma statue on a forested ridge above Thimphu',
    'chimi-lhakhang': 'Chimi Lhakhang temple among trees in the Punakha valley',
    'khamsum-yulley': 'The tiered Khamsum Yulley Namgyal Chorten above the Punakha valley',
    'gangtey-goenpa': 'The main temple of Gangtey Goenpa in Phobjikha',
    'jambay-lhakhang': 'Jambay Lhakhang temple and chortens in the Bumthang valley',
    'kurjey-lhakhang': 'The temples of Kurjey Lhakhang with prayer flag poles in Bumthang',
    'lhakhang-karpo': 'The whitewashed Lhakhang Karpo, the White Temple, in the Haa valley',
    'lhakhang-nagpo': 'Lhakhang Nagpo, the Black Temple, in the Haa valley',
    'trongsa-dzong': 'Trongsa Dzong spread along a ridge above a forested gorge',
    'trongsa-ta-dzong': 'The Ta Dzong watchtower above Trongsa',
    'gom-kora': 'Gom Kora temple beside the river in eastern Bhutan',
    'chorten-kora': 'The large white stupa of Chorten Kora in Trashi Yangtse',
    'trashigang-dzong': 'Trashigang Dzong and its golden roofs above the valley',
    'kyichu-lhakhang': 'Kyichu Lhakhang temple with a white chorten and a flowering tree in Paro',
    'punakha-bridge': 'A long suspension bridge hung with prayer flags over the Pho Chhu in Punakha',
    'simtokha-dzong': 'Simtokha Dzong on a forested hillside south of Thimphu',
    'tamshing-lhakhang': 'The courtyard of Tamshing Lhakhang in Bumthang',
  };

  const credits = {"hero": {"title": "Taktsang Monastery, Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Taktsang_Monastery,_Bhutan_01.jpg"}, "paro-valley": {"title": "The view of PARO Valley, Bhutan from above (34225469743).jpg", "artist": "Abhijit Kar Gupta from Kolkata, India", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:The_view_of_PARO_Valley,_Bhutan_from_above_(34225469743).jpg"}, "paro": {"title": "Rinpung Dzong, Bhutan 03.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_03.jpg"}, "thimphu": {"title": "Tashichho Dzong, Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_01.jpg"}, "punakha": {"title": "Punakha Dzong, Bhutan 03.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Punakha_Dzong,_Bhutan_03.jpg"}, "phobjikha": {"title": "Phobjika Valley in western Bhutan (2) - 43537440604.jpg", "artist": "Prof. Mortel", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Phobjika_Valley_in_western_Bhutan_(2)_-_43537440604.jpg"}, "bumthang": {"title": "Jakar Dzong, Bumthang.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Jakar_Dzong,_Bumthang.jpg"}, "haa": {"title": "Haa valley, Ha - during LGFC - Bhutan 2019 (31).jpg", "artist": "Vinayaraj", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Haa_valley,_Ha_-_during_LGFC_-_Bhutan_2019_(31).jpg"}, "trashigang": {"title": "Trashigang Dzong-rear-2008-01-02.jpg", "artist": "Christopher J. Fynn", "license": "CC BY 3.0", "licenseUrl": "https://creativecommons.org/licenses/by/3.0", "page": "https://commons.wikimedia.org/wiki/File:Trashigang_Dzong-rear-2008-01-02.jpg"}, "exp-culture": {"title": "Tashichho Dzong, Bhutan 13.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_13.jpg"}, "exp-spiritual": {"title": "Kyichu Lhakhang-060701.JPG", "artist": "Christopher J. Fynn", "license": "CC BY 2.5", "licenseUrl": "https://creativecommons.org/licenses/by/2.5", "page": "https://commons.wikimedia.org/wiki/File:Kyichu_Lhakhang-060701.JPG"}, "exp-festivals": {"title": "Bhutan festivals 15.jpg", "artist": "Kheng Singye Dorji (KSD)", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "page": "https://commons.wikimedia.org/wiki/File:Bhutan_festivals_15.jpg"}, "exp-trekking": {"title": "Himalayan peak from Bumthang.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Himalayan_peak_from_Bumthang.jpg"}, "exp-nature": {"title": "20200223142133 IMG 5597-70.jpg", "artist": "Phuentsho", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:20200223142133_IMG_5597-70.jpg"}, "exp-botanical": {"title": "Rhododendron kesangiae at Pelela.jpg", "artist": "Phuentsho", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Rhododendron_kesangiae_at_Pelela.jpg"}, "exp-cycling": {"title": "Druk Wangyal Chortens, Bhutan 04.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Druk_Wangyal_Chortens,_Bhutan_04.jpg"}, "exp-river": {"title": "Mo Chhu River seen from Punakha Dzong, July 2016 06.jpg", "artist": "Afifa Afrin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Mo_Chhu_River_seen_from_Punakha_Dzong,_July_2016_06.jpg"}, "exp-family": {"title": "Changlimithang Archery Ground, Thimphu 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Changlimithang_Archery_Ground,_Thimphu_01.jpg"}, "exp-slow": {"title": "Bumthang-Jakar-10-Valley Resort-Nachbarschaft-2015-gje.jpg", "artist": "Gerd Eichmann", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Bumthang-Jakar-10-Valley_Resort-Nachbarschaft-2015-gje.jpg"}, "heritage-taktsang": {"title": "Bhutan-Paro-136-Taktshang-Tigernest-gje.jpg", "artist": "Gerd Eichmann", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Bhutan-Paro-136-Taktshang-Tigernest-gje.jpg"}, "heritage-punakha": {"title": "Punakha Dzong, Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Punakha_Dzong,_Bhutan_01.jpg"}, "heritage-tashichho": {"title": "Tashichho Dzong, Bhutan 05.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Tashichho_Dzong,_Bhutan_05.jpg"}, "heritage-rinpung": {"title": "Rinpung Dzong, Bhutan 08.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Rinpung_Dzong,_Bhutan_08.jpg"}, "festival-chumey": {"title": "Bumthang Chumey Valley Festival 32 (23192193533).jpg", "artist": "Chuck Moravec", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Bumthang_Chumey_Valley_Festival_32_(23192193533).jpg"}, "festival-trashigang": {"title": "Trashigang Tshechu.jpg", "artist": "Arian Zwegers", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Trashigang_Tshechu.jpg"}, "nature-forest": {"title": "Taktsang Heritage Forest, Bhutan.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Taktsang_Heritage_Forest,_Bhutan.jpg"}, "nature-phobjikha": {"title": "Phobjikha valley.jpg", "artist": "Kheng Singye Dorji (KSD)", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Phobjikha_valley.jpg"}, "trek-jomolhari": {"title": "Mount Jomolhari 2016.jpg", "artist": "Martyn Smith", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Mount_Jomolhari_2016.jpg"}, "trek-gangkhar": {"title": "082 - Gangkar Puensum - 7,570m (Dochula pass) (4677022812).jpg", "artist": "dhaag23", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:082_-_Gangkar_Puensum_-_7,570m_(Dochula_pass)_(4677022812).jpg"}, "local-farmhouse": {"title": "Bhutanese Farmhouse Soe Yaksa.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Bhutanese_Farmhouse_Soe_Yaksa.jpg"}, "local-market": {"title": "Centenary Farmers Market, Thimphu 02.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Centenary_Farmers_Market,_Thimphu_02.jpg"}, "local-weaving": {"title": "Thimphu Kira Weaving (23676158861).jpg", "artist": "Chuck Moravec", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Thimphu_Kira_Weaving_(23676158861).jpg"}, "local-food": {"title": "Buff Ema datshi.jpg", "artist": "Satdeep Gill", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Buff_Ema_datshi.jpg"}, "gal-flags": {"title": "Prayer flags, Sopsokha, Bhutan.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Prayer_flags,_Sopsokha,_Bhutan.jpg"}, "gal-phobjikha": {"title": "Phobjikha valley1.jpg", "artist": "Kheng Singye Dorji (KSD)", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Phobjikha_valley1.jpg"}, "gal-terraces": {"title": "Rice terraces, Sopsokha, Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Rice_terraces,_Sopsokha,_Bhutan_01.jpg"}, "gal-chorten": {"title": "National Memorial Chorten, Thimphu 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:National_Memorial_Chorten,_Thimphu_01.jpg"}, "gal-trongsa": {"title": "Trongsa Dzong 2021-10-24a.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Trongsa_Dzong_2021-10-24a.jpg"}, "gal-festival": {"title": "Bhutan festivals 18.jpg", "artist": "Kheng Singye Dorji (KSD)", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "page": "https://commons.wikimedia.org/wiki/File:Bhutan_festivals_18.jpg"}, "gal-taktsang": {"title": "Taktsang Monastery, Bhutan 03.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Taktsang_Monastery,_Bhutan_03.jpg"}, "gal-autumn": {"title": "Thimphu District-06-Reisterrassen-2015-gje.jpg", "artist": "Gerd Eichmann", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Thimphu_District-06-Reisterrassen-2015-gje.jpg"}, "gal-fog": {"title": "Druk Wangyal Chortens, Bhutan 02.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Druk_Wangyal_Chortens,_Bhutan_02.jpg"}, "national-museum-paro": {"title": "File:National Museum of Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:National_Museum_of_Bhutan_01.jpg"}, "drukgyel-dzong": {"title": "File:Drukgyel Dzong 04-2021.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Drukgyel_Dzong_04-2021.jpg"}, "chele-la": {"title": "File:Chele La Pass - Paro - during LGFC - Bhutan 2019 (05).jpg", "artist": "Vinayaraj", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Chele_La_Pass_-_Paro_-_during_LGFC_-_Bhutan_2019_(05).jpg"}, "buddha-dordenma": {"title": "File:Thimphu-Buddha Dordenma-02-2015-gje.jpg", "artist": "Gerd Eichmann", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Thimphu-Buddha_Dordenma-02-2015-gje.jpg"}, "chimi-lhakhang": {"title": "File:Chimi Lhakhang, Bhutan 02.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Chimi_Lhakhang,_Bhutan_02.jpg"}, "khamsum-yulley": {"title": "File:Khamsum Yulley Namgyal Chorten Punakha Valley - Bhutan - panoramio.jpg", "artist": "David Broad", "license": "CC BY 3.0", "licenseUrl": "https://creativecommons.org/licenses/by/3.0", "page": "https://commons.wikimedia.org/wiki/File:Khamsum_Yulley_Namgyal_Chorten_Punakha_Valley_-_Bhutan_-_panoramio.jpg"}, "gangtey-goenpa": {"title": "File:Gangtey Gompa Bhutan.jpg", "artist": "Prof Ranga Sai", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Gangtey_Gompa_Bhutan.jpg"}, "jambay-lhakhang": {"title": "File:Around Jakar, Jambay Lhakhang (15845859155).jpg", "artist": "Arian Zwegers from Brussels, Belgium", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Around_Jakar,_Jambay_Lhakhang_(15845859155).jpg"}, "kurjey-lhakhang": {"title": "File:Kurjey Lhakhang 2021-10-22 b.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Kurjey_Lhakhang_2021-10-22_b.jpg"}, "lhakhang-karpo": {"title": "File:Lhakhag Karpo Haa Bhutan.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Lhakhag_Karpo_Haa_Bhutan.jpg"}, "lhakhang-nagpo": {"title": "File:Lhakhang Nagpo Ha Bhutan.JPG", "artist": "Christopher J. Fynn", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Lhakhang_Nagpo_Ha_Bhutan.JPG"}, "trongsa-dzong": {"title": "File:Trongsa Dzong 2021-10-24a.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Trongsa_Dzong_2021-10-24a.jpg"}, "trongsa-ta-dzong": {"title": "File:Watch Tower- Trongsa Dzong.jpg", "artist": "Prof Ranga Sai", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Watch_Tower-_Trongsa_Dzong.jpg"}, "gom-kora": {"title": "File:Trashigang - Gom Kora Tempel.JPG", "artist": "Franzfoto", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Trashigang_-_Gom_Kora_Tempel.JPG"}, "chorten-kora": {"title": "File:Tashi Yangtse, Chorten Kora (15846038265).jpg", "artist": "Arian Zwegers from Brussels, Belgium", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "page": "https://commons.wikimedia.org/wiki/File:Tashi_Yangtse,_Chorten_Kora_(15846038265).jpg"}, "trashigang-dzong": {"title": "File:Tashigang Dzong 111120.jpg", "artist": "Christopher J. Fynn", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "page": "https://commons.wikimedia.org/wiki/File:Tashigang_Dzong_111120.jpg"}, "kyichu-lhakhang": {"title": "File:Kyichu Lhakhang temple in he Paro Valley, Bhutan - panoramio.jpg", "artist": "David Broad", "license": "CC BY 3.0", "licenseUrl": "https://creativecommons.org/licenses/by/3.0", "page": "https://commons.wikimedia.org/wiki/File:Kyichu_Lhakhang_temple_in_he_Paro_Valley,_Bhutan_-_panoramio.jpg"}, "punakha-bridge": {"title": "File:Punakha 3-74, suspension bridge.jpg", "artist": "Doug Knuth", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "page": "https://commons.wikimedia.org/wiki/File:Punakha_3-74,_suspension_bridge.jpg"}, "simtokha-dzong": {"title": "File:Simtokha Dzong, Bhutan 01.jpg", "artist": "Bernard Gagnon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Simtokha_Dzong,_Bhutan_01.jpg"}, "tamshing-lhakhang": {"title": "File:Tamshing Lhakhang 2021-10-22.jpg", "artist": "Christoher J. Fynn", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "page": "https://commons.wikimedia.org/wiki/File:Tamshing_Lhakhang_2021-10-22.jpg"}};

  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const img = (key, sizes, { eager = false, alt: text = alt[key] || '', className = '' } = {}) => {
    const big = widest(key);
    const position = focus[key] ? ` style="object-position:${focus[key]}"` : '';
    const cls = className ? ` class="${className}"` : '';
    return `<img${cls} src="${src(key, 1000)}" srcset="${src(key, 600)} 600w, ${src(key, 1000)} 1000w, ${src(key, 1600)} ${big}w" sizes="${sizes}" alt="${escape(text)}" width="1000" height="667"${position} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-fallback="${src('hero', 1000)}">`;
  };
  /* Missing photos fall back to the hero image (a listener, not an inline handler, so the CSP can forbid inline script). */
  document.addEventListener('error', event => {
    const el = event.target;
    if (el.tagName !== 'IMG' || !el.dataset.fallback || el.dataset.failed) return;
    el.dataset.failed = 'true';
    el.removeAttribute('srcset');
    el.src = el.dataset.fallback;
  }, true);
  const tourImage = tour => tourImages[tour.slug] || fallbackImages[tour.imageKey] || 'exp-culture';
  const destination = id => destinations.find(item => item.id === id);
  const destinationsOf = tour => (tourDestinations[tour.slug] || []).map(destination).filter(Boolean);
  const toursIn = (id, tours) => tours.filter(tour => (tourDestinations[tour.slug] || []).includes(id));
  const itineraryText = tour => (tour.itinerary || []).map(day => `${day.title} ${(day.details || []).join(' ')}`).join(' ');
  const toursNaming = (place, destinationId, tours) => place.match ? toursIn(destinationId, tours).filter(tour => place.match.test(itineraryText(tour))) : [];
  const creditsList = keys => [...new Set(keys)].filter(key => credits[key]).map(key => ({ key, ...credits[key] }));

  /* Search titles stay within 60 characters and descriptions within 150–160. */
  const BRAND = 'Himalaya Mindfulness Retreat';
  const seoTitle = title => [`${title} | ${BRAND}`, `${title} | Himalaya Retreat`, title].find(t => t.length <= 60) || `${title.slice(0, 59).replace(/\s+\S*$/, '')}…`;
  const SEO_ENDINGS = ['Plan a tailored Bhutan journey with Himalaya Mindfulness Retreat in Thimphu.', 'Plan it with Himalaya Mindfulness Retreat in Thimphu.', 'Plan it with our team in Thimphu.', 'Ask us for a quote.'];
  const seoDescription = text => {
    const out = String(text || '').replace(/\s+/g, ' ').trim();
    if (out.length > 160) return `${out.slice(0, 159).replace(/\s+\S*$/, '').replace(/[,;:.]$/, '')}…`;
    if (out.length >= 150) return out;
    return SEO_ENDINGS.map(end => `${out} ${end}`.trim()).find(candidate => candidate.length <= 160) || out;
  };
  const setSeo = ({ title, description, image }) => {
    const meta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
    document.title = seoTitle(title);
    const text = seoDescription(description);
    meta('meta[name="description"]', text);
    meta('meta[property="og:title"]', document.title);
    meta('meta[property="og:description"]', text);
    if (image) meta('meta[property="og:image"]', new URL(image, location.href).href);
  };

  window.HMR_DATA = { src, img, alt, credits, creditsList, focus, tourImages, featuredImages, fallbackImages, tourImage, tourDestinations, destinations, destination, destinationsOf, toursIn, toursNaming, categories, seasons, escape, seoTitle, seoDescription, setSeo };
})();
