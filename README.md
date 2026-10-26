# GitaGPT

GitaGPT lets you ask a question in plain language and get back the closest-matching Bhagavad Gita verses, each with its word meanings and a short Gemini-written explanation tied to your question.

Live site: https://gita-gpt-two.vercel.app

## Example

The frontend calls one endpoint on the FastAPI backend:

```bash
curl -X POST http://localhost:8000/search/ \
  -H "Content-Type: application/json" \
  -d '{"query": "How should I act without worrying about results?", "top_k": 3}'
```

The response lists the matches in rank order. Each match has these fields:

```
rank             1-based position
chapter, verse   chapter_id and verse_number from verse.json
text             the verse in Sanskrit
interpretation   word-by-word meanings
ai_explanation   Gemini's explanation of the verse in light of the query
distance         ChromaDB distance (lower is closer)
```

## Features

- Semantic search over the 701 entries in `verse.json` using a ChromaDB collection and the `all-MiniLM-L6-v2` sentence-transformer model
- For each match: chapter and verse number, the Sanskrit text, and word meanings
- A per-verse explanation from Google Gemini (`gemini-pro`) that relates the verse to your question. Without `GOOGLE_API_KEY` the API still returns verses, with a placeholder explanation.
- A Next.js frontend that shows each match with a relevance percentage computed as `1 - distance`
- Dockerfile and `render.yaml` for the backend, and `vercel.json` for the frontend

## Tech stack

- Backend: Python, FastAPI, Uvicorn, ChromaDB, sentence-transformers, `google-generativeai`
- Frontend: Next.js 14, React 18, Tailwind CSS
- Deployment: Docker on Render (backend), Vercel (frontend)

## Getting started

Prerequisites: Python 3.10 or newer (CI uses 3.11), and Node.js 18 or newer.

Environment variables:

- `GOOGLE_API_KEY` (backend, optional): Gemini key for the explanations. It can go in a `.env` file at the repo root.
- `NEXT_PUBLIC_API_URL` (frontend, optional): backend base URL. If unset, the frontend calls the hosted API at `https://gitagpt-api.onrender.com`.

Backend:

```bash
pip install -r requirements.txt
python etl.py      # embeds verse.json into ./chroma_db (run once)
python api.py      # http://localhost:8000
```

Frontend:

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev   # http://localhost:3000
```

With Docker, the image runs `etl.py` at build time and serves on `$PORT`:

```bash
docker build -t gitagpt .
docker run -p 8000:8000 -e PORT=8000 -e GOOGLE_API_KEY=<your key> gitagpt
```

The Dockerfile uses `python:3.9-slim`, but `requirements.txt` asks for `numpy>=2.1`, which needs Python 3.10 or newer. If the image build fails at `pip install`, raise the base image version.

There are no automated tests. CI installs the backend requirements and builds the frontend.

## How it works

- `etl.py` loads `verse.json`, checks that each entry has `chapter_id`, `verse_number`, `text`, and `word_meanings`, and adds every verse's `text` to the `gita_verses` collection in a persistent ChromaDB store at `./chroma_db`. Each verse gets the ID `verse_<index>`. Chroma's `SentenceTransformerEmbeddingFunction` computes the embeddings with `all-MiniLM-L6-v2`.
- `api.py` opens the same collection. `POST /search/` embeds the query, takes the `top_k` nearest verses, looks each one up in `verse.json` by index, and calls Gemini once per match for the explanation. `GET /health` and `GET /metadata/` return status information.
- `frontend/app/page.tsx` is the whole UI: a search box that posts to `${NEXT_PUBLIC_API_URL}/search/` with `top_k: 3` and renders the matches.

Notes:

- The `text` field that gets embedded is the Sanskrit verse in Devanagari, while `all-MiniLM-L6-v2` is an English model. The word meanings and transliteration are not indexed, so matches on English questions can be loose.
- `gita_faiss.index` is left over from an earlier FAISS version. The current code does not read it.

## Project structure

```
api.py             FastAPI app and /search/ endpoint
etl.py             Builds the ChromaDB index from verse.json
verse.json         Verse text, transliteration, and word meanings
Dockerfile         Backend image (runs etl.py during build)
render.yaml        Render service definition
frontend/          Next.js app (app/page.tsx)
vercel.json        Vercel build config for frontend/
```

## Contributing

Issues and pull requests are welcome. Before you open a PR, make sure `pip install -r requirements.txt` succeeds and `npm run build` passes in `frontend/`.

## License

MIT. See [LICENSE](LICENSE).
