import random
from datetime import datetime, timedelta

PLATFORMS = ["Twitter", "Reddit", "Instagram", "LinkedIn"]
SENTIMENTS = ["positive", "neutral", "negative"]

MOCK_POSTS = [
    "I absolutely love the new features of {brand}! Truly innovative.",
    "Just tried {brand} and it's okay, but could be better.",
    "Very disappointed with {brand}'s customer service today. #fail",
    "{brand} is changing the game in the industry. Highly recommend.",
    "Does anyone know how to fix the login issue with {brand}?",
    "The latest update of {brand} is causing my phone to overheat.",
    "Amazing experience with {brand}. Best in the market!",
    "{brand} vs its competitors - who wins? My thoughts inside.",
    "Is it just me or is {brand} getting more expensive every year?",
    "I've been using {brand} for 5 years and I'm never switching."
]

USERNAMES = ["tech_guru", "daily_user99", "brand_fanatic", "angry_customer", "industry_insider", "marketing_pro"]

def get_mock_mentions(brand: str, limit: int = 10, platform: str = None):
    mentions = []
    for i in range(limit):
        plat = platform if platform else random.choice(PLATFORMS)
        text_template = random.choice(MOCK_POSTS)
        text = text_template.format(brand=brand)
        
        # Simple sentiment logic based on mock templates
        if "love" in text or "Amazing" in text or "innovative" in text:
            sentiment = "positive"
        elif "disappointed" in text or "fail" in text or "overheat" in text:
            sentiment = "negative"
        else:
            sentiment = "neutral"
            
        mention = {
            "id": f"m_{i}",
            "username": random.choice(USERNAMES),
            "content": text,
            "platform": plat,
            "sentiment": sentiment,
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat(),
            "engagement": random.randint(10, 1000)
        }
        mentions.append(mention)
    
    return sorted(mentions, key=lambda x: x['timestamp'], reverse=True)
