import re

def clean_text(text: str):
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Remove user @ references and '#' from hashtags
    text = re.sub(r'\@\w+|\#','', text)
    # Remove emojis (basic range)
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Remove extra whitespace
    text = " ".join(text.split())
    return text
