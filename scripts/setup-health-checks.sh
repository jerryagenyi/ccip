#!/bin/bash

echo "=== Enhanced Health Checks Setup ==="
echo "Configuring comprehensive health monitoring for CCIP services"
echo ""

# Create health check scripts for each service
HEALTH_DIR="/usr/local/bin/ccip-health"
mkdir -p "$HEALTH_DIR"

echo "📁 Creating health check scripts in $HEALTH_DIR"

# Backend health check script
cat > "$HEALTH_DIR/check-backend.sh" << 'EOF'
#!/bin/bash

# Backend Health Check
BACKEND_CONTAINER="ccip_backend"
API_URL="http://localhost:9000"
HEALTH_ENDPOINT="$API_URL/api/health"

echo "=== Backend Health Check ==="
echo "Timestamp: $(date)"

# Check if container is running
if ! docker ps | grep -q $BACKEND_CONTAINER; then
    echo "❌ Backend container is not running"
    exit 1
fi

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $BACKEND_CONTAINER)
echo "Container Status: $CONTAINER_STATUS"

# Check if container is healthy
HEALTH_STATUS=$(docker inspect -f '{{.State.Health.Status}}' $BACKEND_CONTAINER 2>/dev/null || echo "no-healthcheck")
echo "Health Check Status: $HEALTH_STATUS"

# Check Laravel application
echo ""
echo "🔍 Laravel Application Health:"

# Test if PHP is working
PHP_TEST=$(docker exec $BACKEND_CONTAINER php -v 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ PHP is working"
    echo "   Version: $(echo "$PHP_TEST" | head -1)"
else
    echo "❌ PHP is not working"
fi

# Test database connection
DB_TEST=$(docker exec $BACKEND_CONTAINER php artisan tinker --execute="DB::connection()->getPdo(); echo 'DB_OK';" 2>/dev/null)
if [[ "$DB_TEST" == *"DB_OK"* ]]; then
    echo "✅ Database connection is working"
else
    echo "❌ Database connection failed"
fi

# Test Redis connection
REDIS_TEST=$(docker exec $BACKEND_CONTAINER php artisan tinker --execute="Redis::ping(); echo 'REDIS_OK';" 2>/dev/null)
if [[ "$REDIS_TEST" == *"REDIS_OK"* ]]; then
    echo "✅ Redis connection is working"
else
    echo "❌ Redis connection failed"
fi

# Test cache functionality
CACHE_TEST=$(docker exec $BACKEND_CONTAINER php artisan tinker --execute="Cache::put('health_test', 'ok', 60); echo Cache::get('health_test');" 2>/dev/null)
if [[ "$CACHE_TEST" == "ok" ]]; then
    echo "✅ Cache functionality is working"
else
    echo "❌ Cache functionality failed"
fi

# Check storage
echo ""
echo "💾 Storage Status:"
STORAGE_WRITABLE=$(docker exec $BACKEND_CONTAINER php artisan tinker --execute="echo Storage::put('health_test.txt', 'test') ? 'WRITABLE' : 'NOT_WRITABLE';" 2>/dev/null)
if [[ "$STORAGE_WRITABLE" == "WRITABLE" ]]; then
    echo "✅ Storage is writable"
    docker exec $BACKEND_CONTAINER php artisan tinker --execute="Storage::delete('health_test.txt');" > /dev/null
else
    echo "❌ Storage is not writable"
fi

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $BACKEND_CONTAINER)
echo "Memory Usage: $MEMORY_USAGE"

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $BACKEND_CONTAINER)
echo "CPU Usage: $CPU_USAGE"

echo ""
echo "🏥 Backend Health Check Completed"
EOF

chmod +x "$HEALTH_DIR/check-backend.sh"

# Frontend health check script
cat > "$HEALTH_DIR/check-frontend.sh" << 'EOF'
#!/bin/bash

# Frontend Health Check
FRONTEND_CONTAINER="ccip_frontend"

echo "=== Frontend Health Check ==="
echo "Timestamp: $(date)"

# Check if container is running
if ! docker ps | grep -q $FRONTEND_CONTAINER; then
    echo "❌ Frontend container is not running"
    exit 1
fi

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $FRONTEND_CONTAINER)
echo "Container Status: $CONTAINER_STATUS"

# Check nginx status
NGINX_STATUS=$(docker exec $FRONTEND_CONTAINER nginx -t 2>&1)
if [[ "$NGINX_STATUS" == *"successful"* ]]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has issues"
    echo "$NGINX_STATUS"
fi

# Check if nginx is running
NGINX_PROCESS=$(docker exec $FRONTEND_CONTAINER pgrep nginx | wc -l)
if [[ $NGINX_PROCESS -gt 0 ]]; then
    echo "✅ Nginx is running ($NGINX_PROCESS processes)"
else
    echo "❌ Nginx is not running"
fi

# Test web server response
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null)
if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ Web server is responding (HTTP $HTTP_STATUS)"
else
    echo "❌ Web server is not responding (HTTP $HTTP_STATUS)"
fi

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $FRONTEND_CONTAINER)
echo "Memory Usage: $MEMORY_USAGE"

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $FRONTEND_CONTAINER)
echo "CPU Usage: $CPU_USAGE"

# Check disk space for static files
DISK_USAGE=$(docker exec $FRONTEND_CONTAINER du -sh /usr/share/nginx/html 2>/dev/null | cut -f1)
echo "Static Files Size: $DISK_USAGE"

echo ""
echo "🏥 Frontend Health Check Completed"
EOF

chmod +x "$HEALTH_DIR/check-frontend.sh"

# Database health check script
cat > "$HEALTH_DIR/check-database.sh" << 'EOF'
#!/bin/bash

# Database Health Check
DB_CONTAINER="ccip_database"

echo "=== Database Health Check ==="
echo "Timestamp: $(date)"

# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "❌ Database container is not running"
    exit 1
fi

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $DB_CONTAINER)
echo "Container Status: $CONTAINER_STATUS"

# Check PostgreSQL service
PG_STATUS=$(docker exec $DB_CONTAINER pg_isready -U ccip_user -d ccip_production)
if [[ "$PG_STATUS" == *"accepting connections"* ]]; then
    echo "✅ PostgreSQL is ready and accepting connections"
else
    echo "❌ PostgreSQL is not ready"
    echo "$PG_STATUS"
fi

# Check database size
DB_SIZE=$(docker exec $DB_CONTAINER psql -U ccip_user -d ccip_production -t -c "SELECT pg_size_pretty(pg_database_size('ccip_production'));" 2>/dev/null | xargs)
echo "Database Size: $DB_SIZE"

# Check connection count
CONNECTION_COUNT=$(docker exec $DB_CONTAINER psql -U ccip_user -d ccip_production -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | xargs)
echo "Active Connections: $CONNECTION_COUNT"

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $DB_CONTAINER)
echo "Memory Usage: $MEMORY_USAGE"

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $DB_CONTAINER)
echo "CPU Usage: $CPU_USAGE"

# Check disk usage
DISK_USAGE=$(docker exec $DB_CONTAINER df -h /var/lib/postgresql/data | tail -1 | awk '{print $5}')
echo "Disk Usage: $DISK_USAGE"

# Get database stats
echo ""
echo "📊 Database Statistics:"
docker exec $DB_CONTAINER psql -U ccip_user -d ccip_production -c "
SELECT
    schemaname as schema,
    tablename as table,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC
LIMIT 10;
" 2>/dev/null || echo "Could not fetch table statistics"

echo ""
echo "🏥 Database Health Check Completed"
EOF

chmod +x "$HEALTH_DIR/check-database.sh"

# Redis health check script
cat > "$HEALTH_DIR/check-redis.sh" << 'EOF'
#!/bin/bash

# Redis Health Check
REDIS_CONTAINER="ccip_redis"

echo "=== Redis Health Check ==="
echo "Timestamp: $(date)"

# Check if container is running
if ! docker ps | grep -q $REDIS_CONTAINER; then
    echo "❌ Redis container is not running"
    exit 1
fi

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $REDIS_CONTAINER)
echo "Container Status: $CONTAINER_STATUS"

# Test Redis connection
REDIS_PING=$(docker exec $REDIS_CONTAINER redis-cli --no-auth-warning -a rY5@kP8#mX2*wL9v ping)
if [[ "$REDIS_PING" == "PONG" ]]; then
    echo "✅ Redis is responding"
else
    echo "❌ Redis is not responding"
fi

# Get Redis info
echo ""
echo "📊 Redis Server Information:"
docker exec $REDIS_CONTAINER redis-cli --no-auth-warning -a rY5@kP8#mX2*wL9v info server | head -10

# Get memory usage
echo ""
echo "💾 Memory Information:"
docker exec $REDIS_CONTAINER redis-cli --no-auth-warning -a rY5@kP8#mX2*wL9v info memory | grep -E "(used_memory_human|maxmemory_human)"

# Get connection info
echo ""
echo "🔌 Connection Information:"
docker exec $REDIS_CONTAINER redis-cli --no-auth-warning -a rY5@kP8#mX2*wL9v info clients | grep -E "(connected_clients|blocked_clients)"

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $REDIS_CONTAINER)
echo "Container Memory Usage: $MEMORY_USAGE"

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $REDIS_CONTAINER)
echo "Container CPU Usage: $CPU_USAGE"

# Check disk usage
DISK_USAGE=$(docker exec $REDIS_CONTAINER du -sh /data | cut -f1)
echo "Data Directory Size: $DISK_USAGE"

echo ""
echo "🏥 Redis Health Check Completed"
EOF

chmod +x "$HEALTH_DIR/check-redis.sh"

# MinIO health check script
cat > "$HEALTH_DIR/check-minio.sh" << 'EOF'
#!/bin/bash

# MinIO Health Check
MINIO_CONTAINER="ccip_minio"

echo "=== MinIO Health Check ==="
echo "Timestamp: $(date)"

# Check if container is running
if ! docker ps | grep -q $MINIO_CONTAINER; then
    echo "❌ MinIO container is not running"
    exit 1
fi

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $MINIO_CONTAINER)
echo "Container Status: $CONTAINER_STATUS"

# Test MinIO service
MINIO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/minio/health/live 2>/dev/null)
if [[ "$MINIO_STATUS" == "200" ]]; then
    echo "✅ MinIO is responding"
else
    echo "❌ MinIO is not responding (HTTP $MINIO_STATUS)"
fi

# Check memory usage
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $MINIO_CONTAINER)
echo "Container Memory Usage: $MEMORY_USAGE"

# Check CPU usage
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $MINIO_CONTAINER)
echo "Container CPU Usage: $CPU_USAGE"

# Check disk usage
DISK_USAGE=$(docker exec $MINIO_CONTAINER du -sh /data | cut -f1)
echo "Data Directory Size: $DISK_USAGE"

echo ""
echo "🏥 MinIO Health Check Completed"
EOF

chmod +x "$HEALTH_DIR/check-minio.sh"

# Master health check script
cat > "$HEALTH_DIR/check-all.sh" << 'EOF'
#!/bin/bash

echo "=========================================="
echo "    CCIP Production Health Check"
echo "=========================================="
echo "Timestamp: $(date)"
echo ""

HEALTH_DIR="/usr/local/bin/ccip-health"
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to run health check and track results
run_health_check() {
    local script=$1
    local name=$2

    echo "🔍 Running $name health check..."
    echo "----------------------------------------"

    if [[ -x "$HEALTH_DIR/$script" ]]; then
        "$HEALTH_DIR/$script"
        if [[ $? -eq 0 ]]; then
            ((PASSED_CHECKS++))
            echo "✅ $name health check PASSED"
        else
            echo "❌ $name health check FAILED"
        fi
    else
        echo "❌ Health check script not found: $script"
    fi

    ((TOTAL_CHECKS++))
    echo ""
    echo "========================================"
    echo ""
}

# Run all health checks
run_health_check "check-frontend.sh" "Frontend"
run_health_check "check-backend.sh" "Backend"
run_health_check "check-database.sh" "Database"
run_health_check "check-redis.sh" "Redis"
run_health_check "check-minio.sh" "MinIO"

# Summary
echo "🏥 HEALTH CHECK SUMMARY"
echo "========================================"
echo "Total Checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $((TOTAL_CHECKS - PASSED_CHECKS))"

if [[ $PASSED_CHECKS -eq $TOTAL_CHECKS ]]; then
    echo ""
    echo "🎉 ALL SYSTEMS HEALTHY"
    exit 0
else
    echo ""
    echo "⚠️  SOME SYSTEMS NEED ATTENTION"
    exit 1
fi
EOF

chmod +x "$HEALTH_DIR/check-all.sh"

echo ""
echo "✅ Health check scripts created successfully!"
echo ""
echo "📂 Scripts location: $HEALTH_DIR"
echo ""
echo "🔧 Usage:"
echo "   Run all health checks: $HEALTH_DIR/check-all.sh"
echo "   Check specific service: $HEALTH_DIR/check-[service].sh"
echo ""
echo "⏰ To set up automated health monitoring, add to crontab:"
echo "   */5 * * * * $HEALTH_DIR/check-all.sh >> /var/log/ccip-health.log 2>&1"
echo ""
echo "📊 Health monitoring setup completed!"