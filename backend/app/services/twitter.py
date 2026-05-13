import random
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict

# Mock tweet templates for real-looking social data
TWEET_TEMPLATES = [
    "I'm absolutely loving the new features of {brand}! This is a game changer. 🔥",
    "Just tried out {brand} for the first time. Honestly, it's pretty mid. Could use some UI improvements.",
    "Extremely disappointed with {brand}'s support team. My ticket has been open for 4 days! #worstservice #fail",
    "The performance on the latest {brand} build is outstanding. Feels incredibly smooth now. 🚀",
    "Is anyone else experiencing constant crashes with the new {brand} update?",
    "Can't imagine my daily workflow without {brand} anymore. Kudos to the development team!",
    "Is it just me, or did {brand} get a lot slower after today's update?",
    "Shoutout to {brand} for resolving my billing issue within 10 minutes. Incredible customer service! 🙌",
    "Is {brand} worth the price tag, or should I stick to open-source alternatives?",
    "This new version of {brand} is a total disaster. Completely broke my setup."
]

USERNAMES = [
    "tech_pioneer", "dev_guru", "code_ninja", "angry_user99", "brand_advocate",
    "cloud_architect", "system_analyst", "digital_native", "pixel_perfect", "beta_tester"
]

async def fetch_tweets(keyword: str, max_results: int = 10) -> List[Dict]:
    """
    Asynchronously fetch tweets matching the given keyword/brand.
    Supports a mock generator for demo/development purposes.
    """
    # Simulate API latency
    await asyncio.sleep(random.uniform(0.2, 0.8))
    
    tweets = []
    # Generate mock tweets
    for i in range(min(max_results, len(TWEET_TEMPLATES))):
        username = random.choice(USERNAMES)
        template = random.choice(TWEET_TEMPLATES)
        text = template.format(brand=keyword)
        
        # Calculate a random past timestamp within 24 hours
        time_offset = random.randint(5, 1440)  # minutes ago
        posted_at = datetime.utcnow() - timedelta(minutes=time_offset)
        
        tweet = {
            "source": "twitter",
            "external_id": f"tw_{random.randint(100000000, 999999999)}",
            "content": text,
            "url": f"https://twitter.com/{username}/status/{random.randint(1000000000000, 9999999999999)}",
            "posted_at": posted_at,
            "username": username,
            "likes": random.randint(0, 500),
            "retweets": random.randint(0, 150),
        }
        tweets.append(tweet)
        
    return tweets
