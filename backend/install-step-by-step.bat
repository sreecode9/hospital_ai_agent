@echo off
echo ========================================
echo Step-by-Step Installation Guide
echo ========================================
echo.
echo This script will install packages one by one to identify any conflicts.
echo.

call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Virtual environment not activated!
    echo Please run: venv\Scripts\activate.bat first
    pause
    exit /b 1
)

echo [Step 1/9] Upgrading pip...
python -m pip install --upgrade pip
if errorlevel 1 (
    echo WARNING: pip upgrade failed, continuing anyway...
)

echo.
echo [Step 2/9] Installing fastapi...
pip install fastapi==0.104.1
if errorlevel 1 (
    echo ERROR: Failed to install fastapi
    pause
    exit /b 1
)

echo.
echo [Step 3/9] Installing uvicorn...
pip install "uvicorn[standard]==0.24.0"
if errorlevel 1 (
    echo ERROR: Failed to install uvicorn
    pause
    exit /b 1
)

echo.
echo [Step 4/9] Installing python-dotenv...
pip install python-dotenv==1.0.0
if errorlevel 1 (
    echo ERROR: Failed to install python-dotenv
    pause
    exit /b 1
)

echo.
echo [Step 5/9] Installing pydantic...
pip install pydantic==2.5.3
if errorlevel 1 (
    echo ERROR: Failed to install pydantic
    pause
    exit /b 1
)

echo.
echo [Step 6/9] Installing httpx (compatible version)...
pip install "httpx>=0.24.0,<0.26.0"
if errorlevel 1 (
    echo ERROR: Failed to install httpx
    pause
    exit /b 1
)

echo.
echo [Step 7/9] Installing langchain-core (let pip choose version)...
pip install langchain-core
if errorlevel 1 (
    echo ERROR: Failed to install langchain-core
    pause
    exit /b 1
)

echo.
echo [Step 8/9] Installing langchain and langchain-openai...
pip install langchain==0.2.16 langchain-openai==0.1.23
if errorlevel 1 (
    echo ERROR: Failed to install langchain packages
    pause
    exit /b 1
)

echo.
echo [Step 9/9] Installing langgraph and supabase...
pip install langgraph==0.2.28
if errorlevel 1 (
    echo WARNING: langgraph installation failed, trying without version...
    pip install langgraph
)

pip install supabase==2.3.4
if errorlevel 1 (
    echo WARNING: supabase installation failed, trying without version...
    pip install supabase
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Verifying installation...
python -c "import fastapi; import uvicorn; import langgraph; import langchain; import supabase; print('All packages imported successfully!')"
if errorlevel 1 (
    echo WARNING: Some packages may not be installed correctly
    echo Run: pip list
    echo to see what's installed
) else (
    echo All core packages are installed correctly!
)

echo.
echo Next steps:
echo 1. Create .env file with your API keys
echo 2. Run: python main.py
echo.
pause





