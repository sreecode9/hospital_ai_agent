# Google Gemini API Setup

The application has been configured to use Google Gemini instead of OpenAI.

## Changes Made

1. ✅ Replaced `langchain-openai` with `langchain-google-genai`
2. ✅ Updated code to use `ChatGoogleGenerativeAI` instead of `ChatOpenAI`
3. ✅ Changed model from `gpt-4o-mini` to `gemini-pro`
4. ✅ Updated environment variable from `OPENAI_API_KEY` to `GOOGLE_API_KEY`

## Setup Steps

### 1. Install the Google Gemini Package

In your activated virtual environment:

```cmd
pip install langchain-google-genai
```

Or reinstall all requirements:

```cmd
pip install -r requirements.txt
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Update Your .env File

Edit `backend/.env` and change:

```
GOOGLE_API_KEY=your-gemini-api-key-here
SUPABASE_URL=
SUPABASE_KEY=
WEBHOOK_URL=
```

**Important:**
- Replace `your-gemini-api-key-here` with your actual Gemini API key
- No quotes needed around the key
- No spaces around the `=` sign

### 4. Verify Setup

Run the check script:

```cmd
python check-env.py
```

You should see:
```
✅ GOOGLE_API_KEY: AIza... (found)
```

### 5. Start the Server

```cmd
python main.py
```

## Available Gemini Models

You can change the model in `backend/langgraph_workflow.py`:

- `gemini-pro` (default) - Best for general tasks
- `gemini-pro-vision` - For image understanding
- `gemini-1.5-pro` - Latest and most capable

Example:
```python
self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.3)
```

## Troubleshooting

### Error: "GOOGLE_API_KEY not found"
- Make sure `.env` file exists in `backend/` directory
- Verify the key is set: `GOOGLE_API_KEY=your-key` (no quotes)
- Restart the server after updating `.env`

### Error: "ModuleNotFoundError: No module named 'langchain_google_genai'"
- Install the package: `pip install langchain-google-genai`
- Make sure virtual environment is activated

### Error: "API key is invalid"
- Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Make sure there are no extra spaces or quotes in `.env` file
- Check that the key starts correctly (usually starts with `AIza`)

## Benefits of Using Gemini

- ✅ Free tier available (with rate limits)
- ✅ Good performance for health-related queries
- ✅ No credit card required for basic usage
- ✅ Competitive with OpenAI models





