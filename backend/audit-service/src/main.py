import json
import logging
import uuid
from datetime import datetime
from fastapi import FastAPI, Request
from .models.activity import ActivityLog
from dapr.clients import DaprClient
from .api import timeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Audit Service", redirect_slashes=False)
app.include_router(timeline.router, prefix="/timeline", tags=["timeline"])
STATE_STORE_NAME = "statestore"

@app.get("/")
def health():
    return {"status": "healthy", "service": "audit-service"}

# Dapr uses this endpoint to know what topics this service is subscribed to
@app.get("/dapr/subscribe")
def subscribe():
    subscriptions = [
        {
            "pubsubname": "pubsub",
            "topic": "tasks.lifecycle",
            "route": "/events/tasks"
        }
    ]
    return subscriptions

# Dapr will POST events to this endpoint
@app.post("/events/tasks")
async def handle_task_event(request: Request):
    # Dapr sends the CloudEvent as the request body
    event = await request.json()
    logger.info(f"Received CloudEvent: {event}")
    
    event_type = event.get("type")
    data = event.get("data")
    
    # Dapr might deliver data as a string (if content-type was json/string) or dict
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            pass # Keep as string if not json
    
    # Skip if data is None
    if not data:
        return {"status": "skipped", "reason": "no data"}

    # Map Event to Activity Log
    # TaskCreated payload: { task_id, user_id, text, description, created_at }
    
    details = ""
    timestamp = ""
    
    if event_type == "com.taskpilot.task.created":
        details = f"Created Task: {data.get('text', 'Unknown')}"
        timestamp = data.get('created_at', datetime.utcnow().isoformat())
    elif event_type == "com.taskpilot.task.completed":
        details = f"Completed Task: {data.get('task_id')}"
        timestamp = data.get('completed_at', datetime.utcnow().isoformat())
    else:
        details = f"Unknown Event: {data}"
        timestamp = datetime.utcnow().isoformat()

    activity = ActivityLog(
        id=f"act-{uuid.uuid4()}", # Generate a unique ID for the log
        event_type=event_type,
        user_id=data.get("user_id", "unknown"),
        details=details,
        timestamp=timestamp
    )

    # Save to Audit Log in Redis
    # Key format: "audit:{activity_id}"
    with DaprClient() as client:
        key = f"audit:{activity.id}"
        client.save_state(
            store_name=STATE_STORE_NAME,
            key=key,
            value=activity.model_dump_json()
        )
        
        # Add to user's timeline index
        timeline_key = f"timeline:{activity.user_id}"
        
        # Get existing timeline
        try:
            timeline_item = client.get_state(STATE_STORE_NAME, timeline_key)
            if timeline_item.data:
                timeline_ids = json.loads(timeline_item.data)
            else:
                timeline_ids = []
        except Exception:
            timeline_ids = []
            
        # Append new activity ID and save back
        timeline_ids.append(activity.id)
        client.save_state(
            store_name=STATE_STORE_NAME,
            key=timeline_key,
            value=json.dumps(timeline_ids)
        )
    
    return {"status": "success"}
