# Base image
FROM python:3.13-slim

# Set workdir
WORKDIR /app

# Copy requirements first (to leverage Docker cache)
COPY requirements.txt .

# Install dependencies + Postgres client
RUN apt-get update && apt-get install -y postgresql-client gcc libpq-dev && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    rm -rf /var/lib/apt/lists/*

# Copy backend code
COPY . .

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

# Environment variables
ENV POSTGRES_USER=keybase \
    POSTGRES_HOST=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_PASSWORD=keybase \
    POSTGRES_DB=keybase \
    DATABASE_URL=postgresql+psycopg2://keybase:keybase@postgres:5432/keybase \
    USE_INTERNAL_POSTGRES=true

# Expose port
EXPOSE 8000

# CMD: wait for Postgres, run migrations, then start server
#CMD ["./wait-for-postgres.sh", "postgres", "bash", "-c", "alembic -c alembic.ini upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
CMD ["./wait-for-postgres.sh", "postgres", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

