# Gamit tayo ng Python image na may Debian base para madaling mag-install ng tools
FROM python:3.11-slim

# ITO ANG MAGIC LINE: I-install ang Poppler sa loob ng server
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# I-set ang working directory
WORKDIR /app

# I-copy ang requirements at i-install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# I-copy ang buong code
COPY . .

# Command para patakbuhin ang FastAPI
CMD uvicorn main:app --host 0.0.0.0 --port $PORT