from fastapi import FastAPI
from app.api import deals
from app.api import ai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Investment Banking Deal Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)

app.include_router(deals.router, prefix="/api/deals", tags=["Deals"])


@app.get("/")
def root():
    return {"message": "Welcome to the IB Deal Tracker API"}
