# Dokploy Deployment Guide

## Overview

CCIP uses **Docker Compose** with environment-specific override files for deployment. This provides a single source of truth (`docker-compose.yml`) with environment-specific configurations.

### Three Environments

1. **Local Development** - Your machine (`docker-compose up`)
2. **Dev/Staging** - Dokploy dev server (loads from `dev` branch)
3. **Production** - Dokploy production server (loads from `main` branch)

---

## File Structure

```
ccip/
├── docker-compose.yml              # Base configuration (single source of truth)
├── docker-compose.override.yml     # Local dev overrides (auto-loaded)
├── docker-compose.dev.yml          # Dev deployment overrides
├── docker-compose.prod.yml         # Production deployment overrides
├── .env                            # Local dev environment variables
├── .env.dev                        # Dev deployment variables
├── .env.example                    # Template for local dev
└── .env.production.example         # Template for production
```

---

## Local Development

### Start Services

```bash
# Docker Compose automatically loads docker-compose.override.yml
docker-compose up -d
```

### Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **Database**: localhost:5433
- **Redis**: localhost:6379

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Dev Deployment (Dokploy - Dev Branch)

### Prerequisites

- Dokploy server accessible
- Git repository with `dev` branch
- DNS records configured (see DNS section below)

### Step 1: Create Dokploy Application

In Dokploy UI:

1. Go to **Projects** → **New Project**
2. Name: `ccip-dev`
3. Git Repository: Select your CCIP repository
4. Branch: `dev`
5. Build Type: Docker Compose

### Step 2: Configure Docker Compose

In Dokploy application settings:

**Compose File Content:**
```yaml
# Dokploy will use docker-compose.yml + docker-compose.dev.yml
# You don't need to modify the compose files in Dokploy
```

**Project Name**: `ccip-dev`
**Compose Command**: 
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -p ccip-dev up -d
```

### Step 3: Add Environment Variables

In Dokploy UI → **Environment Variables**, add each variable from `.env.dev`:

```bash
# Application
APP_NAME=CCIP
APP_ENV=local
APP_DEBUG=true
APP_URL=https://ccip-dev-api.jerryagenyi.xyz
APP_KEY=base64:4EAd6nXaE1RKYumGiHXMiVEXYUcMvBzImUx6BpUeiI8=

# Database
DB_DATABASE=ccip_dev
DB_USERNAME=ccip_user
DB_PASSWORD=vJ7#mK9$qL2@pN5r

# Redis
REDIS_PASSWORD=rY5@kP8#mX2*wL9v

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=K2#mN8$pQ5@xR7w
MINIO_CONSOLE_URL=https://ccip-dev-minio.jerryagenyi.xyz
AWS_ACCESS_KEY_ID=ccip_minio_access
AWS_SECRET_ACCESS_KEY=S4@bT7!kW9*mL2p
AWS_BUCKET=ccip-dev-storage

# Frontend
VITE_API_URL=https://ccip-dev-api.jerryagenyi.xyz/api
VITE_APP_URL=https://ccip-dev.jerryagenyi.xyz

# Security
SANCTUM_STATEFUL_DOMAINS=ccip-dev-api.jerryagenyi.xyz,ccip-dev.jerryagenyi.xyz
SESSION_DOMAIN=jerryagenyi.xyz
JWT_SECRET=tG3&bH6!jZ9*pM4n
```

### Step 4: Configure Domains (IMPORTANT!)

**Note**: Traefik labels in `docker-compose.dev.yml` handle routing automatically. You just need to add the domains in Dokploy UI so Traefik can recognize them.

In Dokploy UI → **Domains**, add:

1. **Frontend Domain**: `ccip-dev.jerryagenyi.xyz`
   - Service: `frontend`
   - Port: `80`
   - HTTPS: Enabled (Let's Encrypt)

2. **Backend API Domain**: `ccip-dev-api.jerryagenyi.xyz`
   - Service: `backend`
   - Port: `80`
   - HTTPS: Enabled (Let's Encrypt)

3. **MinIO Console Domain**: `ccip-dev-minio.jerryagenyi.xyz`
   - Service: `minio`
   - Port: `9001`
   - HTTPS: Enabled (Let's Encrypt)

### Step 5: Deploy

1. Click **Deploy** in Dokploy
2. Dokploy will pull the `dev` branch
3. Build Docker images using `Dockerfile.prod`
4. Start services with project name `ccip-dev`
5. Traefik will automatically route requests based on domain names

### Verify Deployment

- **Frontend**: https://ccip-dev.jerryagenyi.xyz
- **Backend API**: https://ccip-dev-api.jerryagenyi.xyz/api/v1
- **MinIO Console**: https://ccip-dev-minio.jerryagenyi.xyz

---

## Production Deployment (Dokploy - Main Branch)

### Prerequisites

- Dokploy server accessible (different from dev)
- Git repository with `main` branch
- DNS records configured (see DNS section below)
- Strong production passwords/secrets generated

### Step 1: Create Dokploy Application

In Dokploy UI:

1. Go to **Projects** → **New Project**
2. Name: `ccip-prod`
3. Git Repository: Select your CCIP repository
4. Branch: `main`
5. Build Type: Docker Compose

### Step 2: Configure Docker Compose

**Project Name**: `ccip-prod`
**Compose Command**: 
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml -p ccip-prod up -d
```

### Step 3: Add Environment Variables

Use values from `.env.production.example` as a template, but replace with **actual production values**:

```bash
# Application
APP_NAME=CCIP
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ccip-api.jerryagenyi.xyz
APP_KEY=base64:YOUR_GENERATED_KEY_HERE

# Database
DB_DATABASE=ccip_production
DB_USERNAME=ccip_user
DB_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

# Redis
REDIS_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
MINIO_CONSOLE_URL=https://ccip-minio.jerryagenyi.xyz
AWS_ACCESS_KEY_ID=CHANGE_THIS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=CHANGE_THIS_SECRET_KEY
AWS_BUCKET=ccip-storage

# Frontend
VITE_API_URL=https://ccip-api.jerryagenyi.xyz/api
VITE_APP_URL=https://ccip.jerryagenyi.xyz

# Security
SANCTUM_STATEFUL_DOMAINS=ccip-api.jerryagenyi.xyz,ccip.jerryagenyi.xyz
SESSION_DOMAIN=jerryagenyi.xyz
JWT_SECRET=CHANGE_THIS_STRONG_SECRET
```

### Step 4: Configure Domains

In Dokploy UI → **Domains**, add:

1. **Frontend Domain**: `ccip.jerryagenyi.xyz`
   - Service: `frontend`
   - Port: `80`
   - HTTPS: Enabled (Let's Encrypt)

2. **Backend API Domain**: `ccip-api.jerryagenyi.xyz`
   - Service: `backend`
   - Port: `80`
   - HTTPS: Enabled (Let's Encrypt)

3. **MinIO Console Domain**: `ccip-minio.jerryagenyi.xyz`
   - Service: `minio`
   - Port: `9001`
   - HTTPS: Enabled (Let's Encrypt)

### Step 5: Deploy

1. Click **Deploy** in Dokploy
2. Verify services are healthy
3. Test all endpoints

### Verify Deployment

- **Frontend**: https://ccip.jerryagenyi.xyz
- **Backend API**: https://ccip-api.jerryagenyi.xyz/api/v1
- **MinIO Console**: https://ccip-minio.jerryagenyi.xyz

---

## DNS Configuration

### Dev/Staging Environment

Create the following DNS A records (pointing to your Dokploy dev server IP):

| Type | Name | Value |
|------|------|-------|
| A | ccip-dev | YOUR_DOKPLOY_DEV_IP |
| A | ccip-dev-api | YOUR_DOKPLOY_DEV_IP |
| A | ccip-dev-minio | YOUR_DOKPLOY_DEV_IP |

### Production Environment

Create the following DNS A records (pointing to your Dokploy production server IP):

| Type | Name | Value |
|------|------|-------|
| A | ccip | YOUR_DOKPLOY_PROD_IP |
| A | ccip-api | YOUR_DOKPLOY_PROD_IP |
| A | ccip-minio | YOUR_DOKPLOY_PROD_IP |

---

## How It Works

### Single Source of Truth

`docker-compose.yml` contains the base service definitions with environment variable placeholders.

### Docker Compose Override Precedence

Docker Compose merges multiple files **left-to-right** when you specify multiple `-f` flags:

```bash
# Final config = base.yml + override.yml + prod.yml
docker-compose -f base.yml -f override.yml -f prod.yml up
```

**Override Order (left-to-right):**

1. **docker-compose.yml** (base)
   - Base service definitions
   - Default configuration
   - Service discovery

2. **docker-compose.override.yml** OR **docker-compose.dev.yml** / **docker-compose.prod.yml**
   - Overrides base values
   - Adds environment-specific labels
   - Modifies volumes/networks

3. **Later files override earlier files**
   - If both base and override set `APP_DEBUG`, override wins
   - Labels are additive (merged, not replaced)
   - Environment variables are additive (merged, not replaced)

**Example - Backend Service:**

```yaml
# docker-compose.yml (base)
backend:
  environment:
    APP_ENV: ${APP_ENV:-local}
    APP_DEBUG: ${APP_DEBUG:-true}
  volumes:
    - backend_storage:/var/www/html/storage

# docker-compose.prod.yml (override)
backend:
  environment:
    APP_ENV: production      # Overrides base
    APP_DEBUG: "false"       # Overrides base
    APP_URL: "https://..."   # Added (not in base)
  labels:                    # Added (not in base)
    - "traefik.enable=true"
  volumes:
    - backend_storage:/var/www/html/storage  # Same as base (kept)
```

**Result:** Production values for APP_ENV and APP_DEBUG, plus new labels and APP_URL.

### Environment-Specific Overrides

- **docker-compose.override.yml** - Automatically loaded for local dev
- **docker-compose.dev.yml** - Dev deployment (manual flag)
- **docker-compose.prod.yml** - Production deployment (manual flag)

### Docker Compose Project Names

Using `-p ccip-dev` vs `-p ccip-prod` ensures:
- **Isolated containers**: Dev and production containers don't interfere
- **Isolated volumes**: `ccip-dev_postgres_data` vs `ccip-prod_postgres_data`
- **Can run simultaneously**: Both environments can exist on the same server

### Traefik Routing

Traefik routes requests based on domain names in service labels:

**Dev Labels** (docker-compose.dev.yml):
```yaml
labels:
  - "traefik.http.routers.ccip-dev-backend-websecure.rule=Host(`ccip-dev-api.jerryagenyi.xyz`)"
  - "traefik.http.routers.ccip-dev-frontend-websecure.rule=Host(`ccip-dev.jerryagenyi.xyz`)"
```

**Production Labels** (docker-compose.prod.yml):
```yaml
labels:
  - "traefik.http.routers.ccip-backend-websecure.rule=Host(`ccip-api.jerryagenyi.xyz`)"
  - "traefik.http.routers.ccip-frontend-websecure.rule=Host(`ccip.jerryagenyi.xyz`)"
```

When a request comes in, Traefik:
1. Checks the `Host` header
2. Matches it to the appropriate router rule
3. Routes to the correct service container
4. Handles SSL/TLS with Let's Encrypt

---

## Troubleshooting

### Check Service Status

```bash
# Dev deployment
docker-compose -p ccip-dev ps

# Production deployment
docker-compose -p ccip-prod ps
```

### View Service Logs

```bash
# Dev deployment
docker-compose -p ccip-dev logs -f backend

# Production deployment
docker-compose -p ccip-prod logs -f frontend
```

### Restart Services

In Dokploy UI:
1. Go to **Projects** → **ccip-dev** or **ccip-prod**
2. Click **Restart**

Or via SSH on the server:
```bash
# Dev
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -p ccip-dev restart backend

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml -p ccip-prod restart frontend
```

### Database Connection Issues

Check database is healthy:
```bash
# Dev
docker-compose -p ccip-dev logs database

# Production
docker-compose -p ccip-prod logs database
```

### Clear Caches

```bash
# Backend cache
docker-compose -p ccip-dev exec backend php artisan cache:clear
docker-compose -p ccip-dev exec backend php artisan config:clear

# Production
docker-compose -p ccip-prod exec backend php artisan cache:clear
docker-compose -p ccip-prod exec backend php artisan config:clear
```

---

## Security Best Practices

1. **Never commit `.env.production`** with actual secrets
2. **Use strong passwords** for production (generate with `openssl rand -base64 32`)
3. **Rotate secrets regularly** (database passwords, JWT secrets, API keys)
4. **Keep `APP_DEBUG=false`** in production
5. **Use HTTPS only** (Cloudflare handles SSL termination)
6. **Restrict database access** (don't expose PostgreSQL port externally)
7. **Monitor logs** for suspicious activity
8. **Backup database regularly** (postgres_backups volume)

---

## Summary

- **Local Dev**: `docker-compose up` (uses docker-compose.override.yml)
- **Dev Deployment**: Dokploy with `-f docker-compose.dev.yml -p ccip-dev`
- **Production**: Dokploy with `-f docker-compose.prod.yml -p ccip-prod`
- **Isolation**: Project names (-p flag) prevent conflicts
- **Routing**: Traefik routes based on domain names in labels
- **Configuration**: Environment variables in Dokploy UI
