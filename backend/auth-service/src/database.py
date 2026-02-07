from sqlmodel import create_engine, Session

from .settings import settings

# Add connection pooling parameters for better handling of serverless databases
# pool_pre_ping=True: Tests the connection before use, automatically reconnecting if necessary.
# pool_recycle=300: Recycles connections after 5 minutes of inactivity to prevent stale connections.
engine = create_engine(settings.database_url, pool_pre_ping=True, pool_recycle=300)

def get_session():
    with Session(engine) as session:
        yield session
