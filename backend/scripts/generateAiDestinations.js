const fs = require('fs');
const path = require('path');

// Target endpoint
const API_URL = 'http://127.0.0.1:5000/api/v1/admin/destinations/import-ai';
const AUTH_TOKEN = 'Bearer dummy-admin-token';
const CHECKPOINT_FILE = path.join(__dirname, '..', 'data', 'ai_import_checkpoint.json');

// Check CLI arguments
const isDryRun = process.argv.includes('--dry-run');
console.log(`\n======================================`);
console.log(`🤖 AI DESTINATION IMPORT ENGINE`);
console.log(`Mode: ${isDryRun ? 'DRY-RUN (No DB write)' : 'PRODUCTION'}`);
console.log(`======================================\n`);

const BATCH_ID = 'seed-batch-v1-002'; // Idempotency Key
const SCRIPT_VERSION = 'v2-hardened';

// Chunk 1: Tripura
const chunkTripura = {
  state: 'Tripura',
  destinations: [
    {
      name: 'Unakoti Rock Carvings',
      primaryCategory: 'Historical',
      secondaryCategories: ['Spiritual', 'Hidden Gem'],
      aliases: ['Unakoti', 'Unakoti Hills', 'Unakoti Stone Carvings'],
      city: 'Kailashahar',
      district: 'Unakoti',
      description: 'Ancient Shaivite rock relief sculptures carved into a massive forested cliffside, dating back to the 7th-9th centuries.',
      highlights: ['Stone Carvings', 'Archaeological Wonder', 'Pilgrimage'],
      bestTimeToVisit: 'October to April',
      rating: 4.8,
      coordinates: { lat: 24.3168, lng: 92.0125 }
    },
    {
      name: 'Neermahal Palace',
      primaryCategory: 'Historical',
      secondaryCategories: ['City Attraction', 'Hidden Gem'],
      aliases: ['Neer Mahal', 'Water Palace Tripura', 'Rudrasagar Lake Palace'],
      city: 'Melaghar',
      district: 'Sipahijala',
      description: 'The breathtaking "Water Palace" of India, uniquely floating in the center of Rudrasagar Lake.',
      highlights: ['Boat Ride', 'Floating Palace', 'Sunset Views'],
      bestTimeToVisit: 'September to March',
      rating: 4.9,
      coordinates: { lat: 23.4925, lng: 91.3322 }
    }
    // (Truncated subset for clean simulation mapping rules to prevent massive Node heap allocs in preview)
  ]
};

// Chunk 2: Goa (Medium)
const chunkGoa = {
  state: 'Goa',
  destinations: [
    {
       name: 'Basilica of Bom Jesus',
       primaryCategory: 'Historical',
       secondaryCategories: ['Spiritual'],
       aliases: ['Bom Jesus Basilica', 'St Francis Xavier Tomb'],
       city: 'Old Goa',
       description: 'A UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier, renowned for its baroque architecture.',
       highlights: ['UNESCO Site', 'Baroque Architecture', 'Christian Pilgrimage'],
       bestTimeToVisit: 'November to February',
       rating: 4.8,
       coordinates: { lat: 15.5009, lng: 73.9116 }
    },
    {
       name: 'Dudhsagar Waterfalls',
       primaryCategory: 'Waterfall',
       secondaryCategories: ['Adventure', 'Wildlife'],
       aliases: ['Dudhsagar Falls', 'Sea of Milk Waterfall'],
       city: 'Sanguem',
       description: 'A spectacular four-tiered waterfall on the Mandovi River, looking like a "Sea of Milk" tumbling down the Western Ghats.',
       highlights: ['Trekking', 'Jeep Safari', 'Scenic Train Bridge'],
       bestTimeToVisit: 'July to October',
       rating: 4.9,
       coordinates: { lat: 15.3144, lng: 74.3143 }
    },
    {
       name: 'Palolem Beach',
       primaryCategory: 'Beach',
       secondaryCategories: ['Hidden Gem'],
       aliases: ['Palolem', 'Butterfly Beach Area'],
       city: 'Canacona',
       description: 'A crescent-shaped pristine beach in South Goa mapped heavily by palm trees and colorful wooden shacks.',
       highlights: ['Nightlife', 'Clean Waters', 'Dolphin Sighting'],
       bestTimeToVisit: 'October to March',
       rating: 4.7,
       coordinates: { lat: 15.0100, lng: 74.0232 }
    }
  ]
};

// Chunk 3: Rajasthan (Large)
const chunkRajasthan = {
  state: 'Rajasthan',
  destinations: [
    {
       name: 'Mehrangarh Fort',
       primaryCategory: 'Historical',
       secondaryCategories: ['City Attraction'],
       aliases: ['Mehran Fort', 'Jodhpur Fort'],
       city: 'Jodhpur',
       description: 'One of the largest forts in India, built in around 1459 by Rao Jodha, towering 410 feet above the Blue City.',
       highlights: ['Museum', 'Zip-lining', 'Sunset Views'],
       bestTimeToVisit: 'October to March',
       rating: 4.9,
       coordinates: { lat: 26.2978, lng: 73.0186 }
    },
    {
       name: 'Lake Palace',
       primaryCategory: 'Historical',
       secondaryCategories: ['Hidden Gem'],
       aliases: ['Jag Niwas', 'Udaipur Lake Palace'],
       city: 'Udaipur',
       description: 'A beautiful former summer palace of the royal dynasty of Mewar, now a luxury hotel floating in Lake Pichola.',
       highlights: ['Luxury Stay', 'Lake Pichola', 'Boat Ride'],
       bestTimeToVisit: 'September to March',
       rating: 4.8,
       coordinates: { lat: 24.5775, lng: 73.6800 }
    },
    {
       name: 'Ranthambore National Park',
       primaryCategory: 'Wildlife',
       secondaryCategories: ['Adventure'],
       aliases: ['Ranthambore Tiger Reserve', 'Sawai Madhopur Reserve'],
       city: 'Sawai Madhopur',
       description: 'One of the biggest and most renowned national parks in Northern India, famous for its dense tiger population.',
       highlights: ['Tiger Safari', 'Padam Talao', 'Ranthambore Fort'],
       bestTimeToVisit: 'October to June',
       rating: 4.7,
       coordinates: { lat: 26.0173, lng: 76.5026 }
    }
  ]
};

// Batch definition
const AI_BATCH_DATA = [chunkTripura, chunkGoa, chunkRajasthan];

async function run() {
  let completedStates = [];
  
  if (fs.existsSync(CHECKPOINT_FILE) && !isDryRun) {
    const raw = fs.readFileSync(CHECKPOINT_FILE);
    completedStates = JSON.parse(raw);
    console.log(`[Resume] Found checkpoint. Skipping completed states: ${completedStates.join(', ')}`);
  }

  for (const chunk of AI_BATCH_DATA) {
    if (completedStates.includes(chunk.state) && !isDryRun) {
      console.log(`[Skip] State ${chunk.state} already processed.`);
      continue;
    }

    console.log(`\n⏳ Processing ${chunk.state} [${chunk.destinations.length} destinations generated]...`);

    const payload = {
      state: chunk.state,
      batchId: BATCH_ID,
      importScriptVersion: SCRIPT_VERSION,
      destinations: chunk.destinations,
      dryRun: isDryRun
    };

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify(payload)
      });

      const json = await resp.json();
      
      if (!json.success) {
        console.error(`❌ Failed to process ${chunk.state}: ${json.message}`);
        continue;
      }

      console.log(`✅ Success: ${chunk.state}`);
      console.log(`   - Generated initially: ${json.generated}`);
      console.log(`   - Inserted new:        ${json.inserted}`);
      console.log(`   - Manually Merged:     ${json.merged}`);
      console.log(`   - Flagged for Review:  ${json.flaggedForReview}`);
      console.log(`   - Skipped duplicates:  ${json.skippedDuplicates}`);
      console.log(`   - Error/Failed docs:   ${json.failed}`);
      
      // Update checkpoint securely inside physical loop
      if (!isDryRun) {
        completedStates.push(chunk.state);
        const dir = path.dirname(CHECKPOINT_FILE);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(completedStates, null, 2));
      }

    } catch (e) {
      console.error(`💥 Network exception connecting to backend:`, e.message);
      break; 
    }
  }
  
  console.log(`\n🚀 Engine Execution Completed.\n`);
}

run();
