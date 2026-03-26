/**
 * Static data: Featured destinations across India.
 * Each destination has a unique slug used for routing.
 *
 * DATA SHAPE (keep consistent when editing):
 * ─────────────────────────────────────────────
 * id          : number   — Unique numeric identifier
 * slug        : string   — URL-safe key, matches route param :destSlug
 * title       : string   — Display title  (e.g. "Jaipur, Rajasthan")
 * state       : string   — Parent state slug (matches states.js → slug)
 * description : string   — Short 1-2 sentence blurb
 * image       : string   — Card / hero image URL
 * rating      : number   — Star rating (out of 5)
 */
const destinations = [
  /* ── Andhra Pradesh ─────────────────────────── */
  {
    id: 1,
    slug: 'tirupati',
    title: 'Tirupati, Andhra Pradesh',
    state: 'andhra-pradesh',
    description:
      'Home to the Tirumala Venkateswara Temple, the richest and most visited pilgrimage centre in the world.',
    image:
      'https://images.unsplash.com/photo-1621340814329-5db018719e56?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 2,
    slug: 'visakhapatnam',
    title: 'Visakhapatnam, Andhra Pradesh',
    state: 'andhra-pradesh',
    description:
      'The Jewel of the East Coast — pristine beaches, submarine museums, and the lush Araku Valley nearby.',
    image:
      'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=800',
    rating: 4.5,
  },

  /* ── Arunachal Pradesh ──────────────────────── */
  {
    id: 3,
    slug: 'tawang',
    title: 'Tawang, Arunachal Pradesh',
    state: 'arunachal-pradesh',
    description:
      'A mist-clad Himalayan town with the second-largest Buddhist monastery in the world after Lhasa.',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 4,
    slug: 'ziro-valley',
    title: 'Ziro Valley, Arunachal Pradesh',
    state: 'arunachal-pradesh',
    description:
      'A lush, pine-clad valley home to the Apatani tribe and an epic outdoor music festival.',
    image:
      'https://images.unsplash.com/photo-1583309219338-a582f1f9ca6b?q=80&w=800',
    rating: 4.6,
  },

  /* ── Assam ──────────────────────────────────── */
  {
    id: 5,
    slug: 'kaziranga',
    title: 'Kaziranga, Assam',
    state: 'assam',
    description:
      'A UNESCO World Heritage Site protecting two-thirds of the world\'s one-horned rhinoceroses.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc97?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 6,
    slug: 'majuli-island',
    title: 'Majuli Island, Assam',
    state: 'assam',
    description:
      'The world\'s largest river island and a hub of neo-Vaishnavite culture on the Brahmaputra.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
    rating: 4.5,
  },

  /* ── Bihar ──────────────────────────────────── */
  {
    id: 7,
    slug: 'bodh-gaya',
    title: 'Bodh Gaya, Bihar',
    state: 'bihar',
    description:
      'The place where Siddhartha Gautama attained enlightenment — one of Buddhism\'s holiest sites.',
    image:
      'https://images.unsplash.com/photo-1591018653965-c03c7d65b7e3?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 8,
    slug: 'nalanda',
    title: 'Nalanda, Bihar',
    state: 'bihar',
    description:
      'Ruins of the ancient Nalanda University, once the world\'s greatest centre of learning.',
    image:
      'https://images.unsplash.com/photo-1585516482738-1e8eeb10e05d?q=80&w=800',
    rating: 4.5,
  },

  /* ── Chhattisgarh ───────────────────────────── */
  {
    id: 9,
    slug: 'chitrakote',
    title: 'Chitrakote Falls, Chhattisgarh',
    state: 'chhattisgarh',
    description:
      'India\'s widest waterfall, often called the "Niagara of India", on the Indravati River.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800',
    rating: 4.4,
  },

  /* ── Goa ────────────────────────────────────── */
  {
    id: 10,
    slug: 'palolem',
    title: 'Palolem Beach, Goa',
    state: 'goa',
    description:
      'A crescent-shaped beach in south Goa with calm waters, colourful beach huts, and vibrant nightlife.',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 11,
    slug: 'old-goa',
    title: 'Old Goa, Goa',
    state: 'goa',
    description:
      'UNESCO-listed Portuguese churches including the Basilica of Bom Jesus and Se Cathedral.',
    image:
      'https://images.unsplash.com/photo-1516815231560-d1bbd895d499?q=80&w=800',
    rating: 4.6,
  },

  /* ── Gujarat ────────────────────────────────── */
  {
    id: 12,
    slug: 'rann-of-kutch',
    title: 'Rann of Kutch, Gujarat',
    state: 'gujarat',
    description:
      'A vast white salt desert that transforms into a cultural wonderland during the Rann Utsav festival.',
    image:
      'https://images.unsplash.com/photo-1604692396783-0d96ba0e8e6c?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 13,
    slug: 'gir',
    title: 'Gir National Park, Gujarat',
    state: 'gujarat',
    description:
      'The last refuge of the Asiatic lion — a premier wildlife sanctuary in the Saurashtra region.',
    image:
      'https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 14,
    slug: 'dholavira',
    title: 'Dholavira, Gujarat',
    state: 'gujarat',
    description:
      'A 5,000-year-old Indus Valley Civilisation site in the Rann of Kutch, a UNESCO World Heritage Site.',
    image:
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=800',
    rating: 4.4,
  },

  /* ── Haryana ────────────────────────────────── */
  {
    id: 15,
    slug: 'kurukshetra',
    title: 'Kurukshetra, Haryana',
    state: 'haryana',
    description:
      'The legendary battlefield of the Mahabharata, now a spiritual tourism hub with sacred tanks and temples.',
    image:
      'https://images.unsplash.com/photo-1590766940554-634e2d4b02f4?q=80&w=800',
    rating: 4.3,
  },

  /* ── Himachal Pradesh ───────────────────────── */
  {
    id: 16,
    slug: 'shimla',
    title: 'Shimla, Himachal Pradesh',
    state: 'himachal-pradesh',
    description:
      'The former summer capital of British India, with colonial architecture, Mall Road, and pine-clad hills.',
    image:
      'https://images.unsplash.com/photo-1597074866923-dc0e39e4d8e5?q=80&w=800',
    rating: 4.6,
  },
  {
    id: 17,
    slug: 'manali',
    title: 'Manali, Himachal Pradesh',
    state: 'himachal-pradesh',
    description:
      'A Himalayan resort town on the Beas River, gateway to adventure sports and the Rohtang Pass.',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 18,
    slug: 'spiti-valley',
    title: 'Spiti Valley, Himachal Pradesh',
    state: 'himachal-pradesh',
    description:
      'A cold desert mountain valley with ancient monasteries, surreal landscapes, and star-filled skies.',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800',
    rating: 4.9,
  },

  /* ── Jharkhand ──────────────────────────────── */
  {
    id: 19,
    slug: 'deoghar',
    title: 'Deoghar, Jharkhand',
    state: 'jharkhand',
    description:
      'A sacred town famous for the Baidyanath Dham temple, one of the twelve Jyotirlingas of Lord Shiva.',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    rating: 4.4,
  },

  /* ── Karnataka ──────────────────────────────── */
  {
    id: 20,
    slug: 'hampi',
    title: 'Hampi, Karnataka',
    state: 'karnataka',
    description:
      'Ruins of the Vijayanagara Empire scattered among boulder-strewn terrain — a UNESCO World Heritage Site.',
    image:
      'https://images.unsplash.com/photo-1600784449428-931c84b3081f?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 21,
    slug: 'coorg',
    title: 'Coorg, Karnataka',
    state: 'karnataka',
    description:
      'The "Scotland of India" — misty hills, coffee plantations, waterfalls, and Kodava culture.',
    image:
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 22,
    slug: 'mysuru',
    title: 'Mysuru, Karnataka',
    state: 'karnataka',
    description:
      'The City of Palaces — Mysore Palace, Chamundi Hills, and the vibrant Dasara festival.',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800',
    rating: 4.7,
  },

  /* ── Kerala ─────────────────────────────────── */
  {
    id: 23,
    slug: 'munnar',
    title: 'Munnar, Kerala',
    state: 'kerala',
    description:
      'Verdant tea plantations and misty hills in God\'s Own Country.',
    image:
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 24,
    slug: 'alleppey',
    title: 'Alleppey, Kerala',
    state: 'kerala',
    description:
      'The Venice of the East — emerald backwater canals, houseboats, and coconut-fringed waterways.',
    image:
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 25,
    slug: 'varkala',
    title: 'Varkala, Kerala',
    state: 'kerala',
    description:
      'Dramatic red-laterite cliffs overlooking the Arabian Sea, with beach cafés and the ancient Janardanaswamy Temple.',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800',
    rating: 4.6,
  },

  /* ── Madhya Pradesh ─────────────────────────── */
  {
    id: 26,
    slug: 'khajuraho',
    title: 'Khajuraho, Madhya Pradesh',
    state: 'madhya-pradesh',
    description:
      'Exquisite 10th-century temples with intricate erotic sculptures — a UNESCO World Heritage Site.',
    image:
      'https://images.unsplash.com/photo-1590766322738-e5e7b5d3f1f6?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 27,
    slug: 'bandhavgarh',
    title: 'Bandhavgarh, Madhya Pradesh',
    state: 'madhya-pradesh',
    description:
      'One of India\'s best tiger reserves with the highest density of Bengal tigers in the country.',
    image:
      'https://images.unsplash.com/photo-1590050752117-238cb4c23786?q=80&w=800',
    rating: 4.6,
  },

  /* ── Maharashtra ────────────────────────────── */
  {
    id: 28,
    slug: 'mumbai',
    title: 'Mumbai, Maharashtra',
    state: 'maharashtra',
    description:
      'The City of Dreams — Gateway of India, marine drives, Bollywood, street food, and endless energy.',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958e?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 29,
    slug: 'ajanta-ellora',
    title: 'Ajanta & Ellora Caves, Maharashtra',
    state: 'maharashtra',
    description:
      'Rock-cut Buddhist, Hindu, and Jain cave temples dating back to the 2nd century BCE.',
    image:
      'https://images.unsplash.com/photo-1609766418204-94d68e007e65?q=80&w=800',
    rating: 4.8,
  },

  /* ── Manipur ────────────────────────────────── */
  {
    id: 30,
    slug: 'loktak-lake',
    title: 'Loktak Lake, Manipur',
    state: 'manipur',
    description:
      'The largest freshwater lake in north-east India, famous for its floating islands (phumdis).',
    image:
      'https://images.unsplash.com/photo-1470165301023-58dab8118cc9?q=80&w=800',
    rating: 4.5,
  },

  /* ── Meghalaya ──────────────────────────────── */
  {
    id: 31,
    slug: 'cherrapunji',
    title: 'Cherrapunji, Meghalaya',
    state: 'meghalaya',
    description:
      'One of the wettest places on Earth, with living root bridges, dramatic waterfalls, and misty valleys.',
    image:
      'https://images.unsplash.com/photo-1598091383021-15ddea10925e?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 32,
    slug: 'dawki',
    title: 'Dawki, Meghalaya',
    state: 'meghalaya',
    description:
      'Crystal-clear Umngot River where boats appear to float in mid-air — the clearest river in India.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
    rating: 4.6,
  },

  /* ── Nagaland ───────────────────────────────── */
  {
    id: 33,
    slug: 'kohima',
    title: 'Kohima, Nagaland',
    state: 'nagaland',
    description:
      'The capital of Nagaland and gateway to the Hornbill Festival, with WWII war cemeteries and tribal heritage.',
    image:
      'https://images.unsplash.com/photo-1625484892362-f5c0e4d3c0f5?q=80&w=800',
    rating: 4.4,
  },

  /* ── Odisha ─────────────────────────────────── */
  {
    id: 34,
    slug: 'puri',
    title: 'Puri, Odisha',
    state: 'odisha',
    description:
      'A sacred seaside city home to the Jagannath Temple and the spectacular annual Rath Yatra procession.',
    image:
      'https://images.unsplash.com/photo-1590766322857-0e0e1e6e4e1f?q=80&w=800',
    rating: 4.6,
  },
  {
    id: 35,
    slug: 'konark',
    title: 'Konark Sun Temple, Odisha',
    state: 'odisha',
    description:
      'A 13th-century temple shaped like a giant chariot, dedicated to the Sun God — a UNESCO marvel.',
    image:
      'https://images.unsplash.com/photo-1627894005979-8a829c968aea?q=80&w=800',
    rating: 4.7,
  },

  /* ── Punjab ─────────────────────────────────── */
  {
    id: 36,
    slug: 'amritsar',
    title: 'Amritsar, Punjab',
    state: 'punjab',
    description:
      'The Golden Temple (Harmandir Sahib), the Wagah Border ceremony, and unforgettable Punjabi cuisine.',
    image:
      'https://images.unsplash.com/photo-1609947017136-9dbb5585612e?q=80&w=800',
    rating: 4.9,
  },

  /* ── Rajasthan ──────────────────────────────── */
  {
    id: 37,
    slug: 'jaipur',
    title: 'Jaipur, Rajasthan',
    state: 'rajasthan',
    description:
      'The Pink City — majestic palaces, Amber Fort, Hawa Mahal, and rich Rajput heritage.',
    image:
      'https://images.unsplash.com/photo-1603766806347-54735001be7d?q=80&w=800',
    rating: 4.9,
  },
  {
    id: 38,
    slug: 'udaipur',
    title: 'Udaipur, Rajasthan',
    state: 'rajasthan',
    description:
      'The City of Lakes — romantic palaces, shimmering lakes, and sunset boat rides.',
    image:
      'https://images.unsplash.com/photo-1595658658481-d53d3f999876?q=80&w=800',
    rating: 4.9,
  },
  {
    id: 39,
    slug: 'jaisalmer',
    title: 'Jaisalmer, Rajasthan',
    state: 'rajasthan',
    description:
      'The Golden City — a living sandstone fort, camel safaris across the Thar Desert, and starlit dunes.',
    image:
      'https://images.unsplash.com/photo-1590766740023-7d2075f42cd8?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 40,
    slug: 'jodhpur',
    title: 'Jodhpur, Rajasthan',
    state: 'rajasthan',
    description:
      'The Blue City — Mehrangarh Fort towering above a sea of blue-painted houses.',
    image:
      'https://images.unsplash.com/photo-1558383817-1d82e3f4e48c?q=80&w=800',
    rating: 4.7,
  },

  /* ── Sikkim ─────────────────────────────────── */
  {
    id: 41,
    slug: 'gangtok',
    title: 'Gangtok, Sikkim',
    state: 'sikkim',
    description:
      'A charming hill-station capital with panoramic views of Kanchenjunga, monasteries, and cable cars.',
    image:
      'https://images.unsplash.com/photo-1622308644420-c39b0b3f3e1c?q=80&w=800',
    rating: 4.6,
  },
  {
    id: 42,
    slug: 'pelling',
    title: 'Pelling, Sikkim',
    state: 'sikkim',
    description:
      'Stunning Kanchenjunga views, the glass Skywalk, ancient Pemayangtse Monastery, and the Kanchenjunga Falls.',
    image:
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=800',
    rating: 4.5,
  },

  /* ── Tamil Nadu ─────────────────────────────── */
  {
    id: 43,
    slug: 'mahabalipuram',
    title: 'Mahabalipuram, Tamil Nadu',
    state: 'tamil-nadu',
    description:
      'UNESCO shore temples, stone-carved rathas, and Arjuna\'s Penance — Pallava dynasty heritage by the sea.',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800',
    rating: 4.6,
  },
  {
    id: 44,
    slug: 'ooty',
    title: 'Ooty, Tamil Nadu',
    state: 'tamil-nadu',
    description:
      'Queen of Hill Stations — Nilgiri toy train, botanical gardens, and cool tea-estate walks.',
    image:
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=800',
    rating: 4.5,
  },
  {
    id: 45,
    slug: 'madurai',
    title: 'Madurai, Tamil Nadu',
    state: 'tamil-nadu',
    description:
      'The Temple City — the magnificent Meenakshi Amman Temple and centuries of Dravidian heritage.',
    image:
      'https://images.unsplash.com/photo-1621340814329-5db018719e57?q=80&w=800',
    rating: 4.7,
  },

  /* ── Telangana ──────────────────────────────── */
  {
    id: 46,
    slug: 'hyderabad',
    title: 'Hyderabad, Telangana',
    state: 'telangana',
    description:
      'The City of Pearls — Charminar, Golconda Fort, world-class biryani, and a booming tech scene.',
    image:
      'https://images.unsplash.com/photo-1603813507806-0d857b3e15f3?q=80&w=800',
    rating: 4.7,
  },

  /* ── Tripura ────────────────────────────────── */
  {
    id: 47,
    slug: 'unakoti',
    title: 'Unakoti, Tripura',
    state: 'tripura',
    description:
      'Mysterious rock carvings and sculptures of Hindu deities etched into a hillside, dating back to the 7th century.',
    image:
      'https://images.unsplash.com/photo-1609766934480-11c0e67c1c7a?q=80&w=800',
    rating: 4.3,
  },

  /* ── Uttar Pradesh ──────────────────────────── */
  {
    id: 48,
    slug: 'agra',
    title: 'Agra, Uttar Pradesh',
    state: 'uttar-pradesh',
    description:
      'Home to the Taj Mahal, Agra Fort, and Fatehpur Sikri — the crown jewel of Mughal architecture.',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800',
    rating: 4.9,
  },
  {
    id: 49,
    slug: 'varanasi',
    title: 'Varanasi, Uttar Pradesh',
    state: 'uttar-pradesh',
    description:
      'The spiritual heart of India — ancient ghats, evening Ganga Aarti, and timeless traditions on the banks of the Ganges.',
    image:
      'https://images.unsplash.com/photo-1561361058-c24cecae35cb?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 50,
    slug: 'lucknow',
    title: 'Lucknow, Uttar Pradesh',
    state: 'uttar-pradesh',
    description:
      'The City of Nawabs — Bara Imambara, Rumi Darwaza, legendary kebabs, and refined Awadhi culture.',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed6?q=80&w=800',
    rating: 4.6,
  },

  /* ── Uttarakhand ────────────────────────────── */
  {
    id: 51,
    slug: 'rishikesh',
    title: 'Rishikesh, Uttarakhand',
    state: 'uttarakhand',
    description:
      'The Yoga Capital of the World — Ganga rapids, ashrams, the Beatles Ashram, and bungee jumping.',
    image:
      'https://images.unsplash.com/photo-1585116938581-4b793951ef5c?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 52,
    slug: 'nainital',
    title: 'Nainital, Uttarakhand',
    state: 'uttarakhand',
    description:
      'A charming lakeside hill station surrounded by seven hills, colonial-era charm, and vibrant Mall Road.',
    image:
      'https://images.unsplash.com/photo-1585116938581-4b793951ef5b?q=80&w=800',
    rating: 4.6,
  },
  {
    id: 53,
    slug: 'chopta',
    title: 'Chopta, Uttarakhand',
    state: 'uttarakhand',
    description:
      'The "Mini Switzerland" of India — alpine meadows, Tungnath temple trek, and panoramic Himalayan views.',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3c?q=80&w=800',
    rating: 4.7,
  },

  /* ── West Bengal ────────────────────────────── */
  {
    id: 54,
    slug: 'darjeeling',
    title: 'Darjeeling, West Bengal',
    state: 'west-bengal',
    description:
      'Tea gardens with Kanchenjunga views, the Darjeeling Himalayan Railway (toy train), and colonial charm.',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    rating: 4.7,
  },
  {
    id: 55,
    slug: 'sundarbans',
    title: 'Sundarbans, West Bengal',
    state: 'west-bengal',
    description:
      'The world\'s largest mangrove forest, home to the Royal Bengal Tiger, in the Ganges delta.',
    image:
      'https://images.unsplash.com/photo-1504006833117-8886a355efbf?q=80&w=800',
    rating: 4.6,
  },

  /* ═══════════ UNION TERRITORY DESTINATIONS ═══════════ */

  /* ── Andaman & Nicobar ──────────────────────── */
  {
    id: 56,
    slug: 'havelock-island',
    title: 'Havelock Island, Andaman & Nicobar',
    state: 'andaman-nicobar',
    description:
      'Radhanagar Beach (Asia\'s best beach), turquoise waters, scuba diving, and lush tropical forests.',
    image:
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=800',
    rating: 4.9,
  },

  /* ── Delhi ──────────────────────────────────── */
  {
    id: 57,
    slug: 'delhi',
    title: 'Delhi',
    state: 'delhi',
    description:
      'India\'s capital — Red Fort, Qutub Minar, Humayun\'s Tomb, Chandni Chowk street food, and seven historic cities.',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800',
    rating: 4.7,
  },

  /* ── Jammu & Kashmir ────────────────────────── */
  {
    id: 58,
    slug: 'srinagar',
    title: 'Srinagar, Jammu & Kashmir',
    state: 'jammu-kashmir',
    description:
      'Dal Lake houseboats, Mughal gardens, floating flower markets, and snow-draped Zabarwan Hills.',
    image:
      'https://images.unsplash.com/photo-1597432066946-fa8102cf2022?q=80&w=800',
    rating: 4.8,
  },
  {
    id: 59,
    slug: 'gulmarg',
    title: 'Gulmarg, Jammu & Kashmir',
    state: 'jammu-kashmir',
    description:
      'A premier ski resort and the world\'s second-highest operating gondola, surrounded by snow-capped peaks.',
    image:
      'https://images.unsplash.com/photo-1604753380927-58f63ace67c1?q=80&w=800',
    rating: 4.8,
  },

  /* ── Ladakh ─────────────────────────────────── */
  {
    id: 60,
    slug: 'leh',
    title: 'Leh, Ladakh',
    state: 'ladakh',
    description:
      'A high-altitude town with ancient Buddhist monasteries, prayer flags, and the gateway to the world\'s highest passes.',
    image:
      'https://images.unsplash.com/photo-1600781637288-6a8f3e7b3b1c?q=80&w=800',
    rating: 4.9,
  },
  {
    id: 61,
    slug: 'pangong-lake',
    title: 'Pangong Lake, Ladakh',
    state: 'ladakh',
    description:
      'An endorheic lake at 14,000 ft altitude whose waters shift between shades of blue, green, and violet.',
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c4?q=80&w=800',
    rating: 4.9,
  },

  /* ── Puducherry ─────────────────────────────── */
  {
    id: 62,
    slug: 'puducherry',
    title: 'Puducherry',
    state: 'puducherry',
    description:
      'Pastel-coloured French Quarter, Auroville, serene promenades, and some of the best cafés in South India.',
    image:
      'https://images.unsplash.com/photo-1609766418204-94d68e007e66?q=80&w=800',
    rating: 4.6,
  },
];

export default destinations;
