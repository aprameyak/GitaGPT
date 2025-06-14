import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from dotenv import load_dotenv

from etl import load_verses

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Initialize models
embedding_model = SentenceTransformer(EMBEDDING_MODEL)

# Initialize Chroma
try:
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_collection(
        name="gita_verses",
        embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(model_name=EMBEDDING_MODEL)
    )
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error loading Chroma DB: {str(e)}")

gita_data = load_verses()

app = FastAPI(title="Bhagavad Gita Search API", version="1.0")

# Allow all origins for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

def get_verse_explanation(query: str, verse_text: str) -> str:
    """Generate explanation for a verse using Gemini"""
    prompt = f"Question: {query}\nVerse from Bhagavad Gita: {verse_text}\nExplain this verse in context of the question:"
    response = model.generate_content(prompt)
    return response.text

@app.post("/search/")
def search_verses(request: SearchRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Search using Chroma but keep response handling similar to original
    results = collection.query(
        query_texts=[request.query],
        n_results=request.top_k,
        include=["documents", "metadatas", "distances"]
    )
    
    formatted_results = []
    for i in range(len(results["ids"][0])):
        verse_id = int(results["ids"][0][i].replace("verse_", ""))
        verse = gita_data[verse_id]  # Keep using gita_data like original
        
        if all(key in verse for key in ("chapter_id", "verse_number", "text", "word_meanings")):
            explanation = get_verse_explanation(request.query, verse["text"])
            
            formatted_results.append({
                "rank": i + 1,
                "chapter": verse["chapter_id"],
                "verse": verse["verse_number"],
                "text": verse["text"],
                "interpretation": verse["word_meanings"],
                "ai_explanation": explanation,
                "distance": float(results["distances"][0][i])
            })

    return {"query": request.query, "matches": formatted_results}

@app.get("/metadata/")
def get_metadata():
    return {
        "title": app.title,
        "version": app.version,
        "endpoints": [
            {
                "path": "/search/",
                "method": "POST",
                "description": "Search for verses in the Bhagavad Gita",
                "request_body": {
                    "query": "string",
                    "top_k": "integer (default: 3)"
                },
                "response": {
                    "query": "string",
                    "matches": [
                        {
                            "rank": "integer",
                            "chapter": "integer",
                            "verse": "integer",
                            "text": "string",
                            "interpretation": "string",
                            "ai_explanation": "string",
                            "distance": "float"
                        }
                    ]
                }
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
