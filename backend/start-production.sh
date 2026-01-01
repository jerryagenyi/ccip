#!/bin/sh
# Production startup script for Laravel backend
# Runs all necessary initialization commands before starting services

set -e

echo "=== CCIP Backend Production Startup ==="
echo "Starting initialization at $(date)"

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan tinker --execute="DB::connection()->getPdo();" > /dev/null 2>&1; do
    echo "Database not ready, waiting 2 seconds..."
    sleep 2
done
echo "✅ Database connection established"

# Wait for Redis to be ready (simple check - try to set a test key)
echo "Waiting for Redis connection..."
until php artisan tinker --execute="Cache::put('test', 'ok', 1);" > /dev/null 2>&1; do
    echo "Redis not ready, waiting 2 seconds..."
    sleep 2
done
echo "✅ Redis connection established"

# Set proper permissions
echo "Setting storage permissions..."
chmod -R 755 /var/www/html/storage
chmod -R 755 /var/www/html/bootstrap/cache
echo "✅ Permissions set"

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force || echo "⚠️ Migration failed, continuing..."
echo "✅ Migrations completed"

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

