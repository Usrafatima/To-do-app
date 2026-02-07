from pydantic_settings import BaseSettings, SettingsConfigDict
import os

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the absolute path to the .env file
# In Docker, we rely on ENV vars passed by Compose, so env_file is less critical but good for fallback
# We'll set it to .env in parent dir relative to src/
env_path = os.path.join(current_dir, "..", ".env")

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=env_path, extra='ignore')

    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    huggingface_api_token: str
    google_client_id: str

settings = Settings()
