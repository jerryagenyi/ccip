# Quick Auth Testing Script
Write-Host "`n=== CCIP Auth Testing ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/system/health" -Method GET -ErrorAction Stop
    Write-Host "   ✓ Backend is healthy" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Note: This might be due to cache configuration. Try testing in browser." -ForegroundColor Yellow
}

# Test 2: Login
Write-Host "`n2. Testing Login API..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@ccip.local"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.data.user.email)" -ForegroundColor Gray
    Write-Host "   Token: $($loginResponse.data.token.Substring(0,30))..." -ForegroundColor Gray
    $global:testToken = $loginResponse.data.token
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
}

Write-Host "`n=== Browser Testing Instructions ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open: http://localhost:5173/auth/login" -ForegroundColor White
Write-Host "2. Test Credentials:" -ForegroundColor White
Write-Host "   Email: admin@ccip.local" -ForegroundColor Gray
Write-Host "   Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open DevTools (F12) and check:" -ForegroundColor White
Write-Host "   - Console tab for errors" -ForegroundColor Gray
Write-Host "   - Network tab for API calls" -ForegroundColor Gray
Write-Host "   - Application > Local Storage for auth_token" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test all auth pages:" -ForegroundColor White
Write-Host "   - Login: /auth/login" -ForegroundColor Gray
Write-Host "   - Register: /auth/register" -ForegroundColor Gray
Write-Host "   - Forgot Password: /auth/forgot-password" -ForegroundColor Gray
Write-Host "   - Reset Password: /auth/reset-password" -ForegroundColor Gray
Write-Host ""

