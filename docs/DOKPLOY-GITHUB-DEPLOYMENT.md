# Dokploy GitHub Deployment Setup Guide

Complete guide for deploying CCIP using Dokploy's GitHub integration (not Docker images).

## Understanding the Architecture

### Local Development (Docker Compose)
- **Purpose:** Run everything locally for development
- **Method:** `docker-compose.yml` orchestrates all services
- **Build:** Images built locally from Dockerfiles
- **Services:** Backend, Frontend, PostgreSQL, Redis, MinIO all in one stack

### Production Deployment (Dokploy + GitHub)
- **Purpose:** Deploy to production VPS
- **Method:** Dokploy connects to GitHub repo and builds from source
- **Build:** Dokploy builds Docker images on the VPS from your GitHub repo
- **Services:** Dokploy manages each service separately (or via Docker Compose)

## Why GitHub Deployment vs Docker Images?

**GitHub Deployment (Recommended for Enterprise):**
- ✅ Dokploy builds from source code (always latest)
- ✅ No need to build/push images in GitHub Actions
- ✅ Dokploy handles building, caching, and deployment
- ✅ Simpler CI/CD pipeline
- ✅ Better for teams (single source of truth)

**Docker Image Deployment:**
- ✅ Pre-built images (faster deployment)
- ✅ More control over build process
- ❌ Requires building images in CI/CD
- ❌ More complex setup

**For CCIP:** GitHub deployment is recommended because:
1. Simpler workflow (just push code)
2. Dokploy handles building
3. Better for continuous deployment
4. Matches enterprise best practices

---

## Step 1: Configure GitHub Integration in Dokploy

### 1.1 Connect GitHub Account

1. Log into Dokploy: `http://72.61.19.90:3000`
2. Go to **Settings** → **Git**
3. Click **"Connect GitHub"** or **"Add GitHub Account"**
4. Authorize Dokploy to access your GitHub account
5. Select repository: `jerryagenyi/ccip`
6. Save configuration

### 1.2 Verify Connection

- Dokploy should now show your GitHub repositories
- You should see `jerryagenyi/ccip` in the list

---

## Step 2: Create Project in Dokploy

### 2.1 Create Project

1. In Dokploy dashboard, click **"+ Create Project"**
2. Name: `ccip`
3. Click **"Create Project"**

### 2.2 Add Backend Service (GitHub)

1. In your `ccip` project, click **"+ Add Service"**
2. Name: `backend`
3. **Provider:** Select **"GitHub"**
4. **Repository:** Select `jerryagenyi/ccip`
5. **Branch:** `main`
6. **Build Type:** Select **"Dockerfile"**
7. **Docker File:** `backend/Dockerfile`
8. **Docker Context Path:** `backend`
9. **Port:** `8000`
10. Click **"Save"**

### 2.3 Add Frontend Service (GitHub)

1. Click **"+ Add Service"** again
2. Name: `frontend`
3. **Provider:** Select **"GitHub"**
4. **Repository:** Select `jerryagenyi/ccip`
5. **Branch:** `main`
6. **Build Type:** Select **"Dockerfile"**
7. **Docker File:** `frontend/Dockerfile`
8. **Docker Context Path:** `frontend`
9. **Port:** `5173`
10. Click **"Save"**

### 2.4 Add Supporting Services

You have two options:

**Option A: Add as Separate Services (Recommended)**

1. **PostgreSQL Service:**
   - Name: `postgres`
   - Provider: **Docker**
   - Image: `postgres:15-alpine`
   - Port: `5432`
   - Environment Variables:
     - `POSTGRES_DB=ccip`
     - `POSTGRES_USER=ccip_user`
     - `POSTGRES_PASSWORD=<your-secure-password>`

2. **Redis Service:**
   - Name: `redis`
   - Provider: **Docker**
   - Image: `redis:7-alpine`
   - Port: `6379`

3. **MinIO Service:**
   - Name: `minio`
   - Provider: **Docker**
   - Image: `minio/minio:latest`
   - Command: `server /data --console-address ":9001"`
   - Ports: `9000` (API), `9001` (Console)
   - Environment Variables:
     - `MINIO_ROOT_USER=minioadmin`
     - `MINIO_ROOT_PASSWORD=<your-secure-password>`

**Option B: Use Docker Compose (Simpler)**

1. In Dokploy project, click **"Docker Compose"** tab
2. Paste your `docker-compose.yml` content
3. Dokploy will deploy all services from compose file
4. Update environment variables in Dokploy UI

---

## Step 3: Configure Environment Variables

### 3.1 Backend Environment Variables

In Dokploy, go to **Backend** service → **Environment** tab:

Add these variables (from `backend/.env.example`):

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
DB_PASSWORD=<your-secure-password>

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

### 3.2 Frontend Environment Variables

In Dokploy, go to **Frontend** service → **Environment** tab:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_VERSION=v1
VITE_APP_NAME=CCIP
VITE_APP_ENV=production
```

---

## Step 4: Enable Auto-Deploy

### 4.1 Enable Auto-Deploy in Dokploy

For each service (Backend, Frontend):

1. Go to service → **General** tab
2. Find **"Autodeploy"** toggle
3. **Turn it ON** ✅
4. This will automatically deploy when you push to `main` branch

### 4.2 Configure Webhook (Optional)

Dokploy should automatically set up webhooks when you connect GitHub. Verify:

1. Go to GitHub: https://github.com/jerryagenyi/ccip/settings/hooks
2. You should see a webhook from Dokploy
3. Test the webhook to ensure it's working

---

## Step 5: Update GitHub Actions Workflow

Since Dokploy builds from GitHub, we can simplify the workflow:

**Option 1: Just Trigger Dokploy (Simplest)**

The workflow just needs to notify Dokploy that code was pushed. Dokploy's webhook handles the rest.

**Option 2: Keep Build Step (For CI/CD)**

Keep building images for:
- Testing
- Pre-deployment validation
- Rollback capabilities

---

## Step 6: First Deployment

### 6.1 Manual Deployment

1. In Dokploy, go to **Backend** service
2. Click **"Deploy"** button
3. Dokploy will:
   - Clone code from GitHub
   - Build Docker image from `backend/Dockerfile`
   - Deploy container
4. Repeat for **Frontend** service

### 6.2 Verify Deployment

1. Check service logs in Dokploy
2. Verify services are running
3. Test API endpoints
4. Test frontend

---

## Step 7: Automatic Deployment

Once auto-deploy is enabled:

1. Make changes to code
2. Push to `main` branch
3. Dokploy webhook triggers
4. Dokploy automatically:
   - Pulls latest code
   - Builds new images
   - Deploys updated services

---

## Environment Variables Security

### ✅ What's Safe in Git

- `.env.example` files (templates)
- Default values in `docker-compose.yml`
- Configuration files (without secrets)

### ❌ Never Commit

- `.env` files (actual secrets)
- Passwords, API keys, tokens
- Production credentials

### ✅ What We've Done

1. Created `.env.example` files:
   - `backend/.env.example`
   - `frontend/.env.example`
   - `.env.example` (root)

2. Verified `.gitignore` includes:
   - `.env`
   - `.env.local`
   - `backend/.env`
   - `frontend/.env`

3. All secrets go in Dokploy UI (Environment tab)

---

## Troubleshooting

### Issue: GitHub connection fails

**Solution:**
- Check GitHub token permissions in Dokploy Settings → Git
- Re-authorize GitHub connection
- Verify repository access

### Issue: Build fails

**Solution:**
- Check Dockerfile paths are correct
- Verify Docker context path
- Check build logs in Dokploy

### Issue: Services can't connect

**Solution:**
- Verify service names match (e.g., `postgres`, `redis`, `minio`)
- Check environment variables reference correct service names
- Ensure services are in same Dokploy project/network

### Issue: Auto-deploy not working

**Solution:**
- Verify webhook is configured in GitHub
- Check Autodeploy toggle is ON in Dokploy
- Test webhook manually in GitHub

---

## Production Checklist

- [ ] GitHub connected in Dokploy
- [ ] Project `ccip` created
- [ ] Backend service configured (GitHub)
- [ ] Frontend service configured (GitHub)
- [ ] Supporting services added (PostgreSQL, Redis, MinIO)
- [ ] Environment variables configured
- [ ] Auto-deploy enabled
- [ ] Webhook verified
- [ ] First deployment successful
- [ ] Health checks configured
- [ ] SSL certificates configured
- [ ] Domain configured

---

## Next Steps

1. ✅ Complete Dokploy setup above
2. ✅ Configure environment variables
3. ✅ Enable auto-deploy
4. ✅ Test first deployment
5. ⏳ Set up domains and SSL
6. ⏳ Configure monitoring
7. ⏳ Set up backups

See `docs/DOKPLOY-SETUP.md` for alternative Docker image deployment method.

