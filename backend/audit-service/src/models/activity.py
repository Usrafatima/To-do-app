from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityLog(BaseModel):
    id: Optional[str] = None
    event_type: str
    user_id: str
    details: str
    timestamp: str
