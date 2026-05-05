from fastapi import APIRouter, Depends
from app.services.sentiment_service import analyze_text
from pydantic import BaseModel

router = APIRouter()

class SentimentRequest(BaseModel):
    text: str

@router.post("/analyze")
async def analyze(request: SentimentRequest):
    result = analyze_text(request.text)
    return result
