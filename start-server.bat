@echo off
title SRK Innovations ERP Background Server
cd /d "%~dp0"
echo Starting SRK Innovations ERP Backend API & Database...
npm run build
npm run start:server
