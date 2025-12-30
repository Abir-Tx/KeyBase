#!/bin/sh
# A file for docker
# Wait for Postgres to be ready
set -e

# Only wait if USE_INTERNAL_POSTGRES is true
if [ "${USE_INTERNAL_POSTGRES}" = "true" ]; then
  echo "Waiting for Postgres at $POSTGRES_HOST:$POSTGRES_PORT ..."
  until nc -z -v -w30 $POSTGRES_HOST $POSTGRES_PORT
  do
    echo "Postgres is unavailable - sleeping"
    sleep 2
  done
  echo "Postgres is up - continuing..."
else
  echo "Skipping Postgres wait, using external database at $POSTGRES_HOST:$POSTGRES_PORT"
fi

exec "$@"
