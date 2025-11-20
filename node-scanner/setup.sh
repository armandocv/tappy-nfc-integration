#!/bin/bash

echo "🚀 Setting up NFC Scanner (TCMP Mode)..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the scanner, run:"
echo "  npm start"
echo ""
echo "Then open http://localhost:3001 in your browser"
echo ""
