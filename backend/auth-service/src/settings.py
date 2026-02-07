from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    # Ignore extra fields and allow missing env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra='ignore')

    database_url: str = "sqlite:///./test.db"
    secret_key: str = "secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    huggingface_api_token: Optional[str] = None
    google_client_id: str

settings = Settings()