import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Brand Sentiment Platform API", version="0.1.0")

# Precise CORS allowed origins to resolve Starlette/Credentials conflicts
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from app.api.v1 import router as v1_router
app.include_router(v1_router, prefix="/api/v1")

# Include WebSocket (Socket.IO) application
from app.websocket.router import socket_app as ws_app
app.mount("/ws", ws_app)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/v1/health")
async def health_check_v1():
    return {"status": "ok"}
