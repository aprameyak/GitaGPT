from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from transformers import pipeline
import json
import logging
import uvicorn
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load Models
qa_pipeline = pipeline("question-answering", model="timpal0l/mdeberta-v3-base-squad2")
llm = pipeline("text-generation", model="gpt2")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAISS Index
VECTOR_DB_FILE = "gita_faiss.index"
index = faiss.read_index(VECTOR_DB_FILE)

# Load verses from JSON
VERSE_JSON = "verse.json"
def load_verses():
    try:
        with open(VERSE_JSON, "r", encoding="utf-8") as file:
            return json.load(file)
    except Exception as e:
        logging.error(f"Error loading verses: {e}")
        return []

gita_data = load_verses()

class SearchRequest(BaseModel):
    query: str
    k: int = 5  # Default to top 5 results

@app.get("/")
def read_root():
    return {"message": "Welcome to GitaGPT API"}

@app.post("/search_verses")
def search_verses(request: SearchRequest):
    query_embedding = embedding_model.encode([request.query])
    distances, indices = index.search(np.array(query_embedding), request.k)
    
    results = []
    for i in indices[0]:
        if i < len(gita_data):
            results.append(gita_data[i])
    
    return {"query": request.query, "results": results}

@app.get("/answer")
def get_answer(question: str, context: str):
    result = qa_pipeline(question=question, context=context)
    return {"answer": result["answer"], "score": result["score"]}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)