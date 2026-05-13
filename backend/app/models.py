from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Relationships
    brands = relationship("Brand", back_populates="owner")

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="brands")
    mentions = relationship("Mention", back_populates="brand", cascade="all, delete-orphan")

class Mention(Base):
    __tablename__ = "mentions"
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    source = Column(String, nullable=False)  # e.g., "twitter", "reddit"
    external_id = Column(String, nullable=True)  # ID from source platform
    content = Column(Text, nullable=False)
    url = Column(String, nullable=True)
    posted_at = Column(DateTime, nullable=False)
    fetched_at = Column(DateTime, default=datetime.utcnow)
    brand = relationship("Brand", back_populates="mentions")
    sentiment = relationship("SentimentResult", uselist=False, back_populates="mention", cascade="all, delete-orphan")

class SentimentResult(Base):
    __tablename__ = "sentiment_results"
    id = Column(Integer, primary_key=True, index=True)
    mention_id = Column(Integer, ForeignKey("mentions.id"), nullable=False, unique=True)
    sentiment = Column(String, nullable=False)  # "positive", "neutral", "negative"
    confidence = Column(Float, nullable=False)
    emotion = Column(String, nullable=True)  # optional emotion label
    toxicity = Column(Float, nullable=True)
    urgency = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    mention = relationship("Mention", back_populates="sentiment")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    type = Column(String, nullable=False)  # e.g., "negative_spike"
    message = Column(Text, nullable=False)
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
