const mongoose = require("mongoose");
require("dotenv").config();
const fetch = global.fetch;
const Destination = require("../models/Destination");

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Track used images to avoid duplicates
const usedImages = new Set();

// Smart query builder
const buildQuery = (dest) => {
  return `${dest.name} Chhattisgarh India tourism nature landmark`;
};

// Check if image is bad (placeholder / wrong)
const isBadImage = (url) => {
  if (!url) return true;
  if (!url.startsWith("http")) return true;
  if (url.includes("source.unsplash")) return true; // random fallback
  if (url.includes("shoe") || url.includes("nike")) return true;
  return false;
};

// Fetch image
const getImage = async (query) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=3`;
    const res = await fetch(url);
    const data = await res.json();

    for (const img of data.results) {
      const imgUrl = img.urls.regular;
      if (!usedImages.has(imgUrl)) {
        usedImages.add(imgUrl);
        return imgUrl;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  const destinations = await Destination.find({
    state: "Chhattisgarh"
  });

  console.log("Total found:", destinations.length);

  for (const dest of destinations) {

    // Skip GOOD images
    if (!isBadImage(dest.image)) {
      console.log("Good image, skipped:", dest.name);
      continue;
    }

    const query = buildQuery(dest);

    const imageUrl = await getImage(query);

    if (!imageUrl) {
      console.log("No suitable image:", dest.name);
      continue;
    }

    dest.image = imageUrl;
    await dest.save();

    console.log("Updated:", dest.name);

    // Rate limit safety (important)
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("Done ✅");
  process.exit(0);
};

run();
