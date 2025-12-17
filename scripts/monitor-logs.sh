#!/bin/bash

echo "=== CCIP Service Log Monitoring ==="
echo "Monitoring and analyzing service logs"
echo ""

# Container names
FRONTEND_CONTAINER="ccip_frontend"
BACKEND_CONTAINER="ccip_backend"
DATABASE_CONTAINER="ccip_database"
REDIS_CONTAINER="ccip_redis"
MINIO_CONTAINER="ccip_minio"

# Function to show container logs
show_container_logs() {
    local container=$1
    local service_name=$2
    local lines=${3:-50}

    echo ""
    echo "🔍 === $service_name Logs (Last $lines lines) ==="

    if ! docker ps | grep $container > /dev/null; then
        echo "❌ Container $container is not running"
        return 1
    fi

    docker logs --tail $lines $container 2>&1 | head -100
    echo ""
}

# Function to check for errors
check_for_errors() {
    local container=$1
    local service_name=$2

    echo "🚨 === Error Check for $service_name ==="

    if ! docker ps | grep $container > /dev/null; then
        echo "❌ Container $container is not running"
        return 1
    fi

    # Look for common error patterns
    ERRORS=$(docker logs $container 2>&1 | grep -i -E "(error|exception|fatal|failed|critical|panic)" | tail -20)

    if [[ -n "$ERRORS" ]]; then
        echo "⚠️  Found potential errors in $service_name:"
        echo "$ERRORS"
    else
        echo "✅ No critical errors found in recent logs"
    fi
    echo ""
}

# Function to show container status
show_container_status() {
    echo "📊 === Container Status Overview ==="

    echo "Container Status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAME|ccip)"

    echo ""
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep -E "(CONTAINER|ccip)"

    echo ""
}

# Function to check Laravel specific logs
check_laravel_logs() {
    echo "📋 === Laravel Application Logs ==="

    if ! docker ps | grep $BACKEND_CONTAINER > /dev/null; then
        echo "❌ Backend container is not running"
        return 1
    fi

    # Check Laravel log file
    echo "📝 Laravel storage/logs content:"
    docker exec $BACKEND_CONTAINER ls -la storage/logs/ 2>/dev/null || echo "No logs directory found"

    # Check latest Laravel log if it exists
    LATEST_LOG=$(docker exec $BACKEND_CONTAINER ls -t storage/logs/ 2>/dev/null | head -1 | awk '{print $NF}')
    if [[ -n "$LATEST_LOG" && "$LATEST_LOG" != "" ]]; then
        echo ""
        echo "🔍 Latest Laravel log ($LATEST_LOG) - Last 20 lines:"
        docker exec $BACKEND_CONTAINER tail -20 storage/logs/$LATEST_LOG 2>/dev/null || echo "Could not read log file"
    fi

    echo ""
}

# Function to show disk usage
show_disk_usage() {
    echo "💾 === Disk Usage Analysis ==="

    echo "Container volume usage:"
    docker exec $DATABASE_CONTAINER df -h /var/lib/postgresql/data 2>/dev/null || echo "Could not check database volume"
    docker exec $REDIS_CONTAINER df -h /data 2>/dev/null || echo "Could not check Redis volume"
    docker exec $MINIO_CONTAINER df -h /data 2>/dev/null || echo "Could not check MinIO volume"

    echo ""
    echo "Backend storage usage:"
    docker exec $BACKEND_CONTAINER du -sh storage/ 2>/dev/null || echo "Could not check backend storage"

    echo ""
}

# Main menu
echo "Select monitoring option:"
echo "1. Show all container logs"
echo "2. Check for errors in all containers"
echo "3. Show container status and resource usage"
echo "4. Check Laravel application logs"
echo "5. Show disk usage"
echo "6. Monitor specific container"
echo "7. Full comprehensive report"
echo ""
read -p "Enter choice (1-7): " choice

case $choice in
    1)
        echo "Showing all container logs..."
        show_container_logs "$FRONTEND_CONTAINER" "Frontend" 30
        show_container_logs "$BACKEND_CONTAINER" "Backend" 50
        show_container_logs "$DATABASE_CONTAINER" "Database" 30
        show_container_logs "$REDIS_CONTAINER" "Redis" 30
        show_container_logs "$MINIO_CONTAINER" "MinIO" 30
        ;;
    2)
        echo "Checking for errors..."
        check_for_errors "$FRONTEND_CONTAINER" "Frontend"
        check_for_errors "$BACKEND_CONTAINER" "Backend"
        check_for_errors "$DATABASE_CONTAINER" "Database"
        check_for_errors "$REDIS_CONTAINER" "Redis"
        check_for_errors "$MINIO_CONTAINER" "MinIO"
        ;;
    3)
        show_container_status
        ;;
    4)
        check_laravel_logs
        ;;
    5)
        show_disk_usage
        ;;
    6)
        echo "Available containers:"
        echo "1. Frontend ($FRONTEND_CONTAINER)"
        echo "2. Backend ($BACKEND_CONTAINER)"
        echo "3. Database ($DATABASE_CONTAINER)"
        echo "4. Redis ($REDIS_CONTAINER)"
        echo "5. MinIO ($MINIO_CONTAINER)"
        echo ""
        read -p "Select container (1-5): " subchoice

        case $subchoice in
            1) show_container_logs "$FRONTEND_CONTAINER" "Frontend" 100 ;;
            2) show_container_logs "$BACKEND_CONTAINER" "Backend" 100 ;;
            3) show_container_logs "$DATABASE_CONTAINER" "Database" 100 ;;
            4) show_container_logs "$REDIS_CONTAINER" "Redis" 100 ;;
            5) show_container_logs "$MINIO_CONTAINER" "MinIO" 100 ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    7)
        echo "📊 === COMPREHENSIVE SYSTEM REPORT ==="
        show_container_status
        check_for_errors "$FRONTEND_CONTAINER" "Frontend"
        check_for_errors "$BACKEND_CONTAINER" "Backend"
        check_for_errors "$DATABASE_CONTAINER" "Database"
        check_for_errors "$REDIS_CONTAINER" "Redis"
        check_for_errors "$MINIO_CONTAINER" "MinIO"
        check_laravel_logs
        show_disk_usage
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🔍 For real-time log monitoring, use:"
echo "docker logs -f [container_name]"
echo ""
echo "📊 Example: docker logs -f ccip_backend"