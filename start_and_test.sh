#!/bin/bash

# Start Backend and Frontend, then run comprehensive tests

set -e

echo "🚀 Starting Aelvynor Platform for Testing..."

# Backend Setup
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "Installing backend dependencies..."
    pip install -q -r requirements.txt
    touch venv/.installed
fi

# Ensure admin exists
if [ ! -f "aelvynor.db" ] || ! python -c "from app.crud import get_admin_by_username; from sqlmodel import Session, create_engine; from app.config import settings; engine = create_engine(settings.DATABASE_URL); db = Session(engine); admin = get_admin_by_username(db, 'admin'); exit(0 if admin else 1)" 2>/dev/null; then
    echo "Creating admin user..."
    python scripts/create_admin.py --username admin --password admin123 || true
fi

# Start Backend
echo "🐍 Starting Backend on port 8000..."
uvicorn app.main:app --host 127.0.0.1 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
done

# Frontend Setup
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi

# Start Frontend
echo "🎨 Starting Frontend on port 3000..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to be ready
echo "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    sleep 1
done

echo ""
echo "✅ Both servers are running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Running comprehensive test suite..."
echo ""

# Run tests
cd ..
python3 test_e2e.py

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

echo ""
echo "Servers are running. Press Ctrl+C to stop."
wait

