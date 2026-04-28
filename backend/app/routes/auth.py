from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
import bcrypt, jwt, os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY")

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    phone: str = None
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        phone=req.phone,
        email=req.email,
        password=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return { "message": "Account created successfully!"}

@router.post("/auth/login")
def login(req: LoginRequest,  db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not bcrypt.checkpw(req.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid email pasword")
    token = jwt.encode({ "user_id": user.id, "email": user.email}, SECRET_KEY, algorithm="HS256")
    return { "token": token, "user": { "id": user.id, "first_name": user.first_name } }