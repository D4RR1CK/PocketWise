from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.expense import Expense
from typing import Optional
import jwt, os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv = __import__('dotenv').load_dotenv
load_dotenv()

router = APIRouter()
security = HTTPBearer()
SECRET = os.getenv("SECRET_KEY")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

class ExpenseRequest(BaseModel):
    amount: float
    description: str
    category: str

@router.get("/expenses")
def get_expenses(user_id: int = Depends(get_current_user), db: Session =  Depends(get_db)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).order_by(Expense.id.desc()).all()
    return expenses

@router.get("/expenses/summary")
def get_summary(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    savings  = __import__('app.models.saving', fromlist=['Saving']).Saving
    savs     = db.query(savings).filter(savings.user_id == user_id).all()
    total_exp = sum(e.amount for e in expenses)
    total_sav = sum(s.amount for s in savs)
    return { "total_expenses": round(total_exp, 2), "total_savings": round(total_sav, 2) }

@router.post("/expenses")
def add_expense(req: ExpenseRequest, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = Expense(user_id=user_id, amount=req.amount, description=req.description, category=req.category)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return { "message": "Deleted successfully" }
