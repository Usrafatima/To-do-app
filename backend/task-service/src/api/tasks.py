from typing import List
from sqlmodel import Session
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

from ..database import get_session
from ..models import Task
from ..services import task_service
from ..services.event_publisher import EventPublisher

router = APIRouter()
event_publisher = EventPublisher()

@router.get("", response_model=List[Task])
def get_tasks(session: Session = Depends(get_session)):
    """
    Get all tasks.
    """
    return task_service.get_all_tasks(session=session)


@router.post("", response_model=Task)
def create_task(task: Task, session: Session = Depends(get_session)):
    """
    Create a new task.
    """
    created_task = task_service.create_public_task(task_data=task, session=session)
    
    # Publish TaskCreated event
    event_publisher.publish_task_created(created_task.dict())
    
    return created_task


@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task: Task, session: Session = Depends(get_session)):
    """
    Update a task.
    """
    return task_service.update_public_task(
        task_id=task_id, task_update_data=task.dict(exclude_unset=True), session=session
    )


@router.delete("/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)):
    """
    Delete a task.
    """
    return task_service.delete_public_task(task_id=task_id, session=session)


@router.patch("/{task_id}/complete", response_model=Task)
def complete_task(task_id: int, session: Session = Depends(get_session)):
    """
    Toggle the completion status of a task.
    """
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    new_status = not db_task.is_completed
    update_data = {"is_completed": new_status}
    
    updated_task = task_service.update_public_task(
        task_id=task_id, task_update_data=update_data, session=session
    )

    # Publish TaskCompleted event if the task was marked as completed
    if new_status:
        # Note: public tasks might not have a user_id, handle safely
        user_id_str = str(updated_task.user_id) if updated_task.user_id else "0"
        event_publisher.publish_task_completed(
            task_id=updated_task.id,
            user_id=int(user_id_str), # Publisher expects int, but logic handles str conversion
            completed_at=datetime.utcnow()
        )

    return updated_task