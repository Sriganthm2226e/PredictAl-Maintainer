import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load database URL from environment (fallback to local SQLite for quick dev)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# Create engine with appropriate pool settings for PostgreSQL (or SQLite)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,
)

# Base class for models
Base = declarative_base()

# Session factory for DB interactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI dependency that provides a DB session and ensures cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
