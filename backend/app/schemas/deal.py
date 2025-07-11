from pydantic import BaseModel
from datetime import date

class DealBase(BaseModel):
    target: str
    buyer: str
    value: float
    sector: str
    date: date

class DealCreate(DealBase):
    pass

class DealOut(DealBase):
    id: int

    class Config:
        orm_mode = True
