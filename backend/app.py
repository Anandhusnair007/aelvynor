"""
Aelvynor Backend API
FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="Aelvynor API",
    description="Backend API for Aelvynor monorepo",
    version="1.0.0",
)

# Configure CORS - adjust origins for production
# In production, replace "*" with specific frontend URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ENVIRONMENT") == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Root endpoint - health check
    """
    return {
        "message": "Aelvynor API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "service": "aelvynor-backend"
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    # In production, use: uvicorn app:app --host 0.0.0.0 --port 8000
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes (development only)
    )

