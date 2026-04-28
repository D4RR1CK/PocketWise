from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    description   = Column(String, nullable=False)
    budget_amount = Column(Float, nullable=False)
    deadline      = Column(Date, nullable=True)