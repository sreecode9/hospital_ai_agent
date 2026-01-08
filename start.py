"""
Production startup script for Render deployment
"""
import os
import sys

# Set environment variable to disable proxy (fix Supabase issue)
os.environ['SUPABASE_DISABLE_PROXY'] = 'true'

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

import uvicorn
from backend.main import app

if __name__ == "__main__":
    # Get port from environment variable (Render provides this)
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")

    # Run the FastAPI application
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        workers=1,     # Single worker for Render's free tier
        log_level="info"
    )
