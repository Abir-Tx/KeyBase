#!/bin/bash
# A file for docker
# Wait for Postgres to be ready

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for Postgres at $host..."
  sleep 2
done

echo "Postgres is ready. Running command..."
exec $cmd
