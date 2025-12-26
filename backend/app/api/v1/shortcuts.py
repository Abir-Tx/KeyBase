from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import List, Optional

from app.db.session import SessionLocal
from app.db.models import Shortcut
from app.schemas.shortcut import ShortcutCreate, ShortcutOut

router = APIRouter(prefix="/shortcuts", tags=["Shortcuts"])


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE
@router.post("/", response_model=ShortcutOut)
def create_shortcut(data: ShortcutCreate, db: Session = Depends(get_db)):
    shortcut = Shortcut(**data.dict())
    db.add(shortcut)
    db.commit()
    db.refresh(shortcut)
    return shortcut


# READ ALL
@router.get("/", response_model=list[ShortcutOut])
def list_shortcuts(db: Session = Depends(get_db)):
    return db.query(Shortcut).all()


# READ ONE
@router.get("/{shortcut_id}", response_model=ShortcutOut)
def get_shortcut(shortcut_id: UUID, db: Session = Depends(get_db)):
    shortcut = db.query(Shortcut).filter(Shortcut.id == shortcut_id).first()
    if not shortcut:
        raise HTTPException(status_code=404, detail="Shortcut not found")
    return shortcut


# UPDATE
@router.put("/{shortcut_id}", response_model=ShortcutOut)
def update_shortcut(
    shortcut_id: UUID, data: ShortcutCreate, db: Session = Depends(get_db)
):
    shortcut = db.query(Shortcut).filter(Shortcut.id == shortcut_id).first()
    if not shortcut:
        raise HTTPException(status_code=404, detail="Shortcut not found")

    for key, value in data.dict().items():
        setattr(shortcut, key, value)
    shortcut.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(shortcut)
    return shortcut


# DELETE
@router.delete("/{shortcut_id}")
def delete_shortcut(shortcut_id: UUID, db: Session = Depends(get_db)):
    shortcut = db.query(Shortcut).filter(Shortcut.id == shortcut_id).first()
    if not shortcut:
        raise HTTPException(status_code=404, detail="Shortcut not found")

    db.delete(shortcut)
    db.commit()
    return {"message": "Shortcut deleted"}


# Search and filter with multiple apps, OSes, AND/OR for tags
@router.get("/shortcuts/search", response_model=List[ShortcutOut])
def search_shortcuts(
    name: Optional[str] = None,
    apps: Optional[List[str]] = Query(None, description="Filter by multiple apps"),
    oses: Optional[List[str]] = Query(None, description="Filter by multiple OSes"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    tags_logic: str = Query(
        "OR", regex="^(OR|AND)$", description="Tags filter logic: OR or AND"
    ),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = db.query(Shortcut)

    if name:
        query = query.filter(Shortcut.name.ilike(f"%{name}%"))

    if apps:
        query = query.filter(Shortcut.app.in_(apps))  # any app in the list

    if oses:
        query = query.filter(Shortcut.os.in_(oses))  # any OS in the list

    if tags:
        if tags_logic.upper() == "OR":
            query = query.filter(Shortcut.tags.overlap(tags))  # any tag matches
        else:  # AND
            for tag in tags:
                query = query.filter(
                    Shortcut.tags.contains([tag])
                )  # all tags must exist

    query = query.order_by(Shortcut.created_at.desc())
    return query.offset(offset).limit(limit).all()
