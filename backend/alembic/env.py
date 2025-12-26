import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Load environment variables from .env in backend root
load_dotenv()

# Add backend folder to sys.path so Alembic can import your models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import your Base metadata
from app.db.base import Base

# Alembic Config object
config = context.config

# Override sqlalchemy.url with env var
db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise Exception("DATABASE_URL not set in .env")
config.set_main_option("sqlalchemy.url", db_url)

# Interpret the config file for Python logging
fileConfig(config.config_file_name)

# this is your model's MetaData object
target_metadata = Base.metadata


# Offline migrations
def run_migrations_offline():
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


# Online migrations
def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
