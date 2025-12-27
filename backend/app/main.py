from fastapi import FastAPI
from app.api.v1.router import router
from fastapi.middleware.cors import CORSMiddleware


# ✅ FastAPI instance
app = FastAPI(title="KeyBase API")

# Allow requests from frontend (Next.js)
origins = [
    "http://localhost:3000",  # frontend
    # "http://your-production-domain.com"  # add production URL later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # origins or ["*"] for testing only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include your API routes
app.include_router(router)
