from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models import Shortcut
from app.schemas.shortcut import ShortcutCreate, ShortcutOut

router = APIRouter(prefix="/shortcuts", tags=["Shortcuts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ShortcutOut)
def create_shortcut(data: ShortcutCreate, db: Session = Depends(get_db)):
    shortcut = Shortcut(**data.dict())
    db.add(shortcut)
    db.commit()
    db.refresh(shortcut)
    return shortcut

@router.get("/", response_model=list[ShortcutOut])
def list_shortcuts(db: Session = Depends(get_db)):
    return db.query(Shortcut).all()

