/**
 * enrichDestinationImages.js
 * 
 * Intelligent, multi-layer image enrichment engine for Destinations.
 * Automatically cascades through 5 tiers of relevance to ensure every
 * destination receives a safe, beautiful, non-duplicate representation.
 * 
 * Usage: node scripts/enrichDestinationImages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Destination = require('../src/models/Destination');

// ─── Configuration ───────────────────────────────────────────────
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API = 'https://api.unsplash.com/search/photos';
const CHECKPOINT_FILE = path.resolve(__dirname, '../data/smart_enrichment_checkpoint.json');
const RATE_LIMIT_DELAY_MS = 1500; 
const BATCH_SIZE = 50;

// ─── State ───────────────────────────────────────────────────────
const usedImageIds = new Set();
const results = {
  totalChecked: 0,
  exactMatches: 0,
  retryMatches: 0,
  categoryFallbacks: 0,
  stateFallbacks: 0,
  reviewNeeded: 0,
  duplicatesPrevented: 0,
  failed: 0
};

// ─── Context Maps ────────────────────────────────────────────────
const categoryMap = {
  'temple': 'Indian temple architecture ancient',
  'waterfall': 'waterfall jungle nature',
  'fort': 'Indian historical fort majestic',
  'palace': 'heritage royal palace India',
  'lake': 'scenic lake water tranquil',
  'river': 'river stream nature India',
  'hill station': 'misty mountains hills',
  'wildlife': 'forest wildlife nature India',
  'beach': 'beautiful clean beach sunset',
  'village': 'rural village India culture',
  'viewpoint': 'mountain viewpoint landscape',
  'park': 'green eco park nature',
  'museum': 'Indian museum heritage'
};

const stateMap = {
  'tripura': 'Tripura lush hills tribal culture landscape',
  'rajasthan': 'Rajasthan desert forts heritage architecture',
  'goa': 'Goa coastal beaches tropical nature',
  'himachal-pradesh': 'Himachal Pradesh snow mountains pine forest',
  'meghalaya': 'Meghalaya waterfalls clouds green hills',
  'kerala': 'Kerala backwaters tropical green palm',
  // generic fallback
  'default': 'India diverse landscape beautiful'
};

// ─── Helpers ─────────────────────────────────────────────────────

function loadCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
    }
  } catch { /* ignore corrupt checkpoint */ }
  return { processedIds: [], usedPhotoIds: [] };
}

function saveCheckpoint(processedIds) {
  const dir = path.dirname(CHECKPOINT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify({
    processedIds,
    usedPhotoIds: [...usedImageIds],
    lastRun: new Date().toISOString()
  }, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleRateLimitCooldown() {
  const now = new Date();
  const msUntilNextHour = (60 - now.getMinutes()) * 60000 - (now.getSeconds() * 1000) + 120000; // adding 2 minutes padding
  console.log(`\n⏳ [RATE LIMIT TRIGGERED] Sleeping for ${(msUntilNextHour / 60000).toFixed(1)} minutes until Unsplash hourly reset...`);
  await sleep(msUntilNextHour);
  console.log(`\n✅ Resuming operations.\n`);
}

async function executeUnsplashSearch(query, perPage = 5) {
  const url = `${UNSPLASH_API}?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${perPage}`;
  
  try {
    const resp = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    if (resp.status === 401) throw new Error('Invalid Unsplash Access Key');
    
    if (resp.status === 403 || resp.status === 429) {
       await handleRateLimitCooldown();
       return executeUnsplashSearch(query, perPage); 
    }

    if (!resp.ok) throw new Error(`API Error ${resp.status}`);

    const data = await resp.json();
    return data.results || [];
  } catch (e) {
    if (e.message.includes('fetch')) {
       console.log('Network error, retrying in 10s...');
       await sleep(10000);
       return executeUnsplashSearch(query, perPage);
    }
    throw e;
  }
}

function selectBestPhoto(resultsArray) {
  if (!resultsArray || resultsArray.length === 0) return null;

  // We rotate photos naturally by dropping any we already used globally.
  // We avoid anything with tags like 'map', 'logo', 'text' if possible (handled slightly by Unsplash relevance naturally).
  for (const photo of resultsArray) {
    if (usedImageIds.has(photo.id)) {
      results.duplicatesPrevented++;
      continue;
    }
    return photo;
  }
  return null;
}

function inferCategory(dest) {
  if (dest.primaryCategory) return dest.primaryCategory.toLowerCase();
  const name = dest.name.toLowerCase();
  for (const cat of Object.keys(categoryMap)) {
    if (name.includes(cat)) return cat;
  }
  return null;
}

// ─── Core Tiers ──────────────────────────────────────────────────

async function processLevel1Exact(dest) {
  // Query 1: Name + State + India travel
  let photos = await executeUnsplashSearch(`${dest.name} ${dest.state} India travel`, 5);
  let best = selectBestPhoto(photos);
  if (best) return best;
  
  await sleep(RATE_LIMIT_DELAY_MS);

  // Query 2: Name + City (if exists)
  if (dest.city) {
    photos = await executeUnsplashSearch(`${dest.name} ${dest.city} India`, 5);
    best = selectBestPhoto(photos);
    if (best) return best;
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  return null;
}

async function processLevel2Retry(dest) {
  // Clean name
  let cleanName = dest.name.replace(/[^a-zA-Z\s]/g, '').trim();
  const cat = inferCategory(dest);
  
  if (cat) {
    const photos = await executeUnsplashSearch(`${cleanName} ${cat} India`, 10);
    const best = selectBestPhoto(photos);
    if (best) return best;
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  // Very broad fallback using just the clean name and generic travel tags
  const photos = await executeUnsplashSearch(`${cleanName} tourism landscape`, 5);
  return selectBestPhoto(photos);
}

async function processLevel3Category(dest) {
  const cat = inferCategory(dest);
  if (!cat || !categoryMap[cat]) return null;

  // Retrieve a larger pool (15) so category fallbacks rotate dynamically
  const photos = await executeUnsplashSearch(`${categoryMap[cat]}`, 15);
  return selectBestPhoto(photos); // Will automatically skip already-used generic ones!
}

async function processLevel4State(dest) {
  const stateQuery = stateMap[dest.state.toLowerCase()] || stateMap['default'];
  const photos = await executeUnsplashSearch(stateQuery, 20); // Large pool for states
  return selectBestPhoto(photos);
}

// ─── Main Execution Engine ───────────────────────────────────────

async function runEngine() {
  console.log(`\n======================================`);
  console.log(`🧠 INTELLIGENT 5-TIER DESTINATION ENRICHMENT`);
  console.log(`======================================\n`);

  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ UNSPLASH_ACCESS_KEY is not set.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const checkpoint = loadCheckpoint();
  const processedIds = new Set(checkpoint.processedIds || []);
  (checkpoint.usedPhotoIds || []).forEach(id => usedImageIds.add(id));

  // Pull all destinations
  const allDests = await Destination.find({}).lean();
  const candidates = allDests.filter(d => {
    if (processedIds.has(d.id || d._id.toString())) return false;
    // Strictly block overwriting valid manually uploaded images
    if (d.image && d.image.trim() !== '' && d.imageSource === 'manual') return false; 
    // And if it has any valid image that ISNT a review flag and ISNT empty
    if (d.image && d.image.trim() !== '' && d.imageStatus !== 'review_needed') return false;
    // Finally, if it is already flagged for review and has no image, we might want to retry?
    // Wait, script rules: "achieve 100% destinations have image OR review flag." 
    // If it already has review flag, we skip it so we don't loop forever.
    if (!d.image && d.imageMeta && d.imageMeta.status === 'review_needed') return false;
    
    return true;
  });

  console.log(`🎯 Targets acquired: ${candidates.length} remaining.\n`);

  for (let i = 0; i < candidates.length; i++) {
    const dest = candidates[i];
    const destId = dest.id || dest._id.toString();
    results.totalChecked++;

    console.log(`[${i+1}/${candidates.length}] Processing: ${dest.name} (${dest.state})`);
    
    let photo = null;
    let sourceLevel = null;
    let typeMatch = null;
    let iterations = 0;

    try {
       // --- TIER 1 ---
       iterations++;
       photo = await processLevel1Exact(dest);
       if (photo) { sourceLevel = 'exact_api'; typeMatch = 'exact'; }
       await sleep(RATE_LIMIT_DELAY_MS);

       // --- TIER 2 ---
       if (!photo) {
         console.log(`   🔸 T1 Failed. Attempting T2 Smart Retry...`);
         iterations++;
         photo = await processLevel2Retry(dest);
         if (photo) { sourceLevel = 'retry_api'; typeMatch = 'exact'; }
         await sleep(RATE_LIMIT_DELAY_MS);
       }

       // --- TIER 3 ---
       if (!photo) {
         console.log(`   🔸 T2 Failed. Routing to T3 Category Fallback...`);
         iterations++;
         photo = await processLevel3Category(dest);
         if (photo) { sourceLevel = 'category_fallback'; typeMatch = 'category'; }
         await sleep(RATE_LIMIT_DELAY_MS);
       }

       // --- TIER 4 ---
       if (!photo) {
         console.log(`   🔸 T3 Failed. Routing to T4 State Fallback...`);
         iterations++;
         photo = await processLevel4State(dest);
         if (photo) { sourceLevel = 'state_fallback'; typeMatch = 'state'; }
         await sleep(RATE_LIMIT_DELAY_MS);
       }

       // --- TIER 5 (Manual Review Trigger) ---
       if (!photo) {
         console.log(`   🚨 T4 Failed. Flagged for Manual Review.`);
         await Destination.updateOne(
           { _id: dest._id },
           { 
             $set: { 
               'imageMeta.status': 'review_needed',
               'imageMeta.searchAttempts': iterations
             } 
           }
         );
         results.reviewNeeded++;
         processedIds.add(destId);
         saveCheckpoint([...processedIds]);
         continue;
       }

       // --- PERSISTENCE ---
       const imageUrl = photo.urls.regular;
       const altText = photo.alt_description || `${dest.name} landscape in ${dest.state}, India`;
       
       await Destination.updateOne(
         { _id: dest._id },
         {
           $set: {
             image: imageUrl,
             'imageMeta.source': sourceLevel,
             'imageMeta.status': 'assigned',
             'imageMeta.typeMatch': typeMatch,
             'imageMeta.imageProviderId': photo.id,
             'imageMeta.photographerName': photo.user?.name || 'Unknown',
             'imageMeta.photographerUrl': photo.user?.links?.html || '',
             'imageMeta.verified': false,
             'imageMeta.searchAttempts': iterations
           }
         }
       );

       usedImageIds.add(photo.id);
       processedIds.add(destId);

       // Metrics
       if (typeMatch === 'exact' && sourceLevel === 'exact_api') results.exactMatches++;
       if (typeMatch === 'exact' && sourceLevel === 'retry_api') results.retryMatches++;
       if (typeMatch === 'category') results.categoryFallbacks++;
       if (typeMatch === 'state') results.stateFallbacks++;

       console.log(`   ✅ Matched via [${sourceLevel}]. Photo ID: ${photo.id}`);
       saveCheckpoint([...processedIds]);

    } catch(err) {
       console.error(`   💥 Critical Error:`, err.message);
       results.failed++;
    }
  }

  console.log(`\n======================================`);
  console.log(`📈 FINAL INTELLIGENCE REPORT`);
  console.log(`======================================`);
  console.log(`  Total Checked:         ${results.totalChecked}`);
  console.log(`  Exact Matches:         ${results.exactMatches}`);
  console.log(`  Retry Matches:         ${results.retryMatches}`);
  console.log(`  Category Fallbacks:    ${results.categoryFallbacks}`);
  console.log(`  State Fallbacks:       ${results.stateFallbacks}`);
  console.log(`  Review Needed:         ${results.reviewNeeded}`);
  console.log(`  Duplicates Prevented:  ${results.duplicatesPrevented}`);
  console.log(`  Failed:                ${results.failed}`);
  console.log(`======================================\n`);

  await mongoose.disconnect();
  console.log('🚀 Automation complete.');
}

runEngine().catch(console.error);
