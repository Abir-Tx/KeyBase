from sqlalchemy import Column, String, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.db.base import Base

class Shortcut(Base):
    __tablename__ = "shortcuts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    keys = Column(ARRAY(String), nullable=False)
    app = Column(String, nullable=False)
    os = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(ARRAY(String), default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

