from typing import Optional, List
from sqlmodel import Field, SQLModel
from datetime import datetime
import json

# Helper for JSON fields in SQLite/Postgres
class JSONField(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

# Base Models
class MissionBase(SQLModel):
    short: str
    long: str

class ProjectBase(SQLModel):
    title: str
    slug: str = Field(index=True, unique=True)
    description: str
    full_description: str
    tags: str = "[]"  # JSON string
    image: Optional[str] = None
    features: str = "[]"  # JSON string

class CourseBase(SQLModel):
    title: str
    description: str
    level: str
    duration: str
    students_count: int = 0

class InternshipBase(SQLModel):
    role: str
    department: str
    location: str
    type: str
    description: str

class ProductBase(SQLModel):
    name: str
    description: str
    features: str = "[]" # JSON string
    specs: str = "{}" # JSON string
    image: Optional[str] = None
    brochure: Optional[str] = None

class ApplicationBase(SQLModel):
    name: str
    email: str
    phone: str
    applied_for: str
    resume_path: str
    status: str = "pending"

class ContentBase(SQLModel):
    hero_title: str = ""
    hero_subtitle: str = ""
    footer_text: str = ""
    contact_email: str = ""
    contact_phone: str = ""
    contact_address: str = ""

class ContactBase(SQLModel):
    name: str
    email: str
    phone: str
    message: str
    status: str = "new"  # new, read, replied

class CoursePurchaseBase(SQLModel):
    name: str
    email: str
    phone: str
    course_id: int
    status: str = "pending"  # pending, confirmed, completed, cancelled
    payment_status: str = "pending"

class ProductInquiryBase(SQLModel):
    name: str
    email: str
    company: str
    message: str
    status: str = "new"  # new, contacted, quoted, closed

class PaymentBase(SQLModel):
    user_email: str
    amount: float
    purpose: str  # project, course, product
    reference_id: Optional[int] = None  # ID of project_request, course_purchase, etc.
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    status: str = "pending"  # pending, completed, failed, refunded

class NotificationBase(SQLModel):
    recipient_email: str
    subject: str
    message: str
    sent_at: Optional[datetime] = None
    is_sent: bool = False

# Projects Management System (PMS) Models
class ProjectTemplateBase(SQLModel):
    title: str
    category: str  # BCA/MCA, Engineering, School, Company, IoT, AI/ML, Robotics, Web/Mobile, Custom
    description: str
    tech_stack: str = "[]"  # JSON string array
    price: Optional[float] = None  # None means negotiable
    time_duration: str  # e.g., "2 weeks", "1 month"
    requirements: str = ""  # JSON string or text
    demo_images: str = "[]"  # JSON string array of image URLs
    demo_video: Optional[str] = None  # Video URL
    is_active: bool = True

class ProjectRequestBase(SQLModel):
    name: str
    email: str
    phone: str
    college_company: str
    project_template_id: Optional[int] = None  # If requesting based on template
    custom_category: Optional[str] = None  # If custom project
    custom_description: str
    deadline: Optional[datetime] = None
    status: str = "pending"  # pending, approved, in_progress, completed, delivered, cancelled
    assigned_to: Optional[str] = None  # Developer name/ID
    progress: int = 0  # 0-100 percentage
    price: Optional[float] = None
    payment_status: str = "pending"  # pending, paid, partial, refunded
    notes: str = ""  # Admin notes

class ProjectFileBase(SQLModel):
    request_id: int
    file_url: str
    file_type: str  # source_code, documentation, report, demo, other
    description: Optional[str] = None

# Database Models
class Admin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str

class Mission(MissionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Course(CourseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Internship(InternshipBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Application(ApplicationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Content(ContentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Contact(ContactBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CoursePurchase(CoursePurchaseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductInquiry(ProductInquiryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Payment(PaymentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Notification(NotificationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Projects Management System (PMS) Database Models
class ProjectTemplate(ProjectTemplateBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectRequest(ProjectRequestBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectFile(ProjectFileBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)
