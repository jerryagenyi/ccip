# Fix Dev Deployment 502 Error

## Issue
**URL**: https://ccip-dev.jerryagenyi.xyz/
**Error**: 502 Bad Gateway

## Root Cause
The dev deployment (`ccip-dev`) project is not properly configured in Dokploy.

## Solution

### Step 1: Create Dokploy Application

In Dokploy UI (http://72.61.19.90:3000):

1. Go to **Projects** → **New Project**
2. Name: `ccip-dev`
3. Git Repository: Select `jerryagenyi/ccip`
4. Branch: `dev`
5. Build Type: Docker Compose

### Step 2: Configure Docker Compose Command

**Compose Command**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -p ccip-dev up -d --build
```

### Step 3: Add Environment Variables

In Dokploy UI → **Environment Variables**, add from `.env.dev`:

```bash
# Application
APP_NAME=CCIP
APP_ENV=local
APP_DEBUG=true
APP_URL=https://ccip-dev-api.jerryagenyi.xyz
APP_KEY=<GENERATE WITH: php artisan key:generate>

# Database
DB_DATABASE=ccip_dev
DB_USERNAME=ccip_user
DB_PASSWORD=<STRONG_PASSWORD>

# Redis
REDIS_PASSWORD=<STRONG_PASSWORD>

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=<STRONG_PASSWORD>
MINIO_CONSOLE_URL=https://ccip-dev-minio.jerryagenyi.xyz
AWS_ACCESS_KEY_ID=<ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<SECRET_KEY>
AWS_BUCKET=ccip-dev-storage

# Frontend
VITE_API_URL=https://ccip-dev-api.jerryagenyi.xyz/api
VITE_APP_URL=https://ccip-dev.jerryagenyi.xyz

# Security
SANCTUM_STATEFUL_DOMAINS=ccip-dev-api.jerryagenyi.xyz,ccip-dev.jerryagenyi.xyz
SESSION_DOMAIN=jerryagenyi.xyz
JWT_SECRET=<STRONG_SECRET>
```

### Step 4: Configure Domains

In Dokploy UI → **Domains**, add:

1. **Frontend**: `ccip-dev.jerryagenyi.xyz`
   - Service: `frontend`
   - Port: `80`
   - HTTPS: Enabled

2. **Backend API**: `ccip-dev-api.jerryagenyi.xyz`
   - Service: `backend`
   - Port: `80`
   - HTTPS: Enabled

3. **MinIO Console**: `ccip-dev-minio.jerryagenyi.xyz`
   - Service: `minio`
   - Port: `9001`
   - HTTPS: Enabled

### Step 5: Deploy

1. Click **Deploy** in Dokploy
2. Wait for containers to build and start
3. Verify at https://ccip-dev.jerryagenyi.xyz

## Verification

After deployment, verify:
- [ ] Frontend loads: https://ccip-dev.jerryagenyi.xyz
- [ ] Backend API responds: https://ccip-dev-api.jerryagenyi.xyz/api/v1
- [ ] Health check passes: https://ccip-dev-api.jerryagenyi.xyz/api/health
- [ ] MinIO console accessible: https://ccip-dev-minio.jerryagenyi.xyz

## Troubleshooting

### Check Container Logs in Dokploy
1. Go to **Projects** → **ccip-dev**
2. Click on **Logs** tab
3. Select service (backend/frontend/database)
4. Check for errors

### Common Issues

1. **Container not starting**: Check Dockerfile.prod exists and builds successfully
2. **Port conflicts**: Ensure Traefik labels are correct in docker-compose.dev.yml
3. **Database connection failures**: Verify environment variables match

## Auto-Deploy Configuration

Dokploy should auto-deploy on push to `dev` branch once configured.
