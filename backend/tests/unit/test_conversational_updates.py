import pytest
from backend.src.agents.response_agent import ResponseAgent
from backend.src.agents.todo_agent import TodoAgent
from unittest.mock import MagicMock
from sqlmodel import Session
from backend.src.models import User, Task

class TestConversationalUpdates:
    @pytest.fixture
    def response_agent(self):
        return ResponseAgent()

    @pytest.fixture
    def todo_agent(self):
        return TodoAgent()
    
    @pytest.fixture
    def mock_session(self):
        return MagicMock(spec=Session)

    @pytest.fixture
    def mock_user(self):
        return User(id=1, email="test@example.com")

    def test_greeting_response_en(self, response_agent):
        msg = response_agent.get_response("greeting", "success", "en")
        assert "Hi there!" in msg

    def test_greeting_response_roman_ur(self, response_agent):
        msg = response_agent.get_response("greeting", "success", "roman_ur")
        assert "Assalam-o-Alaikum!" in msg

    def test_todo_agent_greeting(self, todo_agent, mock_session, mock_user):
        result = todo_agent.execute({"intent": "greeting"}, mock_user, mock_session)
        assert result["status"] == "success"

    def test_todo_agent_list_tasks(self, todo_agent, mock_session, mock_user):
        # Mock task_service
        with pytest.MonkeyPatch.context() as m:
            mock_tasks = [Task(text="Task 1", user_id=1), Task(text="Task 2", user_id=1)]
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", MagicMock(return_value=mock_tasks))
            
            result = todo_agent.execute({"intent": "list_tasks"}, mock_user, mock_session)
            assert result["status"] == "success"
            assert "Task 1" in result["data"]["tasks"]
            assert "Task 2" in result["data"]["tasks"]

    def test_response_list_tasks_empty(self, response_agent):
        # Test empty list logic in response agent
        msg = response_agent.get_response("list_tasks", "success", "en", {"tasks": ""})
        assert "You don't have any tasks yet" in msg

    def test_context_update_no_id(self, todo_agent, mock_session, mock_user):
        # Verify update_task works with only new_task (fallback to last task)
        task1 = Task(id=50, text="Old Name", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get = MagicMock(return_value=[task1])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            
            # Mock update service
            mock_update = MagicMock(return_value=Task(id=50, text="New Name", user_id=1))
            m.setattr("backend.src.agents.todo_agent.task_service.update_task_for_user", mock_update)

            intent = {"intent": "update_task", "new_task": "New Name"}
            # task_id missing, task text missing -> should fallback to task1 (id 50)
            
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "success"
            mock_update.assert_called_with(50, {"text": "New Name"}, mock_user, mock_session)
