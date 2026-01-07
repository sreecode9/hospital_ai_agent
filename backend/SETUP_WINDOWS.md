# Windows Setup Guide

## Fixing PowerShell Execution Policy Issue

If you encounter the error: "running scripts is disabled on this system", use one of these methods:

### Method 1: Use Command Prompt (Recommended)
Open **Command Prompt** (cmd.exe) instead of PowerShell:
```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

### Method 2: Bypass PowerShell Policy (One-time)
In PowerShell, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then activate the venv:
```powershell
.\venv\Scripts\Activate.ps1
```

### Method 3: Direct Python Execution
You can activate the venv by calling Python directly:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe main.py
```

## Complete Setup Steps (Command Prompt)

1. Open **Command Prompt** (not PowerShell)
2. Navigate to project:
   ```cmd
   cd C:\Users\hp\OneDrive\Desktop\hospital ai_agent\backend
   ```
3. Create virtual environment:
   ```cmd
   python -m venv venv
   ```
4. Activate virtual environment:
   ```cmd
   venv\Scripts\activate.bat
   ```
5. Upgrade pip (recommended):
   ```cmd
   python -m pip install --upgrade pip
   ```
6. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   ```
7. Create `.env` file with your API keys
8. Run the server:
   ```cmd
   python main.py
   ```

## Frontend Setup

1. Open a **new** Command Prompt window
2. Navigate to frontend:
   ```cmd
   cd C:\Users\hp\OneDrive\Desktop\hospital ai_agent\frontend
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start dev server:
   ```cmd
   npm run dev
   ```

