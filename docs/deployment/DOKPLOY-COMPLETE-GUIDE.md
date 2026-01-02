# Dokploy Complete Setup Guide for CCIP

## Overview

This guide covers the complete setup of CCIP deployment using Dokploy, Docker Compose, and GitHub CI/CD integration.

**Architecture:**
- VPS: Hostinger
- Domain: jerryagenyi.xyz (Cloudflare)
- Local Development: Docker Compose
- Production: Docker Compose via Dokploy
- CI/CD: GitHub Actions (dev → main → production)

---

## Quick Status

✅ **Completed:**
- Dokploy CLI installed and authenticated
- Dokploy project created: http://72.61.19.90:3000/dashboard/project/xzYEMcKghF7krrf2peEaI
- GitHub repository connected to Dokploy
- Frontend, Backend, and PostgreSQL services created in Dokploy
- GitHub workflows configured (CI + Deploy)

⏳ **To Do:**
- Add Redis and MinIO services
- Configure Docker Compose deployment
- Set up environment variables
- Configure domain and SSL
- Test full CI/CD pipeline

---

## Phase 1: Complete Dokploy Setup

### 1.1 Check Current Services

Since you already have services created, let's verify them:

```bash
# List all applications in your project
dokploy app list --project xzYEMcKghF7krrf2peEaI
```

### 1.2 Add Missing Services

We need to add Redis and MinIO to your existing setup:

**Option A: Add via Dokploy UI**
1. Go to your project: http://72.61.19.90:3000/dashboard/project/xzYEMcKghF7krrf2peEaI
2. Click "New" → "Database" → "Redis"
3. Click "New" → "Application" → "Docker Compose" for MinIO

**Option B: Use Docker Compose (Recommended)**
Create a single Docker Compose application that includes all services.

### 1.3 Create Production Docker Compose

In your Dokploy project, create a new application with Docker Compose:

**Application Settings:**
- Name: `ccip-stack`
- Source: Docker Compose
- Auto-deploy: ✅ Enabled
- Branch: `main`

**Docker Compose Content:**

```yaml
version: '3.8'

services:
  database:
    image: postgres:16
    container_name: ccip_database
    environment:
      POSTGRES_DB: ccip_production
      POSTGRES_USER: ccip_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-CHANGE_THIS_STRONG_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ccip_user -d ccip_production"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ccip_redis
    command: redis-server --requirepass ${REDIS_PASSWORD:-CHANGE_THIS_STRONG_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: ccip_minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-CHANGE_THIS_STRONG_PASSWORD}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ccip_backend
    environment:
      # Database
      DB_HOST=database
      DB_PORT=5432
      DB_DATABASE=ccip_production
      DB_USERNAME=ccip_user
      DB_PASSWORD=${DB_PASSWORD:-CHANGE_THIS_STRONG_PASSWORD}

      # Laravel
      APP_NAME=CCIP
      APP_ENV=production
      APP_DEBUG=false
      APP_URL=https://api.jerryagenyi.xyz
      APP_KEY=base64:YOUR_LARAVEL_KEY_HERE

      # Cache/Queue
      CACHE_DRIVER=redis
      REDIS_HOST=redis
      REDIS_PORT=6379
      REDIS_PASSWORD=${REDIS_PASSWORD:-CHANGE_THIS_STRONG_PASSWORD}
      QUEUE_CONNECTION=redis

      # Storage (MinIO)
      FILESYSTEM_DISK=s3
      AWS_ACCESS_KEY_ID=ccip_minio_access
      AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-CHANGE_THIS_SECRET_KEY}
      AWS_DEFAULT_REGION=us-east-1
      AWS_BUCKET=ccip-storage
      AWS_ENDPOINT=http://minio:9000
      AWS_USE_PATH_STYLE_ENDPOINT=true

      # Security
      SANCTUM_STATEFUL_DOMAINS=api.jerryagenyi.xyz,jerryagenyi.xyz
      SESSION_DOMAIN=jerryagenyi.xyz
      JWT_SECRET=${JWT_SECRET:-CHANGE_THIS_STRONG_SECRET}
      CORS_ALLOW_ALL_ORIGINS=false
      CORS_ALLOWED_ORIGINS=https://app.jerryagenyi.xyz

    volumes:
      - backend_storage:/var/www/html/storage
      - backend_uploads:/var/www/html/public/uploads
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "php-fpm", "t"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ccip_frontend
    environment:
      VITE_API_URL=https://api.jerryagenyi.xyz/api
      VITE_APP_URL=https://app.jerryagenyi.xyz
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
  minio_data:
  backend_storage:
  backend_uploads:
```

### 1.4 Configure Environment Variables

Add these in Dokploy under Environment Variables:

```bash
# ===== DATABASE =====
POSTGRES_PASSWORD=vJ7#mK9$qL2@pN5r
DB_PASSWORD=vJ7#mK9$qL2@pN5r

# ===== LARAVEL =====
APP_KEY=base64:YOUR_LARAVEL_KEY_HERE  # Generate after deploy
JWT_SECRET=tG3&bH6!jZ9*pM4n

# ===== REDIS =====
REDIS_PASSWORD=rY5@kP8#mX2*wL9v

# ===== MINIO =====
MINIO_ROOT_PASSWORD=K2#mN8$pQ5@xR7w
MINIO_ACCESS_KEY=ccip_minio_access
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-CHANGE_THIS_SECRET_KEY}
MINIO_BUCKET=ccip-storage
```

### 1.5 Configure Domains

In Dokploy, add domains to your services:

**Frontend Service:**
1. Go to the frontend application
2. Click "Domains" → "Add Domain"
3. Add: `app.jerryagenyi.xyz`
4. Enable HTTPS (Let's Encrypt)

**Backend Service:**
1. Go to the backend application
2. Click "Domains" → "Add Domain"
3. Add: `api.jerryagenyi.xyz`
4. Enable HTTPS

---

## Phase 2: DNS Configuration

### 2.1 Cloudflare DNS Setup

1. Log in to Cloudflare: https://dash.cloudflare.com
2. Select domain: `jerryagenyi.xyz`
3. Go to DNS → Records
4. Add these A records:

```
Type: A    Name: api       Content: 72.61.19.90    Proxy: Enabled   TTL: Auto
Type: A    Name: app       Content: 72.61.19.90    Proxy: Enabled   TTL: Auto
Type: A    Name: minio     Content: 72.61.19.90    Proxy: Disabled  TTL: Auto
```

### 2.2 SSL Configuration

With Dokploy and Cloudflare, SSL is automatic:
- Dokploy provides Let's Encrypt certificates
- Cloudflare adds additional SSL layer

---

## Phase 3: Initial Deployment

### 3.1 First Deploy

1. Ensure your code is on the `main` branch
2. Docker Compose application will auto-deploy
3. Wait for deployment to complete

### 3.2 Post-Deploy Setup

1. **Generate Laravel Key:**
   - In Dokploy, go to backend application
   - Click "Terminal"
   - Run: `php artisan key:generate --show`
   - Copy the key and update APP_KEY in environment variables
   - Redeploy

2. **Run Initial Commands:**
   ```bash
   # In backend terminal:
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache

   # Create MinIO bucket
   php artisan storage:make-public
   ```

### 3.3 Test Applications

Access your applications:
- Frontend: https://app.jerryagenyi.xyz
- Backend API: https://api.jerryagenyi.xyz/api
- MinIO Console: https://minio.jerryagenyi.xyz:9001

---

## Phase 4: CI/CD Pipeline

### 4.1 Current GitHub Workflows

Your current workflows are already configured correctly:

**`.github/workflows/ci.yml`**
- Runs on PRs to `main` and pushes to `dev`
- Tests backend (Laravel) and frontend (Vue 3)
- Runs security scans
- Required checks must pass before merge

**`.github/workflows/deploy.yml`**
- Runs on push to `main`
- Triggers Dokploy deployment
- With Auto-Deploy enabled, no API calls needed

### 4.2 Workflow Verification

1. **Check required status checks:**
   - In GitHub, go to Settings → Branches → Branch protection rules
   - Add `main` branch protection:
     - Require status checks to pass
     - Require branches to be up to date
     - Include: `backend-tests`, `frontend-tests`

2. **Test CI/CD:**
   ```bash
   # Create a test change
   git checkout dev
   echo "// test deployment" >> frontend/src/App.vue
   git add frontend/src/App.vue
   git commit -m "test: verify deployment pipeline"
   git push origin dev

   # Create PR
   gh pr create --title "Test Deployment" --body "Testing CI/CD pipeline"
   ```

3. **Merge to main to trigger deployment:**
   - After CI passes, merge PR
   - Deployment should auto-start in Dokploy

---

## Passwords & Security

### Generated Credentials (Save These!)

```bash
# DATABASE
DB_PASSWORD=vJ7#mK9$qL2@pN5r
POSTGRES_PASSWORD=vJ7#mK9$qL2@pN5r

# REDIS
REDIS_PASSWORD=rY5@kP8#mX2*wL9v

# MINIO
MINIO_ROOT_PASSWORD=K2#mN8$pQ5@xR7w
MINIO_ACCESS_KEY=ccip_minio_access
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-CHANGE_THIS_SECRET_KEY}

# JWT
JWT_SECRET=tG3&bH6!jZ9*pM4n

# LARAVEL (Generate after deploy)
APP_KEY=base64:YOUR_LARAVEL_KEY_HERE
```

### Security Checklist

- [ ] Store passwords securely (1Password, LastPass, etc.)
- [ ] Update default passwords
- [ ] Enable SSL on all domains
- [ ] Configure firewall rules
- [ ] Set up backups
- [ ] Monitor logs regularly

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DB_HOST is `database` (service name)
   - Check database container health
   - Ensure PostgreSQL is running

2. **MinIO Access Denied**
   - Verify AWS credentials
   - Check bucket exists
   - Ensure endpoint URL is correct

3. **Frontend Can't Reach API**
   - Check VITE_API_URL
   - Verify CORS settings
   - Check if backend is accessible

4. **SSL Certificate Error**
   - Wait for DNS propagation (5-10 minutes)
   - Verify A records in Cloudflare
   - Check proxy status (should be orange cloud)

5. **Deployment Failed**
   - Check Docker Compose syntax
   - Verify environment variables
   - Review build logs

### Debug Commands

```bash
# Check container status
docker ps -a

# View logs
docker logs ccip_backend
docker logs ccip_frontend

# Access container terminal
docker exec -it ccip_backend sh

# Force redeploy
docker-compose down && docker-compose up -d
```

---

## Monitoring & Maintenance

### 1. Health Checks

All services include health checks. Monitor via:
- Dokploy dashboard
- Docker health status
- Custom monitoring tools

### 2. Backups

```bash
# Database backup
docker exec ccip_database pg_dump -U ccip_user ccip_production > backup.sql

# MinIO backup (use mc tool)
mc mirror minio/ccip-storage /backup/ccip-storage
```

### 3. Updates

```bash
# Update images
docker-compose pull

# Recreate with new images
docker-compose up -d
```

---

## Migration from Individual Services

If you want to migrate from individual services to Docker Compose:

1. **Export data:**
   ```bash
   # Dump database
   docker exec old_database pg_dump > dump.sql

   # Backup MinIO
   mc cp --recursive old_minio/ccip-storage ./backup
   ```

2. **Delete old services** in Dokploy UI
3. **Create new Docker Compose** application
4. **Import data:**
   ```bash
   # Restore database
   docker exec -i new_database psql -U ccip_user ccip_production < dump.sql
   ```

---

## Support Resources

- Dokploy Documentation: https://docs.dokploy.com
- Docker Compose: https://docs.docker.com/compose/
- Laravel Deployment: https://laravel.com/docs/deployment
- Cloudflare DNS: https://developers.cloudflare.com/dns/
- GitHub Actions: https://docs.github.com/en/actions

---

## Next Steps

1. [ ] Deploy using Docker Compose
2. [ ] Configure domains in Dokploy
3. [ ] Set up DNS in Cloudflare
4. [ ] Generate Laravel key
5. [ ] Test full deployment
6. [ ] Verify CI/CD pipeline
7. [ ] Set up monitoring

---

Remember: You're using Docker Compose for production, which keeps everything consistent with your local development setup!