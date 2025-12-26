from fastapi import FastAPI

app = FastAPI(title="KeyBase API")

@app.get("/health")
def health():
    return {"status": "ok"}

