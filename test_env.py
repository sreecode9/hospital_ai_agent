#!/usr/bin/env python3
"""
Test script to verify environment variables
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=== Environment Variables Check ===")

# Check required variables
required_vars = ['GOOGLE_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY']

for var in required_vars:
    value = os.getenv(var)
    if value:
        if var == 'GOOGLE_API_KEY':
            print(f"✅ {var}: {'*' * 20}...{value[-4:] if len(value) > 4 else value}")
        elif var == 'SUPABASE_KEY':
            print(f"✅ {var}: {'*' * 20}...{value[-4:] if len(value) > 4 else value}")
        else:
            print(f"✅ {var}: {value}")
    else:
        print(f"❌ {var}: NOT SET")

print("\n=== Test Complete ===")