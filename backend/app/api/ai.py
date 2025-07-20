from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.ai_utils import summarize_deal
from app.utils.ai_analysis import DealAnalyzer
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Initialize analyzer
analyzer = DealAnalyzer()

class DealText(BaseModel):
    buyer: str
    target: str
    description: str

class AnalysisRequest(BaseModel):
    text: str
    buyer: str
    target: str

@router.post("/summarize")
def summarize(payload: DealText):
    #This will return a summary of the deal using my local ai
    #keep in mind this will take some time if you don't own a multi-million dollar server farm.
    try:
        result = summarize_deal(payload.target, payload.buyer, payload.description)
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
def analyze_deal(payload: AnalysisRequest):
    """Comprehensive AI analysis of a deal"""
    try:
        analysis = analyzer.comprehensive_analysis(
            payload.text, 
            payload.buyer, 
            payload.target
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sentiment")
def analyze_sentiment(payload: DealText):
    """Analyze sentiment of deal description"""
    try:
        sentiment = analyzer.analyze_sentiment(payload.description)
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/entities")
def extract_entities(payload: DealText):
    """Extract named entities from deal text"""
    try:
        entities = analyzer.extract_entities(payload.description)
        return {"entities": entities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
