// server/controllers/sentimentController.js
const { fetchTwitter } = require('../services/twitterService');
const { fetchInstagram } = require('../services/instagramService');
const { fetchFacebook } = require('../services/facebookService');
const { fetchNews } = require('../services/newsService');
const { analyzeSentiment } = require('../services/geminiService');

const Mention = require('../models/Mention');
const Sentiment = require('../models/Sentiment');
const Analytics = require('../models/Analytics');

// Import the io instance from server.js
const { io } = require('../server');

/**
 * POST /api/sentiment/analyze
 * Body: { brand: string }
 */
exports.analyzeSentiment = async (req, res, next) => {
  try {
    const { brand } = req.body;
    if (!brand) return res.status(400).json({ success: false, message: 'Brand name required' });

    // 1️⃣ Fetch mentions from all sources (parallel)
    const [tw, ig, fb, news] = await Promise.all([
      fetchTwitter(brand),
      fetchInstagram(brand),
      fetchFacebook(brand),
      fetchNews(brand),
    ]);
    const allMentions = [...tw, ...ig, ...fb, ...news];

    // 2️⃣ Persist mentions
    const savedMentions = await Mention.insertMany(allMentions);
    // Emit each mention for live feed
    savedMentions.forEach(m => io.emit('liveMention', m));

    // 3️⃣ Analyze sentiment for each mention using Gemini
    const sentimentDocs = await Promise.all(savedMentions.map(async (m) => {
      const { sentiment, confidence } = await analyzeSentiment(m.content);
      return {
        brand: m.brand,
        text: m.content,
        sentiment,
        confidence,
        source: m.platform,
        createdAt: m.createdAt,
      };
    }));
    const savedSentiments = await Sentiment.insertMany(sentimentDocs);

    // 4️⃣ Compute analytics
    const totalMentions = savedMentions.length;
    const positives = savedSentiments.filter(s => s.sentiment === 'Positive').length;
    const negatives = savedSentiments.filter(s => s.sentiment === 'Negative').length;
    const neutrals = savedSentiments.filter(s => s.sentiment === 'Neutral').length;

    // Store analytics (one document per brand per analysis run)
    const analytics = new Analytics({
      brand,
      totalMentions,
      positives,
      negatives,
      neutrals,
      periodStart: new Date(),
      periodEnd: new Date(),
    });
    await analytics.save();

    // 5️⃣ Emit analytics update
    io.emit('sentimentUpdate', {
      brand,
      totalMentions,
      positives,
      negatives,
      neutrals,
    });

    // 6️⃣ Respond
    res.json({
      success: true,
      totalMentions,
      positives,
      negatives,
      neutrals,
      mentions: savedMentions,
      sentiments: savedSentiments,
    });
  } catch (err) {
    next(err);
  }
};
