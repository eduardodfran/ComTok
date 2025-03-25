#!/bin/bash

# Print welcome message
echo "==============================================="
echo "ComTok - Starting Development Environment"
echo "==============================================="

# Check if MySQL is running
echo "Checking if MySQL is running..."
mysql_status=$(mysqladmin ping 2>/dev/null || echo "fail")

if [[ $mysql_status == *"fail"* ]]; then
  echo "⚠️ WARNING: MySQL may not be running. Please start MySQL before continuing."
  echo "Recommendation: Start MySQL service and try again."
  echo ""
  read -p "Try to continue anyway? (y/n): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Exiting..."
    exit 1
  fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development environment
echo "Starting the ComTok development environment..."
echo "This will start both the Express backend and Expo app"
echo ""
echo "- Backend will run on: http://localhost:3000"
echo "- Expo will provide QR code to scan with Expo Go app"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "==============================================="

# Start the application
npm start
