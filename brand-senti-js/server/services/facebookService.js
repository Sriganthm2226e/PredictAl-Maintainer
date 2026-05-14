// server/services/facebookService.js
const axios = require('axios');

async function fetchFacebook(brand) {
  try {
    // Mock Facebook Graph API response or external API
    return [
      {
        brand,
        platform: 'Facebook',
        content: `Excited to see what ${brand} brings to the market next! Great quality.`,
        author: 'fb_user_102',
        url: 'https://facebook.com/post/102',
        createdAt: new Date(),
      },
      {
        brand,
        platform: 'Facebook',
        content: `Had some issues with ${brand} customer support today, hoping for a quick resolve.`,
        author: 'fb_user_405',
        url: 'https://facebook.com/post/405',
        createdAt: new Date(),
      }
    ];
  } catch (err) {
    console.error('Facebook fetch error:', err.message);
    return [];
  }
}

module.exports = { fetchFacebook };
