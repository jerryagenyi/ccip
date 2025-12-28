# Quick Start Guide - Windows

## Step 1: Install Prerequisites

### Docker Desktop
1. Download: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Verify: `docker --version`

### Trivy (Security Scanner)
Choose one method:

**Option A: Chocolatey (Recommended)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Trivy
choco install trivy -y
```

**Option B: Scoop**
```powershell
# Install Scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Trivy
scoop install trivy
```

**Option C: Use the installer script**
```powershell
# Run as Administrator
.\scripts\install-trivy-windows.ps1
```

**Option D: Manual Download**
1. Go to: https://github.com/aquasecurity/trivy/releases
2. Download: `trivy_X.X.X_windows-64bit.zip`
3. Extract to `C:\Tools\trivy`
4. Add `C:\Tools\trivy` to PATH (System Properties → Environment Variables)
5. Restart PowerShell

**Verify:**
```powershell
trivy --version
```

## Step 2: Start Development Environment

```powershell
# Navigate to project
cd C:\Users\Username\Documents\github\ccip

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

**Services will be available at:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MinIO: http://localhost:9000
- PostgreSQL: localhost:5433
- Redis: localhost:6379

## Step 3: Run Security Scan

```powershell
# Run PowerShell security scan
.\scripts\security-scan.ps1

# Or scan specific image
trivy image postgres:15-alpine
trivy image redis:7-alpine
```

## Step 4: Development Workflow

### Backend (Laravel)
```powershell
# Access backend container
docker-compose exec backend bash

# Run migrations
php artisan migrate

# Generate key (if needed)
php artisan key:generate

# Run tests
php artisan test
```

### Frontend (Vue 3 + Quasar)
```powershell
# Access frontend container
docker-compose exec frontend sh

# Install dependencies (if needed)
npm install

# Run tests
npm run test
```

## Common Commands

```powershell
# Docker Compose
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose restart backend     # Restart backend
docker-compose logs -f backend    # Follow logs

# Security
.\scripts\security-scan.ps1      # Full security scan
trivy image <image>               # Scan specific image
trivy config docker-compose.yml    # Scan config

# Git
git status                        # Check status
git add .                         # Stage changes
git commit -m "message"          # Commit
git push                          # Push changes
```

## Troubleshooting

### Docker Not Running
- Start Docker Desktop
- Wait for it to fully start (whale icon in system tray)

### Permission Errors
- Run PowerShell as Administrator
- Check Docker Desktop → Settings → Resources → File Sharing

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Trivy Not Found
```powershell
# Check PATH
$env:PATH -split ';' | Select-String trivy

# Add manually (temporary)
$env:PATH += ";C:\Tools\trivy"
```

## Next Steps

1. ✅ Install Docker Desktop
2. ✅ Install Trivy
3. ✅ Start development environment
4. ✅ Run security scan
5. 📖 Read [WINDOWS_SETUP.md](./docs/WINDOWS_SETUP.md) for detailed setup
6. 📖 Read [SECURITY_SCANNING_GUIDE.md](./docs/SECURITY_SCANNING_GUIDE.md) for security best practices
7. 📖 Read [PRODUCTION_ENV_SETUP.md](./docs/PRODUCTION_ENV_SETUP.md) for production deployment

## Need Help?

- Windows Setup: [docs/WINDOWS_SETUP.md](./docs/WINDOWS_SETUP.md)
- Security: [README_SECURITY.md](./README_SECURITY.md)
- Security Scanning: [docs/SECURITY_SCANNING_GUIDE.md](./docs/SECURITY_SCANNING_GUIDE.md)
- Production: [docs/PRODUCTION_ENV_SETUP.md](./docs/PRODUCTION_ENV_SETUP.md)

