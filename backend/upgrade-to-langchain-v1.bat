@echo off
echo ========================================
echo Upgrading to LangChain v1.x
echo ========================================
echo.
echo This will upgrade LangChain packages to v1.x
echo to be compatible with langchain-google-genai
echo.

call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Virtual environment not activated!
    pause
    exit /b 1
)

echo [1/3] Uninstalling old LangChain packages...
pip uninstall -y langchain langgraph langchain-core langsmith langchain-openai langchain-text-splitters langgraph-checkpoint

echo.
echo [2/3] Installing LangChain v1.x packages...
pip install langchain>=1.0.0 langgraph>=1.0.0

echo.
echo [3/3] Installing remaining requirements...
pip install -r requirements.txt

echo.
echo ========================================
echo Upgrade complete!
echo ========================================
echo.
echo Test with: python main.py
echo.
pause





