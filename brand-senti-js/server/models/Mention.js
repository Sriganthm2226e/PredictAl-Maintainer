// server/models/Mention.js
const mongoose = require('mongoose');

const MentionSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  platform: { type: String, required: true }, // Twitter, Instagram, Facebook, News
  content: { type: String, required: true },
  author: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mention', MentionSchema);
