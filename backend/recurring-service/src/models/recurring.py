from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class RecurringDefinition(BaseModel):
    id: str
    user_id: str
    template_content: str
    schedule: str  # Cron string, e.g., "0 0 * * *"
    last_generated_at: Optional[str] = None

    @staticmethod
    def create(user_id: str, template_content: str, schedule: str) -> "RecurringDefinition":
        return RecurringDefinition(
            id=str(uuid.uuid4()),
            user_id=user_id,
            template_content=template_content,
            schedule=schedule,
            last_generated_at=None
        )
