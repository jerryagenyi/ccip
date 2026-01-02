# Production Diagnostic Commands

Use these commands to diagnose issues with your production deployment.

## Quick Diagnostics

### 1. Check Container Status

```bash
# List all containers
docker ps -a

# Check specific containers
docker ps | grep ccip
```

### 2. Check Backend Logs

```bash
# Get backend container name
BACKEND_CONTAINER=$(docker ps | grep backend | awk '{print $1}')

# View recent logs
docker logs $BACKEND_CONTAINER --tail 100

# Follow logs in real-time
docker logs $BACKEND_CONTAINER -f

# Check for errors
docker logs $BACKEND_CONTAINER 2>&1 | grep -i error
```

### 3. Check Frontend Logs

```bash
# Get frontend container name
FRONTEND_CONTAINER=$(docker ps | grep frontend | awk '{print $1}')

# View recent logs
docker logs $FRONTEND_CONTAINER --tail 100

# Check if files exist
docker exec $FRONTEND_CONTAINER ls -la /usr/share/nginx/html/
```

### 4. Test Backend Directly

```bash
# Get backend container name
BACKEND_CONTAINER=$(docker ps | grep backend | awk '{print $1}')

# Test database connection
docker exec $BACKEND_CONTAINER php artisan tinker --execute="DB::connection()->getPdo(); echo 'DB OK';"

# Test Redis connection
docker exec $BACKEND_CONTAINER php artisan tinker --execute="Cache::put('test', 'ok', 1); echo 'Redis OK';"

# Check Laravel logs
docker exec $BACKEND_CONTAINER tail -50 /var/www/html/storage/logs/laravel.log

# Check environment
docker exec $BACKEND_CONTAINER php artisan config:show app

# Test routes
docker exec $BACKEND_CONTAINER php artisan route:list | head -20
```

### 5. Test Frontend Directly

```bash
# Get frontend container name
FRONTEND_CONTAINER=$(docker ps | grep frontend | awk '{print $1}')

# Check nginx config
docker exec $FRONTEND_CONTAINER nginx -t

# Check if index.html exists
docker exec $FRONTEND_CONTAINER cat /usr/share/nginx/html/index.html | head -20

# Check nginx error logs
docker exec $FRONTEND_CONTAINER cat /var/log/nginx/error.log
```

### 6. Network Diagnostics

```bash
# Check if containers can communicate
docker network inspect dokploy-network

# Test database from backend
docker exec $(docker ps | grep backend | awk '{print $1}') ping -c 2 database

# Test Redis from backend
docker exec $(docker ps | grep backend | awk '{print $1}') ping -c 2 redis
```

### 7. Check Environment Variables

```bash
# Backend environment
docker exec $(docker ps | grep backend | awk '{print $1}') env | grep -E "DB_|APP_|REDIS_"

# Frontend environment (build-time)
# Check docker-compose.production.yml for VITE_ variables
```

## Common Issues & Solutions

### Backend 500 Error

**Check Laravel logs:**
```bash
docker exec $(docker ps | grep backend | awk '{print $1}') tail -100 /var/www/html/storage/logs/laravel.log
```

**Common causes:**
1. Database connection failed - Check DB_* environment variables
2. Missing APP_KEY - Run `php artisan key:generate`
3. Storage permissions - Check `/var/www/html/storage` permissions
4. Missing migrations - Run `php artisan migrate --force`

**Fix storage permissions:**
```bash
docker exec $(docker ps | grep backend | awk '{print $1}') chmod -R 755 /var/www/html/storage
docker exec $(docker ps | grep backend | awk '{print $1}') chown -R www-data:www-data /var/www/html/storage
```

### Frontend Blank Page

**Check if build succeeded:**
```bash
docker exec $(docker ps | grep frontend | awk '{print $1}') ls -la /usr/share/nginx/html/
```

**Check nginx error logs:**
```bash
docker exec $(docker ps | grep frontend | awk '{print $1}') cat /var/log/nginx/error.log
```

**Common causes:**
1. Build failed - Check build logs in Dokploy
2. Missing index.html - Rebuild frontend
3. Nginx config error - Check `nginx -t`
4. Wrong file paths - Verify dist/spa files copied correctly

**Rebuild frontend:**
- In Dokploy, go to frontend service → Rebuild

### Database Connection Issues

**Test connection:**
```bash
docker exec $(docker ps | grep database | awk '{print $1}') psql -U ccip_user -d ccip_production -c "SELECT 1;"
```

**Check if database exists:**
```bash
docker exec $(docker ps | grep database | awk '{print $1}') psql -U ccip_user -l
```

**Check backend can reach database:**
```bash
docker exec $(docker ps | grep backend | awk '{print $1}') php artisan tinker --execute="DB::connection()->getPdo();"
```

### Redis Connection Issues

**Test Redis:**
```bash
docker exec $(docker ps | grep redis | awk '{print $1}') redis-cli ping
```

**Test from backend:**
```bash
docker exec $(docker ps | grep backend | awk '{print $1}') php artisan tinker --execute="Cache::put('test', 'ok', 1);"
```

## Manual Fixes

### Run Migrations Manually

```bash
docker exec $(docker ps | grep backend | awk '{print $1}') php artisan migrate --force
```

### Clear All Caches

```bash
BACKEND=$(docker ps | grep backend | awk '{print $1}')
docker exec $BACKEND php artisan config:clear
docker exec $BACKEND php artisan route:clear
docker exec $BACKEND php artisan view:clear
docker exec $BACKEND php artisan cache:clear
```

### Rebuild Caches

```bash
BACKEND=$(docker ps | grep backend | awk '{print $1}')
docker exec $BACKEND php artisan config:cache
docker exec $BACKEND php artisan route:cache
docker exec $BACKEND php artisan view:cache
```

### Create Storage Link

```bash
docker exec $(docker ps | grep backend | awk '{print $1}') php artisan storage:link
```

## Health Check Endpoints

Test these endpoints to verify services:

```bash
# Backend root
curl https://ccip-api.jerryagenyi.xyz/

# Backend health
curl https://ccip-api.jerryagenyi.xyz/api/v1/system/health

# Frontend
curl -I https://ccip.jerryagenyi.xyz
```

## Full Diagnostic Script

Run this to get a complete diagnostic report:

```bash
#!/bin/bash
echo "=== CCIP Production Diagnostics ==="
echo ""
echo "1. Container Status:"
docker ps | grep ccip
echo ""
echo "2. Backend Logs (last 20 lines):"
docker logs $(docker ps | grep backend | awk '{print $1}') --tail 20
echo ""
echo "3. Frontend Logs (last 20 lines):"
docker logs $(docker ps | grep frontend | awk '{print $1}') --tail 20
echo ""
echo "4. Backend Health:"
curl -s https://ccip-api.jerryagenyi.xyz/api/v1/system/health || echo "Backend not responding"
echo ""
echo "5. Frontend Status:"
curl -I https://ccip.jerryagenyi.xyz 2>&1 | head -5
```

