# Simple CORS test for deployed application

Write-Host "Testing CORS Configuration..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Yellow

# Test backend health
Write-Host ""
Write-Host "Testing Backend Health..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/health" -Method GET
    Write-Host "SUCCESS: Backend Status - $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Backend Health - $($_.Exception.Message)" -ForegroundColor Red
}

# Test CORS
Write-Host ""
Write-Host "Testing CORS Headers..." -ForegroundColor Green
try {
    $corsTest = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/chat" -Method OPTIONS -Headers @{
        "Origin" = "https://hospitalaiagent1.vercel.app"
        "Access-Control-Request-Method" = "POST"
    }

    $headers = $corsTest.Headers
    if ($headers.ContainsKey("Access-Control-Allow-Origin")) {
        Write-Host "SUCCESS: CORS Origin Allowed - $($headers['Access-Control-Allow-Origin'])" -ForegroundColor Green
    } else {
        Write-Host "ERROR: CORS Origin Not Allowed" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: CORS Test Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test API
Write-Host ""
Write-Host "Testing API Functionality..." -ForegroundColor Green
try {
    $body = @{ message = "headache"; session_id = "test" } | ConvertTo-Json
    $apiTest = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/chat" -Method POST -Headers @{
        "Content-Type" = "application/json"
        "Origin" = "https://hospitalaiagent1.vercel.app"
    } -Body $body

    Write-Host "SUCCESS: API Response - $($apiTest.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: API Test Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
Write-Host ""
Write-Host "Testing Frontend..." -ForegroundColor Green
try {
    $frontendTest = Invoke-WebRequest -Uri "https://hospitalaiagent1.vercel.app" -Method GET
    Write-Host "SUCCESS: Frontend Status - $($frontendTest.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Frontend Not Accessible - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================" -ForegroundColor Yellow
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all tests show SUCCESS, your CORS is configured correctly!" -ForegroundColor White
Write-Host "Visit: https://hospitalaiagent1.vercel.app" -ForegroundColor White
