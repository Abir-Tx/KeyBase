from fastapi import APIRouter
from app.api.v1 import shortcuts

router = APIRouter()
router.include_router(shortcuts.router)


# Add a /health check route to the router for docker health check
@router.get("/health")
def health():
    return {"status": "ok"}
