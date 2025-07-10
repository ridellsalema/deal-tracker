# Investment Banking Deal Tracker & Analyzer

A full-stack tool that aggregates and analyzes M&A, IPO, and LBO activity across industries and geographies.

## 🚀 Features
- Deal ingestion (either manual or API)
- Sector/geography filters
- Charts & analytics
- Real-time summaries (AI-powered)

## 🛠 Tech Stack
- FastAPI + PostgreSQL
- React / Streamlit (WIP)
- OpenAI (for AI summaries)

## 🔒 Local Setup
1. Clone the repo
2. Create a `.env` file based on `.env.example`
3. Run:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
