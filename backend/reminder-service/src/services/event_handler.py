import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def handle_task_event(event_payload: dict):
    """
    Handles CloudEvents from the tasks.lifecycle topic.
    """
    # Dapr delivers the CloudEvent. 
    # Structure: { type, source, data, ... }
    
    event_type = event_payload.get("type")
    data = event_payload.get("data")
    
    # Handle stringified data if necessary
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            pass

    if not data:
        logger.warning("Received event with no data")
        return

    logger.info(f"Processing event type: {event_type}")

    if event_type == "com.taskpilot.task.created":
        task_id = data.get("task_id")
        # In a real scenario, we might check if the task has an embedded reminder request
        # or just acknowledge it.
        logger.info(f"Task Created Event received for Task ID: {task_id}")

    elif event_type == "com.taskpilot.task.completed":
        task_id = data.get("task_id")
        logger.info(f"Task Completed Event received for Task ID: {task_id}. Logic to cancel reminders can go here.")
