const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['skipped-duplicate', 'merged-enrichment', 'rollback-batch'] 
  },
  batchId: { type: String },
  destinationName: { type: String, required: true },
  reason: { type: String, required: true },
  score: { type: Number },
  metadata: { type: mongoose.Schema.Types.Mixed } 
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
