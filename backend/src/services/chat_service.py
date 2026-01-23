import logging
import json
from typing import Optional, Dict, Any
from sqlmodel import Session, select

from ..database import engine
from ..models import User, Conversation, Message
from ..agents.input_agent import InputAgent
from ..agents.language_agent import LanguageAgent
from ..agents.intent_agent import IntentAgent
from ..agents.todo_agent import TodoAgent
from ..agents.response_agent import ResponseAgent

logger = logging.getLogger(__name__)

# Initialize Agents
input_agent = InputAgent()
language_agent = LanguageAgent()
intent_agent = IntentAgent()
todo_agent = TodoAgent()
response_agent = ResponseAgent()

def handle_chat_message(user: User, message_text: str, conversation_id: int = None) -> (str, str):
    """
    Orchestrates the agent flow:
    Input -> Language -> Intent -> Todo -> Response
    """
    try:
        # 0. Context/DB Setup (Keep existing conversation logic)
        with Session(engine) as session:
            conversation = None
            if conversation_id:
                conversation = session.get(Conversation, conversation_id)
                if not conversation or conversation.user_id != user.id:
                    raise Exception("Conversation not found or access denied")
            else:
                conversation = session.exec(
                    select(Conversation)
                    .where(Conversation.user_id == user.id)
                    .order_by(Conversation.created_at.desc())
                ).first()

            if not conversation:
                from datetime import datetime
                provider_id = f"agent-conv-{user.id}-{datetime.utcnow().timestamp()}"
                conversation = Conversation(user_id=user.id, provider_thread_id=provider_id)
                session.add(conversation)
                session.commit()
                session.refresh(conversation)

            # 1. Input Agent
            clean_text = input_agent.process(message_text)
            
            # Save User Message
            user_message = Message(conversation_id=conversation.id, role="user", content=clean_text)
            session.add(user_message)
            session.commit()

            # 2. Language Agent
            detected_lang = language_agent.detect_language(clean_text)
            logger.info(f"Detected language: {detected_lang}")

            # 3. Intent Agent (Gemini/LLM)
            # Pass history? The prompt is stateless, but maybe beneficial.
            # For now, following strict 'Input -> ...' flow. IntentAgent uses LLM on the input text.
            intent_data = intent_agent.get_intent(clean_text)
            logger.info(f"Extracted intent: {intent_data}")

            # 4. Todo Agent
            action_result = todo_agent.execute(intent_data, user, session)
            logger.info(f"Action result: {action_result}")

            # 5. Response Agent
            # Determine response based on action result
            intent_name = intent_data.get("intent", "none")
            status = action_result.get("status", "error")
            data = action_result.get("data", {})
            
            # Inject message into data for error handling
            if "message" in action_result:
                data["message"] = action_result["message"]
            
            # If the intent was 'none' or ignored, we might want a specific response
            if intent_name == "none" or status == "ignored":
                final_response_text = response_agent.get_response("none", "none", detected_lang)
            else:
                final_response_text = response_agent.get_response(intent_name, status, detected_lang, data)

            # Save Assistant Message
            # We return JSON to frontend if we want to trigger UI updates, 
            # OR we return text if the frontend just displays text.
            # The previous implementation returned JSON to frontend in `response` field.
            # The frontend `Chatbot.tsx` expects `parsedBackendResponse.action` etc?
            # Let's check Chatbot.tsx. 
            # It tries to parse JSON. If it fails, it displays text.
            # To keep it simple and agent-based, let's return a simple JSON wrapper 
            # that the frontend can parse, containing the text message.
            # We can also hint the frontend to refresh tasks.
            
            # Construct frontend-friendly response
            frontend_payload = {
                "action": "none", # Default to no client-side action unless we want to trigger refresh
                "parameters": {
                    "message": final_response_text
                }
            }
            
            # Trigger refresh if action was successful
            if status == "success":
                # In the old code, "action": "none" with specific keywords triggered refresh.
                # Or we can send a custom action.
                # Let's stick to the pattern: "message" contains the text.
                pass 

            json_response = json.dumps(frontend_payload)

            assistant_message = Message(conversation_id=conversation.id, role="assistant", content=json_response)
            session.add(assistant_message)
            session.commit()

            return str(conversation.id), json_response

    except Exception as e:
        logger.error(f"Error in chat orchestration: {e}", exc_info=True)
        # Fallback error response
        return str(conversation_id) if conversation_id else "0", json.dumps({
            "action": "none", 
            "parameters": {"message": "System error occurred."}
        })
