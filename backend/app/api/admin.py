from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app.deps import get_db, get_current_admin
from app.auth import verify_password, create_access_token, get_password_hash
from app.crud import (
    get_admin_by_username, get_applications, get_application_by_id, update_application,
    get_projects, get_project_by_id, create_project, update_project, delete_project,
    get_courses, get_course_by_id, create_course, update_course, delete_course,
    get_internships, get_internship_by_id, create_internship, update_internship, delete_internship,
    get_products, get_product, create_product, update_product,
    get_mission, update_mission,
    get_content, update_content,
    update_admin_password,
    get_project_templates, get_project_template_by_id, create_project_template, update_project_template, delete_project_template,
    get_project_requests, get_project_request_by_id, update_project_request, delete_project_request,
    get_project_files, create_project_file, delete_project_file,
    get_contacts, get_contact_by_id, update_contact_status,
    get_course_purchases, get_course_purchase_by_id, update_course_purchase,
    get_product_inquiries, get_product_inquiry_by_id, update_product_inquiry,
    get_payments, get_payment_by_id, update_payment,
    create_notification, get_notifications, mark_notification_sent
)
from app.schemas import (
    Token, ProjectCreate, ProjectRead, CourseCreate, CourseRead, InternshipCreate, InternshipRead,
    ProductCreate, ProductRead, ApplicationRead, ApplicationUpdate,
    MissionCreate, MissionRead, ContentCreate, ContentRead, PasswordChange,
    ProjectTemplateCreate, ProjectTemplateRead, ProjectTemplateUpdate,
    ProjectRequestRead, ProjectRequestUpdate, ProjectFileCreate, ProjectFileRead,
    ContactRead, CoursePurchaseRead, CoursePurchaseUpdate, ProductInquiryRead, ProductInquiryUpdate,
    PaymentRead, PaymentUpdate, NotificationCreate, NotificationRead
)
from app.config import settings
from datetime import timedelta, datetime
import json
import os
import aiofiles
from pathlib import Path

router = APIRouter()

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = get_admin_by_username(db, form_data.username)
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Applications endpoints
@router.get("/applications", response_model=List[ApplicationRead])
def read_applications(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_applications(db, skip=skip, limit=limit)

@router.get("/applications/{id}", response_model=ApplicationRead)
def read_application(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    application = get_application_by_id(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.put("/applications/{id}", response_model=ApplicationRead)
def update_application_status(
    id: int,
    application_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    application = update_application(db, id, application_update)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

# Projects endpoints
@router.get("/projects", response_model=List[ProjectRead])
def read_admin_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    import json
    projects = get_projects(db, skip=skip, limit=limit)
    # Convert JSON strings to lists for proper Pydantic serialization
    result = []
    for project in projects:
        project_dict = project.model_dump()
        project_dict['tags'] = json.loads(project.tags) if isinstance(project.tags, str) else project.tags
        project_dict['features'] = json.loads(project.features) if isinstance(project.features, str) else project.features
        result.append(project_dict)
    return result

@router.get("/projects/{id}", response_model=ProjectRead)
def read_admin_project(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    import json
    project = get_project_by_id(db, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project_dict = project.model_dump()
    project_dict['tags'] = json.loads(project.tags) if isinstance(project.tags, str) else project.tags
    project_dict['features'] = json.loads(project.features) if isinstance(project.features, str) else project.features
    return project_dict

@router.post("/projects", response_model=ProjectRead)
def create_new_project(
    project: ProjectCreate, 
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    import json
    db_project = create_project(db, project)
    project_dict = db_project.model_dump()
    project_dict['tags'] = json.loads(db_project.tags) if isinstance(db_project.tags, str) else db_project.tags
    project_dict['features'] = json.loads(db_project.features) if isinstance(db_project.features, str) else db_project.features
    return project_dict

@router.put("/projects/{id}", response_model=ProjectRead)
def update_existing_project(
    id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    db_project = update_project(db, id, project)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    project_dict = db_project.model_dump()
    project_dict['tags'] = json.loads(db_project.tags) if isinstance(db_project.tags, str) else db_project.tags
    project_dict['features'] = json.loads(db_project.features) if isinstance(db_project.features, str) else db_project.features
    return project_dict

@router.delete("/projects/{id}")
def delete_existing_project(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    success = delete_project(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Courses endpoints
@router.get("/courses", response_model=List[CourseRead])
def read_admin_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_courses(db, skip=skip, limit=limit)

@router.get("/courses/{id}", response_model=CourseRead)
def read_admin_course(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    course = get_course_by_id(db, id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/courses", response_model=CourseRead)
def create_new_course(
    course: CourseCreate, 
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return create_course(db, course)

@router.put("/courses/{id}", response_model=CourseRead)
def update_existing_course(
    id: int,
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    db_course = update_course(db, id, course)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@router.delete("/courses/{id}")
def delete_existing_course(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    success = delete_course(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

# Internships endpoints
@router.get("/internships", response_model=List[InternshipRead])
def read_admin_internships(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_internships(db, skip=skip, limit=limit)

@router.post("/internships", response_model=InternshipRead)
def create_new_internship(
    internship: InternshipCreate, 
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return create_internship(db, internship)

@router.put("/internships/{id}", response_model=InternshipRead)
def update_existing_internship(
    id: int,
    internship: InternshipCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    db_internship = update_internship(db, id, internship)
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return db_internship

@router.delete("/internships/{id}")
def delete_existing_internship(
    id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    success = delete_internship(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship deleted successfully"}

# Products endpoints
@router.get("/product", response_model=ProductRead)
def read_admin_product(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    product = get_product(db)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_dict = product.model_dump()
    product_dict['features'] = json.loads(product.features) if isinstance(product.features, str) else product.features
    product_dict['specs'] = json.loads(product.specs) if isinstance(product.specs, str) else product.specs
    return product_dict

@router.put("/product", response_model=ProductRead)
def update_existing_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    db_product = update_product(db, product)
    product_dict = db_product.model_dump()
    product_dict['features'] = json.loads(db_product.features) if isinstance(db_product.features, str) else db_product.features
    product_dict['specs'] = json.loads(db_product.specs) if isinstance(db_product.specs, str) else db_product.specs
    return product_dict

@router.post("/product/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPG, PNG, WEBP")
    
    MAX_FILE_SIZE = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    upload_dir = Path("uploads/examples")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"product_{int(os.times().elapsed)}{file_ext}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    return {"url": f"/uploads/examples/{file_path.name}"}

@router.post("/product/upload-brochure")
async def upload_product_brochure(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    ALLOWED_EXTENSIONS = {'.pdf'}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: PDF")
    
    MAX_FILE_SIZE = 20 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")
    
    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"product_brochure_{int(os.times().elapsed)}{file_ext}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    return {"url": f"/uploads/{file_path.name}"}

# Mission endpoints
@router.get("/mission", response_model=MissionRead)
def read_admin_mission(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    mission = get_mission(db)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@router.put("/mission", response_model=MissionRead)
def update_admin_mission(
    mission: MissionCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return update_mission(db, mission)

# Content endpoints
@router.get("/content", response_model=ContentRead)
def read_admin_content(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    content = get_content(db)
    if not content:
        # Return default content
        return ContentRead(
            id=0,
            hero_title="",
            hero_subtitle="",
            footer_text="",
            contact_email="",
            contact_phone="",
            contact_address="",
            updated_at=datetime.utcnow()
        )
    return content

@router.put("/content", response_model=ContentRead)
def update_admin_content(
    content: ContentCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return update_content(db, content)

# Logs endpoint
@router.get("/logs")
def read_admin_logs(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    # Read application logs
    log_file = Path("uploads/application_logs.txt")
    logs = []
    
    if log_file.exists():
        try:
            with open(log_file, 'r') as f:
                lines = f.readlines()
                # Return last 100 lines
                for line in lines[-100:]:
                    logs.append({
                        "timestamp": datetime.utcnow().isoformat(),
                        "level": "INFO",
                        "message": line.strip(),
                        "source": "application"
                    })
        except Exception as e:
            logs.append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": "ERROR",
                "message": f"Error reading logs: {str(e)}",
                "source": "system"
            })
    
    # System health
    try:
        import psutil
        import platform
        
        health = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "platform": platform.system(),
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage('/').percent
            }
        }
    except ImportError:
        import platform
        health = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "platform": platform.system(),
                "note": "psutil not available for detailed metrics"
            }
        }
    
    return {
        "logs": logs,
        "health": health
    }

# Settings endpoint
@router.put("/settings/password")
def change_admin_password(
    password_change: PasswordChange,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    # Verify current password
    if not verify_password(password_change.current_password, current_admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    new_password_hash = get_password_hash(password_change.new_password)
    update_admin_password(db, current_admin.id, new_password_hash)
    
    return {"message": "Password updated successfully"}

# ============================================
# Projects Management System (PMS) - Admin Endpoints
# ============================================

# Project Templates Management
@router.get("/project-templates", response_model=List[ProjectTemplateRead])
def read_admin_templates(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all project templates (admin)"""
    import json
    templates = get_project_templates(db, skip=skip, limit=limit, category=category, is_active=None)
    result = []
    for template in templates:
        template_dict = template.model_dump()
        template_dict['tech_stack'] = json.loads(template.tech_stack) if isinstance(template.tech_stack, str) else template.tech_stack
        template_dict['demo_images'] = json.loads(template.demo_images) if isinstance(template.demo_images, str) else template.demo_images
        result.append(template_dict)
    return result

@router.get("/project-templates/{template_id}", response_model=ProjectTemplateRead)
def read_admin_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific project template (admin)"""
    import json
    template = get_project_template_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Project template not found")
    template_dict = template.model_dump()
    template_dict['tech_stack'] = json.loads(template.tech_stack) if isinstance(template.tech_stack, str) else template.tech_stack
    template_dict['demo_images'] = json.loads(template.demo_images) if isinstance(template.demo_images, str) else template.demo_images
    return template_dict

@router.post("/project-templates", response_model=ProjectTemplateRead)
def create_admin_template(
    template: ProjectTemplateCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Create a new project template"""
    import json
    db_template = create_project_template(db, template)
    template_dict = db_template.model_dump()
    template_dict['tech_stack'] = json.loads(db_template.tech_stack) if isinstance(db_template.tech_stack, str) else db_template.tech_stack
    template_dict['demo_images'] = json.loads(db_template.demo_images) if isinstance(db_template.demo_images, str) else db_template.demo_images
    return template_dict

@router.put("/project-templates/{template_id}", response_model=ProjectTemplateRead)
def update_admin_template(
    template_id: int,
    template: ProjectTemplateUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update a project template"""
    import json
    db_template = update_project_template(db, template_id, template)
    if not db_template:
        raise HTTPException(status_code=404, detail="Project template not found")
    template_dict = db_template.model_dump()
    template_dict['tech_stack'] = json.loads(db_template.tech_stack) if isinstance(db_template.tech_stack, str) else db_template.tech_stack
    template_dict['demo_images'] = json.loads(db_template.demo_images) if isinstance(db_template.demo_images, str) else db_template.demo_images
    return template_dict

@router.delete("/project-templates/{template_id}")
def delete_admin_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Delete a project template"""
    success = delete_project_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project template not found")
    return {"message": "Project template deleted successfully"}

# Project Template File Uploads
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.webm', '.ogg', '.mov'}
ALLOWED_SOURCE_EXTENSIONS = {'.zip', '.rar', '.7z', '.tar', '.gz'}

@router.post("/project-templates/{template_id}/upload-image")
async def upload_template_image(
    template_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Upload demo image for project template"""
    # Verify template exists
    template = get_project_template_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Project template not found")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPG, PNG, WEBP, GIF")
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    upload_dir = Path("uploads/project-templates/images")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"template_{template_id}_{int(os.times().elapsed)}{file_ext}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    return {"url": f"/uploads/project-templates/images/{file_path.name}"}

@router.post("/project-templates/{template_id}/upload-video")
async def upload_template_video(
    template_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Upload demo video for project template"""
    # Verify template exists
    template = get_project_template_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Project template not found")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: MP4, WEBM, OGG, MOV")
    
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 100MB)")
    
    upload_dir = Path("uploads/project-templates/videos")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"template_{template_id}_{int(os.times().elapsed)}{file_ext}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    return {"url": f"/uploads/project-templates/videos/{file_path.name}"}

@router.post("/project-templates/{template_id}/upload-source")
async def upload_template_source(
    template_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Upload source code for project template"""
    # Verify template exists
    template = get_project_template_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Project template not found")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_SOURCE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: ZIP, RAR, 7Z, TAR, GZ")
    
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 50MB)")
    
    upload_dir = Path("uploads/project-templates/source")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"template_{template_id}_{int(os.times().elapsed)}{file_ext}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
    
    return {"url": f"/uploads/project-templates/source/{file_path.name}"}

# Project Requests Management
@router.get("/project-requests", response_model=List[ProjectRequestRead])
def read_admin_requests(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all project requests (admin)"""
    requests = get_project_requests(db, skip=skip, limit=limit, status=status)
    return [req.model_dump() for req in requests]

@router.get("/project-requests/{request_id}", response_model=ProjectRequestRead)
def read_admin_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific project request (admin)"""
    request = get_project_request_by_id(db, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Project request not found")
    return request.model_dump()

@router.put("/project-requests/{request_id}", response_model=ProjectRequestRead)
def update_admin_request(
    request_id: int,
    request_update: ProjectRequestUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update a project request (status, assignment, progress, etc.)"""
    db_request = update_project_request(db, request_id, request_update)
    if not db_request:
        raise HTTPException(status_code=404, detail="Project request not found")
    return db_request.model_dump()

@router.delete("/project-requests/{request_id}")
def delete_admin_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Delete a project request"""
    success = delete_project_request(db, request_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project request not found")
    return {"message": "Project request deleted successfully"}

# Project Files Management
@router.get("/project-requests/{request_id}/files", response_model=List[ProjectFileRead])
def read_admin_request_files(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all files for a project request"""
    files = get_project_files(db, request_id)
    return [file.model_dump() for file in files]

@router.post("/project-requests/{request_id}/files")
async def upload_request_file(
    request_id: int,
    file: UploadFile = File(...),
    file_type: str = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Upload a file for a project request"""
    # Verify request exists
    request = get_project_request_by_id(db, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Project request not found")
    
    # Validate file
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB limit
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 50MB)")
    
    # Save file
    upload_dir = Path("uploads/project-files")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"{request_id}_{int(os.times().elapsed)}_{file.filename}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Create file record
    file_data = ProjectFileCreate(
        request_id=request_id,
        file_url=str(file_path),
        file_type=file_type,
        description=description
    )
    
    db_file = create_project_file(db, file_data)
    return db_file.model_dump()

@router.delete("/project-files/{file_id}")
def delete_admin_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Delete a project file"""
    success = delete_project_file(db, file_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project file not found")
    return {"message": "Project file deleted successfully"}

# ============================================
# Contact Management
# ============================================

@router.get("/contacts", response_model=List[ContactRead])
def read_admin_contacts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all contact submissions"""
    contacts = get_contacts(db, skip=skip, limit=limit, status=status)
    return [contact.model_dump() for contact in contacts]

@router.get("/contacts/{contact_id}", response_model=ContactRead)
def read_admin_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific contact submission"""
    contact = get_contact_by_id(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact.model_dump()

@router.patch("/contacts/{contact_id}/status")
def update_admin_contact_status(
    contact_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update contact submission status"""
    contact = update_contact_status(db, contact_id, status)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact.model_dump()

# ============================================
# Course Purchase Management
# ============================================

@router.get("/course-purchases", response_model=List[CoursePurchaseRead])
def read_admin_purchases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all course purchase requests"""
    purchases = get_course_purchases(db, skip=skip, limit=limit, status=status)
    return [purchase.model_dump() for purchase in purchases]

@router.get("/course-purchases/{purchase_id}", response_model=CoursePurchaseRead)
def read_admin_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific course purchase"""
    purchase = get_course_purchase_by_id(db, purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Course purchase not found")
    return purchase.model_dump()

@router.patch("/course-purchases/{purchase_id}", response_model=CoursePurchaseRead)
def update_admin_purchase(
    purchase_id: int,
    purchase_update: CoursePurchaseUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update course purchase status"""
    purchase = update_course_purchase(db, purchase_id, purchase_update)
    if not purchase:
        raise HTTPException(status_code=404, detail="Course purchase not found")
    return purchase.model_dump()

# ============================================
# Product Inquiry Management
# ============================================

@router.get("/product-inquiries", response_model=List[ProductInquiryRead])
def read_admin_inquiries(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all product inquiries"""
    inquiries = get_product_inquiries(db, skip=skip, limit=limit, status=status)
    return [inquiry.model_dump() for inquiry in inquiries]

@router.get("/product-inquiries/{inquiry_id}", response_model=ProductInquiryRead)
def read_admin_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific product inquiry"""
    inquiry = get_product_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Product inquiry not found")
    return inquiry.model_dump()

@router.patch("/product-inquiries/{inquiry_id}", response_model=ProductInquiryRead)
def update_admin_inquiry(
    inquiry_id: int,
    inquiry_update: ProductInquiryUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update product inquiry status"""
    inquiry = update_product_inquiry(db, inquiry_id, inquiry_update)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Product inquiry not found")
    return inquiry.model_dump()

# ============================================
# Payment Management
# ============================================

@router.get("/payments", response_model=List[PaymentRead])
def read_admin_payments(
    skip: int = 0,
    limit: int = 100,
    user_email: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all payments"""
    payments = get_payments(db, skip=skip, limit=limit, user_email=user_email, status=status)
    return [payment.model_dump() for payment in payments]

@router.get("/payments/{payment_id}", response_model=PaymentRead)
def read_admin_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get a specific payment"""
    payment = get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment.model_dump()

@router.patch("/payments/{payment_id}", response_model=PaymentRead)
def update_admin_payment(
    payment_id: int,
    payment_update: PaymentUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update payment status"""
    payment = update_payment(db, payment_id, payment_update)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment.model_dump()

# ============================================
# Notification Management
# ============================================

@router.post("/notifications/send", response_model=NotificationRead)
def send_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send a notification to a user"""
    db_notification = create_notification(db, notification)
    
    # TODO: Implement actual email sending here using SMTP or service like SendGrid
    # For now, just mark as sent
    mark_notification_sent(db, db_notification.id)
    
    return db_notification.model_dump()

@router.get("/notifications", response_model=List[NotificationRead])
def read_admin_notifications(
    skip: int = 0,
    limit: int = 100,
    recipient_email: Optional[str] = None,
    is_sent: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all notifications"""
    notifications = get_notifications(db, skip=skip, limit=limit, recipient_email=recipient_email, is_sent=is_sent)
    return [notification.model_dump() for notification in notifications]

@router.patch("/notifications/{notification_id}/mark-sent")
def mark_notification_as_sent(
    notification_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Mark a notification as sent"""
    notification = mark_notification_sent(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification.model_dump()
