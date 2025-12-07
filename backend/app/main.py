from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import public, admin
from app.config import settings
import os

app = FastAPI(title="Aelvynor API")

# CORS - Use environment variable or default to localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/resumes", exist_ok=True)
os.makedirs("uploads/examples", exist_ok=True)
os.makedirs("uploads/project-requests", exist_ok=True)
os.makedirs("uploads/project-files", exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount examples folder directly (for backward compatibility with image paths)
app.mount("/examples", StaticFiles(directory="uploads/examples"), name="examples")

# Include routers
app.include_router(public.router, prefix="/api", tags=["Public"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Welcome to Aelvynor API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "aelvynor-backend"}
