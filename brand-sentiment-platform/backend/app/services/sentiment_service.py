from transformers import pipeline
import torch

# Initialize the sentiment analysis pipeline
# We'll use a model that handles 3-way sentiment (pos/neg/neu) if possible, 
# or map the 2-way SST-2 to our needs.
# For demo purposes, we'll use a multi-lingual or robust English model.
try:
    sentiment_pipeline = pipeline(
        "sentiment-analysis", 
        model="cardiffnlp/twitter-roberta-base-sentiment",
        device=0 if torch.cuda.is_available() else -1
    )
    # Mapping for twitter-roberta-base-sentiment:
    # LABEL_0 -> Negative
    # LABEL_1 -> Neutral
    # LABEL_2 -> Positive
    MAPPER = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}
except Exception as e:
    print(f"Error loading transformer model: {e}")
    sentiment_pipeline = None

def analyze_text(text: str):
    if not sentiment_pipeline:
        return {"sentiment": "neutral", "confidence": 0.5, "error": "Model not loaded"}
    
    try:
        results = sentiment_pipeline(text[:512]) # Truncate for model safety
        result = results[0]
        label = MAPPER.get(result['label'], result['label'].lower())
        score = result['score']
        
        return {
            "sentiment": label,
            "confidence": score,
            "text_preview": text[:100] + "..." if len(text) > 100 else text
        }
    except Exception as e:
        return {"sentiment": "neutral", "confidence": 0, "error": str(e)}
