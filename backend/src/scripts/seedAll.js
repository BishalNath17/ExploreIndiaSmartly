/**
 * Master Seed Script — Explore India Smartly
 * 
 * Reads all existing JSON/JS data files and seeds them into MongoDB.
 * Safe to re-run (uses upsert).
 * 
 * Usage: node src/scripts/seedAll.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');

// Models
const State = require('../models/State');
const HiddenGem = require('../models/HiddenGem');
const SafetyTip = require('../models/SafetyTip');
const HeroImage = require('../models/HeroImage');

// ── Helper: read JSON file safely ──
const readJson = (filePath) => {
  try {
    const abs = path.resolve(__dirname, filePath);
    if (!fs.existsSync(abs)) {
      console.warn(`  ⚠ [SKIP] File not found: ${abs}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch(e) {
    console.error(`  ❌ Error reading JSON at ${filePath}:`, e.message);
    return null;
  }
};

// ── Helper: read JS module safely ──
const readJsExport = (filePath) => {
  try {
    const abs = path.resolve(__dirname, filePath);
    if (!fs.existsSync(abs)) {
      console.warn(`  ⚠ [SKIP] JS File not found: ${abs}`);
      return null;
    }
    return fs.readFileSync(abs, 'utf8');
  } catch(e) {
    console.error(`  ❌ Error reading JS at ${filePath}:`, e.message);
    return null;
  }
};

// ══════════════════════════════════════════════════
//  SEED STATES
// ══════════════════════════════════════════════════
async function seedStates() {
  console.log('\n📍 Seeding States...');

  const statesJson = readJson('../../data/states.json');
  if (!statesJson || !Array.isArray(statesJson)) {
     console.warn('  ⚠ [SKIP] states.json is missing or invalid. Seeding skipped.');
     return;
  }

  const mapEmbeds = readJson('../../../frontend/src/data/json/stateMapEmbeds.json') || {};

  const kbDir = path.resolve(__dirname, '../../../frontend/src/data/knowledgeBase');
  const kbFiles = {};
  if (fs.existsSync(kbDir)) {
    const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(kbDir, file), 'utf8'));
        if (data && data.id) kbFiles[data.id] = data;
      } catch(e) {
        console.warn(`  ⚠ Failed to parse kb file ${file}`);
      }
    }
    console.log(`  Found ${Object.keys(kbFiles).length} knowledge base files`);
  }

  // Source 4: indiaTourismKnowledgeBase.js (overview paragraphs for 28 states)
  // We'll parse this manually since it's an ES module
  const tourismKbPath = path.resolve(__dirname, '../../../frontend/src/data/indiaTourismKnowledgeBase.js');
  const tourismKb = {};
  if (fs.existsSync(tourismKbPath)) {
    const content = fs.readFileSync(tourismKbPath, 'utf8');
    // Extract the states array using regex — it's a structured JS object
    const statesMatch = content.match(/states:\s*\[([\s\S]*)\]\s*\};/);
    if (statesMatch) {
      // Each state object starts with { id: "..."
      const stateBlocks = statesMatch[1].split(/\n\s*\{/).filter(b => b.includes('id:'));
      for (const block of stateBlocks) {
        const idMatch = block.match(/id:\s*"([^"]+)"/);
        const capitalMatch = block.match(/capital:\s*"([^"]+)"/);
        const regionMatch = block.match(/region:\s*"([^"]+)"/);
        const shortMatch = block.match(/short:\s*"((?:[^"\\]|\\.)*)"/);
        const p2Match = block.match(/paragraph2:\s*"((?:[^"\\]|\\.)*)"/);
        const p3Match = block.match(/paragraph3:\s*"((?:[^"\\]|\\.)*)"/);
        const cultureMatch = block.match(/cultureHeritage:\s*"((?:[^"\\]|\\.)*)"/);

        if (idMatch) {
          tourismKb[idMatch[1]] = {
            capital: capitalMatch ? capitalMatch[1] : '',
            region: regionMatch ? regionMatch[1] : '',
            overview: {
              short: shortMatch ? shortMatch[1].replace(/\\'/g, "'") : '',
              paragraph2: p2Match ? p2Match[1].replace(/\\'/g, "'") : '',
              paragraph3: p3Match ? p3Match[1].replace(/\\'/g, "'") : '',
              cultureHeritage: cultureMatch ? cultureMatch[1].replace(/\\'/g, "'") : ''
            }
          };
        }
      }
    }
    console.log(`  Parsed ${Object.keys(tourismKb).length} tourism KB entries`);
  }

  let inserted = 0, updated = 0;

  for (const state of statesJson) {
    const kb = kbFiles[state.id] || {};
    const tkb = tourismKb[state.id] || {};

    const doc = {
      id: state.id,
      name: state.name,
      tagline: state.tagline || '',
      type: state.type || 'state',
      image: state.image || '',
      intro: state.intro || '',
      bestTime: state.bestTime || '',
      budgetRange: state.budgetRange || '',
      coords: state.coords || {},
      destinations: state.destinations || [],
      travelNotes: state.travelNotes || '',
      mapEmbedUrl: mapEmbeds[state.id] || '',

      // From tourism knowledge base
      capital: tkb.capital || kb.capital || '',
      region: tkb.region || kb.region || '',
      overview: {
        short: tkb.overview?.short || kb.overview?.short || '',
        paragraph2: tkb.overview?.paragraph2 || kb.overview?.paragraph2 || '',
        paragraph3: tkb.overview?.paragraph3 || kb.overview?.paragraph3 || '',
        cultureHeritage: tkb.overview?.cultureHeritage || kb.overview?.cultureHeritage || ''
      },

      // From per-state knowledge base JSON
      foodCuisine: kb.foodCuisine || { famousDishes: [], streetFood: [] },
      stayOptions: kb.stayOptions || { luxury: [], midRange: [], unique: [] },
      bestTimeToVisit: kb.bestTimeToVisit || [],
      transportation: kb.transportation || { airports: [], railways: [], roads: [] },
      festivals: kb.festivals || [],
      adventure: kb.adventure || [],
      travelTips: kb.travelTips || [],
      uniqueFacts: kb.uniqueFacts || []
    };

    const result = await State.findOneAndUpdate(
      { id: state.id },
      { $set: doc },
      { upsert: true, new: true }
    );

    if (result.createdAt && result.updatedAt &&
        result.createdAt.getTime() === result.updatedAt.getTime()) {
      inserted++;
    } else {
      updated++;
    }
  }

  console.log(`  ✅ States: ${inserted} inserted, ${updated} updated (total: ${statesJson.length})`);
}

// ══════════════════════════════════════════════════
//  SEED HIDDEN GEMS
// ══════════════════════════════════════════════════
async function seedHiddenGems() {
  console.log('\n💎 Seeding Hidden Gems...');

  const gems = readJson('../../data/hiddenGems.json');
  if (!gems) return;

  let inserted = 0, updated = 0;

  for (const gem of gems) {
    const result = await HiddenGem.findOneAndUpdate(
      { id: gem.id },
      { $set: gem },
      { upsert: true, new: true }
    );
    if (result.createdAt && result.updatedAt &&
        result.createdAt.getTime() === result.updatedAt.getTime()) {
      inserted++;
    } else {
      updated++;
    }
  }

  console.log(`  ✅ Hidden Gems: ${inserted} inserted, ${updated} updated (total: ${gems.length})`);
}

// ══════════════════════════════════════════════════
//  SEED SAFETY TIPS
// ══════════════════════════════════════════════════
async function seedSafetyTips() {
  console.log('\n🛡️ Seeding Safety Tips...');

  // Safety tips are in a JS file with Lucide icon imports — we'll manually define the data
  const safetyCategories = [
    {
      category: 'Scam Awareness',
      categoryIcon: 'AlertTriangle',
      sortOrder: 0,
      tips: [
        { icon: 'AlertTriangle', title: 'Taxi & Auto Overcharging', text: 'Always insist on the meter or negotiate the fare before boarding. Use ride-hailing apps like Ola or Uber for transparent pricing.' },
        { icon: 'Shield', title: 'Fake Tour Guides', text: 'At major monuments, only hire guides with government-issued ID badges. Ignore unsolicited offers from strangers claiming to be "official" guides.' },
        { icon: 'Wallet', title: 'ATM & Card Skimming', text: 'Use ATMs inside bank branches. Cover the keypad while entering your PIN and avoid machines with loose card slots or suspicious attachments.' },
        { icon: 'Camera', title: '"Free" Photo Scams', text: 'People offering to take your photo or placing items on you for a "free" picture will demand money afterwards. Politely decline.' }
      ]
    },
    {
      category: 'Emergency Information',
      categoryIcon: 'Phone',
      sortOrder: 1,
      tips: [
        { icon: 'Phone', title: 'Essential Numbers', text: 'Police: 100 | Ambulance: 108 | Fire: 101 | Tourist Helpline: 1363 | Women Helpline: 1091 | Railway Enquiry: 139.' },
        { icon: 'FileText', title: 'Keep Digital Copies', text: 'Store scanned copies of your passport, visa, travel insurance, and emergency contacts in cloud storage or email them to yourself.' },
        { icon: 'MapPin', title: 'Register with Your Embassy', text: "Foreign tourists should register with their country's embassy or consulate in India for emergency assistance." }
      ]
    },
    {
      category: 'Solo Travel Tips',
      categoryIcon: 'Compass',
      sortOrder: 2,
      tips: [
        { icon: 'MapPin', title: 'Share Your Location', text: 'Share live GPS location with a trusted family member or friend. Use offline maps (Google Maps or maps.me) in areas with poor connectivity.' },
        { icon: 'Users', title: 'Choose Trusted Accommodations', text: 'Book verified accommodations on established platforms. Read recent reviews. Avoid isolated guesthouses late at night.' },
        { icon: 'Clock', title: 'Avoid Late Night Travel', text: 'Try to arrive at new cities during daylight. Avoid empty train compartments at night. Pre-book transport from airports or stations.' },
        { icon: 'Lock', title: 'Secure Your Belongings', text: 'Use padlocks on hostel lockers. Carry a money belt for cash and cards, and keep valuables in your hotel safe.' }
      ]
    },
    {
      category: 'Health & Wellness',
      categoryIcon: 'Heart',
      sortOrder: 3,
      tips: [
        { icon: 'Droplets', title: 'Drink Safe Water', text: 'Stick to sealed bottled water or use a portable purifier. Avoid ice in drinks from street stalls. Check bottle seals before buying.' },
        { icon: 'Sun', title: 'Sun & Heat Protection', text: 'India can be extremely hot. Wear sunscreen (SPF 50+), carry a hat, stay hydrated, and rest during peak afternoon hours.' },
        { icon: 'Heart', title: 'Travel Insurance', text: 'Always carry comprehensive travel insurance that covers medical emergencies, trip cancellations, and theft. Save the policy number on your phone.' }
      ]
    },
    {
      category: 'Practical Travel Advice',
      categoryIcon: 'Compass',
      sortOrder: 4,
      tips: [
        { icon: 'Wifi', title: 'Get a Local SIM', text: "Buy a prepaid SIM card from Jio or Airtel at the airport. You'll need your passport and a passport-sized photo. Data is extremely affordable." },
        { icon: 'Car', title: 'Transport Tips', text: 'Indian Railways is the backbone of travel. Book trains on the IRCTC app well in advance. For shorter distances, use state buses or local ride-hailing apps.' },
        { icon: 'Compass', title: 'Respect Local Customs', text: 'Dress modestly at religious sites. Remove shoes before entering temples. Ask before photographing people. Tipping 10% is standard at restaurants.' },
        { icon: 'Wallet', title: 'Carry Cash in Small Bills', text: 'Many local shops and auto drivers prefer cash. Keep small denominations (₹10, ₹20, ₹50, ₹100) handy. UPI (Google Pay, PhonePe) is widely accepted in cities.' }
      ]
    }
  ];

  await SafetyTip.deleteMany({});
  const result = await SafetyTip.insertMany(safetyCategories);
  console.log(`  ✅ Safety Tips: ${result.length} categories seeded`);
}

// ══════════════════════════════════════════════════
//  SEED HERO IMAGES
// ══════════════════════════════════════════════════
async function seedHeroImages() {
  console.log('\n🖼️ Seeding Hero Images...');

  const heroes = readJson('../../data/heroImages.json');
  if (!heroes) return;

  let count = 0;
  for (const hero of heroes) {
    await HeroImage.findOneAndUpdate(
      { slotId: hero.id },
      { $set: { slotId: hero.id, name: hero.name, image: hero.image } },
      { upsert: true }
    );
    count++;
  }

  console.log(`  ✅ Hero Images: ${count} slots seeded`);
}

// ══════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════
async function main() {
  console.log('🌱 Starting Explore India Smartly — Database Seed');
  console.log('═'.repeat(50));

  await connectDB();

  await seedStates();
  await seedHiddenGems();
  await seedSafetyTips();
  await seedHeroImages();

  console.log('\n' + '═'.repeat(50));
  console.log('✅ All seeds completed successfully!');

  // Print collection counts
  const counts = {
    States: await State.countDocuments(),
    HiddenGems: await HiddenGem.countDocuments(),
    SafetyTips: await SafetyTip.countDocuments(),
    HeroImages: await HeroImage.countDocuments()
  };
  console.log('\n📊 Collection Counts:');
  for (const [name, count] of Object.entries(counts)) {
    console.log(`   ${name}: ${count}`);
  }

  await mongoose.disconnect();
  console.log('\n🔌 Database disconnected. Seed complete.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('💥 Seed failed:', err);
  process.exit(1);
});
