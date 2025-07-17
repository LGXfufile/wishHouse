#!/bin/bash

echo "🚀 Starting Wish Lighthouse application..."

# Kill existing processes
echo "🛑 Stopping existing processes..."
pkill -f "node simple-server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend
echo "🔧 Starting backend server..."
node simple-server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:3001"
echo "🔌 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Keep script running
wait 