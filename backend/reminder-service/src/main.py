from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .services.event_handler import handle_task_event

app = FastAPI(title="Reminder Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "reminder-service"}

@app.get("/dapr/subscribe")
def subscribe():
    return [
        {
            "pubsubname": "pubsub",
            "topic": "tasks.lifecycle",
            "route": "/events/tasks"
        }
    ]

@app.post("/events/tasks")
async def task_subscriber(request: Request):
    event = await request.json()
    await handle_task_event(event)
    return {"status": "success"}