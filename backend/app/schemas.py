from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_admin: bool
    model_config = {"from_attributes": True}

class BrandBase(BaseModel):
    name: str
    description: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandOut(BrandBase):
    id: int
    owner_id: int
    model_config = {"from_attributes": True}

class MentionBase(BaseModel):
    source: str
    content: str
    url: Optional[str] = None
    posted_at: str  # ISO datetime string

class MentionCreate(MentionBase):
    brand_id: int

class MentionOut(MentionBase):
    id: int
    brand_id: int
    fetched_at: str
    model_config = {"from_attributes": True}

class SentimentResultOut(BaseModel):
    id: int
    mention_id: int
    sentiment: str
    confidence: float
    emotion: Optional[str] = None
    toxicity: Optional[float] = None
    urgency: Optional[float] = None
    model_config = {"from_attributes": True}

class AlertOut(BaseModel):
    id: int
    user_id: int
    brand_id: int
    type: str
    message: str
    is_sent: bool
    created_at: str
    sent_at: Optional[str] = None
    model_config = {"from_attributes": True}
