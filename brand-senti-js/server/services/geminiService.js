// server/services/geminiService.js
const axios = require('axios');

/**
 * Analyze a piece of text with Gemini AI and return sentiment and confidence.
 * Expected Gemini response format (JSON string): {"sentiment":"Positive","score":0.92}
 */
async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text }] }],
      }
    );
    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const result = JSON.parse(raw);
    return { sentiment: result.sentiment, confidence: result.score };
  } catch (err) {
    console.error('Gemini service error:', err.message);
    throw new Error('Sentiment analysis failed');
  }
}

module.exports = { analyzeSentiment };
