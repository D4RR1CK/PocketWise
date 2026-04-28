from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.goal import Goal
from app.routes.expenses import get_current_user

router = APIRouter()

class GoalRequest(BaseModel):
    description:   str
    budget_amount: float
    deadline:      Optional[str] = None

@router.get("/goals")
def get_goals(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == user_id).all()

@router.post("/goals")
def add_goal(req: GoalRequest, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    from datetime import date
    deadline = date.fromisoformat(req.deadline) if req.deadline else None
    goal = Goal(user_id=user_id, description=req.description,
                budget_amount=req.budget_amount, deadline=deadline)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal