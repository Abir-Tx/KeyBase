from fastapi import APIRouter
from app.api.v1 import shortcuts

router = APIRouter()
router.include_router(shortcuts.router)

