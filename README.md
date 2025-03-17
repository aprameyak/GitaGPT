# GitaGPT

GitaGPT is an AI-powered chatbot that answers user queries using the teachings of the Bhagavad Gita by integrating GPT-4 with a searchable verse database. The project employs an ETL (Extract, Transform, Load) pipeline, where Bhagavad Gita verses are extracted from an external API, transformed into a structured JSON format, and loaded into a vectorized FAISS database after being embedded using SBERT (Sentence-BERT) for semantic search. A FastAPI backend exposes an API that retrieves relevant verses based on meaning, processes them with GPT-4 via the OpenAI API, and returns citation-backed responses. The Next.js and React.js frontend allows users to input queries, fetch responses via Axios, and view AI-generated insights alongside chapter-verse references. This project demonstrates expertise in full-stack development, NLP, scalable architecture, and cloud API integration, utilizing FAISS for efficient semantic search, FastAPI for high-performance API endpoints, and GPT-4 for contextualized answer generation, creating an intuitive and technically robust chatbot for exploring spiritual wisdom.







