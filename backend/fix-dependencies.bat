@echo off
echo ========================================
echo Fixing Dependency Conflicts
echo ========================================
echo.
echo This will upgrade packages to compatible versions...
echo.

call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Virtual environment not activated!
    pause
    exit /b 1
)

echo [1/4] Upgrading langchain and langgraph...
pip install --upgrade langchain>=0.3.0 langgraph>=0.2.40
if errorlevel 1 (
    echo ERROR: Failed to upgrade langchain packages
    pause
    exit /b 1
)

echo.
echo [2/4] Installing compatible httpx version...
pip install "httpx>=0.24.0,<0.29.0"
if errorlevel 1 (
    echo WARNING: httpx upgrade may have issues, continuing...
)

echo.
echo [3/4] Installing compatible anyio for fastapi...
pip install "anyio>=3.7.1,<5.0.0"
if errorlevel 1 (
    echo WARNING: anyio upgrade may have issues, continuing...
)

echo.
echo [4/4] Reinstalling all requirements...
pip install -r requirements.txt --upgrade
if errorlevel 1 (
    echo WARNING: Some packages may have conflicts
    echo Try: pip install --upgrade fastapi uvicorn supabase
)

echo.
echo ========================================
echo Dependency fix complete!
echo ========================================
echo.
echo Note: Some warnings are normal. Test with: python main.py
echo.
pause






