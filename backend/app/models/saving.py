from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Saving(Base):
    __tablename__ = "savings"

    id      = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount  = Column(Float, nullable=False)
    method  = Column(String, nullable=False)
    date    = Column(Date, server_default=func.current_date())