@echo off
echo ========================================
echo Uploading to GitHub Repository
echo ========================================
echo.

cd "C:\Users\hp\OneDrive\Desktop\hospital ai_agent"

echo [1/6] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Git not installed or not in PATH
    echo Please install Git from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo.
echo [2/6] Adding .gitignore...
echo venv/ > .gitignore
echo __pycache__/ >> .gitignore
echo *.pyc >> .gitignore
echo .env >> .gitignore
echo node_modules/ >> .gitignore
echo *.log >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo .vscode/ >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore

echo.
echo [3/6] Adding all files...
git add .

echo.
echo [4/6] Creating initial commit...
git commit -m "Initial commit: AI-Powered Symptom Checking Assistant

Features:
- React frontend with chat interface
- FastAPI backend with LangGraph workflow
- Google Gemini AI integration
- Supabase database storage
- Ethical health awareness guidance
- No diagnosis or treatment recommendations"

echo.
echo [5/6] Adding remote origin...
git branch -M main
git remote add origin https://github.com/sreecode9/hospital_ai_agent.git

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed. This might be because:
    echo 1. Repository doesn't exist yet - create it on GitHub first
    echo 2. Authentication issues - set up SSH keys or personal access token
    echo 3. Repository already has content - use force push if needed
    echo.
    echo To force push: git push -u origin main --force
    echo.
) else (
    echo.
    echo SUCCESS: Project uploaded to GitHub!
    echo Repository: https://github.com/sreecode9/hospital_ai_agent
    echo.
)

pause

