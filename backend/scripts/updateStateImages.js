require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const State = require('../src/models/State');

const run = async () => {
  try {
    const imagesDir = path.resolve(__dirname, '../../frontend/public/images/states');
    const files = fs.readdirSync(imagesDir);

    console.log(`Found ${files.length} images in frontend/public/images/states/`);

    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let updatedCount = 0;
    for (const file of files) {
      // Ignore non-image files or directories
      if (!file.match(/\.(png|jpg|jpeg|webp)$/i)) continue;

      // Extract the state ID from the filename.
      // Example: 'andaman-nicobar-1774874973418.png' -> 'andaman-nicobar'
      // Example: 'andhra-pradesh.jpg' -> 'andhra-pradesh'
      const id = file
        .replace(/-\d{13}\.(png|jpg|jpeg|webp)$/i, '')
        .replace(/\.(png|jpg|jpeg|webp)$/i, '');

      const imagePath = `/images/states/${file}`;

      const state = await State.findOneAndUpdate(
        { id: id },
        { $set: { image: imagePath } },
        { new: true }
      );

      if (state) {
        console.log(`✅ Updated ${id} with image ${imagePath}`);
        updatedCount++;
      } else {
        console.log(`⚠️  State not found for id: ${id} (file: ${file})`);
      }
    }

    console.log(`Done. Updated ${updatedCount} states.`);
  } catch (error) {
    console.error('Error updating state images:', error);
  } finally {
    process.exit(0);
  }
};

run();
