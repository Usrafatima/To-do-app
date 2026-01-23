import pytest
from unittest.mock import patch
from fastapi import HTTPException
from backend.src.auth import verify_google_id_token
from backend.src.settings import settings

# Mock the settings for google_client_id
@pytest.fixture(autouse=True)
def mock_settings():
    with patch("backend.src.settings.settings") as mock_set:
        mock_set.google_client_id = "test-client-id"
        yield mock_set

@patch("google.oauth2.id_token.verify_oauth2_token")
def test_verify_google_id_token_success(mock_verify_oauth2_token):
    mock_verify_oauth2_token.return_value = {"sub": "123", "email": "test@example.com"}
    
    token = "valid_google_id_token"
    result = verify_google_id_token(token)
    
    mock_verify_oauth2_token.assert_called_once()
    assert result == {"sub": "123", "email": "test@example.com"}

@patch("google.oauth2.id_token.verify_oauth2_token")
def test_verify_google_id_token_invalid_token(mock_verify_oauth2_token):
    mock_verify_oauth2_token.side_effect = ValueError("Invalid token")
    
    token = "invalid_google_id_token"
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token(token)
    
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid Google ID token"
    mock_verify_oauth2_token.assert_called_once()

@patch("google.oauth2.id_token.verify_oauth2_token")
def test_verify_google_id_token_missing_client_id(mock_verify_oauth2_token, mocker):
    # Use mocker.patch.object to set settings.google_client_id to None
    mocker.patch.object(settings, "google_client_id", None)
    
    token = "some_token"
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token(token)
    
    assert exc_info.value.status_code == 500  # Expecting 500 as per the updated auth.py
    assert exc_info.value.detail == "Google authentication is not configured."
    mock_verify_oauth2_token.assert_not_called()
