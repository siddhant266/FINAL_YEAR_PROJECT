@echo off
title MNGL Project Launcher
color 0A

echo.
echo  ==========================================
echo        MNGL - Starting All Services
echo  ==========================================
echo.

echo  [1/3] Starting Model Backend on port 8000...
start "MNGL - Model Backend (port 8000)" cmd /k "cd /d "%~dp0model_backend" && call venv\Scripts\activate && uvicorn app:app --host 127.0.0.1 --port 8000 --reload && pause"

timeout /t 3 /nobreak >nul

echo  [2/3] Starting Chatbot Backend on port 8001...
start "MNGL - Chatbot Backend (port 8001)" cmd /k "cd /d "%~dp0chatbot_backend" && call venv\Scripts\activate && uvicorn app:app --host 127.0.0.1 --port 8001 --reload && pause"

timeout /t 3 /nobreak >nul

echo  [3/3] Starting Frontend on port 5173...
start "MNGL - Frontend (port 5173)" cmd /k "cd /d "%~dp0Frontend" && npm run dev && pause"

echo.
echo  ==========================================
echo   All 3 services launched successfully!
echo.
echo   Frontend   ->  http://localhost:5173
echo   Model API  ->  http://localhost:8000/docs
echo   Chatbot    ->  http://localhost:8001/docs
echo  ==========================================
echo.
echo  Press any key to close this launcher...
pause >nul
