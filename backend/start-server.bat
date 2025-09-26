@echo off
echo Starting Wellwisher AI Buddy Backend Server...
cd /d G:\wellwisher-ai-buddy\backend
echo Current directory: %CD%
echo.
echo Server starting on port 3002...
echo Press Ctrl+C to stop the server
echo.
node src/server.js
pause