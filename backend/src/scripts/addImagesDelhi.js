const mongoose = require("mongoose");
require("dotenv").config();
const Destination = require("../models/Destination");

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const getSearchQuery = (dest) => {
  return `${dest.name} Delhi monument tourism India`;
};

const getImage = async (query) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=1`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results[0]?.urls?.regular || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  const destinations = await Destination.find({
    state: "Delhi"
  });

  console.log("Total found:", destinations.length);

  for (const dest of destinations) {
    // FORCE UPDATE: removed the check for existing images
    let imageUrl = await getImage(getSearchQuery(dest));

    if (!imageUrl) {
      console.log("No image found for:", dest.name);
      continue; // Skip if no image is found, but do not use source.unsplash.com fallback
    }

    dest.image = imageUrl;
    await dest.save();

    console.log("Updated:", dest.name);
  }

  console.log("Done ✅");
  process.exit(0);
};

run();
