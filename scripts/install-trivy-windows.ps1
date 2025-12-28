# Install Trivy on Windows
# Run this script as Administrator

$ErrorActionPreference = "Stop"

Write-Host "🔧 Installing Trivy Security Scanner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Trivy is already installed
if (Get-Command trivy -ErrorAction SilentlyContinue) {
    Write-Host "✅ Trivy is already installed!" -ForegroundColor Green
    trivy --version
    exit 0
}

# Check for Chocolatey
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "📦 Found Chocolatey, installing Trivy..." -ForegroundColor Cyan
    choco install trivy -y
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Trivy installed successfully!" -ForegroundColor Green
        trivy --version
        exit 0
    }
}

# Check for Scoop
if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Host "📦 Found Scoop, installing Trivy..." -ForegroundColor Cyan
    scoop install trivy
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Trivy installed successfully!" -ForegroundColor Green
        trivy --version
        exit 0
    }
}

# Manual installation instructions
Write-Host "⚠️  Package manager not found. Manual installation required." -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Install Chocolatey first, then run this script again" -ForegroundColor Yellow
Write-Host "  Run PowerShell as Administrator:" -ForegroundColor Yellow
Write-Host "  Set-ExecutionPolicy Bypass -Scope Process -Force" -ForegroundColor Gray
Write-Host "  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072" -ForegroundColor Gray
Write-Host "  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Install Scoop first, then run this script again" -ForegroundColor Yellow
Write-Host "  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Gray
Write-Host "  irm get.scoop.sh | iex" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Manual download" -ForegroundColor Yellow
Write-Host "  1. Download from: https://github.com/aquasecurity/trivy/releases" -ForegroundColor Gray
Write-Host "  2. Download: trivy_X.X.X_windows-64bit.zip" -ForegroundColor Gray
Write-Host "  3. Extract to: C:\Tools\trivy" -ForegroundColor Gray
Write-Host "  4. Add C:\Tools\trivy to PATH environment variable" -ForegroundColor Gray
Write-Host "  5. Restart PowerShell" -ForegroundColor Gray
Write-Host ""
Write-Host "After installation, verify with: trivy --version" -ForegroundColor Cyan

