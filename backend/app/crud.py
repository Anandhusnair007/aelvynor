from sqlmodel import Session, select
from app.models import Project, Course, Internship, Product, Application, Admin, Mission, Content, ProjectTemplate, ProjectRequest, ProjectFile, Contact, CoursePurchase, ProductInquiry, Payment, Notification
from app.schemas import ProjectCreate, CourseCreate, InternshipCreate, ProductCreate, ApplicationCreate, MissionCreate, ContentCreate, ApplicationUpdate, ProjectTemplateCreate, ProjectRequestCreate, ProjectRequestUpdate, ProjectFileCreate, ProjectTemplateUpdate, ContactCreate, CoursePurchaseCreate, CoursePurchaseUpdate, ProductInquiryCreate, ProductInquiryUpdate, PaymentCreate, PaymentUpdate, NotificationCreate
from typing import Optional
from datetime import datetime
import json

# Admin
def get_admin_by_username(db: Session, username: str):
    statement = select(Admin).where(Admin.username == username)
    return db.exec(statement).first()

def create_admin(db: Session, username: str, password_hash: str):
    db_admin = Admin(username=username, password_hash=password_hash)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# Mission
def get_mission(db: Session):
    return db.exec(select(Mission)).first()

def create_mission(db: Session, mission: MissionCreate):
    db_mission = Mission(**mission.model_dump())
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    return db_mission

def update_mission(db: Session, mission: MissionCreate):
    db_mission = get_mission(db)
    if not db_mission:
        db_mission = create_mission(db, mission)
    else:
        db_mission.short = mission.short
        db_mission.long = mission.long
        db.add(db_mission)
        db.commit()
        db.refresh(db_mission)
    return db_mission

# Projects
def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(Project).offset(skip).limit(limit)).all()

def get_project_by_slug(db: Session, slug: str):
    return db.exec(select(Project).where(Project.slug == slug)).first()

def get_project_by_id(db: Session, project_id: int):
    return db.get(Project, project_id)

def create_project(db: Session, project: ProjectCreate):
    db_project = Project(
        **project.model_dump(exclude={'tags', 'features'}),
        tags=json.dumps(project.tags),
        features=json.dumps(project.features)
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project: ProjectCreate):
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return None
    db_project.title = project.title
    db_project.slug = project.slug
    db_project.description = project.description
    db_project.full_description = project.full_description
    db_project.tags = json.dumps(project.tags)
    db_project.features = json.dumps(project.features)
    if project.image:
        db_project.image = project.image
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return False
    db.delete(db_project)
    db.commit()
    return True

# Courses
def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(Course).offset(skip).limit(limit)).all()

def get_course_by_id(db: Session, course_id: int):
    return db.get(Course, course_id)

def create_course(db: Session, course: CourseCreate):
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: int, course: CourseCreate):
    db_course = get_course_by_id(db, course_id)
    if not db_course:
        return None
    for key, value in course.model_dump().items():
        setattr(db_course, key, value)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    db_course = get_course_by_id(db, course_id)
    if not db_course:
        return False
    db.delete(db_course)
    db.commit()
    return True

# Internships
def get_internships(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(Internship).offset(skip).limit(limit)).all()

def get_internship_by_id(db: Session, internship_id: int):
    return db.get(Internship, internship_id)

def create_internship(db: Session, internship: InternshipCreate):
    db_internship = Internship(**internship.model_dump())
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

def update_internship(db: Session, internship_id: int, internship: InternshipCreate):
    db_internship = get_internship_by_id(db, internship_id)
    if not db_internship:
        return None
    for key, value in internship.model_dump().items():
        setattr(db_internship, key, value)
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

def delete_internship(db: Session, internship_id: int):
    db_internship = get_internship_by_id(db, internship_id)
    if not db_internship:
        return False
    db.delete(db_internship)
    db.commit()
    return True

# Products
def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(Product).offset(skip).limit(limit)).all()

def get_product_by_id(db: Session, product_id: int):
    return db.get(Product, product_id)

def get_product(db: Session):
    return db.exec(select(Product)).first()

def create_product(db: Session, product: ProductCreate):
    db_product = Product(
        **product.model_dump(exclude={'features', 'specs'}),
        features=json.dumps(product.features),
        specs=json.dumps(product.specs)
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product: ProductCreate):
    db_product = get_product(db)
    if not db_product:
        db_product = create_product(db, product)
    else:
        db_product.name = product.name
        db_product.description = product.description
        db_product.features = json.dumps(product.features)
        db_product.specs = json.dumps(product.specs)
        if product.image:
            db_product.image = product.image
        if product.brochure:
            db_product.brochure = product.brochure
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    return db_product

# Applications
def create_application(db: Session, application: ApplicationCreate, resume_path: str):
    db_application = Application(
        **application.model_dump(),
        resume_path=resume_path,
        status="pending"  # Explicitly set status
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_applications(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(Application).order_by(Application.created_at.desc()).offset(skip).limit(limit)).all()

def get_application_by_id(db: Session, application_id: int):
    return db.get(Application, application_id)

def update_application(db: Session, application_id: int, application_update: ApplicationUpdate):
    db_application = get_application_by_id(db, application_id)
    if not db_application:
        return None
    if application_update.status:
        db_application.status = application_update.status
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

# Content
def get_content(db: Session):
    return db.exec(select(Content)).first()

def create_content(db: Session, content: ContentCreate):
    db_content = Content(**content.model_dump())
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

def update_content(db: Session, content: ContentCreate):
    db_content = get_content(db)
    if not db_content:
        db_content = create_content(db, content)
    else:
        for key, value in content.model_dump().items():
            setattr(db_content, key, value)
        db_content.updated_at = datetime.utcnow()
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
    return db_content

# Admin
def update_admin_password(db: Session, admin_id: int, new_password_hash: str):
    admin = db.get(Admin, admin_id)
    if not admin:
        return None
    admin.password_hash = new_password_hash
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

# Projects Management System (PMS) CRUD

# Project Templates
def get_project_templates(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None, is_active: Optional[bool] = True):
    statement = select(ProjectTemplate)
    if category:
        statement = statement.where(ProjectTemplate.category == category)
    if is_active is not None:
        statement = statement.where(ProjectTemplate.is_active == is_active)
    return db.exec(statement.offset(skip).limit(limit)).all()

def get_project_template_by_id(db: Session, template_id: int):
    return db.get(ProjectTemplate, template_id)

def create_project_template(db: Session, template: ProjectTemplateCreate):
    import json
    db_template = ProjectTemplate(
        title=template.title,
        category=template.category,
        description=template.description,
        tech_stack=json.dumps(template.tech_stack) if template.tech_stack else "[]",
        price=template.price,
        time_duration=template.time_duration,
        requirements=template.requirements,
        demo_images=json.dumps(template.demo_images) if template.demo_images else "[]",
        demo_video=template.demo_video,
        is_active=template.is_active
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_project_template(db: Session, template_id: int, template: ProjectTemplateUpdate):
    import json
    db_template = db.get(ProjectTemplate, template_id)
    if not db_template:
        return None
    update_data = template.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key in ['tech_stack', 'demo_images'] and value is not None:
            setattr(db_template, key, json.dumps(value))
        else:
            setattr(db_template, key, value)
    db_template.updated_at = datetime.utcnow()
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def delete_project_template(db: Session, template_id: int):
    db_template = db.get(ProjectTemplate, template_id)
    if not db_template:
        return False
    db.delete(db_template)
    db.commit()
    return True

# Project Requests
def get_project_requests(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None, email: Optional[str] = None):
    statement = select(ProjectRequest)
    if status:
        statement = statement.where(ProjectRequest.status == status)
    if email:
        statement = statement.where(ProjectRequest.email == email)
    return db.exec(statement.order_by(ProjectRequest.created_at.desc()).offset(skip).limit(limit)).all()

def get_project_request_by_id(db: Session, request_id: int):
    return db.get(ProjectRequest, request_id)

def create_project_request(db: Session, request: ProjectRequestCreate):
    db_request = ProjectRequest(**request.model_dump())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def update_project_request(db: Session, request_id: int, request: ProjectRequestUpdate):
    db_request = db.get(ProjectRequest, request_id)
    if not db_request:
        return None
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_request, key, value)
    db_request.updated_at = datetime.utcnow()
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def delete_project_request(db: Session, request_id: int):
    db_request = db.get(ProjectRequest, request_id)
    if not db_request:
        return False
    db.delete(db_request)
    db.commit()
    return True

# Project Files
def get_project_files(db: Session, request_id: int):
    return db.exec(select(ProjectFile).where(ProjectFile.request_id == request_id)).all()

def get_project_file_by_id(db: Session, file_id: int):
    return db.get(ProjectFile, file_id)

def create_project_file(db: Session, file: ProjectFileCreate):
    db_file = ProjectFile(**file.model_dump())
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def delete_project_file(db: Session, file_id: int):
    db_file = db.get(ProjectFile, file_id)
    if not db_file:
        return False
    db.delete(db_file)
    db.commit()
    return True

# Contact
def create_contact(db: Session, contact: ContactCreate):
    db_contact = Contact(**contact.model_dump(), status="new")
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_contacts(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    statement = select(Contact)
    if status:
        statement = statement.where(Contact.status == status)
    return db.exec(statement.order_by(Contact.created_at.desc()).offset(skip).limit(limit)).all()

def get_contact_by_id(db: Session, contact_id: int):
    return db.get(Contact, contact_id)

def update_contact_status(db: Session, contact_id: int, status: str):
    db_contact = db.get(Contact, contact_id)
    if not db_contact:
        return None
    db_contact.status = status
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# Course Purchase
def create_course_purchase(db: Session, purchase: CoursePurchaseCreate):
    db_purchase = CoursePurchase(**purchase.model_dump())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def get_course_purchases(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    statement = select(CoursePurchase)
    if status:
        statement = statement.where(CoursePurchase.status == status)
    return db.exec(statement.order_by(CoursePurchase.created_at.desc()).offset(skip).limit(limit)).all()

def get_course_purchase_by_id(db: Session, purchase_id: int):
    return db.get(CoursePurchase, purchase_id)

def update_course_purchase(db: Session, purchase_id: int, purchase: CoursePurchaseUpdate):
    db_purchase = db.get(CoursePurchase, purchase_id)
    if not db_purchase:
        return None
    update_data = purchase.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_purchase, key, value)
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

# Product Inquiry
def create_product_inquiry(db: Session, inquiry: ProductInquiryCreate):
    db_inquiry = ProductInquiry(**inquiry.model_dump(), status="new")
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry

def get_product_inquiries(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    statement = select(ProductInquiry)
    if status:
        statement = statement.where(ProductInquiry.status == status)
    return db.exec(statement.order_by(ProductInquiry.created_at.desc()).offset(skip).limit(limit)).all()

def get_product_inquiry_by_id(db: Session, inquiry_id: int):
    return db.get(ProductInquiry, inquiry_id)

def update_product_inquiry(db: Session, inquiry_id: int, inquiry: ProductInquiryUpdate):
    db_inquiry = db.get(ProductInquiry, inquiry_id)
    if not db_inquiry:
        return None
    update_data = inquiry.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_inquiry, key, value)
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry

# Payment
def create_payment(db: Session, payment: PaymentCreate):
    db_payment = Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payments(db: Session, skip: int = 0, limit: int = 100, user_email: Optional[str] = None, status: Optional[str] = None):
    statement = select(Payment)
    if user_email:
        statement = statement.where(Payment.user_email == user_email)
    if status:
        statement = statement.where(Payment.status == status)
    return db.exec(statement.order_by(Payment.created_at.desc()).offset(skip).limit(limit)).all()

def get_payment_by_id(db: Session, payment_id: int):
    return db.get(Payment, payment_id)

def update_payment(db: Session, payment_id: int, payment: PaymentUpdate):
    db_payment = db.get(Payment, payment_id)
    if not db_payment:
        return None
    update_data = payment.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_payment, key, value)
    db_payment.updated_at = datetime.utcnow()
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

# Notification
def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notifications(db: Session, skip: int = 0, limit: int = 100, recipient_email: Optional[str] = None, is_sent: Optional[bool] = None):
    statement = select(Notification)
    if recipient_email:
        statement = statement.where(Notification.recipient_email == recipient_email)
    if is_sent is not None:
        statement = statement.where(Notification.is_sent == is_sent)
    return db.exec(statement.order_by(Notification.created_at.desc()).offset(skip).limit(limit)).all()

def mark_notification_sent(db: Session, notification_id: int):
    db_notification = db.get(Notification, notification_id)
    if not db_notification:
        return None
    db_notification.is_sent = True
    db_notification.sent_at = datetime.utcnow()
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
