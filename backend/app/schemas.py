from typing import Optional, List, Any, Dict
from pydantic import BaseModel
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Mission
class MissionCreate(BaseModel):
    short: str
    long: str

class MissionRead(MissionCreate):
    id: int
    created_at: datetime

# Project
class ProjectCreate(BaseModel):
    title: str
    slug: str
    description: str
    full_description: str
    tags: List[str] = []
    image: Optional[str] = None
    features: List[str] = []

class ProjectRead(ProjectCreate):
    id: int
    created_at: datetime

# Course
class CourseCreate(BaseModel):
    title: str
    description: str
    level: str
    duration: str
    students_count: int = 0

class CourseRead(CourseCreate):
    id: int
    created_at: datetime

# Internship
class InternshipCreate(BaseModel):
    role: str
    department: str
    location: str
    type: str
    description: str

class InternshipRead(InternshipCreate):
    id: int
    created_at: datetime

# Product
class ProductCreate(BaseModel):
    name: str
    description: str
    features: List[str] = []
    specs: Dict[str, Any] = {}
    image: Optional[str] = None
    brochure: Optional[str] = None

class ProductRead(ProductCreate):
    id: int
    created_at: datetime

# Content
class ContentCreate(BaseModel):
    hero_title: str = ""
    hero_subtitle: str = ""
    footer_text: str = ""
    contact_email: str = ""
    contact_phone: str = ""
    contact_address: str = ""

class ContentRead(ContentCreate):
    id: int
    updated_at: datetime

# Application Update
class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

# Admin Password Change
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

# Logs
class LogEntry(BaseModel):
    timestamp: datetime
    level: str
    message: str
    source: str

# Application
class ApplicationCreate(BaseModel):
    name: str
    email: str
    phone: str
    applied_for: str

class ApplicationRead(ApplicationCreate):
    id: int
    resume_path: str
    created_at: datetime
    status: Optional[str] = "pending"

# Admin
class AdminLogin(BaseModel):
    username: str
    password: str

# Projects Management System (PMS) Schemas

# Project Template
class ProjectTemplateCreate(BaseModel):
    title: str
    category: str
    description: str
    tech_stack: List[str] = []
    price: Optional[float] = None
    time_duration: str
    requirements: str = ""
    demo_images: List[str] = []
    demo_video: Optional[str] = None
    is_active: bool = True

class ProjectTemplateRead(ProjectTemplateCreate):
    id: int
    created_at: datetime
    updated_at: datetime

class ProjectTemplateUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    price: Optional[float] = None
    time_duration: Optional[str] = None
    requirements: Optional[str] = None
    demo_images: Optional[List[str]] = None
    demo_video: Optional[str] = None
    is_active: Optional[bool] = None

# Project Request
class ProjectRequestCreate(BaseModel):
    name: str
    email: str
    phone: str
    college_company: str
    project_template_id: Optional[int] = None
    custom_category: Optional[str] = None
    custom_description: str
    deadline: Optional[datetime] = None

class ProjectRequestRead(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    college_company: str
    project_template_id: Optional[int] = None
    custom_category: Optional[str] = None
    custom_description: str
    deadline: Optional[datetime] = None
    status: str
    assigned_to: Optional[str] = None
    progress: int
    price: Optional[float] = None
    payment_status: str
    notes: str
    created_at: datetime
    updated_at: datetime

class ProjectRequestUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    progress: Optional[int] = None
    price: Optional[float] = None
    payment_status: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[datetime] = None

# Project File
class ProjectFileCreate(BaseModel):
    request_id: int
    file_url: str
    file_type: str
    description: Optional[str] = None

class ProjectFileRead(ProjectFileCreate):
    id: int
    uploaded_at: datetime

# Contact
class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str

class ContactRead(ContactCreate):
    id: int
    status: str
    created_at: datetime

# Course Purchase
class CoursePurchaseCreate(BaseModel):
    name: str
    email: str
    phone: str
    course_id: int

class CoursePurchaseRead(CoursePurchaseCreate):
    id: int
    status: str
    payment_status: str
    created_at: datetime

class CoursePurchaseUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None

# Product Inquiry
class ProductInquiryCreate(BaseModel):
    name: str
    email: str
    company: str
    message: str

class ProductInquiryRead(ProductInquiryCreate):
    id: int
    status: str
    created_at: datetime

class ProductInquiryUpdate(BaseModel):
    status: Optional[str] = None

# Payment
class PaymentCreate(BaseModel):
    user_email: str
    amount: float
    purpose: str
    reference_id: Optional[int] = None
    payment_method: Optional[str] = None

class PaymentRead(PaymentCreate):
    id: int
    transaction_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

class PaymentUpdate(BaseModel):
    transaction_id: Optional[str] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None

# Notification
class NotificationCreate(BaseModel):
    recipient_email: str
    subject: str
    message: str

class NotificationRead(NotificationCreate):
    id: int
    sent_at: Optional[datetime] = None
    is_sent: bool
    created_at: datetime
