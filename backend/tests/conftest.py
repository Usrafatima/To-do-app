import pytest
from pathlib import Path
from dotenv import load_dotenv

# Load the .env file from the backend directory at the start of the test session
# This ensures environment variables are set before pydantic-settings tries to read them
load_dotenv(Path(__file__).parent.parent.parent / "backend" / ".env")

# You can add more global fixtures here, e.g., for test database sessions
# @pytest.fixture(scope="session")
# def test_db_session():
#     # Setup test database
#     yield session
#     # Teardown test database
