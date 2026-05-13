from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Brand, Mention, SentimentResult, User
from app.auth.jwt import get_current_user

router = APIRouter()

@router.get("/")
def get_mentions(
    brand_id: int,
    source: Optional[str] = None,
    sentiment: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure brand belongs to current user
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.owner_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    
    # Base query joining Mention and SentimentResult
    query = db.query(Mention).join(SentimentResult).filter(Mention.brand_id == brand_id)
    
    # Apply source filter (e.g. twitter, reddit)
    if source:
        query = query.filter(Mention.source == source.lower())
        
    # Apply sentiment filter (e.g. positive, neutral, negative)
    if sentiment:
        query = query.filter(SentimentResult.sentiment == sentiment.lower())
        
    # Get mentions sorted by most recently posted
    query = query.order_by(Mention.posted_at.desc())
    mentions = query.limit(limit).all()
    
    # Structure the payload
    results = []
    for mention in mentions:
        results.append({
            "id": mention.id,
            "source": mention.source,
            "content": mention.content,
            "url": mention.url,
            "posted_at": mention.posted_at,
            "fetched_at": mention.fetched_at,
            "sentiment": {
                "sentiment": mention.sentiment.sentiment,
                "confidence": mention.sentiment.confidence,
                "emotion": mention.sentiment.emotion,
                "toxicity": mention.sentiment.toxicity,
                "urgency": mention.sentiment.urgency,
            }
        })
        
    return {"brand_id": brand_id, "brand_name": brand.name, "mentions": results}

@router.get("/stats")
def get_brand_stats(
    brand_id: int,
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure brand belongs to current user
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.owner_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )

    # Date filter threshold
    since_date = datetime.utcnow() - timedelta(days=days)

    # 1. Total Mentions count
    total_mentions = db.query(func.count(Mention.id)).filter(
        Mention.brand_id == brand_id,
        Mention.posted_at >= since_date
    ).scalar() or 0

    # 2. Sentiment distribution
    sentiment_counts = db.query(
        SentimentResult.sentiment, func.count(SentimentResult.id)
    ).join(Mention).filter(
        Mention.brand_id == brand_id,
        Mention.posted_at >= since_date
    ).group_by(SentimentResult.sentiment).all()

    sentiment_distribution = {"positive": 0, "neutral": 0, "negative": 0}
    for item in sentiment_counts:
        label, count = item
        if label in sentiment_distribution:
            sentiment_distribution[label] = count

    # 3. Emotion distribution
    emotion_counts = db.query(
        SentimentResult.emotion, func.count(SentimentResult.id)
    ).join(Mention).filter(
        Mention.brand_id == brand_id,
        Mention.posted_at >= since_date
    ).group_by(SentimentResult.emotion).all()

    emotion_distribution = {}
    for item in emotion_counts:
        emotion, count = item
        if emotion:
            emotion_distribution[emotion] = count

    # 4. Averages: confidence, toxicity, urgency
    averages = db.query(
        func.avg(SentimentResult.confidence),
        func.avg(SentimentResult.toxicity),
        func.avg(SentimentResult.urgency)
    ).join(Mention).filter(
        Mention.brand_id == brand_id,
        Mention.posted_at >= since_date
    ).first()

    avg_confidence, avg_toxicity, avg_urgency = averages
    
    # 5. Dynamic Trend line (grouped by date)
    trend_query = db.query(
        func.date(Mention.posted_at).label("day"),
        func.count(Mention.id).label("total"),
        func.sum(func.case((SentimentResult.sentiment == "positive", 1), else_=0)).label("pos"),
        func.sum(func.case((SentimentResult.sentiment == "negative", 1), else_=0)).label("neg"),
        func.sum(func.case((SentimentResult.sentiment == "neutral", 1), else_=0)).label("neu")
    ).join(SentimentResult).filter(
        Mention.brand_id == brand_id,
        Mention.posted_at >= since_date
    ).group_by(func.date(Mention.posted_at)).order_by("day").all()

    trends = []
    for day_item in trend_query:
        day, total, pos, neg, neu = day_item
        trends.append({
            "date": day,
            "mentions": total,
            "positive": pos or 0,
            "negative": neg or 0,
            "neutral": neu or 0
        })

    return {
        "brand_id": brand_id,
        "brand_name": brand.name,
        "total_mentions": total_mentions,
        "sentiment_distribution": sentiment_distribution,
        "emotion_distribution": emotion_distribution,
        "averages": {
            "confidence": round(avg_confidence, 2) if avg_confidence else 0,
            "toxicity": round(avg_toxicity, 2) if avg_toxicity else 0,
            "urgency": round(avg_urgency, 2) if avg_urgency else 0,
        },
        "trends": trends
    }
