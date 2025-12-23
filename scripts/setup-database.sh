#!/bin/bash

echo "=== CCIP Production Database Setup ==="
echo "This script will initialize and set up your production database"
echo "Make sure you're running this on your VPS where Docker is running"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if backend container is running
if ! docker ps | grep ccip-backend > /dev/null; then
    echo "❌ ccip-backend container is not running."
    echo "Please start your services in Dokploy first."
    exit 1
fi

echo "✅ ccip-backend container is running"

# Check database connection
echo ""
echo "🔍 Checking database connection..."
if docker exec ccip-backend php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection: OK';" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check migration status
echo ""
echo "🔍 Checking migration status..."
MIGRATION_STATUS=$(docker exec ccip-backend php artisan migrate:status --no-ansi)

if echo "$MIGRATION_STATUS" | grep -q "No migrations run"; then
    echo "📝 No migrations found. Running fresh migrations..."
    docker exec ccip-backend php artisan migrate:fresh --force
    echo "✅ Fresh migrations completed"
elif echo "$MIGRATION_STATUS" | grep -q "Pending"; then
    echo "📝 Pending migrations found. Running migrations..."
    docker exec ccip-backend php artisan migrate --force
    echo "✅ Migrations completed"
else
    echo "✅ All migrations are up to date"
fi

# Check if we should run seeders
echo ""
read -p "🌱 Run database seeders? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Running database seeders..."
    docker exec ccip-backend php artisan db:seed --force
    echo "✅ Database seeders completed"
fi

# Clear caches
echo ""
echo "🧹 Clearing application caches..."
docker exec ccip-backend php artisan cache:clear
docker exec ccip-backend php artisan config:clear
docker exec ccip-backend php artisan route:clear
docker exec ccip-backend php artisan view:clear
echo "✅ Caches cleared"

# Create storage link
echo ""
echo "🔗 Creating storage link..."
docker exec ccip-backend php artisan storage:link
echo "✅ Storage link created"

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Test your API: curl https://api.ccip.jerryagenyi.xyz/api/health"
echo "2. Check your frontend: https://ccip.jerryagenyi.xyz"
echo "3. Set up admin user if needed"