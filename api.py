from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from transformers import pipeline
import json
import logging
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the model
qa_pipeline = pipeline("question-answering", model="timpal0l/mdeberta-v3-base-squad2")
llm = pipeline("text-generation", model="gpt2")

# Load verses from JSON with error handling
def load_verses():
    try:
        with open("verse.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        logging.error("verse.json file not found.")
        return {}
    except json.JSONDecodeError:
        logging.error("Error decoding JSON from verse.json.")
        return {}

gita_data = load_verses()

class VerseRequest(BaseModel):
    chapter: int
    verse: int

class SearchRequest(BaseModel):
    chapter: int
    verse: int
    query: str

@app.get("/")
def read_root():
    return {"message": "Welcome to GitaGPT API"}

@app.post("/get_verse")
def get_verse(request: VerseRequest):
    chapter = str(request.chapter)
    verse = str(request.verse)
    
    if chapter in gita_data and verse in gita_data[chapter]:
        logging.info(f"Verse found: Chapter {chapter}, Verse {verse}")
        return {"chapter": chapter, "verse": verse, "text": gita_data[chapter][verse]}
    else:
        raise HTTPException(status_code=404, detail="Verse not found")

@app.post("/search_verses")
async def search_verses(request: Request):
    try:
        request_body = await request.json()
        logging.info(f"Request body: {request_body}")
        search_request = SearchRequest(**request_body)
    except Exception as e:
        logging.error(f"Error parsing request body: {e}")
        raise HTTPException(status_code=400, detail="Invalid request body")

    chapter = str(search_request.chapter)
    verse = str(search_request.verse)
    query = search_request.query
    
    if chapter in gita_data and verse in gita_data[chapter]:
        verse_text = gita_data[chapter][verse]
        logging.info(f"Verse found: Chapter {chapter}, Verse {verse}")
        truncated_text = verse_text[:1000] 
        llm_response = llm(f"Summarize the meaning of: {truncated_text}", max_length=200)
        return {"chapter": chapter, "verse": verse, "summary": llm_response[0]['generated_text']}
    else:
        logging.error(f"Verse not found: Chapter {chapter}, Verse {verse}")
        raise HTTPException(status_code=404, detail="Verse not found")

@app.get("/answer")
def get_answer(question: str, context: str):
    result = qa_pipeline(question=question, context=context)
    return {"answer": result["answer"], "score": result["score"]}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)