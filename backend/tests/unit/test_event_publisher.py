import pytest
import sys
import os
from unittest.mock import MagicMock, patch
from datetime import datetime
import json

# Add task-service/src to sys.path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../backend/task-service/src")))

# Mock dapr module before import
mock_dapr = MagicMock()
sys.modules["dapr"] = mock_dapr
mock_dapr_clients = MagicMock()
sys.modules["dapr.clients"] = mock_dapr_clients

from services.event_publisher import EventPublisher

@patch("services.event_publisher.DaprClient")
def test_publish_task_created(mock_dapr_client_cls):
    # Setup mock
    mock_client = MagicMock()
    mock_dapr_client_cls.return_value = mock_client
    
    publisher = EventPublisher()
    
    task_data = {
        "id": 123,
        "user_id": 456,
        "text": "Test Task",
        "description": "Test Desc",
        "created_at": "2023-01-01T12:00:00"
    }
    
    publisher.publish_task_created(task_data)
    
    # Verify call
    mock_client.publish_event.assert_called_once()
    call_args = mock_client.publish_event.call_args[1]
    
    assert call_args["pubsub_name"] == "pubsub"
    assert call_args["topic_name"] == "tasks.lifecycle"
    assert call_args["metadata"]["type"] == "com.taskpilot.task.created"
    
    payload = json.loads(call_args["data"])
    assert payload["task_id"] == "123"
    assert payload["user_id"] == "456"
    assert payload["text"] == "Test Task"

@patch("services.event_publisher.DaprClient")
def test_publish_task_completed(mock_dapr_client_cls):
    # Setup mock
    mock_client = MagicMock()
    mock_dapr_client_cls.return_value = mock_client
    
    publisher = EventPublisher()
    
    task_id = 123
    user_id = 456
    completed_at = datetime.utcnow()
    
    publisher.publish_task_completed(task_id, user_id, completed_at)
    
    # Verify call
    mock_client.publish_event.assert_called_once()
    call_args = mock_client.publish_event.call_args[1]
    
    assert call_args["pubsub_name"] == "pubsub"
    assert call_args["topic_name"] == "tasks.lifecycle"
    assert call_args["metadata"]["type"] == "com.taskpilot.task.completed"
    
    payload = json.loads(call_args["data"])
    assert payload["task_id"] == "123"
    assert payload["user_id"] == "456"
