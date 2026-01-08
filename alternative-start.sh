#!/bin/bash
# Alternative start script for Render
export SUPABASE_DISABLE_PROXY=true
cd backend
uvicorn main:app --host 0.0.0.0 --port $PORT