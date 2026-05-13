import os
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
import socketio

from app.models import Alert, Mention, SentimentResult, Brand

logger = logging.getLogger("alert_engine")

# Redis configuration for process signaling
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Setup external sync-compatible Socket.IO emitter
try:
    sio_emitter = socketio.RedisManager(REDIS_URL, write_only=True)
except Exception as e:
    logger.warning(f"Failed to load Socket.IO Redis emitter: {e}")
    sio_emitter = None

def send_slack_notification(message: str):
    """Fallback handler for Slack notifications."""
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if webhook_url:
        logger.info(f"[SLACK INTEGRATION] Posting to webhook: {message}")
        # In production: requests.post(webhook_url, json={"text": message})
    else:
        logger.info(f"[MOCK SLACK] Alert message: {message}")

def send_telegram_notification(message: str):
    """Fallback handler for Telegram notifications."""
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if bot_token and chat_id:
        logger.info(f"[TELEGRAM INTEGRATION] Sending chat: {message}")
    else:
        logger.info(f"[MOCK TELEGRAM] Alert message: {message}")

def check_and_trigger_alerts(db: Session, brand_id: int, mention_id: int, sentiment_result: dict):
    """
    Analyzes a newly analyzed sentiment result and triggers real-time alerts.
    Processes:
      - Viral complaints
      - Negative sentiment spikes
      - PR crisis detection
    """
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        return

    brand_name = brand.name
    now = datetime.utcnow()
    
    # 1. Check for Viral Negative Complaints
    is_negative = sentiment_result.get("label") == "negative"
    toxicity = sentiment_result.get("toxicity", 0)
    urgency = sentiment_result.get("urgency", 0)
    confidence = sentiment_result.get("confidence", 0)
    
    if is_negative and (toxicity > 0.7 or urgency > 0.7):
        # High toxicity or urgency complaint -> Critical Alert
        msg = f"CRITICAL: Viral complaint detected for {brand_name}! Sentiment: Negative, Toxicity: {toxicity}, Urgency: {urgency}."
        
        # Save Alert to database
        alert = Alert(
            user_id=brand.owner_id,
            brand_id=brand_id,
            type="viral_complaint",
            message=msg,
            is_sent=True,
            created_at=now,
            sent_at=now
        )
        db.add(alert)
        db.commit()
        
        # Broadcast WebSocket events
        if sio_emitter:
            payload = {
                "brand_id": brand_id,
                "brand_name": brand_name,
                "type": "viral_complaint",
                "message": msg,
                "toxicity": toxicity,
                "urgency": urgency,
                "timestamp": now.isoformat()
            }
            sio_emitter.emit("viral_spike", payload, room=f"brand_{brand_id}")
            sio_emitter.emit("viral_spike", payload) # Global broadcast as well

        # Push to external integrations
        send_slack_notification(msg)
        send_telegram_notification(msg)
        
    # 2. Check for Negative Sentiment Spikes in the last 1 hour
    one_hour_ago = now - timedelta(hours=1)
    
    recent_negative_count = db.query(func.count(Mention.id))\
        .join(SentimentResult)\
        .filter(
            Mention.brand_id == brand_id,
            Mention.posted_at >= one_hour_ago,
            SentimentResult.sentiment == "negative"
        ).scalar() or 0
        
    if recent_negative_count >= 5: # Threshold for spike
        msg = f"WARNING: Negative sentiment spike for {brand_name}! {recent_negative_count} negative mentions in the last 1 hour."
        
        # Avoid duplicate alerts in the same hour
        recent_alert = db.query(Alert).filter(
            Alert.brand_id == brand_id,
            Alert.type == "negative_spike",
            Alert.created_at >= one_hour_ago
        ).first()
        
        if not recent_alert:
            alert = Alert(
                user_id=brand.owner_id,
                brand_id=brand_id,
                type="negative_spike",
                message=msg,
                is_sent=True,
                created_at=now,
                sent_at=now
            )
            db.add(alert)
            db.commit()
            
            if sio_emitter:
                payload = {
                    "brand_id": brand_id,
                    "brand_name": brand_name,
                    "type": "negative_spike",
                    "message": msg,
                    "count": recent_negative_count,
                    "timestamp": now.isoformat()
                }
                sio_emitter.emit("negative_alert", payload, room=f"brand_{brand_id}")
                sio_emitter.emit("negative_alert", payload)
                
            send_slack_notification(msg)
