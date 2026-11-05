import json

import numpy as np
from fastembed import TextEmbedding

VERSE_JSON = "verse.json"
EMBEDDINGS_FILE = "verse_embeddings.npy"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
MODEL_CACHE = "./models"


def load_verses():
    with open(VERSE_JSON, "r", encoding="utf-8") as file:
        verses = json.load(file)
    required_keys = ["chapter_id", "verse_number", "text", "word_meanings"]
    for verse in verses:
        if not all(key in verse for key in required_keys):
            raise ValueError(f"Invalid verse data: missing required keys in {verse}")
    return verses


def normalize(vectors):
    vectors = np.asarray(vectors, dtype=np.float32)
    return vectors / np.linalg.norm(vectors, axis=-1, keepdims=True)


def create_embeddings():
    print("🚀 Starting Bhagavad Gita Vectorization Job...")

    gita_data = load_verses()
    model = TextEmbedding(model_name=EMBEDDING_MODEL, cache_dir=MODEL_CACHE)
    # word_meanings is the English gloss, which matches English questions far better than the Sanskrit text
    embeddings = normalize(list(model.embed([verse["word_meanings"] for verse in gita_data])))
    np.save(EMBEDDINGS_FILE, embeddings)

    print(f"🎉 Vectorization Completed Successfully! ({len(embeddings)} verses)")


if __name__ == "__main__":
    create_embeddings()
