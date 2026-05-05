from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MentionBase(BaseModel):
    username: str
    content: str
    platform: str
    sentiment: str
    engagement: int
    timestamp: datetime

class MentionCreate(MentionBase):
    pass

class Mention(MentionBase):
    id: str

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_mentions: int
    positive_count: int
    negative_count: int
    neutral_count: int
    engagement_total: int
