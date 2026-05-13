import os
import asyncio
import logging
from datetime import datetime
from typing import List, Dict
import socketio

from celery import shared_task
from sqlalchemy.orm import Session

from app.models import Brand, Mention, SentimentResult
from app.database import SessionLocal
from app.services import fetch_tweets, fetch_reddit_posts, fetch_news_articles
from app.ai.sentiment import analyze_sentiment
from app.alerts import check_and_trigger_alerts

logger = logging.getLogger("social_fetch_task")

# Redis configuration for process signaling
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Setup Socket.IO external Redis manager for emitting real-time events to FastAPI server
try:
    sio_emitter = socketio.RedisManager(REDIS_URL, write_only=True)
except Exception as e:
    logger.warning(f"Failed to load Socket.IO Redis emitter inside Celery: {e}")
    sio_emitter = None

def fetch_tweets_sync(keyword: str, max_results: int = 10) -> List[Dict]:
    """Run the async fetch_tweets in a sync context for Celery."""
    return asyncio.run(fetch_tweets(keyword, max_results))

def fetch_reddit_sync(keyword: str, limit: int = 10) -> List[Dict]:
    """Run the async fetch_reddit_posts in a sync context for Celery."""
    return asyncio.run(fetch_reddit_posts(keyword, limit))

def fetch_news_sync(keyword: str, limit: int = 5) -> List[Dict]:
    """Run the async fetch_news_articles in a sync context for Celery."""
    return asyncio.run(fetch_news_articles(keyword, limit))

def _store_mention(db: Session, brand: Brand, payload: Dict) -> Mention:
    """Insert a Mention row (if not already present) and return it."""
    existing = (
        db.query(Mention)
        .filter(
            Mention.source == payload["source"],
            Mention.external_id == payload.get("external_id"),
        )
        .first()
    )
    if existing:
        return existing

    mention = Mention(
        brand_id=brand.id,
        source=payload["source"],
        external_id=payload.get("external_id"),
        content=payload["content"],
        url=payload.get("url"),
        posted_at=payload["posted_at"],
        fetched_at=datetime.utcnow(),
    )
    db.add(mention)
    db.commit()
    db.refresh(mention)
    return mention

def _store_sentiment(db: Session, mention: Mention, sentiment: dict) -> SentimentResult:
    """Persist SentimentResult linked to a Mention."""
    result = SentimentResult(
        mention_id=mention.id,
        sentiment=sentiment["label"],
        confidence=sentiment["confidence"],
        emotion=sentiment.get("emotion"),
        toxicity=sentiment.get("toxicity"),
        urgency=sentiment.get("urgency"),
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def fetch_and_process_brand_mentions(self, brand_id: int):
    """
    Celery entry‑point to fetch mentions for a brand, perform sentiment analysis,
    persist, broadcast events over WebSocket, and trigger safety alerts.
    """
    logger.info(f"Starting social mentions fetch pipeline for brand: {brand_id}")
    db: Session = SessionLocal()
    
    try:
        brand = db.query(Brand).filter(Brand.id == brand_id).first()
        if not brand:
            logger.error(f"Brand ID {brand_id} not found in database.")
            return f"Brand {brand_id} not found"
            
        keyword = brand.name
        
        # 1. Fetch from Twitter, Reddit, and News APIs
        tweets = fetch_tweets_sync(keyword, max_results=10)
        posts = fetch_reddit_sync(keyword, limit=10)
        news_articles = fetch_news_sync(keyword, limit=5)
        
        all_sources = tweets + posts + news_articles
        logger.info(f"Fetched {len(all_sources)} raw mentions for brand keyword: {keyword}")
        
        new_mentions_processed = 0
        for payload in all_sources:
            # 2. Store mention in Postgres/SQLite
            mention = _store_mention(db, brand, payload)
            
            # Check if we already had a sentiment result for this mention to avoid duplication
            existing_sentiment = db.query(SentimentResult).filter(SentimentResult.mention_id == mention.id).first()
            if existing_sentiment:
                continue
                
            # 3. Analyze with our VADER/Heuristic AI Sentiment model
            sentiment = analyze_sentiment(payload["content"])
            
            # 4. Store Sentiment Results
            _store_sentiment(db, mention, sentiment)
            new_mentions_processed += 1
            
            # 5. Check and trigger real-time system alerts
            check_and_trigger_alerts(db, brand.id, mention.id, sentiment)
            
            # 6. Broadcast Real-Time Socket.IO 'live_mention' Event to dashboard
            if sio_emitter:
                socket_payload = {
                    "brand_id": brand.id,
                    "brand_name": brand.name,
                    "id": mention.id,
                    "source": mention.source,
                    "content": mention.content,
                    "url": mention.url,
                    "posted_at": mention.posted_at.isoformat() if isinstance(mention.posted_at, datetime) else str(mention.posted_at),
                    "sentiment": {
                        "sentiment": sentiment["label"],
                        "confidence": sentiment["confidence"],
                        "emotion": sentiment["emotion"],
                        "toxicity": sentiment["toxicity"],
                        "urgency": sentiment["urgency"]
                    }
                }
                
                # Room-specific broadcast (to subscribed brand dashboards)
                sio_emitter.emit("live_mention", socket_payload, room=f"brand_{brand.id}")
                # Global real-time stream broadcast
                sio_emitter.emit("live_mention", socket_payload)
                
        logger.info(f"Pipeline complete! Stored and broadcasted {new_mentions_processed} new mentions for brand: {keyword}")
        return f"Processed {new_mentions_processed} mentions"
        
    except Exception as exc:
        logger.error(f"Pipeline failed for brand {brand_id}: {exc}", exc_info=True)
        db.rollback()
        # Retry task on failure with exponential backoff
        try:
            self.retry(exc=exc)
        except Exception:
            raise exc
    finally:
        db.close()
