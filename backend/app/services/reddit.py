import random
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict

# Mock Reddit templates
REDDIT_TEMPLATES = [
    "[Discussion] Is {brand} actually the best tool in its category, or is it just clever marketing?",
    "Why I switched from my old workflow to {brand} and why you should too. (Detailed Review)",
    "Warning: The latest {brand} version has a critical security vulnerability. Upgrade immediately!",
    "My experience with {brand} after 30 days of intensive daily use. Ask me anything!",
    "Is anyone else getting a 500 internal server error when trying to fetch data from {brand}?",
    "{brand} pricing is getting ridiculously high. Any good open-source alternatives?",
    "Shoutout to the creators of {brand}, this tool saved me 20 hours of work this week alone!",
    "Unpopular opinion: {brand}'s design is completely unintuitive and frustrating to navigate.",
    "How to integrate {brand} with custom automation pipelines? (Tutorial/Guide)",
    "Highly disappointed with the direction {brand} is taking. Feature bloat is real."
]

SUBREDDITS = [
    "r/technology", "r/programming", "r/sysadmin", "r/software", "r/webdev",
    "r/saas", "r/startups", "r/productivity", "r/geeks", "r/devops"
]

async def fetch_reddit_posts(keyword: str, limit: int = 10) -> List[Dict]:
    """
    Asynchronously fetch Reddit posts/comments matching the brand keyword.
    Supports high-quality mock data generator.
    """
    # Simulate network/API latency
    await asyncio.sleep(random.uniform(0.3, 0.9))
    
    posts = []
    for i in range(min(limit, len(REDDIT_TEMPLATES))):
        subreddit = random.choice(SUBREDDITS)
        template = random.choice(REDDIT_TEMPLATES)
        text = template.format(brand=keyword)
        
        time_offset = random.randint(10, 2880)  # minutes ago (up to 48 hours)
        posted_at = datetime.utcnow() - timedelta(minutes=time_offset)
        
        post = {
            "source": "reddit",
            "external_id": f"re_{random.randint(100000, 999999)}",
            "content": text,
            "url": f"https://reddit.com/{subreddit}/comments/{random.randint(100000, 999999)}",
            "posted_at": posted_at,
            "subreddit": subreddit,
            "score": random.randint(-5, 2000),
            "num_comments": random.randint(0, 150),
        }
        posts.append(post)
        
    return posts
