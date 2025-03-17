import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

VERSE_JSON = "verse.json"
VECTOR_DB_FILE = "gita_faiss.index"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

model = SentenceTransformer(EMBEDDING_MODEL)

def load_verses():
    with open(VERSE_JSON, "r", encoding="utf-8") as file:
        verses = json.load(file)
    return verses

def create_vector_db():
    gita_data = load_verses()

    texts = [entry["text"] for entry in gita_data]
    embeddings = model.encode(texts)
    
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    faiss.write_index(index, VECTOR_DB_FILE)
    print(f"📥 Vector database saved to {VECTOR_DB_FILE}")

def search_verses(query, k=5):
    index = faiss.read_index(VECTOR_DB_FILE)
    query_embedding = model.encode([query])

    distances, indices = index.search(np.array(query_embedding), k)
    
    gita_data = load_verses()

    results = [{"chapter": gita_data[i]["chapter_number"], "verse": gita_data[i]["verse_number"], "text": gita_data[i]["text"]} for i in indices[0]]
    return results

if __name__ == "__main__":
    print("🚀 Starting Bhagavad Gita Vectorization Job...")
    create_vector_db()
    print("🎉 Vectorization Completed Successfully!")
