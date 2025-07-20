from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.ai_utils import summarize_deal

router = APIRouter(prefix="/api/ai", tags=["AI"])

class DealText(BaseModel):
    buyer: str
    target: str
    description: str

@router.post("/summarize")
def summarize(payload: DealText):

#This will return a summary of the deal using my local ai

#keep in mind this will take some time if you don't own a multi-million dollar server farm.
    try:
        result = summarize_deal(payload.target, payload.buyer, payload.description)

        return {"summary": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
