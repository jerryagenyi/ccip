# Windows Setup Guide for CCIP

## Prerequisites

### 1. Install Docker Desktop for Windows

Download and install from: https://www.docker.com/products/docker-desktop/

**Requirements:**
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- WSL 2 feature enabled
- Virtualization enabled in BIOS

**After installation:**
- Start Docker Desktop
- Verify: `docker --version`
- Verify: `docker-compose --version`

### 2. Install Trivy (Security Scanner)

**Option A: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not already installed
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Trivy
choco install trivy -y
```

**Option B: Using Scoop**
```powershell
# Install Scoop if not already installed
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Trivy
scoop install trivy
```

**Option C: Manual Installation**
1. Download from: https://github.com/aquasecurity/trivy/releases
2. Download `trivy_X.X.X_windows-64bit.zip`
3. Extract to a folder (e.g., `C:\Tools\trivy`)
4. Add to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\Tools\trivy` to PATH
   - Restart PowerShell

**Verify installation:**
```powershell
trivy --version
```

### 3. Install Git for Windows

Download from: https://git-scm.com/download/win

This provides Git Bash which can run bash scripts if needed.

## Development Setup

### 1. Clone Repository

```powershell
cd C:\Users\Username\Documents\github
git clone https://github.com/jerryagenyi/ccip.git
cd ccip
```

### 2. Start Development Environment

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Run Security Scan

**Using PowerShell script:**
```powershell
.\scripts\security-scan.ps1
```

**Using Bash script (if Git Bash installed):**
```bash
# In Git Bash
./scripts/security-scan.sh
```

**Manual scan:**
```powershell
# Scan specific image
trivy image postgres:15-alpine

# Scan with severity filter
trivy image --severity HIGH,CRITICAL redis:7-alpine

# Scan docker-compose config
trivy config docker-compose.yml
```

## Windows-Specific Notes

### File Permissions

Windows handles file permissions differently than Linux. If you encounter permission issues:

1. **Docker Desktop Settings:**
   - Go to Settings → Resources → File Sharing
   - Ensure your project directory is shared

2. **WSL 2 Integration:**
   - Docker Desktop uses WSL 2 backend
   - Files are accessed through WSL 2 filesystem
   - Use forward slashes in paths: `./backend` not `.\backend`

### Line Endings

Git on Windows may convert line endings (LF → CRLF). This is normal and Git handles it automatically.

### PowerShell vs CMD

- Use PowerShell for scripts (`.ps1` files)
- Use CMD or Git Bash for bash scripts (`.sh` files)
- All Docker commands work in both

### Path Separators

In PowerShell scripts, use:
- Forward slashes: `./scripts/security-scan.ps1` ✅
- Or backslashes: `.\scripts\security-scan.ps1` ✅

In Docker Compose, always use forward slashes:
- `./backend` ✅
- `.\backend` ❌

## Troubleshooting

### Docker Commands Not Found

```powershell
# Restart Docker Desktop
# Or restart PowerShell after Docker installation
```

### Permission Denied Errors

```powershell
# Run PowerShell as Administrator
# Or check Docker Desktop file sharing settings
```

### Trivy Not Found

```powershell
# Check if Trivy is in PATH
$env:PATH -split ';' | Select-String trivy

# If not found, add manually:
$env:PATH += ";C:\Tools\trivy"
```

### WSL 2 Issues

```powershell
# Enable WSL 2
wsl --install

# Set WSL 2 as default
wsl --set-default-version 2

# Restart Docker Desktop
```

## Quick Commands Reference

```powershell
# Docker
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose ps                  # List containers
docker-compose logs backend        # View logs
docker-compose restart backend     # Restart service

# Security
.\scripts\security-scan.ps1       # Run security scan
trivy image <image-name>          # Scan image
trivy config docker-compose.yml   # Scan config

# Git
git status                        # Check status
git add .                         # Stage changes
git commit -m "message"           # Commit
git push                          # Push changes
```

## Next Steps

1. ✅ Install Docker Desktop
2. ✅ Install Trivy
3. ✅ Start development environment
4. ✅ Run security scan
5. Review [PRODUCTION_ENV_SETUP.md](./PRODUCTION_ENV_SETUP.md) for production deployment
6. Review [SECURITY_SCANNING_GUIDE.md](./SECURITY_SCANNING_GUIDE.md) for detailed scanning options

