const mongoose = require('mongoose');

const heroImageSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true, enum: ['main-hero', 'left-card', 'right-card'] },
  name: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('HeroImage', heroImageSchema);
