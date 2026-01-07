# AI-Powered Symptom Checking Assistant

A minimal AI-powered symptom-checking assistant that provides health awareness guidance without diagnosing diseases or suggesting treatments. Built with React, FastAPI, and LangGraph.

## Features

- Natural language symptom understanding
- Automatic symptom categorization (general, urgent, mental wellbeing)
- Health risk awareness assessment
- Structured data collection (age, symptoms, duration)
- Anonymized data storage in Supabase
- Webhook integration for structured data delivery
- Ethical, non-diagnostic guidance

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Python + FastAPI
- **AI/Workflow**: LangGraph + LangChain + OpenAI
- **Database**: Supabase (PostgreSQL)
- **Webhook**: HTTP POST integration

## Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── langgraph_workflow.py   # LangGraph workflow logic
│   ├── supabase_client.py      # Supabase integration
│   ├── webhook_client.py       # Webhook client
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── Disclaimer.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key
- Supabase account (optional, for data storage)
- Webhook URL (optional, for data delivery)

### Backend Setup

**Windows Users (Recommended):**
1. Navigate to the backend directory:
```cmd
cd backend
```

2. Run the setup script:
```cmd
setup.bat
```

**OR Manual Setup:**

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
   - **Windows (Command Prompt):** `venv\Scripts\activate.bat`
   - **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1` (may require execution policy change)
   - **Mac/Linux:** `source venv/bin/activate`

4. Upgrade pip (recommended):
```bash
python -m pip install --upgrade pip
```

5. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
WEBHOOK_URL=your_webhook_url_here
```

5. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create the interactions table:

```sql
CREATE TABLE interactions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  category TEXT,
  age TEXT,
  symptoms TEXT[],
  duration TEXT,
  risk_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_session_id ON interactions(session_id);
CREATE INDEX idx_created_at ON interactions(created_at);
```

## API Endpoints

### POST /chat

Send a message to the symptom checker.

**Request:**
```json
{
  "message": "I have a headache and fever",
  "session_id": "session_123"
}
```

**Response:**
```json
{
  "response": "Based on your symptoms, this may indicate a potential health concern. Consider consulting a healthcare professional for proper evaluation.",
  "risk_level": "moderate",
  "disclaimer": true
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Webhook Payload

When all required information is collected, the system sends a POST request to the configured webhook URL:

```json
{
  "age": "25",
  "symptoms": ["headache", "fever"],
  "duration": "2 days",
  "risk_level": "moderate",
  "category": "general"
}
```

## Ethical Guidelines

This system adheres to strict ethical guidelines:

- ❌ Does NOT diagnose diseases
- ❌ Does NOT recommend medicines
- ❌ Does NOT provide treatment steps
- ✅ Provides awareness-based guidance only
- ✅ Encourages consultation with healthcare professionals
- ✅ Uses safe, supportive language

## Development

### Backend Development

The LangGraph workflow consists of:
- `start_node`: Entry point
- `router_node`: Classifies symptoms into categories
- `general_symptom_node`: Handles general symptoms
- `urgent_symptom_node`: Handles urgent symptoms
- `mental_wellbeing_node`: Handles mental health concerns

### Frontend Development

The React app uses a simple chat interface with:
- Persistent medical disclaimer
- Real-time message display
- Risk level indicators
- Responsive design

## License

This project is built for educational and awareness purposes only. It does not provide medical advice.

