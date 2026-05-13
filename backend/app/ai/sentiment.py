from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize VADER Sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Emotion keywords maps
EMOTION_KEYWORDS = {
    "joy": ["love", "amazing", "great", "excellent", "favorite", "smooth", "shoutout", "kudos", "best", "🔥", "🙌", "🚀"],
    "anger": ["disappointed", "worst", "fail", "useless", "terrible", "crash", "garbage", "broken", "disaster", "angry"],
    "sadness": ["slow", "slower", "expensive", "costly", "unfortunately", "sad", "unfortunate", "lament"],
    "surprise": ["unbelievable", "wow", "shocking", "game changer", "innovative", "unexpected"],
    "fear": ["security", "vulnerability", "leak", "hacked", "scared", "danger", "warning", "critical"]
}

# Urgency keywords
URGENCY_KEYWORDS = ["immediately", "critical", "security", "broken", "crash", "urgent", "now", "disaster", "vulnerability"]

# Toxicity keywords
TOXICITY_KEYWORDS = ["garbage", "trash", "shitty", "worst", "useless", "fail", "idiot", "sucks", "disaster"]

def analyze_sentiment(text: str) -> dict:
    """
    Analyze text sentiment, emotion, toxicity, and urgency using VADER
    and enhanced rule-based heuristics.
    """
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]
    
    # Determine primary sentiment label
    if compound >= 0.05:
        sentiment_label = "positive"
        # Confidence scales from 0.5 to 1.0 based on intensity
        confidence = 0.5 + (compound * 0.5)
    elif compound <= -0.05:
        sentiment_label = "negative"
        confidence = 0.5 + (abs(compound) * 0.5)
    else:
        sentiment_label = "neutral"
        confidence = 1.0 - abs(compound)  # More neutral = higher confidence in neutral label
        
    # Heuristic Emotion detection
    detected_emotion = "neutral"
    max_matches = 0
    text_lower = text.lower()
    
    for emotion, keywords in EMOTION_KEYWORDS.items():
        matches = sum(1 for kw in keywords if kw in text_lower)
        if matches > max_matches:
            max_matches = matches
            detected_emotion = emotion
            
    # Default emotions if no keyword matches but strong sentiment exists
    if detected_emotion == "neutral":
        if sentiment_label == "positive":
            detected_emotion = "joy"
        elif sentiment_label == "negative":
            detected_emotion = "sadness" if compound > -0.5 else "anger"

    # Urgency score calculation (0.0 to 1.0)
    urgency_score = 0.1
    # Increase urgency based on negative sentiment severity
    if sentiment_label == "negative":
        urgency_score += abs(compound) * 0.4
    # Increase urgency for specific urgent words
    urgency_matches = sum(1 for kw in URGENCY_KEYWORDS if kw in text_lower)
    urgency_score += min(urgency_matches * 0.25, 0.5)
    urgency_score = min(urgency_score, 1.0)

    # Toxicity score calculation (0.0 to 1.0)
    toxicity_score = 0.05
    if sentiment_label == "negative":
        toxicity_score += abs(compound) * 0.3
    toxicity_matches = sum(1 for kw in TOXICITY_KEYWORDS if kw in text_lower)
    toxicity_score += min(toxicity_matches * 0.3, 0.65)
    toxicity_score = min(toxicity_score, 1.0)

    return {
        "label": sentiment_label,
        "confidence": round(confidence, 3),
        "emotion": detected_emotion,
        "toxicity": round(toxicity_score, 3),
        "urgency": round(urgency_score, 3)
    }
