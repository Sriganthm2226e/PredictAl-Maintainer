import random
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict

# Mock news templates for industry articles
NEWS_TEMPLATES = [
    "Market Analysis: How {brand} is dominating the enterprise SaaS sector in 2026.",
    "Breaking: {brand} announces major partnership with top-tier cloud providers.",
    "Editorial: The rapid growth of {brand} shows no signs of slowing down.",
    "{brand} faces backlash from privacy advocates over recent policy changes.",
    "Tech Review: Why {brand} remains the undisputed market leader.",
    "Financial Report: {brand} quarterly earnings exceed Wall Street estimates by 15%.",
    "Special Report: Behind the scenes of {brand}'s new customer-success initiative.",
    "Opinion: Is {brand} losing its competitive edge in the developer space?"
]

NEWS_SOURCES = ["TechCrunch", "Wired", "Forbes", "The Verge", "Bloomberg", "Reuters", "CNBC"]

async def fetch_news_articles(keyword: str, limit: int = 5) -> List[Dict]:
    """
    Asynchronously fetch news articles mentioning the brand.
    Supports high-quality mock data generator.
    """
    # Simulate API latency
    await asyncio.sleep(random.uniform(0.4, 1.0))
    
    articles = []
    for i in range(min(limit, len(NEWS_TEMPLATES))):
        source = random.choice(NEWS_SOURCES)
        template = random.choice(NEWS_TEMPLATES)
        title = template.format(brand=keyword)
        
        # News articles are typically older than live tweets, say within 5 days
        time_offset = random.randint(60, 7200)  # minutes ago
        posted_at = datetime.utcnow() - timedelta(minutes=time_offset)
        
        article = {
            "source": "news",
            "external_id": f"nw_{random.randint(100000, 999999)}",
            "content": title + " In-depth coverage on how this impacts global development.",
            "url": f"https://{source.lower().replace(' ', '')}.com/article/{random.randint(100000, 999999)}",
            "posted_at": posted_at,
            "publisher": source,
            "author": f"Journalist {random.randint(1, 20)}",
        }
        articles.append(article)
        
    return articles
