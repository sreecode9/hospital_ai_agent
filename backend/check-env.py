"""
Quick script to check if .env file is set up correctly
"""
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

print("=" * 50)
print("Environment Variables Check")
print("=" * 50)
print()

google_key = os.getenv("GOOGLE_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
webhook_url = os.getenv("WEBHOOK_URL")

# Check Google API Key
if google_key:
    # Show first 10 and last 4 characters for security
    masked_key = google_key[:10] + "..." + google_key[-4:] if len(google_key) > 14 else "***"
    print(f"✅ GOOGLE_API_KEY: {masked_key} (found)")
else:
    print("❌ GOOGLE_API_KEY: NOT FOUND (required)")
    print("   Please add: GOOGLE_API_KEY=your-key-here")
    print("   Get your key from: https://aistudio.google.com/app/apikey")
print()

# Check optional variables
if supabase_url:
    print(f"✅ SUPABASE_URL: {supabase_url[:30]}... (found)")
else:
    print("⚠️  SUPABASE_URL: not set (optional)")

if supabase_key:
    masked_key = supabase_key[:10] + "..." + supabase_key[-4:] if len(supabase_key) > 14 else "***"
    print(f"✅ SUPABASE_KEY: {masked_key} (found)")
else:
    print("⚠️  SUPABASE_KEY: not set (optional)")

if webhook_url:
    print(f"✅ WEBHOOK_URL: {webhook_url[:30]}... (found)")
else:
    print("⚠️  WEBHOOK_URL: not set (optional)")

print()
print("=" * 50)

# Check if .env file exists
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    print(f"✅ .env file found at: {env_path}")
else:
    print(f"❌ .env file NOT FOUND at: {env_path}")
    print("   Please create the .env file in the backend directory")

print("=" * 50)

