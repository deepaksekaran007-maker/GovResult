import os
from typing import List, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovResult+ Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "govresult-super-secret-key-national-portal-2026-secure-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Default to local SQLite with easy upgrade to PostgreSQL via DATABASE_URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:////tmp/govresult.db" if os.getenv("VERCEL") else "sqlite:///./govresult.db"
    )
    
    # AI Assistant API Keys (configurable through environment)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
