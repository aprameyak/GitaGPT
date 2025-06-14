FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Run ETL to create database
RUN python etl.py

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"] 