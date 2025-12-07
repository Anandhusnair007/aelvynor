# Database Seeding Script

## Overview

The `seed.py` script populates the database with sample data for development and testing purposes.

## What Gets Created

- **3 Projects**: E-Commerce Platform, Task Management App, Weather Dashboard
- **2 Courses**: Full-Stack Web Development, Python for Data Science
- **2 Internships**: Frontend Developer Intern, Backend Engineer Intern
- **1 Product**: Rubber Tapping Machine (with full specifications)
- **1 Admin User**: System administrator with hashed password

## Usage

### Basic Usage (Auto-generated Password)

```bash
cd backend
python scripts/seed.py
```

The script will:
- Generate a random secure password
- Create the admin user
- Display the password and a one-time token

### Custom Admin Password

```bash
ADMIN_PASSWORD=mysecretpassword python scripts/seed.py
```

### Using Virtual Environment

```bash
cd backend
source venv/bin/activate
python scripts/seed.py
```

### Using Make (if available)

```bash
cd backend
make seed  # If Makefile has seed target
```

## Output

The script will:
1. Create all sample data
2. Display admin credentials:
   - Username
   - Password (if auto-generated)
   - One-time JWT token (valid for 60 minutes)

Example output:
```
🌱 Starting database seeding...
📊 Database: sqlite:///./aelvynor.db
------------------------------------------------------------
📋 Ensuring database tables exist...
🔑 Generated random admin password: xK9#mP2$vL8@nQ4!
💡 Set ADMIN_PASSWORD environment variable to use a custom password
✅ Created admin user: admin
✅ Created 3 projects
✅ Created 2 courses
✅ Created 2 internships
✅ Created 1 products (including Rubber Tapping Machine)
------------------------------------------------------------
✅ Database seeding completed successfully!

============================================================
🔐 ADMIN CREDENTIALS
============================================================
Username: admin
⚠️  Password was auto-generated. Check console output above.

🎫 One-Time Access Token (valid for 60 minutes):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
============================================================
```

## Using the One-Time Token

The generated token can be used to authenticate API requests:

```bash
# Get all projects
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:8000/api/admin/projects

# Get all applications
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:8000/api/admin/applications
```

Or use it in the frontend admin dashboard by storing it in localStorage.

## Idempotency

The script is idempotent - it checks if data already exists before creating:
- If admin exists, it skips creation and generates a new token
- If projects/courses/internships/products exist, it skips their creation

To re-seed, you may need to:
1. Clear existing data manually, or
2. Use a fresh database

## Environment Variables

- `ADMIN_PASSWORD`: Custom password for admin user (optional)
- Database connection uses `DATABASE_URL` from `.env` or defaults to SQLite

## Requirements

- Database tables must exist (run migrations first if needed)
- All dependencies installed (`pip install -r requirements.txt`)
- Database connection configured in `.env`

## Troubleshooting

### Import Errors
Make sure you're running from the backend directory:
```bash
cd backend
python scripts/seed.py
```

### Database Connection Errors
Check your `.env` file and ensure `DATABASE_URL` is correct.

### Permission Errors
Make sure the script is executable:
```bash
chmod +x scripts/seed.py
```

## Notes

- The one-time token expires after 60 minutes
- For production, always set `ADMIN_PASSWORD` environment variable
- The script uses bcrypt for password hashing (same as the auth system)
- All sample data is marked as `is_active=True`

