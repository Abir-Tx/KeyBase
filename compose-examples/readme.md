# KeyBase Docker Compose Guide

Two Compose templates are provided in this directory:

- [`keybase-internal-db.yml`](./keybase-internal-db.yml) — includes a managed `postgres:16` service.
- [`keybase-external-db.yml`](./keybase-external-db.yml) — connects to an existing PostgreSQL server.

## Required `.env` File

Create a `.env` file in the same directory where you run your `docker-compose` file:

```env
# Reachable URL of the KeyBase backend from your browser
NEXT_PUBLIC_API_BASE=http://<SERVER_IP>:8000
```

## Additional Configuration

- **Internal DB (`keybase-internal-db.yml`):** Update `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `DATABASE_URL` before exposing on a network. Data is persisted to `./database_data/data`.
- **External DB (`keybase-external-db.yml`):** Update `DATABASE_URL` in the Compose file (`postgresql+psycopg2://USERNAME:PASSWORD@HOSTIP:PORT/DATABASE_NAME`) and keep `USE_INTERNAL_POSTGRES: "false"`.

## Running

```bash
docker compose -f keybase-internal-db.yml up -d
```

See the [root README](../README.md) for local development and multi-arch Docker Buildx instructions.
