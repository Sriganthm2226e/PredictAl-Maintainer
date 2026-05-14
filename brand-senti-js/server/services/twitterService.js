// server/services/twitterService.js
const axios = require('axios');

/**
 * Fetch recent tweets containing the brand keyword.
 * Returns an array of mention objects compatible with the Mention model.
 */
async function fetchTwitter(brand) {
  const endpoint = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(brand)}&tweet.fields=author_id,created_at`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` },
    });
    if (!data?.data) return [];
    return data.data.map(t => ({
      brand,
      platform: 'Twitter',
      content: t.text,
      author: t.author_id,
      url: `https://twitter.com/i/web/status/${t.id}`,
      createdAt: t.created_at,
    }));
  } catch (err) {
    console.error('Twitter fetch error:', err.message);
    return [];
  }
}

module.exports = { fetchTwitter };
