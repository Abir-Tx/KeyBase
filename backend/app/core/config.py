from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KeyBase"
    DATABASE_URL: str = "postgresql://keybase:keybase@db:5432/keybase"

    class Config:
        env_file = ".env"

settings = Settings()
