# KeyBase

Dumb app to store shortcut documentations easily.

## Shorcut Model

```ts
Shortcut {
  id: UUID
  name: string
  keys: string[]        // ["Ctrl", "Shift", "K"]
  app: string           // "i3wm"
  os: string            // "Arch Linux"
  description?: string
  tags: string[]
  created_at: datetime
  updated_at: datetime
}
```

## `.env` File

### For Backend

Create a `.env` file in the `backend/` directory with the following variables:

```
DATABASE_URL=postgresql://username:password@db-address:PORT/DBNAME
```

### For Frontend

Create a `.env` file in the `frontend/` directory with the following variables:

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## Usage

### Backend

The backend is build with FastAPI. To run the backend server, navigate to the `backend/` directory and execute:

```bash
make run
```

This will start the FastAPI server on `http://localhost:8000`.

### Frontend

To run the frontend development server, navigate to the `frontend/` directory and execute:

```bash
make dev
```

## Technical Specs

### Backend

- Python version: 3.13.11

### Frontend

- Node version: 24.3.0
- NPX Version: 11.6.0

#### Command Used to Create React App

```bash
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint
```

## Dev notes

- Install `pip install "starlette[full]"` to enable CORS in FastAPI
- Remember to delete the mounted volume data when making breaking changes to the database schema during development or in production as well only if you are using INTERNAL db

## Docker Compose Setup

Visit the sample docker-compose files in the [docker examples directory](./docker-examples) for setting up KeyBase with Docker Compose. There are two examples provided:

1. **Using Internal Database**: This setup uses a PostgreSQL database container that is managed within the same Docker Compose file.

2. **Using External Database**: This setup connects the KeyBase application to an external PostgreSQL database, allowing for more flexibility in database management.
