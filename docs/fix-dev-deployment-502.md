# Fix Dev Deployment 502 Error

## Issue
**URL**: https://ccip-dev.jerryagenyi.xyz/
**Error**: 502 Bad Gateway

## Root Cause
The dev deployment in Dokploy was not using the correct Dockerfiles and missing environment variable overrides.

## Solution

### Step 1: Create Dokploy Application (if not exists)

In Dokploy UI (http://72.61.19.90:3000):

1. Go to **Projects** → **New Project**
2. Name: `CCIP` or `ccip-dev`
3. Git Repository: Select `jerryagenyi/ccip`
4. Branch: `dev`
5. Build Type: Docker Compose

### Step 2: Add Environment Variables

In Dokploy UI → **Environment Variables**, add **ALL** variables from `.env.dev`:

```bash
# DOCKER BUILD CONFIGURATION
BACKEND_DOCKERFILE=Dockerfile.prod
FRONTEND_DOCKERFILE=Dockerfile.prod

# APPLICATION SETTINGS
APP_NAME=CCIP
APP_ENV=local
APP_DEBUG=true
APP_URL=https://ccip-dev-api.jerryagenyi.xyz
APP_KEY=base64:4EAd6nXaE1RKYumGiHXMiVEXYUcMvBzImUx6BpUeiI8=

# DATABASE
DB_DATABASE=ccip_dev
DB_USERNAME=ccip_user
DB_PASSWORD=vJ7#mK9$qL2@pN5r

# REDIS
REDIS_PASSWORD=rY5@kP8#mX2*wL9v

# MINIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=K2#mN8$pQ5@xR7w
MINIO_CONSOLE_URL=https://ccip-dev-minio.jerryagenyi.xyz
AWS_ACCESS_KEY_ID=ccip_minio_access
AWS_SECRET_ACCESS_KEY=S4@bT7!kW9*mL2p
AWS_BUCKET=ccip-dev-storage

# FRONTEND
VITE_API_URL=https://ccip-dev-api.jerryagenyi.xyz/api
VITE_APP_URL=https://ccip-dev.jerryagenyi.xyz

# SECURITY
SANCTUM_STATEFUL_DOMAINS=ccip-dev-api.jerryagenyi.xyz,ccip-dev.jerryagenyi.xyz
SESSION_DOMAIN=jerryagenyi.xyz
JWT_SECRET=tG3&bH6!jZ9*pM4n
```

### Step 3: Verify Domains (Auto-Configured by Dokploy)

Dokploy automatically adds Traefik labels for routing. Verify these domains are configured:

1. **Frontend**: `ccip-dev.jerryagenyi.xyz` → Port 80
2. **Backend API**: `ccip-dev-api.jerryagenyi.xyz` → Port 80
3. **MinIO Console**: `ccip-dev-minio.jerryagenyi.xyz` → Port 9001

### Step 4: Deploy

1. Click **Deploy** in Dokploy
2. Dokploy will:
   - Pull the `dev` branch
   - Build images using `Dockerfile.prod` (via BACKEND_DOCKERFILE env var)
   - Start services with environment variables
   - Configure Traefik routing automatically
3. Wait for containers to build and start

## Verification

After deployment, verify:
- [ ] Frontend loads: https://ccip-dev.jerryagenyi.xyz
- [ ] Backend API responds: https://ccip-dev-api.jerryagenyi.xyz/api/v1
- [ ] Health check passes: https://ccip-dev-api.jerryagenyi.xyz/api/health
- [ ] MinIO console accessible: https://ccip-dev-minio.jerryagenyi.xyz

## Troubleshooting

### Check Container Logs in Dokploy
1. Go to **Projects** → **ccip-dev** (or **CCIP**)
2. Click on **Logs** tab
3. Select service (backend/frontend/database)
4. Check for errors

### Common Issues

1. **Container not starting**: Check Dockerfile.prod exists and builds successfully
2. **Wrong Dockerfile**: Ensure BACKEND_DOCKERFILE and FRONTEND_DOCKERFILE are set to `Dockerfile.prod`
3. **Database connection failures**: Verify DB_DATABASE is set to `ccip_dev`
4. **Environment variables not taking effect**: Redeploy after adding variables

## About This Approach

This deployment uses a **single docker-compose.yml** file with environment variable overrides:
- No more docker-compose.dev.yml or docker-compose.prod.yml files
- All differences between dev/prod are controlled via environment variables
- Dokploy automatically handles Traefik routing and SSL certificates
- Simply copy environment variables from `.env.dev` (dev) or `.env.production.example` (prod) into Dokploy

## Auto-Deploy Configuration

Dokploy auto-deploys on push to `dev` branch once configured.
