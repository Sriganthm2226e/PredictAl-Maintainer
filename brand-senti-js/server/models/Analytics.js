// server/models/Analytics.js
const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  totalMentions: { type: Number, default: 0 },
  positives: { type: Number, default: 0 },
  negatives: { type: Number, default: 0 },
  neutrals: { type: Number, default: 0 },
  periodStart: { type: Date, default: Date.now },
  periodEnd: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
