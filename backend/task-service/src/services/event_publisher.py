import json
from datetime import datetime
from dapr.clients import DaprClient

PUBSUB_NAME = "pubsub"
TOPIC_NAME = "tasks.lifecycle"

class EventPublisher:
    def __init__(self):
        self.client = DaprClient()

    def publish_task_created(self, task_data: dict):
        """
        Publishes a TaskCreated event.
        """
        event_payload = {
            "task_id": str(task_data.get("id")),
            "user_id": str(task_data.get("user_id")),
            "text": task_data.get("text"),
            "description": task_data.get("description"),
            "created_at": task_data.get("created_at", datetime.utcnow().isoformat())
        }
        
        # Convert datetime objects to string if necessary
        if isinstance(event_payload["created_at"], datetime):
             event_payload["created_at"] = event_payload["created_at"].isoformat()

        try:
            self.client.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name=TOPIC_NAME,
                data=json.dumps(event_payload),
                data_content_type="application/json",
                metadata={"type": "com.taskpilot.task.created"}
            )
            print(f"Published TaskCreated event for task {task_data.get('id')}")
        except Exception as e:
            print(f"Failed to publish TaskCreated event: {e}")

    def publish_task_completed(self, task_id: int, user_id: int, completed_at: datetime):
        """
        Publishes a TaskCompleted event.
        """
        event_payload = {
            "task_id": str(task_id),
            "user_id": str(user_id),
            "completed_at": completed_at.isoformat()
        }

        try:
            self.client.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name=TOPIC_NAME,
                data=json.dumps(event_payload),
                data_content_type="application/json",
                metadata={"type": "com.taskpilot.task.completed"}
            )
            print(f"Published TaskCompleted event for task {task_id}")
        except Exception as e:
            print(f"Failed to publish TaskCompleted event: {e}")
