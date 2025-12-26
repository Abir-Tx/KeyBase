#!/bin/bash
# A file for docker
# Wait for Postgres to be ready

set -e

host="$1"
shift

echo "Waiting for Postgres at $host:5432..."
until pg_isready -h "$host" -p 5432; do
  sleep 1
done

echo "Postgres is ready. Running Alembic migrations..."
# Run Alembic, ignore non-zero exit if migrations are already applied
alembic -c alembic.ini upgrade head || true

echo "Starting backend..."
# Run the final command passed to the script
exec "$@"

