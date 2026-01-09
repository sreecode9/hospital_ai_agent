from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from langgraph_workflow import SymptomCheckerWorkflow

load_dotenv()

app = FastAPI(title="Symptom Checking Assistant API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",     # Vite dev server
        "http://localhost:3000",     # Alternative dev server
        "https://hospitalaiagent1.vercel.app",  # Original frontend
        "https://frontend-lake-nine-47.vercel.app",  # New frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize workflow
workflow = SymptomCheckerWorkflow()

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    risk_level: str | None = None
    disclaimer: bool = True

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await workflow.process_message(request.message, request.session_id)
        return ChatResponse(
            response=result["response"],
            risk_level=result.get("risk_level"),
            disclaimer=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/")
async def root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"message": "Backend is running"}

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable for Render deployment, default to 8000 for local development
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)

