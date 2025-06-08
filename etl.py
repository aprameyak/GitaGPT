import json
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions

VERSE_JSON = "verse.json"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

model = SentenceTransformer(EMBEDDING_MODEL)

def load_verses():
    with open(VERSE_JSON, "r", encoding="utf-8") as file:
        verses = json.load(file)
    required_keys = ["chapter_id", "verse_number", "text", "word_meanings"]
    for verse in verses:
        if not all(key in verse for key in required_keys):
            raise ValueError(f"Invalid verse data: missing required keys in {verse}")
    return verses

def create_chroma_db():
    print("🚀 Starting Bhagavad Gita Vectorization Job...")
    
    # Load verses like original
    gita_data = load_verses()
    
    # Initialize Chroma
    client = chromadb.PersistentClient(path="./chroma_db")
    
    # Create collection with same embedding model
    collection = client.get_or_create_collection(
        name="gita_verses",
        embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(model_name=EMBEDDING_MODEL)
    )
    
    # Add documents - keeping verse IDs sequential like FAISS
    ids = [f"verse_{i}" for i in range(len(gita_data))]
    texts = [verse["text"] for verse in gita_data]
    
    # Add to collection
    collection.add(
        ids=ids,
        documents=texts
    )
    
    print("🎉 Vectorization Completed Successfully!")

if __name__ == "__main__":
    create_chroma_db()
