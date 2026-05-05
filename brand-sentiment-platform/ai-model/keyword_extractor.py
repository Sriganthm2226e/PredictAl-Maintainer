from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

def extract_keywords(texts, top_n=10):
    if not texts:
        return []
    
    vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    feature_names = vectorizer.get_feature_names_out()
    sums = tfidf_matrix.sum(axis=0)
    
    data = []
    for col, term in enumerate(feature_names):
        data.append({'text': term, 'count': int(sums[0, col] * 100)}) # Scaled for "count" feel
        
    return sorted(data, key=lambda x: x['count'], reverse=True)[:top_n]
