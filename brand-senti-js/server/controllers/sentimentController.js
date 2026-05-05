const Sentiment = require("sentiment");
const sentiment = new Sentiment();

exports.analyzeSentiment = (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const result = sentiment.analyze(text);
  let label = "Neutral";
  if (result.score > 0) label = "Positive";
  else if (result.score < 0) label = "Negative";

  res.json({
    score: result.score,
    comparative: result.comparative,
    sentiment: label,
    tokens: result.tokens,
    words: result.words,
    positive: result.positive,
    negative: result.negative
  });
};
