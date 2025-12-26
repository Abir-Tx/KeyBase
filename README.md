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
