# Upload Project to GitHub

## Option 1: Use the Automated Script (Recommended)

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/downloads
   - Install with default settings

2. **Run the upload script**:
   ```cmd
   git-upload.bat
   ```

## Option 2: Manual Git Commands

If the script doesn't work, run these commands manually:

```cmd
# Navigate to project directory
cd "C:\Users\hp\OneDrive\Desktop\hospital ai_agent"

# Initialize git repository
git init

# Create .gitignore file
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

# Create initial commit
git commit -m "Initial commit: AI-Powered Symptom Checking Assistant

Features:
- React frontend with chat interface
- FastAPI backend with LangGraph workflow
- Google Gemini AI integration
- Supabase database storage
- Ethical health awareness guidance
- No diagnosis or treatment recommendations"

# Set main branch and add remote
git branch -M main
git remote add origin https://github.com/sreecode9/hospital_ai_agent.git

# Push to GitHub
git push -u origin main
```

## Troubleshooting

### Error: "git is not recognized"
- Install Git from: https://git-scm.com/downloads
- Restart Command Prompt after installation

### Error: "Repository not found"
- Make sure the repository exists on GitHub: https://github.com/sreecode9/hospital_ai_agent
- Create it if it doesn't exist

### Error: "Permission denied" or "Authentication failed"
- Set up SSH keys or use a Personal Access Token
- See: https://docs.github.com/en/authentication

### Error: "Updates were rejected because the remote contains work"
- The repository has existing content
- Use: `git push -u origin main --force`

## What's Included in the Repository

✅ **Backend:**
- FastAPI server with LangGraph workflow
- Google Gemini AI integration
- Supabase database client
- Webhook client
- Environment configuration
- Setup scripts and documentation

✅ **Frontend:**
- React chat interface
- Medical disclaimer component
- Vite configuration
- Responsive design

✅ **Documentation:**
- README with setup instructions
- Architecture overview
- Troubleshooting guides
- Setup guides for Windows/Linux/Mac

❌ **Excluded (in .gitignore):**
- Virtual environment (venv/)
- API keys (.env)
- Node modules (node_modules/)
- Build artifacts
- IDE files

## Repository Structure

```
hospital_ai_agent/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── langgraph_workflow.py      # LangGraph AI workflow
│   ├── supabase_client.py         # Database integration
│   ├── webhook_client.py          # Webhook integration
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables (excluded)
│   └── ...                        # Setup and documentation files
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── Disclaimer.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
├── QUICKSTART.md
├── ARCHITECTURE.md
└── ...                           # Other documentation
```

## Next Steps After Upload

1. **Enable GitHub Pages** (optional) for frontend demo
2. **Add GitHub Actions** for CI/CD
3. **Create issues** for feature requests
4. **Add collaborators** if working with a team
5. **Set up project board** for task management


