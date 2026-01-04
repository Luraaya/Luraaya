FROM python:3.9-slim

WORKDIR /app

# 1. Abhängigkeiten installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Code kopieren
COPY . .

# 3. Startbefehl (Die robusteste Variante für Cloud Run)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]