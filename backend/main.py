from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.reports import router as reports_router
from api.chat import router as chat_router

app = FastAPI(
    title="MediSense AI",
    description="Medical report understanding and evidence-grounded health information",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "running",
        "project": "MediSense AI",
    }


app.include_router(reports_router)
app.include_router(chat_router)
