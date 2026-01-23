import json
import logging
from typing import Dict, Any, List
from huggingface_hub import InferenceClient
from ..settings import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are an intelligent Assistant for a Todo App called TaskPilot. Your goal is to understand the user's intent and extract parameters.
You must be helpful and infer context where possible.

Return ONLY valid JSON. No explanations.

ALLOWED INTENTS:
- "add_task": {"task": "string"}
- "delete_task": {"task_id": number, "task": "string"}
- "update_task": {"task_id": number, "task": "string", "new_task": "string"}
- "complete_task": {"task_id": number, "task": "string"}
- "incomplete_task": {"task_id": number, "task": "string"}
- "list_tasks": {}
- "greeting": {}
- "help": {}
- "none": {}

RULES:
1. **Greetings**: "hi", "hello", "hey", "salam" -> {"intent": "greeting"}.
2. **Help**: "help", "kya kar sakte ho", "what can you do" -> {"intent": "help"}.
3. **Add**: "add task buy milk" -> {"intent": "add_task", "task": "buy milk"}.
4. **Delete (Explicit)**: "delete task 1" -> {"intent": "delete_task", "task_id": 1}.
5. **Delete (Descriptive/Roman)**:
   - "delete sheru wala task" -> {"intent": "delete_task", "task": "sheru"} (Ignore 'wala task').
   - "sheru ko delete kardo" -> {"intent": "delete_task", "task": "sheru"}.
   - "hata do isko" -> {"intent": "delete_task"} (Implies context).
   - "remove ye task" -> {"intent": "delete_task"}.
6. **Update**: "rename buy milk to buy bread" -> {"intent": "update_task", "task": "buy milk", "new_task": "buy bread"}.
   - "change to eid mubarak" -> {"intent": "update_task", "new_task": "eid mubarak"}.
7. **Complete**: "mark as done", "complete kardo" -> {"intent": "complete_task"}.
8. **Ambiguity**: If user relies on context (e.g., "it", "that task", "isko"), do not invent a name. Return the intent without parameters so the system uses the last task.
9. **Fallback**: If intent is unclear, return {"intent": "none"}.
"""

class IntentAgent:
    def __init__(self):
        self.client = InferenceClient(token=settings.huggingface_api_token)
        self.model = "NousResearch/Hermes-2-Pro-Llama-3-8B"

    def get_intent(self, text: str) -> Dict[str, Any]:
        """
        Uses LLM to extract intent from text.
        """
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]

        try:
            response = self.client.chat_completion(
                messages=messages,
                model=self.model,
                max_tokens=200,
            )
            raw_content = response.choices[0].message.content.strip()
            
            # Simple cleanup for markdown code blocks if present
            if raw_content.startswith("```json"):
                raw_content = raw_content[7:]
            if raw_content.endswith("```"):
                raw_content = raw_content[:-3]
            
            return json.loads(raw_content.strip())
        except Exception as e:
            logger.error(f"Intent detection failed: {e}")
            return {"intent": "none"}
