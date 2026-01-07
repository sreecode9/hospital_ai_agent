# Installation Guide - Step by Step

## If you're getting errors, follow these steps:

### Step 1: Clean Start (If previous attempts failed)

```cmd
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
```

### Step 2: Try Installation Methods (in order)

#### Method A: Use Flexible Requirements (Recommended if conflicts occur)

```cmd
pip install -r requirements-flexible.txt
```

#### Method B: Use Step-by-Step Installer

```cmd
install-step-by-step.bat
```

#### Method C: Install Core Packages First

```cmd
pip install fastapi uvicorn[standard] python-dotenv pydantic
pip install "httpx>=0.24.0,<0.26.0"
pip install langchain-core
pip install langchain==0.2.16 langchain-openai==0.1.23
pip install langgraph==0.2.28
pip install supabase==2.3.4
```

#### Method D: Let Pip Resolve Everything

```cmd
pip install fastapi uvicorn[standard] langgraph langchain langchain-openai supabase python-dotenv pydantic httpx
```

### Step 3: Verify Installation

```cmd
python -c "import fastapi; import uvicorn; import langgraph; print('Success!')"
```

### Step 4: Check What's Installed

```cmd
pip list
```

## Common Error Messages and Solutions

### Error: "ERROR: ResolutionImpossible"

**Solution:** Use Method A (flexible requirements) or Method D (let pip resolve)

### Error: "No module named 'X'"

**Solution:** 
1. Make sure venv is activated (you should see `(venv)` in prompt)
2. Run: `pip install X`

### Error: "pip is not recognized"

**Solution:**
1. Make sure Python is installed: `python --version`
2. Use: `python -m pip` instead of just `pip`

### Error: "venv\Scripts\activate" not found

**Solution:**
1. Make sure you're in the `backend` directory
2. Make sure venv was created: `python -m venv venv`
3. Use: `venv\Scripts\activate.bat` (not just `activate`)

## Still Having Issues?

1. **Share the exact error message** - Copy the full error output
2. **Check Python version:** `python --version` (should be 3.9+)
3. **Check pip version:** `pip --version`
4. **Try Method D** - Let pip resolve all dependencies automatically





