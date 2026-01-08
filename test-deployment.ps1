# Test CORS and API for deployed application
# Run this in PowerShell

Write-Host "Testing CORS and API connectivity..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Yellow

# Test 1: Health check
Write-Host "`n1. Testing backend health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "https://hospital-ai-agent-8csv.onrender.com/health" -Method GET
    Write-Host "✅ Backend health check: $($healthResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($healthResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: CORS preflight request
Write-Host "`n2. Testing CORS preflight..." -ForegroundColor Cyan
try {
    $corsResponse = Invoke-WebRequest -Uri "https://hospital-ai-agent-8csv.onrender.com/chat" -Method OPTIONS -Headers @{
        "Origin" = "https://hospitalaiagent1.vercel.app"
        "Access-Control-Request-Method" = "POST"
    }
    Write-Host "✅ CORS preflight: $($corsResponse.StatusCode)" -ForegroundColor Green

    # Check CORS headers
    $corsHeaders = $corsResponse.Headers
    if ($corsHeaders.ContainsKey("Access-Control-Allow-Origin")) {
        Write-Host "✅ Access-Control-Allow-Origin: $($corsHeaders['Access-Control-Allow-Origin'])" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing Access-Control-Allow-Origin header" -ForegroundColor Red
    }

    if ($corsHeaders.ContainsKey("Access-Control-Allow-Methods")) {
        Write-Host "✅ Access-Control-Allow-Methods: $($corsHeaders['Access-Control-Allow-Methods'])" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing Access-Control-Allow-Methods header" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ CORS preflight failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: API call
Write-Host "`n3. Testing API call..." -ForegroundColor Cyan
try {
    $body = @{
        message = "headache"
        session_id = "test-$(Get-Random)"
    } | ConvertTo-Json

    $apiResponse = Invoke-WebRequest -Uri "https://hospital-ai-agent-8csv.onrender.com/chat" -Method POST -Headers @{
        "Content-Type" = "application/json"
        "Origin" = "https://hospitalaiagent1.vercel.app"
    } -Body $body

    Write-Host "✅ API call successful: $($apiResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($apiResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ API call failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Frontend accessibility
Write-Host "`n4. Testing frontend accessibility..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://hospitalaiagent1.vercel.app" -Method GET
    Write-Host "✅ Frontend accessible: $($frontendResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Yellow
Write-Host "Testing complete!" -ForegroundColor Green
Write-Host "`nIf all tests pass, your deployment is working correctly." -ForegroundColor Cyan

