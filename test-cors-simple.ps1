# Simple CORS test for deployed application
Write-Host "Testing CORS Configuration..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Yellow

# Test backend health
Write-Host "`n1. Testing Backend Health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://hospital-ai-agent-8csv.onrender.com/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test CORS with simple API call
Write-Host "`n2. Testing CORS with API Call..." -ForegroundColor Cyan
try {
    $body = @{
        message = "test headache"
        session_id = "cors-test-$(Get-Date -Format 'yyyyMMddHHmmss')"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "https://hospital-ai-agent-8csv.onrender.com/chat" -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Origin" = "https://hospitalaiagent1.vercel.app"
        } `
        -Body $body `
        -TimeoutSec 15

    Write-Host "✅ API call successful: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response preview: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ API call failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend accessibility
Write-Host "`n3. Testing Frontend Accessibility..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://hospitalaiagent1.vercel.app" -Method GET -TimeoutSec 10
    Write-Host "✅ Frontend is accessible: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Yellow
Write-Host "CORS Test Complete!" -ForegroundColor Green
Write-Host "`nIf all tests pass, your deployment is ready!" -ForegroundColor Cyan
