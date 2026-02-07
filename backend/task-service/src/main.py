from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from .database import engine
from .api import tasks

app = FastAPI(title="Task Service", version="1.0.0", redirect_slashes=False)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# CORS is vital for the frontend to talk to us (even via proxy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "task-service"}
