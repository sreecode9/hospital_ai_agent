# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.9+ installed
- ✅ Node.js 18+ installed
- ✅ OpenAI API key
- ✅ (Optional) Supabase account
- ✅ (Optional) Webhook URL

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

**Windows (Easiest - Use Command Prompt, not PowerShell):**
```cmd
cd backend
setup.bat
```

**OR Manual Windows Setup (Command Prompt):**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**Mac/Linux:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**Note:** If you get PowerShell execution policy errors on Windows, use Command Prompt (cmd.exe) instead of PowerShell.

# Create .env file
# Copy .env.example and fill in your credentials
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit .env and add:
# OPENAI_API_KEY=sk-...
# SUPABASE_URL=https://...
# SUPABASE_KEY=...
# WEBHOOK_URL=https://...

# Start backend server
python main.py
```

Backend should now be running at `http://localhost:8000`

### 2. Frontend Setup (3 minutes)

```bash
# Open a new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should now be running at `http://localhost:5173`

### 3. Supabase Setup (Optional, 5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a project
2. Open SQL Editor
3. Copy and paste the contents of `backend/supabase_schema.sql`
4. Run the SQL to create the table
5. Get your Supabase URL and API key from Settings > API
6. Add them to your `.env` file

### 4. Test the Application

1. Open `http://localhost:5173` in your browser
2. Type a message like: "I have a headache and fever for 2 days"
3. The assistant will ask follow-up questions if needed
4. Once all information is collected, you'll receive awareness-based guidance

## Troubleshooting

### Backend won't start
- Check that Python 3.9+ is installed: `python --version`
- Ensure virtual environment is activated
- Verify all dependencies are installed: `pip list`
- Check that `.env` file exists and has `OPENAI_API_KEY`

### Frontend won't start
- Check that Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Check that port 5173 is not in use

### API calls fail
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify OpenAI API key is valid
- Check browser console for errors

### Supabase errors
- Verify table was created correctly
- Check Supabase URL and key in `.env`
- Ensure RLS (Row Level Security) is disabled for the interactions table (or configure policies)

## Next Steps

- Customize the webhook URL to receive structured data
- Adjust symptom categorization keywords in `backend/langgraph_workflow.py`
- Customize the UI in `frontend/src/components/`
- Add more sophisticated risk assessment logic

