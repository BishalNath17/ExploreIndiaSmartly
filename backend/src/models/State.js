const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: String,
  description: String
}, { _id: false });

const seasonSchema = new mongoose.Schema({
  season: String,
  months: String,
  conditions: String
}, { _id: false });

const festivalSchema = new mongoose.Schema({
  name: String,
  period: String,
  description: String
}, { _id: false });

const stateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: String,
  type: { type: String, enum: ['state', 'ut'], default: 'state' },
  image: String,
  intro: String,
  bestTime: String,
  budgetRange: String,
  coords: {
    lat: Number,
    lng: Number
  },
  destinations: [String],
  travelNotes: String,
  mapEmbedUrl: String,

  // Deep knowledge base fields
  capital: String,
  region: String,
  overview: {
    short: String,
    paragraph2: String,
    paragraph3: String,
    cultureHeritage: String
  },
  foodCuisine: {
    famousDishes: [dishSchema],
    streetFood: [dishSchema]
  },
  stayOptions: {
    luxury: [String],
    midRange: [String],
    unique: [String]
  },
  bestTimeToVisit: [seasonSchema],
  transportation: {
    airports: [String],
    railways: [String],
    roads: [String]
  },
  festivals: [festivalSchema],
  adventure: [String],
  travelTips: [String],
  uniqueFacts: [String]
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);
