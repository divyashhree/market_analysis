#!/bin/bash

# Macro Market Analyzer - Setup Script
# This script automates the initial setup process

echo "╔═══════════════════════════════════════════════╗"
echo "║   Macro Market Analyzer - Setup Script       ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION detected"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo "   ✅ .env file created"
else
    echo "   ℹ️  .env file already exists"
fi

echo "   Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Failed to install backend dependencies"
    exit 1
fi

cd ..
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
    echo "   Creating .env.local file from template..."
    cp .env.example .env.local
    echo "   ✅ .env.local file created"
else
    echo "   ℹ️  .env.local file already exists"
fi

echo "   Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..
echo ""

# Summary
echo "╔═══════════════════════════════════════════════╗"
echo "║   Setup Complete! 🎉                         ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "For more information, see:"
echo "  - QUICKSTART.md for detailed instructions"
echo "  - README.md for full documentation"
echo "  - API_DOCUMENTATION.md for API reference"
echo ""
