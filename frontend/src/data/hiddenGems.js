/**
 * Static data: Hidden gems / offbeat destinations.
 * Shared by HiddenGemsPage and homepage preview.
 *
 * DATA SHAPE (keep consistent when editing):
 * ─────────────────────────────────────────────
 * slug        : string   — URL-safe key
 * name        : string   — Display name
 * location    : string   — Parent state / UT name (human-readable)
 * state       : string   — Parent state slug (matches states.js → slug)
 * description : string   — Short 1-2 sentence blurb
 * image       : string   — Card image URL
 */
const hiddenGems = [
  /* ── North India ────────────────────────────── */
  {
    slug: 'spiti-valley',
    name: 'Spiti Valley',
    location: 'Himachal Pradesh',
    state: 'himachal-pradesh',
    description:
      'A cold desert mountain valley with ancient monasteries, surreal landscapes, and star-filled skies.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600',
  },
  {
    slug: 'chopta',
    name: 'Chopta',
    location: 'Uttarakhand',
    state: 'uttarakhand',
    description:
      'The "Mini Switzerland" of India — alpine meadows and a trekking paradise leading to the Tungnath temple.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
  },
  {
    slug: 'turtuk',
    name: 'Turtuk',
    location: 'Ladakh',
    state: 'ladakh',
    description:
      'India\'s last village on the LoC — a Balti settlement with apricot orchards and an untouched way of life.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600',
  },
  {
    slug: 'munsiyari',
    name: 'Munsiyari',
    location: 'Uttarakhand',
    state: 'uttarakhand',
    description:
      'A remote Himalayan hamlet with views of the Panchachuli peaks, glaciers, and rich Bhotia culture.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
  },

  /* ── North-East India ───────────────────────── */
  {
    slug: 'ziro-valley',
    name: 'Ziro Valley',
    location: 'Arunachal Pradesh',
    state: 'arunachal-pradesh',
    description:
      'A lush, pine-clad valley home to the Apatani tribe and an epic outdoor music festival.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },
  {
    slug: 'majuli-island',
    name: 'Majuli Island',
    location: 'Assam',
    state: 'assam',
    description:
      'The world\'s largest river island, a hub of neo-Vaishnavite culture on the Brahmaputra.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
  },
  {
    slug: 'mawlynnong',
    name: 'Mawlynnong',
    location: 'Meghalaya',
    state: 'meghalaya',
    description:
      'Asia\'s cleanest village, with living root bridges, bamboo sky-walks, and community eco-tourism.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },
  {
    slug: 'dzukou-valley',
    name: 'Dzükou Valley',
    location: 'Nagaland',
    state: 'nagaland',
    description:
      'A high-altitude valley of seasonal wildflowers on the Nagaland–Manipur border, often called the "Valley of Flowers of the North-East".',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },
  {
    slug: 'loktak-lake',
    name: 'Loktak Lake',
    location: 'Manipur',
    state: 'manipur',
    description:
      'A freshwater lake famous for floating islands (phumdis) and the endangered Sangai deer.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },

  /* ── South India ────────────────────────────── */
  {
    slug: 'hampi',
    name: 'Hampi',
    location: 'Karnataka',
    state: 'karnataka',
    description:
      'Ruins of the Vijayanagara Empire scattered among boulder-strewn terrain — a UNESCO World Heritage Site.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb4c23786?q=80&w=600',
  },
  {
    slug: 'gokarna',
    name: 'Gokarna',
    location: 'Karnataka',
    state: 'karnataka',
    description:
      'A quieter beach-temple town south of Goa, with Om Beach, Half Moon Beach, and a sacred Shiva temple.',
    image: 'https://images.unsplash.com/photo-1600100397608-da9e178e77d8?q=80&w=600',
  },
  {
    slug: 'valparai',
    name: 'Valparai',
    location: 'Tamil Nadu',
    state: 'tamil-nadu',
    description:
      'A serene hill station on the Anamalai Hills, surrounded by tea and coffee estates and rich biodiversity.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
  },
  {
    slug: 'wayanad',
    name: 'Wayanad',
    location: 'Kerala',
    state: 'kerala',
    description:
      'Prehistoric Edakkal caves, bamboo forests, and misty peaks — a lesser-known alternative to Munnar.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600',
  },

  /* ── West India ─────────────────────────────── */
  {
    slug: 'dholavira',
    name: 'Dholavira',
    location: 'Gujarat',
    state: 'gujarat',
    description:
      'A 5,000-year-old Indus Valley Civilisation site in the Rann of Kutch — a UNESCO World Heritage Site.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600',
  },
  {
    slug: 'malvan',
    name: 'Malvan',
    location: 'Maharashtra',
    state: 'maharashtra',
    description:
      'A coastal town known for Sindhudurg Fort, water sports, and delicious Malvani seafood cuisine.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600',
  },

  /* ── East India ─────────────────────────────── */
  {
    slug: 'sundarbans',
    name: 'Sundarbans',
    location: 'West Bengal',
    state: 'west-bengal',
    description:
      'The world\'s largest mangrove forest, home to the Royal Bengal Tiger, in the Ganges delta.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600',
  },
  {
    slug: 'unakoti',
    name: 'Unakoti',
    location: 'Tripura',
    state: 'tripura',
    description:
      'Mysterious 7th-century rock carvings of Hindu deities etched into a forested hillside.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },

  /* ── Central India ──────────────────────────── */
  {
    slug: 'orchha',
    name: 'Orchha',
    location: 'Madhya Pradesh',
    state: 'madhya-pradesh',
    description:
      'A forgotten Bundela-dynasty town with riverside cenotaphs, painted palaces, and vulture conservation.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb4c23786?q=80&w=600',
  },

  /* ── Islands ────────────────────────────────── */
  {
    slug: 'neil-island',
    name: 'Neil Island (Shaheed Dweep)',
    location: 'Andaman & Nicobar Islands',
    state: 'andaman-nicobar',
    description:
      'Pristine coral reefs, the natural rock formation "Howrah Bridge", and a laid-back island vibe.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
  },
  {
    slug: 'agatti',
    name: 'Agatti Island',
    location: 'Lakshadweep',
    state: 'lakshadweep',
    description:
      'A tiny coral island with crystal-clear lagoons, the only airstrip in Lakshadweep, and world-class snorkelling.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
  },
];

export default hiddenGems;
