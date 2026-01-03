FROM python:3.13-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

# Environment
ENV PYTHONUNBUFFERED=1 \
    POSTGRES_USER=keybase \
    POSTGRES_HOST=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_PASSWORD=keybase \
    POSTGRES_DB=keybase \
    DATABASE_URL=postgresql+psycopg2://keybase:keybase@postgres:5432/keybase \
    USE_INTERNAL_POSTGRES=true

EXPOSE 8000

# 🔥 IMPORTANT PART
# 1. Wait for Postgres
# 2. Run Alembic migrations
# 3. Start Uvicorn
CMD ["bash", "-c", "./wait-for-postgres.sh && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
