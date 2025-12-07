from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session
from app.deps import get_db
from app.crud import get_projects, get_project_by_slug, get_courses, get_internships, get_products, create_application, get_mission, get_project_templates, get_project_template_by_id, create_project_request, get_project_requests, get_project_files, create_contact, create_course_purchase, create_product_inquiry, create_payment, get_payments
from app.schemas import ProjectRead, CourseRead, InternshipRead, ProductRead, ApplicationCreate, MissionRead, ProjectTemplateRead, ProjectRequestCreate, ProjectRequestRead, ProjectFileRead, ContactCreate, CoursePurchaseCreate, ProductInquiryCreate, PaymentCreate, PaymentRead
import shutil
import os
from pathlib import Path
import aiofiles

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "aelvynor-backend"}

@router.get("/mission", response_model=MissionRead)
def read_mission(db: Session = Depends(get_db)):
    mission = get_mission(db)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@router.get("/projects", response_model=List[ProjectRead])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
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

@router.get("/projects/{slug}", response_model=ProjectRead)
def read_project(slug: str, db: Session = Depends(get_db)):
    import json
    project = get_project_by_slug(db, slug=slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Convert JSON strings to lists
    project_dict = project.model_dump()
    project_dict['tags'] = json.loads(project.tags) if isinstance(project.tags, str) else project.tags
    project_dict['features'] = json.loads(project.features) if isinstance(project.features, str) else project.features
    return project_dict

@router.get("/courses", response_model=List[CourseRead])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_courses(db, skip=skip, limit=limit)

@router.get("/internships", response_model=List[InternshipRead])
def read_internships(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_internships(db, skip=skip, limit=limit)

@router.get("/product", response_model=List[ProductRead])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    import json
    products = get_products(db, skip=skip, limit=limit)
    # Convert JSON strings to proper types for Pydantic serialization
    result = []
    for product in products:
        product_dict = product.model_dump()
        product_dict['features'] = json.loads(product.features) if isinstance(product.features, str) else product.features
        product_dict['specs'] = json.loads(product.specs) if isinstance(product.specs, str) else product.specs
        result.append(product_dict)
    return result

@router.post("/apply")
async def apply_for_position(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    applied_for: str = Form(...),
    resume: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    resume_path = ""
    
    # Handle file upload if provided
    if resume and resume.filename:
        # Validate file size (5MB limit)
        MAX_FILE_SIZE = 5 * 1024 * 1024
        resume.file.seek(0, 2)
        size = resume.file.tell()
        resume.file.seek(0)
        
        if size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")
        
        # Validate file type
        ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
        file_ext = Path(resume.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed: PDF, DOC, DOCX")
        
        # Save file
        upload_dir = Path("uploads/resumes")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = upload_dir / f"{name.replace(' ', '_')}_{int(os.times().elapsed)}_{resume.filename}"
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await resume.read()
            await out_file.write(content)
        
        resume_path = str(file_path)
    
    application_data = ApplicationCreate(
        name=name,
        email=email,
        phone=phone,
        applied_for=applied_for
    )
    
    create_application(db, application_data, resume_path)
    
    return {"message": "Application submitted successfully"}

# ============================================
# Projects Management System (PMS) - Public Endpoints
# ============================================

@router.get("/project-templates", response_model=List[ProjectTemplateRead])
def get_templates(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of available project templates"""
    import json
    templates = get_project_templates(db, skip=skip, limit=limit, category=category, is_active=True)
    result = []
    for template in templates:
        template_dict = template.model_dump()
        template_dict['tech_stack'] = json.loads(template.tech_stack) if isinstance(template.tech_stack, str) else template.tech_stack
        template_dict['demo_images'] = json.loads(template.demo_images) if isinstance(template.demo_images, str) else template.demo_images
        result.append(template_dict)
    return result

@router.get("/project-templates/{template_id}", response_model=ProjectTemplateRead)
def get_template_by_id(template_id: int, db: Session = Depends(get_db)):
    """Get a specific project template by ID"""
    import json
    template = get_project_template_by_id(db, template_id)
    if not template or not template.is_active:
        raise HTTPException(status_code=404, detail="Project template not found")
    template_dict = template.model_dump()
    template_dict['tech_stack'] = json.loads(template.tech_stack) if isinstance(template.tech_stack, str) else template.tech_stack
    template_dict['demo_images'] = json.loads(template.demo_images) if isinstance(template.demo_images, str) else template.demo_images
    return template_dict

@router.get("/project-templates/categories/list")
def get_categories():
    """Get list of available project categories"""
    return {
        "categories": [
            "BCA / MCA",
            "Engineering",
            "School",
            "Company",
            "IoT",
            "AI/ML",
            "Robotics",
            "Web/Mobile",
            "Custom"
        ]
    }

@router.post("/project-request")
async def submit_project_request(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    college_company: str = Form(...),
    custom_description: str = Form(...),
    project_template_id: Optional[int] = Form(None),
    custom_category: Optional[str] = Form(None),
    deadline: Optional[str] = Form(None),
    documents: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db)
):
    """Submit a new project request"""
    from datetime import datetime
    from app.schemas import ProjectRequestCreate
    
    # Parse deadline if provided
    deadline_date = None
    if deadline:
        try:
            deadline_date = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
        except:
            pass
    
    # Handle document uploads
    uploaded_files = []
    if documents:
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB limit
        ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.zip', '.rar'}
        upload_dir = Path("uploads/project-requests")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        for doc in documents:
            if not doc.filename:
                continue
                
            # Validate file size
            doc.file.seek(0, 2)
            size = doc.file.tell()
            doc.file.seek(0)
            
            if size > MAX_FILE_SIZE:
                continue  # Skip files that are too large
            
            # Validate file type
            file_ext = Path(doc.filename).suffix.lower()
            if file_ext not in ALLOWED_EXTENSIONS:
                continue
            
            # Save file
            file_path = upload_dir / f"{name.replace(' ', '_')}_{int(os.times().elapsed)}_{doc.filename}"
            async with aiofiles.open(file_path, 'wb') as out_file:
                content = await doc.read()
                await out_file.write(content)
            
            uploaded_files.append(str(file_path))
    
    # Create request
    request_data = ProjectRequestCreate(
        name=name,
        email=email,
        phone=phone,
        college_company=college_company,
        project_template_id=project_template_id,
        custom_category=custom_category,
        custom_description=custom_description,
        deadline=deadline_date
    )
    
    request = create_project_request(db, request_data)
    
    # Store uploaded files info in notes for now (will be moved to project_files table later)
    if uploaded_files:
        request.notes = f"Uploaded files: {', '.join(uploaded_files)}"
        db.add(request)
        db.commit()
    
    return {
        "id": request.id,
        "message": "Project request submitted successfully",
        "status": request.status
    }

@router.get("/project-requests/{email}", response_model=List[ProjectRequestRead])
def get_user_requests(email: str, db: Session = Depends(get_db)):
    """Get all project requests for a specific user (by email)"""
    requests = get_project_requests(db, email=email)
    return [req.model_dump() for req in requests]

@router.get("/project-requests/{request_id}/files", response_model=List[ProjectFileRead])
def get_request_files(request_id: int, db: Session = Depends(get_db)):
    """Get all files associated with a project request"""
    files = get_project_files(db, request_id)
    return [file.model_dump() for file in files]

# ============================================
# Contact, Course Purchase, Product Inquiry, Payment
# ============================================

@router.post("/contact")
async def submit_contact(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    """Submit contact form"""
    contact_data = ContactCreate(
        name=name,
        email=email,
        phone=phone,
        message=message
    )
    
    contact = create_contact(db, contact_data)
    
    return {
        "id": contact.id,
        "message": "Contact form submitted successfully",
        "status": "received"
    }

@router.post("/courses/purchase")
async def purchase_course(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    course_id: int = Form(...),
    db: Session = Depends(get_db)
):
    """Request course purchase"""
    # Verify course exists
    from app.crud import get_course_by_id
    course = get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    purchase_data = CoursePurchaseCreate(
        name=name,
        email=email,
        phone=phone,
        course_id=course_id
    )
    
    purchase = create_course_purchase(db, purchase_data)
    
    return {
        "id": purchase.id,
        "message": "Course purchase request submitted successfully",
        "course": course.title,
        "status": "pending"
    }

@router.post("/product/inquiry")
async def submit_product_inquiry(
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    """Submit product inquiry"""
    inquiry_data = ProductInquiryCreate(
        name=name,
        email=email,
        company=company,
        message=message
    )
    
    inquiry = create_product_inquiry(db, inquiry_data)
    
    return {
        "id": inquiry.id,
        "message": "Product inquiry submitted successfully",
        "status": "received"
    }

@router.post("/payment/create", response_model=PaymentRead)
async def create_new_payment(
    user_email: str = Form(...),
    amount: float = Form(...),
    purpose: str = Form(...),
    reference_id: Optional[int] = Form(None),
    payment_method: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Create new payment record"""
    payment_data = PaymentCreate(
        user_email=user_email,
        amount=amount,
        purpose=purpose,
        reference_id=reference_id,
        payment_method=payment_method
    )
    
    payment = create_payment(db, payment_data)
    return payment.model_dump()

@router.get("/payment/history/{email}", response_model=List[PaymentRead])
def get_payment_history(email: str, db: Session = Depends(get_db)):
    """Get payment history for a user"""
    payments = get_payments(db, user_email=email)
    return [payment.model_dump() for payment in payments]
