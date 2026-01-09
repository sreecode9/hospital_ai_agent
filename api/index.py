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

# Debug: Print environment variables and system info
print("=== VERCEL DEBUG INFO ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")
print(f"Files in backend directory: {os.listdir('backend') if os.path.exists('backend') else 'backend not found'}")

print(f"GOOGLE_API_KEY exists: {bool(os.getenv('GOOGLE_API_KEY'))}")
print(f"GOOGLE_API_KEY length: {len(os.getenv('GOOGLE_API_KEY', ''))}")
print(f"SUPABASE_URL exists: {bool(os.getenv('SUPABASE_URL'))}")
print(f"SUPABASE_KEY exists: {bool(os.getenv('SUPABASE_KEY'))}")

print(f"Backend path added to sys.path: {backend_path}")
print(f"Python path: {sys.path[:3]}...")  # Show first 3 paths

try:
    print("Attempting to import backend.main...")
    from backend.main import app
    print("✅ Successfully imported FastAPI app")
    print(f"App type: {type(app)}")
except Exception as e:
    print(f"❌ Error importing app: {e}")
    import traceback
    print("Full traceback:")
    traceback.print_exc()
    raise

# Export the FastAPI app for Vercel
app = app