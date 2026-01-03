#!/bin/sh
# A file for docker
# Wait for Postgres to be ready
set -e

# Use a default port if not set
PORT="${POSTGRES_PORT:-5432}"

if [ "${USE_INTERNAL_POSTGRES}" = "true" ]; then
  echo "Waiting for Postgres at ${POSTGRES_HOST}:${PORT} ..."

  # Loop until ready
  until (
    if command -v pg_isready >/dev/null 2>&1; then
      pg_isready -h "$POSTGRES_HOST" -p "$PORT"
    else
      # Fallback to pure shell TCP check (requires no extra packages)
      (echo > /dev/tcp/"$POSTGRES_HOST"/"$PORT") >/dev/null 2>&1
    fi
  ); do
    echo "Postgres is unavailable - sleeping"
    sleep 2
  done

  echo "Postgres is up - continuing to start Abir's KeyBase app ;-)..."
else
  echo "You configured the app to use external postgres DB. Skipping Internal Postgres checks (External DB: ${POSTGRES_HOST}:${PORT})"
fi

# Execute the CMD from Dockerfile
exec "$@"