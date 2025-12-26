from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ShortcutCreate(BaseModel):
    name: str
    keys: List[str]
    app: str
    os: str
    description: Optional[str] = None
    tags: List[str] = []

class ShortcutOut(ShortcutCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime

