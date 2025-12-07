#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Aelvynor Local Development Environment..."

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

# Database Setup
echo "🗄️  Checking Database..."
if [ ! -f "aelvynor.db" ]; then
    echo "Creating and seeding database..."
    python scripts/seed.py
    python scripts/create_admin.py --username admin --password admin123
fi

# Start Backend in background
echo "🐍 Starting FastAPI Backend..."
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Frontend Setup
echo "🎨 Starting Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo "✅ All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000/docs"
echo "Press Ctrl+C to stop all services."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
