from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException

from ..models import Task, User

# --- User-specific Task Service Functions ---

def get_tasks_for_user(user: User, session: Session) -> List[Task]:
    """Gets all tasks for a specific user from the database."""
    tasks = session.exec(select(Task).where(Task.user_id == user.id)).all()
    return tasks

def create_new_task(task_data: Task, user: User, session: Session) -> Task:
    """Creates a new task for a specific user."""
    task_data.id = None
    task_data.user_id = user.id
    session.add(task_data)
    session.commit()
    session.refresh(task_data)
    return task_data

def update_task_for_user(task_id: int, task_update_data: dict, user: User, session: Session) -> Task:
    """Updates a task for a specific user."""
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if "user_id" in task_update_data:
        del task_update_data["user_id"]

    for key, value in task_update_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task_for_user(task_id: int, user: User, session: Session):
    """Deletes a task for a specific user."""
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(db_task)
    session.commit()
    return {"ok": True}

# --- Public Task Service Functions ---

def get_all_tasks(session: Session) -> List[Task]:
    """Gets all tasks from the database."""
    tasks = session.exec(select(Task)).all()
    return tasks

def create_public_task(task_data: Task, session: Session) -> Task:
    """Creates a new public task."""
    task_data.id = None
    task_data.user_id = None
    session.add(task_data)
    session.commit()
    session.refresh(task_data)
    return task_data

def update_public_task(task_id: int, task_update_data: dict, session: Session) -> Task:
    """Updates a public task."""
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task_update_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_public_task(task_id: int, session: Session):
    """Deletes a public task."""
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(db_task)
    session.commit()
    return {"ok": True}
