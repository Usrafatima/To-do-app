import json
from dapr.clients import DaprClient

PUBSUB_NAME = "pubsub"
TOPIC_NAME = "reminders.lifecycle"

class EventPublisher:
    def __init__(self):
        self.client = DaprClient()

    def publish_reminder_triggered(self, reminder_id: str, task_id: str, user_id: str, trigger_time: str):
        event_payload = {
            "reminder_id": reminder_id,
            "task_id": task_id,
            "user_id": user_id,
            "trigger_time": trigger_time
        }
        
        self.client.publish_event(
            pubsub_name=PUBSUB_NAME,
            topic_name=TOPIC_NAME,
            data=json.dumps(event_payload),
            data_content_type="application/json",
            metadata={"type": "com.taskpilot.reminder.triggered"}
        )
