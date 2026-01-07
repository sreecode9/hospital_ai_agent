import httpx
import os
from dotenv import load_dotenv
from typing import TypedDict

load_dotenv()

class WebhookClient:
    def __init__(self):
        self.webhook_url = os.getenv("WEBHOOK_URL")
    
    async def send_webhook(self, state: dict):
        if not self.webhook_url:
            print("Warning: Webhook URL not configured. Skipping webhook call.")
            return
        
        # Prepare payload
        category_map = {
            "general_symptom": "general",
            "urgent_symptom": "urgent",
            "mental_wellbeing_symptom": "mental_wellbeing"
        }
        
        payload = {
            "age": state.get("age"),
            "symptoms": state.get("symptoms", []),
            "duration": state.get("duration"),
            "risk_level": state.get("risk_level"),
            "category": category_map.get(state.get("category"), "general")
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.webhook_url,
                    json=payload,
                    timeout=10.0
                )
                response.raise_for_status()
                print(f"Webhook sent successfully: {response.status_code}")
        except Exception as e:
            print(f"Error sending webhook: {e}")

