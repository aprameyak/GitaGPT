# GitaGPT API

A FastAPI-based search engine for the Bhagavad Gita using Gemini AI for explanations.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with:
```
GOOGLE_API_KEY=your_api_key_here
ALLOWED_ORIGINS=*
```

4. Run the development server:
```bash
uvicorn api:app --reload
```

## Deployment

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add your `GOOGLE_API_KEY` in the environment variables
5. Deploy!

## API Endpoints

- POST `/search/`: Search for verses
  - Body: `{"query": "your question", "top_k": 3}`
- GET `/metadata/`: Get API information
