from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.expense import Expense
from app.models.saving import Saving
from app.models.ai_insight import AIInsight
from app.routes.expenses import get_current_user
import os
from dotenv import load_dotenv
from google.genai import Client

load_dotenv()
router = APIRouter()
client = Client(api_key=os.getenv("GEMINI_API_KEY"))

@router.get("/ai-insights")
def get_insights(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    savings  = db.query(Saving).filter(Saving.user_id == user_id).all()

    if not expenses:
        return [{"id": 0, "message": "Add some expenses first so I can analyse your spending patterns!"}]

    expense_summary = "\n".join([f"- {e.category}: K{e.amount} ({e.description})" for e in expenses])
    total_saved     = sum(s.amount for s in savings)

    prompt = f"""
    You are a financial advisor for a mobile budgeting app called PocketWise targeting Zambian users.
    Analyze this user's expenses and savings and give 3 short, practical, friendly insights.
    
    Expenses:
    {expense_summary}
    
    Total saved: K{total_saved}
    
    Give exactly 3 insights as a numbered list. Keep each one under 2 sentences.
    Focus on overspending, saving opportunities, and encouragement.
    Use Zambian Kwacha (K) for currency.
    """

    try:
        response = client.models.generate_content(
        model="gemini-2.0-flash",
         contents=prompt
    )
        raw = response.text.strip()
        lines = [l.strip() for l in raw.split('\n') if l.strip() and l.strip()[0].isdigit()]
        insights = [{"id": i+1, "message": l.lstrip("123. ")} for i, l in enumerate(lines)]

        for insight in insights:
            db.add(AIInsight(user_id=user_id, message=insight["message"]))
        db.commit()

        return insights
    except Exception as e:
        return [{"id": 0, "message": f"AI service unavailable: {str(e)}"}]