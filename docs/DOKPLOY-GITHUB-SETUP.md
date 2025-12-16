# Dokploy GitHub Deployment - Complete Setup Guide

## Understanding the Architecture

### Local Development (Docker Compose)
```
docker-compose.yml
├── Builds images locally
├── Runs all services together
└── Uses .env files for configuration
```

### Production Deployment (Dokploy + GitHub)
```
GitHub Repo (main branch)
    ↓
Dokploy (on VPS)
├── Connects to GitHub
├── Builds Docker images from source
├── Deploys services
└── Manages environment variables in UI
```

**Key Difference:**
- **Local:** You build images, Docker Compose runs them
- **Production:** Dokploy builds images from GitHub, runs them on VPS

---

## Step 1: Connect GitHub to Dokploy

### 1.1 Authorize GitHub Access

1. Log into Dokploy: `http://72.61.19.90:3000`
2. Go to **Settings** → **Git**
3. Click **"Connect GitHub"** or **"Add GitHub Account"**
4. Authorize Dokploy to access your GitHub repositories
5. Select repository: `jerryagenyi/ccip`
6. Save configuration

**Note:** You'll see a message: *"To deploy using GitHub, you need to configure your account first. Please, go to Settings to do so."* - This is what we're doing!

### 1.2 Verify Connection

- Dokploy should now show your GitHub repositories
- You should see `jerryagenyi/ccip` available

---

## Step 2: Configure Backend Service (GitHub)

Based on your screenshot, you're already in the Backend service configuration. Here's what to set:

### 2.1 General Settings

1. **Provider:** Select **"Github"** ✅ (you've already done this)
2. **Repository:** Select `jerryagenyi/ccip`
3. **Branch:** `main`
4. **Build Type:** Select **"Dockerfile"**
5. **Docker File:** `backend/Dockerfile`
6. **Docker Context Path:** `backend`

**Important:** The Docker File field currently shows `ghcr.io/jerryagenyi/ccip/backend:latest` - this is for Docker image deployment. For GitHub deployment, change it to just `backend/Dockerfile`.

### 2.2 Enable Auto-Deploy

1. Find **"Autodeploy"** toggle (currently OFF)
2. **Turn it ON** ✅
3. This enables automatic deployment on push to `main`

### 2.3 Save Configuration

Click **"Save"** button at bottom right

---

## Step 3: Configure Frontend Service (GitHub)

1. Go back to your project
2. Click **"+ Add Service"**
3. Name: `frontend`
4. **Provider:** Select **"Github"**
5. **Repository:** Select `jerryagenyi/ccip`
6. **Branch:** `main`
7. **Build Type:** Select **"Dockerfile"**
8. **Docker File:** `frontend/Dockerfile`
9. **Docker Context Path:** `frontend`
10. **Port:** `5173`
11. **Autodeploy:** Turn ON ✅
12. Click **"Save"**

---

## Step 4: Add Supporting Services

You have two options:

### Option A: Use Docker Compose in Dokploy (Recommended)

1. In Dokploy project, click **"Docker Compose"** tab
2. Copy your `docker-compose.yml` content
3. Paste into Dokploy
4. Dokploy will deploy all services (PostgreSQL, Redis, MinIO, Backend, Frontend)
5. Update environment variables in Dokploy UI for each service

### Option B: Add Services Individually

Add each service separately:
- PostgreSQL (Docker image: `postgres:15-alpine`)
- Redis (Docker image: `redis:7-alpine`)
- MinIO (Docker image: `minio/minio:latest`)

---

## Step 5: Configure Environment Variables

### 5.1 Backend Environment Variables

Go to **Backend** service → **Environment** tab:

```env
APP_NAME=CCIP
APP_ENV=production
APP_KEY=<generate-with-php-artisan-key:generate>
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=ccip
DB_USERNAME=ccip_user
DB_PASSWORD=<your-secure-production-password>

REDIS_HOST=redis
REDIS_PORT=6379

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=<your-minio-password>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=ccip-uploads
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 5.2 Frontend Environment Variables

Go to **Frontend** service → **Environment** tab:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_VERSION=v1
VITE_APP_NAME=CCIP
VITE_APP_ENV=production
```

---

## Step 6: First Deployment

### 6.1 Manual Deployment

1. In Dokploy, go to **Backend** service
2. Click **"Deploy"** button (rocket icon)
3. Dokploy will:
   - Clone code from GitHub `main` branch
   - Build Docker image using `backend/Dockerfile`
   - Deploy container
4. Repeat for **Frontend** service

### 6.2 Verify Deployment

1. Check service logs in Dokploy
2. Verify services show "Running" status
3. Test API: `http://72.61.19.90:8000/api/health`
4. Test frontend: `http://72.61.19.90:5173`

---

## Step 7: Automatic Deployment

Once Auto-Deploy is enabled:

1. **Make changes** to your code
2. **Push to `main` branch:**
   ```bash
   git push origin main
   ```
3. **Dokploy automatically:**
   - Detects push via webhook
   - Pulls latest code
   - Builds new Docker images
   - Deploys updated services

**No GitHub Actions needed!** Dokploy handles everything.

---

## Environment Variables Security

### ✅ Created .env.example Files

I've created template files (safe to commit):
- `backend/.env.example` - Backend environment template
- `frontend/.env.example` - Frontend environment template  
- `.env.example` - Root Docker Compose template

### ✅ Verified .gitignore

Your `.gitignore` already includes:
- `.env`
- `backend/.env`
- `frontend/.env`

### ✅ No Secrets in Git

- ✅ No `.env` files are committed
- ✅ All secrets go in Dokploy UI (Environment tab)
- ✅ `.env.example` files are templates only

---

## How Enterprise Apps Handle This

### Standard Enterprise Pattern:

1. **Source Code** → GitHub (public/private repo)
2. **CI/CD Pipeline** → GitHub Actions (builds, tests)
3. **Deployment Platform** → Dokploy/Railway/Render/etc.
   - Connects to GitHub
   - Builds from source
   - Manages infrastructure
   - Handles environment variables securely

### Your Setup Matches This:

✅ **GitHub** = Source code repository  
✅ **Dokploy** = Deployment platform  
✅ **GitHub Integration** = Automatic builds  
✅ **Environment Variables** = Managed in Dokploy UI (secure)

---

## GitHub Actions Workflow (Simplified)

Since Dokploy builds from GitHub, your workflow can be simplified:

**Current workflow:** Builds images → Pushes to registry → Triggers Dokploy  
**With GitHub deployment:** Just push code → Dokploy handles everything

**You can:**
- Keep the build job for CI/CD testing
- Remove it entirely (Dokploy builds)
- Use it for pre-deployment validation

---

## Troubleshooting

### Issue: "To deploy using GitHub, you need to configure your account first"

**Solution:**
- Go to Settings → Git → Connect GitHub
- Authorize Dokploy
- Select repository

### Issue: Docker File field shows image instead of Dockerfile path

**Solution:**
- Change from: `ghcr.io/jerryagenyi/ccip/backend:latest`
- Change to: `backend/Dockerfile`
- Set Docker Context Path: `backend`

### Issue: Auto-deploy not working

**Solution:**
- Verify Autodeploy toggle is ON
- Check GitHub webhook in: https://github.com/jerryagenyi/ccip/settings/hooks
- Test webhook manually
- Check Dokploy logs

### Issue: Build fails

**Solution:**
- Verify Dockerfile path is correct
- Check Docker Context Path matches your repo structure
- Review build logs in Dokploy

---

## Quick Reference

**Dokploy URL:** `http://72.61.19.90:3000`  
**Project:** `ccip`  
**Backend Service:** `backend` (GitHub provider)  
**Frontend Service:** `frontend` (GitHub provider)  
**Auto-Deploy:** ON ✅  
**Branch:** `main`

---

## Next Steps

1. ✅ Connect GitHub in Dokploy Settings
2. ✅ Configure Backend service (GitHub provider)
3. ✅ Configure Frontend service (GitHub provider)
4. ✅ Enable Auto-Deploy
5. ✅ Add environment variables
6. ✅ Deploy supporting services (PostgreSQL, Redis, MinIO)
7. ⏳ Test first deployment
8. ⏳ Verify auto-deploy on push
9. ⏳ Configure domains and SSL
10. ⏳ Set up monitoring

See `docs/DOKPLOY-GITHUB-DEPLOYMENT.md` for detailed instructions.

