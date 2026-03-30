const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Destination = require('./src/models/Destination');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exploreindia';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const jsonPath = path.resolve(__dirname, '../frontend/src/data/json/destinations.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const destinations = JSON.parse(rawData);

    console.log(`Found ${destinations.length} destinations in JSON.`);

    let count = 0;
    for (const dest of destinations) {
       // Only insert if it doesn't already exist (id matching).
       const exists = await Destination.findOne({ id: dest.id });
       if (!exists) {
          await Destination.create(dest);
          count++;
       }
    }
    
    console.log(`Successfully imported ${count} NEW destinations into MongoDB.`);
    process.exit(0);
  } catch(err) {
    console.error('Migration Error:', err);
    process.exit(1);
  }
}

run();
