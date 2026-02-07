from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.task_generator import TaskGenerator

app = FastAPI(title="Recurring Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = TaskGenerator()

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "recurring-service"}

@app.post("/generate/{definition_id}")
def generate_task(definition_id: str):
    """
    Webhook endpoint to be called by Dapr Cron binding.
    """
    try:
        new_task_id = generator.generate_task_from_definition(definition_id)
        if not new_task_id:
            raise HTTPException(status_code=404, detail="Definition not found")
        return {"status": "success", "new_task_id": new_task_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))