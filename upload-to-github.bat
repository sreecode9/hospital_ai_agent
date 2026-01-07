@echo off
echo ========================================
echo HOSPITAL AI AGENT - GitHub Upload
echo ========================================
echo.
echo This script will upload your complete AI health assistant to GitHub
echo.
echo Prerequisites:
echo - Git installed (https://git-scm.com/downloads)
echo - GitHub repository created: https://github.com/sreecode9/hospital_ai_agent
echo - Personal Access Token ready
echo.

cd "C:\Users\hp\OneDrive\Desktop\hospital ai_agent"

echo [1/4] Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/downloads
    echo Then run this script again.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git is installed
)

echo.
echo [2/4] Setting up Git repository...
git init
git config --global user.name "Sree Code"
git config --global user.email "sreecode9@gmail.com"

echo Creating .gitignore...
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
echo [3/4] Adding files and creating commit...
git add .
git commit -m "AI-Powered Symptom Checking Assistant

🎯 Complete Ethical Health AI Solution

Features:
✅ React frontend with chat interface
✅ FastAPI backend with LangGraph workflow
✅ Google Gemini AI integration
✅ Supabase database storage
✅ Webhook integration
✅ Ethical health awareness guidance
❌ No diagnosis or treatment recommendations

Tech Stack:
- Frontend: React + Vite
- Backend: Python + FastAPI + LangGraph
- AI: Google Gemini (responsible AI)
- Database: Supabase (anonymized data)
- Ethics: SDG 3 compliant, no medical advice"

echo.
echo [4/4] Pushing to GitHub...
echo.
echo IMPORTANT: When prompted for credentials:
echo Username: sreecode9
echo Password: [Paste your Personal Access Token]
echo.
echo If you don't have a Personal Access Token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Generate new token (classic)
echo 3. Select 'repo' scope
echo 4. Copy the token
echo.

git branch -M main
git remote add origin https://github.com/sreecode9/hospital_ai_agent.git 2>nul
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ PUSH FAILED
    echo.
    echo Possible solutions:
    echo 1. Check if repository exists: https://github.com/sreecode9/hospital_ai_agent
    echo 2. Verify Personal Access Token has 'repo' scope
    echo 3. Try force push: git push -u origin main --force
    echo 4. Remove and re-add remote: git remote remove origin
    echo.
) else (
    echo.
    echo 🎉 SUCCESS! Project uploaded to GitHub
    echo.
    echo 🌐 Repository: https://github.com/sreecode9/hospital_ai_agent
    echo.
    echo 📁 What's uploaded:
    echo ✅ Complete backend (FastAPI + LangGraph + Gemini AI)
    echo ✅ Complete frontend (React chat interface)
    echo ✅ All documentation and setup guides
    echo ✅ Project architecture and README
    echo.
    echo 🔒 What's NOT uploaded (stays private):
    echo ❌ Your .env file with API keys
    echo ❌ Virtual environment (venv/)
    echo ❌ Node modules
    echo.
)

echo.
echo Press any key to exit...
pause >nul
