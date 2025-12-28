# Docker Security Scanning Script (PowerShell)
# Scans all Docker images for vulnerabilities using Trivy

$ErrorActionPreference = "Stop"

Write-Host "🔒 Docker Security Scanning" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if Trivy is installed
$trivyPath = Get-Command trivy -ErrorAction SilentlyContinue
if (-not $trivyPath) {
    Write-Host "❌ Trivy is not installed." -ForegroundColor Red
    Write-Host "Install it with:" -ForegroundColor Yellow
    Write-Host "  Using Chocolatey: choco install trivy" -ForegroundColor Yellow
    Write-Host "  Or download from: https://github.com/aquasecurity/trivy/releases" -ForegroundColor Yellow
    Write-Host "  Extract and add to PATH, or use: scoop install trivy" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Trivy found: $($trivyPath.Version)" -ForegroundColor Green
Write-Host ""

# Get all images from docker-compose files
$images = @()

# Extract images from docker-compose.yml
if (Test-Path "docker-compose.yml") {
    Write-Host "📋 Scanning docker-compose.yml..." -ForegroundColor Cyan
    $content = Get-Content "docker-compose.yml" -Raw
    $matches = [regex]::Matches($content, '(?m)^\s+image:\s*(.+)$')
    foreach ($match in $matches) {
        $image = $match.Groups[1].Value.Trim()
        if ($image -and $image -notin $images) {
            $images += $image
        }
    }
}

# Extract images from docker-compose.production.yml
if (Test-Path "docker-compose.production.yml") {
    Write-Host "📋 Scanning docker-compose.production.yml..." -ForegroundColor Cyan
    $content = Get-Content "docker-compose.production.yml" -Raw
    $matches = [regex]::Matches($content, '(?m)^\s+image:\s*(.+)$')
    foreach ($match in $matches) {
        $image = $match.Groups[1].Value.Trim()
        if ($image -and $image -notin $images) {
            $images += $image
        }
    }
}

# Try to get built images from docker-compose
try {
    $builtImages = docker-compose config --images 2>$null
    if ($builtImages) {
        foreach ($img in $builtImages) {
            if ($img -and $img -notin $images) {
                $images += $img
            }
        }
    }
} catch {
    # Ignore errors
}

# Remove duplicates and sort
$images = $images | Sort-Object -Unique

if ($images.Count -eq 0) {
    Write-Host "⚠️  No images found to scan" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($images.Count) unique image(s) to scan:" -ForegroundColor Cyan
foreach ($img in $images) {
    Write-Host "  - $img" -ForegroundColor Gray
}
Write-Host ""

# Scan each image
$failedScans = 0
foreach ($image in $images) {
    Write-Host "🔍 Scanning: $image" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    # Run Trivy scan
    $scanResult = & trivy image --severity HIGH,CRITICAL --exit-code 1 "$image" 2>&1
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "✅ No HIGH or CRITICAL vulnerabilities found" -ForegroundColor Green
    } else {
        Write-Host "❌ HIGH or CRITICAL vulnerabilities detected!" -ForegroundColor Red
        $failedScans++
    }
    Write-Host ""
}

# Summary
Write-Host "============================" -ForegroundColor Cyan
Write-Host "📊 Scan Summary" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Total images scanned: $($images.Count)" -ForegroundColor Cyan
if ($failedScans -eq 0) {
    Write-Host "✅ All images passed security scan" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ $failedScans image(s) have HIGH or CRITICAL vulnerabilities" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Recommendations:" -ForegroundColor Yellow
    Write-Host "  1. Update base images to latest versions" -ForegroundColor Yellow
    Write-Host "  2. Review and patch vulnerabilities" -ForegroundColor Yellow
    Write-Host "  3. Consider using distroless or alpine images" -ForegroundColor Yellow
    exit 1
}

