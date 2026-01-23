import pytest
from backend.src.agents.response_agent import ResponseAgent
from backend.src.agents.todo_agent import TodoAgent
from unittest.mock import MagicMock
from sqlmodel import Session
from backend.src.models import User, Task

class TestNotifications:
    @pytest.fixture
    def response_agent(self):
        return ResponseAgent()

    def test_add_notification_en(self, response_agent):
        msg = response_agent.get_response("add_task", "success", "en", {"pending_count": 3})
        assert "Task added. 3 tasks remaining." in msg

    def test_add_notification_roman_ur(self, response_agent):
        msg = response_agent.get_response("add_task", "success", "roman_ur", {"pending_count": 3})
        assert "Task add ho gaya. Ab 3 tasks baqi hain." in msg

    def test_complete_notification_zero_remaining(self, response_agent):
        msg = response_agent.get_response("complete_task", "success", "en", {"pending_count": 0})
        assert "All tasks completed" in msg
        assert "Task completed" in msg

    def test_delete_notification_ur(self, response_agent):
        msg = response_agent.get_response("delete_task", "success", "ur", {"pending_count": 5})
        assert "ٹاسک ختم ہو گیا ہے۔ اب 5 ٹاسک باقی ہیں۔" in msg

    def test_incomplete_notification_en(self, response_agent):
        msg = response_agent.get_response("incomplete_task", "success", "en", {"pending_count": 2})
        assert "Task marked incomplete. 2 tasks remaining." in msg

    # Integration-like test for TodoAgent returning count
    def test_todo_agent_returns_count(self):
        agent = TodoAgent()
        mock_user = User(id=1)
        mock_session = MagicMock(spec=Session)
        
        # Mock task service
        with pytest.MonkeyPatch.context() as m:
            # 2 pending tasks
            t1 = Task(id=1, text="A", user_id=1, is_completed=False)
            t2 = Task(id=2, text="B", user_id=1, is_completed=False)
            
            mock_get = MagicMock(return_value=[t1, t2])
            m.setattr("backend.src.agents.todo_agent.task_service.get_tasks_for_user", mock_get)
            
            # Mock create
            mock_create = MagicMock(return_value=Task(id=3, text="New", user_id=1))
            m.setattr("backend.src.agents.todo_agent.task_service.create_new_task", mock_create)

            # Execution
            intent = {"intent": "add_task", "task": "New"}
            result = agent.execute(intent, mock_user, mock_session)
            
            assert "pending_count" in result["data"]
            assert result["data"]["pending_count"] == 2 # mock returned 2 pending tasks
