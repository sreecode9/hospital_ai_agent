@echo off
echo Creating .env file...
echo.
echo Please enter your API keys when prompted.
echo You can leave optional fields empty and press Enter.
echo.

set /p GOOGLE_KEY="Enter your Google Gemini API Key (required): "
set /p SUPABASE_URL="Enter your Supabase URL (optional, press Enter to skip): "
set /p SUPABASE_KEY="Enter your Supabase Key (optional, press Enter to skip): "
set /p WEBHOOK_URL="Enter your Webhook URL (optional, press Enter to skip): "

(
echo GOOGLE_API_KEY=%GOOGLE_KEY%
echo SUPABASE_URL=%SUPABASE_URL%
echo SUPABASE_KEY=%SUPABASE_KEY%
echo WEBHOOK_URL=%WEBHOOK_URL%
) > .env

echo.
echo .env file created successfully!
echo.
pause

