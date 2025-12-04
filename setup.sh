#!/bin/bash

echo "🚀 Setting up Chakshi Law Chatbot..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev              # Start both frontend and backend"
echo "  npm run dev:backend      # Start backend only (port 3001)"
echo "  npm run dev:frontend     # Start frontend only (port 5173)"
echo ""
echo "Access the chatbot at: http://localhost:5173"
echo "Backend API at: http://localhost:3001"
