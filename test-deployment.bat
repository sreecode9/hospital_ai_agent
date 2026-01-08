@echo off
echo Testing CORS and API connectivity...
echo ==========================================
echo.

echo 1. Testing backend health...
curl -s -o nul -w "%%{http_code}" https://hospital-ai-agent-2.onrender.com/health > temp_health.txt
set /p health_code=<temp_health.txt
if "%health_code%"=="200" (
    echo ✅ Backend health check: %health_code%
    curl -s https://hospital-ai-agent-8csv.onrender.com/health
) else (
    echo ❌ Backend health check failed: %health_code%
)
echo.

echo 2. Testing CORS preflight...
curl -s -I -H "Origin: https://hospitalaiagent1.vercel.app" -H "Access-Control-Request-Method: POST" -X OPTIONS https://hospital-ai-agent-2.onrender.com/chat > temp_cors.txt
findstr /C:"HTTP/" temp_cors.txt > temp_status.txt
findstr /C:"Access-Control-Allow-Origin" temp_cors.txt > nul
if %errorlevel%==0 (
    echo ✅ CORS headers present
    findstr /C:"Access-Control-Allow-Origin" temp_cors.txt
) else (
    echo ❌ CORS headers missing
)
echo.

echo 3. Testing API call...
curl -s -X POST -H "Content-Type: application/json" -H "Origin: https://hospitalaiagent1.vercel.app" -d "{\"message\":\"headache\",\"session_id\":\"test\"}" https://hospital-ai-agent-2.onrender.com/chat > temp_api.txt
echo API Response:
type temp_api.txt
echo.

echo 4. Testing frontend accessibility...
curl -s -o nul -w "%%{http_code}" https://hospitalaiagent1.vercel.app > temp_frontend.txt
set /p frontend_code=<temp_frontend.txt
if "%frontend_code%"=="200" (
    echo ✅ Frontend accessible: %frontend_code%
) else (
    echo ❌ Frontend not accessible: %frontend_code%
)
echo.

echo ==========================================
echo Testing complete!
echo.
echo Clean up temporary files...
del temp_*.txt 2>nul

pause

