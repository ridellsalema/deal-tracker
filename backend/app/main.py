from fastapi import FastAPI
from app.api import deals

app = FastAPI(title="Investment Banking Deal Tracker")

app.include_router(deals.router, prefix="/api/deals", tags=["Deals"])


@app.get("/")
def root():
    return {"message": "Welcome to the IB Deal Tracker API"}
