require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');

const stateName = process.argv[2];

if (!stateName) {
  console.log('❌ Please provide state name');
  console.log('Example: node src/scripts/deleteByState.js Assam');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB Connected');

    const totalBefore = await Destination.countDocuments();
    console.log(`📊 Total destinations in DB: ${totalBefore}`);

    const regex = new RegExp(`^${stateName}$`, 'i');

    const before = await Destination.countDocuments({ state: { $regex: regex } });
    console.log(`📊 ${stateName} destinations BEFORE delete: ${before}`);

    if (before === 0) {
      console.log(`⚠️ No ${stateName} data found. Exiting safely.`);
      process.exit(0);
    }

    const result = await Destination.deleteMany({ state: { $regex: regex } });
    console.log(`🗑️ Deleted count: ${result.deletedCount}`);

    const after = await Destination.countDocuments({ state: { $regex: regex } });
    console.log(`📊 ${stateName} destinations AFTER delete: ${after}`);

    const totalAfter = await Destination.countDocuments();
    console.log(`📊 Total destinations remaining in DB: ${totalAfter}`);
    console.log(`📊 Difference: ${totalBefore - totalAfter} (should equal deleted count)`);

    console.log(`✅ Only ${stateName} destinations removed`);
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR:', err);
    process.exit(1);
  }
};

run();
