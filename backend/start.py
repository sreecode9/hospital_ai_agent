"""
Production startup script for Render deployment
"""
import os
import uvicorn

# Set environment variable to disable proxy (fix Supabase issue)
os.environ['SUPABASE_DISABLE_PROXY'] = 'true'

# Import app after setting environment variable
from main import app

if __name__ == "__main__":
    # Get port from environment variable (Render provides this)
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}")

    # Run the FastAPI application
    uvicorn.run(
        app,  # Use the imported app directly
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        workers=1,     # Single worker for Render's free tier
        log_level="info"
    )
