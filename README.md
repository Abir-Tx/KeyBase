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
