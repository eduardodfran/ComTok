@echo off
echo ===============================================
echo ComTok - Starting Development Environment
echo ===============================================

echo Checking if MySQL is running...
mysqladmin ping 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo WARNING: MySQL may not be running. Please start MySQL before continuing.
  echo Recommendation: Start MySQL service and try again.
  echo.
  set /p CONTINUE="Try to continue anyway? (y/n): "
  if /i "%CONTINUE%" NEQ "y" (
    echo Exiting...
    exit /b 1
  )
)

if not exist node_modules\ (
  echo Installing dependencies...
  call npm install
)

echo Starting the ComTok development environment...
echo This will start both the Express backend and Expo app
echo.
echo - Backend will run on: http://localhost:3000
echo - Expo will provide QR code to scan with Expo Go app
echo.
echo Press Ctrl+C to stop both servers
echo ===============================================

call npm start
