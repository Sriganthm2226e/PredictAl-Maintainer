// server/routes/v1.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { io } = require('../server');

let brands = [
  { id: 1, name: "Tesla", description: "Automotive and Energy Company" },
  { id: 2, name: "Nvidia", description: "AI Hardware Producer" },
  { id: 3, name: "Apple", description: "Consumer Electronics" }
];

let mockMentions = [
  {
    id: 101,
    brand_id: 1,
    source: "twitter",
    posted_at: new Date(Date.now() - 5 * 60000).toISOString(),
    content: "Tesla Full Self Driving V12 is absolutely mind blowing. Zero interventions on my 40 min commute today! 🚀 #FSD",
    url: "https://twitter.com/tesla/status/123",
    sentiment: { sentiment: "positive", emotion: "joy", toxicity: 0.05, urgency: 0.12, confidence: 0.96 }
  },
  {
    id: 102,
    brand_id: 1,
    source: "reddit",
    posted_at: new Date(Date.now() - 15 * 60000).toISOString(),
    content: "Service center wait times for Cybertruck parts are getting ridiculous. Been waiting 3 weeks for a windshield replacement.",
    url: "https://reddit.com/r/teslamotors/comments/456",
    sentiment: { sentiment: "negative", emotion: "anger", toxicity: 0.45, urgency: 0.85, confidence: 0.92 }
  },
  {
    id: 103,
    brand_id: 1,
    source: "news",
    posted_at: new Date(Date.now() - 45 * 60000).toISOString(),
    content: "Tesla expands Megapack production facility in Lathrop, aiming to double output by Q4.",
    url: "https://bloomberg.com/news/tesla",
    sentiment: { sentiment: "neutral", emotion: "surprise", toxicity: 0.02, urgency: 0.25, confidence: 0.94 }
  },
  {
    id: 104,
    brand_id: 2,
    source: "twitter",
    posted_at: new Date(Date.now() - 10 * 60000).toISOString(),
    content: "Nvidia Blackwell architecture benchmarks are insane. AI training speeds up by 4x across the board.",
    url: "https://twitter.com/nvidia/status/789",
    sentiment: { sentiment: "positive", emotion: "joy", toxicity: 0.04, urgency: 0.18, confidence: 0.98 }
  }
];

// POST /auth/login (accepts FormData or JSON)
router.post('/auth/login', upload.none(), (req, res) => {
  const email = req.body.username || req.body.email || "demo@predictai.com";
  res.json({
    access_token: "fake_jwt_token_123",
    token: "fake_jwt_token_123",
    token_type: "bearer",
    user: { id: 1, email, name: "Demo Account" }
  });
});

// POST /auth/register
router.post('/auth/register', (req, res) => {
  res.json({
    access_token: "fake_jwt_token_123",
    token: "fake_jwt_token_123",
    token_type: "bearer",
    user: { id: 1, email: req.body.email, name: req.body.full_name || "Demo Account" }
  });
});

// GET /brands/
router.get('/brands/', (req, res) => {
  res.json(brands);
});

// POST /brands/
router.post('/brands/', (req, res) => {
  const { name, description } = req.body;
  const newBrand = { id: brands.length + 1, name, description: description || "" };
  brands.push(newBrand);
  res.json(newBrand);
});

// GET /mentions/stats
router.get('/mentions/stats', (req, res) => {
  const brandId = parseInt(req.query.brand_id) || 1;
  const brandMentions = mockMentions.filter(m => m.brand_id === brandId);
  
  const pos = brandMentions.filter(m => m.sentiment?.sentiment === 'positive').length;
  const neg = brandMentions.filter(m => m.sentiment?.sentiment === 'negative').length;
  const neu = brandMentions.filter(m => m.sentiment?.sentiment === 'neutral').length;

  res.json({
    total_mentions: brandMentions.length || 1,
    sentiment_distribution: { positive: pos || 1, negative: neg || 1, neutral: neu || 1 },
    emotion_distribution: { joy: pos, anger: neg, surprise: neu, sadness: 0 },
    averages: { toxicity: 0.14, urgency: 0.35, confidence: 0.94 },
    trends: [
      { date: 'May 8', mentions: 1200 }, { date: 'May 9', mentions: 1400 },
      { date: 'May 10', mentions: 1100 }, { date: 'May 11', mentions: 1800 },
      { date: 'May 12', mentions: 2200 }, { date: 'May 13', mentions: 1950 },
      { date: 'May 14', mentions: 2450 }
    ]
  });
});

// GET /mentions/
router.get('/mentions/', (req, res) => {
  const brandId = parseInt(req.query.brand_id) || 1;
  const brandMentions = mockMentions.filter(m => m.brand_id === brandId);
  res.json({ mentions: brandMentions });
});

// GET /health
router.get('/health', (req, res) => {
  res.json({ status: "healthy" });
});

// GET /test/redis-health
router.get('/test/redis-health', (req, res) => {
  res.json({ status: "healthy" });
});

// POST /test/inject
router.post('/test/inject', (req, res) => {
  const brandId = parseInt(req.query.brand_id) || 1;
  const sentiment = req.query.sentiment || "positive";
  
  const newMention = {
    id: Date.now(),
    brand_id: brandId,
    source: ["twitter", "reddit", "news"][Math.floor(Math.random() * 3)],
    posted_at: new Date().toISOString(),
    content: sentiment === "positive" 
      ? `Incredible experience with brand #${brandId} today! Highly recommended to everyone. ⭐⭐⭐⭐⭐` 
      : sentiment === "negative"
      ? `Major outage and terrible customer service from brand #${brandId}. Unacceptable! 😡`
      : `Brand #${brandId} released their Q2 financial update today.`,
    url: "https://twitter.com/sample/status/" + Date.now(),
    sentiment: {
      sentiment,
      emotion: sentiment === "positive" ? "joy" : sentiment === "negative" ? "anger" : "neutral",
      toxicity: sentiment === "negative" ? 0.75 : 0.05,
      urgency: sentiment === "negative" ? 0.85 : 0.10,
      confidence: 0.95
    }
  };

  mockMentions.unshift(newMention);
  
  // Broadcast via Socket.IO
  if (io) {
    io.emit("live_mention", newMention);
    if (sentiment === "negative") {
      io.emit("negative_alert", {
        type: "viral_complaint",
        brand_id: brandId,
        message: `High toxicity (${(newMention.sentiment.toxicity*100).toFixed(0)}%) detected: "${newMention.content.substring(0, 50)}..."`
      });
    }
  }

  res.json({ success: true, mention: newMention });
});

module.exports = router;
