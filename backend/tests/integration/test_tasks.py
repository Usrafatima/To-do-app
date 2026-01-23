import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent.parent / "backend" / ".env")

sys.path.append(str(Path(__file__).parent.parent.parent.parent))

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from backend.src.main import app
from backend.src.database import get_session

# Use a separate in-memory SQLite database for testing
DATABASE_URL = "sqlite:///test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def get_test_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = get_test_session

client = TestClient(app)

def setup_function():
    SQLModel.metadata.create_all(engine)

def teardown_function():
    SQLModel.metadata.drop_all(engine)

def test_get_all_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_task():
    response = client.post("/tasks/", json={"text": "Test Task", "is_completed": False})
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "Test Task"
    assert data["is_completed"] == False
    assert "id" in data

def test_update_task():
    response = client.post("/tasks/", json={"text": "Test Task", "is_completed": False})
    task_id = response.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"text": "Updated Task"})
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "Updated Task"

def test_delete_task():
    response = client.post("/tasks/", json={"text": "Test Task", "is_completed": False})
    task_id = response.json()["id"]

    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_complete_task():
    response = client.post("/tasks/", json={"text": "Test Task", "is_completed": False})
    task_id = response.json()["id"]

    response = client.patch(f"/tasks/{task_id}/complete")
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] == True
