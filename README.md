# KeyBase

A self-hosted keyboard shortcut manager to store, search, and organize shortcuts across apps and operating systems.

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Docker Hub:** [`abirtx/keybase-frontend`](https://hub.docker.com/r/abirtx/keybase-frontend) | [`abirtx/keybase-backend`](https://hub.docker.com/r/abirtx/keybase-backend)

## Features (`v1.0.0`)

- **Instant Search & Faceted Filtering:** Search across names, apps, keys, OSes, tags, and descriptions; filter via the sidebar or clickable card pills (with `OR`/`AND` tag logic).
- **Cards & Compact Cheat-Sheet Views:** Switch between the visual 2-column grid and dense single-row view (`v` shortcut), persisted locally.
- **Pinned / Learning Section:** Pin shortcuts locally to keep active bindings you are memorizing at the top.
- **Keyboard-First Workflow:** `/` or `Ctrl+K` to search, `n` to add, `v` to switch view, `?` for keyboard help, `Esc` to clear/close, and one-click key copy or shortcut cloning.
- **Backup & Export:** Export to **JSON**, **Markdown**, or **PDF** cheat sheet (all or filtered), plus duplicate-safe JSON import.

---

## Shortcut Data Model

```ts
Shortcut {
  id: UUID
  name: string
  keys: string[]        // ["Ctrl", "Shift", "K"]
  app: string           // "Tmux"
  os: string            // "Linux"
  description?: string
  tags: string[]
  created_at: datetime
  updated_at: datetime
}
```

---

## Local Development

### Prerequisites
- **Node.js** `24.3.0+` (Frontend)
- **Python** `3.13+` and **PostgreSQL** (Backend)

### 1. Backend (`http://localhost:8000`)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://keybase:keybase@localhost:5432/keybase
```

Run database migrations and start the FastAPI server:

```bash
alembic upgrade head
make run   # uvicorn app.main:app --reload --host 0.0.0.0
```

### 2. Frontend (`http://localhost:3000`)

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Install dependencies and start the Next.js dev server:

```bash
cd frontend
npm install
make dev   # npm run dev
```

---

## Deployment with Docker Compose

Ready-to-use Compose templates are in [`./compose-examples`](./compose-examples):

1. **Internal Postgres** ([`keybase-internal-db.yml`](./compose-examples/keybase-internal-db.yml)) — runs `postgres:16`, `keybase-backend`, and `keybase-frontend`.
2. **External Postgres** ([`keybase-external-db.yml`](./compose-examples/keybase-external-db.yml)) — connects to an existing PostgreSQL server (`USE_INTERNAL_POSTGRES="false"`).

Create a `.env` file in the same directory as your chosen Compose file:

```env
NEXT_PUBLIC_API_BASE=http://<SERVER_IP>:8000
```

Start the stack:

```bash
docker compose -f compose-examples/keybase-internal-db.yml up -d
```

> **Important:** `NEXT_PUBLIC_API_BASE` is used by your browser, so it must point to the host/LAN IP or domain where port `8000` is reachable (not `http://backend:8000`). The Compose file mounts `./.env:/app/.env` into the frontend container.

---

## Dockerization & Multi-CPU Builds (x86 + Raspberry Pi)

KeyBase runs as two separate containers:
- **`abirtx/keybase-backend`** ([`backend/Dockerfile`](./backend/Dockerfile)) — `python:3.13-slim`; runs [`wait-for-postgres.sh`](./backend/wait-for-postgres.sh), applies `alembic upgrade head`, and starts Uvicorn on port `8000`.
- **`abirtx/keybase-frontend`** ([`frontend/Dockerfile`](./frontend/Dockerfile)) — `node:20-alpine`; runs Next.js on port `3000` and reads the mounted `/app/.env`.

Both images on Docker Hub are published as **multi-architecture (multi-CPU) manifests** so the same `:latest` tag works on both **x86_64 servers (e.g. HP Xpress)** and **ARM devices (e.g. Raspberry Pi)**:
- `linux/amd64` — x86_64 servers and desktops
- `linux/arm64` — 64-bit Raspberry Pi OS / ARM64 servers *(append `,linux/arm/v7` if targeting 32-bit Pi OS)*

### 1. One-Time Buildx & QEMU Setup

```bash
# Log in to Docker Hub
docker login

# Create and activate a multi-arch Buildx builder (only needed once)
docker buildx create --name keybase-builder --driver docker-container --use
docker buildx inspect --bootstrap
```

If cross-building ARM images from an x86 machine fails with `exec format error`, register QEMU emulators once:

```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

### 2. Build & Push Multi-CPU Images to Docker Hub

Multi-arch images cannot be loaded as a single local image into the standard Docker daemon, so `--push` uploads the multi-platform manifest list directly to Docker Hub:

**Backend:**
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t abirtx/keybase-backend:latest \
  -t abirtx/keybase-backend:v1.0.0 \
  --push \
  ./backend
```

**Frontend:**
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t abirtx/keybase-frontend:latest \
  -t abirtx/keybase-frontend:v1.0.0 \
  --push \
  ./frontend
```

### 3. Verify & Update on Your Server

Confirm both `linux/amd64` and `linux/arm64` are in the published manifest:

```bash
docker buildx imagetools inspect abirtx/keybase-backend:latest
docker buildx imagetools inspect abirtx/keybase-frontend:latest
```

Pull and restart on your server (HP Xpress or Raspberry Pi):

```bash
docker compose pull
docker compose up -d
```

---

## Additional Docs

- [Developer & Technical Notes](./docs/README.md)
- [Docker Compose Examples Guide](./compose-examples/readme.md)
- [License](./LICENSE)
