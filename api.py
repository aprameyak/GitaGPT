import faiss
import uvicorn
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os

from etl import load_verses

FAISS_INDEX_FILE = "gita_faiss.index"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

model = SentenceTransformer(EMBEDDING_MODEL)

try:
    index = faiss.read_index(FAISS_INDEX_FILE)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error loading FAISS index: {str(e)}")

gita_data = load_verses()

app = FastAPI(title="Bhagavad Gita Search API", version="1.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

@app.options("/search/")
def options_search():
    return {"Allow": "POST, OPTIONS"}

@app.post("/search/")
def search_verses(request: SearchRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    query_embedding = model.encode([request.query]).astype(np.float32)

    distances, indices = index.search(query_embedding, request.top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx >= len(gita_data):
            continue
        verse = gita_data[idx]
        if all(key in verse for key in ("chapter_id", "verse_number", "text", "word_meanings")):
            results.append({
                "rank": i + 1,
                "chapter": verse["chapter_id"],
                "verse": verse["verse_number"],
                "text": verse["text"],
                "interpretation": verse["word_meanings"],
                "distance": float(distances[0][i])
            })

    return {"query": request.query, "matches": results}

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
                            "distance": "float"
                        }
                    ]
                }
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
