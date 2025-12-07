"""
Unit tests for CRUD operations
Uses SQLite in-memory database for testing
"""

import pytest
from sqlmodel import Session, create_engine, SQLModel
from datetime import datetime

from app.models import (
    Admin, Project, Course, Internship, Product, Application,
    ApplicationStatus
)
from app.crud import (
    # Admin CRUD
    create_admin, get_admin, get_admin_by_username, get_admins, update_admin, delete_admin,
    # Project CRUD
    create_project, get_project, get_projects, update_project, delete_project,
    # Course CRUD
    create_course, get_course, get_courses, update_course, delete_course,
    # Internship CRUD
    create_internship, get_internship, get_internships, update_internship, delete_internship,
    # Product CRUD
    create_product, get_product, get_products, update_product, delete_product,
    # Application CRUD
    create_application, get_application, get_applications, update_application, delete_application
)
from app.schemas import (
    ProjectCreate, ProjectUpdate,
    CourseCreate, CourseUpdate,
    InternshipCreate, InternshipUpdate,
    ProductCreate, ProductUpdate,
    ApplicationCreate, ApplicationUpdate
)
from app.auth import get_password_hash
import bcrypt


# Test fixture for database session
@pytest.fixture
def db_session():
    """Create an in-memory SQLite database session for testing"""
    # Create in-memory SQLite database
    engine = create_engine("sqlite:///:memory:", echo=False)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    # Create session
    with Session(engine) as session:
        yield session
    
    # Cleanup (tables are dropped when engine is closed)


# ==================== Admin CRUD Tests ====================

def test_create_admin(db_session: Session):
    """Test creating an admin"""
    # Use bcrypt directly to avoid passlib compatibility issues in tests
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = create_admin(
        db_session,
        username="test_admin",
        password_hash=password_hash,
        email="admin@test.com",
        full_name="Test Admin"
    )
    
    assert admin.id is not None
    assert admin.username == "test_admin"
    assert admin.email == "admin@test.com"
    assert admin.full_name == "Test Admin"
    assert admin.is_active is True
    assert admin.is_superuser is False
    assert admin.created_at is not None


def test_get_admin(db_session: Session):
    """Test getting an admin by ID"""
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = create_admin(db_session, username="test_admin", password_hash=password_hash)
    
    retrieved = get_admin(db_session, admin.id)
    assert retrieved is not None
    assert retrieved.id == admin.id
    assert retrieved.username == "test_admin"


def test_get_admin_by_username(db_session: Session):
    """Test getting an admin by username"""
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = create_admin(db_session, username="test_admin", password_hash=password_hash)
    
    retrieved = get_admin_by_username(db_session, "test_admin")
    assert retrieved is not None
    assert retrieved.username == "test_admin"
    assert retrieved.id == admin.id


def test_get_admins(db_session: Session):
    """Test getting all admins"""
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    create_admin(db_session, username="admin1", password_hash=password_hash)
    create_admin(db_session, username="admin2", password_hash=password_hash)
    
    admins = get_admins(db_session)
    assert len(admins) == 2


def test_update_admin(db_session: Session):
    """Test updating an admin"""
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = create_admin(db_session, username="test_admin", password_hash=password_hash)
    
    updated = update_admin(
        db_session,
        admin.id,
        email="newemail@test.com",
        full_name="Updated Name",
        is_active=False
    )
    
    assert updated is not None
    assert updated.email == "newemail@test.com"
    assert updated.full_name == "Updated Name"
    assert updated.is_active is False


def test_delete_admin(db_session: Session):
    """Test deleting an admin"""
    password_hash = bcrypt.hashpw("test_password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = create_admin(db_session, username="test_admin", password_hash=password_hash)
    
    result = delete_admin(db_session, admin.id)
    assert result is True
    
    retrieved = get_admin(db_session, admin.id)
    assert retrieved is None


# ==================== Project CRUD Tests ====================

def test_create_project(db_session: Session):
    """Test creating a project"""
    project_data = ProjectCreate(
        title="Test Project",
        description="Test description",
        image_url="https://example.com/image.jpg",
        github_url="https://github.com/test",
        is_active=True
    )
    
    project = create_project(db_session, project_data)
    
    assert project.id is not None
    assert project.title == "Test Project"
    assert project.description == "Test description"
    assert project.github_url == "https://github.com/test"
    assert project.is_active is True
    assert project.created_at is not None


def test_get_project(db_session: Session):
    """Test getting a project by ID"""
    project_data = ProjectCreate(title="Test Project")
    project = create_project(db_session, project_data)
    
    retrieved = get_project(db_session, project.id)
    assert retrieved is not None
    assert retrieved.id == project.id
    assert retrieved.title == "Test Project"


def test_get_projects(db_session: Session):
    """Test getting all projects"""
    create_project(db_session, ProjectCreate(title="Project 1", is_active=True))
    create_project(db_session, ProjectCreate(title="Project 2", is_active=True))
    create_project(db_session, ProjectCreate(title="Project 3", is_active=False))
    
    # Get all projects
    all_projects = get_projects(db_session)
    assert len(all_projects) == 3
    
    # Get only active projects
    active_projects = get_projects(db_session, active_only=True)
    assert len(active_projects) == 2


def test_update_project(db_session: Session):
    """Test updating a project"""
    project = create_project(db_session, ProjectCreate(title="Original Title"))
    
    update_data = ProjectUpdate(title="Updated Title", description="New description")
    updated = update_project(db_session, project.id, update_data)
    
    assert updated is not None
    assert updated.title == "Updated Title"
    assert updated.description == "New description"


def test_delete_project(db_session: Session):
    """Test deleting a project"""
    project = create_project(db_session, ProjectCreate(title="Test Project"))
    
    result = delete_project(db_session, project.id)
    assert result is True
    
    retrieved = get_project(db_session, project.id)
    assert retrieved is None


# ==================== Course CRUD Tests ====================

def test_create_course(db_session: Session):
    """Test creating a course"""
    course_data = CourseCreate(
        title="Python Basics",
        description="Learn Python fundamentals",
        instructor="John Doe",
        duration="10 weeks",
        price=99.99,
        is_active=True
    )
    
    course = create_course(db_session, course_data)
    
    assert course.id is not None
    assert course.title == "Python Basics"
    assert course.instructor == "John Doe"
    assert course.price == 99.99
    assert course.is_active is True


def test_get_course(db_session: Session):
    """Test getting a course by ID"""
    course = create_course(db_session, CourseCreate(title="Test Course"))
    
    retrieved = get_course(db_session, course.id)
    assert retrieved is not None
    assert retrieved.id == course.id
    assert retrieved.title == "Test Course"


def test_get_courses(db_session: Session):
    """Test getting all courses"""
    create_course(db_session, CourseCreate(title="Course 1", is_active=True))
    create_course(db_session, CourseCreate(title="Course 2", is_active=True))
    create_course(db_session, CourseCreate(title="Course 3", is_active=False))
    
    all_courses = get_courses(db_session)
    assert len(all_courses) == 3
    
    active_courses = get_courses(db_session, active_only=True)
    assert len(active_courses) == 2


def test_update_course(db_session: Session):
    """Test updating a course"""
    course = create_course(db_session, CourseCreate(title="Original Course"))
    
    update_data = CourseUpdate(title="Updated Course", price=149.99)
    updated = update_course(db_session, course.id, update_data)
    
    assert updated is not None
    assert updated.title == "Updated Course"
    assert updated.price == 149.99


def test_delete_course(db_session: Session):
    """Test deleting a course"""
    course = create_course(db_session, CourseCreate(title="Test Course"))
    
    result = delete_course(db_session, course.id)
    assert result is True
    
    retrieved = get_course(db_session, course.id)
    assert retrieved is None


# ==================== Internship CRUD Tests ====================

def test_create_internship(db_session: Session):
    """Test creating an internship"""
    internship_data = InternshipCreate(
        title="Software Engineering Intern",
        description="Join our team",
        company="Tech Corp",
        location="Remote",
        duration="3 months",
        stipend=5000.00,
        is_active=True
    )
    
    internship = create_internship(db_session, internship_data)
    
    assert internship.id is not None
    assert internship.title == "Software Engineering Intern"
    assert internship.company == "Tech Corp"
    assert internship.stipend == 5000.00
    assert internship.is_active is True


def test_get_internship(db_session: Session):
    """Test getting an internship by ID"""
    internship = create_internship(db_session, InternshipCreate(title="Test Internship"))
    
    retrieved = get_internship(db_session, internship.id)
    assert retrieved is not None
    assert retrieved.id == internship.id
    assert retrieved.title == "Test Internship"


def test_get_internships(db_session: Session):
    """Test getting all internships"""
    create_internship(db_session, InternshipCreate(title="Internship 1", is_active=True))
    create_internship(db_session, InternshipCreate(title="Internship 2", is_active=True))
    create_internship(db_session, InternshipCreate(title="Internship 3", is_active=False))
    
    all_internships = get_internships(db_session)
    assert len(all_internships) == 3
    
    active_internships = get_internships(db_session, active_only=True)
    assert len(active_internships) == 2


def test_update_internship(db_session: Session):
    """Test updating an internship"""
    internship = create_internship(db_session, InternshipCreate(title="Original Internship"))
    
    update_data = InternshipUpdate(title="Updated Internship", stipend=6000.00)
    updated = update_internship(db_session, internship.id, update_data)
    
    assert updated is not None
    assert updated.title == "Updated Internship"
    assert updated.stipend == 6000.00


def test_delete_internship(db_session: Session):
    """Test deleting an internship"""
    internship = create_internship(db_session, InternshipCreate(title="Test Internship"))
    
    result = delete_internship(db_session, internship.id)
    assert result is True
    
    retrieved = get_internship(db_session, internship.id)
    assert retrieved is None


# ==================== Product CRUD Tests ====================

def test_create_product(db_session: Session):
    """Test creating a product"""
    product_data = ProductCreate(
        name="Test Product",
        description="A test product",
        price=29.99,
        stock=100,
        category="Electronics",
        is_active=True
    )
    
    product = create_product(db_session, product_data)
    
    assert product.id is not None
    assert product.name == "Test Product"
    assert product.price == 29.99
    assert product.stock == 100
    assert product.category == "Electronics"
    assert product.is_active is True


def test_get_product(db_session: Session):
    """Test getting a product by ID"""
    product = create_product(db_session, ProductCreate(name="Test Product", price=10.00))
    
    retrieved = get_product(db_session, product.id)
    assert retrieved is not None
    assert retrieved.id == product.id
    assert retrieved.name == "Test Product"


def test_get_products(db_session: Session):
    """Test getting all products"""
    create_product(db_session, ProductCreate(name="Product 1", price=10.00, is_active=True))
    create_product(db_session, ProductCreate(name="Product 2", price=20.00, is_active=True))
    create_product(db_session, ProductCreate(name="Product 3", price=30.00, is_active=False))
    
    all_products = get_products(db_session)
    assert len(all_products) == 3
    
    active_products = get_products(db_session, active_only=True)
    assert len(active_products) == 2


def test_update_product(db_session: Session):
    """Test updating a product"""
    product = create_product(db_session, ProductCreate(name="Original Product", price=10.00))
    
    update_data = ProductUpdate(name="Updated Product", price=15.00, stock=50)
    updated = update_product(db_session, product.id, update_data)
    
    assert updated is not None
    assert updated.name == "Updated Product"
    assert updated.price == 15.00
    assert updated.stock == 50


def test_delete_product(db_session: Session):
    """Test deleting a product"""
    product = create_product(db_session, ProductCreate(name="Test Product", price=10.00))
    
    result = delete_product(db_session, product.id)
    assert result is True
    
    retrieved = get_product(db_session, product.id)
    assert retrieved is None


# ==================== Application CRUD Tests ====================

def test_create_application(db_session: Session):
    """Test creating an application"""
    application_data = ApplicationCreate(
        full_name="John Doe",
        email="john@example.com",
        phone="123-456-7890",
        cover_letter="I'm interested in this position",
        position_type="internship",
        position_id=1
    )
    
    application = create_application(db_session, application_data, resume_url="uploads/resume.pdf")
    
    assert application.id is not None
    assert application.full_name == "John Doe"
    assert application.email == "john@example.com"
    assert application.position_type == "internship"
    assert application.status == ApplicationStatus.PENDING
    assert application.resume_url == "uploads/resume.pdf"


def test_get_application(db_session: Session):
    """Test getting an application by ID"""
    application_data = ApplicationCreate(
        full_name="Jane Doe",
        email="jane@example.com",
        position_type="course",
        position_id=1
    )
    application = create_application(db_session, application_data)
    
    retrieved = get_application(db_session, application.id)
    assert retrieved is not None
    assert retrieved.id == application.id
    assert retrieved.email == "jane@example.com"


def test_get_applications(db_session: Session):
    """Test getting all applications"""
    create_application(
        db_session,
        ApplicationCreate(full_name="App1", email="app1@test.com", position_type="project", position_id=1)
    )
    create_application(
        db_session,
        ApplicationCreate(full_name="App2", email="app2@test.com", position_type="course", position_id=1)
    )
    
    applications = get_applications(db_session)
    assert len(applications) == 2


def test_update_application(db_session: Session):
    """Test updating an application"""
    application_data = ApplicationCreate(
        full_name="John Doe",
        email="john@example.com",
        position_type="internship",
        position_id=1
    )
    application = create_application(db_session, application_data)
    
    update_data = ApplicationUpdate(status=ApplicationStatus.ACCEPTED)
    updated = update_application(db_session, application.id, update_data)
    
    assert updated is not None
    assert updated.status == ApplicationStatus.ACCEPTED


def test_delete_application(db_session: Session):
    """Test deleting an application"""
    application_data = ApplicationCreate(
        full_name="John Doe",
        email="john@example.com",
        position_type="internship",
        position_id=1
    )
    application = create_application(db_session, application_data)
    
    result = delete_application(db_session, application.id)
    assert result is True
    
    retrieved = get_application(db_session, application.id)
    assert retrieved is None


# ==================== Edge Cases and Error Handling ====================

def test_get_nonexistent_project(db_session: Session):
    """Test getting a project that doesn't exist"""
    project = get_project(db_session, 999)
    assert project is None


def test_update_nonexistent_project(db_session: Session):
    """Test updating a project that doesn't exist"""
    update_data = ProjectUpdate(title="New Title")
    result = update_project(db_session, 999, update_data)
    assert result is None


def test_delete_nonexistent_project(db_session: Session):
    """Test deleting a project that doesn't exist"""
    result = delete_project(db_session, 999)
    assert result is False


def test_get_projects_with_pagination(db_session: Session):
    """Test getting projects with pagination"""
    # Create 5 projects
    for i in range(5):
        create_project(db_session, ProjectCreate(title=f"Project {i+1}"))
    
    # Get first 2 projects
    projects = get_projects(db_session, skip=0, limit=2)
    assert len(projects) == 2
    
    # Get next 2 projects
    projects = get_projects(db_session, skip=2, limit=2)
    assert len(projects) == 2
    
    # Get remaining projects
    projects = get_projects(db_session, skip=4, limit=2)
    assert len(projects) == 1

