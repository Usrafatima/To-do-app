import json
from dapr.clients import DaprClient

PUBSUB_NAME = "pubsub"
TOPIC_NAME = "recurring.lifecycle"

class EventPublisher:
    def __init__(self):
        self.client = DaprClient()

    def publish_task_generated(self, original_task_id: str, new_task_id: str, user_id: str):
        from datetime import datetime
        event_payload = {
            "original_task_id": original_task_id,
            "new_task_id": new_task_id,
            "user_id": user_id,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        self.client.publish_event(
            pubsub_name=PUBSUB_NAME,
            topic_name=TOPIC_NAME,
            data=json.dumps(event_payload),
            data_content_type="application/json",
            metadata={"type": "com.taskpilot.recurring.generated"}
        )
