# GitaGPT

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)

## About

**GitaGPT** is an AI-powered platform that brings the wisdom of the Bhagavad Gita into a modern conversational interface. Built with **Next.js** on the frontend and **FastAPI** on the backend, it uses **sentence transformers** and **ChromaDB** for semantic search across all 700 verses, then generates contextual explanations with **Google Gemini AI**.

## Features

- Semantic search across all 700 verses of the Bhagavad Gita using sentence transformer embeddings
- AI-enhanced explanations for retrieved verses powered by the Google Gemini API
- Vector database backed by ChromaDB for fast, relevance-scored verse retrieval
- ETL pipeline that preprocesses and indexes the full Gita corpus into ChromaDB
- Relevance scores returned alongside each verse result
- Responsive frontend with a clean, modern UI built in Tailwind CSS
- Docker containerized backend for portable deployment

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: ChromaDB (vector database)
- **AI**: Google Gemini API, Sentence Transformers

## Deployment

Visit the live site at [https://gita-gpt-two.vercel.app](https://gita-gpt-two.vercel.app)
