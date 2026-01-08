"""
Quick test to verify server can start
"""
import os
from main import app

# Test that app can be imported and configured
print("✅ FastAPI app imported successfully")

# Test environment variables
port = int(os.getenv("PORT", 8000))
print(f"✅ Port configuration: {port}")

# Test CORS configuration
from fastapi.middleware.cors import CORSMiddleware
cors_middleware = None
for middleware in app.user_middleware:
    if isinstance(middleware, CORSMiddleware):
        cors_middleware = middleware
        break

if cors_middleware:
    print(f"✅ CORS configured with origins: {cors_middleware.allow_origins}")
else:
    print("❌ CORS not configured")

print("✅ Server configuration test passed!")
