#!/bin/bash

# Stop all Aelvynor Platform servers

echo "🛑 Stopping all Aelvynor Platform servers..."
echo ""

# Kill backend processes
echo "🐍 Stopping Backend..."
pkill -f "uvicorn app.main:app" 2>/dev/null && echo "  ✅ Backend stopped" || echo "  ℹ️  No backend process found"

# Kill frontend processes
echo "🎨 Stopping Frontend..."
pkill -f "next dev" 2>/dev/null && echo "  ✅ Frontend stopped" || echo "  ℹ️  No frontend process found"

# Kill any node processes related to next
echo "🔄 Cleaning up Node processes..."
pkill -f "next-server" 2>/dev/null && echo "  ✅ Next.js processes cleaned" || echo "  ℹ️  No Next.js processes found"

# Wait a moment
sleep 2

# Verify processes are stopped
BACKEND_RUNNING=$(pgrep -f "uvicorn app.main:app" > /dev/null && echo "yes" || echo "no")
FRONTEND_RUNNING=$(pgrep -f "next dev" > /dev/null && echo "yes" || echo "no")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$BACKEND_RUNNING" = "no" ] && [ "$FRONTEND_RUNNING" = "no" ]; then
    echo "✅ All servers stopped successfully!"
else
    if [ "$BACKEND_RUNNING" = "yes" ]; then
        echo "⚠️  Backend still running - trying force kill..."
        pkill -9 -f "uvicorn app.main:app" 2>/dev/null
    fi
    if [ "$FRONTEND_RUNNING" = "yes" ]; then
        echo "⚠️  Frontend still running - trying force kill..."
        pkill -9 -f "next dev" 2>/dev/null
    fi
    echo "✅ Force stopped all processes"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check ports
echo "🔍 Checking ports..."
BACKEND_PORT=$(lsof -ti:8000 2>/dev/null | head -1)
FRONTEND_PORT=$(lsof -ti:3000 2>/dev/null | head -1)

if [ -n "$BACKEND_PORT" ]; then
    echo "  ⚠️  Port 8000 still in use (PID: $BACKEND_PORT)"
    kill -9 $BACKEND_PORT 2>/dev/null && echo "    ✅ Killed process on port 8000"
else
    echo "  ✅ Port 8000 is free"
fi

if [ -n "$FRONTEND_PORT" ]; then
    echo "  ⚠️  Port 3000 still in use (PID: $FRONTEND_PORT)"
    kill -9 $FRONTEND_PORT 2>/dev/null && echo "    ✅ Killed process on port 3000"
else
    echo "  ✅ Port 3000 is free"
fi

echo ""
echo "✅ All processes stopped and ports freed!"
echo ""

