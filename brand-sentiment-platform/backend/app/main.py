from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sentiment, mentions

app = FastAPI(title="BrandSentiment AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(mentions.router, prefix="/api/mentions", tags=["Mentions"])

@app.get("/")
async def root():
    return {"message": "Welcome to BrandSentiment AI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
