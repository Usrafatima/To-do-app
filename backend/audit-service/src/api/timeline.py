import json
from fastapi import APIRouter, HTTPException
from typing import List
from dapr.clients import DaprClient
from ..models.activity import ActivityLog

router = APIRouter()
STATE_STORE_NAME = "statestore"

@router.get("/{user_id}", response_model=List[ActivityLog])
def get_user_timeline(user_id: str):
    with DaprClient() as client:
        # 1. Get List of Activity IDs
        timeline_key = f"timeline:{user_id}"
        timeline_item = client.get_state(STATE_STORE_NAME, timeline_key)
        
        if not timeline_item.data:
            return []
            
        activity_ids = json.loads(timeline_item.data)
        if not activity_ids:
            return []
            
        # 2. Bulk Get Activity Details
        # We take the last 20 activities for performance
        recent_ids = activity_ids[-20:]
        bulk_keys = [f"audit:{aid}" for aid in recent_ids]
        
        try:
            bulk_items = client.get_bulk_state(store_name=STATE_STORE_NAME, keys=bulk_keys).items
            activities = []
            for item in bulk_items:
                if item.data:
                    activities.append(ActivityLog(**json.loads(item.data)))
            
            # Sort by timestamp descending (newest first)
            activities.sort(key=lambda x: x.timestamp, reverse=True)
            return activities
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching bulk state: {str(e)}")
