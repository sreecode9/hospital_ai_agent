# Architecture Overview

## System Architecture

```
┌─────────────┐         HTTP/REST          ┌─────────────┐
│   React     │ ─────────────────────────> │   FastAPI    │
│  Frontend   │ <───────────────────────── │   Backend    │
│  (Vite)     │                             │             │
└─────────────┘                             └──────┬──────┘
                                                    │
                                    ┌───────────────┼───────────────┐
                                    │               │               │
                           ┌────────▼────┐  ┌──────▼──────┐  ┌─────▼──────┐
                           │  LangGraph  │  │  Supabase   │  │  Webhook   │
                           │  Workflow   │  │  Database   │  │   Client   │
                           └─────────────┘  └─────────────┘  └────────────┘
                                    │
                           ┌────────▼────┐
                           │   OpenAI    │
                           │     LLM     │
                           └─────────────┘
```

## Data Flow

### 1. User Input
- User types symptom description in React frontend
- Frontend sends POST request to `/chat` endpoint

### 2. Backend Processing
- FastAPI receives request
- LangGraph workflow processes message:
  - **start_node**: Entry point
  - **router_node**: Classifies symptom category
  - **symptom_node**: Extracts information, asks clarifications
  - **response_generation**: Creates awareness-based guidance

### 3. Information Collection
- Extracts: age (optional), symptoms, duration
- Asks one clarification question at a time
- Maintains session state

### 4. Risk Assessment
- Once all required fields collected:
  - Assesses risk level (low/moderate/high)
  - Stores anonymized data in Supabase
  - Triggers webhook with structured data

### 5. Response
- Returns awareness-based guidance
- Includes risk level indicator
- Always includes medical disclaimer

## LangGraph Workflow

```
┌──────────┐
│   Start  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Router  │ ────> Classifies: general | urgent | mental_wellbeing
└────┬─────┘
     │
     ├──────────────┬──────────────┐
     ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ General  │  │  Urgent  │  │  Mental  │
│ Symptom  │  │ Symptom  │  │Wellbeing │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │            │             │
     └────────────┴─────────────┘
                  │
                  ▼
              ┌────────┐
              │  END   │
              └────────┘
```

## State Management

Each symptom node:
1. Extracts information from user message
2. Checks for missing fields (symptoms, duration)
3. If missing: Sets `clarification_needed` and asks question
4. If complete: Sets `all_collected`, assesses risk, stores data, triggers webhook

## Security & Privacy

- **No PII Storage**: Only anonymized symptom data
- **Session-based**: Each conversation has unique session ID
- **No Diagnosis**: System only provides awareness guidance
- **Ethical Constraints**: Enforced in LLM prompts

## API Contracts

### POST /chat
**Request:**
```json
{
  "message": "string",
  "session_id": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "risk_level": "low | moderate | high | null",
  "disclaimer": true
}
```

### Webhook Payload
```json
{
  "age": "string | null",
  "symptoms": ["string"],
  "duration": "string",
  "risk_level": "low | moderate | high",
  "category": "general | urgent | mental_wellbeing"
}
```

## Error Handling

- Backend gracefully handles missing Supabase/webhook configuration
- Frontend shows user-friendly error messages
- LLM extraction failures fall back to simple keyword extraction
- All errors are logged for debugging

