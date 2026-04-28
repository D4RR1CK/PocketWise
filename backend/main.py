from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, expenses, savings, goals, ai_insights

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PocketWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(savings.router)
app.include_router(goals.router)
app.include_router(ai_insights.router)

@app.get("/")
def root():
    return {"message": "PocketWise API is running"}