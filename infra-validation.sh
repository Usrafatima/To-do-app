#!/bin/bash
set -e

echo "Starting Infrastructure Validation..."

# Check Backend
echo "Checking Backend (port 8000)..."
if curl -s -f http://localhost:8000/ > /dev/null; then
  echo "✅ Backend is healthy!"
else
  echo "❌ Backend check failed."
  exit 1
fi

# Check Frontend
echo "Checking Frontend (port 3000)..."
if curl -s -f http://localhost:3000/ > /dev/null; then
  echo "✅ Frontend is healthy!"
else
  echo "❌ Frontend check failed."
  exit 1
fi

echo "Infrastructure validation SUCCESSFUL."
