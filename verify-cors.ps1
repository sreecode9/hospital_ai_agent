# Simple CORS verification for production deployment

Write-Host "🔍 CORS Configuration Verification" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Yellow

# Test backend health
Write-Host "`n🏥 Testing Backend Health..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/health" -Method GET
    Write-Host "✅ Backend Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test CORS headers
Write-Host "`n🔗 Testing CORS Headers..." -ForegroundColor Green
try {
    $corsTest = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/chat" -Method OPTIONS -Headers @{
        "Origin" = "https://hospitalaiagent1.vercel.app"
        "Access-Control-Request-Method" = "POST"
    }

    $headers = $corsTest.Headers
    if ($headers.ContainsKey("Access-Control-Allow-Origin")) {
        Write-Host "✅ CORS Origin Allowed: $($headers['Access-Control-Allow-Origin'])" -ForegroundColor Green
    } else {
        Write-Host "❌ CORS Origin Not Allowed" -ForegroundColor Red
    }

    if ($headers.ContainsKey("Access-Control-Allow-Methods")) {
        Write-Host "✅ CORS Methods Allowed: $($headers['Access-Control-Allow-Methods'])" -ForegroundColor Green
    } else {
        Write-Host "❌ CORS Methods Not Set" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API functionality
Write-Host "`n🤖 Testing API Functionality..." -ForegroundColor Green
try {
    $body = @{ message = "test headache"; session_id = "cors-test" } | ConvertTo-Json
    $apiTest = Invoke-WebRequest -Uri "https://hospital-ai-agent-2.onrender.com/chat" -Method POST -Headers @{
        "Content-Type" = "application/json"
        "Origin" = "https://hospitalaiagent1.vercel.app"
    } -Body $body

    Write-Host "✅ API Response: $($apiTest.StatusCode)" -ForegroundColor Green
    $responseData = $apiTest.Content | ConvertFrom-Json
    Write-Host "✅ AI Response: $($responseData.response.Length) characters" -ForegroundColor Green
} catch {
    Write-Host "❌ API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend accessibility
Write-Host "`n🌐 Testing Frontend Accessibility..." -ForegroundColor Green
try {
    $frontendTest = Invoke-WebRequest -Uri "https://hospitalaiagent1.vercel.app" -Method GET
    Write-Host "✅ Frontend Status: $($frontendTest.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===================================" -ForegroundColor Yellow
Write-Host "🎉 CORS Verification Complete!" -ForegroundColor Cyan
Write-Host "`n📱 Your deployed app should work at: https://hospitalaiagent1.vercel.app" -ForegroundColor White