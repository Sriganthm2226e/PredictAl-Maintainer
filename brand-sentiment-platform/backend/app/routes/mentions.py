from fastapi import APIRouter
from app.services.data_collector import get_mock_mentions
from typing import Optional

router = APIRouter()

@router.get("/")
async def get_mentions(brand: str, limit: int = 10, platform: Optional[str] = None):
    mentions = get_mock_mentions(brand, limit, platform)
    return {"brand": brand, "mentions": mentions}

@router.get("/stats")
async def get_dashboard_stats(brand: str):
    # Mock stats for now
    return {
        "total_mentions": 1250,
        "sentiment_distribution": {
            "positive": 650,
            "neutral": 400,
            "negative": 200
        },
        "engagement": 5400,
        "trends": [
            {"date": "2024-03-20", "mentions": 45, "positive": 30, "negative": 5, "neutral": 10},
            {"date": "2024-03-21", "mentions": 52, "positive": 35, "negative": 7, "neutral": 10},
            {"date": "2024-03-22", "mentions": 48, "positive": 28, "negative": 8, "neutral": 12},
            {"date": "2024-03-23", "mentions": 65, "positive": 45, "negative": 10, "neutral": 10},
            {"date": "2024-03-24", "mentions": 80, "positive": 55, "negative": 15, "neutral": 10},
            {"date": "2024-03-25", "mentions": 120, "positive": 80, "negative": 25, "neutral": 15},
            {"date": "2024-03-26", "mentions": 95, "positive": 60, "negative": 20, "neutral": 15},
        ],
        "top_keywords": [
            {"text": "innovation", "count": 156},
            {"text": "fast", "count": 98},
            {"text": "reliable", "count": 87},
            {"text": "expensive", "count": 45},
            {"text": "support", "count": 34}
        ]
    }
