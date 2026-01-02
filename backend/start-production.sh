#!/bin/sh
# Production startup script for Laravel backend
# Runs all necessary initialization commands before starting services

# Don't use set -e - we want to continue even if some commands fail
# set -e

echo "=== CCIP Backend Production Startup ==="
echo "Starting initialization at $(date)"

# Wait for database to be ready (with timeout)
echo "Waiting for database connection..."
MAX_DB_WAIT=60
DB_WAIT_COUNT=0
until php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'OK'; } catch (Exception \$e) { exit(1); }" > /dev/null 2>&1; do
    DB_WAIT_COUNT=$((DB_WAIT_COUNT + 1))
    if [ $DB_WAIT_COUNT -ge $MAX_DB_WAIT ]; then
        echo "❌ Database connection timeout after $MAX_DB_WAIT attempts"
        echo "⚠️ Continuing anyway - migrations may fail"
        break
    fi
    echo "Database not ready, waiting 2 seconds... ($DB_WAIT_COUNT/$MAX_DB_WAIT)"
    sleep 2
done
if [ $DB_WAIT_COUNT -lt $MAX_DB_WAIT ]; then
    echo "✅ Database connection established"
fi

# Wait for Redis to be ready (with timeout)
echo "Waiting for Redis connection..."
MAX_REDIS_WAIT=30
REDIS_WAIT_COUNT=0
until php artisan tinker --execute="try { Cache::put('test', 'ok', 1); echo 'OK'; } catch (Exception \$e) { exit(1); }" > /dev/null 2>&1; do
    REDIS_WAIT_COUNT=$((REDIS_WAIT_COUNT + 1))
    if [ $REDIS_WAIT_COUNT -ge $MAX_REDIS_WAIT ]; then
        echo "❌ Redis connection timeout after $MAX_REDIS_WAIT attempts"
        echo "⚠️ Continuing anyway - cache may not work"
        break
    fi
    echo "Redis not ready, waiting 2 seconds... ($REDIS_WAIT_COUNT/$MAX_REDIS_WAIT)"
    sleep 2
done
if [ $REDIS_WAIT_COUNT -lt $MAX_REDIS_WAIT ]; then
    echo "✅ Redis connection established"
fi

# Set proper permissions
echo "Setting storage permissions..."
chmod -R 755 /var/www/html/storage
chmod -R 755 /var/www/html/bootstrap/cache
echo "✅ Permissions set"

# Run database migrations
echo "Running database migrations..."
if php artisan migrate --force; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️ Migration failed - check logs"
    # Show migration status for debugging
    php artisan migrate:status || true
fi

# Clear and cache configuration
echo "Clearing and caching configuration..."
php artisan config:clear || true
php artisan config:cache || true
echo "✅ Configuration cached"

# Clear and cache routes
echo "Clearing and caching routes..."
php artisan route:clear || true
php artisan route:cache || true
echo "✅ Routes cached"

# Clear and cache views
echo "Clearing and caching views..."
php artisan view:clear || true
php artisan view:cache || true
echo "✅ Views cached"

# Clear application cache
echo "Clearing application cache..."
php artisan cache:clear || true
echo "✅ Application cache cleared"

# Create storage link
echo "Creating storage symlink..."
php artisan storage:link || echo "⚠️ Storage link already exists or failed"
echo "✅ Storage link created"

# Optimize autoloader
echo "Optimizing autoloader..."
composer dump-autoload --optimize --no-dev || true
echo "✅ Autoloader optimized"

echo ""
echo "=== Initialization Complete ==="
echo "Starting PHP-FPM and Nginx..."

# Change ownership of storage and cache to www-data for runtime
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache

# Start PHP-FPM in background (as root, but PHP-FPM will drop to www-data)
php-fpm -D

# Start Nginx in foreground (as root, but Nginx will drop to nginx user)
exec nginx -g "daemon off;"

