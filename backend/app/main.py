from fastapi import FastAPI
from app.api.v1.router import router
from app.db.base import Base
from app.db.session import engine

# ✅ Dev-only: automatically create tables if they don't exist
Base.metadata.create_all(bind=engine)

# ✅ FastAPI instance
app = FastAPI(title="KeyBase API")

# ✅ Include your API routes
app.include_router(router)
