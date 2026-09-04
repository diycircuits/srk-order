@echo off
title SRK Innovations ERP Software
cd /d "%~dp0"

echo ======================================================
echo    Starting SRK Innovations ERP Software...
echo ======================================================

if not exist "dist" (
    echo Packaging software interface for first run...
    call npm run build
)

echo Opening Software in your browser...
start "" http://localhost:5001

echo Starting Unified Software Server (Backend + Database + Frontend)...
node server/server.js
pause
