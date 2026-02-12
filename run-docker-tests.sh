#!/bin/bash

# Amazon Automation - Docker Quick Start Script
# This script helps you quickly run tests using Docker

set -e

echo "🚀 Amazon Automation - Docker Test Runner"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your credentials before running tests"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit..."
fi

# Create artifact directories if they don't exist
echo "📁 Creating artifact directories..."
mkdir -p test-results playwright-report screenshots videos
echo "✅ Directories created"
echo ""

# Build Docker image
echo "🔨 Building Docker image..."
docker-compose build
echo "✅ Docker image built successfully"
echo ""

# Run tests
echo "🧪 Running tests..."
docker-compose up --abort-on-container-exit
echo ""

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ Tests completed successfully!"
else
    echo "❌ Tests failed. Check the logs above for details."
fi

echo ""
echo "📊 Test artifacts are available in:"
echo "   - test-results/     (screenshots, videos, traces)"
echo "   - playwright-report/ (HTML report)"
echo ""
echo "To view the HTML report, run:"
echo "   npx playwright show-report"
echo ""
echo "Or start the report server:"
echo "   docker-compose --profile reports up report-server"
echo "   Then open http://localhost:8080 in your browser"
echo ""
