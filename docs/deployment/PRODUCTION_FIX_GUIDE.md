# Production Fix Guide - Blank Frontend & 500 Backend Error

## Issues Identified

1. **Backend 500 Error**: Backend container not running migrations or clearing caches on startup
2. **Frontend Blank Page**: Possible build or deployment issue

## Fixes Applied

### Backend Fixes

1. **Created `backend/start-production.sh`** - Startup script that:
   - Waits for database and Redis to be ready
   - Runs database migrations
   - Clears and caches config, routes, and views
   - Creates storage symlink
   - Optimizes autoloader
   - Starts PHP-FPM and Nginx

2. **Updated `backend/Dockerfile.prod`** - Now uses the startup script

3. **Updated `docker-compose.production.yml`** - Removed `user: "www-data:www-data"` restriction to allow migrations

### Frontend Status

The frontend Dockerfile looks correct. The blank page might be due to:
- Build failure during deployment
- Missing environment variables in build
- Nginx configuration issue

## Deployment Steps

### 1. Commit and Push Changes

```bash
git add backend/start-production.sh backend/Dockerfile.prod docker-compose.production.yml
git commit -m "fix: add backend startup script for production migrations and caching"
git push origin main
```

### 2. In Dokploy Dashboard

1. **Go to your project** → Docker Compose application
2. **Click "Redeploy"** or trigger a new deployment
3. **Monitor the logs** for:
   - Backend: Should see "CCIP Backend Production Startup" messages
   - Frontend: Should see build completion messages

### 3. Check Backend Logs

After deployment, check backend container logs:

```bash
# In Dokploy terminal or SSH to VPS
docker logs <backend-container-name> | tail -50
```

You should see:
```
=== CCIP Backend Production Startup ===
✅ Database connection established
✅ Redis connection established
✅ Migrations completed
✅ Configuration cached
...
```

### 4. Check Frontend Logs

```bash
docker logs <frontend-container-name> | tail -50
```

Look for:
- Build success messages
- Nginx startup
- File verification messages

### 5. Verify Services

**Backend Health Check:**
```bash
curl -I https://ccip-api.jerryagenyi.xyz/api/v1/health
# Or check a simple endpoint
curl https://ccip-api.jerryagenyi.xyz/api/v1
```

**Frontend Health Check:**
```bash
curl -I https://ccip.jerryagenyi.xyz
# Should return 200 OK with HTML content
```

## Troubleshooting

### Backend Still Shows 500 Error

1. **Check database connection:**
   ```bash
   docker exec <backend-container> php artisan tinker
   # Then run: DB::connection()->getPdo();
   ```

2. **Check Laravel logs:**
   ```bash
   docker exec <backend-container> tail -50 /var/www/html/storage/logs/laravel.log
   ```

3. **Verify environment variables:**
   ```bash
   docker exec <backend-container> php artisan config:show
   ```

4. **Run migrations manually:**
   ```bash
   docker exec <backend-container> php artisan migrate --force
   ```

### Frontend Still Blank

1. **Check if files exist:**
   ```bash
   docker exec <frontend-container> ls -la /usr/share/nginx/html/
   # Should see index.html and other assets
   ```

2. **Check nginx error logs:**
   ```bash
   docker exec <frontend-container> cat /var/log/nginx/error.log
   ```

3. **Verify build output:**
   ```bash
   docker exec <frontend-container> cat /usr/share/nginx/html/index.html | head -20
   ```

4. **Check nginx config:**
   ```bash
   docker exec <frontend-container> nginx -t
   ```

5. **Rebuild frontend manually:**
   - In Dokploy, go to frontend service
   - Click "Rebuild" or trigger a new deployment
   - Check build logs for errors

### Common Issues

**Issue: "Database connection refused"**
- Check database container is running: `docker ps | grep database`
- Verify DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD in environment variables
- Check network connectivity: `docker network inspect dokploy-network`

**Issue: "Redis connection failed"**
- Check Redis container: `docker ps | grep redis`
- Verify REDIS_PASSWORD matches in both backend and Redis containers
- Test connection: `docker exec <backend-container> php artisan tinker` then `Cache::put('test', 'ok')`

**Issue: "Permission denied"**
- Storage directory permissions: `docker exec <backend-container> ls -la /var/www/html/storage`
- Should be owned by www-data: `chown -R www-data:www-data /var/www/html/storage`

**Issue: "Migration failed"**
- Check database exists: `docker exec <database-container> psql -U ccip_user -l`
- Check user permissions: `docker exec <database-container> psql -U ccip_user -d ccip_production -c "\du"`

## Next Steps After Fix

1. ✅ Verify backend API responds correctly
2. ✅ Verify frontend loads and displays correctly
3. ✅ Test authentication flow
4. ✅ Monitor logs for any errors
5. ✅ Set up health check monitoring

## Prevention

To prevent these issues in the future:

1. **Always run migrations on startup** (now handled by startup script)
2. **Clear caches on deployment** (now handled by startup script)
3. **Monitor container logs** after each deployment
4. **Set up health checks** in Dokploy
5. **Test deployments** in staging before production

