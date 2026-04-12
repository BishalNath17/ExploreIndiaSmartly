const mongoose = require('mongoose');

const hiddenGemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: String,
  state: String,
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('HiddenGem', hiddenGemSchema);
