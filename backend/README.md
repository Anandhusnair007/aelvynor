# Aelvynor Backend API

Production-ready FastAPI backend with SQLModel, Alembic migrations, and JWT authentication.

## Features

- **FastAPI** with async support
- **SQLModel** for type-safe database models
- **Alembic** for database migrations
- **JWT Authentication** for admin endpoints
- **File Uploads** with validation (resumes and images)
- **CRUD Operations** for Projects, Courses, Internships, Products, and Applications
- **CORS** configured for frontend integration
- **Type-safe** code with Python 3.11+

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Or use Makefile:

```bash
make install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Generate admin password hash
python hash_password.py
# Enter your password when prompted, then copy the hash to .env

# Edit .env and set:
# - SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
# - ADMIN_PASSWORD_HASH (from hash_password.py output)
```

### 3. Initialize Database

```bash
# Option 1: Create tables directly (for development)
make db-init

# Option 2: Use Alembic migrations (recommended for production)
make migration-create MESSAGE="Initial migration"
make migration-upgrade
```

### 4. Run Development Server

```bash
make dev
```

Or manually:

```bash
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration and settings
│   ├── models.py            # SQLModel database models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── crud.py              # Database CRUD operations
│   ├── auth.py              # JWT authentication utilities
│   ├── deps.py              # FastAPI dependencies
│   └── api/
│       ├── public.py        # Public API routes
│       └── admin.py         # Admin API routes (JWT protected)
├── alembic/                 # Database migrations
├── uploads/                 # File uploads directory
├── requirements.txt          # Python dependencies
├── Makefile                 # Development commands
├── .env.example             # Environment variables template
└── hash_password.py         # Password hashing utility
```

## API Endpoints

### Public Endpoints (No Authentication)

- `GET /api/public/projects` - List all active projects
- `GET /api/public/projects/{id}` - Get project by ID
- `GET /api/public/courses` - List all active courses
- `GET /api/public/courses/{id}` - Get course by ID
- `GET /api/public/internships` - List all active internships
- `GET /api/public/internships/{id}` - Get internship by ID
- `GET /api/public/products` - List all active products
- `GET /api/public/products/{id}` - Get product by ID
- `POST /api/public/applications` - Submit application (with optional resume upload)

### Admin Endpoints (JWT Authentication Required)

**Authentication:**
- `POST /api/auth/login` - Login and get JWT token

**Projects:**
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects` - List all projects (including inactive)
- `GET /api/admin/projects/{id}` - Get project
- `PUT /api/admin/projects/{id}` - Update project
- `DELETE /api/admin/projects/{id}` - Delete project

**Courses, Internships, Products:** Same CRUD pattern as Projects

**Applications:**
- `GET /api/admin/applications` - List all applications
- `GET /api/admin/applications/{id}` - Get application
- `PUT /api/admin/applications/{id}` - Update application status
- `DELETE /api/admin/applications/{id}` - Delete application

**File Uploads:**
- `POST /api/admin/upload/image` - Upload image file

## Authentication

### Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the Authorization header:

```bash
curl -X GET "http://localhost:8000/api/admin/projects" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Migrations

### Create a Migration

```bash
make migration-create MESSAGE="Add new field to projects"
```

### Apply Migrations

```bash
make migration-upgrade
```

### Rollback Migration

```bash
make migration-downgrade
```

### Check Migration Status

```bash
make migration-current
make migration-history
```

## File Uploads

### Upload Resume (Public Endpoint)

```bash
curl -X POST "http://localhost:8000/api/public/applications" \
  -F "full_name=John Doe" \
  -F "email=john@example.com" \
  -F "position_type=internship" \
  -F "position_id=1" \
  -F "resume=@/path/to/resume.pdf"
```

### Upload Image (Admin Only)

```bash
curl -X POST "http://localhost:8000/api/admin/upload/image" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**File Validation:**
- Maximum size: 5MB
- Image types: JPEG, PNG, WebP, GIF
- Resume types: PDF, DOC, DOCX

## Makefile Commands

```bash
make install              # Install dependencies
make dev                  # Run development server
make run                  # Run production server
make db-init              # Initialize database tables
make migration-create     # Create new migration
make migration-upgrade     # Apply migrations
make migration-downgrade  # Rollback migration
make migration-history    # Show migration history
make migration-current    # Show current version
make test                 # Run tests
make lint                 # Run linter
make format               # Format code
make clean                # Clean up
```

## Environment Variables

See `.env.example` for all available configuration options.

**Required:**
- `SECRET_KEY` - JWT secret key (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `ADMIN_PASSWORD_HASH` - Hashed admin password (generate with: `python hash_password.py`)

**Optional:**
- `DATABASE_URL` - Database connection string (default: SQLite)
- `CORS_ORIGINS` - Allowed CORS origins (default: http://localhost:3000)
- `DEBUG` - Enable debug mode (default: false)

## Production Deployment

1. Set `DEBUG=false` in `.env`
2. Use PostgreSQL or another production database
3. Set a strong `SECRET_KEY`
4. Configure proper CORS origins
5. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

[Add your license here]

