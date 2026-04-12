const fs = require('fs');
const path = require('path');

// Load .env from backend root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Destination = require('../models/Destination');

const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const importData = async () => {
  // Try multiple possible locations for the file
  const possiblePaths = [
    path.resolve(__dirname, '../data/tripura_destinations.json'),
    path.resolve(__dirname, '../../../tripura_destinations.json'),
  ];

  let filePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    console.error('❌ tripura_destinations.json not found at any expected location');
    console.error('Checked:', possiblePaths);
    process.exit(1);
  }

  console.log(`📁 Using file: ${filePath}`);

  const rawData = fs.readFileSync(filePath, 'utf8');
  const destinations = JSON.parse(rawData);
  console.log(`📦 Found ${destinations.length} destinations in JSON.`);

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI not set in .env');
    process.exit(1);
  }
  console.log('🔌 Connecting to MongoDB...');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // Map JSON data to the Destination schema
  const formattedDestinations = destinations.map((dest) => ({
    id: `${toSlug(dest.name)}-tripura`,
    name: dest.name,
    state: 'tripura',
    district: dest.district || '',
    description: dest.description || '',
    whyFamous: Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : '',
    location: dest.district ? `${dest.district}, Tripura` : 'Tripura',
    rating: 4.5,
  }));

  // Clear existing Tripura destinations
  const deleteRes = await Destination.deleteMany({ state: 'tripura' });
  console.log(`🗑️  Cleared ${deleteRes.deletedCount} existing Tripura destinations.`);

  // Insert all
  const result = await Destination.insertMany(formattedDestinations);
  console.log(`✅ Successfully imported ${result.length} Tripura destinations!`);

  // Also copy the file to backend/src/data for future reference
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const destPath = path.join(dataDir, 'tripura_destinations.json');
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(filePath, destPath);
    console.log('📋 Copied JSON to backend/src/data/');
  }

  await mongoose.disconnect();
  console.log('🔌 MongoDB disconnected. Done!');
  process.exit(0);
};

importData();
