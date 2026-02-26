from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hrms")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

    # Build CORS origins dynamically so empty string never gets added
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins = [
            "http://localhost:5173",
            "http://localhost:3000",
        ]
        # Add production frontend URL only if it is actually set
        if self.FRONTEND_URL and self.FRONTEND_URL.strip():
            origins.append(self.FRONTEND_URL.strip())
        return origins

settings = Settings()