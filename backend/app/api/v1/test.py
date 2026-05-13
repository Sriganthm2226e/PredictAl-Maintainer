import os
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import socketio
import redis

from app.database import get_db
from app.models import Brand, Mention, SentimentResult, User
from app.auth.jwt import get_current_user
from app.ai.sentiment import analyze_sentiment
from app.alerts import check_and_trigger_alerts

router = APIRouter()

# Redis Configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Setup Socket.IO external emitter
sio_emitter = None
try:
    r = redis.Redis.from_url(REDIS_URL, socket_timeout=1)
    r.ping()
    sio_emitter = socketio.RedisManager(REDIS_URL, write_only=True)
except Exception:
    print("Warning: Redis broker offline, test.py will use direct memory Socket.IO emission.")

# Custom Mock Tweets for Testing
TEST_TWEETS = {
    "positive": [
        "Incredible performance with {brand}! Highly recommend to anyone looking for a reliable SaaS tool. 🚀",
        "The new update to {brand} is absolutely gorgeous. UX feels incredibly smooth! ✨",
        "Saved over 10 hours of manual work this week using {brand}. Simply brilliant customer support! 🙌"
    ],
    "neutral": [
        "Just checked out {brand} vs competitors. Interesting comparison of features.",
        "Does anyone know if {brand} supports multi-factor authentication?",
        "Reading the documentation of {brand} to integrate it with our local databases."
    ],
    "negative": [
        "Extremely disappointed with {brand}'s server reliability today. Getting constant 500 errors. 😡",
        "The latest update to {brand} completely broke my workflow. Absolute disaster. #fail",
        "CRITICAL: Is anyone else experiencing security leakage with {brand}? Very concerned."
    ]
}

@router.post("/inject", status_code=status.HTTP_201_CREATED)
def inject_mock_mention(
    brand_id: int,
    sentiment: str,
    toxicity: float = None,
    urgency: float = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Developer tool to inject a specific mock mention into the system.
    This runs through the complete backend database storage -> sentiment analysis
    -> real-time alert check -> Socket.IO Redis broadcast pipeline!
    """
    # Verify brand
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.owner_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
        
    sent_key = sentiment.lower()
    if sent_key not in TEST_TWEETS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sentiment must be positive, neutral, or negative"
        )
        
    # Pick a random tweet text matching selected sentiment
    raw_text = random.choice(TEST_TWEETS[sent_key])
    content = raw_text.format(brand=brand.name)
    
    # Store Mention
    mention = Mention(
        brand_id=brand_id,
        source="twitter",
        external_id=f"test_{random.randint(100000000, 999999999)}",
        content=content,
        url=f"https://twitter.com/dev_tester/status/{random.randint(100000000, 999999999)}",
        posted_at=datetime.utcnow(),
        fetched_at=datetime.utcnow()
    )
    db.add(mention)
    db.commit()
    db.refresh(mention)
    
    # Analyze sentiment
    ai_result = analyze_sentiment(content)
    
    # Override fields if custom values are provided (for testing specific alerts)
    if toxicity is not None:
        ai_result["toxicity"] = toxicity
    if urgency is not None:
        ai_result["urgency"] = urgency
        
    # Store Sentiment Result
    _sentiment_record = SentimentResult(
        mention_id=mention.id,
        sentiment=sent_key,
        confidence=ai_result["confidence"],
        emotion=ai_result["emotion"],
        toxicity=ai_result["toxicity"],
        urgency=ai_result["urgency"]
    )
    db.add(_sentiment_record)
    db.commit()
    
    # Trigger smart alert engine check
    check_and_trigger_alerts(db, brand_id, mention.id, ai_result)
    
    # Broadcast to Socket.IO channels
    payload = {
        "brand_id": brand.id,
        "brand_name": brand.name,
        "id": mention.id,
        "source": mention.source,
        "content": mention.content,
        "url": mention.url,
        "posted_at": mention.posted_at.isoformat(),
        "sentiment": {
            "sentiment": sent_key,
            "confidence": ai_result["confidence"],
            "emotion": ai_result["emotion"],
            "toxicity": ai_result["toxicity"],
            "urgency": ai_result["urgency"]
        }
    }

    if sio_emitter:
        try:
            sio_emitter.emit("live_mention", payload, room=f"brand_{brand_id}")
            sio_emitter.emit("live_mention", payload)
        except Exception as e:
            print(f"Error emitting via Redis: {e}")
    else:
        # direct memory emit!
        from app.websocket.router import sio
        import asyncio
        async def direct_emit():
            await sio.emit("live_mention", payload, room=f"brand_{brand_id}")
            await sio.emit("live_mention", payload)
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(direct_emit())
        except RuntimeError:
            asyncio.run(direct_emit())
        
    return {
        "status": "success",
        "injected_mention_id": mention.id,
        "sentiment_analysis": ai_result
    }

@router.get("/redis-health")
def check_redis_health():
    """
    Verifies that the Redis server broker is active and reachable.
    """
    try:
        r = redis.Redis.from_url(REDIS_URL, socket_timeout=2)
        r.ping()
        return {"status": "healthy", "broker": REDIS_URL}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "broker": REDIS_URL}
