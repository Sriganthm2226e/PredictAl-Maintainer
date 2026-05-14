// server/services/instagramService.js
const axios = require('axios');
/**
 * Fetch recent Instagram posts containing the brand keyword.
 * Uses Instagram Graph API with a long‑lived access token.
 */
async function fetchInstagram(brand) {
  const endpoint = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;
  try {
    const { data } = await axios.get(endpoint);
    if (!data?.data) return [];
    // Filter captions that contain the brand keyword (case‑insensitive)
    const filtered = data.data.filter(p => p.caption && p.caption.toLowerCase().includes(brand.toLowerCase()));
    return filtered.map(p => ({
      brand,
      platform: 'Instagram',
      content: p.caption,
      author: 'instagram_user',
      url: p.permalink,
      createdAt: p.timestamp,
    }));
  } catch (err) {
    console.error('Instagram fetch error:', err.message);
    return [];
  }
}

module.exports = { fetchInstagram };
