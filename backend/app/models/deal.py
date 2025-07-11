from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(String, nullable=False)
    buyer = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    sector = Column(String, nullable=False)
    date = Column(Date, nullable=False)
