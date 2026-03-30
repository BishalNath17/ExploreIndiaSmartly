const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String },
  city: { type: String },
  address: { type: String },
  mapEmbedUrl: { type: String },
  location: { type: String },
  description: { type: String },
  whyFamous: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
