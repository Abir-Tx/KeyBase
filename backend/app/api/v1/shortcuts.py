from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

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
