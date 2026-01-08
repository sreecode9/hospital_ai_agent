# Manual GitHub Upload Guide

Since automated upload requires Git installation and authentication setup, here's the step-by-step manual process.

## Step 1: Install Git

**Download:** https://git-scm.com/downloads
- Choose **64-bit Git for Windows Setup**
- Run installer with **default settings**
- Restart Command Prompt

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `hospital_ai_agent`
3. Description: `AI-Powered Symptom Checking Assistant with Ethical Health Guidance`
4. Make it **Public** (recommended for showcase)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

## Step 3: Set Up GitHub Authentication

### Option A: Personal Access Token (Recommended)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `hospital_ai_agent`
4. Select scopes: ✅ `repo` (full control of private repositories)
5. Click **Generate token**
6. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Option B: GitHub CLI (Alternative)

```cmd
winget install --id GitHub.cli
gh auth login
```

## Step 4: Upload Project

### Open Command Prompt and run:

```cmd
cd "C:\Users\hp\OneDrive\Desktop\hospital ai_agent"

# Initialize Git repository
git init

# Configure Git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add .gitignore
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

# Add all files
git add .

# Create commit
git commit -m "Initial commit: AI-Powered Symptom Checking Assistant

Features:
- React frontend with chat interface
- FastAPI backend with LangGraph workflow
- Google Gemini AI integration
- Supabase database storage
- Ethical health awareness guidance
- No diagnosis or treatment recommendations

Tech Stack:
- Frontend: React + Vite
- Backend: Python + FastAPI + LangGraph
- AI: Google Gemini (ethical health guidance)
- Database: Supabase (anonymized data)
- Deployment: Ready for production"

# Set main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/sreecode9/hospital_ai_agent.git

# Push to GitHub
git push -u origin main
```

## Step 5: Enter Credentials When Prompted

When you run `git push`, you'll be prompted for:
- **Username:** `sreecode9`
- **Password:** Paste your **Personal Access Token** (not your GitHub password!)

## Step 6: Verify Upload

After successful push:
1. Go to: https://github.com/sreecode9/hospital_ai_agent
2. You should see all your project files
3. Click on files to view code
4. The repository will be public and shareable

## Troubleshooting

### Error: "Authentication failed"
- Make sure you're using the Personal Access Token, not your GitHub password
- Check token hasn't expired
- Verify token has `repo` scope

### Error: "Repository not found"
- Double-check repository name: `hospital_ai_agent`
- Make sure it's under your account: `sreecode9/hospital_ai_agent`
- Create repository if it doesn't exist

### Error: "fatal: remote origin already exists"
```cmd
git remote remove origin
git remote add origin https://github.com/sreecode9/hospital_ai_agent.git
```

### Error: "Updates were rejected"
```cmd
git push -u origin main --force
```

## What Gets Uploaded

✅ **Complete Project:**
- Backend: FastAPI + LangGraph + Gemini AI
- Frontend: React chat interface
- Documentation: README, setup guides, architecture
- Configuration: All setup scripts and guides

❌ **Excluded (Safe):**
- Your `.env` file (API keys)
- Virtual environment (`venv/`)
- Node modules (`node_modules/`)
- Build artifacts
- IDE files

## Repository Structure

```
hospital_ai_agent/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── langgraph_workflow.py   # AI workflow
│   ├── supabase_client.py      # Database
│   ├── requirements.txt        # Python deps
│   └── setup scripts...        # Installation guides
├── frontend/
│   ├── src/components/         # React components
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Build config
├── .gitignore                  # Exclusions
├── README.md                   # Main documentation
├── QUICKSTART.md              # Setup guide
└── ARCHITECTURE.md            # System overview
```

## After Upload

🎉 **Congratulations!** Your AI health assistant is now on GitHub!

**Share your repository:** https://github.com/sreecode9/hospital_ai_agent

**Features showcased:**
- Ethical AI development
- Modern tech stack
- Complete documentation
- Production-ready code
- Health awareness focus

