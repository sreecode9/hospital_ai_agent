#!/usr/bin/env python3
"""
Test script for Render deployment
"""
import os
import sys

print("🔍 Render Environment Check")
print("=" * 40)

# Check Python version
print(f"Python version: {sys.version}")

# Check environment variables
port = os.getenv("PORT", "Not set")
print(f"PORT environment variable: {port}")

google_key = os.getenv("GOOGLE_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print(f"GOOGLE_API_KEY: {'✅ Set' if google_key else '❌ Not set'}")
print(f"SUPABASE_URL: {'✅ Set' if supabase_url else '❌ Not set'}")
print(f"SUPABASE_KEY: {'✅ Set' if supabase_key else '❌ Not set'}")

# Test imports
try:
    import fastapi
    print("✅ FastAPI import: OK")
except ImportError as e:
    print(f"❌ FastAPI import: Failed - {e}")

try:
    import uvicorn
    print("✅ Uvicorn import: OK")
except ImportError as e:
    print(f"❌ Uvicorn import: Failed - {e}")

try:
    import langchain_google_genai
    print("✅ LangChain Google GenAI import: OK")
except ImportError as e:
    print(f"❌ LangChain Google GenAI import: Failed - {e}")

try:
    import supabase
    print("✅ Supabase import: OK")
except ImportError as e:
    print(f"❌ Supabase import: Failed - {e}")

print("=" * 40)
print("🎯 If all imports are OK, deployment should work!")
print("🚀 Use start command: uvicorn main:app --host 0.0.0.0 --port $PORT")