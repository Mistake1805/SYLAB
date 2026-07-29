# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "sylab-gateway"
    debug: bool = True
    coreservices_base_url: str = "http://localhost:8081"
    internal_sync_secret: str = "sylab-internal-cron-secret-key-2026"

    class Config:
        env_file = ".env"


settings = Settings()
