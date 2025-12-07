#!/bin/bash

# Start Backend and Frontend Servers for Testing

set -e

echo "🚀 Starting Aelvynor Platform Servers..."

# Kill existing processes
echo "Cleaning up existing processes..."
pkill -f "uvicorn app.main:app" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Backend Setup
cd backend
if [ ! -d "venv" ] || [ ! -f "venv/bin/python" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    # Ensure pip is installed in venv
    ./venv/bin/python -m ensurepip --upgrade 2>/dev/null || python3 -m venv --upgrade venv
fi

# Install dependencies if needed
if [ ! -f "venv/.installed" ] || [ ! -f "venv/bin/uvicorn" ]; then
    echo "Installing backend dependencies..."
    # Use python -m pip instead of direct pip call
    ./venv/bin/python -m pip install -q -r requirements.txt
    touch venv/.installed
fi

# Ensure admin exists
if [ ! -f "aelvynor.db" ] || ! ./venv/bin/python -c "from app.crud import get_admin_by_username; from sqlmodel import Session, create_engine; from app.config import settings; engine = create_engine(settings.DATABASE_URL); db = Session(engine); admin = get_admin_by_username(db, 'admin@gmail.com'); exit(0 if admin else 1)" 2>/dev/null; then
    echo "Creating admin user..."
    ./venv/bin/python scripts/create_admin.py --username "admin@gmail.com" --password "cyberdrift" 2>/dev/null || true
fi

# Start Backend
echo "🐍 Starting Backend on port 8000..."
cd ..
./backend/venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > /tmp/backend_ui.log 2>&1 &
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
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi

# Start Frontend
echo "🎨 Starting Frontend on port 3000..."
npm run dev > /tmp/frontend_ui.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to be ready
echo "Waiting for frontend to start..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    sleep 1
done

echo ""
echo "✅ Both servers are running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Backend:  http://localhost:8000"
echo "📡 Backend API Docs: http://localhost:8000/docs"
echo "🌐 Frontend: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 To run UI tests:"
echo "   python3 test_ui.py"
echo ""
echo "💡 To stop servers:"
echo "   pkill -f 'uvicorn app.main:app'"
echo "   pkill -f 'next dev'"
echo ""
echo "🛑 Press Ctrl+C to stop all servers..."

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    pkill -f "uvicorn app.main:app" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    echo "✅ Servers stopped"
    exit
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait

