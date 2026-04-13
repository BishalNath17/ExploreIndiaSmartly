const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined.');
      }

      await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'exploreindia'
      });
      console.log('✅ MongoDB Connected Successfully');
      return; // Exit loop on success
    } catch (err) {
      console.error(`❌ MongoDB Connection Failed. Retries left: ${retries - 1}`);
      console.error(`   Error details: ${err.message}`);
      retries -= 1;
      
      if (retries === 0) {
        console.error('💥 All MongoDB connection retries exhausted. Exiting process.');
        process.exit(1);
      }
      
      // Wait 5 seconds before retrying
      console.log('⏳ Waiting 5 seconds before retrying...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
