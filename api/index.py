"""
Simple test Vercel serverless function for symptom checker backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

print("=== SIMPLE TEST BACKEND ===")
print(f"Python version: {__import__('sys').version}")
print(f"Working directory: {os.getcwd()}")
print(f"GOOGLE_API_KEY present: {bool(os.getenv('GOOGLE_API_KEY'))}")

# Create FastAPI app
app = FastAPI(title="Symptom Checker Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    risk_level: str | None = None
    disclaimer: bool = True

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "Simple test backend is working!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    return ChatResponse(
        response="Thank you for your message. This is a test response from the simplified backend.",
        risk_level="low",
        disclaimer=True
    )

print("✅ Simple test backend created successfully")