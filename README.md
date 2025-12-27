# KeyBase

Dumb app to store shortcut documentations

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
