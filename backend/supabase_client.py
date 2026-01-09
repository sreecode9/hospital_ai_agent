import os
from dotenv import load_dotenv
from typing import TypedDict
from datetime import datetime

# Set environment variable to disable proxy BEFORE importing supabase
os.environ['SUPABASE_DISABLE_PROXY'] = 'true'

from supabase import create_client, Client

load_dotenv()

class SupabaseClient:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            print("Warning: Supabase credentials not found. Data storage will be disabled.")
            self.client = None
        else:
            self.client = create_client(url, key)
    
    async def store_interaction(self, state: dict):
        if not self.client:
            print("Supabase not configured, skipping data storage")
            return
        
        try:
            # Anonymized data - no PII
            data = {
                "session_id": state.get("session_id", "unknown"),
                "category": state.get("category"),
                "age": state.get("age"),  # Optional, may be null
                "symptoms": state.get("symptoms", []),
                "duration": state.get("duration"),
                "risk_level": state.get("risk_level"),
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Insert into interactions table
            # Note: Table should be created in Supabase with these columns
            self.client.table("interactions").insert(data).execute()
        except Exception as e:
            print(f"Error storing interaction: {e}")

