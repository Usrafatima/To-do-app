from enum import Enum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class ReminderStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    TRIGGERED = "TRIGGERED"
    CANCELLED = "CANCELLED"

class Reminder(BaseModel):
    id: str
    task_id: str
    user_id: str
    trigger_time: str
    status: ReminderStatus = ReminderStatus.SCHEDULED

    @staticmethod
    def create(task_id: str, user_id: str, trigger_time: str) -> "Reminder":
        return Reminder(
            id=str(uuid.uuid4()),
            task_id=task_id,
            user_id=user_id,
            trigger_time=trigger_time,
            status=ReminderStatus.SCHEDULED
        )
