from fastapi import FastAPI
from app.api.v1.router import router


# ✅ FastAPI instance
app = FastAPI(title="KeyBase API")

# ✅ Include your API routes
app.include_router(router)
