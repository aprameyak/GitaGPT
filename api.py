import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import numpy as np
from fastembed import TextEmbedding
import google.generativeai as genai
from dotenv import load_dotenv
import json

from etl import EMBEDDING_MODEL, EMBEDDINGS_FILE, MODEL_CACHE, normalize

# Load environment variables
load_dotenv()

def load_verses():
    """Load verses from JSON file"""
    try:
        with open("verse.json", "r", encoding="utf-8") as file:
            verses = json.load(file)
        return verses
    except Exception as e:
        print(f"Error loading verses: {e}")
        return []

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("WARNING: GOOGLE_API_KEY not found, AI explanations will be disabled")
    api_key = None

if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
    except Exception as e:
        print(f"Error configuring Gemini: {e}")
        model = None
else:
    model = None

# Initialize models
try:
    embedding_model = TextEmbedding(model_name=EMBEDDING_MODEL, cache_dir=MODEL_CACHE)
except Exception as e:
    print(f"Error loading embedding model: {e}")
    embedding_model = None

# Load precomputed verse embeddings (built by etl.py)
try:
    verse_embeddings = np.load(EMBEDDINGS_FILE)
except Exception as e:
    print(f"Error loading verse embeddings: {str(e)}")
    verse_embeddings = None

gita_data = load_verses()

app = FastAPI(title="Bhagavad Gita Search API", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

def get_verse_explanation(query: str, verse_text: str) -> str:
    """Generate explanation for a verse using Gemini"""
    if not model:
        return "AI explanations are currently unavailable."
    
    try:
        prompt = f"Question: {query}\nVerse from Bhagavad Gita: {verse_text}\nExplain this verse in context of the question:"
        response = model.generate_content(prompt)
        return response.text if response.text else "Unable to generate explanation at this time."
    except Exception as e:
        print(f"Error generating explanation: {str(e)}")
        return "Unable to generate explanation at this time."

@app.options("/search/")
async def options_search():
    return {"message": "OK"}

@app.post("/search/")
def search_verses(request: SearchRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if embedding_model is None or verse_embeddings is None or not gita_data:
        raise HTTPException(status_code=500, detail="Database not available")

    try:
        # Cosine similarity against the precomputed verse embeddings
        query_vector = normalize(list(embedding_model.embed([request.query])))[0]
        similarities = verse_embeddings @ query_vector
        top_k = max(1, min(request.top_k, 10))
        top_ids = np.argsort(-similarities)[:top_k]

        formatted_results = []
        for i, verse_id in enumerate(top_ids):
            try:
                verse_id = int(verse_id)
                if verse_id < len(gita_data):
                    verse = gita_data[verse_id]
                    
                    if all(key in verse for key in ("chapter_id", "verse_number", "text", "word_meanings")):
                        explanation = get_verse_explanation(request.query, verse["text"])
                        
                        formatted_results.append({
                            "rank": i + 1,
                            "chapter": verse["chapter_id"],
                            "verse": verse["verse_number"],
                            "text": verse["text"],
                            "interpretation": verse["word_meanings"],
                            "ai_explanation": explanation,
                            "distance": float(1 - similarities[verse_id])
                        })
            except Exception as e:
                print(f"Error processing result {i}: {e}")
                continue

        return {"query": request.query, "matches": formatted_results}
    
    except Exception as e:
        print(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during search")

@app.get("/")
def root():
    return {"message": "Bhagavad Gita Search API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "gitagpt-api"}

@app.get("/metadata/")
def get_metadata():
    return {
        "title": app.title,
        "version": app.version,
        "status": "running"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
