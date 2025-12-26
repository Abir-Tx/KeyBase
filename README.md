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
