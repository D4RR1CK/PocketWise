from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.saving import Saving
from app.routes.expenses import get_current_user

router = APIRouter()

class SavingRequest(BaseModel):
    amount: float
    method: str

@router.get("/savings")
def get_savings(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Saving).filter(Saving.user_id == user_id).order_by(Saving.id.desc()).all()

@router.post("/savings")
def add_saving(req: SavingRequest, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    saving = Saving(user_id=user_id, amount=req.amount, method=req.method)
    db.add(saving)
    db.commit()
    db.refresh(saving)
    return saving
