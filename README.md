# Aelvynor Platform

A comprehensive platform for courses, projects, internships, and product management.

## Features

- **User Panel**: Browse courses, projects, internships, and products
- **Admin Panel**: Full CMS for managing content, applications, and projects
- **Projects Management System (PMS)**: Complete workflow from request to delivery
- **Payment Integration**: Ready for payment gateway integration
- **File Management**: Upload and manage images, videos, and documents

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (or SQLite for development)

### Installation

1. **Backend Setup**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/create_admin.py --username admin@gmail.com --password cyberdrift
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
```

3. **Start Servers**:
```bash
# Backend (from backend directory)
uvicorn app.main:app --host 127.0.0.1 --port 8000

# Frontend (from frontend directory)
npm run dev
```

Or use the convenience script:
```bash
./start_servers.sh
```

4. **Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Admin Panel: http://localhost:3000/admin/login
  - Username: admin@gmail.com
  - Password: cyberdrift

## Project Structure

```
aelvynor/
├── backend/          # FastAPI backend
│   ├── app/         # Application code
│   ├── alembic/     # Database migrations
│   └── uploads/     # Uploaded files
├── frontend/         # Next.js frontend
│   ├── app/         # Pages and routes
│   ├── components/  # React components
│   └── lib/         # Utilities
└── scripts/          # Utility scripts
```

## Admin Panel Features

- Dashboard with metrics and charts
- Project Templates management
- Project Requests workflow
- Courses, Internships, Applications management
- Content editor
- File uploads (images, videos, source code)

## API Endpoints

See http://localhost:8000/docs for complete API documentation.

## Production Deployment

1. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: JWT secret key
   - `NEXT_PUBLIC_API_URL`: Backend API URL

2. Run database migrations:
```bash
cd backend
alembic upgrade head
```

3. Build frontend:
```bash
cd frontend
npm run build
npm start
```

4. Deploy backend using your preferred method (Docker, cloud platform, etc.)

## License

Proprietary - Aelvynor LLP

