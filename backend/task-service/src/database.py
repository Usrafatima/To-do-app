from sqlmodel import SQLModel, create_engine, Session
from src.settings import settings

# SQLite
# check_same_thread=False is needed for SQLite with FastAPI/multi-threading
connect_args = {"check_same_thread": False} if "sqlite" in settings.database_url else {}

engine = create_engine(settings.database_url, echo=True, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session
