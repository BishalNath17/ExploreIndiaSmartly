const mongoose = require('mongoose');

const reviewHistorySchema = new mongoose.Schema({
  field: { type: String },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'admin' }
}, { _id: false });

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
  image: { type: String },
  imageMeta: {
    alt: { type: String },
    source: { type: String },           // 'exact_api' | 'retry_api' | 'category_fallback' | 'state_fallback' | 'manual'
    status: { type: String },           // 'assigned' | 'review_needed'
    typeMatch: { type: String },        // 'exact' | 'category' | 'state'
    imageProviderId: { type: String },   // Unsplash photo ID
    photographerName: { type: String },
    photographerUrl: { type: String },
    verified: { type: Boolean, default: false },
    searchAttempts: { type: Number, default: 0 }
  },
  primaryCategory: { type: String },
  secondaryCategories: [{ type: String }],
  aliases: [{ type: String }],
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, default: 'published' }, // 'published' | 'pending-review' | 'rejected'
  dedupConfidenceScore: { type: Number, min: 0, max: 100 },
  aiMetadata: {
    generationBatch: { type: String },
    generatedAt: { type: Date },
    importScriptVersion: { type: String }
  },
  reviewHistory: { type: [reviewHistorySchema], default: [] },
  mergeMetadata: {
    mergedFields: [{ type: String }],
    mergedAt: { type: Date }
  },
  source: { type: String, default: 'manual' }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
