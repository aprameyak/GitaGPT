# GitaGPT

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![OpenAI](https://img.shields.io/badge/GPT--4-FF5F00?logo=openai&logoColor=white&style=for-the-badge)
![FAISS](https://img.shields.io/badge/FAISS-FFD43B?style=for-the-badge)

## About

**GitaGPT** is an AI-powered chatbot that answers user queries using the teachings of the **Bhagavad Gita** by integrating **GPT-4** with a searchable verse database. It implements a full **ETL (Extract, Transform, Load) pipeline**, transforming verses into structured JSON and storing them in a **FAISS** vector database for semantic search and fast retrieval.

## Features

- **AI-Powered Insights**: GPT-4 generates contextual responses based on Bhagavad Gita teachings  
- **Semantic Search**: SBERT embeddings enable meaning-based verse retrieval using FAISS  
- **ETL Pipeline**: Extracts and vectorizes Bhagavad Gita verses for efficient querying  
- **FastAPI Backend**: Serves high-performance API endpoints for semantic search  
- **Next.js Frontend**: Provides a clean and interactive UI for user queries

## Technology Stack

- **Backend**: FastAPI (Python), OpenAI API, FAISS  
- **Frontend**: Next.js, React.js, Axios  
- **AI Models**: GPT-4 (response generation), SBERT (embedding)  
- **Database**: FAISS for vector storage and similarity search
