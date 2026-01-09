from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from supabase_client import SupabaseClient
from webhook_client import WebhookClient
import json

# Load environment variables
load_dotenv()

 

class SymptomState(TypedDict):
    messages: Annotated[list, "append"]
    session_id: str
    category: Literal["general_symptom", "urgent_symptom", "mental_wellbeing_symptom"] | None
    age: str | None
    symptoms: list[str]
    duration: str | None
    risk_level: Literal["low", "moderate", "high"] | None
    clarification_needed: str | None
    all_collected: bool

class SymptomCheckerWorkflow:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "GOOGLE_API_KEY not found in environment variables. "
                "Please set it in your Vercel project settings."
            )
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
        self.supabase = SupabaseClient()
        self.webhook_client = WebhookClient()
        self.graph = self._build_graph()
        self.sessions = {}  # Store session state
        
    def _build_graph(self):
        workflow = StateGraph(SymptomState)
        
        workflow.add_node("start", self.start_node)
        workflow.add_node("router", self.router_node)
        workflow.add_node("general_symptom", self.general_symptom_node)
        workflow.add_node("urgent_symptom", self.urgent_symptom_node)
        workflow.add_node("mental_wellbeing", self.mental_wellbeing_node)
        
        workflow.set_entry_point("start")
        workflow.add_edge("start", "router")
        workflow.add_conditional_edges(
            "router",
            self.route_to_symptom_node,
            {
                "general_symptom": "general_symptom",
                "urgent_symptom": "urgent_symptom",
                "mental_wellbeing": "mental_wellbeing"
            }
        )
        workflow.add_edge("general_symptom", END)
        workflow.add_edge("urgent_symptom", END)
        workflow.add_edge("mental_wellbeing", END)
        
        return workflow.compile()
    
    async def process_message(self, message: str, session_id: str):
        # Initialize or get session state
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "messages": [],
                "session_id": session_id,
                "category": None,
                "age": None,
                "symptoms": [],
                "duration": None,
                "risk_level": None,
                "clarification_needed": None,
                "all_collected": False
            }
        
        # Get current state and add new message
        current_state = self.sessions[session_id].copy()
        current_state["messages"] = current_state["messages"].copy()
        current_state["messages"].append({"role": "user", "content": message})
        current_state["symptoms"] = current_state["symptoms"].copy()
        
        # Run graph
        result = await self.graph.ainvoke(current_state)
        
        # Update session with result
        self.sessions[session_id] = result
        
        # Generate response
        response = await self._generate_response(result)
        
        return {
            "response": response,
            "risk_level": result.get("risk_level")
        }
    
    async def start_node(self, state: SymptomState):
        return state
    
    async def router_node(self, state: SymptomState):
        user_message = state["messages"][-1]["content"].lower()
        
        # Emergency/urgent keywords
        urgent_keywords = [
            "chest pain", "heart attack", "stroke", "severe", "emergency",
            "can't breathe", "difficulty breathing", "unconscious", "severe pain",
            "bleeding", "severe injury", "poisoning", "overdose"
        ]
        
        # Mental wellbeing keywords
        mental_keywords = [
            "stress", "anxiety", "depression", "sad", "worried", "panic",
            "emotional", "mental health", "feeling down", "overwhelmed",
            "suicidal", "self-harm"
        ]
        
        if any(keyword in user_message for keyword in urgent_keywords):
            category = "urgent_symptom"
        elif any(keyword in user_message for keyword in mental_keywords):
            category = "mental_wellbeing_symptom"
        else:
            category = "general_symptom"
        
        state["category"] = category
        return state
    
    def route_to_symptom_node(self, state: SymptomState):
        return state["category"]
    
    async def general_symptom_node(self, state: SymptomState):
        return await self._process_symptom_node(state, "general")
    
    async def urgent_symptom_node(self, state: SymptomState):
        return await self._process_symptom_node(state, "urgent")
    
    async def mental_wellbeing_node(self, state: SymptomState):
        return await self._process_symptom_node(state, "mental_wellbeing")
    
    async def _process_symptom_node(self, state: SymptomState, category_type: str):
        user_message = state["messages"][-1]["content"]
        
        # Extract information from conversation
        await self._extract_information(state, user_message)
        
        # Check what's missing
        missing_fields = []
        if not state["symptoms"]:
            missing_fields.append("symptoms")
        if not state["duration"]:
            missing_fields.append("duration")
        
        # If we have symptoms but no duration, ask for duration
        # If we have both, assess risk and trigger webhook
        if missing_fields:
            field = missing_fields[0]
            if field == "symptoms":
                state["clarification_needed"] = "Could you please describe your symptoms in more detail?"
            elif field == "duration":
                state["clarification_needed"] = "How long have you been experiencing these symptoms?"
        else:
            # All required fields collected
            state["all_collected"] = True
            state["risk_level"] = await self._assess_risk_level(state, category_type)
            
            # Store in Supabase
            await self.supabase.store_interaction(state)
            
            # Trigger webhook
            await self.webhook_client.send_webhook(state)
        
        return state
    
    async def _extract_information(self, state: SymptomState, message: str):
        if self.llm:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a medical information extraction assistant. Extract the following from the user's message:
- Age (if mentioned, as a string or null)
- Symptoms (list of symptoms mentioned)
- Duration (how long symptoms have been present, as a string)

Return ONLY a JSON object with keys: age, symptoms (array), duration.
If information is not present, use null for age and empty array for symptoms, null for duration.
Example: {"age": "25", "symptoms": ["headache", "fever"], "duration": "2 days"}"""),
                ("user", message)
            ])
            chain = prompt | self.llm
            response = await chain.ainvoke({})
            try:
                content = response.content.strip()
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()
                extracted = json.loads(content)
                if extracted.get("age") and not state.get("age"):
                    state["age"] = str(extracted["age"])
                if extracted.get("symptoms"):
                    state["symptoms"].extend([s for s in extracted["symptoms"] if s not in state["symptoms"]])
                if extracted.get("duration") and not state.get("duration"):
                    state["duration"] = extracted["duration"]
            except:
                pass
        if not state.get("symptoms"):
            tokens = [t.strip(",.") for t in message.split()]
            symptoms = [t for t in tokens if len(t) > 4]
            if symptoms:
                state["symptoms"] = symptoms[:5]
        if not state.get("duration"):
            import re
            m = re.search(r"\b(\d+)\s*(day|days|week|weeks|month|months)\b", message.lower())
            if m:
                state["duration"] = f"{m.group(1)} {m.group(2)}"
        if not state.get("age"):
            import re
            m2 = re.search(r"\b(?:i am|i'm|age\s*[:\-]?)\s*(\d{1,3})\b", message.lower())
            if m2:
                state["age"] = m2.group(1)
    
    async def _assess_risk_level(self, state: SymptomState, category_type: str) -> Literal["low", "moderate", "high"]:
        if self.llm:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a health risk awareness assistant. Assess the risk level based on:
- Category: {category}
- Symptoms: {symptoms}
- Duration: {duration}

Return ONLY one word: "low", "moderate", or "high".
Do not provide diagnosis or treatment. Only assess general risk awareness level."""),
                ("user", f"Category: {category_type}, Symptoms: {', '.join(state['symptoms'])}, Duration: {state['duration']}")
            ])
            chain = prompt | self.llm
            response = await chain.ainvoke({})
            risk = response.content.strip().lower()
            if risk not in ["low", "moderate", "high"]:
                if category_type == "urgent":
                    risk = "high"
                elif category_type == "mental_wellbeing":
                    risk = "moderate"
                else:
                    risk = "low"
            return risk
        if category_type == "urgent":
            return "high"
        if category_type == "mental_wellbeing":
            return "moderate"
        dur = (state.get("duration") or "").lower()
        if any(k in dur for k in ["week", "month"]):
            return "moderate"
        return "low"
    
    async def _generate_response(self, state: SymptomState) -> str:
        if state.get("clarification_needed"):
            return state["clarification_needed"]
        if state.get("all_collected"):
            category_map = {
                "general_symptom": "general",
                "urgent_symptom": "urgent",
                "mental_wellbeing_symptom": "mental_wellbeing"
            }
            category = category_map.get(state["category"], "general")
            if self.llm:
                prompt = ChatPromptTemplate.from_messages([
                    ("system", """You are a health awareness assistant. Provide general, non-diagnostic guidance.

Rules:
- DO NOT diagnose diseases
- DO NOT recommend medicines
- DO NOT provide treatment steps
- Use awareness-based language only
- Allowed phrases: "may indicate a potential health concern", "consider consulting a healthcare professional", "monitor symptoms and seek help if they persist"

Category: {category}
Symptoms: {symptoms}
Duration: {duration}
Risk Level: {risk_level}

Provide supportive, awareness-based guidance in 2-3 sentences."""),
                    ("user", f"Category: {category}, Symptoms: {', '.join(state['symptoms'])}, Duration: {state['duration']}, Risk: {state['risk_level']}")
                ])
                chain = prompt | self.llm
                response = await chain.ainvoke({})
                return response.content.strip()
            return (
                "Based on your symptoms and their duration, this may indicate a potential health concern. "
                "Consider consulting a healthcare professional for proper evaluation. "
                "Please monitor your symptoms and seek help if they persist."
            )
        elif state.get("symptoms") and not state.get("duration"):
            return "How long have you been experiencing these symptoms?"
        elif not state.get("symptoms"):
            return "I'm here to help you understand your symptoms better. Could you please describe what symptoms you're experiencing?"
        else:
            return "Thank you for sharing. I'm processing your information to provide awareness-based guidance."
