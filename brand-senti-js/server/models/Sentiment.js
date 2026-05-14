// server/models/Sentiment.js
const mongoose = require('mongoose');

const SentimentSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  text: { type: String, required: true },
  sentiment: { type: String, enum: ['Positive', 'Negative', 'Neutral'], required: true },
  confidence: { type: Number, required: true },
  source: { type: String, required: true }, // e.g., Twitter, Instagram
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sentiment', SentimentSchema);
