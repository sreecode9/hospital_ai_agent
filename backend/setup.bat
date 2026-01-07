@echo off
echo ========================================
echo Symptom Checker Backend Setup
echo ========================================
echo.

echo [1/5] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/5] Upgrading pip...
python -m pip install --upgrade pip

echo [4/5] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo [5/5] Setup complete!
echo.
echo IMPORTANT: Create a .env file with your API keys:
echo   OPENAI_API_KEY=your_key_here
echo   SUPABASE_URL=your_url_here (optional)
echo   SUPABASE_KEY=your_key_here (optional)
echo   WEBHOOK_URL=your_url_here (optional)
echo.
echo To start the server, run:
echo   python main.py
echo.
pause

