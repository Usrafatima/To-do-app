import pytest
from unittest.mock import MagicMock
from sqlmodel import Session
from backend.src.agents.todo_agent import TodoAgent
from backend.src.models import User, Task

class TestDeleteImprovements:
    @pytest.fixture
    def mock_session(self):
        return MagicMock(spec=Session)

    @pytest.fixture
    def mock_user(self):
        return User(id=1, email="test@example.com")

    @pytest.fixture
    def todo_agent(self):
        return TodoAgent()

    def test_delete_by_partial_name_success(self, todo_agent, mock_session, mock_user):
        task = Task(id=10, text="Sheru birthday reminder", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get = MagicMock(return_value=[task])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            mock_delete = MagicMock()
            m.setattr("backend.src.agents.todo_agent.task_service.delete_task_for_user", mock_delete)
            
            # Intent: "Sheru wala task" -> Extracted: "sheru"
            intent = {"intent": "delete_task", "task": "sheru"}
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "success"
            mock_delete.assert_called_with(10, mock_user, mock_session)

    def test_delete_ambiguous_matches(self, todo_agent, mock_session, mock_user):
        task1 = Task(id=10, text="Sheru birthday", user_id=1)
        task2 = Task(id=11, text="Sheru vet", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get = MagicMock(return_value=[task1, task2])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            
            intent = {"intent": "delete_task", "task": "sheru"}
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            # Should ask for clarification
            assert result["status"] == "error"
            assert "I found 2 tasks with 'sheru'" in result["message"]

    def test_delete_no_matches(self, todo_agent, mock_session, mock_user):
        with pytest.MonkeyPatch.context() as m:
            mock_get = MagicMock(return_value=[])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            
            intent = {"intent": "delete_task", "task": "sheru"}
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "error"
            assert "I couldn't find any task related to 'sheru'" in result["message"]

    def test_delete_context_fallback(self, todo_agent, mock_session, mock_user):
        task1 = Task(id=50, text="Last Task", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get = MagicMock(return_value=[task1])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            mock_delete = MagicMock()
            m.setattr("backend.src.agents.todo_agent.task_service.delete_task_for_user", mock_delete)
            
            # User says "delete it" -> Intent: "delete_task" (no params)
            intent = {"intent": "delete_task"}
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "success"
            mock_delete.assert_called_with(50, mock_user, mock_session)
