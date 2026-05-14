// server/services/newsService.js
const axios = require('axios');

async function fetchNews(brand) {
  try {
    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY.includes('your_')) {
      // Mock news mentions if API key is not set
      return [
        {
          brand,
          platform: 'NewsAPI',
          content: `${brand} announces groundbreaking new product lineup for the upcoming quarter.`,
          author: 'TechCrunch',
          url: 'https://techcrunch.com/news/article1',
          createdAt: new Date(),
        },
        {
          brand,
          platform: 'NewsAPI',
          content: `Market analysis shows steady growth for ${brand} amidst industry shifts.`,
          author: 'Bloomberg',
          url: 'https://bloomberg.com/news/article2',
          createdAt: new Date(),
        }
      ];
    }
    const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(brand)}&apiKey=${process.env.NEWS_API_KEY}&pageSize=5`;
    const { data } = await axios.get(endpoint);
    if (!data?.articles) return [];
    return data.articles.map(a => ({
      brand,
      platform: 'NewsAPI',
      content: a.title + ' - ' + (a.description || ''),
      author: a.source?.name || 'News',
      url: a.url,
      createdAt: a.publishedAt || new Date(),
    }));
  } catch (err) {
    console.error('NewsAPI fetch error:', err.message);
    return [];
  }
}

module.exports = { fetchNews };
