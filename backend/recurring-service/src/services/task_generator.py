import json
import uuid
from datetime import datetime
from dapr.clients import DaprClient
from ..models.recurring import RecurringDefinition
from .event_publisher import EventPublisher

STATE_STORE_NAME = "statestore"

class TaskGenerator:
    def __init__(self):
        self.client = DaprClient()
        self.publisher = EventPublisher()

    def generate_task_from_definition(self, definition_id: str):
        # 1. Fetch Definition
        key = f"recurring:{definition_id}"
        item = self.client.get_state(STATE_STORE_NAME, key)
        if not item.data:
            return None
        
        definition = RecurringDefinition(**json.loads(item.data))
        
        # 2. Generate New Task ID
        new_task_id = str(uuid.uuid4())
        
        # 3. Update Definition's last_generated_at
        definition.last_generated_at = datetime.utcnow().isoformat()
        self.client.save_state(
            store_name=STATE_STORE_NAME,
            key=key,
            value=definition.model_dump_json()
        )
        
        # 4. Publish Event
        # The Task Service will listen for this event and actually create the task record.
        self.publisher.publish_task_generated(
            original_task_id=definition.id,
            new_task_id=new_task_id,
            user_id=definition.user_id
        )
        
        return new_task_id
