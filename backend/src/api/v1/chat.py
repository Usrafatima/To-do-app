from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select

from ...auth import get_current_active_user
from ...models import User
from ...services import chat_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None # Changed to string to match response

class ChatResponse(BaseModel):
    conversation_id: str
    response: str

@router.post("/", response_model=ChatResponse)
def chat_with_agent(
    request: ChatRequest,
    user: User = Depends(get_current_active_user)
):
    """
    Handles a chat request from the user, orchestrates the agent interaction,
    and returns the agent's response.
    """
    # The service layer expects conversation_id as an int, but the frontend will handle it as a string.
    # We will handle the conversion here. The service returns a string, so we align the model.
    conv_id_int = int(request.conversation_id) if request.conversation_id else None

    try:
        conversation_id, response_text = chat_service.handle_chat_message(
            user=user,
            message_text=request.message,
            conversation_id=conv_id_int,
        )
        return ChatResponse(conversation_id=conversation_id, response=response_text)
    except Exception as e:
        # Basic error handling
        print(f"An error occurred in chat_with_agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))
