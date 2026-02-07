import json
import uuid
from dapr.clients import DaprClient
from ..models.reminder import Reminder, ReminderStatus

STATE_STORE_NAME = "statestore"

class ReminderService:
    def __init__(self):
        self.client = DaprClient()

    def schedule_reminder(self, task_id: str, user_id: str, trigger_time: str) -> Reminder:
        # 1. Create Reminder Model
        reminder = Reminder.create(task_id, user_id, trigger_time)
        
        # 2. Save State to Dapr
        key = f"reminder:{reminder.id}"
        self.client.save_state(
            store_name=STATE_STORE_NAME,
            key=key,
            value=reminder.model_dump_json(),
            metadata={"contentType": "application/json"}
        )
        
        # 3. Schedule Dapr Job (Placeholder for Jobs API)
        # We need to tell Dapr to call us back at 'trigger_time'.
        # The callback would be to an endpoint like POST /job/{name}
        # self.client.schedule_job(
        #     job_name=reminder.id,
        #     schedule=trigger_time,
        #     data=json.dumps({"reminder_id": reminder.id}).encode('utf-8')
        # )
        
        return reminder

    def get_reminder(self, reminder_id: str) -> Reminder:
        key = f"reminder:{reminder_id}"
        item = self.client.get_state(STATE_STORE_NAME, key)
        if item.data:
            return Reminder(**json.loads(item.data))
        return None
