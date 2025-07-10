from fastapi import FastAPI

app = FastAPI(title="Investment Banking Deal Tracker")

@app.get("/")
def root():
    return {"message": "Welcome to the IB Deal Tracker API"}
