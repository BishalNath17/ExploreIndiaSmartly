/**
 * Standalone Tripura Destinations Import Script
 * 
 * Usage: node scripts/importTripura.js
 * 
 * This script reads tripura_destinations.json from backend/data/
 * and upserts all destinations into MongoDB.
 * Duplicates are avoided using the unique 'id' field.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import the Destination model
const Destination = require('../src/models/Destination');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env');
  process.exit(1);
}

const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const filePath = path.resolve(__dirname, '../data/tripura_destinations.json');
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const destinations = JSON.parse(rawData);
    console.log(`📦 Found ${destinations.length} destinations in JSON`);

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const dest of destinations) {
      const id = `${toSlug(dest.name)}-tripura`;

      const doc = {
        id,
        name: dest.name,
        state: 'tripura',
        district: dest.district || '',
        description: dest.description || '',
        whyFamous: Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : '',
        location: dest.district ? `${dest.district}, Tripura` : 'Tripura',
        rating: 4.5,
      };

      try {
        const result = await Destination.findOneAndUpdate(
          { id },          // match by slug id
          { $set: doc },   // update fields
          { upsert: true, new: true }  // create if not exists
        );

        if (result.createdAt && result.updatedAt && 
            result.createdAt.getTime() === result.updatedAt.getTime()) {
          inserted++;
        } else {
          updated++;
        }
      } catch (err) {
        console.error(`  ❌ Error on "${dest.name}":`, err.message);
        errors++;
      }
    }

    console.log('');
    console.log('═══════════════════════════════════');
    console.log(`✅ Import Complete`);
    console.log(`   New:     ${inserted}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${destinations.length}`);
    console.log('═══════════════════════════════════');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);

  } catch (err) {
    console.error('💥 Fatal error:', err.message);
    process.exit(1);
  }
};

run();
