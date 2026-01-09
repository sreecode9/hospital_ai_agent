"""
Vercel serverless function for the symptom checker backend
"""
import os
import sys

# Set environment variable to disable proxy (fix Supabase issue)
os.environ['SUPABASE_DISABLE_PROXY'] = 'true'

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from backend.main import app

# Export the FastAPI app for Vercel
app = app