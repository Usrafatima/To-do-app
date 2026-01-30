import logging
from fastapi import FastAPI
from sqlmodel import SQLModel
from starlette.middleware.cors import CORSMiddleware # Import CORSMiddleware

logging.basicConfig(level=logging.INFO)

from .api import auth, tasks
from .api.v1 import chat as chat_v1
from .database import engine
from .models import Task


def create_db_and_tables():
    logging.warning("Dropping and recreating all tables. All data will be lost.")
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


app = FastAPI(redirect_slashes=False)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Explicit origins required when allow_credentials=True
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(chat_v1.router, prefix="/api/v1/chat", tags=["chat"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
