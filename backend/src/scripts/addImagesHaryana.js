const mongoose = require("mongoose");
require("dotenv").config();
const fetch = global.fetch;
const Destination = require("../models/Destination");

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const getImage = async (query) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=1`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results[0]?.urls?.regular || null;
  } catch {
    return null;
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  const destinations = await Destination.find({
    state: "Haryana"
  });

  console.log("Total found:", destinations.length);

  for (const dest of destinations) {

    // 🔥 FORCE UPDATE (important)
    const query = `${dest.name} Haryana tourism place India`;

    const imageUrl = await getImage(query);

    if (!imageUrl) {
      console.log("No image:", dest.name);
      continue;
    }

    dest.image = imageUrl;
    await dest.save();

    console.log("Updated:", dest.name);
  }

  console.log("Done ✅");
  process.exit(0);
};

run();
