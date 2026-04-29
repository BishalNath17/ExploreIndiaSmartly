const mongoose = require("mongoose");
require("dotenv").config();
const Destination = require("../models/Destination");

const imageMap = {
  "Chitrakote Waterfall": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "Tirathgarh Waterfall": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "Kanger Valley National Park": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "Barnawapara Wildlife Sanctuary": "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
  "Sirpur": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "Rajim": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "Dongargarh": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "Mainpat": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "Raipur": "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "Bilaspur": "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "Danteshwari Temple": "https://images.unsplash.com/photo-1549887534-2c3c2d1e5c5b",
  "Jagdalpur": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "Kailash Caves": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "Malhar": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "Bhoramdeo Temple": "https://images.unsplash.com/photo-1549887534-2c3c2d1e5c5b"
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  const destinations = await Destination.find({
    state: "Chhattisgarh"
  });

  for (const dest of destinations) {
    const img = imageMap[dest.name];

    if (!img) {
      console.log("No mapping:", dest.name);
      continue;
    }

    dest.image = img;
    await dest.save();

    console.log("Updated:", dest.name);
  }

  console.log("All images fixed ✅");
  process.exit(0);
};

run();
