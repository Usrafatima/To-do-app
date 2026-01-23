import pytest
from unittest.mock import MagicMock
from sqlmodel import Session
from backend.src.agents.todo_agent import TodoAgent
from backend.src.agents.response_agent import ResponseAgent
from backend.src.models import User, Task

class TestTodoAgent:
    @pytest.fixture
    def mock_session(self):
        return MagicMock(spec=Session)

    @pytest.fixture
    def mock_user(self):
        return User(id=1, email="test@example.com")

    @pytest.fixture
    def todo_agent(self):
        return TodoAgent()

    def test_resolve_task_by_id_success(self, todo_agent, mock_session, mock_user):
        task = Task(id=10, text="Buy milk", user_id=1)
        mock_session.get.return_value = task
        
        intent = {"task_id": 10}
        resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
        assert resolved == task

    def test_resolve_task_by_id_wrong_user(self, todo_agent, mock_session, mock_user):
        task = Task(id=10, text="Buy milk", user_id=2) # Different user
        mock_session.get.return_value = task
        
        intent = {"task_id": 10}
        resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
        assert resolved is None

    def test_resolve_task_by_text_exact(self, todo_agent, mock_session, mock_user):
        task1 = Task(id=10, text="Buy milk", user_id=1)
        task2 = Task(id=11, text="Walk dog", user_id=1)
        
        # Mock task_service.get_tasks_for_user implicitly by mocking usage in _resolve_task
        # But _resolve_task calls task_service.get_tasks_for_user. 
        # We need to mock task_service.
        with pytest.MonkeyPatch.context() as m:
            mock_get_tasks = MagicMock(return_value=[task1, task2])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get_tasks)
            
            intent = {"task": "Buy milk"}
            resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
            assert resolved == task1

    def test_resolve_task_by_text_partial(self, todo_agent, mock_session, mock_user):
        task1 = Task(id=10, text="Buy milk", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get_tasks = MagicMock(return_value=[task1])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get_tasks)
            
            intent = {"task": "milk"}
            resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
            assert resolved == task1

    def test_resolve_task_ambiguous(self, todo_agent, mock_session, mock_user):
        # Two tasks matching "milk"
        task1 = Task(id=10, text="Buy milk", user_id=1)
        task2 = Task(id=11, text="Drink milk", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            mock_get_tasks = MagicMock(return_value=[task1, task2])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get_tasks)
            
            intent = {"task": "milk"}
            resolved = todo_agent._resolve_task(intent, mock_user, mock_session)
            # Should return the one with higher ID (most recent) based on our logic
            assert resolved == task2

    def test_execute_complete_task_with_text(self, todo_agent, mock_session, mock_user):
        task = Task(id=10, text="Buy milk", user_id=1)
        
        with pytest.MonkeyPatch.context() as m:
            # Mock _resolve_task to return the task
            m.setattr(todo_agent, "_resolve_task", MagicMock(return_value=task))
            
            # Mock task_service.update_task_for_user
            mock_update = MagicMock(return_value=task)
            m.setattr("backend.src.agents.todo_agent.task_service.update_task_for_user", mock_update)
            
            intent = {"intent": "complete_task", "task": "Buy milk"}
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "success"
            mock_update.assert_called_with(10, {"is_completed": True}, mock_user, mock_session)

    def test_execute_complete_task_missing_info(self, todo_agent, mock_session, mock_user):
        with pytest.MonkeyPatch.context() as m:
            m.setattr(todo_agent, "_resolve_task", MagicMock(return_value=None))
            
            intent = {"intent": "complete_task"} # No args
            result = todo_agent.execute(intent, mock_user, mock_session)
            
            assert result["status"] == "error"
            assert "Please specify which task" in result["message"]

class TestResponseAgent:
    def test_response_agent_error_message(self):
        agent = ResponseAgent()
        msg = agent.get_response("complete_task", "error", "en", {"message": "Custom error"})
        assert msg == "Custom error"

    def test_response_agent_error_default(self):
        agent = ResponseAgent()
        msg = agent.get_response("complete_task", "error", "en", {})
        assert msg == "Something went wrong."
