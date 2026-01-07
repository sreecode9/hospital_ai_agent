# Troubleshooting Guide

## Dependency Installation Issues

### Issue: "Cannot install -r requirements.txt because these package versions have conflicting dependencies"

**Common Conflicts:**
- **httpx version**: `supabase 2.3.4` requires `httpx<0.26`, so we use `httpx>=0.24.0,<0.26.0`
- **langchain-core version**: Let pip resolve this automatically

**Solution:** The versions in `requirements.txt` have been updated to be compatible. If you still see errors:

1. **Upgrade pip first:**
   ```cmd
   python -m pip install --upgrade pip
   ```

2. **Try installing without exact versions:**
   ```cmd
   pip install fastapi uvicorn[standard] langgraph langchain langchain-openai langchain-core supabase python-dotenv pydantic httpx
   ```

3. **Or install core packages first, then others:**
   ```cmd
   pip install langchain-core==0.2.38
   pip install langchain==0.2.16
   pip install langgraph==0.2.28
   pip install -r requirements.txt
   ```

### Issue: PowerShell Execution Policy Error

**Error:** `cannot be loaded because running scripts is disabled on this system`

**Solutions:**

1. **Use Command Prompt instead (Recommended):**
   - Open `cmd.exe` (not PowerShell)
   - Run: `venv\Scripts\activate.bat`

2. **Or change PowerShell policy (one-time):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Or use Python directly:**
   ```cmd
   .\venv\Scripts\python.exe -m pip install -r requirements.txt
   .\venv\Scripts\python.exe main.py
   ```

## Runtime Issues

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:** 
- Make sure virtual environment is activated
- Verify installation: `pip list` should show fastapi
- Reinstall: `pip install -r requirements.txt`

### Issue: "Import errors for langchain modules"

**Solution:**
- The code uses `langchain_core.prompts` which should work with the versions specified
- If you see import errors, try:
  ```cmd
  pip install --upgrade langchain-core langchain langgraph
  ```

### Issue: Backend starts but frontend can't connect

**Solutions:**
1. Check backend is running on port 8000
2. Check CORS settings in `backend/main.py`
3. Verify frontend API URL in `frontend/src/components/ChatInterface.jsx` is `http://localhost:8000/chat`
4. Check browser console for CORS errors

### Issue: OpenAI API errors

**Solutions:**
1. Verify `.env` file exists in `backend/` directory
2. Check `OPENAI_API_KEY` is set correctly
3. Verify API key is valid and has credits
4. Check for typos in `.env` file (no quotes needed around values)

## Common Setup Mistakes

1. **Not activating virtual environment** - Always activate before installing or running
2. **Using wrong terminal** - Use Command Prompt on Windows, not PowerShell (unless policy is changed)
3. **Wrong directory** - Make sure you're in the `backend/` directory when running setup
4. **Missing .env file** - Create `.env` file in `backend/` directory with your API keys
5. **Old pip version** - Always upgrade pip first: `python -m pip install --upgrade pip`

## Getting Help

If you continue to have issues:

1. Check Python version: `python --version` (should be 3.9+)
2. Check pip version: `pip --version` (should be recent)
3. Check installed packages: `pip list`
4. Check for error messages in terminal output
5. Verify all environment variables are set correctly

