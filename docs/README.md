# KeyBase Developer Notes

For setup, local development, Docker Compose deployment, and multi-arch Docker Hub publishing instructions, see the [root README](../README.md).

## Technical Stack & Versions

### Backend
- **Framework:** FastAPI (`0.127.1`) + SQLAlchemy (`2.0.45`) + Alembic (`1.17.2`)
- **Python:** `3.13.11`
- **Health check:** `GET /health`

### Frontend
- **Framework:** Next.js `16.1.1` (App Router, Turbopack), React `19.2.3`, TypeScript
- **Styling & UI:** Tailwind CSS v4, `next-themes`, Framer Motion, Lucide React
- **Node.js:** `24.3.0` (`npm 11.6.0`)

Initial scaffold command used:
```bash
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint
```

## Useful `Makefile` Commands

### `backend/`
- `make activate` — source `venv/bin/activate`
- `make run` — run FastAPI dev server (`uvicorn app.main:app --reload --host 0.0.0.0`)
- `make req` — regenerate `requirements.txt` via `pip freeze`

### `frontend/`
- `make dev` — start Next.js dev server (`npm run dev`)

## Database & Migrations Notes

- **Alembic:** Update `backend/.env` with `DATABASE_URL`, then run `alembic upgrade head` (or `alembic revision --autogenerate -m "..."` after model changes).
- **Internal Postgres Volume:** If you make breaking schema changes while running an internal Postgres container without a migration, clear the mounted Postgres data volume before recreating the stack.
- **CORS:** `backend/app/main.py` currently enables `CORSMiddleware` (requires `starlette` / `fastapi`).

## Docker Compose Examples

See [`../compose-examples`](../compose-examples) for both deployment templates:
1. [`keybase-internal-db.yml`](../compose-examples/keybase-internal-db.yml) — Managed `postgres:16` container inside the same Compose network.
2. [`keybase-external-db.yml`](../compose-examples/keybase-external-db.yml) — Connects to an external PostgreSQL server (`USE_INTERNAL_POSTGRES="false"`).
