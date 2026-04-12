const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  icon: String,
  title: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const safetyTipSchema = new mongoose.Schema({
  category: { type: String, required: true },
  categoryIcon: String,
  sortOrder: { type: Number, default: 0 },
  tips: [tipSchema]
}, { timestamps: true });

module.exports = mongoose.model('SafetyTip', safetyTipSchema);
