@echo off
echo Creating .env file from template...
copy env.template .env
echo.
echo .env file created!
echo.
echo Please edit .env file and add your API keys:
echo   - GOOGLE_API_KEY (required) - Get from https://aistudio.google.com/app/apikey
echo   - SUPABASE_URL (optional)
echo   - SUPABASE_KEY (optional)
echo   - WEBHOOK_URL (optional)
echo.
echo You can edit it with: notepad .env
echo.
pause

