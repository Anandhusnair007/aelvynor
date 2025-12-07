"""
Pytest configuration and shared fixtures
"""

import pytest
from sqlmodel import Session, create_engine, SQLModel

# Import all models to ensure they're registered with SQLModel
from app.models import (
    Admin, Project, Course, Internship, Product, Application
)


@pytest.fixture(scope="function")
def db_session():
    """
    Create an in-memory SQLite database session for testing.
    Each test gets a fresh database.
    """
    # Create in-memory SQLite database
    engine = create_engine("sqlite:///:memory:", echo=False)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    # Create session
    with Session(engine) as session:
        yield session
    
    # Cleanup happens automatically when engine is closed

