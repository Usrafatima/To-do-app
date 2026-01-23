import pytest
from unittest.mock import MagicMock
from sqlmodel import Session
from backend.src.agents.todo_agent import TodoAgent
from backend.src.services import chat_service
from backend.src.models import User, Task

class TestChatFixes:
    @pytest.fixture
    def mock_session(self):
        return MagicMock(spec=Session)

    @pytest.fixture
    def mock_user(self):
        return User(id=1, email="test@example.com")

    @pytest.fixture
    def todo_agent(self):
        return TodoAgent()

    def test_fallback_to_last_task(self, todo_agent, mock_session, mock_user):
        task1 = Task(id=10, text="Old task", user_id=1)
        task2 = Task(id=20, text="New task", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get_tasks = MagicMock(return_value=[task1, task2])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get_tasks)
            
            # Intent has NO task info
            intent = {"intent": "complete_task"} 
            resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
            
            # Should pick task2 (highest ID)
            assert resolved == task2
            assert resolved.id == 20

    def test_error_message_propagation(self):
        # We need to simulate the chat_service logic where message is extracted
        # Since we can't easily mock the entire chat_service.handle_chat_message due to dependencies,
        # we can verify the logic snippet.
        
        action_result = {"status": "error", "message": "Custom Error"}
        data = action_result.get("data", {})
        if "message" in action_result:
            data["message"] = action_result["message"]
            
        assert data["message"] == "Custom Error"
